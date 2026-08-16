import React, { useState } from 'react';
import { Calculator, MessageCircle, Mail, Check, Users, Calendar, MapPin, Sparkles, Compass, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TripEstimator: React.FC = () => {
  const { businessInfo, estimatorConfig } = useApp();

  const [tripType, setTripType] = useState<string>('Paket Experience Trip');
  const [paxCount, setPaxCount] = useState<string>('3-5 Orang');
  const [duration, setDuration] = useState<string>('Full Day');
  const [selectedSpots, setSelectedSpots] = useState<string[]>([
    'Desa Sade (foto baju adat)',
    'Pantai Kuta Mandalika',
    'Pantai Tanjung Aan'
  ]);

  const handleSpotToggle = (spot: string) => {
    if (selectedSpots.includes(spot)) {
      setSelectedSpots(selectedSpots.filter(s => s !== spot));
    } else {
      setSelectedSpots([...selectedSpots, spot]);
    }
  };

  // Stepper calculations
  const isStep1Done = Boolean(tripType);
  const isStep2Done = Boolean(paxCount && duration);
  const isStep3Done = selectedSpots.length > 0;
  const isStep4Done = isStep1Done && isStep2Done && isStep3Done;

  const completedStepsCount = [isStep1Done, isStep2Done, isStep3Done, isStep4Done].filter(Boolean).length;
  const progressPercent = Math.round((completedStepsCount / 4) * 100);

  const steps = [
    {
      id: 1,
      title: 'Pilih Paket',
      subtitle: tripType || 'Belum dipilih',
      icon: Compass,
      isDone: isStep1Done,
    },
    {
      id: 2,
      title: 'Peserta & Waktu',
      subtitle: `${paxCount} • ${duration}`,
      icon: Users,
      isDone: isStep2Done,
    },
    {
      id: 3,
      title: 'Spot Wisata',
      subtitle: selectedSpots.length > 0 ? `${selectedSpots.length} spot dipilih` : 'Pilih minimal 1 spot',
      icon: MapPin,
      isDone: isStep3Done,
    },
    {
      id: 4,
      title: 'Siap Dikirim',
      subtitle: isStep4Done ? 'Inquiry Lengkap' : 'Lengkapi data',
      icon: Send,
      isDone: isStep4Done,
    },
  ];

  // Generate Email & WhatsApp Message
  const generatedText = `Halo Lombok Journey! Saya ingin konsultasi & pesan trip dengan detail berikut:
• Paket Choice: ${tripType}
• Jumlah Peserta: ${paxCount}
• Durasi: ${duration}
• Destinasi / Spot: ${selectedSpots.length > 0 ? selectedSpots.join(', ') : 'Belum ditentukan'}

Mohon rincian penawaran & jadwal ketersediaannya. Terima kasih!`;

  const waUrl = `${businessInfo.waBaseUrl}?text=${encodeURIComponent(generatedText)}`;
  const mailUrl = `mailto:${businessInfo.email}?subject=${encodeURIComponent(`Inquiry ${tripType} - Lombok Journey`)}&body=${encodeURIComponent(generatedText)}`;


  return (
    <section id="estimator" className="py-20 bg-[#112D4E] text-white relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#30E3CA]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#30E3CA] uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Kalkulator & Custom Trip Inquiry</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold">
            Rancang Liburan Impian Anda Sendiri
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-light">
            Pilih preferensi liburan Anda di bawah ini dan dapatkan estimasi penawaran resmi dari tim Lombok Journey via WhatsApp atau Email (<strong className="text-[#30E3CA]">{businessInfo.email}</strong>)!
          </p>
        </div>

        {/* Interactive Estimator Form Box */}
        <div className="mt-12 bg-white text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20">
          
          {/* Visual Progress Stepper */}
          <div className="mb-10 pb-8 border-b border-slate-200">
            {/* Header progress bar */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#30E3CA] animate-pulse"></span>
                <span className="text-xs font-bold text-[#112D4E] uppercase tracking-wider">
                  Progress Konfigurasi Trip
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#112D4E]">
                  {progressPercent}% Selesai
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#112D4E]/10 text-[#112D4E]">
                  {completedStepsCount} dari 4 Langkah
                </span>
              </div>
            </div>

            {/* Progress bar line */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-6 border border-slate-200/80">
              <div
                className="h-full bg-gradient-to-r from-[#112D4E] via-[#30E3CA] to-[#D4AF37] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stepper Grid Items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                      step.isDone
                        ? 'bg-slate-50 border-emerald-300 shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          step.isDone
                            ? 'bg-[#112D4E] text-[#30E3CA] shadow'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {step.isDone ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                          OK
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                          Step {step.id}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#112D4E] leading-tight">
                        {step.id}. {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Inputs Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Trip Type */}
              <div>
                <label className="block text-xs font-bold text-[#112D4E] uppercase tracking-wider mb-2">
                  1. Pilih Paket Trip Pilihan
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {estimatorConfig.tripTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTripType(type)}
                      className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all text-left ${
                        tripType === type
                          ? 'bg-[#112D4E] text-white border-[#112D4E] shadow-md'
                          : 'bg-[#F5F5F5] text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Pax Count & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#112D4E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    <span>2. Jumlah Peserta</span>
                  </label>
                  <select
                    value={paxCount}
                    onChange={(e) => setPaxCount(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-slate-200 rounded-xl py-3 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#112D4E]"
                  >
                    {estimatorConfig.paxOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#112D4E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#30E3CA]" />
                    <span>3. Durasi Liburan</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-slate-200 rounded-xl py-3 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#112D4E]"
                  >
                    {estimatorConfig.durations.map((dur) => (
                      <option key={dur} value={dur}>{dur}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Spot Destinations */}
              <div>
                <label className="block text-xs font-bold text-[#112D4E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#112D4E]" />
                  <span>4. Pilih Spot Wisata Favorit ({selectedSpots.length} Dipilih)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#F5F5F5] rounded-2xl border border-slate-200">
                  {estimatorConfig.availableSpots.map((spot) => {
                    const isChecked = selectedSpots.includes(spot);
                    return (
                      <button
                        key={spot}
                        type="button"
                        onClick={() => handleSpotToggle(spot)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                          isChecked
                            ? 'bg-[#112D4E] text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-[#D4AF37] border-[#D4AF37] text-[#112D4E]' : 'border-slate-300 bg-white'}`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="line-clamp-1">{spot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Realtime Output & Direct WA / Email Action */}
            <div className="lg:col-span-5 bg-[#F5F5F5] rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-[#112D4E] uppercase tracking-wider">
                    Ringkasan Request Anda
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isStep4Done ? 'bg-[#30E3CA] text-[#112D4E]' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isStep4Done ? 'Siap Dikirim' : 'Menunggu Pilihan'}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Paket Trip:</span>
                    <span className="font-bold text-[#112D4E]">{tripType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Peserta:</span>
                    <span className="font-bold text-[#112D4E]">{paxCount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Durasi:</span>
                    <span className="font-bold text-[#112D4E]">{duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Destinasi ({selectedSpots.length}):</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedSpots.length > 0 ? (
                        selectedSpots.map((s, idx) => (
                          <span key={idx} className="bg-white border border-slate-300 text-[#112D4E] px-2 py-0.5 rounded text-[11px] font-semibold">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">Belum ada spot dipilih</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Send Actions */}
              <div className="space-y-2.5 pt-4 border-t border-slate-200">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#b8952b] text-[#112D4E] font-extrabold text-sm py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Kirim via WhatsApp</span>
                </a>

                <a
                  href={mailUrl}
                  className="w-full flex items-center justify-center gap-2 bg-[#112D4E] hover:bg-[#1a3a63] text-white font-bold text-xs py-3 rounded-xl transition-all"
                >
                  <Mail className="w-4 h-4 text-[#30E3CA]" />
                  <span>Kirim Inquiry Email ({businessInfo.email})</span>
                </a>

                <p className="text-[11px] text-slate-500 text-center font-light pt-1">
                  💬 Konsultasi gratis, respons cepat via WhatsApp <strong>{businessInfo.formattedPhone}</strong>
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
