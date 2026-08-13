import React, { useState } from 'react';
import { TRIP_SERVICES, BUSINESS_INFO } from '../data/travelData';
import { TripService } from '../types';
import { TripDetailModal } from './TripDetailModal';
import { Check, MessageCircle, ArrowRight, UserCheck, Sun, Zap, Info } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<TripService | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-[#D4AF37]" />;
      case 'Sun':
        return <Sun className="w-6 h-6 text-[#30E3CA]" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-[#D4AF37]" />;
      default:
        return <UserCheck className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  return (
    <section id="layanan" className="py-20 bg-[#F5F5F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112D4E]/10 border border-[#112D4E]/15 text-xs font-semibold text-[#112D4E] uppercase tracking-wider">
            Layanan Utama Lombok Journey
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#112D4E]">
            Paket Trip Pilihan Terfavorit
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Pilih jenis tur yang sesuai dengan waktu, gaya liburan, dan jumlah anggota rombongan Anda.
          </p>
        </div>

        {/* 3 Columns Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {TRIP_SERVICES.map((service) => {
            const waMessage = encodeURIComponent(
              `Halo Lombok Journey! Saya ingin konsultasi & pesan paket *${service.title}* (${service.priceStart}). Mohon rincian itinerary & penawaran harganya.`
            );
            const waUrl = `${BUSINESS_INFO.waBaseUrl}?text=${waMessage}`;
            const isPopular = service.id === 'private-trip';

            return (
              <div
                key={service.id}
                className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border ${
                  isPopular ? 'border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/10' : 'border-slate-200'
                } group hover:-translate-y-2`}
              >
                {/* Popular Badge Banner */}
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#112D4E] text-[11px] font-extrabold uppercase px-4 py-1.5 rounded-bl-2xl shadow-md z-10 tracking-wider">
                    {service.badge}
                  </div>
                )}

                {/* Card Top Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.bgImage}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E] via-[#112D4E]/30 to-transparent" />
                  
                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                      {getIcon(service.iconName)}
                    </div>
                    <h3 className="font-playfair text-2xl font-bold">{service.title}</h3>
                    <p className="text-xs text-slate-200 font-light line-clamp-1">{service.tagline}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Price Tag */}
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Mulai Dari</span>
                      <p className="text-2xl font-black text-[#112D4E]">{service.priceStart}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Feature Checklists */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                        Fasilitas Termasuk:
                      </p>
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-[#30E3CA] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 font-bold text-sm py-3 px-4 rounded-xl shadow transition-all ${
                        isPopular
                          ? 'bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E]'
                          : 'bg-[#112D4E] hover:bg-[#1a3a63] text-white'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Pesan Paket Ini via WA</span>
                    </a>

                    <button
                      onClick={() => setSelectedService(service)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#112D4E] py-2 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-[#30E3CA]" />
                      <span>Lihat Detail Itinerary Paket</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Custom Request Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-playfair text-xl font-bold text-[#112D4E]">
              Punya Rute Destinasi Impian Sendiri?
            </h4>
            <p className="text-sm text-slate-600 font-light">
              Konsultasikan jadwal tur custom khusus sesuai preferensi Anda dengan tim Lombok Journey secara GRATIS!
            </p>
          </div>
          <a
            href={`${BUSINESS_INFO.waBaseUrl}?text=${encodeURIComponent("Halo Lombok Journey, saya punya rute wisata sendiri di Lombok dan ingin pesan custom trip.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#30E3CA] hover:bg-[#28c2ac] text-[#112D4E] font-bold text-sm px-6 py-3 rounded-full shadow transition-colors flex items-center gap-2"
          >
            <span>Rancang Trip Custom</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Modal View */}
      <TripDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};
