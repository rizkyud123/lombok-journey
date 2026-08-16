import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MessageCircle, Phone, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { businessInfo, setIsAdminModalOpen, setIsBookingStatusModalOpen } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastLogoClickRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_CLICK_DELAY = 450; // ms
    if (now - lastLogoClickRef.current < DOUBLE_CLICK_DELAY) {
      e.preventDefault();
      setIsAdminModalOpen(true);
      lastLogoClickRef.current = 0;
    } else {
      lastLogoClickRef.current = now;
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang', href: '#tentang' },
    { name: 'Layanan', href: '#layanan' },
    { name: 'Destinasi', href: '#destinasi' },
    { name: 'Hitung Trip', href: '#estimator' },
    { name: 'Galeri Kegiatan', href: '#galeri-kegiatan' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Kontak', href: '#kontak' },
  ];

  const waMessage = encodeURIComponent("Halo Lombok Journey, saya ingin konsultasi mengenai paket liburan Lombok.");
  const waUrl = `${businessInfo.waBaseUrl}?text=${waMessage}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-lg py-3 text-white'
          : 'bg-gradient-to-b from-black/70 via-black/40 to-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo (Double Click / Tap 2x to Open Admin Login) */}
          <a
            href="#beranda"
            onClick={handleLogoClick}
            onDoubleClick={(e) => {
              e.preventDefault();
              setIsAdminModalOpen(true);
            }}
            className="flex items-center gap-3 group select-none cursor-pointer"
            title="Lombok Journey Tour & Travel"
          >
            <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-lg group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
              <img
                src="/logo.svg"
                alt="Lombok Journey Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-playfair text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                {businessInfo.name}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-300 font-semibold -mt-0.5">
                Tour & Travel
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-100 hover:text-[#D4AF37] hover:bg-white/10 transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              id="btn-nav-check-booking"
              type="button"
              onClick={() => setIsBookingStatusModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#30E3CA]/50 transition-all shadow-sm"
              title="Cek Status Booking & Reservasi Trip"
            >
              <Search className="w-3.5 h-3.5 text-[#30E3CA]" />
              <span>Cek Status Booking</span>
            </button>

            <a
              id="btn-nav-whatsapp"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-semibold text-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Pesan WA</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              id="btn-mobile-check-booking"
              type="button"
              onClick={() => setIsBookingStatusModalOpen(true)}
              className="inline-flex items-center justify-center p-2 bg-white/10 text-[#30E3CA] rounded-full border border-white/20"
              aria-label="Cek Status Booking"
              title="Cek Status Booking"
            >
              <Search className="w-4 h-4" />
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 bg-[#D4AF37] text-[#112D4E] rounded-full shadow"
              aria-label="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-white/15 bg-[#112D4E]/95 backdrop-blur-md rounded-2xl px-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-100 hover:text-[#D4AF37] hover:bg-white/10 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  id="btn-drawer-check-booking"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsBookingStatusModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 rounded-xl shadow-md text-center text-sm"
                >
                  <Search className="w-4 h-4 text-[#30E3CA]" />
                  <span>Cek Status Booking / Reservasi</span>
                </button>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-[#112D4E] font-semibold py-3 rounded-xl shadow-md text-center"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Pesan Sekarang via WA ({businessInfo.formattedPhone})</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};


