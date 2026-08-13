import React from 'react';
import { MessageCircle, Sparkles, PhoneCall, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';

export const CtaBanner: React.FC = () => {
  const waMessage = encodeURIComponent(
    "Halo Lombok Journey! Saya ingin langsung pesan trip & tanya jadwal promo terbarunya."
  );
  const waUrl = `${BUSINESS_INFO.waBaseUrl}?text=${waMessage}`;

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container with Turquoise & Navy Gradient */}
        <div className="relative bg-gradient-to-r from-[#112D4E] via-[#163a63] to-[#0d2138] rounded-3xl p-8 sm:p-14 text-white overflow-hidden shadow-2xl border border-white/20">
          
          {/* Subtle Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#30E3CA]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#30E3CA]/20 border border-[#30E3CA]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#30E3CA] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Rencanakan Liburan Lombok Sekarang</span>
              </div>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Siap Menikmati Momen Tak Terlupakan di Lombok?
              </h2>

              <p className="text-sm sm:text-base text-slate-200 font-light max-w-2xl leading-relaxed">
                Jangan lewatkan keindahan pantai pasir putih, perairan snorkeling jernih, dan indahnya panorama Rinjani. Hubungi admin kami sekarang juga untuk penawaran spesial!
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-extrabold text-base px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-all text-center group"
              >
                <MessageCircle className="w-6 h-6 fill-current text-[#112D4E]" />
                <span>Hubungi WA 0888-9163-745</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <p className="text-xs text-slate-300 font-medium text-center">
                📲 Klik langsung untuk kirim pesan pesan otomatis
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
