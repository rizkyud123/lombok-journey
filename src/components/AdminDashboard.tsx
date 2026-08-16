import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TripService, LombokDestination, GalleryActivity, BookingInquiry, BookingStatusType } from '../types';
import { stampWatermarkToImage } from '../utils/watermark';
import { parseVideoUrl } from '../utils/videoEmbed';
import { uploadMediaToServer } from '../utils/mediaUpload';
import {
  X,
  Lock,
  Unlock,
  Settings,
  Phone,
  Mail,
  Instagram,
  MapPin,
  Sparkles,
  Layers,
  Compass,
  Camera,
  Calculator,
  Plus,
  Trash2,
  Edit2,
  Check,
  Upload,
  Download,
  RotateCcw,
  Eye,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Globe,
  ClipboardList,
  Search,
  User,
  Clock,
  Car,
  ShieldCheck,
  Play,
  Video,
  Film,
  Link2,
  FileVideo
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
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
  } = useApp();

  const [activeTab, setActiveTab] = useState<'contact' | 'services' | 'destinations' | 'gallery' | 'estimator' | 'bookings' | 'backup'>('bookings');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Bookings Admin State
  const [editingBooking, setEditingBooking] = useState<BookingInquiry | null>(null);
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState<Partial<BookingInquiry>>({});
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');

  // Business Info Form State
  const [bizForm, setBizForm] = useState(businessInfo);

  // Service Edit/Create State
  const [editingService, setEditingService] = useState<TripService | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<TripService>>({});

  // Destination Edit/Create State
  const [editingDest, setEditingDest] = useState<LombokDestination | null>(null);
  const [isAddingDest, setIsAddingDest] = useState(false);
  const [destForm, setDestForm] = useState<Partial<LombokDestination>>({});

  // Gallery Edit/Create State
  const [editingGallery, setEditingGallery] = useState<GalleryActivity | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryActivity>>({});
  const [galleryMediaType, setGalleryMediaType] = useState<'image' | 'video'>('image');
  const [videoInputMode, setVideoInputMode] = useState<'link' | 'upload'>('link');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [previewingVideoModal, setPreviewingVideoModal] = useState<GalleryActivity | null>(null);

  // Estimator Form State
  const [newTripType, setNewTripType] = useState('');
  const [newSpot, setNewSpot] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newPax, setNewPax] = useState('');

  // Delete Confirmation Popup State (Ya / Tidak)
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    itemTypeLabel: string;
    description?: string;
    confirmButtonText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    itemTypeLabel: '',
    description: '',
    confirmButtonText: 'Ya, Hapus Sekarang',
    onConfirm: () => {}
  });

  const promptDelete = ({
    title,
    itemName,
    itemTypeLabel,
    description,
    confirmButtonText = 'Ya, Hapus Sekarang',
    onConfirm
  }: {
    title: string;
    itemName: string;
    itemTypeLabel: string;
    description?: string;
    confirmButtonText?: string;
    onConfirm: () => void;
  }) => {
    setDeleteModalState({
      isOpen: true,
      title,
      itemName,
      itemTypeLabel,
      description,
      confirmButtonText,
      onConfirm: () => {
        onConfirm();
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // File Upload Ref for Backup & Media
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isAdminModalOpen) return null;

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(pinInput)) {
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  // Save Contact / Business Info
  const handleSaveBizInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessInfo(bizForm);
    showNotification('Kontak & info bisnis berhasil diperbarui dan tersimpan di server global!');
  };

  // --- SERVICE HANDLERS ---
  const handleStartAddService = () => {
    setIsAddingService(true);
    setEditingService(null);
    setServiceForm({
      id: `trip-${Date.now()}`,
      title: '',
      tagline: '',
      badge: 'Paket Baru',
      priceStart: 'Mulai Rp 450.000 / pax',
      description: '',
      features: ['Pick up hotel', 'Spot wisata utama', 'Sunset point', 'Makan malam'],
      includes: ['Mobil AC + BBM', 'Driver / Guide Lokal', 'Tiket Masuk & Parkir', 'Air Mineral'],
      popularSpot: ['Lombok'],
      recommendedFor: 'Semua Wisatawan',
      iconName: 'Compass',
      bgImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop'
    });
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.id) return;

    if (isAddingService) {
      addService(serviceForm as TripService);
      showNotification('Paket Layanan Trip baru berhasil disimpan ke server global!');
    } else if (editingService) {
      updateService(editingService.id, serviceForm);
      showNotification('Paket Layanan Trip berhasil diperbarui di server global!');
    }
    setIsAddingService(false);
    setEditingService(null);
  };

  // --- DESTINATION HANDLERS ---
  const handleStartAddDest = () => {
    setIsAddingDest(true);
    setEditingDest(null);
    setDestForm({
      id: `dest-${Date.now()}`,
      name: '',
      category: 'Pantai & Gili',
      location: 'Lombok',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
      description: '',
      highlight: 'Spot Foto & Sunset',
      bestTime: '08:00 - 18:00 WITA'
    });
  };

  const handleSaveDest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destForm.name || !destForm.id) return;

    if (isAddingDest) {
      addDestination(destForm as LombokDestination);
      showNotification('Destinasi wisata baru berhasil disimpan ke server global!');
    } else if (editingDest) {
      updateDestination(editingDest.id, destForm);
      showNotification('Destinasi wisata berhasil diperbarui di server global!');
    }
    setIsAddingDest(false);
    setEditingDest(null);
  };

  // --- GALLERY MEDIA, VIDEO & WATERMARK HANDLERS ---
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      // Auto stamp watermark @lombokjourney onto the photo
      const watermarkedDataUrl = await stampWatermarkToImage(file, '@lombokjourney');
      setPhotoPreview(watermarkedDataUrl);

      // Upload to server disk storage to get lightweight permanent URL
      const uploadedUrl = await uploadMediaToServer(watermarkedDataUrl, file.name, 'gallery');
      setGalleryForm((prev) => ({ ...prev, image: uploadedUrl }));
      showNotification('Foto berhasil diupload ke server & disematkan watermark @lombokjourney!');
    } catch (err) {
      console.error(err);
      alert('Gagal memproses foto. Silakan coba gambar lain.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingVideo(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const videoDataUrl = reader.result as string;
        // Upload video file directly to server
        const uploadedVideoUrl = await uploadMediaToServer(videoDataUrl, file.name, 'video');
        setGalleryForm((prev) => ({
          ...prev,
          mediaType: 'video',
          videoUrl: uploadedVideoUrl,
          videoSource: 'upload',
          image: prev.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop'
        }));
        showNotification('File video berhasil tersimpan di server galeri!');
      };
      reader.onerror = () => {
        alert('Gagal membaca file video. Pastikan format .mp4 atau .webm.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses video.');
    } finally {
      setIsProcessingVideo(false);
    }
  };

  const handleVideoUrlInput = (url: string) => {
    const parsed = parseVideoUrl(url);
    setGalleryForm((prev) => {
      const updated = {
        ...prev,
        mediaType: 'video' as const,
        videoUrl: url,
        videoSource: (parsed.type === 'unknown' ? 'direct' : parsed.type) as any
      };
      // If YouTube thumbnail exists and no custom photo yet, auto-populate cover thumbnail
      if (parsed.thumbnailUrl && (!prev.image || prev.image.includes('unsplash'))) {
        updated.image = parsed.thumbnailUrl;
        setPhotoPreview(parsed.thumbnailUrl);
      }
      return updated;
    });
  };

  const handleStartAddGallery = () => {
    setIsAddingGallery(true);
    setEditingGallery(null);
    setPhotoPreview('');
    setGalleryMediaType('image');
    setVideoInputMode('link');
    setGalleryForm({
      id: `act-${Date.now()}`,
      title: '',
      category: 'Snorkeling & Bahari',
      location: 'Lombok',
      image: '',
      description: '',
      activityDate: 'Agustus 2026',
      packageTag: 'Paket Experience Trip',
      mediaType: 'image',
      videoUrl: '',
      videoDuration: '0:45'
    });
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.id) {
      alert('Mohon masukkan judul kegiatan!');
      return;
    }

    const isVideo = galleryMediaType === 'video';

    if (isVideo && !galleryForm.videoUrl) {
      alert('Mohon masukkan link video sosmed atau upload file video!');
      return;
    }

    // Default image fallback if user didn't upload specific thumbnail
    let finalImage = photoPreview || galleryForm.image;
    if (!finalImage) {
      if (isVideo) {
        const parsed = parseVideoUrl(galleryForm.videoUrl || '');
        finalImage = parsed.thumbnailUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop';
      } else {
        alert('Mohon upload foto kegiatan terlebih dahulu!');
        return;
      }
    }

    // Ensure photo or video data URL is uploaded to server
    if (finalImage.startsWith('data:image/')) {
      finalImage = await uploadMediaToServer(finalImage, `${galleryForm.id}.jpg`, 'gallery');
    }

    let finalVideoUrl = isVideo ? galleryForm.videoUrl : undefined;
    if (finalVideoUrl && finalVideoUrl.startsWith('data:video/')) {
      finalVideoUrl = await uploadMediaToServer(finalVideoUrl, `${galleryForm.id}-video.mp4`, 'video');
    }

    const payload: GalleryActivity = {
      id: galleryForm.id,
      title: galleryForm.title,
      category: (galleryForm.category as any) || 'Snorkeling & Bahari',
      location: galleryForm.location || 'Lombok',
      image: finalImage,
      description: galleryForm.description || '',
      activityDate: galleryForm.activityDate || 'Agustus 2026',
      packageTag: galleryForm.packageTag || 'Paket Experience Trip',
      mediaType: galleryMediaType,
      ...(isVideo && finalVideoUrl ? { videoUrl: finalVideoUrl } : {}),
      ...(isVideo && galleryForm.videoSource ? { videoSource: galleryForm.videoSource } : {}),
      ...(isVideo && galleryForm.videoDuration ? { videoDuration: galleryForm.videoDuration } : {})
    };

    if (editingGallery) {
      await updateGalleryActivity(editingGallery.id, payload);
      showNotification(`${isVideo ? 'Video trip' : 'Foto'} "${payload.title}" berhasil diperbarui dan tersimpan di Cloud Firestore!`);
    } else {
      await addGalleryActivity(payload);
      showNotification(`${isVideo ? 'Video trip' : 'Foto'} baru "${payload.title}" berhasil disimpan ke Cloud Firestore & live di semua perangkat!`);
    }
    setIsAddingGallery(false);
    setEditingGallery(null);
    setPhotoPreview('');
  };

  // --- BOOKING MANAGEMENT HANDLERS ---
  const handleStartAddBooking = () => {
    setIsAddingBooking(true);
    setEditingBooking(null);
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setBookingForm({
      id: `LJ-2026-${randomCode}`,
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      tripType: 'Paket Experience Trip',
      duration: 'Full Day (1 Hari)',
      pax: '3-5 Orang (Keluarga Kecil / Teman)',
      spots: ['Desa Sade (foto baju adat)', 'Pantai Kuta Mandalika'],
      travelDate: 'Agustus 2026',
      totalEstimate: 'Rp 1.350.000',
      status: 'Menunggu Konfirmasi',
      notes: '',
      guideName: 'Kak Hairul (Guide Sasak Asli)',
      driverPhone: '0888-9163-745',
      pickupLocation: 'Hotel Area Lombok / Bandara',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.id || !bookingForm.guestName || !bookingForm.guestPhone) {
      alert('Mohon isi ID Reservasi, Nama Tamu, dan No. Kontak Tamu!');
      return;
    }

    if (isAddingBooking) {
      addBooking(bookingForm as BookingInquiry);
      showNotification(`Booking ID ${bookingForm.id} berhasil ditambahkan dan disimpan ke cloud!`);
    } else if (editingBooking) {
      updateBooking(editingBooking.id, bookingForm);
      showNotification(`Booking ID ${editingBooking.id} berhasil diperbarui statusnya!`);
    }
    setIsAddingBooking(false);
    setEditingBooking(null);
  };

  const handleQuickStatusChange = (bookingId: string, newStatus: BookingStatusType) => {
    updateBooking(bookingId, { status: newStatus });
    showNotification(`Status Booking ${bookingId} diubah menjadi "${newStatus}"!`);
  };

  // --- ESTIMATOR HANDLERS ---
  const handleAddTripType = () => {
    if (!newTripType.trim()) return;
    if (estimatorConfig.tripTypes.includes(newTripType.trim())) return;
    updateEstimatorConfig({
      tripTypes: [...estimatorConfig.tripTypes, newTripType.trim()]
    });
    setNewTripType('');
    showNotification('Pilihan paket di kalkulator berhasil ditambahkan!');
  };

  const handleDeleteTripType = (typeToDelete: string) => {
    updateEstimatorConfig({
      tripTypes: estimatorConfig.tripTypes.filter((t) => t !== typeToDelete)
    });
    showNotification('Pilihan paket dihapus dari kalkulator.');
  };

  const handleAddSpot = () => {
    if (!newSpot.trim()) return;
    if (estimatorConfig.availableSpots.includes(newSpot.trim())) return;
    updateEstimatorConfig({
      availableSpots: [...estimatorConfig.availableSpots, newSpot.trim()]
    });
    setNewSpot('');
    showNotification('Spot wisata baru berhasil ditambahkan ke kalkulator!');
  };

  const handleDeleteSpot = (spotToDelete: string) => {
    updateEstimatorConfig({
      availableSpots: estimatorConfig.availableSpots.filter((s) => s !== spotToDelete)
    });
    showNotification('Spot wisata dihapus dari kalkulator.');
  };

  // --- BACKUP / RESTORE HANDLERS ---
  const handleDownloadBackup = () => {
    const jsonStr = exportDataToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lombok-journey-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('File backup JSON berhasil didownload!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJson(content);
        if (success) {
          showNotification('Data backup berhasil diimpor ke aplikasi!');
        } else {
          alert('Format file JSON tidak valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    promptDelete({
      title: 'Reset Seluruh Data Website (Factory Reset)',
      itemTypeLabel: 'Reset Pabrik (Default)',
      itemName: 'Seluruh Pengaturan, Layanan, Foto & Destinasi Lombok Journey',
      description: 'Peringatan: Seluruh perubahan kontak, layanan paket, foto/video galeri, dan kalkulator akan dikembalikan ke data bawaan awal Lombok Journey. Perubahan yang belum dibackup akan hilang.',
      confirmButtonText: 'Ya, Reset Semua Data',
      onConfirm: () => {
        resetToDefaults();
        setBizForm(businessInfo);
        showNotification('Seluruh data berhasil direset ke pengaturan awal!');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full h-[90vh] max-h-[850px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#112D4E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#112D4E] flex items-center justify-center font-bold shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-playfair text-lg sm:text-xl font-bold tracking-tight">
                  Dashboard Admin Lombok Journey
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-sans font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Server Sync Aktif (Semua Browser)
                </span>
              </div>
              <p className="text-xs text-slate-300 font-light">
                Perubahan tersimpan terpusat di server & otomatis terupdate untuk seluruh pengunjung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <>
                <button
                  onClick={() => {
                    syncNow();
                    showNotification('Data tersinkronisasi dengan server global!');
                  }}
                  disabled={isSyncing}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                  title="Sinkronkan data dengan server sekarang"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#30E3CA] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Sinkronisasi...' : 'Sinkronkan'}</span>
                </button>

                <button
                  onClick={adminLogout}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                  title="Keluar dari sesi admin"
                >
                  <Unlock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Kunci Admin</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Tutup Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white text-xs px-6 py-2.5 flex items-center gap-2 font-medium shrink-0 animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Content Body */}
        {!isAdminAuthenticated ? (
          /* LOGIN GATE VIEW */
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
              <div className="w-16 h-16 bg-[#112D4E]/10 rounded-2xl flex items-center justify-center mx-auto text-[#112D4E]">
                <Lock className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-playfair text-2xl font-bold text-[#112D4E]">
                  Akses Admin Dashboard
                </h3>
                <p className="text-xs text-slate-500 font-light">
                  Masukkan Password atau PIN untuk membuka akses kelola data website Lombok Journey.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Password atau PIN Admin"
                    className="w-full text-center tracking-widest text-base sm:text-lg font-bold py-3 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#112D4E]"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Password / PIN Salah! Masukkan password atau PIN yang benar.</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#112D4E] hover:bg-[#1a3a63] text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Buka Dashboard</span>
                </button>
              </form>

              <div className="pt-2 text-[11px] text-slate-400 bg-slate-100 p-2.5 rounded-xl text-center">
                🔒 <em>Gunakan Password: <strong>LombokJourney@2026</strong> atau PIN: <strong>202608</strong></em>
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD VIEW */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-white border-r border-slate-200 p-3 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'bg-[#112D4E] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ClipboardList className="w-4 h-4 text-[#30E3CA]" />
                <span className="flex items-center justify-between w-full">
                  <span>Kelola Status Booking</span>
                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#30E3CA] text-[#112D4E] text-[10px] font-black rounded-full">
                    {bookings.length}
                  </span>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap ${
                  activeTab === 'contact'
                    ? 'bg-[#112D4E] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Kontak & Info Bisnis</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'bg-[#112D4E] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span>Layanan & Paket ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('destinations')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap ${
                  activeTab === 'destinations'
                    ? 'bg-[#112D4E] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-4 h-4 text-[#30E3CA]" />
                <span>Destinasi Wisata ({destinations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap ${
                  activeTab === 'gallery'
                    ? 'bg-[#112D4E] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-4 h-4 text-[#D4AF37]" />
                <span>Galeri Foto & Watermark ({galleryActivities.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('estimator')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap ${
                  activeTab === 'estimator'
                    ? 'bg-[#112D4E] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4 text-[#30E3CA]" />
                <span>Hitung Trip / Kalkulator</span>
              </button>

              <div className="my-2 border-t border-slate-200 hidden md:block" />

              <button
                onClick={() => setActiveTab('backup')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'bg-[#112D4E] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>Backup & Reset</span>
              </button>
            </div>

            {/* Main Tab Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50">
              
              {/* TAB 0: KELOLA STATUS BOOKING & INQUIRY */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  {/* Header & Add Button */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#112D4E] flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-[#30E3CA]" />
                        <span>Kelola Reservasi & Status Booking Wisatawan</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Ubah status trip, tugaskan driver/guide, dan tambahkan reservasi baru. Tamu dapat memantau status ini dengan ID Booking mereka.
                      </p>
                    </div>

                    <button
                      id="btn-admin-add-booking"
                      onClick={handleStartAddBooking}
                      className="bg-[#112D4E] hover:bg-[#1a3a63] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4 text-[#30E3CA]" />
                      <span>+ Tambah Booking Baru</span>
                    </button>
                  </div>

                  {/* Search Filter Bar */}
                  <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={bookingSearchQuery}
                      onChange={(e) => setBookingSearchQuery(e.target.value)}
                      placeholder="Cari berdasarkan ID Booking (misal LJ-2026-8812), Nama Tamu, Paket, atau Kontak..."
                      className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400"
                    />
                    {bookingSearchQuery && (
                      <button
                        onClick={() => setBookingSearchQuery('')}
                        className="text-xs text-slate-400 hover:text-slate-700"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Booking Modal / Form (Add / Edit) */}
                  {(isAddingBooking || editingBooking) && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#30E3CA]/50 shadow-md space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="font-playfair font-bold text-base text-[#112D4E]">
                          {isAddingBooking ? 'Tambah Data Reservasi Baru' : `Edit Reservasi: ${editingBooking?.id}`}
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingBooking(false);
                            setEditingBooking(null);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveBooking} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              ID Booking (Kode Unik) *
                            </label>
                            <input
                              type="text"
                              value={bookingForm.id || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, id: e.target.value.toUpperCase() })}
                              className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                              placeholder="LJ-2026-XXXX"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Status Booking *
                            </label>
                            <select
                              value={bookingForm.status || 'Menunggu Konfirmasi'}
                              onChange={(e) => setBookingForm({ ...bookingForm, status: e.target.value as BookingStatusType })}
                              className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E] bg-white"
                            >
                              <option value="Menunggu Konfirmasi">⏳ Menunggu Konfirmasi</option>
                              <option value="Terkonfirmasi & Siap">✅ Terkonfirmasi & Siap</option>
                              <option value="Trip Sedang Berjalan">🚗 Trip Sedang Berjalan</option>
                              <option value="Selesai">🏁 Selesai</option>
                              <option value="Dibatalkan">❌ Dibatalkan</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Tanggal Liburan / Trip
                            </label>
                            <input
                              type="text"
                              value={bookingForm.travelDate || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, travelDate: e.target.value })}
                              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                              placeholder="Contoh: 18 - 20 Agustus 2026"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Nama Tamu / Kontak Person *
                            </label>
                            <input
                              type="text"
                              value={bookingForm.guestName || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })}
                              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                              placeholder="Nama Lengkap Tamu"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Nomor WhatsApp Tamu *
                            </label>
                            <input
                              type="text"
                              value={bookingForm.guestPhone || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, guestPhone: e.target.value })}
                              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                              placeholder="0812-xxxx-xxxx"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Pilihan Paket Trip
                            </label>
                            <input
                              type="text"
                              value={bookingForm.tripType || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, tripType: e.target.value })}
                              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                              placeholder="Paket Experience Trip"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Durasi
                            </label>
                            <input
                              type="text"
                              value={bookingForm.duration || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value })}
                              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                              placeholder="Full Day / 3 Hari 2 Malam"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Peserta (Pax)
                            </label>
                            <input
                              type="text"
                              value={bookingForm.pax || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, pax: e.target.value })}
                              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                              placeholder="4 Orang"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Nama Driver / Pemandu (Guide)
                            </label>
                            <input
                              type="text"
                              value={bookingForm.guideName || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, guideName: e.target.value })}
                              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                              placeholder="Kak Hairul (Guide Sasak Asli)"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Titik Penjemputan
                            </label>
                            <input
                              type="text"
                              value={bookingForm.pickupLocation || ''}
                              onChange={(e) => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })}
                              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                              placeholder="Bandara Internasional Lombok (LOP)"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Spot Destinasi (Pisahkan dengan koma)
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(bookingForm.spots) ? bookingForm.spots.join(', ') : ''}
                            onChange={(e) =>
                              setBookingForm({
                                ...bookingForm,
                                spots: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                              })
                            }
                            className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                            placeholder="Desa Sade, Pantai Kuta Mandalika, Bukit Merese"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingBooking(false);
                              setEditingBooking(null);
                            }}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 bg-[#112D4E] hover:bg-[#1a3a63] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4 text-[#30E3CA]" />
                            <span>Simpan ke Cloud Firestore</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Bookings List Cards */}
                  <div className="space-y-3">
                    {bookings
                      .filter((b) => {
                        if (!bookingSearchQuery.trim()) return true;
                        const q = bookingSearchQuery.toLowerCase();
                        return (
                          b.id.toLowerCase().includes(q) ||
                          b.guestName.toLowerCase().includes(q) ||
                          b.guestPhone.toLowerCase().includes(q) ||
                          b.tripType.toLowerCase().includes(q) ||
                          b.status.toLowerCase().includes(q)
                        );
                      })
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#30E3CA]/40 transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 bg-slate-100 font-mono font-bold text-xs text-[#112D4E] rounded-lg border border-slate-200">
                                {booking.id}
                              </span>
                              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                                <span>{booking.guestName}</span>
                                <span className="text-xs text-slate-400 font-normal">({booking.guestPhone})</span>
                              </h4>
                            </div>

                            {/* Quick Status Select */}
                            <div className="flex items-center gap-2">
                              <select
                                value={booking.status}
                                onChange={(e) => handleQuickStatusChange(booking.id, e.target.value as BookingStatusType)}
                                className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none cursor-pointer ${
                                  booking.status === 'Terkonfirmasi & Siap'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : booking.status === 'Trip Sedang Berjalan'
                                    ? 'bg-sky-50 text-sky-800 border-sky-300'
                                    : booking.status === 'Selesai'
                                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                                    : booking.status === 'Dibatalkan'
                                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Menunggu Konfirmasi">⏳ Menunggu Konfirmasi</option>
                                <option value="Terkonfirmasi & Siap">✅ Terkonfirmasi & Siap</option>
                                <option value="Trip Sedang Berjalan">🚗 Trip Sedang Berjalan</option>
                                <option value="Selesai">🏁 Selesai</option>
                                <option value="Dibatalkan">❌ Dibatalkan</option>
                              </select>

                              <button
                                onClick={() => {
                                  setEditingBooking(booking);
                                  setBookingForm({ ...booking });
                                  setIsAddingBooking(false);
                                }}
                                className="p-1.5 text-slate-400 hover:text-[#112D4E] hover:bg-slate-100 rounded-lg transition-colors"
                                title="Edit Detail Booking"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  promptDelete({
                                    title: 'Hapus Data Booking Reservasi',
                                    itemTypeLabel: 'Reservasi Booking',
                                    itemName: `${booking.id} - ${booking.guestName} (${booking.guestPhone})`,
                                    description: `Data reservasi untuk paket "${booking.tripType}" (${booking.duration}, ${booking.pax}) akan dihapus secara permanen dari server database Firestore.`,
                                    confirmButtonText: 'Ya, Hapus Booking',
                                    onConfirm: () => {
                                      deleteBooking(booking.id);
                                      showNotification(`Booking ${booking.id} (${booking.guestName}) berhasil dihapus.`);
                                    }
                                  });
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                            <div>
                              <span className="text-slate-400 block text-[11px]">Paket & Waktu</span>
                              <p className="font-semibold text-slate-800">{booking.tripType}</p>
                              <p className="text-[11px] text-slate-500">{booking.duration} • {booking.pax}</p>
                            </div>

                            <div>
                              <span className="text-slate-400 block text-[11px]">Pemandu / Penjemputan</span>
                              <p className="font-medium text-slate-700">{booking.guideName || '-'}</p>
                              <p className="text-[11px] text-slate-500">{booking.pickupLocation || '-'}</p>
                            </div>

                            <div>
                              <span className="text-slate-400 block text-[11px]">Spot Destinasi</span>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {booking.spots?.slice(0, 3).map((s, idx) => (
                                  <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                    {s}
                                  </span>
                                ))}
                                {(booking.spots?.length || 0) > 3 && (
                                  <span className="text-[10px] text-slate-400">
                                    +{(booking.spots?.length || 0) - 3} lainnya
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {bookings.length === 0 && (
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                        <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-semibold text-slate-600">Belum ada data reservasi</p>
                        <p className="text-[11px] text-slate-400">
                          Klik tombol "+ Tambah Booking Baru" untuk memasukkan data reservasi pertama.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 1: KONTAK & INFO BISNIS */}
              {activeTab === 'contact' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-playfair text-lg font-bold text-[#112D4E] flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[#D4AF37]" />
                        <span>Kelola Nomor WhatsApp, HP & Email Resmi</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Perubahan di form ini akan langsung mengupdate seluruh tombol WhatsApp, email inquiry, footer, navbar, dan floating chat secara otomatis.
                      </p>
                    </div>

                    <form onSubmit={handleSaveBizInfo} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nomor WhatsApp (Angka saja / Awali 62 / 08)
                          </label>
                          <input
                            type="text"
                            value={bizForm.phone}
                            onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                            placeholder="Contoh: 628889163745"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Tampilan Format Nomor (di teks UI)
                          </label>
                          <input
                            type="text"
                            value={bizForm.formattedPhone}
                            onChange={(e) => setBizForm({ ...bizForm, formattedPhone: e.target.value })}
                            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                            placeholder="Contoh: 0888-9163-745"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#30E3CA]" />
                          <span>Alamat Email Resmi (Untuk Inquiry Pelanggan)</span>
                        </label>
                        <input
                          type="email"
                          value={bizForm.email}
                          onChange={(e) => setBizForm({ ...bizForm, email: e.target.value })}
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                          placeholder="Contoh: hairulummah2201@gmail.com"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                            <Instagram className="w-3.5 h-3.5 text-pink-500" />
                            <span>Username Instagram</span>
                          </label>
                          <input
                            type="text"
                            value={bizForm.instagramHandle}
                            onChange={(e) => setBizForm({ ...bizForm, instagramHandle: e.target.value })}
                            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                            placeholder="@lombokjourney_"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Link URL Instagram
                          </label>
                          <input
                            type="url"
                            value={bizForm.instagramUrl}
                            onChange={(e) => setBizForm({ ...bizForm, instagramUrl: e.target.value })}
                            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                            placeholder="https://instagram.com/lombokjourney_"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Alamat / Lokasi Kantor</span>
                        </label>
                        <input
                          type="text"
                          value={bizForm.location}
                          onChange={(e) => setBizForm({ ...bizForm, location: e.target.value })}
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                          placeholder="Mataram, Lombok, Nusa Tenggara Barat"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tagline / Slogan Brand
                        </label>
                        <input
                          type="text"
                          value={bizForm.tagline}
                          onChange={(e) => setBizForm({ ...bizForm, tagline: e.target.value })}
                          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#112D4E]"
                          placeholder="Spesialis Private Trip, Full Day Trip, dan Short Trip Lombok"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Data otomatis tersimpan di Server Cloud & sinkron ke semua browser
                        </span>

                        <button
                          type="submit"
                          className="bg-[#112D4E] hover:bg-[#1a3a63] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="w-4 h-4 text-[#30E3CA]" />
                          <span>Simpan Perubahan Kontak</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: KELOLA LAYANAN & PAKET TRIP */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  {/* Action Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-[#112D4E]">
                        Daftar Paket Layanan Trip ({services.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Atur paket trip favorit, harga mulai, rincian aktivitas, dan foto background.
                      </p>
                    </div>

                    {!isAddingService && !editingService && (
                      <button
                        onClick={handleStartAddService}
                        className="bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Paket Trip Baru</span>
                      </button>
                    )}
                  </div>

                  {/* Form Modal / Inline Edit */}
                  {(isAddingService || editingService) && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#112D4E] shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h4 className="font-bold text-sm text-[#112D4E]">
                          {isAddingService ? 'Tambah Paket Trip Baru' : `Edit: ${editingService?.title}`}
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingService(false);
                            setEditingService(null);
                          }}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveService} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Paket</label>
                            <input
                              type="text"
                              value={serviceForm.title || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Contoh: Paket Experience Trip"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Harga Mulai</label>
                            <input
                              type="text"
                              value={serviceForm.priceStart || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, priceStart: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Mulai Rp 450.000 / pax"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Badge Promo / Tag</label>
                            <input
                              type="text"
                              value={serviceForm.badge || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Terfavorit / Best Beach / Populer"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Ringkas</label>
                            <input
                              type="text"
                              value={serviceForm.tagline || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Eksplorasi Budaya Sasak & Pantai Kuta Mandalika"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Paket</label>
                          <textarea
                            rows={2}
                            value={serviceForm.description || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                            placeholder="Deskripsi singkat pengalaman trip..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Aktivitas / Rute Itinerary (Pisahkan dengan koma atau baris baru)
                          </label>
                          <textarea
                            rows={3}
                            value={Array.isArray(serviceForm.features) ? serviceForm.features.join('\n') : ''}
                            onChange={(e) =>
                              setServiceForm({
                                ...serviceForm,
                                features: e.target.value.split('\n').filter((item) => item.trim() !== '')
                              })
                            }
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 font-mono"
                            placeholder="Pick up hotel&#10;Desa Sade&#10;Pantai Kuta Mandalika&#10;Sunset point"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Background</label>
                          <input
                            type="url"
                            value={serviceForm.bgImage || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, bgImage: e.target.value })}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                            placeholder="https://images.unsplash.com/photo-..."
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingService(false);
                              setEditingService(null);
                            }}
                            className="text-xs px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="bg-[#112D4E] hover:bg-[#1a3a63] text-white text-xs font-bold px-5 py-2 rounded-lg"
                          >
                            Simpan Paket Trip
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div key={srv.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold bg-[#112D4E]/10 text-[#112D4E] px-2.5 py-0.5 rounded-full">
                              {srv.badge}
                            </span>
                            <span className="text-xs font-bold text-[#D4AF37]">
                              {srv.priceStart}
                            </span>
                          </div>

                          <h4 className="font-playfair font-bold text-base text-[#112D4E]">
                            {srv.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-light">{srv.tagline}</p>

                          <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400">Rute / Spot:</span>
                            <ul className="text-xs text-slate-600 space-y-1 mt-1">
                              {srv.features.slice(0, 4).map((f, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#30E3CA]" />
                                  <span>{f}</span>
                                </li>
                              ))}
                              {srv.features.length > 4 && (
                                <li className="text-[11px] text-slate-400 font-italic">
                                  +{srv.features.length - 4} aktivitas lainnya
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">ID: {srv.id}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingService(srv);
                                setServiceForm(srv);
                                setIsAddingService(false);
                              }}
                              className="text-xs font-semibold text-[#112D4E] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                promptDelete({
                                  title: 'Hapus Paket Layanan Trip',
                                  itemTypeLabel: 'Paket Layanan',
                                  itemName: `${srv.title} (${srv.badge})`,
                                  description: `Paket trip ini (${srv.priceStart}) beserta seluruh daftar rute dan fiturnya tidak akan lagi ditampilkan ke calon wisatawan di halaman beranda.`,
                                  confirmButtonText: 'Ya, Hapus Paket',
                                  onConfirm: () => {
                                    deleteService(srv.id);
                                    showNotification(`Paket trip "${srv.title}" berhasil dihapus.`);
                                  }
                                });
                              }}
                              className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: KELOLA DESTINASI WISATA */}
              {activeTab === 'destinations' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-[#112D4E]">
                        Daftar Destinasi Wisata ({destinations.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Kelola nama pantai, bukit, gili, air terjun, highlight, dan foto destinasi.
                      </p>
                    </div>

                    {!isAddingDest && !editingDest && (
                      <button
                        onClick={handleStartAddDest}
                        className="bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Destinasi Baru</span>
                      </button>
                    )}
                  </div>

                  {/* Destination Form */}
                  {(isAddingDest || editingDest) && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#112D4E] shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h4 className="font-bold text-sm text-[#112D4E]">
                          {isAddingDest ? 'Tambah Destinasi Baru' : `Edit: ${editingDest?.name}`}
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingDest(false);
                            setEditingDest(null);
                          }}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveDest} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Destinasi</label>
                            <input
                              type="text"
                              value={destForm.name || ''}
                              onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Contoh: Pantai Tanjung Aan & Bukit Merese"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                            <select
                              value={destForm.category || 'Pantai & Gili'}
                              onChange={(e) => setDestForm({ ...destForm, category: e.target.value as any })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                            >
                              <option value="Pantai & Gili">Pantai & Gili</option>
                              <option value="Gunung & Alam">Gunung & Alam</option>
                              <option value="Air Terjun">Air Terjun</option>
                              <option value="Budaya & Desa">Budaya & Desa</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi</label>
                            <input
                              type="text"
                              value={destForm.location || ''}
                              onChange={(e) => setDestForm({ ...destForm, location: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Lombok Selatan / Sembalun"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Highlight / Daya Tarik</label>
                            <input
                              type="text"
                              value={destForm.highlight || ''}
                              onChange={(e) => setDestForm({ ...destForm, highlight: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Pasir Merica & Sunset Memukau"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Destinasi</label>
                          <textarea
                            rows={2}
                            value={destForm.description || ''}
                            onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                            placeholder="Deskripsi keindahan dan daya tarik destinasi..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Destinasi</label>
                          <input
                            type="url"
                            value={destForm.image || ''}
                            onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                            placeholder="https://images.unsplash.com/photo-..."
                            required
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingDest(false);
                              setEditingDest(null);
                            }}
                            className="text-xs px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="bg-[#112D4E] hover:bg-[#1a3a63] text-white text-xs font-bold px-5 py-2 rounded-lg"
                          >
                            Simpan Destinasi
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Destinations Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {destinations.map((d) => (
                      <div key={d.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="relative aspect-[16/10] bg-slate-900">
                          <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 bg-[#112D4E]/80 text-[#30E3CA] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {d.category}
                          </span>
                        </div>

                        <div className="p-4 space-y-2 flex-1">
                          <h4 className="font-playfair font-bold text-sm text-[#112D4E] line-clamp-1">{d.name}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{d.description}</p>
                          <span className="inline-block text-[10px] font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                            ✨ {d.highlight}
                          </span>
                        </div>

                        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{d.location}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingDest(d);
                                setDestForm(d);
                                setIsAddingDest(false);
                              }}
                              className="text-[11px] font-semibold text-[#112D4E] hover:underline"
                            >
                              Edit
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              onClick={() => {
                                promptDelete({
                                  title: 'Hapus Destinasi Wisata',
                                  itemTypeLabel: 'Destinasi Wisata',
                                  itemName: `${d.name} (${d.category})`,
                                  description: `Destinasi wisata ${d.name} di area "${d.location}" akan dihapus dari daftar rekomendasi wisata Lombok.`,
                                  confirmButtonText: 'Ya, Hapus Destinasi',
                                  onConfirm: () => {
                                    deleteDestination(d.id);
                                    showNotification(`Destinasi "${d.name}" berhasil dihapus.`);
                                  }
                                });
                              }}
                              className="text-[11px] font-semibold text-red-600 hover:underline"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: KELOLA GALERI FOTO & VIDEO WISATAWAN */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-[#112D4E] flex items-center gap-2">
                        <Camera className="w-5 h-5 text-[#D4AF37]" />
                        <span>Dokumentasi Trip & Video Wisatawan ({galleryActivities.length})</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Kelola foto dengan watermark otomatis <strong>@lombokjourney</strong>, serta embed & upload video kegiatan dari YouTube, TikTok, Instagram Reels, atau file video lokal.
                      </p>
                    </div>

                    {!isAddingGallery && !editingGallery && (
                      <button
                        onClick={handleStartAddGallery}
                        className="bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Media Baru (Foto / Video)</span>
                      </button>
                    )}
                  </div>

                  {/* Form Upload / Add Photo/Video to Gallery */}
                  {(isAddingGallery || editingGallery) && (
                    <div id="admin-gallery-form-box" className="bg-white p-6 rounded-2xl border-2 border-[#112D4E] shadow-xl space-y-5 scroll-mt-24">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h4 className="font-bold text-sm text-[#112D4E] flex items-center gap-2">
                          {galleryMediaType === 'video' ? (
                            <Video className="w-4 h-4 text-[#D4AF37]" />
                          ) : (
                            <Camera className="w-4 h-4 text-[#D4AF37]" />
                          )}
                          <span>{isAddingGallery ? 'Tambah Kegiatan / Dokumentasi Baru' : `Edit: ${editingGallery?.title}`}</span>
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingGallery(false);
                            setEditingGallery(null);
                            setPhotoPreview('');
                          }}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Type Toggle: Foto vs Video */}
                      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl w-fit">
                        <button
                          type="button"
                          onClick={() => {
                            setGalleryMediaType('image');
                            setGalleryForm((prev) => ({ ...prev, mediaType: 'image' }));
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            galleryMediaType === 'image'
                              ? 'bg-[#112D4E] text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Foto Dokumentasi (Auto Watermark)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setGalleryMediaType('video');
                            setGalleryForm((prev) => ({
                              ...prev,
                              mediaType: 'video',
                              videoDuration: prev.videoDuration || '0:45'
                            }));
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            galleryMediaType === 'video'
                              ? 'bg-[#112D4E] text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5 text-[#30E3CA]" />
                          <span>Video & Reels Sosmed</span>
                        </button>
                      </div>

                      <form onSubmit={handleSaveGallery} className="space-y-4">
                        {/* IF PHOTO MODE */}
                        {galleryMediaType === 'image' && (
                          <div className="border-2 border-dashed border-[#112D4E]/30 rounded-2xl p-4 bg-slate-50 text-center space-y-3">
                            <input
                              type="file"
                              ref={photoInputRef}
                              onChange={handlePhotoUpload}
                              accept="image/*"
                              className="hidden"
                            />

                            {photoPreview || galleryForm.image ? (
                              <div className="space-y-3">
                                <div className="relative inline-block max-w-sm aspect-[4/3] rounded-xl overflow-hidden border border-slate-300 shadow-md">
                                  <img
                                    src={photoPreview || galleryForm.image}
                                    alt="Preview Foto"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                                    <Check className="w-3 h-3" />
                                    <span>Watermark @lombokjourney Siap</span>
                                  </div>
                                </div>

                                <div>
                                  <button
                                    type="button"
                                    onClick={() => photoInputRef.current?.click()}
                                    className="text-xs font-semibold text-[#112D4E] hover:underline"
                                  >
                                    Ganti Foto Lain Dari Perangkat
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="py-6 space-y-3">
                                <div className="w-12 h-12 rounded-full bg-[#112D4E]/10 text-[#112D4E] flex items-center justify-center mx-auto">
                                  <Upload className="w-6 h-6 text-[#D4AF37]" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-700">
                                    Pilih Foto dari Galeri HP / Komputer Anda
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    Sistem akan otomatis membubuhkan watermark <strong>@lombokjourney</strong> di sudut foto
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => photoInputRef.current?.click()}
                                  disabled={isProcessingPhoto}
                                  className="bg-[#112D4E] hover:bg-[#1a3a63] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow transition-colors inline-flex items-center gap-1.5"
                                >
                                  <Upload className="w-3.5 h-3.5 text-[#30E3CA]" />
                                  <span>{isProcessingPhoto ? 'Memproses Watermark...' : 'Pilih File Gambar'}</span>
                                </button>
                              </div>
                            )}

                            {/* Fallback to image URL */}
                            <div className="pt-2 border-t border-slate-200 text-left">
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Atau masukkan URL Foto Langsung:
                              </label>
                              <input
                                type="url"
                                value={galleryForm.image || ''}
                                onChange={(e) => {
                                  setGalleryForm({ ...galleryForm, image: e.target.value });
                                  setPhotoPreview(e.target.value);
                                }}
                                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                                placeholder="https://images.unsplash.com/..."
                              />
                            </div>
                          </div>
                        )}

                        {/* IF VIDEO MODE */}
                        {galleryMediaType === 'video' && (
                          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            {/* Video Source Option Toggle */}
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setVideoInputMode('link')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                                  videoInputMode === 'link'
                                    ? 'bg-[#112D4E] text-white'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <Link2 className="w-3.5 h-3.5" />
                                <span>Copy / Paste Link Sosmed</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setVideoInputMode('upload')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                                  videoInputMode === 'upload'
                                    ? 'bg-[#112D4E] text-white'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <FileVideo className="w-3.5 h-3.5" />
                                <span>Upload File Video (.mp4 / .webm)</span>
                              </button>
                            </div>

                            {/* Mode A: Paste Link */}
                            {videoInputMode === 'link' && (
                              <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700">
                                  Link Video (YouTube, Shorts, TikTok, Instagram Reels, atau MP4 URL)
                                </label>
                                <div className="relative">
                                  <input
                                    type="url"
                                    value={galleryForm.videoUrl || ''}
                                    onChange={(e) => handleVideoUrlInput(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=... atau https://www.tiktok.com/@.../video/..."
                                    className="w-full text-xs py-2.5 pl-3 pr-24 rounded-xl border border-slate-300 focus:outline-none focus:border-[#112D4E]"
                                    required={galleryMediaType === 'video'}
                                  />
                                  {galleryForm.videoUrl && (
                                    <span className="absolute right-2.5 top-2 bg-[#112D4E] text-[#30E3CA] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                      {parseVideoUrl(galleryForm.videoUrl).type}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  Contoh link didukung: YouTube normal/shorts, link postingan video TikTok, link reel Instagram, atau link langsung file mp4.
                                </p>
                              </div>
                            )}

                            {/* Mode B: Upload File */}
                            {videoInputMode === 'upload' && (
                              <div className="border-2 border-dashed border-[#112D4E]/30 rounded-xl p-4 text-center bg-white space-y-3">
                                <input
                                  type="file"
                                  ref={videoInputRef}
                                  onChange={handleVideoUpload}
                                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                  className="hidden"
                                />

                                {galleryForm.videoUrl && galleryForm.videoSource === 'upload' ? (
                                  <div className="space-y-2">
                                    <video
                                      src={galleryForm.videoUrl}
                                      controls
                                      className="max-h-48 mx-auto rounded-lg shadow-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => videoInputRef.current?.click()}
                                      className="text-xs font-semibold text-[#112D4E] hover:underline"
                                    >
                                      Ganti File Video Lain
                                    </button>
                                  </div>
                                ) : (
                                  <div className="py-4 space-y-2">
                                    <FileVideo className="w-8 h-8 text-[#D4AF37] mx-auto" />
                                    <p className="text-xs font-bold text-slate-700">
                                      Pilih file video dari perangkat Anda
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                      Mendukung format MP4, WebM, QuickTime
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => videoInputRef.current?.click()}
                                      disabled={isProcessingVideo}
                                      className="bg-[#112D4E] text-white text-xs font-bold py-2 px-4 rounded-xl shadow inline-flex items-center gap-1.5"
                                    >
                                      <Upload className="w-3.5 h-3.5 text-[#30E3CA]" />
                                      <span>{isProcessingVideo ? 'Memuat Video...' : 'Pilih File Video'}</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Live Video Embed Preview */}
                            {galleryForm.videoUrl && (
                              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold text-[#112D4E]">
                                  <span className="flex items-center gap-1.5">
                                    <Play className="w-3.5 h-3.5 text-[#D4AF37]" />
                                    Live Preview Player Video
                                  </span>
                                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                                    Format Valid & Siap Tayang
                                  </span>
                                </div>

                                <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden bg-black shadow-inner">
                                  {(() => {
                                    const parsed = parseVideoUrl(galleryForm.videoUrl);
                                    if (['youtube', 'tiktok', 'instagram'].includes(parsed.type) && parsed.embedUrl) {
                                      return (
                                        <iframe
                                          src={parsed.embedUrl}
                                          className="w-full h-full border-0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                          title="Video Preview"
                                        />
                                      );
                                    }
                                    return (
                                      <video
                                        src={parsed.embedUrl || parsed.originalUrl}
                                        controls
                                        className="w-full h-full object-contain"
                                      />
                                    );
                                  })()}
                                </div>
                              </div>
                            )}

                            {/* Video Cover / Thumbnail & Duration Settings */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                  Durasi Video / Label
                                </label>
                                <input
                                  type="text"
                                  value={galleryForm.videoDuration || '0:45'}
                                  onChange={(e) => setGalleryForm({ ...galleryForm, videoDuration: e.target.value })}
                                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                                  placeholder="Contoh: 0:45, 1:20, atau Reels"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                  Cover Poster Video (URL Gambar)
                                </label>
                                <input
                                  type="url"
                                  value={galleryForm.image || ''}
                                  onChange={(e) => {
                                    setGalleryForm({ ...galleryForm, image: e.target.value });
                                    setPhotoPreview(e.target.value);
                                  }}
                                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                                  placeholder="Otomatis dari YouTube / isi URL kustom"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Judul {galleryMediaType === 'video' ? 'Video Kegiatan' : 'Foto Kegiatan'}
                            </label>
                            <input
                              type="text"
                              value={galleryForm.title || ''}
                              onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder={galleryMediaType === 'video' ? 'Contoh: Keseruan Snorkeling Penyu di Gili Air' : 'Contoh: Snorkeling Penyu di Turtle Point'}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Kegiatan</label>
                            <select
                              value={galleryForm.category || 'Snorkeling & Bahari'}
                              onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                            >
                              <option value="Snorkeling & Bahari">Snorkeling & Bahari</option>
                              <option value="Budaya & Adat">Budaya & Adat</option>
                              <option value="Pantai & Sunset">Pantai & Sunset</option>
                              <option value="Pegunungan & Alam">Pegunungan & Alam</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Trip</label>
                            <input
                              type="text"
                              value={galleryForm.location || ''}
                              onChange={(e) => setGalleryForm({ ...galleryForm, location: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Gili Trawangan / Desa Sade"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal / Bulan Trip</label>
                            <input
                              type="text"
                              value={galleryForm.activityDate || ''}
                              onChange={(e) => setGalleryForm({ ...galleryForm, activityDate: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Agustus 2026"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tag Paket Terkait</label>
                            <input
                              type="text"
                              value={galleryForm.packageTag || ''}
                              onChange={(e) => setGalleryForm({ ...galleryForm, packageTag: e.target.value })}
                              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                              placeholder="Gili Escape Trip"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kegiatan</label>
                          <textarea
                            rows={2}
                            value={galleryForm.description || ''}
                            onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                            placeholder="Cerita singkat keseruan tamu..."
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingGallery(false);
                              setEditingGallery(null);
                              setPhotoPreview('');
                            }}
                            className="text-xs px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="bg-[#112D4E] hover:bg-[#1a3a63] text-white text-xs font-bold px-5 py-2 rounded-lg"
                          >
                            Simpan ke Galeri Server
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Gallery Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryActivities.map((act) => {
                      const isVideo = act.mediaType === 'video';
                      return (
                        <div key={act.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group">
                          <div className="relative aspect-[4/3] bg-slate-900">
                            <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                            
                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                              <span className="bg-[#112D4E]/90 backdrop-blur-sm text-[#30E3CA] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {act.packageTag}
                              </span>
                              {isVideo && (
                                <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                                  <Play className="w-2.5 h-2.5 fill-white" />
                                  <span>VIDEO ({act.videoSource || 'Sosmed'})</span>
                                </span>
                              )}
                            </div>

                            {/* Play button overlay for video */}
                            {isVideo && (
                              <button
                                type="button"
                                onClick={() => setPreviewingVideoModal(act)}
                                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#112D4E]/80 text-[#30E3CA] border-2 border-white/80 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                title="Putar Video"
                              >
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </button>
                            )}

                            {/* Watermark badge or duration */}
                            {isVideo && act.videoDuration ? (
                              <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                ⏱️ {act.videoDuration}
                              </span>
                            ) : null}

                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                              @lombokjourney
                            </span>
                          </div>

                          <div className="p-4 space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              {isVideo ? (
                                <Video className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              ) : (
                                <Camera className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                              )}
                              <h4 className="font-playfair font-bold text-sm text-[#112D4E] line-clamp-1">{act.title}</h4>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2">{act.description}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                              <span>📍 {act.location}</span>
                              <span>🗓️ {act.activityDate}</span>
                            </div>
                          </div>

                          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-[#112D4E] font-semibold">{act.category}</span>
                            <div className="flex items-center gap-2">
                              {isVideo && (
                                <>
                                  <button
                                    onClick={() => setPreviewingVideoModal(act)}
                                    className="text-[11px] font-semibold text-[#30E3CA] bg-[#112D4E] px-2 py-0.5 rounded hover:bg-[#1a3a63]"
                                  >
                                    Putar
                                  </button>
                                  <span className="text-slate-300">•</span>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setEditingGallery(act);
                                  setGalleryForm(act);
                                  setGalleryMediaType(act.mediaType || 'image');
                                  setVideoInputMode(act.videoSource === 'upload' ? 'upload' : 'link');
                                  setPhotoPreview(act.image);
                                  setIsAddingGallery(false);
                                  setTimeout(() => {
                                    document.getElementById('admin-gallery-form-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }, 50);
                                }}
                                className="text-[11px] font-semibold text-[#112D4E] hover:underline"
                              >
                                Edit
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                onClick={() => {
                                  const isVid = act.mediaType === 'video';
                                  promptDelete({
                                    title: isVid ? 'Hapus Video Kegiatan Galeri' : 'Hapus Foto Dokumentasi Galeri',
                                    itemTypeLabel: isVid ? 'Video Galeri' : 'Foto Galeri',
                                    itemName: `${act.title} (${act.category})`,
                                    description: `${isVid ? 'Video' : 'Foto'} dokumentasi di "${act.location}" (${act.activityDate}) akan dihapus permanen dari server dan galeri.`,
                                    confirmButtonText: isVid ? 'Ya, Hapus Video' : 'Ya, Hapus Foto',
                                    onConfirm: () => {
                                      deleteGalleryActivity(act.id);
                                      showNotification(`${isVid ? 'Video' : 'Foto'} "${act.title}" berhasil dihapus dari galeri.`);
                                    }
                                  });
                                }}
                                className="text-[11px] font-semibold text-red-600 hover:underline"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Modal Quick Video Preview in Admin */}
                  {previewingVideoModal && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/10 space-y-3 p-4">
                        <div className="flex items-center justify-between text-white pb-2 border-b border-white/10">
                          <div>
                            <h4 className="font-playfair font-bold text-sm text-white flex items-center gap-2">
                              <Play className="w-4 h-4 text-[#30E3CA]" />
                              <span>{previewingVideoModal.title}</span>
                            </h4>
                            <span className="text-[11px] text-slate-400">📍 {previewingVideoModal.location} • {previewingVideoModal.packageTag}</span>
                          </div>
                          <button
                            onClick={() => setPreviewingVideoModal(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                          {(() => {
                            const parsed = parseVideoUrl(previewingVideoModal.videoUrl || '');
                            if (['youtube', 'tiktok', 'instagram'].includes(parsed.type) && parsed.embedUrl) {
                              return (
                                <iframe
                                  src={parsed.embedUrl}
                                  className="w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  title={previewingVideoModal.title}
                                />
                              );
                            }
                            return (
                              <video
                                src={parsed.embedUrl || parsed.originalUrl}
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                              />
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: KELOLA HITUNG TRIP / KALKULATOR */}
              {activeTab === 'estimator' && (
                <div className="space-y-6 max-w-4xl">
                  {/* Estimator Trip Types Management */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-playfair text-base font-bold text-[#112D4E]">
                        1. Pilihan Paket Trip di Kalkulator
                      </h3>
                      <p className="text-xs text-slate-500">
                        Opsi paket yang bisa diklik wisatawan saat merancang trip impian mereka.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTripType}
                        onChange={(e) => setNewTripType(e.target.value)}
                        placeholder="Contoh: Paket Honeymoon Gili"
                        className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-300"
                      />
                      <button
                        onClick={handleAddTripType}
                        className="bg-[#112D4E] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-[#1a3a63]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Paket</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {estimatorConfig.tripTypes.map((type) => (
                        <div
                          key={type}
                          className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#112D4E] flex items-center gap-2"
                        >
                          <span>{type}</span>
                          <button
                            onClick={() => {
                              promptDelete({
                                title: 'Hapus Pilihan Paket Kalkulator',
                                itemTypeLabel: 'Opsi Paket Trip',
                                itemName: type,
                                description: `Opsi paket "${type}" tidak akan lagi muncul di pilihan dropdown kalkulator estimasi biaya wisata.`,
                                confirmButtonText: 'Ya, Hapus Opsi',
                                onConfirm: () => {
                                  handleDeleteTripType(type);
                                }
                              });
                            }}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                            title="Hapus opsi ini"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Estimator Available Spots Management */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-playfair text-base font-bold text-[#112D4E]">
                        2. Daftar Pilihan Spot Wisata Favorit
                      </h3>
                      <p className="text-xs text-slate-500">
                        Destinasi dan spot yang dapat dicentang wisatawan di formulir estimasi.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSpot}
                        onChange={(e) => setNewSpot(e.target.value)}
                        placeholder="Contoh: Air Terjun Benang Kelambu"
                        className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-300"
                      />
                      <button
                        onClick={handleAddSpot}
                        className="bg-[#112D4E] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-[#1a3a63]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Spot</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                      {estimatorConfig.availableSpots.map((spot) => (
                        <div
                          key={spot}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 flex items-center justify-between gap-1 hover:bg-slate-100"
                        >
                          <span className="truncate">{spot}</span>
                          <button
                            onClick={() => {
                              promptDelete({
                                title: 'Hapus Spot Wisata Kalkulator',
                                itemTypeLabel: 'Spot Destinasi',
                                itemName: spot,
                                description: `Spot "${spot}" akan dihapus dari checklist destinasi di formulir kalkulator hitung trip.`,
                                confirmButtonText: 'Ya, Hapus Spot',
                                onConfirm: () => {
                                  handleDeleteSpot(spot);
                                }
                              });
                            }}
                            className="text-slate-400 hover:text-red-500 shrink-0 transition-colors"
                            title="Hapus spot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: BACKUP, RESTORE & RESET */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-[#112D4E]">
                        Backup & Pulihkan Data Website
                      </h3>
                      <p className="text-xs text-slate-500">
                        Simpan seluruh pengaturan, paket layanan, kontak, dan galeri foto ke dalam file JSON agar aman dan dapat dipindahkan kapan saja.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={handleDownloadBackup}
                        className="bg-[#112D4E] hover:bg-[#1a3a63] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                      >
                        <Download className="w-4 h-4 text-[#30E3CA]" />
                        <span>Download Backup JSON</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-300 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-[#D4AF37]" />
                        <span>Impor File Backup JSON</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportFile}
                        accept=".json"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Factory Reset */}
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-200 space-y-3">
                    <h4 className="font-bold text-sm text-red-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>Kembalikan Pengaturan Awal (Factory Reset)</span>
                    </h4>
                    <p className="text-xs text-red-700">
                      Tindakan ini akan mengosongkan perubahan di server dan memulihkan kembali seluruh paket trip standar, nomor telepon, dan destinasi bawaan Lombok Journey.
                    </p>
                    <button
                      onClick={handleReset}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Seluruh Data ke Default</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* POPUP MODAL KONFIRMASI HAPUS (YA / TIDAK) */}
      {deleteModalState.isOpen && (
        <div 
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-red-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-inner">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">
                  {deleteModalState.itemTypeLabel || 'Konfirmasi Hapus'}
                </span>
                <h3 id="delete-modal-title" className="font-playfair text-lg font-bold text-slate-900 leading-tight">
                  {deleteModalState.title}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Item yang dipilih:
              </span>
              <p className="text-xs font-bold text-slate-900 break-words font-mono bg-white p-2 rounded-lg border border-slate-200 text-red-950">
                {deleteModalState.itemName}
              </p>
              {deleteModalState.description && (
                <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                  {deleteModalState.description}
                </p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-900 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Apakah Anda yakin ingin menghapus item ini? Tindakan ini akan segera disinkronkan ke server database.</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tidak, Batal</span>
              </button>

              <button
                type="button"
                onClick={() => deleteModalState.onConfirm()}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleteModalState.confirmButtonText || 'Ya, Hapus Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
