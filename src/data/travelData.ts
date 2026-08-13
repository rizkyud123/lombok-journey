import { TripService, LombokDestination, Review, FAQItem } from '../types';

export const BUSINESS_INFO = {
  name: "Lombok Journey",
  tagline: "Spesialis Private Trip, Full Day Trip, dan Short Trip Lombok",
  phone: "628889163745",
  formattedPhone: "0888-9163-745",
  instagramHandle: "@lombokjourney_",
  instagramUrl: "https://instagram.com/lombokjourney_",
  location: "Mataram, Lombok, Nusa Tenggara Barat",
  waBaseUrl: "https://wa.me/628889163745",
};

export const TRIP_SERVICES: TripService[] = [
  {
    id: "private-trip",
    title: "Private Trip",
    tagline: "Eksklusif & Fleksibel untuk Keluarga atau Grup",
    badge: "Paling Populer",
    priceStart: "Mulai Rp 450.000 / pax",
    description: "Nikmati kebebasan berlibur tanpa digabung dengan peserta lain. Jadwal itinerary fleksibel dapat disesuaikan penuh dengan keinginan Anda dan keluarga.",
    features: [
      "Armada Pribadi (Mobil AC & Driver Lokal Pengalaman)",
      "Bebas Atur Waktu & Destinasi Sesuai Keinginan",
      "Penjemputan Bandara LOP / Hotel Bebas Biaya Tambahan",
      "Termasuk Dokumentasi Foto & Video Trip",
      "Pemandu Lokal Ramah & Informatif"
    ],
    includes: [
      "Mobil AC Standar Pariwisata + BBM",
      "Driver Lokal Profesional merangkap Guide",
      "Tiket Masuk Semua Objek Wisata",
      "Air Mineral Dingin Selama Trip",
      "Parkir & Retribusi Destinasi"
    ],
    popularSpot: ["Gili Trawangan & Meno", "Pink Beach", "Kuta Mandalika & Bukit Merese", "Sembalun & Rinjani View"],
    recommendedFor: "Keluarga, Pasangan (Honeymoon), & Rombongan Sahabat",
    iconName: "UserCheck",
    bgImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "full-day-trip",
    title: "Full Day Trip",
    tagline: "Eksplorasi Seharian Penuh Destinasi Ikonik Lombok",
    badge: "Favorit Wisatawan",
    priceStart: "Mulai Rp 350.000 / pax",
    description: "Paket petualangan 1 hari penuh mengelilingi spot-spot wisata unggulan Lombok. Sangat cocok bagi Anda yang memiliki waktu liburan terbatas.",
    features: [
      "Trip 10-12 Jam Efektif Seharian",
      "Rute Optimal Mengunjungi 4-5 Spot Utama",
      "Termasuk Peralatan Snorkeling / Perahu Private (Pilihan Rute Gili)",
      "Layanan Antar-Jemput Hotel / Bandara",
      "Rekomendasi Kuliner Khas Lombok (Ayam Taliwang / Kuliner Pantai)"
    ],
    includes: [
      "Transportasi AC Bersih & Nyaman + BBM",
      "Driver / Guide Lokal Asli Lombok",
      "Tiket Wisata & Retribusi Lintas Wilayah",
      "Air Mineral Selama Perjalanan",
      "Spot Penjemputan Fleksibel"
    ],
    popularSpot: ["Snorkeling 3 Gili", "Pantai Tanjung Aan & Merese", "Air Terjun Benang Kelambu", "Desa Adat Sukarara & Sade"],
    recommendedFor: "Wisatawan Singkat, Solo Traveler, & Grup Kantoran",
    iconName: "Sun",
    bgImage: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "short-trip",
    title: "Short Trip",
    tagline: "Perjalanan Singkat ke Spot Pilihan Terfavorit",
    badge: "Hemat & Hemat Waktu",
    priceStart: "Mulai Rp 250.000 / pax",
    description: "Paket tur durasi singkat (4-6 jam) yang pas untuk mengisi waktu luang sebelum penerbangan pulang atau transit singkat di Lombok.",
    features: [
      "Durasi Singkat & Efisien (Half Day Trip)",
      "Spot Ikonik Dekat Bandara / Kota Mataram",
      "Penjemputan & Drop-off Tepat Waktu di Bandara LOP",
      "Cocok untuk Sunset Trip atau City & Cultural Tour",
      "Harga Sangat Terjangkau Tanpa Biaya Tersembunyi"
    ],
    includes: [
      "Mobil AC + Driver Asli Lombok",
      "BBM & Biaya Parkir Destinasi",
      "Tiket Masuk Spot Wisata Singkat",
      "Air Mineral Refreshment"
    ],
    popularSpot: ["Sunset Bukit Merese", "Sirkuit Mandalika & Kuta", "Mataram City & Pusat Oleh-Oleh", "Desa Sade & Tenun Sukarara"],
    recommendedFor: "Transit Bandara, Wisatawan Bisnis, & Sunset Hunter",
    iconName: "Zap",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
  }
];

