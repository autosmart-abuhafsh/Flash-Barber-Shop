import React from 'react';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { SiteConfig } from '../config/siteConfig';

interface FooterSectionProps {
  config: SiteConfig;
  onNavigate: (sectionId: string) => void;
  onOpenConfigModal: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  config,
  onNavigate,
  onOpenConfigModal,
}) => {
  const currentYear = new Date().getFullYear();

  const resolvedMapsHref =
    config.googleMapsUrl.startsWith('http://') ||
    config.googleMapsUrl.startsWith('https://')
      ? config.googleMapsUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${config.brandName} Kota Malang`
        )}`;

  const resolvedWhatsAppHref = `https://wa.me/${config.whatsappInternational.trim()}`;

  return (
    <footer className="bg-[#05070B] text-white border-t border-white/15">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/15">
          {/* Column 1: Brand Identity & Tagline (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="inline-block font-display text-2xl font-extrabold tracking-wider text-white hover:opacity-90 transition-opacity"
            >
              {config.brandName}
            </a>

            <p className="text-base text-white/80 font-medium max-w-sm leading-relaxed">
              &ldquo;{config.tagline}&rdquo;
            </p>

            <p className="text-xs font-mono-tabular text-white/55 uppercase tracking-widest">
              {config.city}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenConfigModal}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-[#0B1F3A]/40 hover:bg-[#0B1F3A] text-xs font-mono-tabular text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Edit Placeholder Data Bisnis</span>
              </button>
            </div>
          </div>

          {/* Column 2: Quick Navigation (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-mono-tabular uppercase tracking-widest text-white/55">
              Navigasi
            </div>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Our Philosophy', id: 'about' },
                { label: 'Services & Pricing', id: 'services' },
                { label: '3D Barber Studio', id: 'studio-3d' },
                { label: 'Our Work Gallery', id: 'our-work' },
                { label: 'Book Session', id: 'booking' },
                { label: 'Location Malang', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.id);
                    }}
                    className="text-white/75 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span>{link.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono-tabular text-xs">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact, Hours & Socials (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-mono-tabular uppercase tracking-widest text-white/55">
              Informasi Studio &amp; Kontak
            </div>

            <div className="space-y-3 text-sm text-white/80">
              <div>
                <span className="block text-xs font-mono-tabular text-white/50">
                  Alamat:
                </span>
                <span className="font-medium text-white">{config.address}</span>
              </div>

              <div>
                <span className="block text-xs font-mono-tabular text-white/50">
                  Jam Operasional:
                </span>
                <span className="font-mono-tabular text-white">
                  {config.operatingHours}
                </span>
              </div>

              <div>
                <span className="block text-xs font-mono-tabular text-white/50">
                  WhatsApp:
                </span>
                <a
                  href={resolvedWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-tabular text-white hover:underline break-all inline-flex items-center gap-1"
                >
                  <span>{config.whatsappInternational}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono-tabular uppercase tracking-wider">
                <a
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white inline-flex items-center gap-1 border-b border-white/30 pb-0.5"
                >
                  <span>Instagram ({config.instagramHandle})</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>

                <a
                  href={resolvedMapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white inline-flex items-center gap-1 border-b border-white/30 pb-0.5"
                >
                  <span>Google Maps</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Brand Signature & Copyright */}
        <div className="pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono-tabular text-white/60">
          <div className="tracking-widest uppercase text-white font-semibold">
            CRAFTED WITH PRECISION. WORN WITH CONFIDENCE.
          </div>
          <div>
            &copy; {currentYear} {config.brandName} — Kota Malang. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
