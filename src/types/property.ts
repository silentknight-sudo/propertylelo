export type PropertyType = 'Apartment' | 'Villa' | 'Independent House' | 'Plot' | 'Commercial Office' | 'Retail Shop' | 'Food Court' | 'Penthouse' | 'Studio Flat';
export type ListingCategory = 'Buy' | 'Commercial' | 'New Projects' | 'Plot';
export type PostedByType = 'Owner' | 'Builder' | 'Verified Agent';
export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type PossessionStatus = 'Ready to Move' | 'Under Construction' | 'New Launch';
export type ApprovalStatus = 'published' | 'pending_approval' | 'rejected' | 'draft';

export interface ProjectConfiguration {
  id?: string;
  unitType: string; // e.g. "Retail Shops", "Office Space", "Food Court", "Studio Suite"
  carpetArea: string; // e.g. "150 - 640 sq.ft"
  superArea?: string; // e.g. "200 - 1000 sq.ft"
  price: string; // e.g. "Starting ₹1.41 Cr*"
  priceNumeric?: number;
  pricePerSqft?: string; // e.g. "₹18,000/sq.ft"
  floor?: string; // e.g. "Lower Ground & Ground"
}

export interface FloorPlanItem {
  id?: string;
  title: string; // e.g. "Ground Floor Retail & Anchor", "4th Floor Office Suites"
  type: string; // "Retail", "Office", "Food Court", "Studio", "Master Plan"
  size: string; // "328 - 789 sq.ft"
  image: string; // blueprint image URL
  description?: string;
}

export interface LandmarkDistance {
  landmark: string; // e.g. "Noida-Greater Noida Expressway", "Amity University", "Jaypee Hospital"
  time: string; // e.g. "0 Mins", "3 Mins", "2 Mins"
  category?: 'Connectivity' | 'Education' | 'Healthcare' | 'Corporate' | 'Airport';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Property {
  id: string;
  title: string;
  tagline?: string;
  type: PropertyType;
  category: ListingCategory;
  bhk: number; // e.g. 1, 2, 3, 4, 5
  price: number; // in numeric INR (e.g. 12000000 for 1.2 Cr)
  priceFormatted: string; // e.g. "₹1.20 Cr" or "₹85 Lakh" or "₹45,000/mo"
  pricePerSqft: number;
  area: number; // in sq ft
  locality: string;
  city: string;
  state: string;
  pincode: string;
  images: string[];
  verified: boolean;
  reraId?: string;
  postedBy: PostedByType;
  posterName: string;
  posterPhone: string;
  postedDate: string;
  furnishing: FurnishingStatus;
  possession: PossessionStatus;
  facing: 'North' | 'East' | 'North-East' | 'West' | 'South';
  floor: string; // e.g. "14th of 28 Floors"
  bathrooms: number;
  balconies: number;
  parking: string;
  amenities: string[];
  description: string;
  maintenanceCharges?: string;
  featured?: boolean;
  virtualTourAvailable?: boolean;
  status?: ApprovalStatus;
  rejectionReason?: string;
  propertyType?: PropertyType;
  submittedBy?: string; // userId or poster identifier
  submittedByName?: string;
  approvedBy?: string;
  approvalNotes?: string;

  // Comprehensive Project Specifications
  developerName?: string;
  developerExperience?: string;
  developerDeliveredProjects?: string;
  projectStatus?: string; // e.g. "Under Construction", "Ready to Move"
  possessionDate?: string; // e.g. "December 2026"
  totalLandArea?: string; // e.g. "10 Acres"
  totalTowers?: string; // e.g. "3 Towers"
  totalUnits?: string; // e.g. "703 Units"
  projectArchitecture?: string; // e.g. "European Architecture • LEED Gold Rated"
  leaseGuarantee?: string; // e.g. "29-Year Lease Guarantee • 12% Assured Returns"
  priceRange?: string; // e.g. "₹82.50 Lakh - ₹2.50 Cr*"
  highlights?: string[]; // Project USPs
  configurations?: ProjectConfiguration[];
  floorPlans?: FloorPlanItem[];
  locationAdvantages?: LandmarkDistance[];
  brochureUrl?: string;
  videoWalkthroughUrl?: string;
  aboutDeveloper?: string;
  faqs?: FaqItem[];
}

export type UserRole = 'admin' | 'agent' | 'editor';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL?: string;
  role?: 'buyer' | 'owner' | 'agent' | 'user';
  createdAt?: string;
  provider: 'google' | 'custom';
}

export interface TeamMember {
  id: string;
  username: string; // e.g. shivam@9063
  password?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  assignedCity?: string;
  active: boolean;
  createdAt: string;
  leadsAssignedCount?: number;
  propertiesCount?: number;
}

export type LeadType = 'contact_owner' | 'schedule_visit' | 'vip_project' | 'home_loan' | 'post_property' | 'general' | 'Direct Seller Contact' | 'Site Visit' | 'VIP Builder Launch' | 'Home Loan Application' | 'New Property Posted';
export type LeadStatus = 'New' | 'Contacted' | 'Site Visit Fixed' | 'Deal Closed' | 'Lost';

export interface LeadNote {
  id?: string;
  author?: string;
  text?: string;
  date?: string;
}

export interface Lead {
  id: string;
  type?: LeadType;
  category?: string;
  source?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  city?: string;
  preferredDate?: string;
  preferredTime?: string;
  budget?: string;
  loanAmount?: number;
  message?: string;
  status: LeadStatus;
  assignedTo?: string; // TeamMember id
  assignedToId?: string;
  assignedToName?: string;
  assignedAt?: string;
  notes?: (LeadNote | string)[];
  createdAt: string;
}

export interface BlogSeo {
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  schemaType: 'Article' | 'NewsArticle' | 'BlogPosting' | 'RealEstateListing';
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  readTime: string;
  date: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  status: ApprovalStatus;
  rejectionReason?: string;
  approvedBy?: string;
  seo: BlogSeo;
}

export interface CmsSettings {
  features: {
    heroSearch: boolean;
    featuredCities: boolean;
    whyChooseUs: boolean;
    propertyListings: boolean;
    propertyGrid?: boolean;
    newProjects: boolean;
    toolsSuite: boolean;
    insightsBlog: boolean;
    testimonials: boolean;
    postPropertyCta: boolean;
    ctaBanner?: boolean;
    appDownloadBanner: boolean;
    cityPills?: boolean;
    verifiedProperties?: boolean;
    featuredProjects?: boolean;
    financialTools?: boolean;
    blogSection?: boolean;
  };
  announcementBar: {
    enabled: boolean;
    text: string;
    linkText?: string;
    linkUrl?: string;
    badge?: string;
  };
  contactInfo: {
    helpline: string;
    email: string;
    address: string;
    workingHours: string;
  };
  siteMeta: {
    siteName: string;
    tagline: string;
    maintenanceMode: boolean;
  };
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  tagline: string;
  propertyCount: string;
  avgPriceSqft: string;
  image: string;
  popularLocalities: string[];
}

export interface NewProject {
  id: string;
  name: string;
  builder: string;
  locality: string;
  city: string;
  priceRange: string;
  units: string;
  possessionDate: string;
  reraId: string;
  image: string;
  badge: string;
  launchOffer: string;
  highlights: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  review: string;
  propertyPurchased: string;
  verifiedTransaction: boolean;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
}

export interface FilterState {
  category: ListingCategory;
  city: string;
  locality: string;
  propertyType: string;
  bhk: string;
  minPrice: number;
  maxPrice: number;
  verifiedOnly: boolean;
  postedBy: string;
  furnishing: string;
  possession: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'area-desc' | 'newest';
}
