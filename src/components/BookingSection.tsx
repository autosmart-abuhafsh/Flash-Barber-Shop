import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { ServiceItem, BarberOption } from '../config/siteConfig';

interface BookingSectionProps {
  brandName: string;
  whatsappInternational: string;
  services: ServiceItem[];
  barbers: BarberOption[];
  preselectedService: string;
  preselectedNote: string;
  onOpenConfigModal: () => void;
}

interface FormErrors {
  customerName?: string;
  customerWhatsapp?: string;
  selectedService?: string;
  preferredDate?: string;
  preferredTime?: string;
}

const TIME_SLOTS = [
  '10:00 WIB',
  '11:00 WIB',
  '13:00 WIB',
  '14:00 WIB',
  '15:30 WIB',
  '16:30 WIB',
  '18:30 WIB',
  '19:30 WIB',
  '20:30 WIB',
];

function getIsoDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  brandName,
  whatsappInternational,
  services,
  barbers,
  preselectedService,
  preselectedNote,
  onOpenConfigModal,
}) => {
  const todayIso = getIsoDateOffset(0);
  const tomorrowIso = getIsoDateOffset(1);

  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]?.name || '');
  const [preferredDate, setPreferredDate] = useState(todayIso);
  const [preferredTime, setPreferredTime] = useState('16:30 WIB');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [generatedWaUrl, setGeneratedWaUrl] = useState<string | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Sync preselected service or style from Services / Gallery sections
  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
      setErrors((prev) => ({ ...prev, selectedService: undefined }));
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedNote) {
      setNotes((prev) =>
        prev.includes(preselectedNote)
          ? prev
          : prev
          ? `${prev} · Referensi: ${preselectedNote}`
          : `Referensi gaya: ${preselectedNote}`
      );
    }
  }, [preselectedNote]);

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      nextErrors.customerName = 'Nama pelanggan wajib diisi (minimal 2 karakter).';
    }

    const cleanedPhone = customerWhatsapp.replace(/[\s-]/g, '');
    if (!cleanedPhone || !/^\+?[0-9]{9,15}$/.test(cleanedPhone)) {
      nextErrors.customerWhatsapp =
        'Nomor WhatsApp aktif wajib diisi dengan angka yang valid (contoh: 081234567890).';
    }

    if (!selectedService) {
      nextErrors.selectedService = 'Silakan pilih salah satu layanan grooming.';
    }

    if (!preferredDate) {
      nextErrors.preferredDate = 'Tanggal kunjungan wajib dipilih.';
    } else if (preferredDate < todayIso) {
      nextErrors.preferredDate = 'Tanggal pilihan tidak boleh di masa lalu.';
    }

    if (!preferredTime) {
      nextErrors.preferredTime = 'Waktu kunjungan wajib dipilih.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildWhatsAppMessage = () => {
    const chosenServiceObj = services.find((s) => s.name === selectedService);
    const priceInfo = chosenServiceObj ? ` (${chosenServiceObj.price})` : '';

    const messageLines = [
      `Halo *${brandName}* Malang, saya ingin melakukan reservasi sesi grooming:`,
      ``,
      `• *Nama:* ${customerName.trim()}`,
      `• *No. WhatsApp:* ${customerWhatsapp.trim()}`,
      `• *Layanan:* ${selectedService}${priceInfo}`,
      `• *Pilihan Barber:* ${selectedBarber || 'Barber Tersedia'}`,
      `• *Tanggal:* ${preferredDate}`,
      `• *Waktu:* ${preferredTime}`,
      `• *Catatan Tambahan:* ${notes.trim() || '-'}`,
      ``,
      `Mohon konfirmasi ketersediaan jadwal tersebut. Terima kasih.`,
    ];

    return messageLines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setGeneratedWaUrl(null);
      return;
    }

    const message = buildWhatsAppMessage();
    const encodedText = encodeURIComponent(message);
    const cleanTargetNumber = whatsappInternational.trim().replace(/^\+/, '');
    const waUrl = `https://wa.me/${cleanTargetNumber}?text=${encodedText}`;

    setGeneratedMessage(message);
    setGeneratedWaUrl(waUrl);

    const anchor = document.createElement('a');
    anchor.href = waUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleCopyMessage = async () => {
    if (!generatedMessage) return;
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  return (
    <section
      id="booking"
      className="relative py-24 lg:py-32 bg-[#05070B] text-white border-b border-white/15"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Conversion Framing & Transparency Notice */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono-tabular uppercase tracking-widest text-white/60">
                <span>Direct WhatsApp Reservation</span>
                <span aria-hidden="true">·</span>
                <span>Kota Malang</span>
              </div>
              <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-white">
                YOUR NEXT LOOK STARTS HERE.
              </h2>
              <p className="text-base text-white/75 leading-relaxed">
                Jadwalkan sesi potong rambut dan grooming Anda tanpa antre. Isi detail
                kunjungan di samping untuk menyusun format reservasi resmi yang dikirim
                langsung ke WhatsApp{' '}
                <span className="text-white font-semibold">{brandName}</span>.
              </p>
            </div>

            {/* Process Steps & Honest Reservation Notice */}
            <div className="p-6 bg-[#0B1F3A]/45 border border-white/20 space-y-4">
              <div className="font-mono-tabular text-xs uppercase tracking-widest text-white">
                CARA PEMESANAN &amp; KONFIRMASI JADWAL
              </div>
              <ol className="space-y-3 text-sm text-white/80 list-decimal list-inside leading-relaxed">
                <li>Lengkapi kolom nama, nomor WhatsApp, layanan, serta waktu pilihan.</li>
                <li>
                  Tekan tombol <strong className="text-white">BOOK VIA WHATSAPP</strong> untuk
                  membuka aplikasi WhatsApp dengan pesan reservasi otomatis.
                </li>
                <li>
                  <strong className="text-white">Penting:</strong> Pengiriman formulir ini
                  diteruskan melalui WhatsApp dan jadwal Anda baru dinyatakan aktif setelah
                  dikonfirmasi oleh pihak barbershop.
                </li>
              </ol>
              <div className="pt-3 border-t border-white/15 flex flex-col gap-2 text-xs font-mono-tabular text-white/65 break-all">
                <span>Tujuan WhatsApp Bisnis: {whatsappInternational}</span>
                <button
                  type="button"
                  onClick={onOpenConfigModal}
                  className="inline-flex items-center gap-1.5 text-white underline underline-offset-4 hover:text-white/80 w-fit cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Atur Nomor WhatsApp Resmi Bisnis</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Booking Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-10 bg-[#0B1F3A]/30 border border-white/20 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Nama Pelanggan */}
                <div className="space-y-2">
                  <label
                    htmlFor="booking-name"
                    className="block text-xs font-mono-tabular uppercase tracking-wider text-white/85"
                  >
                    Nama Pelanggan <span className="text-white">*</span>
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    autoComplete="name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) {
                        setErrors({ ...errors, customerName: undefined });
                      }
                    }}
                    placeholder="Contoh: Raka Pratama"
                    className={`w-full px-4 py-3.5 bg-[#05070B] border text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors ${
                      errors.customerName
                        ? 'border-white bg-[#0B1F3A]/60'
                        : 'border-white/25 focus:border-white'
                    }`}
                  />
                  {errors.customerName && (
                    <p
                      role="alert"
                      className="flex items-center gap-1.5 text-xs text-white font-medium pt-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.customerName}</span>
                    </p>
                  )}
                </div>

                {/* 2. Nomor WhatsApp Pelanggan */}
                <div className="space-y-2">
                  <label
                    htmlFor="booking-wa"
                    className="block text-xs font-mono-tabular uppercase tracking-wider text-white/85"
                  >
                    Nomor WhatsApp <span className="text-white">*</span>
                  </label>
                  <input
                    id="booking-wa"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={customerWhatsapp}
                    onChange={(e) => {
                      setCustomerWhatsapp(e.target.value);
                      if (errors.customerWhatsapp) {
                        setErrors({ ...errors, customerWhatsapp: undefined });
                      }
                    }}
                    placeholder="Contoh: 081234567890"
                    className={`w-full px-4 py-3.5 bg-[#05070B] border text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors font-mono-tabular ${
                      errors.customerWhatsapp
                        ? 'border-white bg-[#0B1F3A]/60'
                        : 'border-white/25 focus:border-white'
                    }`}
                  />
                  {errors.customerWhatsapp && (
                    <p
                      role="alert"
                      className="flex items-center gap-1.5 text-xs text-white font-medium pt-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.customerWhatsapp}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 3. Pilihan Layanan */}
                <div className="space-y-2">
                  <label
                    htmlFor="booking-service"
                    className="block text-xs font-mono-tabular uppercase tracking-wider text-white/85"
                  >
                    Pilihan Layanan <span className="text-white">*</span>
                  </label>
                  <select
                    id="booking-service"
                    value={selectedService}
                    onChange={(e) => {
                      setSelectedService(e.target.value);
                      if (errors.selectedService) {
                        setErrors({ ...errors, selectedService: undefined });
                      }
                    }}
                    className={`w-full px-4 py-3.5 bg-[#05070B] border text-sm text-white focus:outline-none transition-colors ${
                      errors.selectedService
                        ? 'border-white bg-[#0B1F3A]/60'
                        : 'border-white/25 focus:border-white'
                    }`}
                  >
                    <option value="">— Pilih Layanan Grooming —</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.index}. {service.name} ({service.price} · {service.duration})
                      </option>
                    ))}
                  </select>
                  {errors.selectedService && (
                    <p
                      role="alert"
                      className="flex items-center gap-1.5 text-xs text-white font-medium pt-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.selectedService}</span>
                    </p>
                  )}
                </div>

                {/* 4. Pilihan Barber */}
                <div className="space-y-2">
                  <label
                    htmlFor="booking-barber"
                    className="block text-xs font-mono-tabular uppercase tracking-wider text-white/85"
                  >
                    Pilihan Barber (Opsional)
                  </label>
                  <select
                    id="booking-barber"
                    value={selectedBarber}
                    onChange={(e) => setSelectedBarber(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#05070B] border border-white/25 focus:border-white text-sm text-white focus:outline-none transition-colors"
                  >
                    {barbers.map((barber) => (
                      <option key={barber.id} value={barber.name}>
                        {barber.name} — {barber.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 5. Tanggal Pilihan + Quick Select */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="booking-date"
                      className="block text-xs font-mono-tabular uppercase tracking-wider text-white/85"
                    >
                      Tanggal Pilihan <span className="text-white">*</span>
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono-tabular">
                      <button
                        type="button"
                        onClick={() => {
                          setPreferredDate(todayIso);
                          setErrors({ ...errors, preferredDate: undefined });
                        }}
                        className={`px-2 py-0.5 border cursor-pointer ${
                          preferredDate === todayIso
                            ? 'bg-white text-[#05070B] border-white font-semibold'
                            : 'border-white/20 text-white/65 hover:text-white'
                        }`}
                      >
                        Hari Ini
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPreferredDate(tomorrowIso);
                          setErrors({ ...errors, preferredDate: undefined });
                        }}
                        className={`px-2 py-0.5 border cursor-pointer ${
                          preferredDate === tomorrowIso
                            ? 'bg-white text-[#05070B] border-white font-semibold'
                            : 'border-white/20 text-white/65 hover:text-white'
                        }`}
                      >
                        Besok
                      </button>
                    </div>
                  </div>
                  <input
                    id="booking-date"
                    type="date"
                    min={todayIso}
                    value={preferredDate}
                    onChange={(e) => {
                      setPreferredDate(e.target.value);
                      if (errors.preferredDate) {
                        setErrors({ ...errors, preferredDate: undefined });
                      }
                    }}
                    className={`w-full px-4 py-3.5 bg-[#05070B] border text-sm text-white font-mono-tabular focus:outline-none transition-colors ${
                      errors.preferredDate
                        ? 'border-white bg-[#0B1F3A]/60'
                        : 'border-white/25 focus:border-white'
                    }`}
                  />
                  {errors.preferredDate && (
                    <p
                      role="alert"
                      className="flex items-center gap-1.5 text-xs text-white font-medium pt-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.preferredDate}</span>
                    </p>
                  )}
                </div>

                {/* 6. Waktu Pilihan */}
                <div className="space-y-2">
                  <label
                    htmlFor="booking-time"
                    className="block text-xs font-mono-tabular uppercase tracking-wider text-white/85"
                  >
                    Waktu Pilihan <span className="text-white">*</span>
                  </label>
                  <select
                    id="booking-time"
                    value={preferredTime}
                    onChange={(e) => {
                      setPreferredTime(e.target.value);
                      if (errors.preferredTime) {
                        setErrors({ ...errors, preferredTime: undefined });
                      }
                    }}
                    className={`w-full px-4 py-3.5 bg-[#05070B] border text-sm text-white font-mono-tabular focus:outline-none transition-colors ${
                      errors.preferredTime
                        ? 'border-white bg-[#0B1F3A]/60'
                        : 'border-white/25 focus:border-white'
                    }`}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.preferredTime && (
                    <p
                      role="alert"
                      className="flex items-center gap-1.5 text-xs text-white font-medium pt-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.preferredTime}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 7. Catatan Tambahan */}
              <div className="space-y-2">
                <label
                  htmlFor="booking-notes"
                  className="block text-xs font-mono-tabular uppercase tracking-wider text-white/85"
                >
                  Catatan Tambahan / Referensi Gaya
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Ingin diskusi Low Drop Fade atau memiliki preferensi khusus..."
                  className="w-full px-4 py-3 bg-[#05070B] border border-white/25 focus:border-white text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors resize-y"
                />
              </div>

              {/* Primary CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 py-4 px-8 bg-white text-[#05070B] text-xs font-bold tracking-widest uppercase hover:bg-white/90 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>BOOK VIA WHATSAPP</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Confirmation & Direct wa.me Dispatch Card */}
              {generatedWaUrl && (
                <div
                  role="status"
                  className="mt-6 p-5 bg-[#05070B] border border-white/40 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-wider text-white font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>FORMAT RESERVASI WHATSAPP SIAP DIKIRIM</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-1.5 px-3 py-1 border border-white/25 text-[11px] font-mono-tabular text-white/80 hover:text-white hover:border-white cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Pesan</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-3.5 bg-[#0B1F3A]/40 border border-white/15 text-xs font-mono-tabular text-white/85 whitespace-pre-wrap leading-relaxed">
                    {generatedMessage}
                  </pre>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-white/65">
                      Jika aplikasi WhatsApp belum terbuka otomatis di perangkat Anda, klik
                      tautan resmi di bawah:
                    </p>
                    <a
                      href={generatedWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#05070B] text-xs font-bold tracking-widest uppercase hover:bg-white/90 whitespace-nowrap shrink-0"
                    >
                      <span>Buka wa.me Sekarang</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