export const DESTINATIONS: LombokDestination[] = [
  {
    id: "gili-trawangan",
    name: "Gili Trawangan, Meno & Air",
    category: "Pantai & Gili",
    location: "Lombok Utara",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
    description: "Tiga pulau eksotis dengan perairan jernih pirus, penyu laut, patung bawah laut Nest Meno, dan kebebasan bebas kendaraan bermotor.",
    highlight: "Island Hopping & Snorkeling Penyu",
    bestTime: "08:00 - 16:00 WITA"
  },
  {
    id: "pantai-kuta-mandalika",
    name: "Pantai Kuta Mandalika & Sirkuit",
    category: "Pantai & Gili",
    location: "Lombok Tengah",
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1000&auto=format&fit=crop",
    description: "Pantai berpasir merica khas Lombok Selatan berlatar perbukitan hijau eksotis dan Sirkuit Internasional Mandalika.",
    highlight: "Pasir Merica Unik & Sirkuit MotoGP",
    bestTime: "Pagi / Sore Hari"
  },
  {
    id: "bukit-merese",
    name: "Bukit Merese & Tanjung Aan",
    category: "Pantai & Gili",
    location: "Lombok Tengah",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    description: "Spot pemandangan bukit hijau yang memanjakan mata memandang samudra luas. Lokasi sunset dan sunrise terbaik di Lombok.",
    highlight: "Pemandangan Sunset Panorama 360°",
    bestTime: "16:30 - 18:30 WITA"
  },
  {
    id: "tiu-kelep",
    name: "Air Terjun Tiu Kelep & Sendang Gile",
    category: "Air Terjun",
    location: "Senaru, Lombok Utara",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1000&auto=format&fit=crop",
    description: "Air terjun megah di kaki Gunung Rinjani yang dikelilingi hutan hujan tropis yang rimbun dan udara segar menyejukkan.",
    highlight: "Trekking Ringan & Tirta Amerta Segar",
    bestTime: "09:00 - 14:00 WITA"
  },
  {
    id: "desa-sade",
    name: "Desa Adat Sade & Sukarara",
    category: "Budaya & Desa",
    location: "Lombok Tengah",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1000&auto=format&fit=crop",
    description: "Melihat dari dekat kearifan lokal suku Sasak, arsitektur rumah bambu tradisional, serta kerajinan tenun ikat Sasak yang anggun.",
    highlight: "Wisata Budaya Sasak & Belajar Tenun",
    bestTime: "Setiap Saat"
  },
  {
    id: "sembalun-rinjani",
    name: "Lembah Sembalun & Rinjani View",
    category: "Gunung & Alam",
    location: "Lombok Timur",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop",
    description: "Hamparan petak sawah warna-warni di kaki megahnya Gunung Rinjani dengan latar pemandangan bukit Pergasingan.",
    highlight: "Pemandangan Kaki Gunung & Kebun Stroberi",
    bestTime: "06:00 - 12:00 WITA"
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Aulia & Farhan",
    origin: "Jakarta Selatan",
    tripType: "Private Honeymoon Trip",
    comment: "Layanan Lombok Journey beneran bintang 5! Driver-nya Mas Rudi ramah banget, ngerti spot foto yang sepi dan aesthetic di Bukit Merese & Gili. Mobil bersih dan wangi. Pokoknya Recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    date: "Agustus 2026"
  },
  {
    id: "rev-2",
    name: "Budi Pratama & Keluarga",
    origin: "Surabaya",
    tripType: "Full Day Private Trip",
    comment: "Liburan keluarga bawa anak-anak dan orang tua jadi tenang dan nyaman. Driver sabar banget nungguin anak-anak main air di Tanjung Aan. Harganya transparan nggak ada biaya siluman.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    date: "Juli 2026"
  },
  {
    id: "rev-3",
    name: "Siska & Friend Group",
    origin: "Bandung",
    tripType: "3 Gili Snorkeling Trip",
    comment: "Spot snorkeling penyu sama patung bawah laut Meno dikawal guide pantes bangatt! Dapat bonus foto underwater yang keren-keren dari tim Lombok Journey. Wajib coba guys!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    date: "Juni 2026"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Bagaimana cara melakukan pemesanan trip di Lombok Journey?",
    answer: "Pemesanan sangat mudah! Anda bisa langsung klik tombol 'Pesan Trip Sekarang' atau 'Konsultasi WhatsApp' pada website ini. Anda akan terhubung langsung dengan admin kami via WhatsApp (0888-9163-745) untuk menentukan tanggal, pilihan destinasi, dan jumlah peserta."
  },
  {
    question: "Apakah jadwal itinerary dapat diubah sesuai keinginan (custom)?",
    answer: "Tentu saja! Untuk paket Private Trip, seluruh rute, lokasi penjemputan, tempat makan, dan jam keberangkatan bisa disesuaikan 100% dengan kebutuhan dan fleksibilitas Anda."
  },
  {
    question: "Dimana lokasi penjemputan dan pengantaran dilakukan?",
    answer: "Penjemputan dan pengantaran bebas sesuai permintaan Anda, baik di Bandara Internasional Lombok (LOP), Pelabuhan Bangsal/Lembar, maupun hotel tempat Anda menginap di area Mataram, Senggigi, atau Kuta Lombok."
  },
  {
    question: "Fasilitas apa saja yang sudah termasuk dalam paket?",
    answer: "Semua paket trip sudah mencakup mobil ber-AC bersih + BBM, pemandu/driver lokal ramah berpengalaman, tiket masuk tempat wisata, air mineral dingin, serta parkir & retribusi."
  },
  {
    question: "Bagaimana jika penerbangan saya terlambat (delayed)?",
    answer: "Tim driver kami selalu memantau status penerbangan Anda. Driver kami akan tetap menunggu kedatangan Anda di kedatangan bandara tanpa biaya tambahan berlebihan."
  }
];
