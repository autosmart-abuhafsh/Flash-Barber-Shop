import React from 'react';
import { motion } from 'motion/react';
import { PhilosophyValue } from '../config/siteConfig';

interface PhilosophySectionProps {
  brandName: string;
  headline: string;
  body: string;
  mainImage: string;
  detailImage: string;
  values: PhilosophyValue[];
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  brandName,
  headline,
  body,
  mainImage,
  detailImage,
  values,
}) => {
  return (
    <section
      id="about"
      className="relative py-24 lg:py-32 bg-[#0B1F3A] text-white border-b border-white/15 overflow-hidden"
    >
      {/* Subtle Architectural Hairline Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#FFFFFF_1px,transparent_1px),linear-gradient(to_bottom,#FFFFFF_1px,transparent_1px)] bg-[size:6rem_6rem]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Story & Values */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-xs font-mono-tabular uppercase tracking-widest text-white/65">
                <span>Our Philosophy</span>
                <span aria-hidden="true">·</span>
                <span>{brandName}</span>
              </div>

              <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-white">
                {headline}
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-white/85 leading-relaxed font-normal max-w-2xl"
            >
              {body}
            </motion.p>

            {/* Three Core Values */}
            <div className="pt-6 border-t border-white/20 divide-y divide-white/15">
              {values.map((val, idx) => (
                <motion.div
                  key={val.index}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="py-6 first:pt-2 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline group"
                >
                  <div className="sm:col-span-5 space-y-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono-tabular text-sm font-semibold text-white/60">
                        {val.index} —
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight group-hover:translate-x-0.5 transition-transform">
                        {val.title}
                      </h3>
                    </div>
                    <div className="text-[11px] font-mono-tabular text-white/50 pl-0 sm:pl-10">
                      {val.metricLabel}
                    </div>
                  </div>
                  <p className="sm:col-span-7 text-sm sm:text-base text-white/80 leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Layered Depth Editorial Composition (Zero Continuous Scroll Listener Overhead) */}
          <div className="lg:col-span-5 relative pt-2 lg:pt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] w-full sm:w-11/12 bg-[#05070B] border border-white/25 overflow-hidden shadow-[0_20px_48px_rgba(5,7,11,0.65)]"
            >
              <img
                src={mainImage}
                alt={`Studi presisi alat cukur dan filosofi grooming ${brandName} di Malang`}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070B]/80 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Secondary Offset Depth Layer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 sm:mt-0 sm:absolute sm:-bottom-8 sm:-right-2 w-full sm:w-64 aspect-[4/3] bg-[#05070B] border border-white/35 shadow-[0_20px_40px_rgba(5,7,11,0.85)] overflow-hidden"
            >
              <img
                src={detailImage}
                alt="Detail kalibrasi mata pisau clipper dan instrumen barbershop"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
