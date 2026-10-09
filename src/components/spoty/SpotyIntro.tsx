import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { beamVariants, introVariants } from './variants';
import InteractiveLandscape from '@/components/InteractiveLandscape';

interface Props {
  /** Cinematic phase */
  phase: number;
  onComplete: () => void;
  title1?: string;
  title2?: string;
  title3?: string;
}

export default function SpotyIntro({
  phase,
  onComplete,
  title1,
  title2,
  title3,
}: Props) {
  const reducedMotion = useReducedMotion();
  const isCustomTitle = Boolean(title1 && title1 !== 'Sports');

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="intro"
        variants={introVariants}
        initial="blackScreen"
        exit="exit"
        className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-transparent px-4 sm:px-6 md:px-8 pt-20 pb-8 sm:pb-12 text-center"
        aria-label="UAI Sports Club — THE ARENA"
      >
        {/* Live 3D WebGL Scene: Deep Navy to Royal Blue Sky, Metallic Gold Trophy, Soft Horizon Glow & Track */}
        <div className="absolute inset-0 z-0">
          <InteractiveLandscape />
        </div>

        {/* Cinematic horizontal horizon beam */}
        {phase >= 1 && !reducedMotion && (
          <motion.div
            variants={beamVariants}
            initial="hidden"
            animate="visible"
            className="pointer-events-none absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent"
          />
        )}

        {/* Top Floating Controls: Skip Intro */}
        <div className="relative z-20 flex w-full max-w-7xl items-center justify-end px-2">
          <button
            type="button"
            onClick={onComplete}
            className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-[#07152E]/70 px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-[#AAB6C8] backdrop-blur-md transition-all hover:border-[#D4AF37]/50 hover:bg-[#07152E]/90 hover:text-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            aria-label="Skip introduction"
          >
            <span>Skip intro</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>

        {/* Upper Brand Identity Badge */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            key="identity"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -20 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="inline-flex flex-col items-center drop-shadow-[0_4px_16px_rgba(7,21,46,0.9)]"
          >
            <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#07152E]/75 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <span className="text-[#D4AF37] text-xs">★</span>
              <p className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#D4AF37]">
                UNIVERSAL AI UNIVERSITY
              </p>
              <span className="text-[#D4AF37] text-xs">★</span>
            </div>
            <div className="mt-2.5 flex items-center gap-3">
              <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
              <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.4em] text-[#F7F8FC]/90">
                UAI SPORTS CLUB • 2026–2027
              </p>
              <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
            </div>
          </motion.div>
        </div>

        {/* Center / Lower Content: Hierarchy — Headline, Tagline, Primary & Secondary CTAs */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center mt-auto pb-4 sm:pb-8">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.94 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            {isCustomTitle ? (
              <h1 className="font-display font-black uppercase leading-[0.92] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
                <span className="block text-[clamp(2.4rem,8vw,6.5rem)] tracking-tight text-[#F7F8FC]">
                  {title1}
                </span>
                <span className="block text-[clamp(1.6rem,5.5vw,4.5rem)] tracking-[0.08em] text-[#D4AF37]">
                  {title2}
                </span>
                <span className="block text-[clamp(1.2rem,4vw,3.2rem)] tracking-[0.18em] text-[#F7F8FC]/90">
                  {title3}
                </span>
              </h1>
            ) : (
              <div>
                {/* 1. The Headline: THE ARENA */}
                <h1 className="font-display font-black uppercase tracking-tight text-[clamp(2.6rem,8.5vw,6.4rem)] leading-[0.95] drop-shadow-[0_12px_36px_rgba(7,21,46,0.9)]">
                  <span className="block text-[#F7F8FC]">
                    THE ARENA
                  </span>
                </h1>

                {/* 3. The Supporting Tagline: Where performance becomes legacy. */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 15 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mx-auto mt-4 max-w-2xl font-sans text-xs sm:text-sm md:text-base font-normal tracking-[0.18em] sm:tracking-[0.24em] text-[#F7F8FC]/90 drop-shadow-[0_4px_16px_rgba(7,21,46,0.95)]"
                >
                  Where performance becomes legacy.
                </motion.p>
              </div>
            )}
          </motion.div>

          {/* Actions: 4. ENTER THE ARENA (Primary CTA) & 5. WATCH LIVE (Secondary CTA) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 25 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-5"
          >
            {/* Primary Action: ENTER THE ARENA */}
            <Link
              href="/home"
              className="group relative flex w-full sm:w-auto min-w-[220px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E6C665] to-[#B89228] px-8 py-3.5 font-sans text-xs sm:text-sm font-extrabold uppercase tracking-[0.22em] text-[#07152E] shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(212,175,55,0.65)] active:scale-[0.98]"
            >
              <span>ENTER THE ARENA</span>
              <span className="material-symbols-outlined text-base font-bold transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>

            {/* Secondary Action: WATCH LIVE */}
            <Link
              href="/live"
              className="group flex w-full sm:w-auto min-w-[220px] items-center justify-center gap-2.5 rounded-full border border-[#123D7A]/60 bg-[#07152E]/75 px-8 py-3.5 font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#F7F8FC] backdrop-blur-md shadow-[0_0_20px_rgba(18,61,122,0.4)] transition-all duration-300 hover:scale-[1.03] hover:border-[#D4AF37]/60 hover:bg-[#123D7A]/80 hover:text-white active:scale-[0.98]"
            >
              {/* Live Status Indicator (Red #E5484D) */}
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E5484D] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E5484D]" />
              </span>
              <span>WATCH LIVE</span>
            </Link>
          </motion.div>

          {/* Ceremony Reveal Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6"
          >
            <button
              type="button"
              onClick={onComplete}
              className="group flex items-center gap-2 font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#AAB6C8] transition-all hover:text-[#D4AF37] focus:outline-none"
            >
              <span>View 2026–2027 Award Ceremony</span>
              <span className="transition-transform duration-300 group-hover:translate-y-0.5 text-[#D4AF37]">↓</span>
            </button>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
