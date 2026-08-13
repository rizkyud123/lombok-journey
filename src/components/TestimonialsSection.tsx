import React from 'react';
import { REVIEWS } from '../data/travelData';
import { Star, Quote, ThumbsUp } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112D4E]/10 text-xs font-semibold text-[#112D4E] uppercase tracking-wider">
            Testimoni Asli
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#112D4E]">
            Kata Wisatawan Tentang Lombok Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-light">
            Kepuasan, kenyamanan, dan kebahagiaan wisatawan adalah prioritas utama setiap trip kami.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#F5F5F5] rounded-3xl p-6 sm:p-8 border border-slate-200/80 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-200 group-hover:text-[#D4AF37]/20 transition-colors" />

              <div className="space-y-4 relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-light">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37]"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#112D4E]">{rev.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{rev.origin}</span>
                    <span>•</span>
                    <span className="text-[#112D4E] font-medium">{rev.tripType}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
