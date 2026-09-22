import { createClient } from '@supabase/supabase-js';
import {
  TripService,
  LombokDestination,
  GalleryActivity,
  BookingInquiry,
  BusinessInfo,
  EstimatorConfig,
  Review,
  FAQItem
} from '../types';

// Fallback to credentials provided by user if environment variable is unset
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const procEnv = typeof process !== 'undefined' ? process.env : undefined;

const SUPABASE_URL =
  metaEnv?.VITE_SUPABASE_URL ||
  metaEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  procEnv?.VITE_SUPABASE_URL ||
  procEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  'https://zfbuseuqedjuvnhrlhwy.supabase.co';

const SUPABASE_ANON_KEY =
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  metaEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  procEnv?.VITE_SUPABASE_ANON_KEY ||
  procEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmYnVzZXVxZWRqdXZuaHJsaHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNjE0NTQsImV4cCI6MjEwNTYzNzQ1NH0.elVuf8GBF4SzA59BnzZ-OKbpLgGXUgUITLZQX9r3dQE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper for safe JSON parse / array ensuring
const toArray = <T,>(val: any, fallback: T[] = []): T[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return fallback;
};

// -------------------------------------------------------------
// MAPPERS: Supabase Database Rows (snake_case) <-> Typescript (camelCase)
// -------------------------------------------------------------

export const mapTripServiceFromRow = (row: any): TripService => ({
  id: row.id,
  title: row.title || '',
  tagline: row.tagline || '',
  badge: row.badge || '',
  priceStart: row.price_start || row.priceStart || '',
  description: row.description || '',
  features: toArray(row.features),
  includes: toArray(row.includes),
  popularSpot: toArray(row.popular_spot || row.popularSpot),
  recommendedFor: row.recommended_for || row.recommendedFor || '',
  iconName: row.icon_name || row.iconName || 'Compass',
  bgImage: row.bg_image || row.bgImage || '',
});

export const mapTripServiceToRow = (item: TripService | Partial<TripService>): Record<string, any> => {
  const row: Record<string, any> = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.title !== undefined) row.title = item.title;
  if (item.tagline !== undefined) row.tagline = item.tagline;
  if (item.badge !== undefined) row.badge = item.badge;
  if (item.priceStart !== undefined) row.price_start = item.priceStart;
  if (item.description !== undefined) row.description = item.description;
  if (item.features !== undefined) row.features = item.features;
  if (item.includes !== undefined) row.includes = item.includes;
  if (item.popularSpot !== undefined) row.popular_spot = item.popularSpot;
  if (item.recommendedFor !== undefined) row.recommended_for = item.recommendedFor;
  if (item.iconName !== undefined) row.icon_name = item.iconName;
  if (item.bgImage !== undefined) row.bg_image = item.bgImage;
  row.updated_at = new Date().toISOString();
  return row;
};

export const mapDestinationFromRow = (row: any): LombokDestination => ({
  id: row.id,
  name: row.name || '',
  category: row.category || 'Pantai & Gili',
  location: row.location || '',
  image: row.image || '',
  description: row.description || '',
  highlight: row.highlight || '',
  bestTime: row.best_time || row.bestTime || '08:00 - 18:00 WITA',
});

export const mapDestinationToRow = (item: LombokDestination | Partial<LombokDestination>): Record<string, any> => {
  const row: Record<string, any> = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.name !== undefined) row.name = item.name;
  if (item.category !== undefined) row.category = item.category;
  if (item.location !== undefined) row.location = item.location;
  if (item.image !== undefined) row.image = item.image;
  if (item.description !== undefined) row.description = item.description;
  if (item.highlight !== undefined) row.highlight = item.highlight;
  if (item.bestTime !== undefined) row.best_time = item.bestTime;
  row.updated_at = new Date().toISOString();
  return row;
};

export const mapGalleryActivityFromRow = (row: any): GalleryActivity => ({
  id: row.id,
  title: row.title || '',
  category: row.category || 'Semua',
  location: row.location || '',
  image: row.image || '',
  description: row.description || '',
  activityDate: row.activity_date || row.activityDate || '',
  packageTag: row.package_tag || row.packageTag || '',
  mediaType: row.media_type || row.mediaType || 'image',
  videoUrl: row.video_url || row.videoUrl || undefined,
  videoSource: row.video_source || row.videoSource || undefined,
  videoDuration: row.video_duration || row.videoDuration || undefined,
});

