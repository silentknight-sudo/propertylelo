import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  limit
} from 'firebase/firestore';
import { Property, Lead, TeamMember, BlogArticle, CmsSettings } from '../types/property';
import { PROPERTIES_DATA, BLOG_ARTICLES_DATA } from '../data/mockData';

export const firebaseConfig = {
  projectId: "studious-phenomenon-fxjg4",
  appId: "1:728967146453:web:6a3940b7faac9649e12b5c",
  apiKey: "AIzaSyB0QfluAUkqEsilgEfC71yUxUtyOWqtE10",
  authDomain: "studious-phenomenon-fxjg4.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-propertyleloindi-513a4fd5-cf21-4377-8e02-856c6376fe10",
  storageBucket: "studious-phenomenon-fxjg4.firebasestorage.app",
  messagingSenderId: "728967146453",
  oAuthClientId: "728967146453-0hhohlu2u4a52tiafj1rl2nuke3gdorr.apps.googleusercontent.com"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with the provisioned database ID
let dbInstance;
try {
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch {
  dbInstance = getFirestore(app);
}
export const db = dbInstance;

// ==========================================
// DEFAULT SEED DATA
// ==========================================

export const DEFAULT_ADMIN: TeamMember = {
  id: 'admin-shivam-9063',
  username: 'shivam@9063',
  password: 'shivam @9063',
  name: 'Shivam (Super Admin)',
  email: 'shivam@propertylelo.com',
  phone: '+91 98765 43210',
  role: 'admin',
  active: true,
  createdAt: new Date().toISOString(),
  leadsAssignedCount: 0,
  propertiesCount: 16
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  DEFAULT_ADMIN,
  {
    id: 'team-agent-1',
    username: 'rahul.verma@propertylelo.com',
    password: 'agent123',
    name: 'Rahul Verma',
    email: 'rahul.verma@propertylelo.com',
    phone: '+91 98112 34567',
    role: 'agent',
    assignedCity: 'Delhi NCR',
    active: true,
    createdAt: new Date().toISOString(),
    leadsAssignedCount: 3,
    propertiesCount: 4
  },
  {
    id: 'team-agent-2',
    username: 'priya.sharma@propertylelo.com',
    password: 'agent123',
    name: 'Priya Sharma',
    email: 'priya.sharma@propertylelo.com',
    phone: '+91 98223 45678',
    role: 'agent',
    assignedCity: 'Mumbai',
    active: true,
    createdAt: new Date().toISOString(),
    leadsAssignedCount: 2,
    propertiesCount: 3
  },
  {
    id: 'team-editor-1',
    username: 'ananya.editor@propertylelo.com',
    password: 'editor123',
    name: 'Ananya Sen',
    email: 'ananya.editor@propertylelo.com',
    phone: '+91 98334 56789',
    role: 'editor',
    assignedCity: 'Bangalore',
    active: true,
    createdAt: new Date().toISOString(),
    leadsAssignedCount: 0,
    propertiesCount: 0
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    type: 'schedule_visit',
    clientName: 'Vikramaditya Roy',
    clientPhone: '+91 98711 00223',
    clientEmail: 'vikram.roy@fintechcorp.in',
    propertyId: 'prop-1',
    propertyTitle: 'Godrej Palm Retreat 3 BHK Luxury Suite',
    city: 'Delhi NCR',
    preferredDate: '2026-09-12',
    preferredTime: '11:00 AM',
    budget: '₹1.85 Cr',
    status: 'New',
    assignedTo: 'team-agent-1',
    assignedToName: 'Rahul Verma',
    assignedAt: new Date().toISOString(),
    message: 'Looking for prompt site visit with family this Saturday. Interested in upper floor units.',
    notes: [
      {
        id: 'n-1',
        author: 'System Auto-Assign',
        text: 'Assigned to Delhi NCR territory agent Rahul Verma based on location routing.',
        date: new Date().toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'lead-102',
    type: 'contact_owner',
    clientName: 'Kavita Menon',
    clientPhone: '+91 97188 44556',
    clientEmail: 'kavita.m@gmail.com',
    propertyId: 'prop-2',
    propertyTitle: 'Lodha Sea View 4 BHK Sky Mansion',
    city: 'Mumbai',
    budget: '₹8.50 Cr',
    status: 'Contacted',
    assignedTo: 'team-agent-2',
    assignedToName: 'Priya Sharma',
    assignedAt: new Date().toISOString(),
    message: 'NRI buyer inquiring about stamp duty rebate and sea facing deck floor plans.',
    notes: [
      {
        id: 'n-2',
        author: 'Priya Sharma',
        text: 'Called client via WhatsApp. Shared verified video walkthrough & builder layout.',
        date: new Date().toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'lead-103',
    type: 'home_loan',
    clientName: 'Deepak & Sunita Aggarwal',
    clientPhone: '+91 99100 88221',
    clientEmail: 'deepak.aggarwal@techcorp.com',
    city: 'Bangalore',
    loanAmount: 8500000,
    status: 'Site Visit Fixed',
    assignedTo: 'team-agent-1',
    assignedToName: 'Rahul Verma',
    assignedAt: new Date().toISOString(),
    message: 'Pre-approved loan eligibility calculation requested for ₹85 Lakh at 8.40% interest.',
    notes: [],
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString()
  },
  {
    id: 'lead-104',
    type: 'vip_project',
    clientName: 'Amitabh Singhal',
    clientPhone: '+91 98450 11992',
    clientEmail: 'singhal.investments@yahoo.com',
    city: 'Delhi NCR',
    propertyTitle: 'Godrej Aristocrat Golf Course Road Ext',
    budget: '₹3.80 Cr - ₹5.50 Cr',
    status: 'New',
    message: 'Requesting VIP early bird launch discount and payment scheme breakdown.',
    notes: [],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export const DEFAULT_CMS_SETTINGS: CmsSettings = {
  features: {
    heroSearch: true,
    featuredCities: true,
    whyChooseUs: true,
    propertyListings: true,
    propertyGrid: true,
    newProjects: true,
    toolsSuite: true,
    insightsBlog: true,
    testimonials: true,
    postPropertyCta: true,
    ctaBanner: true,
    appDownloadBanner: true,
    cityPills: true,
    verifiedProperties: true,
    featuredProjects: true,
    financialTools: true,
    blogSection: true
  },
  announcementBar: {
    enabled: true,
    badge: 'FESTIVE LAUNCH 2026',
    text: 'Zero Brokerage on all RERA-Certified Direct Builder Bookings across Delhi NCR, Mumbai & Bangalore!',
    linkText: 'Explore Verified Deals',
    linkUrl: '#properties-section'
  },
  contactInfo: {
    helpline: '1800-419-7421',
    email: 'support@propertylelo.com',
    address: 'DLF Cyber City, Tower B, Sector 25, Gurugram, Haryana 122002',
    workingHours: 'Monday - Saturday: 9:00 AM - 8:00 PM'
  },
  siteMeta: {
    siteName: 'PropertyLelo',
    tagline: "India's Most Trusted Property Marketplace",
    maintenanceMode: false
  }
};

// ==========================================
// FIRESTORE SERVICES: PROPERTIES
// ==========================================

export async function fetchPropertiesFromDb(): Promise<Property[]> {
  try {
    const colRef = collection(db, 'properties');
    const snap = await getDocs(colRef);
    if (snap.empty) {
      // Seed default properties to Firestore
      await seedInitialProperties();
      return PROPERTIES_DATA.map(p => ({ ...p, status: 'published' as const }));
    }
    const list: Property[] = [];
    snap.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Property);
    });
    return list;
  } catch (err) {
    console.warn('Firestore fetchProperties fallback to local', err);
    const cached = localStorage.getItem('propertylelo_properties_cache');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return PROPERTIES_DATA.map(p => ({ ...p, status: 'published' as const }));
  }
}

export async function seedInitialProperties(): Promise<void> {
  try {
    const colRef = collection(db, 'properties');
    for (const prop of PROPERTIES_DATA) {
      const propWithStatus: Property = {
        ...prop,
        status: 'published'
      };
      await setDoc(doc(colRef, prop.id), propWithStatus);
    }
  } catch (e) {
    console.error('Error seeding properties', e);
  }
}

export async function savePropertyToDb(property: Property): Promise<void> {
  try {
    const colRef = collection(db, 'properties');
    await setDoc(doc(colRef, property.id), property);
  } catch (err) {
    console.error('Failed to save property to Firestore', err);
    throw err;
  }
}

export async function updatePropertyInDb(id: string, updates: Partial<Property>): Promise<void> {
  try {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.error('Failed to update property in Firestore', err);
    throw err;
  }
}

export async function deletePropertyFromDb(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'properties', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete property from Firestore', err);
    throw err;
  }
}

// ==========================================
// FIRESTORE SERVICES: LEADS (CRM)
// ==========================================

export async function fetchLeadsFromDb(): Promise<Lead[]> {
  try {
    const colRef = collection(db, 'leads');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(150));
    const snap = await getDocs(q);
    if (snap.empty) {
      await seedInitialLeads();
      return INITIAL_LEADS;
    }
    const list: Lead[] = [];
    snap.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Lead);
    });
    return list;
  } catch (err) {
    console.warn('Firestore fetchLeads fallback to local', err);
    const cached = localStorage.getItem('propertylelo_leads_cache');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return INITIAL_LEADS;
  }
}

