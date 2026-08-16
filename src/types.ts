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

export type BookingStatusType = 'Menunggu Konfirmasi' | 'Terkonfirmasi & Siap' | 'Trip Sedang Berjalan' | 'Selesai' | 'Dibatalkan';

export interface BookingInquiry {
  id: string; // e.g. "LJ-2026-8812"
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  tripType: string;
  duration: string;
  pax: string;
  spots: string[];
  travelDate?: string;
  totalEstimate?: string;
  status: BookingStatusType;
  notes?: string;
  guideName?: string;
  driverPhone?: string;
  pickupLocation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryActivity {
  id: string;
  title: string;
  category: 'Semua' | 'Snorkeling & Bahari' | 'Budaya & Adat' | 'Pantai & Sunset' | 'Pegunungan & Alam';
  location: string;
  image: string; // Cover photo / thumbnail
  description: string;
  activityDate: string;
  packageTag: string;
  mediaType?: 'image' | 'video'; // 'image' or 'video'
  videoUrl?: string; // Social media link (YouTube, TikTok, Instagram) or direct video URL / uploaded video
  videoSource?: 'youtube' | 'tiktok' | 'instagram' | 'direct' | 'upload';
  videoDuration?: string;
}


