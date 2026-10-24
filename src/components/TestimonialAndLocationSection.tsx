import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, MapPin, Clock, MessageSquare, Navigation } from 'lucide-react';

interface TestimonialAndLocationProps {
  brandName: string;
  address: string;
  operatingHours: string;
  whatsappInternational: string;
  googleMapsUrl: string;
  facilitiesNote: string;
}

const EDITORIAL_REVIEW_SLOTS = [
  {
    slotCode: 'ULASAN PELANGGAN 01',
    context: 'Slot Dokumentasi Ulasan Terverifikasi · Haircut & Fade',
    placeholderQuote:
      '[Kutipan ulasan asli pelanggan akan ditampilkan di sini setelah terhubung dengan Google Business Profile resmi barbershop.]',
    reviewerPlaceholder: '[Nama Pelanggan Asli · Mahasiswa / Profesional Malang]',
  },
  {
    slotCode: 'ULASAN PELANGGAN 02',
    context: 'Slot Dokumentasi Ulasan Terverifikasi · Scissor Cut & Styling',
    placeholderQuote:
      '[Kutipan ulasan asli pelanggan mengenai ketelitian konsultasi gaya dan kenyamanan studio akan ditampilkan pada kolom ini.]',
    reviewerPlaceholder: '[Nama Pelanggan Asli · Pelanggan Reguler]',
  },
  {
    slotCode: 'ULASAN PELANGGAN 03',
    context: 'Slot Dokumentasi Ulasan Terverifikasi · Complete Grooming',
    placeholderQuote:
      '[Kutipan ulasan asli pelanggan mengenai kebersihan instrumen dan hasil akhir potongan rambut akan ditampilkan di sini.]',
    reviewerPlaceholder: '[Nama Pelanggan Asli · Kota Malang]',
  },
];

