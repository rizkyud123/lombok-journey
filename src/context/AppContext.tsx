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
  BUSINESS_INFO as INITIAL_BIZ_INFO,
  TRIP_SERVICES as INITIAL_SERVICES,
  DESTINATIONS as INITIAL_DESTINATIONS,
  ACTIVITY_GALLERY as INITIAL_GALLERY,
  DEFAULT_ESTIMATOR_CONFIG as INITIAL_ESTIMATOR,
  INITIAL_BOOKINGS
} from '../data';
import { db, doc, onSnapshot, setDoc, getDoc } from '../lib/firebase';

interface AppContextType {
  businessInfo: BusinessInfo;
  updateBusinessInfo: (newInfo: Partial<BusinessInfo>) => void;

  services: TripService[];
  addService: (service: TripService) => void;
  updateService: (id: string, updated: Partial<TripService>) => void;
  deleteService: (id: string) => void;

  destinations: LombokDestination[];
  addDestination: (dest: LombokDestination) => void;
  updateDestination: (id: string, updated: Partial<LombokDestination>) => void;
  deleteDestination: (id: string) => void;

  galleryActivities: GalleryActivity[];
  addGalleryActivity: (act: GalleryActivity) => void;
  updateGalleryActivity: (id: string, updated: Partial<GalleryActivity>) => void;
  deleteGalleryActivity: (id: string) => void;

  estimatorConfig: EstimatorConfig;
  updateEstimatorConfig: (config: Partial<EstimatorConfig>) => void;

  // Bookings & Trip Inquiry Tracking
  bookings: BookingInquiry[];
  addBooking: (booking: BookingInquiry) => void;
  updateBooking: (id: string, updated: Partial<BookingInquiry>) => void;
  deleteBooking: (id: string) => void;
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
  resetToDefaults: () => void;
  exportDataToJson: () => string;
  importDataFromJson: (jsonString: string) => boolean;
}

