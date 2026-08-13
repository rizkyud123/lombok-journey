import React from 'react';
import { Compass, Instagram, Phone, MapPin, MessageCircle, Heart } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';

export const Footer: React.FC = () => {
  const waUrl = `${BUSINESS_INFO.waBaseUrl}?text=${encodeURIComponent("Halo Lombok Journey, saya tertarik untuk bertanya tentang liburan ke Lombok.")}`;

  return (
    <footer id="kontak" className="bg-[#112D4E] text-slate-300 pt-16 pb-12 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#112D4E]">
                <Compass className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="font-playfair text-2xl font-bold text-white tracking-tight">
                Lombok Journey
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-md">
              Agensi Tour & Travel lokal resmi spesialis Private Trip, Full Day Trip, dan Short Trip di Pulau Lombok. Melayani dengan keramahan khas Sasak, armada aman, dan kebebasan atur itinerary.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#112D4E] text-white flex items-center justify-center transition-all"
                aria-label="Instagram @lombokjourney_"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#30E3CA] hover:text-[#112D4E] text-white flex items-center justify-center transition-all"
                aria-label="WhatsApp Lombok Journey"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-playfair text-lg font-bold text-white">
              Menu Navigasi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-light">
              <li>
                <a href="#beranda" className="hover:text-[#D4AF37] transition-colors">Beranda Utama</a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-[#D4AF37] transition-colors">Tentang Kami</a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-[#D4AF37] transition-colors">Layanan Paket Trip</a>
              </li>
              <li>
                <a href="#destinasi" className="hover:text-[#D4AF37] transition-colors">Destinasi Populer</a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-[#D4AF37] transition-colors">Hitung Custom Trip</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#D4AF37] transition-colors">Pertanyaan FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-playfair text-lg font-bold text-white">
              Kontak Resmi
            </h4>

            <div className="space-y-3 text-xs sm:text-sm font-light">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#D4AF37] transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-[#30E3CA] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[11px]">WhatsApp Direct Line</span>
                  <span className="font-semibold text-white group-hover:text-[#D4AF37]">
                    +62 888-9163-745 ({BUSINESS_INFO.formattedPhone})
                  </span>
                </div>
              </a>

              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-[#D4AF37] transition-colors group"
              >
                <Instagram className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[11px]">Instagram Official</span>
                  <span className="font-semibold text-white group-hover:text-[#D4AF37]">
                    {BUSINESS_INFO.instagramHandle}
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-[#30E3CA] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[11px]">Lokasi Operasional</span>
                  <span>{BUSINESS_INFO.location}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Dirancang dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
            <span>untuk Pariwisata Indonesia & Lombok</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
