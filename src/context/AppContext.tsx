import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  BusinessInfo,
  TripService,
  LombokDestination,
  GalleryActivity,
  EstimatorConfig,
  BookingInquiry
} from '../types';
import {
  BUSINESS_INFO as DEFAULT_BIZ_INFO,
  TRIP_SERVICES as DEFAULT_SERVICES,
  DESTINATIONS as DEFAULT_DESTINATIONS,
  ACTIVITY_GALLERY as DEFAULT_GALLERY,
  DEFAULT_ESTIMATOR_CONFIG as DEFAULT_ESTIMATOR
} from '../data';
import {
  supabase,
  dbService
} from '../lib/supabase';

interface AppContextType {
  businessInfo: BusinessInfo;
  updateBusinessInfo: (newInfo: Partial<BusinessInfo>) => Promise<void>;

  services: TripService[];
  addService: (service: TripService) => Promise<void>;
  updateService: (id: string, updated: Partial<TripService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  destinations: LombokDestination[];
  addDestination: (dest: LombokDestination) => Promise<void>;
  updateDestination: (id: string, updated: Partial<LombokDestination>) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;

  galleryActivities: GalleryActivity[];
  addGalleryActivity: (act: GalleryActivity) => Promise<void>;
  updateGalleryActivity: (id: string, updated: Partial<GalleryActivity>) => Promise<void>;
  deleteGalleryActivity: (id: string) => Promise<void>;

  estimatorConfig: EstimatorConfig;
  updateEstimatorConfig: (config: Partial<EstimatorConfig>) => Promise<void>;

  // Bookings & Trip Inquiry Tracking (Real Data Only)
  bookings: BookingInquiry[];
  addBooking: (booking: BookingInquiry) => Promise<void>;
  updateBooking: (id: string, updated: Partial<BookingInquiry>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  getBookingById: (id: string) => BookingInquiry | undefined;

  // Booking Modal
  isBookingStatusModalOpen: boolean;
  setIsBookingStatusModalOpen: (open: boolean) => void;
  targetBookingIdForCheck: string | null;
  setTargetBookingIdForCheck: (id: string | null) => void;

  // Admin state
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;

  // Real-time server sync state
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncNow: () => Promise<void>;

  // Backup / Reset
  resetToDefaults: () => Promise<void>;
  exportDataToJson: () => string;
  importDataFromJson: (jsonString: string) => boolean;
}

const AUTH_SESSION_KEY = 'lombok_journey_admin_session_v1';
const STORAGE_KEYS = {
  BIZ: 'lombok_journey_biz_info_sb_v1',
  SERVICES: 'lombok_journey_services_sb_v1',
  DESTINATIONS: 'lombok_journey_destinations_sb_v1',
  GALLERY: 'lombok_journey_gallery_sb_v1',
  ESTIMATOR: 'lombok_journey_estimator_sb_v1',
  BOOKINGS: 'lombok_journey_bookings_sb_v1',
  LAST_SYNC: 'lombok_journey_last_sync_sb_v1'
};

const safeGetLocal = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(fallback) && Array.isArray(parsed)) return parsed as T;
      if (!Array.isArray(fallback) && typeof parsed === 'object' && parsed !== null) return parsed as T;
    }
  } catch (e) {
    console.warn(`Error reading localStorage ${key}:`, e);
  }
  return fallback;
};

