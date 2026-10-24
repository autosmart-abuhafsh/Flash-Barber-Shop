import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Compass } from 'lucide-react';
import { Hero3DScene } from './Hero3DScene';

interface HeroSectionProps {
  brandName: string;
  tagline: string;
  city: string;
  onBookClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  brandName,
  tagline,
  city,
  onBookClick,
  onExploreClick,
}) => {
  const [activePreset, setActivePreset] = useState<'ensemble' | 'clipper' | 'shears'>('ensemble');
  const [primaryOffset, setPrimaryOffset] = useState({ x: 0, y: 0 });
  const primaryBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = primaryBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.14;
    const dy = (e.clientY - cy) * 0.18;
    setPrimaryOffset({ x: dx, y: dy });
  };

  const resetMagnetic = () => {
    setPrimaryOffset({ x: 0, y: 0 });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 pb-12 lg:pt-28 lg:pb-16 bg-[#05070B] overflow-hidden flex flex-col justify-between border-b border-white/15"
    >
      {/* Subtle Architectural Background Depth Layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,#0B1F3A_0%,rgba(11,31,58,0.34)_44%,rgba(5,7,11,0)_76%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#FFFFFF_1px,transparent_1px),linear-gradient(to_bottom,#FFFFFF_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      {/* Main Split Editorial Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">
          {/* Left Column: Editorial Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-7 py-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono-tabular tracking-widest uppercase text-white/70"
            >
              <span>{city}</span>
              <span aria-hidden="true">·</span>
              <span>{tagline}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-extrabold tracking-tight text-white leading-[1.02] text-[clamp(2.5rem,5vw,4.6rem)]"
            >
              SHARP LOOK.
              <br />
              <span className="text-white/90">STRONG CHARACTER.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl font-normal"
            >
              Pengalaman grooming modern untuk pria yang tahu bagaimana tampil maksimal.
              Temukan gaya terbaikmu bersama{' '}
              <span className="text-white font-semibold">{brandName}</span> di Malang.
            </motion.p>

            {/* Primary & Secondary CTAs with Subtle Magnetic Desktop Response */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                ref={primaryBtnRef}
                type="button"
                onClick={onBookClick}
                onMouseMove={handleMagneticMove}
                onMouseLeave={resetMagnetic}
                style={{
                  transform: `translate3d(${primaryOffset.x}px, ${primaryOffset.y}px, 0)`,
                }}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-white text-[#05070B] text-xs font-bold tracking-widest uppercase hover:bg-white/90 active:scale-[0.98] transition-transform duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span>BOOK YOUR SESSION</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-[#0B1F3A]/85 text-white border border-white/25 text-xs font-bold tracking-widest uppercase hover:bg-[#0B1F3A] hover:border-white/70 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span>EXPLORE OUR STYLE</span>
              </button>
            </motion.div>

            {/* Quiet Unboxed Editorial Metadata */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60"
            >
              <span>Precision Hair Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Personal Style Consultation</span>
              <span aria-hidden="true">·</span>
              <span>Hygienic Studio Standard</span>
            </motion.div>
          </div>

          {/* Right Column: Interactive 3D Viewport + Bottom Focus Switcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex flex-col"
          >
            <div className="relative w-full h-[390px] sm:h-[470px] lg:h-[540px] border border-white/20 bg-[#05070B]/80">
              {/* Top-Left 3D Interaction Cue */}
              <div className="absolute top-3.5 left-4 z-20 pointer-events-none flex items-center gap-2 text-[11px] font-mono-tabular uppercase tracking-widest text-white/65 bg-[#05070B]/90 px-3 py-1.5 border border-white/15">
                <Compass className="w-3.5 h-3.5 text-white" />
                <span>3D Interactive Ensemble · Drag or Move Cursor</span>
              </div>

              <Hero3DScene activePreset={activePreset} />

              {/* Bottom Dock Instrument Focus Control (No backdrop-blur over WebGL) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 bg-[#05070B] border border-white/25">
                {(
                  [
                    { id: 'ensemble', label: '01. Full Ensemble' },
                    { id: 'clipper', label: '02. Clipper Focus' },
                    { id: 'shears', label: '03. Shears Focus' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePreset(item.id)}
                    className={`px-3 py-1.5 text-[11px] font-mono-tabular transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activePreset === item.id
                        ? 'bg-white text-[#05070B] font-semibold'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Architectural Strip Below Hero Split */}
        <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="font-mono-tabular text-xs text-white/50 uppercase tracking-widest">
              01 · LOCATION
            </div>
            <div className="font-display text-sm sm:text-base font-bold text-white mt-1">
              Kota Malang, Jawa Timur
            </div>
          </div>
          <div>
            <div className="font-mono-tabular text-xs text-white/50 uppercase tracking-widest">
              02 · APPROACH
            </div>
            <div className="font-display text-sm sm:text-base font-bold text-white mt-1">
              Tailored Cranial Proportion
            </div>
          </div>
          <div>
            <div className="font-mono-tabular text-xs text-white/50 uppercase tracking-widest">
              03 · HYGIENE
            </div>
            <div className="font-display text-sm sm:text-base font-bold text-white mt-1">
              Sterilized Precision Blades
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono-tabular text-xs text-white/50 uppercase tracking-widest">
                04 · RESERVATION
              </div>
              <div className="font-display text-sm sm:text-base font-bold text-white mt-1">
                Direct WhatsApp Priority
              </div>
            </div>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label="Scroll ke bagian filosofi"
              className="p-2.5 border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
