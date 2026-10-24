import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock } from 'lucide-react';
import { ServiceItem } from '../config/siteConfig';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForBooking: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForBooking,
}) => {
  const [activeId, setActiveId] = useState<string>(
    services[0]?.id || 'classic-haircut'
  );
  const activeService =
    services.find((s) => s.id === activeId) || services[0];

  return (
    <section
      id="services"
      className="relative py-24 lg:py-32 bg-[#05070B] text-white border-b border-white/15"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Editorial Heading Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/15">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-mono-tabular uppercase tracking-widest text-white/60">
              <span>Curated Grooming Menu</span>
              <span aria-hidden="true">·</span>
              <span>Kota Malang</span>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-white">
              YOUR STYLE. OUR CRAFT.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-white/70 max-w-md leading-relaxed">
            Pilih layanan sesuai kebutuhan penampilan Anda. Harga menggunakan placeholder{' '}
            <span className="font-mono-tabular text-white">RpXX.XXX</span> sampai daftar
            tarif resmi ditetapkan oleh pemilik barbershop.
          </p>
        </div>

        {/* Asymmetric Editorial Split: Interactive Service List (Left) + Visual Spotlight (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-10 items-start">
          {/* Left 7 Columns: Editorial Index List */}
          <div className="lg:col-span-7 divide-y divide-white/15 border-b border-white/15">
            {services.map((service) => {
              const isSelected = service.id === activeService.id;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveId(service.id)}
                  onClick={() => setActiveId(service.id)}
                  className={`group transition-colors duration-200 cursor-pointer py-6 px-4 sm:px-6 ${
                    isSelected
                      ? 'bg-[#0B1F3A] border-white/30'
                      : 'bg-transparent hover:bg-[#0B1F3A]/45'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono-tabular text-xs font-semibold text-white/60">
                          {service.index} —
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {service.name}
                        </h3>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed pl-0 sm:pl-9">
                        {service.shortDesc}
                      </p>
                    </div>

                    {/* Tabular Price & Duration Metadata */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pl-0 sm:pl-4">
                      <span className="font-mono-tabular text-base sm:text-lg font-bold text-white">
                        {service.price}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono-tabular text-white/65">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detail & Direct Booking Trigger (Always accessible on touch & hover) */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isSelected
                        ? 'max-h-[520px] opacity-100 pt-5'
                        : 'max-h-0 opacity-0 pt-0'
                    }`}
                  >
                    <div className="pl-0 sm:pl-9 pt-4 border-t border-white/15 space-y-4">
                      {/* Mobile Inline Visual Preview so touch users see the plate immediately */}
                      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#05070B] p-3 border border-white/15">
                        <div className="sm:col-span-4 aspect-[4/3] overflow-hidden bg-[#05070B]">
                          <img
                            src={service.image}
                            alt={service.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="sm:col-span-8 space-y-1">
                          <div className="text-[11px] font-mono-tabular text-white/55">
                            {service.techniqueSpec}
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed">
                            {service.details}
                          </p>
                        </div>
                      </div>

                      <div className="hidden lg:block space-y-2">
                        <div className="text-xs font-mono-tabular text-white/60">
                          {service.techniqueSpec}
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed max-w-lg">
                          {service.details}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-1">
                        <span className="text-xs font-mono-tabular text-white/60">
                          {service.category} · {service.duration}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectServiceForBooking(service.name);
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#05070B] text-xs font-bold tracking-widest uppercase hover:bg-white/90 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <span>Book Layanan</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 5 Columns: Sticky Service Visual & Specification Preview (Desktop) */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-28">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0.4, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="border border-white/25 bg-[#0B1F3A]/40 overflow-hidden shadow-[0_24px_60px_rgba(5,7,11,0.75)]"
            >
              <div className="relative aspect-[4/4.3] w-full bg-[#05070B] overflow-hidden">
                <img
                  src={activeService.image}
                  alt={`${activeService.name} — ${activeService.shortDesc}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 scale-100 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-85 pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono-tabular text-white/65 uppercase tracking-widest">
                      {activeService.index} · {activeService.category}
                    </div>
                    <h4 className="font-display text-2xl font-bold text-white mt-1">
                      {activeService.name}
                    </h4>
                  </div>
                  <div className="text-right font-mono-tabular">
                    <div className="text-xs text-white/60">Estimasi Harga</div>
                    <div className="text-lg font-bold text-white">
                      {activeService.price}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5 bg-[#05070B]">
                <div className="flex items-center justify-between text-xs font-mono-tabular text-white/65 border-b border-white/15 pb-3">
                  <span>DURASI: {activeService.duration}</span>
                  <span>{activeService.techniqueSpec.split('·')[0]}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {activeService.details}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectServiceForBooking(activeService.name)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-white text-[#05070B] text-xs font-bold tracking-widest uppercase hover:bg-white/90 transition-colors cursor-pointer"
                >
                  <span>PILIH &amp; BOOKING {activeService.name}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
