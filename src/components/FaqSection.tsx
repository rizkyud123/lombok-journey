import React, { useState } from 'react';
import { FAQS, BUSINESS_INFO } from '../data/travelData';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[#F5F5F5] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112D4E]/10 text-xs font-semibold text-[#112D4E] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>Pertanyaan Umum</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#112D4E]">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light">
            Temukan jawaban cepat seputar pemesanan, layanan, dan fasilitas trip bersama Lombok Journey.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-12 space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-playfair font-bold text-base sm:text-lg text-[#112D4E] hover:text-[#D4AF37] transition-colors focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#112D4E] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#D4AF37]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 font-light leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Help Box */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3">
          <p className="text-sm text-slate-700 font-medium">
            Punya pertanyaan khusus yang belum terjawab di atas?
          </p>
          <a
            href={`${BUSINESS_INFO.waBaseUrl}?text=${encodeURIComponent("Halo Lombok Journey, saya ingin menanyakan hal lain tentang paket trip.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#112D4E] hover:bg-[#1a3a63] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>Tanyakan Langsung ke Admin WA</span>
          </a>
        </div>

      </div>
    </section>
  );
};
