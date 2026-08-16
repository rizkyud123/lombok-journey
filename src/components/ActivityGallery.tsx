import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryActivity } from '../types';
import { parseVideoUrl } from '../utils/videoEmbed';
import {
  Camera,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  X,
  Sparkles,
  Compass,
  CheckCircle2,
  Play,
  Video,
  Film,
  Layers,
  ExternalLink,
  Volume2
} from 'lucide-react';

export const ActivityGallery: React.FC = () => {
  const { galleryActivities, businessInfo } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryActivity | null>(null);

  const categories = [
    'Semua',
    'Snorkeling & Bahari',
    'Budaya & Adat',
    'Pantai & Sunset',
    'Pegunungan & Alam'
  ];

  const filteredActivities = galleryActivities.filter((item) => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const isVideo = item.mediaType === 'video';
    const matchMedia =
      mediaFilter === 'all'
        ? true
        : mediaFilter === 'video'
        ? isVideo
        : !isVideo;
    return matchCategory && matchMedia;
  });

  const parsedVideo = selectedItem && selectedItem.mediaType === 'video' && selectedItem.videoUrl
    ? parseVideoUrl(selectedItem.videoUrl)
    : null;

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
            <span>Dokumentasi Trip & Video Real</span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#112D4E] tracking-tight leading-tight">
            Galeri Foto & Video Wisatawan
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Momen autentik, video keseruan snorkeling, keindahan budaya Sasak, dan petualangan tak terlupakan para tamu bersama tim <strong className="text-[#112D4E] font-semibold">Lombok Journey</strong>.
          </p>
        </div>

        {/* Media & Category Controls */}
        <div className="mt-10 flex flex-col items-center gap-4">
          {/* Media Type Segment (All / Photos / Videos) */}
          <div className="inline-flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setMediaFilter('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mediaFilter === 'all'
                  ? 'bg-[#112D4E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua Media ({galleryActivities.length})</span>
            </button>

            <button
              onClick={() => setMediaFilter('image')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mediaFilter === 'image'
                  ? 'bg-[#112D4E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Foto Trip ({galleryActivities.filter((a) => a.mediaType !== 'video').length})</span>
            </button>

            <button
              onClick={() => setMediaFilter('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mediaFilter === 'video'
                  ? 'bg-[#112D4E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#30E3CA]" />
              <span>Video & Reels ({galleryActivities.filter((a) => a.mediaType === 'video').length})</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-[#D4AF37] text-[#112D4E] font-bold shadow-sm scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.map((activity) => {
            const isVideo = activity.mediaType === 'video';
            const waText = encodeURIComponent(
              `Halo Lombok Journey! Saya tertarik dengan aktivitas ${isVideo ? 'video' : 'foto'} *${activity.title}* (${activity.packageTag}). Mohon info penawaran dan jadwal tripnya.`
            );
            const waUrl = `${businessInfo.waBaseUrl}?text=${waText}`;

            return (
              <div
                key={activity.id}
                onClick={() => setSelectedItem(activity)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Media Container (Photo or Video Cover) */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badge: Package Tag & Video Indicator */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                    <span className="bg-[#112D4E]/90 backdrop-blur-md text-[#30E3CA] text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-white/10">
                      {activity.packageTag}
                    </span>

                    {isVideo && (
                      <span className="bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white/20 uppercase tracking-wider animate-pulse">
                        <Video className="w-3 h-3 fill-current" />
                        <span>Video Trip</span>
                      </span>
                    )}
                  </div>

                  {/* Video Duration / Platform Badge */}
                  {isVideo && activity.videoDuration && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-black/75 backdrop-blur-md text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                        {activity.videoDuration}
                      </span>
                    </div>
                  )}

                  {/* Center Play Button for Video or Zoom for Photo */}
                  <div className="absolute inset-0 bg-[#112D4E]/40 group-hover:bg-[#112D4E]/50 transition-colors duration-300 flex items-center justify-center z-10">
                    {isVideo ? (
                      <div className="w-14 h-14 rounded-full bg-[#30E3CA] text-[#112D4E] shadow-2xl flex items-center justify-center pl-1 group-hover:scale-110 group-hover:bg-white transition-all duration-300 ring-4 ring-white/30">
                        <Play className="w-6 h-6 fill-current text-[#112D4E]" />
                      </div>
                    ) : (
                      <div className="bg-white/95 text-[#112D4E] font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <Eye className="w-4 h-4 text-[#D4AF37]" />
                        <span>Lihat Foto</span>
                      </div>
                    )}
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

                  {/* Card Bottom: Action CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#112D4E] flex items-center gap-1">
                      {isVideo ? (
                        <>
                          <Play className="w-3.5 h-3.5 text-rose-600 fill-current" />
                          <span className="text-rose-700 font-bold">Putar Video</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#30E3CA]" />
                          <span>Dokumentasi Trip</span>
                        </>
                      )}
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

        {filteredActivities.length === 0 && (
          <div className="mt-12 text-center py-12 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto space-y-3">
            <Film className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Tidak ada media untuk filter ini</h4>
            <p className="text-xs text-slate-500">
              Silakan pilih kategori atau filter media lainnya di atas.
            </p>
          </div>
        )}

        {/* Instagram & Social Banner Callout */}
        <div className="mt-14 bg-gradient-to-r from-[#112D4E] to-[#1a3a63] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#30E3CA] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Update Video Reels & Dokumentasi Harian</span>
            </div>
            <h4 className="font-playfair text-xl sm:text-2xl font-bold">
              Follow Instagram Kami: <span className="text-[#D4AF37]">@lombokjourney_</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
              Lihat video reels dokumentasi keseruan tamu, tips snorkeling gili, dan ulasan langsung setiap hari di akun media sosial resmi kami.
            </p>
          </div>

          <a
            href={businessInfo.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <span>Kunjungi @lombokjourney_</span>
            <Compass className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* POPUP MODAL: LIGHTBOX PHOTO OR INTERACTIVE VIDEO PLAYER */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className={`relative bg-white rounded-3xl w-full overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] ${
              selectedItem.mediaType === 'video' && parsedVideo?.isShortOrReel
                ? 'max-w-md'
                : 'max-w-4xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg border border-white/20"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Player / Image Display */}
            <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden">
              {selectedItem.mediaType === 'video' ? (
                /* VIDEO PLAYER CONTAINER */
                <div
                  className={`w-full relative flex items-center justify-center bg-black ${
                    parsedVideo?.isShortOrReel
                      ? 'aspect-[9/16] max-h-[65vh]'
                      : 'aspect-[16/9] max-h-[60vh]'
                  }`}
                >
                  {/* YouTube Embed */}
                  {parsedVideo?.type === 'youtube' && parsedVideo.embedUrl && (
                    <iframe
                      src={parsedVideo.embedUrl}
                      title={selectedItem.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}

                  {/* TikTok Embed */}
                  {parsedVideo?.type === 'tiktok' && parsedVideo.embedUrl && (
                    <iframe
                      src={parsedVideo.embedUrl}
                      title={selectedItem.title}
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  )}

                  {/* Instagram Embed */}
                  {parsedVideo?.type === 'instagram' && parsedVideo.embedUrl && (
                    <iframe
                      src={parsedVideo.embedUrl}
                      title={selectedItem.title}
                      className="w-full h-full border-0"
                      allow="encrypted-media"
                      allowFullScreen
                    />
                  )}

                  {/* Direct MP4 / Uploaded Video File */}
                  {(parsedVideo?.type === 'direct' || parsedVideo?.type === 'upload') && (
                    <video
                      src={parsedVideo.embedUrl || selectedItem.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                      poster={selectedItem.image}
                    >
                      Browser Anda tidak mendukung pemutar video HTML5.
                    </video>
                  )}

                  {/* Unknown / Fallback Player */}
                  {parsedVideo?.type === 'unknown' && selectedItem.videoUrl && (
                    <div className="p-8 text-center text-white space-y-3">
                      <Film className="w-12 h-12 text-[#30E3CA] mx-auto animate-bounce" />
                      <p className="text-sm font-semibold">Video Siap Diputar di Platform Aslinya</p>
                      <a
                        href={selectedItem.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#30E3CA] text-[#112D4E] font-bold text-xs rounded-full shadow-lg"
                      >
                        <span>Buka Video di Tab Baru</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                /* PHOTO DISPLAY WITH WATERMARK */
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
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
                </div>
              )}

              {/* Top Package Banner */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="bg-[#112D4E]/90 backdrop-blur-md text-[#30E3CA] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-white/10">
                  {selectedItem.packageTag}
                </span>

                {selectedItem.mediaType === 'video' && (
                  <span className="bg-rose-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/10">
                    <Video className="w-3.5 h-3.5 fill-current" />
                    <span>Video Real</span>
                  </span>
                )}
              </div>
            </div>

            {/* Media Info & Action */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-semibold text-[#112D4E]">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>{selectedItem.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Dokumentasi Trip: {selectedItem.activityDate}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#112D4E]">
                  {selectedItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  {selectedItem.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#30E3CA]" />
                  <span>
                    Dokumentasi resmi berlisensi <strong>@lombokjourney</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl"
                  >
                    Tutup
                  </button>
                  <a
                    href={`${businessInfo.waBaseUrl}?text=${encodeURIComponent(
                      `Halo Lombok Journey! Saya melihat ${selectedItem.mediaType === 'video' ? 'video' : 'foto'} kegiatan *${selectedItem.title}* di website. Saya ingin konsultasi & reservasi paket *${selectedItem.packageTag}*.`
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

