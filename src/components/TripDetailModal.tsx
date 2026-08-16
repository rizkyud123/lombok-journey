import React from 'react';
import { X, CheckCircle, MapPin, Sparkles, MessageCircle, AlertCircle, Mail } from 'lucide-react';
import { TripService } from '../types';
import { useApp } from '../context/AppContext';

interface TripDetailModalProps {
  service: TripService | null;
  onClose: () => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({ service, onClose }) => {
  const { businessInfo } = useApp();
  if (!service) return null;

  const waText = encodeURIComponent(
    `Halo Lombok Journey! Saya tertarik dan ingin menanyakan ketersediaan paket *${service.title}* (${service.priceStart}). Mohon info penawaran itinerary & tanggalnya.`
  );
  const waUrl = `${businessInfo.waBaseUrl}?text=${waText}`;
  const mailUrl = `mailto:${businessInfo.email}?subject=${encodeURIComponent(`Inquiry ${service.title}`)}&body=${encodeURIComponent(`Halo Lombok Journey,\n\nSaya tertarik dengan ${service.title} (${service.priceStart}).\nMohon rincian jadwal dan penawaran lengkapnya.`)}`;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Image */}
        <div className="relative h-48 sm:h-56 bg-slate-900 shrink-0">
          <img
            src={service.bgImage}
            alt={service.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E] via-[#112D4E]/40 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title Banner */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37] text-[#112D4E] font-bold text-xs uppercase tracking-wider">
              {service.badge}
            </span>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold">
              {service.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 font-light">
              {service.tagline}
            </p>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Price & Target Group */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F5F5F5] rounded-2xl border border-slate-200">
            <div>
              <p className="text-2xl font-extrabold text-[#112D4E]">{service.priceStart}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Cocok Untuk</p>
              <p className="text-sm font-semibold text-[#112D4E]">{service.recommendedFor}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-playfair font-bold text-lg text-[#112D4E] mb-2">
              Tentang Paket
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              {service.description}
            </p>
          </div>

          {/* Key Itinerary Features */}
          <div>
            <h4 className="font-playfair font-bold text-lg text-[#112D4E] mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              Rute & Itinerary
            </h4>
            <ul className="space-y-2 text-sm">
              {service.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#30E3CA] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Included Facilities */}
          <div>
            <h4 className="font-playfair font-bold text-lg text-[#112D4E] mb-3">
              Fasilitas Termasuk (Include)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              {service.includes.map((inc, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#112D4E]" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Destination Spots */}
          <div>
            <h4 className="font-playfair font-bold text-lg text-[#112D4E] mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#112D4E]" />
              Spot Destinasi Pilihan
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.popularSpot.map((spot, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#112D4E]/10 text-[#112D4E] text-xs font-semibold border border-[#112D4E]/15"
                >
                  📍 {spot}
                </span>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Catatan:</strong> Rute destinasi dan jadwal waktu penjemputan dapat disesuaikan penuh sesuai jam kedatangan tiket pesawat atau hotel Anda.
            </p>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <a
              href={mailUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-[#112D4E] font-bold text-xs px-4 py-3 rounded-full transition-colors"
            >
              <Mail className="w-4 h-4 text-[#112D4E]" />
              <span>Inquiry Email</span>
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-bold text-xs sm:text-sm px-5 py-3 rounded-full shadow-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Pesan via WA</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
