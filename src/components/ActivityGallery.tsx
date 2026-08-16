import React, { useState } from 'react';
import { ACTIVITY_GALLERY, BUSINESS_INFO } from '../data/travelData';
import { GalleryActivity } from '../types';
import { Camera, MapPin, Calendar, Eye, MessageCircle, X, Sparkles, Compass, CheckCircle2 } from 'lucide-react';

export const ActivityGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryActivity | null>(null);

  const categories = [
    'Semua',
    'Snorkeling & Bahari',
    'Budaya & Adat',
    'Pantai & Sunset',
    'Pegunungan & Alam'
  ];

  const filteredActivities = activeCategory === 'Semua'
    ? ACTIVITY_GALLERY
    : ACTIVITY_GALLERY.filter((item) => item.category === activeCategory);

  return (
    <section id="galeri-kegiatan" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#30E3CA]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#112D4E]/5 border border-[#112D4E]/15 px-4 py-1.5 rounded-full text-xs font-bold text-[#112D4E] tracking-wider uppercase">
            <Camera className="w-4 h-4 text-[#D4AF37]" />
            <span>Dokumentasi Trip & Kegiatan Real</span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#112D4E] tracking-tight leading-tight">
            Galeri Foto & Aktivitas Wisatawan
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Momen autentik, keseruan snorkeling, keindahan budaya Sasak, dan petualangan tak terlupakan para tamu bersama tim <strong className="text-[#112D4E] font-semibold">Lombok Journey</strong>.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-2.5 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-[#112D4E] text-white shadow-md shadow-[#112D4E]/20 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.map((activity) => {
            const waText = encodeURIComponent(
              `Halo Lombok Journey! Saya tertarik dengan aktivitas *${activity.title}* (${activity.packageTag}). Mohon info penawaran dan jadwal tripnya.`
            );
            const waUrl = `${BUSINESS_INFO.waBaseUrl}?text=${waText}`;

            return (
              <div
                key={activity.id}
                onClick={() => setSelectedPhoto(activity)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Photo Container with Automatic Watermark */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badge: Package Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#112D4E]/90 backdrop-blur-md text-[#30E3CA] text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-white/10">
                      {activity.packageTag}
                    </span>
                  </div>

                  {/* Hover Quick Action Indicator */}
                  <div className="absolute inset-0 bg-[#112D4E]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="bg-white/95 text-[#112D4E] font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="w-4 h-4 text-[#D4AF37]" />
                      <span>Lihat Foto Penuh</span>
                    </div>
                  </div>

                  {/* AUTOMATIC WATERMARK OVERLAY */}
                  <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none select-none">
                    <div className="bg-[#112D4E]/85 backdrop-blur-md border border-white/25 px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
                      <img
                        src="/logo.svg"
                        alt="Lombok Journey"
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span className="text-[10px] font-extrabold text-white tracking-wider">
                        @lombokjourney
                      </span>
                    </div>
                  </div>

                  {/* Subtle Diagonal Watermark Texture in Corner */}
                  <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none opacity-80">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      LOMBOK JOURNEY
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="truncate max-w-[140px]">{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{activity.activityDate}</span>
                      </div>
                    </div>

                    <h3 className="font-playfair text-base font-bold text-[#112D4E] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                      {activity.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-light line-clamp-2 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>

                  {/* Card Bottom: Quick WA button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#112D4E] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#30E3CA]" />
                      <span>Dokumentasi Trip</span>
                    </span>

                    <a
                      href={waUrl}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] hover:text-[#b8952b] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 px-2.5 py-1 rounded-full transition-colors"
                      title="Tanya paket trip ini"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Pesan</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instagram Banner Callout */}
        <div className="mt-14 bg-gradient-to-r from-[#112D4E] to-[#1a3a63] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#30E3CA] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Update Kegiatan & Video Reels Harian</span>
            </div>
            <h4 className="font-playfair text-xl sm:text-2xl font-bold">
              Follow Instagram Kami: <span className="text-[#D4AF37]">@lombokjourney_</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
              Lihat reels dokumentasi keseruan tamu, tips wisata Lombok, dan ulasan langsung setiap hari di akun resmi Instagram kami.
            </p>
          </div>

          <a
            href={BUSINESS_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <span>Kunjungi @lombokjourney_</span>
            <Compass className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* LIGHTBOX MODAL PREVIEW WITH WATERMARK */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Tutup foto"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo View with Automatic Watermark */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-950 overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />

              {/* Watermark Overlay in Modal */}
              <div className="absolute bottom-4 right-4 z-20 pointer-events-none select-none">
                <div className="bg-[#112D4E]/90 backdrop-blur-md border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
                  <img
                    src="/logo.svg"
                    alt="Lombok Journey"
                    className="w-4 h-4 object-contain"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-extrabold text-white tracking-wider leading-none">
                      @lombokjourney
                    </span>
                    <span className="text-[8px] text-[#30E3CA] uppercase tracking-widest leading-tight font-semibold">
                      Tour & Travel Lombok
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Package Banner */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-[#112D4E]/90 backdrop-blur-md text-[#30E3CA] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-white/10">
                  {selectedPhoto.packageTag}
                </span>
              </div>
            </div>

            {/* Photo Info & Action */}
            <div className="p-6 sm:p-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-semibold text-[#112D4E]">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>{selectedPhoto.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Dokumentasi Trip: {selectedPhoto.activityDate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#112D4E]">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  {selectedPhoto.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#30E3CA]" />
                  <span>Dokumentasi resmi berlisensi <strong>@lombokjourney</strong></span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl"
                  >
                    Tutup
                  </button>
                  <a
                    href={`${BUSINESS_INFO.waBaseUrl}?text=${encodeURIComponent(
                      `Halo Lombok Journey! Saya melihat foto kegiatan *${selectedPhoto.title}* di website. Saya ingin memesan paket *${selectedPhoto.packageTag}*.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Pesan Paket Ini</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
