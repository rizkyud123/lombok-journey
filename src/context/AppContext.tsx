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
import {
  db,
  doc,
  collection,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc
} from '../lib/firebase';

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
  BIZ: 'lombok_journey_biz_info_v3',
  SERVICES: 'lombok_journey_services_v3',
  DESTINATIONS: 'lombok_journey_destinations_v3',
  GALLERY: 'lombok_journey_gallery_v3',
  ESTIMATOR: 'lombok_journey_estimator_v3',
  BOOKINGS: 'lombok_journey_bookings_v3',
  LAST_SYNC: 'lombok_journey_last_sync_v3'
};

const safeGetLocal = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length > 0) return parsed as T;
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
  // Initialize immediately from localStorage cache for instant render, fallback to default seed data
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

  // Track if initial cloud sync has resolved
  const isGalleryInitializedRef = useRef(false);
  const isServicesInitializedRef = useRef(false);
  const isDestinationsInitializedRef = useRef(false);

  // Real-Time Cloud Firestore Multi-Device Listeners
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];
    const nowIso = new Date().toISOString();

    // 1. Real-Time Gallery Collection Listener (doc per activity)
    try {
      const galleryColl = collection(db, 'gallery_activities');
      const unsubGallery = onSnapshot(
        galleryColl,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: GalleryActivity[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as GalleryActivity;
              if (data && data.id) {
                items.push(data);
              }
            });
            if (items.length > 0) {
              setGalleryActivitiesState(items);
              safeSetLocal(STORAGE_KEYS.GALLERY, items);
              setLastSyncedAt(new Date().toISOString());
            }
            isGalleryInitializedRef.current = true;
          } else if (!isGalleryInitializedRef.current) {
            // First time seed to Firestore so all computers see the initial items
            isGalleryInitializedRef.current = true;
            INITIAL_GALLERY.forEach((item) => {
              setDoc(doc(db, 'gallery_activities', item.id), item).catch(console.warn);
            });
          }
        },
        (err) => console.warn('Firestore gallery snapshot notice:', err)
      );
      unsubscribes.push(unsubGallery);
    } catch (e) {
      console.warn('Gallery listener setup error:', e);
    }

    // 2. Real-Time Services Collection Listener
    try {
      const servicesColl = collection(db, 'trip_services');
      const unsubServices = onSnapshot(
        servicesColl,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: TripService[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as TripService;
              if (data && data.id) {
                items.push(data);
              }
            });
            if (items.length > 0) {
              setServicesState(items);
              safeSetLocal(STORAGE_KEYS.SERVICES, items);
            }
            isServicesInitializedRef.current = true;
          } else if (!isServicesInitializedRef.current) {
            isServicesInitializedRef.current = true;
            INITIAL_SERVICES.forEach((item) => {
              setDoc(doc(db, 'trip_services', item.id), item).catch(console.warn);
            });
          }
        },
        (err) => console.warn('Firestore services snapshot notice:', err)
      );
      unsubscribes.push(unsubServices);
    } catch (e) {
      console.warn('Services listener setup error:', e);
    }

    // 3. Real-Time Destinations Collection Listener
    try {
      const destColl = collection(db, 'destinations');
      const unsubDest = onSnapshot(
        destColl,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: LombokDestination[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as LombokDestination;
              if (data && data.id) {
                items.push(data);
              }
            });
            if (items.length > 0) {
              setDestinationsState(items);
              safeSetLocal(STORAGE_KEYS.DESTINATIONS, items);
            }
            isDestinationsInitializedRef.current = true;
          } else if (!isDestinationsInitializedRef.current) {
            isDestinationsInitializedRef.current = true;
            INITIAL_DESTINATIONS.forEach((item) => {
              setDoc(doc(db, 'destinations', item.id), item).catch(console.warn);
            });
          }
        },
        (err) => console.warn('Firestore destinations snapshot notice:', err)
      );
      unsubscribes.push(unsubDest);
    } catch (e) {
      console.warn('Destinations listener setup error:', e);
    }

    // 4. Real-Time Bookings Collection Listener
    try {
      const bookingsColl = collection(db, 'bookings');
      const unsubBookings = onSnapshot(
        bookingsColl,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: BookingInquiry[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as BookingInquiry;
              if (data && data.id) {
                items.push(data);
              }
            });
            setBookingsState(items);
            safeSetLocal(STORAGE_KEYS.BOOKINGS, items);
          }
        },
        (err) => console.warn('Firestore bookings snapshot notice:', err)
      );
      unsubscribes.push(unsubBookings);
    } catch (e) {
      console.warn('Bookings listener setup error:', e);
    }

    // 5. Real-Time Business Info Config Listener
    try {
      const bizDoc = doc(db, 'app_config', 'business');
      const unsubBiz = onSnapshot(
        bizDoc,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as BusinessInfo;
            if (data && data.name) {
              setBusinessInfoState(data);
              safeSetLocal(STORAGE_KEYS.BIZ, data);
            }
          } else {
            setDoc(bizDoc, INITIAL_BIZ_INFO).catch(console.warn);
          }
        },
        (err) => console.warn('Firestore business config notice:', err)
      );
      unsubscribes.push(unsubBiz);
    } catch (e) {
      console.warn('Business config listener setup error:', e);
    }

    // 6. Real-Time Estimator Config Listener
    try {
      const estDoc = doc(db, 'app_config', 'estimator');
      const unsubEst = onSnapshot(
        estDoc,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as EstimatorConfig;
            if (data && Array.isArray(data.tripTypes)) {
              setEstimatorConfigState(data);
              safeSetLocal(STORAGE_KEYS.ESTIMATOR, data);
            }
          } else {
            setDoc(estDoc, INITIAL_ESTIMATOR).catch(console.warn);
          }
        },
        (err) => console.warn('Firestore estimator config notice:', err)
      );
      unsubscribes.push(unsubEst);
    } catch (e) {
      console.warn('Estimator config listener setup error:', e);
    }

    return () => {
      unsubscribes.forEach((unsub) => {
        try {
          unsub();
        } catch {}
      });
    };
  }, []);

  // Gallery Activities Handlers (Dokumentasi Trip & Video Real)
  const addGalleryActivity = async (act: GalleryActivity) => {
    const next = [act, ...galleryActivities.filter((item) => item.id !== act.id)];
    setGalleryActivitiesState(next);
    safeSetLocal(STORAGE_KEYS.GALLERY, next);
    setIsSyncing(true);

    try {
      // 1. Direct Cloud Firestore document write (Per Activity Document = No 1MB limit & Instant Real-Time Push to Computer B)
      await setDoc(doc(db, 'gallery_activities', act.id), act);
      
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      safeSetLocal(STORAGE_KEYS.LAST_SYNC, nowIso);
    } catch (err) {
      console.warn('Failed writing gallery activity to Firestore:', err);
    } finally {
      setIsSyncing(false);
    }

    // Also sync to backend server if available
    try {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryActivities: next })
      }).catch(() => {});
    } catch {}
  };

  const updateGalleryActivity = async (id: string, updated: Partial<GalleryActivity>) => {
    const next = galleryActivities.map((item) => (item.id === id ? { ...item, ...updated } : item));
    const fullItem = next.find((item) => item.id === id);
    setGalleryActivitiesState(next);
    safeSetLocal(STORAGE_KEYS.GALLERY, next);
    setIsSyncing(true);

    try {
      if (fullItem) {
        await setDoc(doc(db, 'gallery_activities', id), fullItem, { merge: true });
      }
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      safeSetLocal(STORAGE_KEYS.LAST_SYNC, nowIso);
    } catch (err) {
      console.warn('Failed updating gallery activity on Firestore:', err);
    } finally {
      setIsSyncing(false);
    }

    try {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryActivities: next })
      }).catch(() => {});
    } catch {}
  };

  const deleteGalleryActivity = async (id: string) => {
    const next = galleryActivities.filter((item) => item.id !== id);
    setGalleryActivitiesState(next);
    safeSetLocal(STORAGE_KEYS.GALLERY, next);
    setIsSyncing(true);

    try {
      await deleteDoc(doc(db, 'gallery_activities', id));
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      safeSetLocal(STORAGE_KEYS.LAST_SYNC, nowIso);
    } catch (err) {
      console.warn('Failed deleting gallery activity on Firestore:', err);
    } finally {
      setIsSyncing(false);
    }

    try {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryActivities: next })
      }).catch(() => {});
    } catch {}
  };

  // Services Handlers
  const addService = async (service: TripService) => {
    const updated = [service, ...services.filter((s) => s.id !== service.id)];
    setServicesState(updated);
    safeSetLocal(STORAGE_KEYS.SERVICES, updated);

    try {
      await setDoc(doc(db, 'trip_services', service.id), service);
    } catch (err) {
      console.warn('Failed writing trip service to Firestore:', err);
    }
  };

  const updateService = async (id: string, updated: Partial<TripService>) => {
    const next = services.map((item) => (item.id === id ? { ...item, ...updated } : item));
    const fullItem = next.find((item) => item.id === id);
    setServicesState(next);
    safeSetLocal(STORAGE_KEYS.SERVICES, next);

    try {
      if (fullItem) {
        await setDoc(doc(db, 'trip_services', id), fullItem, { merge: true });
      }
    } catch (err) {
      console.warn('Failed updating service on Firestore:', err);
    }
  };

  const deleteService = async (id: string) => {
    const next = services.filter((item) => item.id !== id);
    setServicesState(next);
    safeSetLocal(STORAGE_KEYS.SERVICES, next);

    try {
      await deleteDoc(doc(db, 'trip_services', id));
    } catch (err) {
      console.warn('Failed deleting service on Firestore:', err);
    }
  };

  // Destinations Handlers
  const addDestination = async (dest: LombokDestination) => {
    const next = [dest, ...destinations.filter((d) => d.id !== dest.id)];
    setDestinationsState(next);
    safeSetLocal(STORAGE_KEYS.DESTINATIONS, next);

    try {
      await setDoc(doc(db, 'destinations', dest.id), dest);
    } catch (err) {
      console.warn('Failed writing destination to Firestore:', err);
    }
  };

  const updateDestination = async (id: string, updated: Partial<LombokDestination>) => {
    const next = destinations.map((item) => (item.id === id ? { ...item, ...updated } : item));
    const fullItem = next.find((item) => item.id === id);
    setDestinationsState(next);
    safeSetLocal(STORAGE_KEYS.DESTINATIONS, next);

    try {
      if (fullItem) {
        await setDoc(doc(db, 'destinations', id), fullItem, { merge: true });
      }
    } catch (err) {
      console.warn('Failed updating destination on Firestore:', err);
    }
  };

  const deleteDestination = async (id: string) => {
    const next = destinations.filter((item) => item.id !== id);
    setDestinationsState(next);
    safeSetLocal(STORAGE_KEYS.DESTINATIONS, next);

    try {
      await deleteDoc(doc(db, 'destinations', id));
    } catch (err) {
      console.warn('Failed deleting destination on Firestore:', err);
    }
  };

  // Business Info Handlers
  const updateBusinessInfo = async (newInfo: Partial<BusinessInfo>) => {
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
    safeSetLocal(STORAGE_KEYS.BIZ, updated);

    try {
      await setDoc(doc(db, 'app_config', 'business'), updated, { merge: true });
    } catch (err) {
      console.warn('Failed updating business config on Firestore:', err);
    }
  };

  // Estimator Config Handlers
  const updateEstimatorConfig = async (config: Partial<EstimatorConfig>) => {
    const next = { ...estimatorConfig, ...config };
    setEstimatorConfigState(next);
    safeSetLocal(STORAGE_KEYS.ESTIMATOR, next);

    try {
      await setDoc(doc(db, 'app_config', 'estimator'), next, { merge: true });
    } catch (err) {
      console.warn('Failed updating estimator config on Firestore:', err);
    }
  };

  // Booking Inquiry Handlers
  const addBooking = async (booking: BookingInquiry) => {
    const next = [booking, ...bookings.filter((b) => b.id !== booking.id)];
    setBookingsState(next);
    safeSetLocal(STORAGE_KEYS.BOOKINGS, next);

    try {
      await setDoc(doc(db, 'bookings', booking.id), booking);
    } catch (err) {
      console.warn('Failed writing booking to Firestore:', err);
    }
  };

  const updateBooking = async (id: string, updated: Partial<BookingInquiry>) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, ...updated, updatedAt: new Date().toISOString() } : b));
    const fullItem = next.find((b) => b.id === id);
    setBookingsState(next);
    safeSetLocal(STORAGE_KEYS.BOOKINGS, next);

    try {
      if (fullItem) {
        await setDoc(doc(db, 'bookings', id), fullItem, { merge: true });
      }
    } catch (err) {
      console.warn('Failed updating booking on Firestore:', err);
    }
  };

  const deleteBooking = async (id: string) => {
    const next = bookings.filter((b) => b.id !== id);
    setBookingsState(next);
    safeSetLocal(STORAGE_KEYS.BOOKINGS, next);

    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (err) {
      console.warn('Failed deleting booking on Firestore:', err);
    }
  };

  const getBookingById = (id: string): BookingInquiry | undefined => {
    if (!id) return undefined;
    const cleanId = id.trim().toUpperCase();
    return bookings.find(
      (b) => b.id.toUpperCase() === cleanId || b.id.toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
    );
  };

  // Manual Sync Trigger
  const syncNow = async () => {
    setIsSyncing(true);
    try {
      // Refresh all from Firestore
      const gSnap = await getDocs(collection(db, 'gallery_activities'));
      if (!gSnap.empty) {
        const items: GalleryActivity[] = [];
        gSnap.forEach((d) => items.push(d.data() as GalleryActivity));
        setGalleryActivitiesState(items);
        safeSetLocal(STORAGE_KEYS.GALLERY, items);
      }

      const sSnap = await getDocs(collection(db, 'trip_services'));
      if (!sSnap.empty) {
        const items: TripService[] = [];
        sSnap.forEach((d) => items.push(d.data() as TripService));
        setServicesState(items);
        safeSetLocal(STORAGE_KEYS.SERVICES, items);
      }

      const dSnap = await getDocs(collection(db, 'destinations'));
      if (!dSnap.empty) {
        const items: LombokDestination[] = [];
        dSnap.forEach((d) => items.push(d.data() as LombokDestination));
        setDestinationsState(items);
        safeSetLocal(STORAGE_KEYS.DESTINATIONS, items);
      }

      const bSnap = await getDocs(collection(db, 'bookings'));
      if (!bSnap.empty) {
        const items: BookingInquiry[] = [];
        bSnap.forEach((d) => items.push(d.data() as BookingInquiry));
        setBookingsState(items);
        safeSetLocal(STORAGE_KEYS.BOOKINGS, items);
      }

      const bizSnap = await getDoc(doc(db, 'app_config', 'business'));
      if (bizSnap.exists()) {
        setBusinessInfoState(bizSnap.data() as BusinessInfo);
        safeSetLocal(STORAGE_KEYS.BIZ, bizSnap.data());
      }

      const estSnap = await getDoc(doc(db, 'app_config', 'estimator'));
      if (estSnap.exists()) {
        setEstimatorConfigState(estSnap.data() as EstimatorConfig);
        safeSetLocal(STORAGE_KEYS.ESTIMATOR, estSnap.data());
      }

      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      safeSetLocal(STORAGE_KEYS.LAST_SYNC, nowIso);
    } catch (err) {
      console.warn('Manual sync error:', err);
    } finally {
      setIsSyncing(false);
    }
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
  const resetToDefaults = async () => {
    setBusinessInfoState(INITIAL_BIZ_INFO);
    setServicesState(INITIAL_SERVICES);
    setDestinationsState(INITIAL_DESTINATIONS);
    setGalleryActivitiesState(INITIAL_GALLERY);
    setEstimatorConfigState(INITIAL_ESTIMATOR);
    setBookingsState(INITIAL_BOOKINGS);

    safeSetLocal(STORAGE_KEYS.BIZ, INITIAL_BIZ_INFO);
    safeSetLocal(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    safeSetLocal(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
    safeSetLocal(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    safeSetLocal(STORAGE_KEYS.ESTIMATOR, INITIAL_ESTIMATOR);
    safeSetLocal(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);

    try {
      // Seed default items into Firestore collections
      INITIAL_GALLERY.forEach((item) => setDoc(doc(db, 'gallery_activities', item.id), item).catch(console.warn));
      INITIAL_SERVICES.forEach((item) => setDoc(doc(db, 'trip_services', item.id), item).catch(console.warn));
      INITIAL_DESTINATIONS.forEach((item) => setDoc(doc(db, 'destinations', item.id), item).catch(console.warn));
      setDoc(doc(db, 'app_config', 'business'), INITIAL_BIZ_INFO).catch(console.warn);
      setDoc(doc(db, 'app_config', 'estimator'), INITIAL_ESTIMATOR).catch(console.warn);
    } catch (e) {
      console.warn('Failed resetting Firestore data:', e);
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
      if (parsed.estimatorConfig) updateEstimatorConfig(parsed.estimatorConfig);
      if (Array.isArray(parsed.bookings)) {
        parsed.bookings.forEach((b: BookingInquiry) => addBooking(b));
      }
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

