import React from 'react';
import { MessageCircle, ShieldCheck, MapPin, Sparkles, ArrowRight, Star } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';

export const Hero: React.FC = () => {
  const waMessage = encodeURIComponent(
    "Halo Lombok Journey! Saya ingin berkonsultasi & pesan trip untuk liburan ke Lombok."
  );
  const waUrl = `${BUSINESS_INFO.waBaseUrl}?text=${waMessage}`;

  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop"
          alt="Pantai & Alam Lombok - Lombok Journey"
          className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
        />
        {/* Deep Navy & Charcoal Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#112D4E]/90 via-[#112D4E]/70 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E] via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-[#30E3CA]/40 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white shadow-xl">
              <Sparkles className="w-4 h-4 text-[#30E3CA]" />
              <span>Agensi Tour & Travel Resmi Lombok - @lombokjourney_</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Jelajahi Keindahan <span className="text-[#D4AF37] italic underline decoration-[#30E3CA]/50">Lombok</span> Sesuai Gaya Anda
            </h1>

            {/* Sub-heading */}
            <p className="text-base sm:text-xl text-slate-200 max-w-2xl font-light leading-relaxed">
              Spesialis <strong className="font-semibold text-white">Private Trip</strong>,{' '}
              <strong className="font-semibold text-white">Full Day Trip</strong>, dan{' '}
              <strong className="font-semibold text-white">Short Trip</strong> bersama Lombok Journey. Pemandu lokal profesional, armada bersih, dan harga terbaik transparan.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-bold text-base sm:text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-[#D4AF37]/30 hover:-translate-y-1 transition-all group"
              >
                <MessageCircle className="w-6 h-6 fill-current text-[#112D4E]" />
                <span>Pesan Trip Sekarang</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#layanan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold text-base px-7 py-4 rounded-full backdrop-blur-md hover:-translate-y-0.5 transition-all"
              >
                <span>Lihat Pilihan Paket</span>
              </a>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#30E3CA]/20 border border-[#30E3CA]/40 flex items-center justify-center text-[#30E3CA]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-300">Driver & Guide</p>
                  <p className="text-sm font-bold text-white">100% Lokal Asli</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-300">Itinerary</p>
                  <p className="text-sm font-bold text-white">Bebas Custom</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-300">Rating Wisatawan</p>
                  <p className="text-sm font-bold text-white">4.9 / 5.0 Bintang</p>
                </div>
              </div>
            </div>

          </div>

          {/* Side Hero Card / Quick Feature Highlight */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="glass-card rounded-3xl p-6 text-slate-800 shadow-2xl border border-white/40 space-y-5 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#30E3CA] bg-[#112D4E] px-3 py-1 rounded-full">
                    Lombok Journey
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-[#112D4E] mt-2">
                    Siap Berlibur?
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Nikmati kemudahan eksplorasi Gili Trawangan, Sirkuit Mandalika, Air Terjun Tiu Kelep, dan Sembalun tanpa pusing urusan transportasi.
              </p>

              <div className="space-y-2.5 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#30E3CA]" />
                  <span>Jaminan Harga Terbaik & Transparan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>Penjemputan Tepat Waktu di Bandara/Hotel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#112D4E]" />
                  <span>Gratis Dokumentasi Foto Selama Trip</span>
                </div>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#112D4E] hover:bg-[#1a3a63] text-white font-semibold text-sm py-3 rounded-xl shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Konsultasi Gratis via WA</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