export const mapGalleryActivityToRow = (item: GalleryActivity | Partial<GalleryActivity>): Record<string, any> => {
  const row: Record<string, any> = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.title !== undefined) row.title = item.title;
  if (item.category !== undefined) row.category = item.category;
  if (item.location !== undefined) row.location = item.location;
  if (item.image !== undefined) row.image = item.image;
  if (item.description !== undefined) row.description = item.description;
  if (item.activityDate !== undefined) row.activity_date = item.activityDate;
  if (item.packageTag !== undefined) row.package_tag = item.packageTag;
  if (item.mediaType !== undefined) row.media_type = item.mediaType;
  if (item.videoUrl !== undefined) row.video_url = item.videoUrl;
  if (item.videoSource !== undefined) row.video_source = item.videoSource;
  if (item.videoDuration !== undefined) row.video_duration = item.videoDuration;
  row.updated_at = new Date().toISOString();
  return row;
};

export const mapBookingFromRow = (row: any): BookingInquiry => ({
  id: row.id,
  guestName: row.guest_name || row.guestName || '',
  guestPhone: row.guest_phone || row.guestPhone || '',
  guestEmail: row.guest_email || row.guestEmail || undefined,
  tripType: row.trip_type || row.tripType || '',
  duration: row.duration || '',
  pax: row.pax || '',
  spots: toArray(row.spots),
  travelDate: row.travel_date || row.travelDate || undefined,
  totalEstimate: row.total_estimate || row.totalEstimate || undefined,
  status: row.status || 'Menunggu Konfirmasi',
  notes: row.notes || undefined,
  guideName: row.guide_name || row.guideName || undefined,
  driverPhone: row.driver_phone || row.driverPhone || undefined,
  pickupLocation: row.pickup_location || row.pickupLocation || undefined,
  createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
});

export const mapBookingToRow = (item: BookingInquiry | Partial<BookingInquiry>): Record<string, any> => {
  const row: Record<string, any> = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.guestName !== undefined) row.guest_name = item.guestName;
  if (item.guestPhone !== undefined) row.guest_phone = item.guestPhone;
  if (item.guestEmail !== undefined) row.guest_email = item.guestEmail;
  if (item.tripType !== undefined) row.trip_type = item.tripType;
  if (item.duration !== undefined) row.duration = item.duration;
  if (item.pax !== undefined) row.pax = item.pax;
  if (item.spots !== undefined) row.spots = item.spots;
  if (item.travelDate !== undefined) row.travel_date = item.travelDate;
  if (item.totalEstimate !== undefined) row.total_estimate = item.totalEstimate;
  if (item.status !== undefined) row.status = item.status;
  if (item.notes !== undefined) row.notes = item.notes;
  if (item.guideName !== undefined) row.guide_name = item.guideName;
  if (item.driverPhone !== undefined) row.driver_phone = item.driverPhone;
  if (item.pickupLocation !== undefined) row.pickup_location = item.pickupLocation;
  if (item.createdAt !== undefined) row.created_at = item.createdAt;
  row.updated_at = new Date().toISOString();
  return row;
};

export const mapBusinessInfoFromRow = (row: any): BusinessInfo => ({
  name: row.name || 'Lombok Journey',
  tagline: row.tagline || 'Spesialis Private Trip & Wisata Lombok',
  phone: row.phone || '628889163745',
  formattedPhone: row.formatted_phone || row.formattedPhone || '0888-9163-745',
  email: row.email || 'hairulummah2201@gmail.com',
  instagramHandle: row.instagram_handle || row.instagramHandle || '@lombokjourney_',
  instagramUrl: row.instagram_url || row.instagramUrl || 'https://instagram.com/lombokjourney_',
  location: row.location || 'Mataram, Lombok, Nusa Tenggara Barat',
  waBaseUrl: row.wa_base_url || row.waBaseUrl || 'https://wa.me/628889163745',
});

export const mapBusinessInfoToRow = (item: BusinessInfo | Partial<BusinessInfo>): Record<string, any> => {
  const row: Record<string, any> = { id: 'main' };
  if (item.name !== undefined) row.name = item.name;
  if (item.tagline !== undefined) row.tagline = item.tagline;
  if (item.phone !== undefined) row.phone = item.phone;
  if (item.formattedPhone !== undefined) row.formatted_phone = item.formattedPhone;
  if (item.email !== undefined) row.email = item.email;
  if (item.instagramHandle !== undefined) row.instagram_handle = item.instagramHandle;
  if (item.instagramUrl !== undefined) row.instagram_url = item.instagramUrl;
  if (item.location !== undefined) row.location = item.location;
  if (item.waBaseUrl !== undefined) row.wa_base_url = item.waBaseUrl;
  row.updated_at = new Date().toISOString();
  return row;
};

