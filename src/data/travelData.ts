import { TripService, LombokDestination, Review, FAQItem, GalleryActivity, BusinessInfo, EstimatorConfig, BookingInquiry } from '../types';

export const BUSINESS_INFO: BusinessInfo = {
  name: "Lombok Journey",
  tagline: "Spesialis Private Trip, Full Day Trip, dan Short Trip Lombok",
  phone: "628889163745",
  formattedPhone: "0888-9163-745",
  email: "hairulummah2201@gmail.com",
  instagramHandle: "@lombokjourney_",
  instagramUrl: "https://instagram.com/lombokjourney_",
  location: "Mataram, Lombok, Nusa Tenggara Barat",
  waBaseUrl: "https://wa.me/628889163745",
};

export const DEFAULT_ESTIMATOR_CONFIG: EstimatorConfig = {
  tripTypes: [
    'Paket Experience Trip',
    'Paket Escape Trip',
    'Paket Adventure Trip',
    'Gili Escape Trip'
  ],
  durations: [
    'Full Day (1 Hari)',
    '2 Hari 1 Malam (2D1N)',
    '3 Hari 2 Malam (3D2N)',
    '4 Hari 3 Malam (4D3N)',
    'Custom / Request Khusus'
  ],
  paxOptions: [
    '1-2 Orang (Duo / Pasangan)',
    '3-5 Orang (Keluarga Kecil / Teman)',
    '6-10 Orang (Grup Sedang)',
    '10+ Orang (Rombongan / Corporate)'
  ],
  availableSpots: [
    'Desa Sade (foto baju adat)',
    'Pantai Kuta Mandalika',
    'Pantai Tanjung Aan',
    'Pantai Mawun',
    'Pantai Selong Belanak',
    'Pantai Mawi',
    'Bukit Selong Sembalun',
    'Desa Adat Beleq',
    'Kebun Strawberry Sembalun',
    'Bukit Pergasingan',
    'Gili Trawangan',
    'Gili Meno & Gili Air',
    'Underwater Statue & Turtle Point 🐢',
    'Sunset Point'
  ]
};


