import { useEffect, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import SpotyBackground from './SpotyBackground';
import SpotyIntro from './SpotyIntro';
import WinnerCard from './WinnerCard';
import AchievementStats from './AchievementStats';
import ChampionshipMoments from './ChampionshipMoments';
import { buildAthleteProfile, buildChampionshipMoments, type Category } from './data';
import { blurReveal, fadeIn, staggerContainer } from './variants';

interface Props {
  topAthlete: any;
  secondAthlete: any;
}

/** Controlled cinematic timeline (ms) for the landing sequence. */
const INTRO_TIMELINE = [
  { phase: 1, at: 350 },   // university identity
  { phase: 2, at: 1300 },  // 1,000 DREAMS. ONE LEGACY.
  { phase: 3, at: 2200 },  // Championship action buttons & ceremony reveal link
];

export default function SpotyPage({ topAthlete, secondAthlete }: Props) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Global pointer for background spotlight + parallax
  const pointerX = useMotionValue(-400);
  const pointerY = useMotionValue(-400);
  const spotlightX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const spotlightY = useSpring(pointerY, { stiffness: 60, damping: 20 });
  const bgMouseX = useSpring(pointerX, { stiffness: 50, damping: 22 });
  const bgMouseY = useSpring(pointerY, { stiffness: 50, damping: 22 });

  useEffect(() => {
    if (reducedMotion) {
      // Accessibility: skip the cinematic sequence — simple fade-in state.
      setPhase(8);
      setIntroDone(true);
      setRevealed(true);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    INTRO_TIMELINE.forEach((step) => {
      timers.push(
        setTimeout(() => {
          setPhase(step.phase);
        }, step.at)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  const handleEnterCeremony = () => {
    setIntroDone(true);
    setPhase(5);
    setTimeout(() => setPhase(6), 500);
    setTimeout(() => setPhase(7), 1000);
    setTimeout(() => {
      setPhase(8);
      setRevealed(true);
    }, 1500);
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [pointerX, pointerY]);

  // Data profiles — built through the existing rankings layer.
  const sportsman = buildAthleteProfile('sportsman', topAthlete);
  const sportswoman = buildAthleteProfile('sportswoman', secondAthlete);

  const revealState: Record<Category, 'hidden' | 'announcing' | 'revealed'> = {
    sportsman: revealed ? 'revealed' : phase >= 7 ? 'announcing' : 'hidden',
    sportswoman: revealed ? 'revealed' : phase >= 7 ? 'announcing' : 'hidden',
  };

  const stats = [
    { value: sportsman.totalPoints, label: 'Total Points', highlight: true },
    { value: sportsman.events, label: 'Events' },
    { value: sportsman.golds, label: 'Gold' },
    { value: sportsman.podiums, label: 'Podiums' },
  ];

  const moments = buildChampionshipMoments(topAthlete);

  return (
    <div className="relative z-10">
      <SpotyBackground
        mouseX={bgMouseX}
        mouseY={bgMouseY}
        spotlightX={spotlightX}
        spotlightY={spotlightY}
      />

      {/* Cinematic intro */}
      <AnimatePresence mode="wait">
        {!introDone && (
          <SpotyIntro
            phase={phase}
            onComplete={handleEnterCeremony}
          />
        )}
      </AnimatePresence>
      {/* Award environment */}
      {introDone && (
        <main className="relative">
          {/* Award stage — two digital trophy cases */}
          <section className="mx-auto w-full max-w-6xl px-6 pt-24 md:px-10" aria-label="Award winners">
            <motion.div
              variants={staggerContainer(0.22)}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.p
                variants={blurReveal}
                className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.5em] text-[#D4AF37]"
              >
                Universal AI University Sports Club
              </motion.p>
              <motion.h1
                variants={blurReveal}
                className="mt-4 font-display text-[clamp(2.6rem,9vw,7.5rem)] font-black uppercase leading-[0.9] text-white"
              >
                Sports Person
                <span className="block text-[clamp(1.4rem,4.5vw,3.6rem)] font-semibold tracking-[0.15em] text-white/70">
                  Of the Year
                </span>
              </motion.h1>
              <motion.div variants={blurReveal} className="mt-6 flex items-center justify-center gap-4">
                <span className="h-px w-16 bg-[#D4AF37]/50" />
                <span className="font-display text-xl font-light tracking-[0.3em] text-[#D4AF37]">
                  2026 — 2027
                </span>
                <span className="h-px w-16 bg-[#D4AF37]/50" />
              </motion.div>
            </motion.div>

            {/* Winner cards */}
            <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:gap-8">
              <WinnerCard
                category="sportsman"
                profile={sportsman}
                reveal={revealState.sportsman}
                isPrimary
              />
              <WinnerCard
                category="sportswoman"
                profile={sportswoman}
                reveal={revealState.sportswoman}
              />
            </div>
          </section>

          {/* Statistics — real data, animated on viewport entry */}
          <AchievementStats stats={stats} />

          {/* Championship moments timeline */}
          <ChampionshipMoments moments={moments} />

          {/* Legacy — closing statement */}
          <motion.section
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-8 text-center md:px-10"
          >
            <div className="mx-auto h-px w-24 bg-[#D4AF37]/30" />
            <p className="mt-10 font-display text-2xl md:text-3xl font-light uppercase tracking-[0.2em] text-white/70">
              Excellence <span className="text-[#D4AF37]">•</span> Dedication{" "}
              <span className="text-[#D4AF37]">•</span> Legacy
            </p>
            <p className="mt-4 font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-white/35">
              The Moment of Greatness — 2026 / 2027
            </p>
          </motion.section>
        </main>
      )}
    </div>
  );
}