export async function seedInitialLeads(): Promise<void> {
  try {
    const colRef = collection(db, 'leads');
    for (const lead of INITIAL_LEADS) {
      await setDoc(doc(colRef, lead.id), lead);
    }
  } catch (e) {
    console.error('Error seeding leads', e);
  }
}

export async function createLeadInDb(lead: Lead): Promise<void> {
  try {
    const docRef = doc(db, 'leads', lead.id);
    await setDoc(docRef, lead);
  } catch (err) {
    console.error('Failed to save lead in Firestore', err);
    throw err;
  }
}

export async function updateLeadInDb(id: string, updates: Partial<Lead>): Promise<void> {
  try {
    const docRef = doc(db, 'leads', id);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.error('Failed to update lead in Firestore', err);
    throw err;
  }
}

export async function deleteLeadFromDb(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'leads', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete lead from Firestore', err);
    throw err;
  }
}

// ==========================================
// FIRESTORE SERVICES: TEAM MEMBERS & RBAC
// ==========================================

export async function fetchTeamMembersFromDb(): Promise<TeamMember[]> {
  try {
    const colRef = collection(db, 'team_members');
    const snap = await getDocs(colRef);
    if (snap.empty) {
      await seedInitialTeamMembers();
      return INITIAL_TEAM_MEMBERS;
    }
    const list: TeamMember[] = [];
    snap.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as TeamMember);
    });
    return list;
  } catch (err) {
    console.warn('Firestore fetchTeamMembers fallback to local', err);
    const cached = localStorage.getItem('propertylelo_team_cache');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return INITIAL_TEAM_MEMBERS;
  }
}

