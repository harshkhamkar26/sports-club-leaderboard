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
        aria-label="Universal AI University Sports Club Championship Intro"
      >
        {/* Live 3D WebGL Scene: Royal Navy Sky, 3D Gold Championship Trophy, Sunrise God Rays & Dynamic Track */}
        <div className="absolute inset-0 z-0">
          <InteractiveLandscape />
        </div>

        {/* Cinematic horizontal horizon beam */}
        {phase >= 1 && !reducedMotion && (
          <motion.div
            variants={beamVariants}
            initial="hidden"
            animate="visible"
            className="pointer-events-none absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#f5be38]/80 to-transparent"
          />
        )}

        {/* Top Floating Controls: Skip Intro */}
        <div className="relative z-20 flex w-full max-w-7xl items-center justify-end px-2">
          <button
            type="button"
            onClick={onComplete}
            className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-[#030a1c]/60 px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70 backdrop-blur-md transition-all hover:border-[#f5be38]/50 hover:bg-[#030a1c]/80 hover:text-[#f5be38] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5be38]"
            aria-label="Skip introduction and view winners"
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
            className="inline-flex flex-col items-center drop-shadow-[0_4px_16px_rgba(2,6,23,0.9)]"
          >
            <div className="flex items-center gap-2 rounded-full border border-[#f5be38]/30 bg-[#030a1c]/70 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(245,190,56,0.15)]">
              <span className="text-[#f5be38] text-xs">★</span>
              <p className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#f5be38]">
                UNIVERSAL AI UNIVERSITY
              </p>
              <span className="text-[#f5be38] text-xs">★</span>
            </div>
            <div className="mt-2.5 flex items-center gap-3">
              <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#f5be38]/40" />
              <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.4em] text-white/90">
                SPORTS CLUB • 2025–26
              </p>
              <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#f5be38]/40" />
            </div>
          </motion.div>
        </div>

        {/* Center / Lower Content: Motivational Championship Messaging & CTAs */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center mt-auto pb-4 sm:pb-8">
          {/* Main Championship Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.94 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            {isCustomTitle ? (
              <h1 className="font-display font-black uppercase leading-[0.92] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
                <span className="block text-[clamp(2.4rem,8vw,6.5rem)] tracking-tight text-white/95">
                  {title1}
                </span>
                <span className="block text-[clamp(1.6rem,5.5vw,4.5rem)] tracking-[0.08em] bg-gradient-to-r from-[#f5be38] via-[#fff4cc] to-[#f5be38] text-transparent bg-clip-text">
                  {title2}
                </span>
                <span className="block text-[clamp(1.2rem,4vw,3.2rem)] tracking-[0.18em] text-white/90">
                  {title3}
                </span>
              </h1>
            ) : (
              <div>
                <h1 className="font-display font-black uppercase tracking-tight text-[clamp(2.4rem,7.5vw,5.6rem)] leading-[0.95] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
                  <span className="block bg-gradient-to-b from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                    1,000 DREAMS.
                  </span>
                  <span className="block mt-1 bg-gradient-to-r from-[#f5be38] via-[#fff8db] to-[#d48f22] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,190,56,0.4)]">
                    ONE LEGACY.
                  </span>
                </h1>

                {/* Motivational Subheading */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 15 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mx-auto mt-4 max-w-2xl font-sans text-xs sm:text-sm md:text-base font-normal tracking-[0.16em] sm:tracking-[0.22em] text-[#dbeafe] drop-shadow-[0_4px_16px_rgba(2,6,23,0.95)]"
                >
                  Every athlete has a story. Every champion leaves a mark.
                </motion.p>
              </div>
            )}
          </motion.div>

          {/* Championship Actions */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 25 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-5"
          >
            {/* Primary Action: ENTER THE ARENA */}
            <Link
              href="/home"
              className="group relative flex w-full sm:w-auto min-w-[210px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#f5be38] via-[#ffd56b] to-[#d48f22] px-7 py-3.5 font-sans text-xs sm:text-sm font-extrabold uppercase tracking-[0.22em] text-[#030a1c] shadow-[0_0_30px_rgba(245,190,56,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(245,190,56,0.7)] active:scale-[0.98]"
            >
              <span>ENTER THE ARENA</span>
              <span className="material-symbols-outlined text-base font-bold transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>

            {/* Secondary Action: MEET THE ATHLETES */}
            <Link
              href="/athletes"
              className="group flex w-full sm:w-auto min-w-[210px] items-center justify-center gap-2.5 rounded-full border border-[#38bdf8]/40 bg-[#0a234f]/60 px-7 py-3.5 font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md shadow-[0_0_20px_rgba(14,39,79,0.5)] transition-all duration-300 hover:scale-[1.03] hover:border-[#f5be38]/70 hover:bg-[#154582]/80 hover:text-[#fff4cc] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-base text-[#38bdf8] transition-colors group-hover:text-[#f5be38]">
                group
              </span>
              <span>MEET THE ATHLETES</span>
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
              className="group flex items-center gap-2 font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white/70 transition-all hover:text-[#f5be38] focus:outline-none"
            >
              <span>View 2025–26 Winners & Ceremony</span>
              <span className="transition-transform duration-300 group-hover:translate-y-0.5 text-[#f5be38]">↓</span>
            </button>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
