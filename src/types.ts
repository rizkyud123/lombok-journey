export interface BusinessInfo {
  name: string;
  tagline: string;
  phone: string;
  formattedPhone: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  location: string;
  waBaseUrl: string;
}

export interface EstimatorConfig {
  tripTypes: string[];
  durations: string[];
  paxOptions: string[];
  availableSpots: string[];
}

export interface TripService {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  priceStart: string;
  description: string;
  features: string[];
  includes: string[];
  popularSpot: string[];
  recommendedFor: string;
  iconName: string;
  bgImage: string;
}

export interface LombokDestination {
  id: string;
  name: string;
  category: 'Pantai & Gili' | 'Gunung & Alam' | 'Budaya & Desa' | 'Air Terjun';
  location: string;
  image: string;
  description: string;
  highlight: string;
  bestTime: string;
}

export interface Review {
  id: string;
  name: string;
  origin: string;
  tripType: string;
  comment: string;
  rating: number;
  avatar: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface GalleryActivity {
  id: string;
  title: string;
  category: 'Semua' | 'Snorkeling & Bahari' | 'Budaya & Adat' | 'Pantai & Sunset' | 'Pegunungan & Alam';
  location: string;
  image: string;
  description: string;
  activityDate: string;
  packageTag: string;
}