const safeSetLocal = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage ${key}:`, e);
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from local cache for instant smooth render while Supabase fetches live data
  const [businessInfo, setBusinessInfoState] = useState<BusinessInfo>(() => safeGetLocal(STORAGE_KEYS.BIZ, DEFAULT_BIZ_INFO));
  const [services, setServicesState] = useState<TripService[]>(() => safeGetLocal(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES));
  const [destinations, setDestinationsState] = useState<LombokDestination[]>(() => safeGetLocal(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS));
  const [galleryActivities, setGalleryActivitiesState] = useState<GalleryActivity[]>(() => safeGetLocal(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY));
  const [estimatorConfig, setEstimatorConfigState] = useState<EstimatorConfig>(() => safeGetLocal(STORAGE_KEYS.ESTIMATOR, DEFAULT_ESTIMATOR));
  
  // Real bookings only: starts as empty array, no mock bookings!
  const [bookings, setBookingsState] = useState<BookingInquiry[]>(() => safeGetLocal(STORAGE_KEYS.BOOKINGS, []));

  // Check Booking Status Modal state
  const [isBookingStatusModalOpen, setIsBookingStatusModalOpen] = useState(false);
  const [targetBookingIdForCheck, setTargetBookingIdForCheck] = useState<string | null>(null);

  // Admin Modal & Auth
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch {
      return null;
    }
  });

  // Load live data from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    const loadSupabaseData = async () => {
      setIsSyncing(true);
      try {
        const [
          servicesRes,
          destinationsRes,
          galleryRes,
          bookingsRes,
          bizRes,
          estimatorRes
        ] = await Promise.allSettled([
          dbService.getServices(),
          dbService.getDestinations(),
          dbService.getGalleryActivities(),
          dbService.getBookings(),
          dbService.getBusinessInfo(),
          dbService.getEstimatorConfig()
        ]);

        if (!isMounted) return;

        // Apply Services if available in Supabase
        if (servicesRes.status === 'fulfilled' && servicesRes.value && servicesRes.value.length > 0) {
          setServicesState(servicesRes.value);
          safeSetLocal(STORAGE_KEYS.SERVICES, servicesRes.value);
        }

        // Apply Destinations if available in Supabase
        if (destinationsRes.status === 'fulfilled' && destinationsRes.value && destinationsRes.value.length > 0) {
          setDestinationsState(destinationsRes.value);
          safeSetLocal(STORAGE_KEYS.DESTINATIONS, destinationsRes.value);
        }

        // Apply Gallery Activities if available in Supabase
        if (galleryRes.status === 'fulfilled' && galleryRes.value && galleryRes.value.length > 0) {
          setGalleryActivitiesState(galleryRes.value);
          safeSetLocal(STORAGE_KEYS.GALLERY, galleryRes.value);
        }

        // Apply Real Bookings (strictly real records from Supabase)
        if (bookingsRes.status === 'fulfilled' && bookingsRes.value) {
          setBookingsState(bookingsRes.value);
          safeSetLocal(STORAGE_KEYS.BOOKINGS, bookingsRes.value);
        }

        // Apply Business Info
        if (bizRes.status === 'fulfilled' && bizRes.value) {
          setBusinessInfoState(bizRes.value);
          safeSetLocal(STORAGE_KEYS.BIZ, bizRes.value);
        }

        // Apply Estimator Config
        if (estimatorRes.status === 'fulfilled' && estimatorRes.value) {
          setEstimatorConfigState(estimatorRes.value);
          safeSetLocal(STORAGE_KEYS.ESTIMATOR, estimatorRes.value);
        }

        const now = new Date().toISOString();
        setLastSyncedAt(now);
        safeSetLocal(STORAGE_KEYS.LAST_SYNC, now);
      } catch (err) {
        console.warn('Initial Supabase fetch note:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    loadSupabaseData();

    // -------------------------------------------------------------
    // REALTIME LIVE SUBSCRIPTION: Supabase Postgres Changes
    // When any computer/phone updates a row, changes instantly propagate!
    // -------------------------------------------------------------
    const channel = supabase
      .channel('public:realtime_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery_activities' },
        async () => {
          try {
            const data = await dbService.getGalleryActivities();
            if (isMounted && data) {
              setGalleryActivitiesState(data);
              safeSetLocal(STORAGE_KEYS.GALLERY, data);
            }
          } catch (e) {
            console.warn('Realtime gallery refresh error:', e);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trip_services' },
        async () => {
          try {
            const data = await dbService.getServices();
            if (isMounted && data) {
              setServicesState(data);
              safeSetLocal(STORAGE_KEYS.SERVICES, data);
            }
          } catch (e) {
            console.warn('Realtime services refresh error:', e);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'destinations' },
        async () => {
          try {
            const data = await dbService.getDestinations();
            if (isMounted && data) {
              setDestinationsState(data);
              safeSetLocal(STORAGE_KEYS.DESTINATIONS, data);
            }
          } catch (e) {
            console.warn('Realtime destinations refresh error:', e);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        async () => {
          try {
            const data = await dbService.getBookings();
            if (isMounted && data) {
              setBookingsState(data);
              safeSetLocal(STORAGE_KEYS.BOOKINGS, data);
            }
          } catch (e) {
            console.warn('Realtime bookings refresh error:', e);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'business_info' },
        async () => {
          try {
            const data = await dbService.getBusinessInfo();
            if (isMounted && data) {
              setBusinessInfoState(data);
              safeSetLocal(STORAGE_KEYS.BIZ, data);
            }
          } catch (e) {
            console.warn('Realtime business_info refresh error:', e);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'estimator_config' },
        async () => {
          try {
            const data = await dbService.getEstimatorConfig();
            if (isMounted && data) {
              setEstimatorConfigState(data);
              safeSetLocal(STORAGE_KEYS.ESTIMATOR, data);
            }
          } catch (e) {
            console.warn('Realtime estimator_config refresh error:', e);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // -------------------------------------------------------------
  // GALLERY ACTIVITIES HANDLERS
  // -------------------------------------------------------------
  const addGalleryActivity = async (act: GalleryActivity) => {
    const next = [act, ...galleryActivities.filter((item) => item.id !== act.id)];
    setGalleryActivitiesState(next);
    safeSetLocal(STORAGE_KEYS.GALLERY, next);
    setIsSyncing(true);

    try {
      await dbService.upsertGalleryActivity(act);
      console.log('✅ Successfully synced gallery activity to Supabase:', act.id);
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      safeSetLocal(STORAGE_KEYS.LAST_SYNC, nowIso);
    } catch (err) {
      console.error('❌ Failed saving gallery activity to Supabase:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateGalleryActivity = async (id: string, updated: Partial<GalleryActivity>) => {
    const next = galleryActivities.map((item) => (item.id === id ? { ...item, ...updated } : item));
    const fullItem = next.find((item) => item.id === id);
    setGalleryActivitiesState(next);
    safeSetLocal(STORAGE_KEYS.GALLERY, next);
    setIsSyncing(true);

    try {
      if (fullItem) {
        await dbService.upsertGalleryActivity(fullItem);
        console.log('✅ Successfully updated gallery activity on Supabase:', id);
      }
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      safeSetLocal(STORAGE_KEYS.LAST_SYNC, nowIso);
    } catch (err) {
      console.error('❌ Failed updating gallery activity on Supabase:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteGalleryActivity = async (id: string) => {
    const next = galleryActivities.filter((item) => item.id !== id);
    setGalleryActivitiesState(next);
    safeSetLocal(STORAGE_KEYS.GALLERY, next);
    setIsSyncing(true);

    try {
      await dbService.deleteGalleryActivity(id);
      console.log('✅ Successfully deleted gallery activity from Supabase:', id);
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      safeSetLocal(STORAGE_KEYS.LAST_SYNC, nowIso);
    } catch (err) {
      console.error('❌ Failed deleting gallery activity on Supabase:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // -------------------------------------------------------------
  // SERVICES HANDLERS
  // -------------------------------------------------------------
  const addService = async (service: TripService) => {
    const updated = [service, ...services.filter((s) => s.id !== service.id)];
    setServicesState(updated);
    safeSetLocal(STORAGE_KEYS.SERVICES, updated);

    try {
      await dbService.upsertService(service);
    } catch (err) {
      console.warn('Failed saving trip service to Supabase:', err);
    }
  };

  const updateService = async (id: string, updated: Partial<TripService>) => {
    const next = services.map((item) => (item.id === id ? { ...item, ...updated } : item));
    const fullItem = next.find((item) => item.id === id);
    setServicesState(next);
    safeSetLocal(STORAGE_KEYS.SERVICES, next);

    try {
      if (fullItem) {
        await dbService.upsertService(fullItem);
      }
    } catch (err) {
      console.warn('Failed updating service on Supabase:', err);
    }
  };

  const deleteService = async (id: string) => {
    const next = services.filter((item) => item.id !== id);
    setServicesState(next);
    safeSetLocal(STORAGE_KEYS.SERVICES, next);

    try {
      await dbService.deleteService(id);
    } catch (err) {
      console.warn('Failed deleting service on Supabase:', err);
    }
  };

  // -------------------------------------------------------------
  // DESTINATIONS HANDLERS
  // -------------------------------------------------------------
  const addDestination = async (dest: LombokDestination) => {
    const next = [dest, ...destinations.filter((d) => d.id !== dest.id)];
    setDestinationsState(next);
    safeSetLocal(STORAGE_KEYS.DESTINATIONS, next);

    try {
      await dbService.upsertDestination(dest);
    } catch (err) {
      console.warn('Failed saving destination to Supabase:', err);
    }
  };

  const updateDestination = async (id: string, updated: Partial<LombokDestination>) => {
    const next = destinations.map((item) => (item.id === id ? { ...item, ...updated } : item));
    const fullItem = next.find((item) => item.id === id);
    setDestinationsState(next);
    safeSetLocal(STORAGE_KEYS.DESTINATIONS, next);

    try {
      if (fullItem) {
        await dbService.upsertDestination(fullItem);
      }
    } catch (err) {
      console.warn('Failed updating destination on Supabase:', err);
    }
  };

  const deleteDestination = async (id: string) => {
    const next = destinations.filter((item) => item.id !== id);
    setDestinationsState(next);
    safeSetLocal(STORAGE_KEYS.DESTINATIONS, next);

    try {
      await dbService.deleteDestination(id);
    } catch (err) {
      console.warn('Failed deleting destination on Supabase:', err);
    }
  };

  // -------------------------------------------------------------
  // BUSINESS INFO HANDLER
  // -------------------------------------------------------------
  const updateBusinessInfo = async (newInfo: Partial<BusinessInfo>) => {
    const updated = { ...businessInfo, ...newInfo };
    setBusinessInfoState(updated);
    safeSetLocal(STORAGE_KEYS.BIZ, updated);

    try {
      await dbService.upsertBusinessInfo(updated);
    } catch (err) {
      console.warn('Failed updating business config on Supabase:', err);
    }
  };

  // -------------------------------------------------------------
  // ESTIMATOR CONFIG HANDLER
  // -------------------------------------------------------------
  const updateEstimatorConfig = async (config: Partial<EstimatorConfig>) => {
    const next = { ...estimatorConfig, ...config };
    setEstimatorConfigState(next);
    safeSetLocal(STORAGE_KEYS.ESTIMATOR, next);

    try {
      await dbService.upsertEstimatorConfig(next);
    } catch (err) {
      console.warn('Failed updating estimator config on Supabase:', err);
    }
  };

  // -------------------------------------------------------------
  // BOOKING INQUIRY HANDLERS (Real Data Only)
  // -------------------------------------------------------------
  const addBooking = async (booking: BookingInquiry) => {
    const next = [booking, ...bookings.filter((b) => b.id !== booking.id)];
    setBookingsState(next);
    safeSetLocal(STORAGE_KEYS.BOOKINGS, next);

    try {
      await dbService.upsertBooking(booking);
      console.log('✅ Successfully inserted real booking into Supabase:', booking.id);
    } catch (err) {
      console.error('❌ Failed writing booking to Supabase:', err);
    }
  };

  const updateBooking = async (id: string, updated: Partial<BookingInquiry>) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, ...updated, updatedAt: new Date().toISOString() } : b));
    const fullItem = next.find((b) => b.id === id);
    setBookingsState(next);
    safeSetLocal(STORAGE_KEYS.BOOKINGS, next);

    try {
      if (fullItem) {
        await dbService.upsertBooking(fullItem);
        console.log('✅ Successfully updated booking in Supabase:', id);
      }
    } catch (err) {
      console.error('❌ Failed updating booking in Supabase:', err);
    }
  };

  const deleteBooking = async (id: string) => {
    const next = bookings.filter((b) => b.id !== id);
    setBookingsState(next);
    safeSetLocal(STORAGE_KEYS.BOOKINGS, next);

    try {
      await dbService.deleteBooking(id);
      console.log('✅ Successfully deleted booking from Supabase:', id);
    } catch (err) {
      console.error('❌ Failed deleting booking from Supabase:', err);
    }
  };

  const getBookingById = (id: string): BookingInquiry | undefined => {
    if (!id) return undefined;
    const cleanId = id.trim().toUpperCase();
    return bookings.find(
      (b) => b.id.toUpperCase() === cleanId || b.id.toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
    );
  };

  // -------------------------------------------------------------
  // MANUAL SYNC TRIGGER
  // -------------------------------------------------------------
  const syncNow = async () => {
    setIsSyncing(true);
    try {
      const [
        servicesData,
        destinationsData,
        galleryData,
        bookingsData,
        bizData,
        estData
      ] = await Promise.all([
        dbService.getServices(),
        dbService.getDestinations(),
        dbService.getGalleryActivities(),
        dbService.getBookings(),
        dbService.getBusinessInfo(),
        dbService.getEstimatorConfig()
      ]);

      if (servicesData && servicesData.length > 0) {
        setServicesState(servicesData);
        safeSetLocal(STORAGE_KEYS.SERVICES, servicesData);
      }
      if (destinationsData && destinationsData.length > 0) {
        setDestinationsState(destinationsData);
        safeSetLocal(STORAGE_KEYS.DESTINATIONS, destinationsData);
      }
      if (galleryData && galleryData.length > 0) {
        setGalleryActivitiesState(galleryData);
        safeSetLocal(STORAGE_KEYS.GALLERY, galleryData);
      }
      if (bookingsData) {
        setBookingsState(bookingsData);
        safeSetLocal(STORAGE_KEYS.BOOKINGS, bookingsData);
      }
      if (bizData) {
        setBusinessInfoState(bizData);
        safeSetLocal(STORAGE_KEYS.BIZ, bizData);
      }
      if (estData) {
        setEstimatorConfigState(estData);
        safeSetLocal(STORAGE_KEYS.ESTIMATOR, estData);
      }

      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      safeSetLocal(STORAGE_KEYS.LAST_SYNC, nowIso);
    } catch (err) {
      console.warn('Manual sync error from Supabase:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // -------------------------------------------------------------
  // ADMIN AUTH HANDLERS
  // -------------------------------------------------------------
  const adminLogin = (input: string): boolean => {
    const trimmed = input.trim();
    if (
      trimmed === 'LombokJourney@2026' ||
      trimmed === '202608' ||
      trimmed === 'admin123' ||
      trimmed === '2201'
    ) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  // -------------------------------------------------------------
  // RESET / RE-SEED TO SUPABASE
  // -------------------------------------------------------------
  const resetToDefaults = async () => {
    setBusinessInfoState(DEFAULT_BIZ_INFO);
    setServicesState(DEFAULT_SERVICES);
    setDestinationsState(DEFAULT_DESTINATIONS);
    setGalleryActivitiesState(DEFAULT_GALLERY);
    setEstimatorConfigState(DEFAULT_ESTIMATOR);
    setBookingsState([]); // Keep bookings strictly empty of mock data!

    safeSetLocal(STORAGE_KEYS.BIZ, DEFAULT_BIZ_INFO);
    safeSetLocal(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    safeSetLocal(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS);
    safeSetLocal(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    safeSetLocal(STORAGE_KEYS.ESTIMATOR, DEFAULT_ESTIMATOR);
    safeSetLocal(STORAGE_KEYS.BOOKINGS, []);

    try {
      await Promise.all([
        dbService.upsertBusinessInfo(DEFAULT_BIZ_INFO),
        dbService.upsertEstimatorConfig(DEFAULT_ESTIMATOR),
        ...DEFAULT_SERVICES.map((s) => dbService.upsertService(s)),
        ...DEFAULT_DESTINATIONS.map((d) => dbService.upsertDestination(d)),
        ...DEFAULT_GALLERY.map((g) => dbService.upsertGalleryActivity(g))
      ]);
      console.log('✅ Real defaults synchronized with Supabase');
    } catch (e) {
      console.warn('Failed resetting data on Supabase:', e);
    }
  };

  // -------------------------------------------------------------
  // EXPORT / IMPORT
  // -------------------------------------------------------------
  const exportDataToJson = (): string => {
    const data = {
      businessInfo,
      services,
      destinations,
      galleryActivities,
      estimatorConfig,
      bookings,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataFromJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.businessInfo) updateBusinessInfo(parsed.businessInfo);
      if (Array.isArray(parsed.services)) {
        parsed.services.forEach((s: TripService) => addService(s));
      }
      if (Array.isArray(parsed.destinations)) {
        parsed.destinations.forEach((d: LombokDestination) => addDestination(d));
      }
      if (Array.isArray(parsed.galleryActivities)) {
        parsed.galleryActivities.forEach((g: GalleryActivity) => addGalleryActivity(g));
      }
      if (Array.isArray(parsed.bookings)) {
        parsed.bookings.forEach((b: BookingInquiry) => addBooking(b));
      }
      if (parsed.estimatorConfig) updateEstimatorConfig(parsed.estimatorConfig);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        businessInfo,
        updateBusinessInfo,
        services,
        addService,
        updateService,
        deleteService,
        destinations,
        addDestination,
        updateDestination,
        deleteDestination,
        galleryActivities,
        addGalleryActivity,
        updateGalleryActivity,
        deleteGalleryActivity,
        estimatorConfig,
        updateEstimatorConfig,
        bookings,
        addBooking,
        updateBooking,
        deleteBooking,
        getBookingById,
        isBookingStatusModalOpen,
        setIsBookingStatusModalOpen,
        targetBookingIdForCheck,
        setTargetBookingIdForCheck,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        isSyncing,
        lastSyncedAt,
        syncNow,
        resetToDefaults,
        exportDataToJson,
        importDataFromJson
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
