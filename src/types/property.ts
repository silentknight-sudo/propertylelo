export type PropertyType = 'Apartment' | 'Villa' | 'Independent House' | 'Plot' | 'Commercial Office' | 'Penthouse' | 'Studio Flat';
export type ListingCategory = 'Buy' | 'Rent' | 'Commercial' | 'New Projects' | 'PG-Coliving';
export type PostedByType = 'Owner' | 'Builder' | 'Verified Agent';
export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type PossessionStatus = 'Ready to Move' | 'Under Construction' | 'New Launch';

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
