import React from 'react';
import { ShieldCheck, UserCheck, HeartHandshake, Award, Clock, MapPinCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutSection: React.FC = () => {
  const { businessInfo } = useApp();
  const values = [
    {
      icon: UserCheck,
      title: "Pemandu Lokal Berpengalaman",
      description: "Tim driver dan guide kami merupakan putra asli Lombok yang mengenal setiap sudut keindahan pulau, cerita sejarah, dan spot tersembunyi yang instagramable.",
    },
    {
      icon: ShieldCheck,
      title: "Pelayanan Aman & Terpercaya",
      description: "Armada kendaraan selalu dalam kondisi prima, bersih, ber-AC dingin, serta mengutamakan keselamatan dan kenyamanan penuh seluruh anggota keluarga Anda.",
    },
    {
      icon: HeartHandshake,
      title: "Fleksibilitas Tanpa Batas",
      description: "Kami paham setiap wisatawan punya selera berbeda. Jadwal tur dapat disesuaikan penuh secara kustom sesuai tempo dan kenyamanan Anda.",
    },
    {
      icon: Award,
      title: "Harga Transparan Tanpa Biaya Siluman",
      description: "Seluruh rincian biaya tiket, bbm, parkir, dan perahu sudah dijelaskan transparan sejak awal tanpa kejutan biaya tak terduga di lokasi.",
    },
  ];

  const highlights = [
    "Armada Terawat (Avanza, Innova, HiAce, Coaster)",
    "Penjemputan Bandara LOP & Seluruh Hotel Lombok",
    "Pilihan Kuliner Khas Lombok Terpercaya",
    "Pendampingan Snorkeling & Fotografi Trip",
  ];

  return (
    <section id="tentang" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112D4E]/5 border border-[#112D4E]/10 text-xs font-semibold text-[#112D4E] uppercase tracking-wider">
            Tentang Lombok Journey
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#112D4E]">
            Solusi Liburan Lombok yang Aman, Nyaman, dan Berkesan
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            <strong className="font-semibold text-[#112D4E]">{businessInfo.name}</strong> hadir sebagai mitra perjalanan terpercaya di Pulau Lombok. Kami berkomitmen memberikan pengalaman perjalanan yang menyenangkan lewat pelayanan hangat khas Sasak.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#F5F5F5] rounded-2xl p-6 border border-slate-200/80 hover:border-[#D4AF37] hover:bg-white shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#112D4E] text-[#D4AF37] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#112D4E] transition-all">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-[#112D4E] mt-5 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Story & Image Row */}
        <div className="mt-16 bg-[#112D4E] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          {/* Subtle Decorative Circle */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#30E3CA]/10 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-semibold text-[#30E3CA] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                Komitmen Pelayanan
              </span>
              <h3 className="font-playfair text-2xl sm:text-4xl font-bold leading-tight">
                Rasakan Kehangatan Pemandu Lokal & Layanan Personal
              </h3>
              <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
                Dari indahnya perairan Gili Trawangan hingga keasrian Desa Adat Sade dan megahnya Puncak Rinjani, Lombok Journey memastikan setiap detik liburan Anda terisi kenangan manis tanpa kekhawatiran logistik.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {highlights.map((point, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-sm text-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-[#30E3CA] shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <a
                  href={`${businessInfo.waBaseUrl}?text=${encodeURIComponent("Halo Lombok Journey, saya ingin konsultasi rencana liburan.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-bold px-6 py-3 rounded-full text-sm shadow-lg transition-colors"
                >
                  <span>Konsultasi Rencana Trip</span>
                </a>
                <a
                  href={businessInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-300 hover:text-[#30E3CA] underline underline-offset-4 font-medium transition-colors"
                >
                  Ikuti IG {businessInfo.instagramHandle}
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"
                  alt="Wisatawan Lombok Journey"
                  className="w-full h-72 sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3.5 rounded-xl text-xs text-white border border-white/20">
                  <p className="font-semibold text-[#D4AF37]">Lombok Journey Guaranteed Service</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">Penjemputan Tepat Waktu & Armada Ber-AC Nyaman</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
