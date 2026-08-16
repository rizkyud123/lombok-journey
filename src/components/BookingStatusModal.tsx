import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BookingInquiry, BookingStatusType } from '../types';
import {
  Search,
  X,
  CheckCircle2,
  Clock,
  Car,
  User,
  Phone,
  Calendar,
  MapPin,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

export const BookingStatusModal: React.FC = () => {
  const {
    isBookingStatusModalOpen,
    setIsBookingStatusModalOpen,
    targetBookingIdForCheck,
    setTargetBookingIdForCheck,
    getBookingById,
    bookings,
    businessInfo
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundBooking, setFoundBooking] = useState<BookingInquiry | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // When modal opens or targetBookingIdForCheck is set, pre-fill and auto search
  useEffect(() => {
    if (isBookingStatusModalOpen) {
      if (targetBookingIdForCheck) {
        setSearchQuery(targetBookingIdForCheck);
        const result = getBookingById(targetBookingIdForCheck);
        setFoundBooking(result || null);
        setSearched(true);
      } else {
        setSearchQuery('');
        setFoundBooking(null);
        setSearched(false);
      }
    }
  }, [isBookingStatusModalOpen, targetBookingIdForCheck, bookings]);

  if (!isBookingStatusModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const result = getBookingById(searchQuery.trim());
    setFoundBooking(result || null);
    setSearched(true);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleClose = () => {
    setIsBookingStatusModalOpen(false);
    setTargetBookingIdForCheck(null);
    setSearchQuery('');
    setFoundBooking(null);
    setSearched(false);
  };

  const getStatusBadge = (status: BookingStatusType) => {
    switch (status) {
      case 'Terkonfirmasi & Siap':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          dot: 'bg-emerald-500',
          desc: 'Jadwal & armada telah dikonfirmasi dan siap menyambut kedatangan Anda!'
        };
      case 'Trip Sedang Berjalan':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-300',
          icon: Car,
          dot: 'bg-sky-500 animate-pulse',
          desc: 'Trip sedang berlangsung! Selamat menikmati keindahan Lombok bersama tim kami.'
        };
      case 'Selesai':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: ShieldCheck,
          dot: 'bg-slate-500',
          desc: 'Trip telah selesai. Terima kasih telah menjelajahi Lombok bersama Lombok Journey!'
        };
      case 'Dibatalkan':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          icon: AlertCircle,
          dot: 'bg-rose-500',
          desc: 'Inquiry atau pemesanan ini telah dibatalkan.'
        };
      case 'Menunggu Konfirmasi':
      default:
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: Clock,
          dot: 'bg-amber-500',
          desc: 'Tim admin kami sedang memeriksa ketersediaan driver & jadwal paket trip Anda.'
        };
    }
  };

  const currentStatusInfo = foundBooking ? getStatusBadge(foundBooking.status) : null;
  const StatusIcon = currentStatusInfo ? currentStatusInfo.icon : Clock;

  const waDirectChat = foundBooking
    ? `${businessInfo.waBaseUrl}?text=${encodeURIComponent(
        `Halo Lombok Journey, saya ingin menanyakan progres Booking ID: ${foundBooking.id} atas nama ${foundBooking.guestName}.`
      )}`
    : `${businessInfo.waBaseUrl}?text=${encodeURIComponent('Halo Lombok Journey, saya ingin cek status reservasi saya.')}`;

  return (
    <div
      id="booking-status-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        id="booking-status-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-[#112D4E] text-white px-6 py-5 sm:px-8 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#30E3CA]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#30E3CA]/20 border border-[#30E3CA]/30 flex items-center justify-center text-[#30E3CA]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold tracking-tight text-white">
                Cek Status Reservasi & Trip
              </h3>
              <p className="text-xs text-slate-300 font-light">
                Pantau konfirmasi, driver, dan jadwal trip Anda secara real-time
              </p>
            </div>
          </div>

          <button
            id="btn-close-booking-status-modal"
            onClick={handleClose}
            aria-label="Tutup Modal"
            className="relative z-10 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label htmlFor="input-booking-id" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Masukkan ID Booking / Kode Reservasi
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-booking-id"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Contoh: LJ-2026-8812 atau LJ-2026-9041"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#112D4E] focus:border-transparent transition-all uppercase placeholder:normal-case placeholder:text-slate-400"
                />
              </div>
              <button
                id="btn-search-booking-status"
                type="submit"
                className="px-5 sm:px-6 py-3 bg-[#112D4E] hover:bg-[#1f4a7c] text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>Periksa</span>
              </button>
            </div>

            {/* Quick Sample IDs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
              <span className="font-medium">Coba kode contoh:</span>
              {bookings.slice(0, 3).map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(sample.id);
                    setFoundBooking(sample);
                    setSearched(true);
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-[#30E3CA]/20 hover:text-[#112D4E] text-slate-700 rounded-md font-mono text-[11px] font-semibold transition-colors border border-slate-200"
                >
                  {sample.id}
                </button>
              ))}
            </div>
          </form>

          {/* Search Result Section */}
          {searched && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {foundBooking && currentStatusInfo ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border ${currentStatusInfo.bg} flex items-start gap-3.5`}>
                    <div className="p-2 rounded-xl bg-white shadow-sm shrink-0">
                      <StatusIcon className="w-6 h-6 text-current" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${currentStatusInfo.dot}`} />
                        <span className="font-bold text-sm sm:text-base">
                          {foundBooking.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-normal opacity-90 leading-relaxed">
                        {currentStatusInfo.desc}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* ID & Guest Info */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">ID Reservasi</span>
                        <button
                          onClick={() => handleCopyId(foundBooking.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#112D4E]"
                        >
                          {copiedId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Disalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono font-bold text-sm text-[#112D4E]">
                        {foundBooking.id}
                      </p>
                      <div className="pt-1 border-t border-slate-100 space-y-1">
                        <div className="flex items-center gap-2 text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold">{foundBooking.guestName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{foundBooking.guestPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Trip & Schedule */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-slate-400 font-medium block">Rincian Paket Trip</span>
                      <p className="font-bold text-slate-800 text-sm">
                        {foundBooking.tripType}
                      </p>
                      <div className="pt-1 border-t border-slate-100 space-y-1 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{foundBooking.duration} • {foundBooking.pax}</span>
                        </div>
                        {foundBooking.travelDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Tgl Trip: <strong className="text-slate-800">{foundBooking.travelDate}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Destination Spots */}
                  {foundBooking.spots && foundBooking.spots.length > 0 && (
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-slate-400 text-xs font-medium block">Spot Destinasi Yang Dipilih</span>
                      <div className="flex flex-wrap gap-1.5">
                        {foundBooking.spots.map((spot, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                          >
                            <MapPin className="w-3 h-3 text-[#30E3CA]" />
                            <span>{spot}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Guide & Logistics Information */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Pemandu / Guide</span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {foundBooking.guideName || 'Akan diinfokan via WhatsApp'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Titik Penjemputan</span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {foundBooking.pickupLocation || 'Sesuai kesepakatan'}
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 text-center sm:text-left">
                      Butuh perubahan jadwal atau penyesuaian spot?
                    </span>
                    <a
                      href={waDirectChat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#30E3CA] hover:bg-[#28c4ae] text-[#112D4E] font-bold text-xs rounded-xl shadow-md transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Admin via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Not Found State */
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">
                    ID Reservasi Tidak Ditemukan
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Mohon pastikan ID booking yang Anda masukkan sudah benar (misal: <code className="font-mono font-bold text-slate-800">LJ-2026-8812</code>). Jika Anda baru saja mengirim estimasi via WhatsApp, admin kami akan mengirimkan nomor ID booking resmi Anda segera.
                  </p>
                  <div className="pt-2">
                    <a
                      href={waDirectChat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#112D4E] hover:text-[#30E3CA] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Hubungi Tim Admin Lombok Journey</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Informational Guide */}
          {!searched && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Bagaimana cara mendapatkan ID Booking?</span>
              </div>
              <p className="leading-relaxed">
                ID Booking otomatis diberikan ketika Anda menyelesaikan konsultasi itinerary dan mengirim formulir estimasi trip melalui tombol WhatsApp Lombok Journey. ID ini digunakan untuk memantau persiapan driver, armada, dan briefing penjemputan.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end">
          <button
            id="btn-close-booking-status-footer"
            onClick={handleClose}
            className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
