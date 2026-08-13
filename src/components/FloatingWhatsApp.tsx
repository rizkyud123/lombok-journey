import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const waMessage = encodeURIComponent(
    "Halo Lombok Journey! Saya ingin bertanya mengenai pilihan paket trip ke Lombok."
  );
  const waUrl = `${BUSINESS_INFO.waBaseUrl}?text=${waMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Tooltip Badge */}
      {showTooltip && (
        <div className="relative bg-white text-slate-800 text-xs font-semibold px-4 py-2 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-2 animate-bounce">
          <span>Chat Admin Lombok Journey 💬</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-700 ml-1"
            aria-label="Tutup tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-200" />
        </div>
      )}

      {/* Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-[#20ba5a] transition-all duration-300"
        aria-label="Chat WhatsApp Lombok Journey"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10" />
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
};