export const TRIP_SERVICES: TripService[] = [
  {
    id: "experience-trip",
    title: "Paket Experience Trip",
    tagline: "Eksplorasi Budaya Sasak & Pantai Kuta Mandalika",
    badge: "Terfavorit",
    priceStart: "Mulai Rp 450.000 / pax",
    description: "Nikmati pengalaman autentik menjelajahi kebudayaan khas Sasak dan pesona pantai-pantai ikonik di selatan Lombok.",
    features: [
      "Pick up hotel",
      "Desa Sade (foto baju adat)",
      "Pantai Kuta Mandalika",
      "Pantai Tanjung Aan",
      "Sunset point",
      "Makan malam / acara bebas"
    ],
    includes: [
      "Mobil AC Standar Pariwisata + BBM",
      "Driver / Guide Lokal Pengalaman",
      "Sewa Baju Adat Khas Sasak di Desa Sade",
      "Tiket Masuk Objek Wisata & Parkir",
      "Air Mineral Refreshment"
    ],
    popularSpot: ["Desa Sade", "Pantai Kuta Mandalika", "Pantai Tanjung Aan", "Sunset Point"],
    recommendedFor: "Wisatawan Budaya, Keluarga, Pasangan & Foto Adat",
    iconName: "UserCheck",
    bgImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "escape-trip",
    title: "Paket Escape Trip",
    tagline: "Eksplorasi Pantai Eksotis Mawun, Selong Belanak & Mawi",
    badge: "Best Beach",
    priceStart: "Mulai Rp 450.000 / pax",
    description: "Pelarian sempurna menyusuri tiga pantai eksotis berpasir putih nan indah dengan pemandangan sunset memukau.",
    features: [
      "Pick up hotel",
      "Pantai Mawun",
      "Pantai Selong Belanak",
      "Pantai Mawi",
      "Sunset point",
      "Makan malam"
    ],
    includes: [
      "Mobil AC Bersih + BBM",
      "Driver / Guide Asli Lombok",
      "Tiket Masuk Semua Wisata Pantai & Parkir",
      "Air Mineral Selama Trip"
    ],
    popularSpot: ["Pantai Mawun", "Pantai Selong Belanak", "Pantai Mawi", "Sunset Point"],
    recommendedFor: "Pecinta Pantai, Surfer & Wisata Relaxing",
    iconName: "Sun",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "adventure-trip",
    title: "Paket Adventure Trip",
    tagline: "Petualangan Alam Lembah Sembalun & Rinjani View",
    badge: "Petualangan Alam",
    priceStart: "Mulai Rp 450.000 / pax",
    description: "Nikmati keindahan pemandangan pegunungan Sembalun, kebun strawberry, desa adat kuno, serta udara segar Kaki Rinjani.",
    features: [
      "Pick up bandara / hotel",
      "Bukit Selong",
      "Desa Adat Beleq",
      "Kebun Strawberry Sembalun",
      "Bukit Pergasingan (opsional/tambahan)",
      "Check-in penginapan",
      "Menikmati sunset & suasana Sembalun",
      "Makan malam"
    ],
    includes: [
      "Mobil AC Pariwisata + BBM",
      "Driver / Guide Pengalaman",
      "Tiket Masuk Tempat Wisata & Parkir",
      "Pengalaman Petik Strawberry",
      "Air Mineral"
    ],
    popularSpot: ["Bukit Selong", "Desa Adat Beleq", "Kebun Strawberry Sembalun", "Bukit Pergasingan", "Sunset Sembalun"],
    recommendedFor: "Pecinta Alam, Fotografer, Keluarga & Adventure",
    iconName: "Zap",
    bgImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "gili-escape-trip",
    title: "Gili Escape Trip",
    tagline: "Snorkeling 3 Gili, Underwater Statue & Turtle Point 🐢",
    badge: "Paling Populer",
    priceStart: "Mulai Rp 450.000 / pax",
    description: "Petualangan bahari terlengkap mengelilingi Gili Trawangan, Meno, dan Air dengan spot patung bawah laut & penyu liar.",
    features: [
      "Penjemputan di Bandara Lombok / hotel",
      "Menuju Pelabuhan Bangsal",
      "Naik boat menuju Gili Trawangan",
      "Explore Gili Trawangan",
      "Snorkeling trip: Gili Trawangan, Gili Meno, Gili Air",
      "Underwater statue",
      "Turtle point 🐢",
      "Menikmati sunset"
    ],
    includes: [
      "Mobil Penjemputan AC + BBM",
      "Boat Private / Snorkeling Charter",
      "Peralatan Snorkeling Lengkap & Life Jacket",
      "Guide Snorkeling & Dokumentasi Underwater Foto/Video",
      "Tiket Pelabuhan & Retribusi"
    ],
    popularSpot: ["Gili Trawangan", "Gili Meno", "Gili Air", "Underwater Statue", "Turtle Point 🐢"],
    recommendedFor: "Snorkeling Lover, Honeymoon, & Rombongan Sahabat",
    iconName: "Compass",
    bgImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop"
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

export const ACTIVITY_GALLERY: GalleryActivity[] = [
  {
    id: "act-vid-1",
    title: "Keseruan Snorkeling Bareng Penyu di Gili Meno & Trawangan",
    category: "Snorkeling & Bahari",
    location: "Gili Meno & Trawangan, Lombok",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    description: "Cuplikan video dokumentasi underwater tamu Lombok Journey saat snorkeling di perairan jernih bersama penyu hijau liar dan terumbu karang.",
    activityDate: "Agustus 2026",
    packageTag: "Gili Escape Trip",
    mediaType: "video",
    videoUrl: "https://www.youtube.com/watch?v=7ZfA1N8u_z0",
    videoSource: "youtube",
    videoDuration: "0:45"
  },
  {
    id: "act-1",
    title: "Snorkeling Patung Bawah Laut Nest Meno",
    category: "Snorkeling & Bahari",
    location: "Gili Meno, Lombok",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    description: "Momen seru peserta trip snorkeling mengelilingi patung bawah laut ikonik karya Jason deCaires Taylor di perairan jernih Gili Meno.",
    activityDate: "Agustus 2026",
    packageTag: "Gili Escape Trip",
    mediaType: "image"
  },
  {
    id: "act-vid-2",
    title: "Cinematic Sunset & Angin Sepoi di Bukit Merese",
    category: "Pantai & Sunset",
    location: "Bukit Merese & Tanjung Aan, Lombok",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    description: "Reels dokumentasi pemandangan golden hour di atas tebing hijau Bukit Merese dengan latar deburan ombak Mandalika.",
    activityDate: "Agustus 2026",
    packageTag: "Paket Experience Trip",
    mediaType: "video",
    videoUrl: "https://www.youtube.com/shorts/qI4GkP7p3Q0",
    videoSource: "youtube",
    videoDuration: "0:30"
  },
  {
    id: "act-2",
    title: "Foto Berpakaian Adat Sasak di Desa Sade",
    category: "Budaya & Adat",
    location: "Desa Adat Sade, Lombok Tengah",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1000&auto=format&fit=crop",
    description: "Peserta memakai pakaian adat tradisional Sasak lengkap dengan aksesoris tenun berlatar rumah adat Bale Tani asli Desa Sade.",
    activityDate: "Agustus 2026",
    packageTag: "Paket Experience Trip",
    mediaType: "image"
  },
  {
    id: "act-3",
    title: "Berenang & Bertemu Penyu Liar (Turtle Point)",
    category: "Snorkeling & Bahari",
    location: "Gili Trawangan & Meno",
    image: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?q=80&w=1000&auto=format&fit=crop",
    description: "Dokumentasi underwater eksklusif berenang berdampingan dengan penyu hijau liar di terumbu karang alami Turtle Point.",
    activityDate: "Juli 2026",
    packageTag: "Gili Escape Trip",
    mediaType: "image"
  },
  {
    id: "act-4",
    title: "Sunset Golden Hour di Bukit Merese & Tanjung Aan",
    category: "Pantai & Sunset",
    location: "Bukit Merese, Lombok Selatan",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    description: "Pemandangan magis matahari terbenam memancarkan rona keemasan dari puncak tebing Bukit Merese menghadap Samudra Hindia.",
    activityDate: "Agustus 2026",
    packageTag: "Paket Experience Trip",
    mediaType: "image"
  },
  {
    id: "act-5",
    title: "Panorama Petak Sawah & Lembah Bukit Selong",
    category: "Pegunungan & Alam",
    location: "Sembalun, Lombok Timur",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop",
    description: "Pemandangan spektakuler hamparan sawah geometris warna-warni berlatar perbukitan Sembalun dan Gunung Rinjani yang megah.",
    activityDate: "Juli 2026",
    packageTag: "Paket Adventure Trip",
    mediaType: "image"
  },
  {
    id: "act-6",
    title: "Eksplorasi Pasir Putih & Ombak Pantai Mawun",
    category: "Pantai & Sunset",
    location: "Pantai Mawun, Lombok Selatan",
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1000&auto=format&fit=crop",
    description: "Suasana pantai teluk eksotis dengan air laut toska tenang yang diapit dua bukit tebing kokoh di Lombok Selatan.",
    activityDate: "Agustus 2026",
    packageTag: "Paket Escape Trip",
    mediaType: "image"
  },
  {
    id: "act-7",
    title: "Aktivitas Petik Buah Strawberry Segar di Sembalun",
    category: "Pegunungan & Alam",
    location: "Kebun Strawberry Sembalun",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1000&auto=format&fit=crop",
    description: "Sensasi memetik buah strawberry merah segar langsung dari kebun di dataran tinggi kaki Gunung Rinjani dengan udara sejuk.",
    activityDate: "Juli 2026",
    packageTag: "Paket Adventure Trip",
    mediaType: "image"
  },
  {
    id: "act-8",
    title: "Relaksasi & Surfing di Pantai Selong Belanak & Mawi",
    category: "Pantai & Sunset",
    location: "Selong Belanak & Mawi",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1000&auto=format&fit=crop",
    description: "Hamparan garis pantai pasir putih lembut yang landai dengan ombak sempurna untuk berselancar dan menikmati kelapa muda segar.",
    activityDate: "Juni 2026",
    packageTag: "Paket Escape Trip",
    mediaType: "image"
  }
];

export const INITIAL_BOOKINGS: BookingInquiry[] = [
  {
    id: "LJ-2026-8812",
    guestName: "Bpk. Rahmat Pratama",
    guestPhone: "0812-3456-7890",
    guestEmail: "rahmat.pratama@gmail.com",
    tripType: "Paket Experience Trip",
    duration: "Full Day (1 Hari)",
    pax: "3-5 Orang (Keluarga Kecil / Teman)",
    spots: ["Desa Sade (foto baju adat)", "Pantai Kuta Mandalika", "Pantai Tanjung Aan", "Sunset Point"],
    travelDate: "20 Agustus 2026",
    totalEstimate: "Rp 1.350.000 (3 Pax)",
    status: "Terkonfirmasi & Siap",
    notes: "Request antar jemput di Hotel Aruna Senggigi pk 08.30 WITA",
    guideName: "Kak Hairul (Guide Sasak Asli)",
    driverPhone: "0888-9163-745",
    pickupLocation: "Hotel Aruna Senggigi Resort",
    createdAt: "2026-08-14T10:00:00.000Z",
    updatedAt: "2026-08-15T09:30:00.000Z"
  },
  {
    id: "LJ-2026-9041",
    guestName: "Ibu Amanda & Partner",
    guestPhone: "0819-8765-4321",
    guestEmail: "amanda.travel@outlook.com",
    tripType: "Gili Escape Trip",
    duration: "Full Day (1 Hari)",
    pax: "1-2 Orang (Duo / Pasangan)",
    spots: ["Gili Trawangan", "Gili Meno & Gili Air", "Underwater Statue & Turtle Point 🐢"],
    travelDate: "22 Agustus 2026",
    totalEstimate: "Rp 950.000 (Private Snorkeling)",
    status: "Trip Sedang Berjalan",
    notes: "Peralatan snorkeling ukuran M & L disediakan pihak Lombok Journey",
    guideName: "Mas Dedi (Snorkeling Master)",
    driverPhone: "0888-9163-745",
    pickupLocation: "Pelabuhan Teluk Nare",
    createdAt: "2026-08-15T08:00:00.000Z",
    updatedAt: "2026-08-15T10:00:00.000Z"
  },
  {
    id: "LJ-2026-7730",
    guestName: "Sdr. Kevin Wijaya",
    guestPhone: "0857-1122-3344",
    tripType: "Paket Adventure Trip",
    duration: "2 Hari 1 Malam (2D1N)",
    pax: "6-10 Orang (Grup Sedang)",
    spots: ["Bukit Selong Sembalun", "Kebun Strawberry Sembalun", "Desa Adat Beleq"],
    travelDate: "28 Agustus 2026",
    totalEstimate: "Rp 3.800.000 (Grup 8 Pax)",
    status: "Menunggu Konfirmasi",
    notes: "Sedang proses pengecekan jadwal armada & homestay Sembalun",
    guideName: "Tim Lombok Journey",
    driverPhone: "0888-9163-745",
    pickupLocation: "Bandara Internasional Lombok (BIL)",
    createdAt: "2026-08-15T18:20:00.000Z",
    updatedAt: "2026-08-15T18:20:00.000Z"
  }
];