export async function seedInitialTeamMembers(): Promise<void> {
  try {
    const colRef = collection(db, 'team_members');
    for (const member of INITIAL_TEAM_MEMBERS) {
      await setDoc(doc(colRef, member.id), member);
    }
  } catch (e) {
    console.error('Error seeding team members', e);
  }
}

export async function createTeamMemberInDb(member: TeamMember): Promise<void> {
  try {
    const docRef = doc(db, 'team_members', member.id);
    await setDoc(docRef, member);
  } catch (err) {
    console.error('Failed to create team member in Firestore', err);
    throw err;
  }
}

export async function updateTeamMemberInDb(id: string, updates: Partial<TeamMember>): Promise<void> {
  try {
    const docRef = doc(db, 'team_members', id);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.error('Failed to update team member in Firestore', err);
    throw err;
  }
}

export async function deleteTeamMemberFromDb(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'team_members', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete team member from Firestore', err);
    throw err;
  }
}

// ==========================================
// FIRESTORE SERVICES: BLOGS & ADVANCED SEO
// ==========================================

export async function fetchBlogsFromDb(): Promise<BlogArticle[]> {
  try {
    const colRef = collection(db, 'blogs');
    const snap = await getDocs(colRef);
    if (snap.empty) {
      await seedInitialBlogs();
      return BLOG_ARTICLES_DATA;
    }
    const list: BlogArticle[] = [];
    snap.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as BlogArticle);
    });
    return list;
  } catch (err) {
    console.warn('Firestore fetchBlogs fallback', err);
    const cached = localStorage.getItem('propertylelo_blogs_cache');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return BLOG_ARTICLES_DATA;
  }
}

export async function seedInitialBlogs(): Promise<void> {
  try {
    const colRef = collection(db, 'blogs');
    for (const blog of BLOG_ARTICLES_DATA) {
      await setDoc(doc(colRef, blog.id), blog);
    }
  } catch (e) {
    console.error('Error seeding blogs', e);
  }
}

export async function createBlogInDb(blog: BlogArticle): Promise<void> {
  try {
    const docRef = doc(db, 'blogs', blog.id);
    await setDoc(docRef, blog);
  } catch (err) {
    console.error('Failed to save blog in Firestore', err);
    throw err;
  }
}

export const saveBlogToDb = createBlogInDb;

export async function updateBlogInDb(id: string, updates: Partial<BlogArticle>): Promise<void> {
  try {
    const docRef = doc(db, 'blogs', id);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.error('Failed to update blog in Firestore', err);
    throw err;
  }
}

export async function deleteBlogFromDb(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'blogs', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete blog from Firestore', err);
    throw err;
  }
}

// ==========================================
// FIRESTORE SERVICES: CMS SETTINGS
// ==========================================

export async function fetchCmsSettingsFromDb(): Promise<CmsSettings> {
  try {
    const docRef = doc(db, 'cms_config', 'homepage_settings');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CmsSettings;
    }
    await setDoc(docRef, DEFAULT_CMS_SETTINGS);
    return DEFAULT_CMS_SETTINGS;
  } catch (err) {
    console.warn('Firestore fetchCmsSettings fallback', err);
    const cached = localStorage.getItem('propertylelo_cms_settings');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return DEFAULT_CMS_SETTINGS;
  }
}

export async function saveCmsSettingsToDb(settings: CmsSettings): Promise<void> {
  try {
    const docRef = doc(db, 'cms_config', 'homepage_settings');
    await setDoc(docRef, settings);
  } catch (err) {
    console.error('Failed to save CMS settings to Firestore', err);
    throw err;
  }
}
