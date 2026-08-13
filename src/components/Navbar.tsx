import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang', href: '#tentang' },
    { name: 'Layanan', href: '#layanan' },
    { name: 'Destinasi', href: '#destinasi' },
    { name: 'Hitung Trip', href: '#estimator' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Kontak', href: '#kontak' },
  ];

  const waMessage = encodeURIComponent("Halo Lombok Journey, saya ingin konsultasi mengenai paket liburan Lombok.");
  const waUrl = `${BUSINESS_INFO.waBaseUrl}?text=${waMessage}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-lg py-3 text-white'
          : 'bg-gradient-to-b from-black/70 via-black/40 to-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#beranda" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#112D4E] shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-playfair text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                Lombok Journey
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-300 font-medium -mt-1">
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

          {/* Desktop WhatsApp CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-semibold text-sm px-4 py-2.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Pesan WA</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
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
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-[#112D4E] font-semibold py-3 rounded-xl shadow-md text-center"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Pesan Sekarang via WA (0888-9163-745)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