export const mapEstimatorConfigFromRow = (row: any): EstimatorConfig => ({
  tripTypes: toArray(row.trip_types || row.tripTypes),
  durations: toArray(row.durations),
  paxOptions: toArray(row.pax_options || row.paxOptions),
  availableSpots: toArray(row.available_spots || row.availableSpots),
});

export const mapEstimatorConfigToRow = (item: EstimatorConfig | Partial<EstimatorConfig>): Record<string, any> => {
  const row: Record<string, any> = { id: 'main' };
  if (item.tripTypes !== undefined) row.trip_types = item.tripTypes;
  if (item.durations !== undefined) row.durations = item.durations;
  if (item.paxOptions !== undefined) row.pax_options = item.paxOptions;
  if (item.availableSpots !== undefined) row.available_spots = item.availableSpots;
  row.updated_at = new Date().toISOString();
  return row;
};

// -------------------------------------------------------------
// DATABASE OPERATIONS
// -------------------------------------------------------------

export const dbService = {
  // Services
  async getServices(): Promise<TripService[]> {
    const { data, error } = await supabase
      .from('trip_services')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapTripServiceFromRow);
  },
  async upsertService(service: TripService): Promise<void> {
    const { error } = await supabase
      .from('trip_services')
      .upsert(mapTripServiceToRow(service), { onConflict: 'id' });
    if (error) throw error;
  },
  async deleteService(id: string): Promise<void> {
    const { error } = await supabase.from('trip_services').delete().eq('id', id);
    if (error) throw error;
  },

  // Destinations
  async getDestinations(): Promise<LombokDestination[]> {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapDestinationFromRow);
  },
  async upsertDestination(dest: LombokDestination): Promise<void> {
    const { error } = await supabase
      .from('destinations')
      .upsert(mapDestinationToRow(dest), { onConflict: 'id' });
    if (error) throw error;
  },
  async deleteDestination(id: string): Promise<void> {
    const { error } = await supabase.from('destinations').delete().eq('id', id);
    if (error) throw error;
  },

  // Gallery Activities
  async getGalleryActivities(): Promise<GalleryActivity[]> {
    const { data, error } = await supabase
      .from('gallery_activities')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapGalleryActivityFromRow);
  },
  async upsertGalleryActivity(act: GalleryActivity): Promise<void> {
    const { error } = await supabase
      .from('gallery_activities')
      .upsert(mapGalleryActivityToRow(act), { onConflict: 'id' });
    if (error) throw error;
  },
  async deleteGalleryActivity(id: string): Promise<void> {
    const { error } = await supabase.from('gallery_activities').delete().eq('id', id);
    if (error) throw error;
  },

  // Bookings
  async getBookings(): Promise<BookingInquiry[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapBookingFromRow);
  },
  async upsertBooking(booking: BookingInquiry): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .upsert(mapBookingToRow(booking), { onConflict: 'id' });
    if (error) throw error;
  },
  async deleteBooking(id: string): Promise<void> {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
  },

  // Business Info
  async getBusinessInfo(): Promise<BusinessInfo | null> {
    const { data, error } = await supabase
      .from('business_info')
      .select('*')
      .eq('id', 'main')
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return mapBusinessInfoFromRow(data);
  },
  async upsertBusinessInfo(info: BusinessInfo): Promise<void> {
    const { error } = await supabase
      .from('business_info')
      .upsert(mapBusinessInfoToRow(info), { onConflict: 'id' });
    if (error) throw error;
  },

  // Estimator Config
  async getEstimatorConfig(): Promise<EstimatorConfig | null> {
    const { data, error } = await supabase
      .from('estimator_config')
      .select('*')
      .eq('id', 'main')
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return mapEstimatorConfigFromRow(data);
  },
  async upsertEstimatorConfig(config: EstimatorConfig): Promise<void> {
    const { error } = await supabase
      .from('estimator_config')
      .upsert(mapEstimatorConfigToRow(config), { onConflict: 'id' });
    if (error) throw error;
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      // If table doesn't exist yet, return empty
      return [];
    }
    return (data || []).map((r: any) => ({
      id: r.id,
      name: r.name || '',
      origin: r.origin || '',
      tripType: r.trip_type || r.tripType || '',
      comment: r.comment || '',
      rating: Number(r.rating) || 5,
      avatar: r.avatar || '',
      date: r.date || '',
    }));
  },

  // FAQs
  async getFaqs(): Promise<FAQItem[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('id', { ascending: true });
    if (error) return [];
    return (data || []).map((f: any) => ({
      question: f.question || '',
      answer: f.answer || '',
    }));
  }
};