export const TestimonialAndLocationSection: React.FC<TestimonialAndLocationProps> = ({
  brandName,
  address,
  operatingHours,
  whatsappInternational,
  googleMapsUrl,
  facilitiesNote,
}) => {
  // Ensure external links resolve cleanly to valid URLs even when placeholder is active
  const resolvedMapsHref =
    googleMapsUrl.startsWith('http://') || googleMapsUrl.startsWith('https://')
      ? googleMapsUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${brandName} Kota Malang Jawa Timur`
        )}`;

  const resolvedWhatsAppHref = `https://wa.me/${whatsappInternational.trim()}`;

  return (
    <>
      {/* ==================================================
          SECTION 10: TESTIMONIAL DAN TRUST
          ================================================== */}
      <section
        id="testimonials"
        className="relative py-24 lg:py-32 bg-[#0B1F3A] text-white border-b border-white/15"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-14 border-b border-white/15">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-mono-tabular uppercase tracking-widest text-white/65">
                <span>Client Trust &amp; Verified Feedback</span>
                <span aria-hidden="true">·</span>
                <span>Zero Fabricated Claims</span>
              </div>
              <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-white">
                THE EXPERIENCE SPEAKS.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={resolvedMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-[#05070B] text-xs font-bold tracking-widest uppercase hover:bg-white/90 transition-colors whitespace-nowrap shrink-0"
              >
                <span>See Our Reviews</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Credibility & Honesty Banner */}
          <div className="py-5 border-b border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-tabular text-white/70">
            <span>
              STANDAR TRANSPARANSI {brandName}: KAMI TIDAK MENAMPILKAN ULASAN ATAU ANGKA
              RATING FIKTIF.
            </span>
            <span>TAUTAN PROFIL BISNIS: {googleMapsUrl}</span>
          </div>

          {/* 3 Editorial Placeholder Slots Ready for Verified Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-10">
            {EDITORIAL_REVIEW_SLOTS.map((slot, idx) => (
              <motion.article
                key={slot.slotCode}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="p-7 bg-[#05070B] border border-white/20 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="text-xs font-mono-tabular uppercase tracking-widest text-white/55">
                    {slot.slotCode}
                  </div>
                  <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                    {slot.placeholderQuote}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-1">
                  <div className="text-xs font-semibold text-white">
                    {slot.reviewerPlaceholder}
                  </div>
                  <div className="text-[11px] font-mono-tabular text-white/50">
                    {slot.context}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 11: LOCATION — FIND YOUR BARBER
          ================================================== */}
      <section
        id="contact"
        className="relative py-24 lg:py-32 bg-[#05070B] text-white border-b border-white/15"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="space-y-3 pb-14 border-b border-white/15">
            <div className="flex items-center gap-3 text-xs font-mono-tabular uppercase tracking-widest text-white/60">
              <span>Studio Location &amp; Access</span>
              <span aria-hidden="true">·</span>
              <span>Kota Malang, Jawa Timur</span>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-white">
              YOUR SPOT IN MALANG.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-12 items-stretch">
            {/* Left 6 Columns: Structured Address, Hours, WhatsApp & Directions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8 bg-[#0B1F3A]/35 border border-white/20 p-6 sm:p-10">
              <div className="space-y-7">
                {/* Alamat Lengkap */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#05070B] border border-white/20 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono-tabular uppercase tracking-widest text-white/60">
                      Alamat Lengkap Barbershop
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-white break-words">
                      {address}
                    </div>
                    <div className="text-xs text-white/60">
                      Kota Malang, Jawa Timur, Indonesia
                    </div>
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="flex items-start gap-4 pt-6 border-t border-white/15">
                  <div className="p-2.5 bg-[#05070B] border border-white/20 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono-tabular uppercase tracking-widest text-white/60">
                      Jam Operasional
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-white font-mono-tabular">
                      {operatingHours}
                    </div>
                    <div className="text-xs text-white/60">
                      Disarankan melakukan booking terlebih dahulu untuk kepastian slot waktu.
                    </div>
                  </div>
                </div>

                {/* Nomor WhatsApp */}
                <div className="flex items-start gap-4 pt-6 border-t border-white/15">
                  <div className="p-2.5 bg-[#05070B] border border-white/20 shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono-tabular uppercase tracking-widest text-white/60">
                      Nomor WhatsApp Resmi
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-white font-mono-tabular break-all">
                      {whatsappInternational}
                    </div>
                    <div className="text-xs text-white/60">
                      Tautan Google Maps: {googleMapsUrl}
                    </div>
                  </div>
                </div>

                {/* Informasi Fasilitas */}
                <div className="pt-6 border-t border-white/15 space-y-1.5">
                  <div className="text-xs font-mono-tabular uppercase tracking-widest text-white/60">
                    Standar Studio &amp; Kenyamanan
                  </div>
                  <p className="text-sm text-white/75 leading-relaxed">
                    {facilitiesNote}
                  </p>
                </div>
              </div>

              {/* Action Buttons (Mobile-Friendly Touch Targets >= 44px) */}
              <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href={resolvedMapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 bg-white text-[#05070B] text-xs font-bold tracking-widest uppercase hover:bg-white/90 transition-colors whitespace-nowrap shrink-0"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Petunjuk Arah (Google Maps)</span>
                </a>

                <a
                  href={resolvedWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-4 px-6 bg-[#05070B] border border-white/30 text-white text-xs font-bold tracking-widest uppercase hover:bg-[#0B1F3A] hover:border-white transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Hubungi WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right 6 Columns: Architectural Radar & Malang Coordinate Map Frame */}
            <div className="lg:col-span-6 bg-[#05070B] border border-white/20 relative overflow-hidden min-h-[380px] flex flex-col justify-between p-6 sm:p-8">
              {/* Architectural Blueprint Map of Kota Malang */}
              <svg
                viewBox="0 0 600 420"
                className="absolute inset-0 w-full h-full object-cover opacity-55 pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="malangGrid"
                    width="36"
                    height="36"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 36 0 L 0 0 0 36"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="0.6"
                      strokeOpacity="0.14"
                    />
                  </pattern>
                </defs>
                <rect width="600" height="420" fill="#05070B" />
                <rect width="600" height="420" fill="url(#malangGrid)" />
                {/* Stylized Malang Arterial Corridors & Brantas River Contour */}
                <path
                  d="M 40 350 Q 190 260 310 210 T 560 90"
                  fill="none"
                  stroke="#0B1F3A"
                  strokeWidth="16"
                />
                <path
                  d="M 40 350 Q 190 260 310 210 T 560 90"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeOpacity="0.45"
                />
                <path
                  d="M 140 30 L 310 210 L 470 390"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeOpacity="0.3"
                  strokeDasharray="6 6"
                />
                <circle
                  cx="310"
                  cy="210"
                  r="95"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />
                <circle
                  cx="310"
                  cy="210"
                  r="48"
                  fill="#0B1F3A"
                  fillOpacity="0.55"
                  stroke="#FFFFFF"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />
                <circle cx="310" cy="210" r="7" fill="#FFFFFF" />
              </svg>

              <div className="relative z-10 flex items-center justify-between text-xs font-mono-tabular text-white/75 bg-[#05070B]/90 border border-white/15 px-4 py-2.5">
                <span>KOTA MALANG · JAWA TIMUR</span>
                <span>7°58&apos;S 112°38&apos;E</span>
              </div>

              <div className="relative z-10 bg-[#05070B]/95 border border-white/25 p-5 space-y-3 mt-auto">
                <div className="text-xs font-mono-tabular uppercase tracking-widest text-white/60">
                  TITIK LOKASI BARBERSHOP
                </div>
                <div className="font-display text-lg font-bold text-white">
                  {brandName} — {address}
                </div>
                <p className="text-xs text-white/65 leading-relaxed">
                  Klik tombol di bawah untuk membuka navigasi rute langsung di aplikasi
                  Google Maps ponsel atau browser Anda.
                </p>
                <div className="pt-1">
                  <a
                    href={resolvedMapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-white underline underline-offset-4 hover:text-white/80"
                  >
                    <span>Buka Tautan Google Maps ({googleMapsUrl})</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
