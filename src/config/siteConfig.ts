import { createEditorialPlate } from '../utils/editorialVisuals';

export interface ServiceItem {
  id: string;
  index: string;
  name: string;
  shortDesc: string;
  details: string;
  duration: string;
  price: string;
  category: string;
  techniqueSpec: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  code: string;
  title: string;
  category: 'Fade' | 'Classic' | 'Textured' | 'Modern' | 'Styling';
  contourSpec: string;
  finishSpec: string;
  recommendedFace: string;
  aspect: 'tall' | 'square' | 'wide';
  image: string;
}

export interface BarberOption {
  id: string;
  name: string;
  specialty: string;
}

export interface PhilosophyValue {
  index: string;
  title: string;
  description: string;
  metricLabel: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  creativeConcept: string;
  city: string;
  whatsappInternational: string;
  address: string;
  operatingHours: string;
  googleMapsUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  facilitiesNote: string;
  philosophyHeadline: string;
  philosophyBody: string;
  philosophyMainImage: string;
  philosophyDetailImage: string;
  philosophyValues: PhilosophyValue[];
  services: ServiceItem[];
  gallery: GalleryItem[];
  barbers: BarberOption[];
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'Flash Barber Shop',
  tagline: 'Bukan Sekadar Potong Rambut. Ini Tentang Karakter.',
  creativeConcept: 'THE FUTURE OF GROOMING — A CINEMATIC 3D BARBERSHOP EXPERIENCE.',
  city: 'Kota Malang, Jawa Timur, Indonesia',
  whatsappInternational: '[WHATSAPP_BARBERSHOP_FORMAT_INTERNASIONAL_TANPA_TANDA_PLUS]',
  address: '[ALAMAT_LENGKAP]',
  operatingHours: '[JAM_OPERASIONAL]',
  googleMapsUrl: '[LINK_GOOGLE_MAPS]',
  instagramUrl: 'https://www.instagram.com/',
  instagramHandle: '@flashbarbershop',
  facilitiesNote:
    'Area ruang tunggu ber-AC, konsultasi proporsi wajah sebelum sesi cukur, dan sterilisasi instrumen standar studio pada setiap pergantian pelanggan.',
  philosophyHeadline: 'DETAIL MAKES THE DIFFERENCE.',
  philosophyBody:
    'Kami percaya potongan rambut yang tepat bukan sekadar soal penampilan. Ini tentang karakter, kepercayaan diri, dan bagaimana seseorang membawa dirinya setiap hari.',
  philosophyMainImage: createEditorialPlate(
    'philosophy-main',
    'CRAFT STUDY 01',
    'PRECISION INSTRUMENTS',
    'Kalibrasi sudut potong & ergonomi anatomi kepala pria'
  ),
  philosophyDetailImage: createEditorialPlate(
    'philosophy-detail',
    'CRAFT STUDY 02',
    'ZERO-GAP ARCHITECTURE',
    'Kebersihan alat & ketajaman bilah baja presisi'
  ),
  philosophyValues: [
    {
      index: '01',
      title: 'Precision',
      description: 'Setiap detail diperhatikan untuk mendapatkan hasil terbaik.',
      metricLabel: 'Sub-Millimeter Graduation & Clean Perimeter',
    },
    {
      index: '02',
      title: 'Personal Style',
      description:
        'Gaya rambut disesuaikan dengan karakter, kebutuhan, dan preferensi pelanggan.',
      metricLabel: 'Cranial Structure & Face Geometry Analysis',
    },
    {
      index: '03',
      title: 'Professional Experience',
      description:
        'Pelayanan ramah, suasana nyaman, dan perhatian terhadap kebersihan alat serta area kerja.',
      metricLabel: 'Sanitized Blades & Calm Studio Atmosphere',
    },
  ],
  services: [
    {
      id: 'classic-haircut',
      index: '01',
      name: 'Classic Haircut',
      shortDesc: 'Potongan rambut klasik dengan hasil bersih dan rapi.',
      details:
        'Konsultasi proporsi wajah, pemotongan presisi dengan struktur klasik yang tak lekang waktu, perapian garis leher, serta penataan akhir.',
      duration: '45 Menit',
      price: 'RpXX.XXX',
      category: 'Essential Cut',
      techniqueSpec: 'Clipper Over Comb · Tapered Nape · Natural Side Contour',
      image: createEditorialPlate(
        'service-classic',
        'SERVICE 01',
        'CLASSIC HAIRCUT',
        'Proporsi bersih, rapi, dan berkarakter'
      ),
    },
    {
      id: 'modern-fade',
      index: '02',
      name: 'Modern Fade',
      shortDesc: 'Fade modern dengan transisi gradasi yang presisi.',
      details:
        'Teknik gradasi bertahap (Low, Mid, atau High Drop Fade) menggunakan clipper terkalibrasi untuk transisi halus menyatu dengan struktur tulang kepala.',
      duration: '45–60 Menit',
      price: 'RpXX.XXX',
      category: 'Precision Gradient',
      techniqueSpec: 'Zero-Gap Blend · Seamless Occipital Drop · Crisp Lineup',
      image: createEditorialPlate(
        'service-fade',
        'SERVICE 02',
        'MODERN FADE',
        'Gradasi halus dengan akurasi milimeter'
      ),
    },
    {
      id: 'scissor-cut',
      index: '03',
      name: 'Scissor Cut',
      shortDesc: 'Potongan menggunakan gunting untuk hasil yang terstruktur.',
      details:
        'Pengerjaan penuh menggunakan gunting presisi untuk menjaga tekstur alami, arah jatuh rambut, dan volume yang mudah diatur setiap hari.',
      duration: '60 Menit',
      price: 'RpXX.XXX',
      category: 'Shear Craft',
      techniqueSpec: 'Full Japanese Shear Work · Point Cutting · Natural Flow',
      image: createEditorialPlate(
        'service-scissor',
        'SERVICE 03',
        'SCISSOR CUT',
        'Struktur penuh gunting untuk dimensi alami'
      ),
    },
    {
      id: 'haircut-styling',
      index: '04',
      name: 'Haircut & Styling',
      shortDesc: 'Paket potong rambut dan penataan sesuai gaya pilihan.',
      details:
        'Kombinasi potong rambut presisi, pencucian menyegarkan, serta teknik blow-dry dan aplikasi produk styling sesuai jenis rambut Anda.',
      duration: '60 Menit',
      price: 'RpXX.XXX',
      category: 'Signature Session',
      techniqueSpec: 'Precision Cut · Hair Wash · Thermal Direction & Finish',
      image: createEditorialPlate(
        'service-styling',
        'SERVICE 04',
        'HAIRCUT & STYLING',
        'Potongan presisi & penataan siap tampil'
      ),
    },
    {
      id: 'beard-grooming',
      index: '05',
      name: 'Beard Grooming',
      shortDesc: 'Perawatan dan perapian jenggot sesuai bentuk wajah.',
      details:
        'Pembentukan kontur rahang, penipisan gradasi cambang dan jenggot, serta perapian garis pipi dan leher agar terlihat tegas dan bersih.',
      duration: '30 Menit',
      price: 'RpXX.XXX',
      category: 'Facial Architecture',
      techniqueSpec: 'Jawline Sculpting · Sideburn Fade · Razor Edge Detailing',
      image: createEditorialPlate(
        'service-beard',
        'SERVICE 05',
        'BEARD GROOMING',
        'Definisi garis rahang & perapian jenggot'
      ),
    },
    {
      id: 'complete-grooming',
      index: '06',
      name: 'Complete Grooming',
      shortDesc: 'Paket grooming lengkap sesuai layanan yang disediakan barbershop.',
      details:
        'Sesi menyeluruh mencakup konsultasi gaya, potong rambut pilihan, perapian jenggot/kumis, pencucian rambut, dan penataan akhir.',
      duration: '75–90 Menit',
      price: 'RpXX.XXX',
      category: 'Full Ritual',
      techniqueSpec: 'Consultation · Full Haircut · Beard Sculpting · Wash & Style',
      image: createEditorialPlate(
        'service-complete',
        'SERVICE 06',
        'COMPLETE GROOMING',
        'Pengalaman perawatan pria menyeluruh'
      ),
    },
  ],
  gallery: [
    {
      id: 'work-01',
      code: 'LOOK 01',
      title: 'Low Drop Skin Fade',
      category: 'Fade',
      contourSpec: '0.0mm Base · Drop Occipital Curve',
      finishSpec: 'Natural Matte Finish',
      recommendedFace: 'Oval · Square · Diamond',
      aspect: 'tall',
      image: createEditorialPlate(
        'gallery-low-drop-fade',
        'ARCHIVE 01 · FADE',
        'LOW DROP SKIN FADE',
        'Transisi gradasi melengkung mengikuti kontur belakang kepala'
      ),
    },
    {
      id: 'work-02',
      code: 'LOOK 02',
      title: 'Executive Side Contour',
      category: 'Classic',
      contourSpec: 'Tapered Nape · Structured Part',
      finishSpec: 'Medium Shine Water-Based Pomade',
      recommendedFace: 'All Face Profiles',
      aspect: 'square',
      image: createEditorialPlate(
        'gallery-executive-contour',
        'ARCHIVE 02 · CLASSIC',
        'EXECUTIVE SIDE CONTOUR',
        'Siluet rapi profesional untuk rutinitas kerja & acara formal'
      ),
    },
    {
      id: 'work-03',
      code: 'LOOK 03',
      title: 'Textured French Crop',
      category: 'Textured',
      contourSpec: 'Point-Cut Crown · Blunt Fringe',
      finishSpec: 'Dry Texture Clay',
      recommendedFace: 'Oblong · Oval · Heart',
      aspect: 'square',
      image: createEditorialPlate(
        'gallery-textured-crop',
        'ARCHIVE 03 · TEXTURED',
        'TEXTURED FRENCH CROP',
        'Potongan bertekstur tegas dengan perawatan harian praktis'
      ),
    },
    {
      id: 'work-04',
      code: 'LOOK 04',
      title: 'Modern Architectural Quiff',
      category: 'Modern',
      contourSpec: 'Mid Taper · Elevated Forelock',
      finishSpec: 'Volume Pre-Styler & Matte Paste',
      recommendedFace: 'Round · Square · Oval',
      aspect: 'tall',
      image: createEditorialPlate(
        'gallery-modern-quiff',
        'ARCHIVE 04 · MODERN',
        'ARCHITECTURAL QUIFF',
        'Volume depan proporsional dengan sisi samping bersih'
      ),
    },
    {
      id: 'work-05',
      code: 'LOOK 05',
      title: 'Scissor Flow & Natural Layer',
      category: 'Styling',
      contourSpec: 'Full Scissor Work · Soft Perimeter',
      finishSpec: 'Lightweight Grooming Cream',
      recommendedFace: 'Diamond · Square · Heart',
      aspect: 'wide',
      image: createEditorialPlate(
        'gallery-scissor-flow',
        'ARCHIVE 05 · STYLING',
        'SCISSOR FLOW LAYER',
        'Gerakan rambut natural dengan teknik gunting presisi'
      ),
    },
    {
      id: 'work-06',
      code: 'LOOK 06',
      title: 'Mid Shadow Fade & Crop',
      category: 'Fade',
      contourSpec: '0.5mm Shadow Blend · Textured Top',
      finishSpec: 'Matte Texture Powder',
      recommendedFace: 'Oval · Round · Triangle',
      aspect: 'square',
      image: createEditorialPlate(
        'gallery-mid-skin-fade',
        'ARCHIVE 06 · FADE',
        'MID SHADOW FADE',
        'Gradasi bayangan presisi tanpa garis patahan'
      ),
    },
    {
      id: 'work-07',
      code: 'LOOK 07',
      title: 'Classic Taper Slick Back',
      category: 'Classic',
      contourSpec: 'Low Temple Taper · Scissor Crown',
      finishSpec: 'Classic Firm Hold Pomade',
      recommendedFace: 'Square · Oval · Oblong',
      aspect: 'wide',
      image: createEditorialPlate(
        'gallery-taper-slick',
        'ARCHIVE 07 · CLASSIC',
        'TAPER SLICK BACK',
        'Alur rambut ke belakang yang bersih, maskulin, dan berwibawa'
      ),
    },
    {
      id: 'work-08',
      code: 'LOOK 08',
      title: 'Structured Modern Pompadour',
      category: 'Modern',
      contourSpec: 'High Graduated Blend · Sculpted Crest',
      finishSpec: 'Blow-Dry Architecture & Matte Fiber',
      recommendedFace: 'Round · Oval · Square',
      aspect: 'square',
      image: createEditorialPlate(
        'gallery-architectural-pomp',
        'ARCHIVE 08 · MODERN',
        'MODERN POMPADOUR',
        'Kombinasi volume klasik dan ketajaman gradasi modern'
      ),
    },
  ],
  barbers: [
    {
      id: 'any-barber',
      name: 'Barber Tersedia (Rekomendasi Studio)',
      specialty: 'All-Round Precision & Styling',
    },
    {
      id: 'senior-barber-1',
      name: 'First Available Senior Barber',
      specialty: 'Modern Fade & Hair Architecture',
    },
    {
      id: 'stylist-barber-2',
      name: 'Classic & Scissor Specialist',
      specialty: 'Scissor Cut & Executive Grooming',
    },
  ],
};
