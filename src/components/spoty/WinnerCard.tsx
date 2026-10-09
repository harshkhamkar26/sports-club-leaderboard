import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import type { AthleteProfile, Category } from './data';
import { imageVariants, winnerVariants, blurReveal } from './variants';

interface Props {
  category: Category;
  profile: AthleteProfile;
  /** winner reveal step: 'hidden' | 'announcing' | 'revealed' */
  reveal: 'hidden' | 'announcing' | 'revealed';
  isPrimary?: boolean;
}

/**
 * A digital trophy case. The athlete photograph dominates; mouse movement
 * produces a subtle, spring-driven parallax between image and layers —
 * premium cinematic depth, never a gaming tilt card.
 */
export default function WinnerCard({ category, profile, reveal, isPrimary = false }: Props) {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.6 });

  // Pointer → layer offsets (opposite directions for depth)
  const imgX = useTransform(sx, [-1, 1], [14, -14]);
  const imgY = useTransform(sy, [-1, 1], [8, -8]);
  const glowX = useTransform(sx, [-1, 1], [-24, 24]);
  const glowY = useTransform(sy, [-1, 1], [-16, 16]);
  const labelX = useTransform(sx, [-1, 1], [6, -6]);

  const [inView, setInView] = useState(false);

  const categoryLabel =
    category === 'sportsman' ? 'Sportsman of the Year' : 'Sportswoman of the Year';
  const atmosphere =
    category === 'sportsman'
      ? 'rgba(59,130,246,0.5)'   // electric blue
      : 'rgba(120,60,220,0.45)'; // ultraviolet

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reducedMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onViewportEnter={() => setInView(true)}
      initial="hidden"
      animate={inView || reveal !== 'hidden' ? 'visible' : 'hidden'}
      variants={blurReveal}
      whileHover={reducedMotion ? undefined : { scale: 1.008 }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-[#0c0c0d] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
      aria-label={`${categoryLabel}: ${profile.name}`}
    >
      {/* Athlete image — cinematic full bleed with parallax */}
      <div className="relative h-[440px] sm:h-[520px] md:h-[640px] lg:h-[720px] overflow-hidden">
        <motion.img
          src={profile.photoUrl}
          alt={profile.name}
          style={{ x: imgX, y: imgY, scale: 1.12 }}
          variants={imageVariants}
          initial="hidden"
          animate={reveal !== 'hidden' ? 'visible' : 'hidden'}
          className="h-full w-full object-cover object-top [filter:grayscale(0.3)]"
          loading={isPrimary ? 'eager' : 'lazy'}
          decoding="async"
        />

        {/* Foreground lighting + gradient for depth */}
        <motion.div style={{ x: glowX, y: glowY }} className="absolute inset-0">
          <div
            className="absolute -top-24 left-1/2 h-64 w-[130%] -translate-x-1/2 opacity-40 blur-3xl"
            style={{ background: `radial-gradient(closest-side, ${atmosphere}, transparent)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
        </motion.div>

        {/* Winner spotlight overlay */}
        <AnimatePresence>
          {reveal === 'revealed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 opacity-25"
                style={{ background: `radial-gradient(ellipse at 50% 42%, ${atmosphere}, transparent 70%)` }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content stack */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 md:p-10">
          <motion.p
            style={{ x: labelX }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#D4AF37]"
          >
            {categoryLabel}
          </motion.p>

          <h2 className="mt-2 sm:mt-3 font-display text-[clamp(1.75rem,5vw,4.5rem)] font-black uppercase leading-none text-white [text-shadow:0_20px_60px_rgba(0,0,0,0.8)] break-words">
            {profile.name}
          </h2>

          <p className="mt-2 sm:mt-3 font-sans text-xs sm:text-sm font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/60">
            {profile.sport}
            <span className="mx-2 sm:mx-3 text-white/25">•</span>
            {profile.className}
          </p>


          {/* Winner reveal — THE WINNER IS... */}
          <div className="mt-4 sm:mt-6 h-20 sm:h-24 md:h-28">
            <AnimatePresence mode="wait">
              {reveal === 'announcing' && (
                <motion.div
                  key="announce"
                  variants={blurReveal}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, filter: 'blur(6px)' }}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <span className="h-px w-6 sm:w-10 bg-[#D4AF37]" />
                  <p className="font-sans text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#D4AF37]">
                    The Winner Is
                  </p>
                </motion.div>
              )}

              {reveal === 'revealed' && (
                <motion.div
                  key="winner"
                  variants={winnerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap items-center gap-3 sm:gap-4"
                >
                  {/* Trophy emblem with light pulse */}
                  <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 shrink-0">
                    <motion.span
                      className="text-xl sm:text-2xl"
                      animate={reducedMotion ? undefined : { scale: [1, 1.12, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      🏆
                    </motion.span>
                    <motion.span
                      className="absolute inset-0 rounded-full border border-[#D4AF37]/50"
                      animate={reducedMotion ? undefined : { scale: [1, 1.6], opacity: [0.6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                  </span>
                  <div>
                    <p className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#D4AF37]">
                      Official Winner
                    </p>
                    <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/50">
                      2025 — 26 Season
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom stat strip inside trophy case */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06] bg-white/[0.015]">
        {[
          { value: profile.events, label: 'Events' },
          { value: profile.podiums, label: 'Podiums' },
          { value: profile.golds, label: 'Gold' },
        ].map((s) => (
          <div key={s.label} className="px-2 sm:px-6 py-3 sm:py-4 text-center">
            <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-[#D4AF37]">
              {String(s.value).padStart(2, '0')}
            </span>
            <span className="mt-1 block font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/40 truncate">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

