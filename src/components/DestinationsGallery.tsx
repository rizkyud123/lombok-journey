import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LombokDestination } from '../types';
import { MapPin, Clock, Sparkles, MessageCircle, Compass } from 'lucide-react';

export const DestinationsGallery: React.FC = () => {
  const { destinations, businessInfo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Pantai & Gili', 'Air Terjun', 'Gunung & Alam', 'Budaya & Desa'];

  const filteredDestinations = selectedCategory === 'Semua'
    ? destinations
    : destinations.filter(d => d.category === selectedCategory);

  return (
    <section id="destinasi" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112D4E]/10 text-xs font-semibold text-[#112D4E] uppercase tracking-wider">
            Eksplorasi Keindahan
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#112D4E]">
            Destinasi Ikonik Pulau Lombok
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-light">
            Temukan spot wisata terbaik di Lombok yang siap Anda kunjungi bersama pemandu lokal Lombok Journey.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#112D4E] text-white shadow-md'
                  : 'bg-[#F5F5F5] text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((spot) => {
            const waMessage = encodeURIComponent(
              `Halo Lombok Journey! Saya tertarik untuk mengunjungi destinasi *${spot.name}* (${spot.location}). Mohon rekomendasi paket trip-nya.`
            );
            const waUrl = `${businessInfo.waBaseUrl}?text=${waMessage}`;


            return (
              <div
                key={spot.id}
                className="bg-[#F5F5F5] rounded-3xl overflow-hidden border border-slate-200/80 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-[#112D4E]/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                    {spot.category}
                  </span>

                  {/* Location & Title Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1 text-xs text-[#30E3CA] font-medium mb-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{spot.location}</span>
                    </div>
                    <h3 className="font-playfair text-xl font-bold leading-snug">
                      {spot.name}
                    </h3>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {spot.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400 font-medium">Highlight:</span>
                      <span className="font-semibold text-[#112D4E]">{spot.highlight}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400 font-medium">Waktu Terbaik:</span>
                      <span className="font-medium text-slate-600">{spot.bestTime}</span>
                    </div>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#112D4E] text-[#112D4E] hover:text-white border border-[#112D4E] font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span>Tanyakan Trip Ke Sini</span>
                  </a>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
