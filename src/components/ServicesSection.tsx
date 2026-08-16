import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TripService } from '../types';
import { TripDetailModal } from './TripDetailModal';
import { Check, MessageCircle, ArrowRight, UserCheck, Sun, Zap, Compass, Info, Mail } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, businessInfo } = useApp();
  const [selectedService, setSelectedService] = useState<TripService | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-[#D4AF37]" />;
      case 'Sun':
        return <Sun className="w-6 h-6 text-[#30E3CA]" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-[#D4AF37]" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-[#30E3CA]" />;
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
            Pilih paket tur impian Anda dengan pemandu lokal profesional, penjemputan fleksibel, dan harga terbaik.
          </p>
        </div>

        {/* 4 Columns Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {services.map((service) => {
            const waMessage = encodeURIComponent(
              `Halo Lombok Journey! Saya ingin pesan paket *${service.title}* (${service.priceStart}). Mohon info penawaran & jadwalnya.`
            );
            const waUrl = `${businessInfo.waBaseUrl}?text=${waMessage}`;
            const mailUrl = `mailto:${businessInfo.email}?subject=${encodeURIComponent(`Inquiry ${service.title}`)}&body=${encodeURIComponent(`Halo Lombok Journey,\n\nSaya tertarik dengan ${service.title} (${service.priceStart}).\nMohon rincian jadwal dan penawaran lengkapnya.`)}`;
            const isPopular = service.id === 'gili-escape-trip' || service.id === 'experience-trip';


            return (
              <div
                key={service.id}
                className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border ${
                  isPopular ? 'border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/10' : 'border-slate-200'
                } group hover:-translate-y-2`}
              >
                {/* Badge Banner */}
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#112D4E] text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-md z-10 tracking-wider">
                  {service.badge}
                </div>

                {/* Card Top Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.bgImage}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E] via-[#112D4E]/30 to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-1.5">
                      {getIcon(service.iconName)}
                    </div>
                    <h3 className="font-playfair text-xl font-bold leading-tight">{service.title}</h3>
                    <p className="text-[11px] text-slate-200 font-light line-clamp-1">{service.tagline}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    {/* Price Tag - Clean direct display */}
                    <div className="mb-3 pb-3 border-b border-slate-100">
                      <p className="text-xl font-black text-[#112D4E]">{service.priceStart}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 min-h-[36px]">
                      {service.description}
                    </p>

                    {/* Itinerary Items Checklist */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase text-[#112D4E] tracking-wider">
                        Rute & Itinerary:
                      </p>
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-[#30E3CA] shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 font-bold text-xs py-2.5 px-3 rounded-xl shadow transition-all bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E]"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Pesan via WA</span>
                    </a>

                    <a
                      href={mailUrl}
                      className="w-full flex items-center justify-center gap-2 font-semibold text-xs py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#112D4E]" />
                      <span>Inquiry Email</span>
                    </a>

                    <button
                      onClick={() => setSelectedService(service)}
                      className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-[#112D4E] pt-1 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-[#30E3CA]" />
                      <span>Lihat Rincian Fasilitas</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Custom Request & Email Inquiry Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-playfair text-xl font-bold text-[#112D4E]">
              Punya Rute Destinasi Impian Sendiri?
            </h4>
            <p className="text-sm text-slate-600 font-light">
              Konsultasikan rute custom trip Anda via WA ({businessInfo.formattedPhone}) atau email ke <strong className="text-[#112D4E]">{businessInfo.email}</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${businessInfo.email}?subject=${encodeURIComponent("Custom Trip Inquiry - Lombok Journey")}`}
              className="bg-slate-100 hover:bg-slate-200 text-[#112D4E] font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#112D4E]" />
              <span>Email Inquiry</span>
            </a>
            <a
              href={`${businessInfo.waBaseUrl}?text=${encodeURIComponent("Halo Lombok Journey, saya punya rute wisata sendiri di Lombok dan ingin pesan custom trip.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#30E3CA] hover:bg-[#28c2ac] text-[#112D4E] font-bold text-xs sm:text-sm px-5 py-3 rounded-full shadow transition-colors flex items-center gap-2"
            >
              <span>Chat WA Custom Trip</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
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
