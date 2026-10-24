import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { GalleryItem } from '../config/siteConfig';

interface GallerySectionProps {
  brandName: string;
  items: GalleryItem[];
  onBookStyle: (styleTitle: string) => void;
}

const CATEGORIES = ['All', 'Fade', 'Classic', 'Textured', 'Modern', 'Styling'] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export const GallerySection: React.FC<GallerySectionProps> = ({
  brandName,
  items,
  onBookStyle,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  // Keyboard navigation & body scroll lock for lightbox
  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredItems.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredItems.length) % filteredItems.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, filteredItems.length]);

  const activeLightboxItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || lightboxIndex === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) > 48) {
      if (deltaX < 0) {
        setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
      } else {
        setLightboxIndex(
          (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
        );
      }
    }
  };

  return (
    <section
      id="our-work"
      className="relative py-24 lg:py-32 bg-[#0B1F3A] text-white border-b border-white/15"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Heading & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/15">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-mono-tabular uppercase tracking-widest text-white/65">
              <span>Our Work &amp; Style Lookbook</span>
              <span aria-hidden="true">·</span>
              <span>Architectural Cuts</span>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-white">
              FRESH CUTS. REAL CONFIDENCE.
            </h2>
          </div>

          {/* Interactive Category Filter Controls (Functional Buttons) */}
          <div
            role="tablist"
            aria-label="Filter kategori gaya rambut"
            className="flex flex-wrap items-center gap-1.5 bg-[#05070B] p-1.5 border border-white/20"
          >
            {CATEGORIES.map((category) => {
              const isSelected = activeCategory === category;
              const count =
                category === 'All'
                  ? items.length
                  : items.filter((i) => i.category === category).length;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setActiveCategory(category);
                    setLightboxIndex(null);
                  }}
                  className={`px-3.5 py-2 text-xs font-mono-tabular uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#05070B] font-bold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span>{category}</span>
                  <span className="ml-1.5 opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editorial Notice for Demonstration Lookbook */}
        <div className="pt-6 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-white/70 font-mono-tabular">
          <span>
            KATALOG REFERENSI GAYA · KLIK VISUAL UNTUK MELIHAT DETAIL STRUKTUR POTONGAN
          </span>
          <span>
            *Visual studi referensi demonstrasi — siap diganti dengan dokumentasi asli{' '}
            {brandName}
          </span>
        </div>

        {/* Asymmetric Structured Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
              const colSpanClass =
                idx % 4 === 0
                  ? 'lg:col-span-5'
                  : idx % 4 === 1
                  ? 'lg:col-span-7'
                  : idx % 4 === 2
                  ? 'lg:col-span-7'
                  : 'lg:col-span-5';

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setLightboxIndex(idx)}
                  className={`${colSpanClass} group relative bg-[#05070B] border border-white/20 hover:border-white/65 transition-colors overflow-hidden cursor-pointer flex flex-col justify-between`}
                >
                  <div className="relative aspect-[16/10.5] w-full overflow-hidden bg-[#05070B]">
                    <img
                      src={item.image}
                      alt={`Referensi gaya potongan rambut pria ${item.title} (${item.category})`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/20 to-transparent opacity-85" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono-tabular text-white/80">
                      <span>
                        {item.code} · {item.category.toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-white group-hover:translate-x-0.5 transition-transform">
                        INSPECT <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-6 bg-[#05070B] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <div className="text-xs text-white/65 flex flex-wrap items-center gap-2">
                        <span>{item.contourSpec}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.finishSpec}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookStyle(item.title);
                      }}
                      className="px-4 py-2.5 border border-white/25 text-xs font-mono-tabular uppercase tracking-wider text-white hover:bg-white hover:text-[#05070B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Pilih Gaya Ini
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal with Prev/Next & Touch Swipe Navigation */}
      <AnimatePresence>
        {activeLightboxItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Detail gaya rambut ${activeLightboxItem.title}`}
            onClick={() => setLightboxIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-50 bg-[#05070B]/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#05070B] border border-white/30 overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-[0_28px_80px_rgba(5,7,11,0.95)]"
            >
              {/* Image Column */}
              <div className="md:col-span-7 relative aspect-[4/4.2] bg-[#0B1F3A]/20">
                <img
                  src={activeLightboxItem.image}
                  alt={activeLightboxItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details & Controls Column */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#05070B] border-t md:border-t-0 md:border-l border-white/15">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular text-xs uppercase tracking-widest text-white/65">
                      {activeLightboxItem.code} · {activeLightboxItem.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(null)}
                      aria-label="Tutup pratinjau galeri"
                      className="p-2 border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                      {activeLightboxItem.title}
                    </h3>
                    <p className="text-xs font-mono-tabular text-white/60">
                      Referensi Katalog Gaya · {brandName}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/15 text-sm">
                    <div>
                      <div className="text-xs font-mono-tabular uppercase text-white/50">
                        Spesifikasi Kontur
                      </div>
                      <div className="text-white font-medium mt-0.5">
                        {activeLightboxItem.contourSpec}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono-tabular uppercase text-white/50">
                        Produk &amp; Hasil Akhir
                      </div>
                      <div className="text-white font-medium mt-0.5">
                        {activeLightboxItem.finishSpec}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono-tabular uppercase text-white/50">
                        Rekomendasi Bentuk Wajah
                      </div>
                      <div className="text-white font-medium mt-0.5">
                        {activeLightboxItem.recommendedFace}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <button
                    type="button"
                    onClick={() => {
                      const title = activeLightboxItem.title;
                      setLightboxIndex(null);
                      onBookStyle(title);
                    }}
                    className="w-full py-3.5 px-5 bg-white text-[#05070B] text-xs font-bold tracking-widest uppercase hover:bg-white/90 transition-colors cursor-pointer"
                  >
                    BOOK GAYA INI VIA WHATSAPP
                  </button>

                  {/* Prev / Next Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/15">
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex(
                          (lightboxIndex - 1 + filteredItems.length) %
                            filteredItems.length
                        )
                      }
                      className="inline-flex items-center gap-1.5 py-2 px-3 text-xs font-mono-tabular text-white/80 hover:text-white border border-white/15 hover:border-white/40 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    <span className="font-mono-tabular text-xs text-white/60">
                      {lightboxIndex + 1} / {filteredItems.length}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((lightboxIndex + 1) % filteredItems.length)
                      }
                      className="inline-flex items-center gap-1.5 py-2 px-3 text-xs font-mono-tabular text-white/80 hover:text-white border border-white/15 hover:border-white/40 transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
