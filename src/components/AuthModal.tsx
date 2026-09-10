import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ArrowRight,
  Lock,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { 
    currentUser, 
    signInWithGoogle, 
    completeRegistrationWithPhone, 
    registerWithDetails 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'default' | 'require_phone'>('default');
  
  // Registration form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'buyer' | 'owner' | 'agent'>('buyer');
  
  // Step require_phone state for Google users
  const [pendingPhone, setPendingPhone] = useState('');
  const [pendingRole, setPendingRole] = useState<'buyer' | 'owner' | 'agent'>('buyer');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Handle Google Login / Sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { user, needsPhone } = await signInWithGoogle();
      if (needsPhone) {
        // User logged in via Google, but needs to provide phone number to complete registration
        setStep('require_phone');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        onSuccess(`Welcome back, ${user.name}! Successfully signed in with Google.`);
        onClose();
      }
    } catch (err: any) {
      console.error('Google sign-in failed', err);
      setIsLoading(false);
      setErrorMessage(err.message || 'Google sign-in encountered an issue. Please try again.');
    }
  };

  // Handle saving the required phone number for Google user
  const handleSavePhoneForGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = pendingPhone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const updated = await completeRegistrationWithPhone(`+91 ${cleanPhone.slice(-10)}`, pendingRole);
      setIsLoading(false);
      onSuccess(`Registration complete! Welcome to PropertyLelo, ${updated.name}.`);
      onClose();
      setStep('default');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Failed to save phone number.');
    }
  };

  // Handle direct registration
  const handleDirectRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    const cleanPhone = regPhone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const newUser = await registerWithDetails({
        name: regName,
        email: regEmail,
        phone: `+91 ${cleanPhone.slice(-10)}`,
        role: regRole
      });
      setIsLoading(false);
      onSuccess(`Account created! Welcome to PropertyLelo, ${newUser.name}.`);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 z-10 shadow-2xl border border-slate-100"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Branding */}
        <div className="mb-5 text-center">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {step === 'require_phone'
              ? 'Complete your profile to connect with verified buyers and sellers'
              : authMode === 'login'
              ? 'Sign in to access saved properties, inquiries, and free listings'
              : 'Create your free account on India\'s trusted real estate marketplace'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ==================================================== */}
        {/* VIEW: REQUIRE PHONE NUMBER (After Google Sign-In)   */}
        {/* ==================================================== */}
        {step === 'require_phone' ? (
          <form onSubmit={handleSavePhoneForGoogle} className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#002869] text-white font-bold flex items-center justify-center text-base">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  Welcome, {currentUser?.name || 'User'}!
                </p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mobile Number * <span className="text-[11px] font-normal text-slate-500">(Required for verified leads & OTP alerts)</span>
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#002869]">
                <span className="font-bold text-slate-600 mr-2 text-sm">🇮🇳 +91</span>
                <input
                  type="tel"
                  required
                  autoFocus
                  maxLength={10}
                  value={pendingPhone}
                  onChange={(e) => setPendingPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98123 45678"
                  className="w-full bg-transparent font-bold text-slate-900 focus:outline-none tracking-wider text-sm"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Enter your 10-digit Indian mobile number
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                I am interested in PropertyLelo as:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { key: 'buyer', label: 'Buyer / Tenant' },
                  { key: 'owner', label: 'Property Owner' },
                  { key: 'agent', label: 'Agent / Broker' },
                ].map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setPendingRole(r.key as any)}
                    className={`py-2 px-1 rounded-xl text-center font-bold border transition-all cursor-pointer text-[11px] ${
                      pendingRole === r.key
                        ? 'border-[#002869] bg-blue-50/80 text-[#002869]'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#002869] hover:bg-[#071f49] text-white font-bold shadow-md shadow-[#002869]/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <span>Saving Profile...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <>
            {/* Mode Switcher: Login vs Register */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-[#002869] shadow-xs' : 'text-slate-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'register' ? 'bg-white text-[#002869] shadow-xs' : 'text-slate-600'
                }`}
              >
                Register (New User)
              </button>
            </div>

            {/* ==================================================== */}
            {/* VIEW: LOGIN (Google Sign-In Only)                    */}
            {/* ==================================================== */}
            {authMode === 'login' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">
                    Sign in with your Google account for quick, 1-click access without remembering passwords.
                  </p>

                  {/* Primary Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    {/* Google 'G' official colored vector icon */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>{isLoading ? 'Signing In...' : 'Continue with Google'}</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="font-bold text-[#002869] hover:underline cursor-pointer"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* VIEW: REGISTER (Requires Phone Number + Details)     */}
            {/* ==================================================== */}
            {authMode === 'register' && (
              <div className="space-y-4">
                {/* Option 1: Register with Google (Will ask for phone in next step) */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Quick Register with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Or Register Directly
                  </span>
                  <div className="border-t border-slate-200 w-full" />
                </div>

                {/* Direct Registration Form with MANDATORY Phone Number */}
                <form onSubmit={handleDirectRegister} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#002869]">
                      <User className="w-4 h-4 text-slate-400 mr-2" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#002869]">
                      <Mail className="w-4 h-4 text-slate-400 mr-2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="rahul.sharma@example.com"
                        className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* MANDATORY PHONE NUMBER FIELD WHILE REGISTERING */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">
                        Mobile Number *
                      </label>
                      <span className="text-[10px] text-[#FF6B35] font-extrabold bg-orange-50 px-1.5 py-0.5 rounded">
                        Mandatory
                      </span>
                    </div>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#002869]">
                      <span className="font-bold text-slate-600 mr-2 text-xs">🇮🇳 +91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none tracking-wider"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Required for instant WhatsApp alerts and verified buyer/seller inquiries.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Account Type:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {[
                        { key: 'buyer', label: 'Buyer' },
                        { key: 'owner', label: 'Owner' },
                        { key: 'agent', label: 'Agent' },
                      ].map((r) => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setRegRole(r.key as any)}
                          className={`py-1.5 rounded-lg font-bold text-[11px] border transition-colors cursor-pointer ${
                            regRole === r.key
                              ? 'bg-[#002869] text-white border-[#002869]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-bold shadow-md shadow-[#FF6B35]/25 transition-all cursor-pointer text-center text-xs mt-2"
                  >
                    {isLoading ? 'Creating Account...' : 'Register & Create Account'}
                  </button>
                </form>

                <div className="text-center pt-1">
                  <p className="text-xs text-slate-500">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-bold text-[#002869] hover:underline cursor-pointer"
                    >
                      Sign In with Google
                    </button>
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Security assurance */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Google Authenticated & RERA Compliant Platform</span>
        </div>
      </motion.div>
    </div>
  );
};
