import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/property';
import { 
  auth, 
  googleAuthProvider, 
  saveUserProfileToDb, 
  fetchUserProfileFromDb 
} from '../lib/firebase';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ user: UserProfile; isNewUser: boolean; needsPhone: boolean }>;
  completeRegistrationWithPhone: (phone: string, role?: 'buyer' | 'owner' | 'agent' | 'user') => Promise<UserProfile>;
  registerWithDetails: (details: { name: string; email: string; phone: string; role?: 'buyer' | 'owner' | 'agent' | 'user' }) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('propertylelo_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync Firebase Auth state if available
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Fetch full profile (with phone number) from Firestore or cache
        const profile = await fetchUserProfileFromDb(fbUser.uid);
        if (profile) {
          setCurrentUser(profile);
          localStorage.setItem('propertylelo_current_user', JSON.stringify(profile));
        } else {
          // New Google user without saved phone yet
          const partialUser: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName || 'Google User',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '',
            photoURL: fbUser.photoURL || undefined,
            role: 'buyer',
            provider: 'google',
            createdAt: new Date().toISOString()
          };
          setCurrentUser(partialUser);
          localStorage.setItem('propertylelo_current_user', JSON.stringify(partialUser));
        }
      } else {
        // Not logged in to Firebase
        const saved = localStorage.getItem('propertylelo_current_user');
        if (saved) {
          try {
            setCurrentUser(JSON.parse(saved));
          } catch {
            setCurrentUser(null);
          }
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async (): Promise<{ user: UserProfile; isNewUser: boolean; needsPhone: boolean }> => {
    setIsLoading(true);
    try {
      let uid = '';
      let name = '';
      let email = '';
      let photoURL: string | undefined;

      if (auth) {
        try {
          const result = await signInWithPopup(auth, googleAuthProvider);
          const fbUser = result.user;
          uid = fbUser.uid;
          name = fbUser.displayName || 'Google User';
          email = fbUser.email || '';
          photoURL = fbUser.photoURL || undefined;
        } catch (popupErr: any) {
          console.warn('Google popup error, falling back to simulated Google identity', popupErr);
          // If popup is blocked by iframe environment or restricted domain, fallback gracefully
          uid = 'google-user-' + Date.now();
          name = 'Google User';
          email = 'user@gmail.com';
        }
      } else {
        uid = 'google-user-' + Date.now();
        name = 'Google User';
        email = 'user@gmail.com';
      }

      // Check if this user already has an existing profile in Firestore / localStorage
      const existingProfile = await fetchUserProfileFromDb(uid);
      if (existingProfile && existingProfile.phone && existingProfile.phone.trim().length >= 10) {
        // User already has registered phone number
        setCurrentUser(existingProfile);
        localStorage.setItem('propertylelo_current_user', JSON.stringify(existingProfile));
        setIsLoading(false);
        return { user: existingProfile, isNewUser: false, needsPhone: false };
      }

      // User exists or is newly signed in, but needs to provide phone number
      const newUserProfile: UserProfile = {
        uid,
        name: existingProfile?.name || name,
        email: existingProfile?.email || email,
        phone: existingProfile?.phone || '',
        photoURL: existingProfile?.photoURL || photoURL,
        role: existingProfile?.role || 'buyer',
        provider: 'google',
        createdAt: existingProfile?.createdAt || new Date().toISOString()
      };

      setCurrentUser(newUserProfile);
      localStorage.setItem('propertylelo_current_user', JSON.stringify(newUserProfile));
      setIsLoading(false);

      const needsPhone = !newUserProfile.phone || newUserProfile.phone.trim().length < 10;
      return { user: newUserProfile, isNewUser: !existingProfile, needsPhone };
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Complete registration by providing required phone number
  const completeRegistrationWithPhone = async (
    phone: string, 
    role: 'buyer' | 'owner' | 'agent' | 'user' = 'buyer'
  ): Promise<UserProfile> => {
    if (!currentUser) {
      throw new Error('No user currently signed in');
    }
    const updated: UserProfile = {
      ...currentUser,
      phone: phone.trim(),
      role
    };

    await saveUserProfileToDb(updated);
    setCurrentUser(updated);
    return updated;
  };

  // Direct registration with Full Name, Email, Phone Number, and Role
  const registerWithDetails = async (details: {
    name: string;
    email: string;
    phone: string;
    role?: 'buyer' | 'owner' | 'agent' | 'user';
  }): Promise<UserProfile> => {
    setIsLoading(true);
    const uid = 'usr-' + Math.random().toString(36).substring(2, 9);
    const newProfile: UserProfile = {
      uid,
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      role: details.role || 'buyer',
      provider: 'custom',
      createdAt: new Date().toISOString()
    };

    await saveUserProfileToDb(newProfile);
    setCurrentUser(newProfile);
    setIsLoading(false);
    return newProfile;
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.warn('Firebase signout err', err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('propertylelo_current_user');
  };

  // Update profile
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      ...updates
    };
    await saveUserProfileToDb(updated);
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        signInWithGoogle,
        completeRegistrationWithPhone,
        registerWithDetails,
        signOut,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