const AUTH_SESSION_KEY = 'lombok_journey_admin_session_v1';
const STORAGE_KEYS = {
  BIZ: 'lombok_journey_biz_info_v2',
  SERVICES: 'lombok_journey_services_v2',
  DESTINATIONS: 'lombok_journey_destinations_v2',
  GALLERY: 'lombok_journey_gallery_v2',
  ESTIMATOR: 'lombok_journey_estimator_v2',
  BOOKINGS: 'lombok_journey_bookings_v2',
  LAST_SYNC: 'lombok_journey_last_sync_v2'
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
  // Initialize immediately from localStorage cache for 0ms flicker, fallback to INITIAL data
  const [businessInfo, setBusinessInfoState] = useState<BusinessInfo>(() => safeGetLocal(STORAGE_KEYS.BIZ, INITIAL_BIZ_INFO));
  const [services, setServicesState] = useState<TripService[]>(() => safeGetLocal(STORAGE_KEYS.SERVICES, INITIAL_SERVICES));
  const [destinations, setDestinationsState] = useState<LombokDestination[]>(() => safeGetLocal(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS));
  const [galleryActivities, setGalleryActivitiesState] = useState<GalleryActivity[]>(() => safeGetLocal(STORAGE_KEYS.GALLERY, INITIAL_GALLERY));
  const [estimatorConfig, setEstimatorConfigState] = useState<EstimatorConfig>(() => safeGetLocal(STORAGE_KEYS.ESTIMATOR, INITIAL_ESTIMATOR));
  const [bookings, setBookingsState] = useState<BookingInquiry[]>(() => safeGetLocal(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS));

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
  const isInitialLoadedRef = useRef(false);

  // Helper to persist data to LocalStorage, Granular Cloud Firestore, and Server Backend
  const syncToCloud = async (payload: {
    businessInfo?: BusinessInfo;
    services?: TripService[];
    destinations?: LombokDestination[];
    galleryActivities?: GalleryActivity[];
    estimatorConfig?: EstimatorConfig;
    bookings?: BookingInquiry[];
  }) => {
    setIsSyncing(true);
    const nowIso = new Date().toISOString();

    // 1. Instant local persistence to ensure page refresh NEVER loses data
    if (payload.businessInfo) safeSetLocal(STORAGE_KEYS.BIZ, payload.businessInfo);
    if (payload.services) safeSetLocal(STORAGE_KEYS.SERVICES, payload.services);
    if (payload.destinations) safeSetLocal(STORAGE_KEYS.DESTINATIONS, payload.destinations);
    if (payload.galleryActivities) safeSetLocal(STORAGE_KEYS.GALLERY, payload.galleryActivities);
    if (payload.estimatorConfig) safeSetLocal(STORAGE_KEYS.ESTIMATOR, payload.estimatorConfig);
    if (payload.bookings) safeSetLocal(STORAGE_KEYS.BOOKINGS, payload.bookings);
    safeSetLocal(STORAGE_KEYS.LAST_SYNC, nowIso);
    setLastSyncedAt(nowIso);

    // 2. Save to Google Cloud Firestore (Granular documents to bypass 1MB quota + global fallback)
    try {
      const promises: Promise<any>[] = [];

      if (payload.galleryActivities) {
        promises.push(setDoc(doc(db, 'app_data', 'gallery'), { items: payload.galleryActivities, updatedAt: nowIso }, { merge: true }));
      }
      if (payload.services) {
        promises.push(setDoc(doc(db, 'app_data', 'services'), { items: payload.services, updatedAt: nowIso }, { merge: true }));
      }
      if (payload.destinations) {
        promises.push(setDoc(doc(db, 'app_data', 'destinations'), { items: payload.destinations, updatedAt: nowIso }, { merge: true }));
      }
      if (payload.businessInfo) {
        promises.push(setDoc(doc(db, 'app_data', 'business'), { data: payload.businessInfo, updatedAt: nowIso }, { merge: true }));
      }
      if (payload.estimatorConfig) {
        promises.push(setDoc(doc(db, 'app_data', 'estimator'), { data: payload.estimatorConfig, updatedAt: nowIso }, { merge: true }));
      }
      if (payload.bookings) {
        promises.push(setDoc(doc(db, 'app_data', 'bookings'), { items: payload.bookings, updatedAt: nowIso }, { merge: true }));
      }

      // Also update global summary document
      promises.push(setDoc(doc(db, 'app_data', 'global'), { ...payload, updatedAt: nowIso }, { merge: true }));

      await Promise.allSettled(promises);
    } catch (firestoreErr) {
      console.warn('Firestore cloud sync notice:', firestoreErr);
    }

    // 3. Also save to server backend as local file cache (if available)
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Backend server cache sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // 1. Real-Time Cloud Firestore Listeners (Instantly syncs any change across all browsers and devices)
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    try {
      // Listen to granular gallery document
      const unsubGallery = onSnapshot(doc(db, 'app_data', 'gallery'), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (Array.isArray(d.items) && d.items.length > 0) {
            setGalleryActivitiesState(d.items);
            safeSetLocal(STORAGE_KEYS.GALLERY, d.items);
          }
        }
      }, (err) => console.warn('Gallery snapshot notice:', err));
      unsubscribes.push(unsubGallery);

      // Listen to granular services document
      const unsubServices = onSnapshot(doc(db, 'app_data', 'services'), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (Array.isArray(d.items) && d.items.length > 0) {
            setServicesState(d.items);
            safeSetLocal(STORAGE_KEYS.SERVICES, d.items);
          }
        }
      }, (err) => console.warn('Services snapshot notice:', err));
      unsubscribes.push(unsubServices);

      // Listen to granular destinations document
      const unsubDest = onSnapshot(doc(db, 'app_data', 'destinations'), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (Array.isArray(d.items) && d.items.length > 0) {
            setDestinationsState(d.items);
            safeSetLocal(STORAGE_KEYS.DESTINATIONS, d.items);
          }
        }
      }, (err) => console.warn('Destinations snapshot notice:', err));
      unsubscribes.push(unsubDest);

      // Listen to global document as broad coordinator
      const docRef = doc(db, 'app_data', 'global');
      const unsubGlobal = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.businessInfo) {
              setBusinessInfoState(data.businessInfo);
              safeSetLocal(STORAGE_KEYS.BIZ, data.businessInfo);
            }
            if (Array.isArray(data.services) && data.services.length > 0) {
              setServicesState(data.services);
              safeSetLocal(STORAGE_KEYS.SERVICES, data.services);
            }
            if (Array.isArray(data.destinations) && data.destinations.length > 0) {
              setDestinationsState(data.destinations);
              safeSetLocal(STORAGE_KEYS.DESTINATIONS, data.destinations);
            }
            if (Array.isArray(data.galleryActivities) && data.galleryActivities.length > 0) {
              setGalleryActivitiesState(data.galleryActivities);
              safeSetLocal(STORAGE_KEYS.GALLERY, data.galleryActivities);
            }
            if (data.estimatorConfig) {
              setEstimatorConfigState(data.estimatorConfig);
              safeSetLocal(STORAGE_KEYS.ESTIMATOR, data.estimatorConfig);
            }
            if (Array.isArray(data.bookings)) {
              setBookingsState(data.bookings);
              safeSetLocal(STORAGE_KEYS.BOOKINGS, data.bookings);
            }
            if (data.updatedAt) {
              setLastSyncedAt(data.updatedAt);
              safeSetLocal(STORAGE_KEYS.LAST_SYNC, data.updatedAt);
            }
          }
          isInitialLoadedRef.current = true;
        },
        (error) => {
          console.warn('Firestore snapshot error, falling back to server API polling:', error);
          fetchGlobalServerData();
        }
      );
      unsubscribes.push(unsubGlobal);
    } catch (err) {
      console.warn('Firestore initialization notice:', err);
      fetchGlobalServerData();
    }

    return () => {
      unsubscribes.forEach(unsub => {
        try { unsub(); } catch {}
      });
    };
  }, []);

  // Fetch global server data with cache busting as complementary sync
  const fetchGlobalServerData = async (showLoading = false) => {
    if (showLoading) setIsSyncing(true);
    try {
      // First check Firestore direct
      try {
        const docRef = doc(db, 'app_data', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.businessInfo) setBusinessInfoState(data.businessInfo);
          if (Array.isArray(data.services)) setServicesState(data.services);
          if (Array.isArray(data.destinations)) setDestinationsState(data.destinations);
          if (Array.isArray(data.galleryActivities)) setGalleryActivitiesState(data.galleryActivities);
          if (data.estimatorConfig) setEstimatorConfigState(data.estimatorConfig);
          if (Array.isArray(data.bookings)) setBookingsState(data.bookings);
          if (data.updatedAt) setLastSyncedAt(data.updatedAt);
          if (showLoading) setIsSyncing(false);
          return;
        }
      } catch (fErr) {
        console.warn('Direct Firestore fetch note:', fErr);
      }

      const res = await fetch(`/api/data?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data;
          if (data.businessInfo) {
            setBusinessInfoState(data.businessInfo);
          }
          if (Array.isArray(data.services)) {
            setServicesState(data.services);
          }
          if (Array.isArray(data.destinations)) {
            setDestinationsState(data.destinations);
          }
          if (Array.isArray(data.galleryActivities)) {
            setGalleryActivitiesState(data.galleryActivities);
          }
          if (data.estimatorConfig) {
            setEstimatorConfigState(data.estimatorConfig);
          }
          if (Array.isArray(data.bookings)) {
            setBookingsState(data.bookings);
          }
          if (data.updatedAt) {
            setLastSyncedAt(data.updatedAt);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching global server data:', err);
    } finally {
      isInitialLoadedRef.current = true;
      if (showLoading) setIsSyncing(false);
    }
  };

  const syncNow = async () => {
    await fetchGlobalServerData(true);
  };

  // Business Info Handlers
  const updateBusinessInfo = (newInfo: Partial<BusinessInfo>) => {
    const updated = { ...businessInfo, ...newInfo };
    if (newInfo.phone) {
      const cleanPhone = newInfo.phone.replace(/[^0-9]/g, '');
      const formatted = cleanPhone.startsWith('0')
        ? '62' + cleanPhone.slice(1)
        : cleanPhone.startsWith('62')
        ? cleanPhone
        : '62' + cleanPhone;
      updated.waBaseUrl = `https://wa.me/${formatted}`;
    }
    setBusinessInfoState(updated);
    syncToCloud({ businessInfo: updated });
  };

  // Services Handlers
  const addService = (service: TripService) => {
    const updated = [service, ...services.filter((s) => s.id !== service.id)];
    setServicesState(updated);
    syncToCloud({ services: updated });
  };

  const updateService = (id: string, updated: Partial<TripService>) => {
    const next = services.map((item) => (item.id === id ? { ...item, ...updated } : item));
    setServicesState(next);
    syncToCloud({ services: next });
  };

  const deleteService = (id: string) => {
    const next = services.filter((item) => item.id !== id);
    setServicesState(next);
    syncToCloud({ services: next });
  };

  // Destinations Handlers
  const addDestination = (dest: LombokDestination) => {
    const next = [dest, ...destinations.filter((d) => d.id !== dest.id)];
    setDestinationsState(next);
    syncToCloud({ destinations: next });
  };

  const updateDestination = (id: string, updated: Partial<LombokDestination>) => {
    const next = destinations.map((item) => (item.id === id ? { ...item, ...updated } : item));
    setDestinationsState(next);
    syncToCloud({ destinations: next });
  };

  const deleteDestination = (id: string) => {
    const next = destinations.filter((item) => item.id !== id);
    setDestinationsState(next);
    syncToCloud({ destinations: next });
  };

  // Gallery Activities Handlers (Dokumentasi Trip & Video Real)
  const addGalleryActivity = (act: GalleryActivity) => {
    const next = [act, ...galleryActivities.filter((item) => item.id !== act.id)];
    setGalleryActivitiesState(next);
    syncToCloud({ galleryActivities: next });
  };

  const updateGalleryActivity = (id: string, updated: Partial<GalleryActivity>) => {
    const next = galleryActivities.map((item) => (item.id === id ? { ...item, ...updated } : item));
    setGalleryActivitiesState(next);
    syncToCloud({ galleryActivities: next });
  };

  const deleteGalleryActivity = (id: string) => {
    const next = galleryActivities.filter((item) => item.id !== id);
    setGalleryActivitiesState(next);
    syncToCloud({ galleryActivities: next });
  };

  // Estimator Config Handlers
  const updateEstimatorConfig = (config: Partial<EstimatorConfig>) => {
    const next = { ...estimatorConfig, ...config };
    setEstimatorConfigState(next);
    syncToCloud({ estimatorConfig: next });
  };

  // Booking Inquiry Handlers
  const addBooking = (booking: BookingInquiry) => {
    const next = [booking, ...bookings.filter((b) => b.id !== booking.id)];
    setBookingsState(next);
    syncToCloud({ bookings: next });
  };

  const updateBooking = (id: string, updated: Partial<BookingInquiry>) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, ...updated, updatedAt: new Date().toISOString() } : b));
    setBookingsState(next);
    syncToCloud({ bookings: next });
  };

  const deleteBooking = (id: string) => {
    const next = bookings.filter((b) => b.id !== id);
    setBookingsState(next);
    syncToCloud({ bookings: next });
  };

  const getBookingById = (id: string): BookingInquiry | undefined => {
    if (!id) return undefined;
    const cleanId = id.trim().toUpperCase();
    return bookings.find(
      (b) => b.id.toUpperCase() === cleanId || b.id.toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
    );
  };

  // Admin Auth Handlers
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

  // Reset to Defaults
  const resetToDefaults = () => {
    setBusinessInfoState(INITIAL_BIZ_INFO);
    setServicesState(INITIAL_SERVICES);
    setDestinationsState(INITIAL_DESTINATIONS);
    setGalleryActivitiesState(INITIAL_GALLERY);
    setEstimatorConfigState(INITIAL_ESTIMATOR);
    setBookingsState(INITIAL_BOOKINGS);

    // Sync reset to Cloud Firestore and Server
    syncToCloud({
      businessInfo: INITIAL_BIZ_INFO,
      services: INITIAL_SERVICES,
      destinations: INITIAL_DESTINATIONS,
      galleryActivities: INITIAL_GALLERY,
      estimatorConfig: INITIAL_ESTIMATOR,
      bookings: INITIAL_BOOKINGS
    });

    try {
      fetch('/api/data/reset', { method: 'POST' });
    } catch (e) {
      console.error('Failed to reset server data:', e);
    }
  };

  // Export / Import
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
      if (parsed.businessInfo) setBusinessInfoState(parsed.businessInfo);
      if (Array.isArray(parsed.services)) setServicesState(parsed.services);
      if (Array.isArray(parsed.destinations)) setDestinationsState(parsed.destinations);
      if (Array.isArray(parsed.galleryActivities)) setGalleryActivitiesState(parsed.galleryActivities);
      if (parsed.estimatorConfig) setEstimatorConfigState(parsed.estimatorConfig);
      if (Array.isArray(parsed.bookings)) setBookingsState(parsed.bookings);

      syncToCloud({
        businessInfo: parsed.businessInfo,
        services: parsed.services,
        destinations: parsed.destinations,
        galleryActivities: parsed.galleryActivities,
        estimatorConfig: parsed.estimatorConfig,
        bookings: parsed.bookings
      });
      return true;
    } catch (err) {
      console.error('Failed to import JSON data', err);
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

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
