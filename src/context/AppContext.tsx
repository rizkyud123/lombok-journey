import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BusinessInfo,
  TripService,
  LombokDestination,
  GalleryActivity,
  EstimatorConfig
} from '../types';
import {
  BUSINESS_INFO as INITIAL_BIZ_INFO,
  TRIP_SERVICES as INITIAL_SERVICES,
  DESTINATIONS as INITIAL_DESTINATIONS,
  ACTIVITY_GALLERY as INITIAL_GALLERY,
  DEFAULT_ESTIMATOR_CONFIG as INITIAL_ESTIMATOR
} from '../data/travelData';

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

  // Admin state
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;

  // Backup / Reset
  resetToDefaults: () => void;
  exportDataToJson: () => string;
  importDataFromJson: (jsonString: string) => boolean;
}

const STORAGE_KEYS = {
  BIZ_INFO: 'lombok_journey_biz_info_v1',
  SERVICES: 'lombok_journey_services_v1',
  DESTINATIONS: 'lombok_journey_destinations_v1',
  GALLERY: 'lombok_journey_gallery_v1',
  ESTIMATOR: 'lombok_journey_estimator_v1',
  AUTH: 'lombok_journey_admin_auth_v1'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or fallback to defaults
  const [businessInfo, setBusinessInfoState] = useState<BusinessInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BIZ_INFO);
      return saved ? JSON.parse(saved) : INITIAL_BIZ_INFO;
    } catch {
      return INITIAL_BIZ_INFO;
    }
  });

  const [services, setServicesState] = useState<TripService[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [destinations, setDestinationsState] = useState<LombokDestination[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
      return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
    } catch {
      return INITIAL_DESTINATIONS;
    }
  });

  const [galleryActivities, setGalleryActivitiesState] = useState<GalleryActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [estimatorConfig, setEstimatorConfigState] = useState<EstimatorConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ESTIMATOR);
      return saved ? JSON.parse(saved) : INITIAL_ESTIMATOR;
    } catch {
      return INITIAL_ESTIMATOR;
    }
  });

  // Admin Modal & Auth
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BIZ_INFO, JSON.stringify(businessInfo));
    } catch (e) {
      console.error('Failed to save business info', e);
    }
  }, [businessInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error('Failed to save services', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(destinations));
    } catch (e) {
      console.error('Failed to save destinations', e);
    }
  }, [destinations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(galleryActivities));
    } catch (e) {
      console.error('Failed to save gallery', e);
    }
  }, [galleryActivities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ESTIMATOR, JSON.stringify(estimatorConfig));
    } catch (e) {
      console.error('Failed to save estimator', e);
    }
  }, [estimatorConfig]);

  // Business Info Handlers
  const updateBusinessInfo = (newInfo: Partial<BusinessInfo>) => {
    setBusinessInfoState((prev) => {
      const updated = { ...prev, ...newInfo };
      // Keep waBaseUrl in sync with phone
      if (newInfo.phone) {
        const cleanPhone = newInfo.phone.replace(/[^0-9]/g, '');
        const formatted = cleanPhone.startsWith('0')
          ? '62' + cleanPhone.slice(1)
          : cleanPhone.startsWith('62')
          ? cleanPhone
          : '62' + cleanPhone;
        updated.waBaseUrl = `https://wa.me/${formatted}`;
      }
      return updated;
    });
  };

  // Services Handlers
  const addService = (service: TripService) => {
    setServicesState((prev) => [service, ...prev]);
  };

  const updateService = (id: string, updated: Partial<TripService>) => {
    setServicesState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteService = (id: string) => {
    setServicesState((prev) => prev.filter((item) => item.id !== id));
  };

  // Destinations Handlers
  const addDestination = (dest: LombokDestination) => {
    setDestinationsState((prev) => [dest, ...prev]);
  };

  const updateDestination = (id: string, updated: Partial<LombokDestination>) => {
    setDestinationsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteDestination = (id: string) => {
    setDestinationsState((prev) => prev.filter((item) => item.id !== id));
  };

  // Gallery Activities Handlers
  const addGalleryActivity = (act: GalleryActivity) => {
    setGalleryActivitiesState((prev) => [act, ...prev]);
  };

  const updateGalleryActivity = (id: string, updated: Partial<GalleryActivity>) => {
    setGalleryActivitiesState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteGalleryActivity = (id: string) => {
    setGalleryActivitiesState((prev) => prev.filter((item) => item.id !== id));
  };

  // Estimator Config Handlers
  const updateEstimatorConfig = (config: Partial<EstimatorConfig>) => {
    setEstimatorConfigState((prev) => ({ ...prev, ...config }));
  };

  // Admin Auth Handlers
  const adminLogin = (input: string): boolean => {
    const trimmed = input.trim();
    // Valid password "LombokJourney@2026", PIN "202608", plus backwards-compatible PINs
    if (
      trimmed === 'LombokJourney@2026' ||
      trimmed === '202608' ||
      trimmed === 'admin123' ||
      trimmed === '2201'
    ) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
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
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
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

    try {
      localStorage.removeItem(STORAGE_KEYS.BIZ_INFO);
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.DESTINATIONS);
      localStorage.removeItem(STORAGE_KEYS.GALLERY);
      localStorage.removeItem(STORAGE_KEYS.ESTIMATOR);
    } catch (e) {
      console.error(e);
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
        isAdminModalOpen,
        setIsAdminModalOpen,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
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
