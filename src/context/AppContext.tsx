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
} from '../data/travelData';
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure server & Firestore backed state - initialize directly with default data structure
  const [businessInfo, setBusinessInfoState] = useState<BusinessInfo>(INITIAL_BIZ_INFO);
  const [services, setServicesState] = useState<TripService[]>(INITIAL_SERVICES);
  const [destinations, setDestinationsState] = useState<LombokDestination[]>(INITIAL_DESTINATIONS);
  const [galleryActivities, setGalleryActivitiesState] = useState<GalleryActivity[]>(INITIAL_GALLERY);
  const [estimatorConfig, setEstimatorConfigState] = useState<EstimatorConfig>(INITIAL_ESTIMATOR);
  const [bookings, setBookingsState] = useState<BookingInquiry[]>(INITIAL_BOOKINGS);

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
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const isInitialLoadedRef = useRef(false);

  // Clean up any legacy localStorage items to prevent stale data conflicts
  useEffect(() => {
    try {
      localStorage.removeItem('lombok_journey_biz_info_v1');
      localStorage.removeItem('lombok_journey_services_v1');
      localStorage.removeItem('lombok_journey_destinations_v1');
      localStorage.removeItem('lombok_journey_gallery_v1');
      localStorage.removeItem('lombok_journey_estimator_v1');
      localStorage.removeItem('lombok_journey_admin_auth_v1');
    } catch (e) {
      console.warn('Local storage cleanup note:', e);
    }
  }, []);

  // Helper to persist data to Cloud Firestore and Server Backend
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

    // 1. Save to Google Cloud Firestore (Globally persistent across all browsers & devices)
    try {
      const docRef = doc(db, 'app_data', 'global');
      await setDoc(docRef, { ...payload, updatedAt: nowIso }, { merge: true });
      setLastSyncedAt(nowIso);
    } catch (firestoreErr) {
      console.warn('Firestore cloud sync notice:', firestoreErr);
    }

    // 2. Also save to server backend as local file cache
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

  // 1. Real-Time Cloud Firestore Listener (Instantly syncs any change across all browsers and devices)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const docRef = doc(db, 'app_data', 'global');
      unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
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
          } else {
            // Document doesn't exist yet on Cloud Firestore: seed it now from server
            setDoc(docRef, {
              businessInfo: INITIAL_BIZ_INFO,
              services: INITIAL_SERVICES,
              destinations: INITIAL_DESTINATIONS,
              galleryActivities: INITIAL_GALLERY,
              estimatorConfig: INITIAL_ESTIMATOR,
              bookings: INITIAL_BOOKINGS,
              updatedAt: new Date().toISOString()
            }, { merge: true }).catch(console.error);
          }
          isInitialLoadedRef.current = true;
        },
        (error) => {
          console.warn('Firestore snapshot error, falling back to server API polling:', error);
          fetchGlobalServerData();
        }
      );
    } catch (err) {
      console.warn('Firestore initialization notice:', err);
      fetchGlobalServerData();
    }

    return () => {
      if (unsubscribe) unsubscribe();
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
    setBusinessInfoState((prev) => {
      const updated = { ...prev, ...newInfo };
      if (newInfo.phone) {
        const cleanPhone = newInfo.phone.replace(/[^0-9]/g, '');
        const formatted = cleanPhone.startsWith('0')
          ? '62' + cleanPhone.slice(1)
          : cleanPhone.startsWith('62')
          ? cleanPhone
          : '62' + cleanPhone;
        updated.waBaseUrl = `https://wa.me/${formatted}`;
      }
      syncToCloud({ businessInfo: updated });
      return updated;
    });
  };

  // Services Handlers
  const addService = (service: TripService) => {
    setServicesState((prev) => {
      const updated = [service, ...prev];
      syncToCloud({ services: updated });
      return updated;
    });
  };

  const updateService = (id: string, updated: Partial<TripService>) => {
    setServicesState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      syncToCloud({ services: next });
      return next;
    });
  };

  const deleteService = (id: string) => {
    setServicesState((prev) => {
      const next = prev.filter((item) => item.id !== id);
      syncToCloud({ services: next });
      return next;
    });
  };

  // Destinations Handlers
  const addDestination = (dest: LombokDestination) => {
    setDestinationsState((prev) => {
      const next = [dest, ...prev];
      syncToCloud({ destinations: next });
      return next;
    });
  };

  const updateDestination = (id: string, updated: Partial<LombokDestination>) => {
    setDestinationsState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      syncToCloud({ destinations: next });
      return next;
    });
  };

  const deleteDestination = (id: string) => {
    setDestinationsState((prev) => {
      const next = prev.filter((item) => item.id !== id);
      syncToCloud({ destinations: next });
      return next;
    });
  };

  // Gallery Activities Handlers
  const addGalleryActivity = (act: GalleryActivity) => {
    setGalleryActivitiesState((prev) => {
      const next = [act, ...prev];
      syncToCloud({ galleryActivities: next });
      return next;
    });
  };

  const updateGalleryActivity = (id: string, updated: Partial<GalleryActivity>) => {
    setGalleryActivitiesState((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      syncToCloud({ galleryActivities: next });
      return next;
    });
  };

  const deleteGalleryActivity = (id: string) => {
    setGalleryActivitiesState((prev) => {
      const next = prev.filter((item) => item.id !== id);
      syncToCloud({ galleryActivities: next });
      return next;
    });
  };

  // Estimator Config Handlers
  const updateEstimatorConfig = (config: Partial<EstimatorConfig>) => {
    setEstimatorConfigState((prev) => {
      const next = { ...prev, ...config };
      syncToCloud({ estimatorConfig: next });
      return next;
    });
  };

  // Booking Inquiry Handlers
  const addBooking = (booking: BookingInquiry) => {
    setBookingsState((prev) => {
      const next = [booking, ...prev.filter(b => b.id !== booking.id)];
      syncToCloud({ bookings: next });
      return next;
    });
  };

  const updateBooking = (id: string, updated: Partial<BookingInquiry>) => {
    setBookingsState((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...updated, updatedAt: new Date().toISOString() } : b));
      syncToCloud({ bookings: next });
      return next;
    });
  };

  const deleteBooking = (id: string) => {
    setBookingsState((prev) => {
      const next = prev.filter((b) => b.id !== id);
      syncToCloud({ bookings: next });
      return next;
    });
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
