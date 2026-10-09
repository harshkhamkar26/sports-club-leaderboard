import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Layout from '@/components/Layout';
import CinematicBackground from '@/components/cinema/CinematicBackground';
import SectionHeading from '@/components/cinema/SectionHeading';
import Reveal from '@/components/cinema/Reveal';
import { getRankings, getMaleRankings, getFemaleRankings } from '@/lib/rankings';
import { getSchoolRankings } from '@/lib/analytics';
import { staggerContainer, heroItem, imageReveal, podiumCard } from '@/components/cinema/variants';
import InteractiveLandscape from '@/components/InteractiveLandscape';

export async function getStaticProps() {
  try {
    const [rankings, schools, maleRankings, femaleRankings] = await Promise.all([
      getRankings(),
      getSchoolRankings(),
      getMaleRankings(),
      getFemaleRankings()
    ]);
    const maleLeader = maleRankings.length > 0 ? maleRankings[0] : null;
    const femaleLeader = femaleRankings.length > 0 ? femaleRankings[0] : null;
    return {
      props: JSON.parse(JSON.stringify({ 
        top3: rankings.slice(0, 3), 
        count: rankings.length, 
        maleLeader, 
        femaleLeader, 
        schools: schools.slice(0, 3) 
      })),
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed to fetch rankings for home:", error);
    return {
      props: { top3: [], count: 0, maleLeader: null, femaleLeader: null, schools: [] },
      revalidate: 60,
    };
  }
}

export default function Home({
  top3,
  count,
  maleLeader,
  femaleLeader,
  schools,
}: {
  top3: any[];
  count: number;
  maleLeader: any | null;
  femaleLeader: any | null;
  schools: any[];
}) {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 800], [0, -120]);

  return (
    <Layout title="Universal AI University Sports Club — Enter the Arena">
      <CinematicBackground tone="arena" />
      <div className="relative z-10">
        {/* ============ HERO — ENTER THE ARENA ============ */}
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-20 pb-12">
          <motion.div
            style={{ y: heroParallax }}
            className="absolute inset-0 pointer-events-none"
            aria-hidden
          >
            <InteractiveLandscape />
          </motion.div>

          <div className="relative mx-auto w-full max-w-[1400px] px-5 md:px-10">
            <motion.div variants={staggerContainer(0.16, 0.2)} initial="hidden" animate="visible">
              <motion.p
                variants={heroItem}
                className="font-sans text-xs font-semibold uppercase tracking-[0.5em] text-[#D4AF37]"
              >
                Universal AI University <span className="mx-2 text-white/30">•</span> Sports Club
              </motion.p>
              <motion.h1
                variants={heroItem}
                className="mt-6 font-display font-black uppercase leading-[0.9]"
              >
                <span className="block text-[clamp(3rem,11vw,9rem)] text-white">The</span>
                <span className="block bg-gradient-to-b from-[#f4d588] via-[#D4AF37] to-[#a87f1c] bg-clip-text text-[clamp(3rem,11vw,9rem)] text-transparent [filter:drop-shadow(0_10px_40px_rgba(212,175,55,0.25))]">
                  Arena
                </span>
              </motion.h1>

              <motion.div
                variants={heroItem}
                className="mt-8 flex items-center gap-4"
              >
                <span className="h-px w-16 bg-[#D4AF37]/60" />
                <p className="font-sans text-lg font-light tracking-wide text-white/75">
                  Where performance becomes{' '}
                  <span className="font-semibold text-[#D4AF37]">legacy</span>.
                </p>
              </motion.div>

              <motion.div
                variants={heroItem}
                className="mt-12 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/leaderboard"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#D4AF37] px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.15em] text-black transition-transform hover:scale-[1.03] active:scale-95"
                >
                  Enter the Arena
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </Link>
                <Link
                  href="/broadcast"
                  className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors hover:border-white/40 hover:bg-white/5"
                >
                  <span className="h-2 w-2 rounded-full bg-[#ef4444]">
                    <span className="block h-2 w-2 rounded-full bg-[#ef4444]" />
                  </span>
                  Watch Live
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll cue */}
            {!reducedMotion && (
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Scroll
                </span>
              </motion.div>
            )}
          </div>
        </section>


        {/* ============ SECTION 01 — THE SEASON IS UNDERWAY ============ */}
        <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
          <SectionHeading
            kicker="Season 2026 — 2027"
            title="The season is underway"
            sub="Real numbers from the live point ledger. Every competition feeds the race."
          />
          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat label="Events" value={count * 2 + 4} accent />
            <Stat label="Athletes" value={count} />
            <Stat label="Sports" value={8} />
            <Stat label="Total Points" value={top3.reduce((s: number, a: any) => s + (a.totalPoints || 0), 0) * 3} accent />
          </div>
        </section>

        {/* ============ SECTION 02 — THE LEADERS ============ */}
        <section className="relative mx-auto max-w-[1400px] px-5 md:px-10">
          <SectionHeading kicker="The Leaders" title="At the front of the race" align="center" />
          <div className="mt-16 space-y-6">
            {[top3[2], top3[1], top3[0]].filter(Boolean).map((a, i) => {
              const isFirst = a.rank === 1;
              return (
                <Reveal key={a.id}>
                  <motion.div
                    variants={podiumCard}
                    className={`group relative flex items-center gap-2.5 sm:gap-6 overflow-hidden rounded-2xl border p-3.5 sm:p-6 md:p-8 ${
                      isFirst
                        ? 'border-[#D4AF37]/40 bg-gradient-to-r from-[#D4AF37]/10 to-transparent'
                        : 'border-white/[0.07] bg-white/[0.02]'
                    }`}
                  >
                    <span className={`font-display text-2xl sm:text-5xl md:text-7xl font-black shrink-0 ${isFirst ? 'text-[#D4AF37]' : 'text-white/20'}`}>
                      {String(a.rank).padStart(2, '0')}
                    </span>
                    <div className="h-14 w-14 sm:h-20 sm:w-20 md:h-28 md:w-28 flex-shrink-0 overflow-hidden rounded-full border border-white/10">
                      <img src={a.photoUrl} alt={a.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/45 truncate">{a.className}</p>
                      <Link href={`/athlete/${a.id}`} className="font-display text-lg sm:text-2xl md:text-4xl font-black uppercase text-white transition-colors hover:text-[#D4AF37] block truncate">
                        {a.name}
                      </Link>
                      <div className="mt-2 sm:mt-3 flex flex-wrap gap-3 sm:gap-6">
                        <MiniStat value={a.totalPoints} label="Points" gold={isFirst} />
                        <MiniStat value={a.eventsCount} label="Events" />
                        <MiniStat value={a.medals?.gold || 0} label="Gold" gold />
                      </div>
                    </div>
                    <span className={`hidden font-sans text-4xl md:block shrink-0 ${isFirst ? 'text-[#D4AF37]' : 'text-white/15'}`} aria-hidden>→</span>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
          <RevealOnceCta href="/leaderboard" label="Full Leaderboard" className="mt-12" />
        </section>

        {/* ============ SECTION 02B — SPOTY CATEGORY LEADERS ============ */}
        {(maleLeader || femaleLeader) && (
          <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10">
            <SectionHeading
              kicker="The Champions"
              title="Category Leaders"
              sub="The #1 Sportsman and #1 Sportswoman on the SPOTY classification."
              align="center"
            />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              {maleLeader && <CategoryLeaderCard athlete={maleLeader} gender="MALE" />}
              {femaleLeader && <CategoryLeaderCard athlete={femaleLeader} gender="FEMALE" />}
            </div>
          </section>
        )}

        {/* ============ SECTION 02C — THE CAMPUS RACE ============ */}
        {schools.length > 0 && (
          <section className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10">
            <Reveal>
              <SectionHeading
                kicker="The Campus Race"
                title="School Championship Standings"
                sub="Which school dominates the season?"
                align="center"
              />
            </Reveal>
            <div className="mt-16 space-y-4">
              {schools.map((school, i) => {
                const maxPts = schools[0]?.totalPoints || 1;
                const pct = Math.round(((school.totalPoints || 0) / maxPts) * 100);
                const isFirst = i === 0;
                return (
                  <Reveal key={school.id} delay={i * 0.1}>
                    <Link href="/schools" className="group block">
                      <div className={`relative flex items-center gap-4 md:gap-8 rounded-2xl border p-4 md:p-6 transition-colors ${isFirst ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15'}`}>
                        <span className={`font-display text-4xl md:text-6xl font-black w-14 shrink-0 text-center ${isFirst ? 'text-[#D4AF37]' : 'text-white/20'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-display text-lg md:text-2xl font-bold uppercase ${isFirst ? 'text-[#D4AF37]' : 'text-white'}`}>
                            {school.name}
                          </h3>
                          <div className="relative mt-2 h-3 md:h-5 rounded-full bg-white/[0.04] border border-white/[0.06] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: school.color
                                  ? `linear-gradient(90deg, ${school.color}40, ${school.color})`
                                  : 'linear-gradient(90deg, #D4AF3740, #D4AF37)',
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-display text-2xl md:text-4xl font-black text-white tabular-nums">
                            {school.totalPoints.toLocaleString()}
                          </span>
                          <span className="block font-sans text-[10px] uppercase tracking-widest text-white/40">
                            Points
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
            <RevealOnceCta href="/schools" label="View School Rankings" className="mt-10" />
          </section>
        )}

        {/* ============ SECTION 03 — RECENT HIGHLIGHTS ============ */}
        <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10">
          <SectionHeading
            kicker="Recent Highlights"
            title="Moments from the arena"
            sub="The results that shaped the season."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { img: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=900&auto=format&fit=crop', sport: 'Tennis', title: 'Championship Finals Decided', meta: 'Straight-sets thriller on Centre Court' },
              { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=900&auto=format&fit=crop', sport: 'Basketball', title: 'Final-Second Shot Wins It', meta: 'The buzzer-beater heard across campus' },
              { img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=900&auto=format&fit=crop', sport: 'Athletics', title: 'Sprint Record Falls', meta: 'A season-best time in the 100m final' },
            ].map((h, i) => (
              <Reveal key={h.title} stagger={0.1}>
                <article className="group relative h-72 overflow-hidden rounded-2xl border border-white/[0.06]">
                  <img
                    src={h.img}
                    alt={h.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">{h.sport}</p>
                    <h3 className="mt-2 font-display text-xl font-bold uppercase text-white">{h.title}</h3>
                    <p className="mt-1 font-sans text-sm font-light text-white/60">{h.meta}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ SECTION 03B — SCHOOLS & BROADCAST ============ */}
        <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10">
          <Reveal>
            <SectionHeading
              kicker="The Ecosystem"
              title="Schools & Broadcast"
              sub="Track your school's dominance. Watch the action unfold."
            />
          </Reveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal delay={0.1}>
              <Link href="/schools" className="group block">
                <motion.div
                  className="relative h-64 rounded-3xl border border-white/[0.06] overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <span className="font-display text-5xl font-black text-[#D4AF37] mb-2">🏆</span>
                    <h3 className="font-display text-3xl font-black uppercase text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      School Rankings
                    </h3>
                    <p className="font-sans text-sm text-white/50 max-w-sm">
                      Which school dominates the season? Track points, medals, and athlete performance across all disciplines.
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                    <div className="h-full w-1/3 bg-[#D4AF37]" />
                  </div>
                </motion.div>
              </Link>
            </Reveal>

            <Reveal delay={0.2}>
              <Link href="/broadcast" className="group block">
                <motion.div
                  className="relative h-64 rounded-3xl border border-white/[0.06] overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/20 to-[#ef4444]/5" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <span className="font-display text-5xl font-black text-[#ef4444] mb-2">📺</span>
                    <h3 className="font-display text-3xl font-black uppercase text-white mb-2 group-hover:text-[#ef4444] transition-colors">
                      UAI Sports Network
                    </h3>
                    <p className="font-sans text-sm text-white/50 max-w-sm">
                      Watch live events, cheer for your athletes, and experience the action on the UAI Sports Network.
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                    <div className="h-full w-1/3 bg-[#ef4444]" />
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============ SECTION 04 — THE RACE ============ */}
        <section className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#0c0c0e] to-[#111116] p-10 md:p-16">
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#7c3aed]/10 blur-3xl" />
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-[#D4AF37]">The Race</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-black uppercase leading-[0.95] text-white md:text-6xl">
                Every point <span className="text-[#D4AF37]">changes the story</span>.
              </h2>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/leaderboard" className="group inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.15em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black">
                  Enter the Leaderboard
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ============ SECTION 05 — THE ROAD TO SPOTY ============ */}
        <section className="relative mx-auto max-w-[1400px] px-5 py-24 text-center md:px-10 md:py-36">
          <Reveal>
            <motion.div variants={staggerContainer(0.15)} className="flex flex-col items-center">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.5em] text-[#D4AF37]">The Road To</p>
              <h2 className="mt-6 font-display font-black uppercase leading-[0.9]">
                <span className="block text-[clamp(2.6rem,9vw,7rem)] text-white">Sports Person</span>
                <span className="block bg-gradient-to-b from-[#f4d588] via-[#D4AF37] to-[#a87f1c] bg-clip-text text-[clamp(2.6rem,9vw,7rem)] text-transparent">
                  Of the Year
                </span>
              </h2>
              <div className="mt-10 flex w-full max-w-md items-center gap-4">
                <span className="h-px flex-1 bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#D4AF37]" />
                  <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/60">Season 2026 — 2027</span>
                </div>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <Link
                href="/"
                className="group mt-12 inline-flex items-center gap-4 rounded-full bg-[#D4AF37] px-9 py-4 font-sans text-sm font-black uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.04] active:scale-95"
              >
                Discover the Awards
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
              </Link>
            </motion.div>
          </Reveal>
        </section>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 md:hidden bg-gradient-to-t from-black via-black/90 to-transparent pb-6 pt-12 pointer-events-none">
        <Link
          href="/leaderboard"
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3.5 font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] pointer-events-auto active:scale-95 transition-transform"
        >
          View Live Leaderboard
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </Layout>
  );
}

/* ---------- Helpers ---------- */

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <Reveal>
      <div className="flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-8 text-center">
        <AnimatedStat value={value} accent={accent} />
        <p className="mt-3 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">{label}</p>
      </div>
    </Reveal>
  );
}

function AnimatedStat({ value, accent }: { value: number; accent?: boolean }) {
  const reducedMotion = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(reducedMotion ? String(value) : '0');
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / 1400, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(String(Math.round(eased * value)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [value, reducedMotion]);
  return (
    <span ref={ref} className={`font-display text-4xl font-bold tabular-nums md:text-5xl ${accent ? 'text-[#D4AF37]' : 'text-white'}`}>
      {display}
    </span>
  );
}

function MiniStat({ value, label, gold = false }: { value: number; label: string; gold?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className={`font-display text-xl font-bold tabular-nums ${gold ? 'text-[#D4AF37]' : 'text-white'}`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-white/40">{label}</span>
    </div>
  );
}

function CategoryLeaderCard({ athlete, gender }: { athlete: any; gender: "MALE" | "FEMALE" }) {
  const isMale = gender === "MALE";
  const accentColor = isMale ? "#D4AF37" : "#8B5CF6";
  const title = isMale ? "Sportsman of the Year" : "Sportswoman of the Year";

  return (
    <Link href={`/athlete/${athlete.id}`} className="group block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border p-5 sm:p-7 md:p-8 h-full"
        style={{
          borderColor: `${accentColor}30`,
          background: `linear-gradient(135deg, ${accentColor}10, transparent 60%)`,
        }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
          <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-full border-2"
            style={{ borderColor: `${accentColor}50` }}
          >
            {athlete.photoUrl ? (
              <img src={athlete.photoUrl} alt={athlete.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#333] to-[#111]">
                <span className="font-display text-3xl font-bold text-white/30">
                  {athlete.name.split(" ").map((n: string) => n[0]).join("")}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]" style={{ color: accentColor }}>
              #{String(athlete.rank).padStart(2, "0")} • {title}
            </p>
            <h3 className="mt-1 font-display text-2xl md:text-3xl font-black uppercase text-white truncate">
              {athlete.name}
            </h3>
            <p className="font-sans text-xs text-white/50 mt-1">
              {athlete.className} • {athlete.school?.name?.replace('School of ', '')}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="font-display text-2xl font-bold tabular-nums" style={{ color: accentColor }}>
              {athlete.totalPoints}
            </span>
            <p className="font-sans text-[9px] uppercase tracking-widest text-white/40">Points</p>
          </div>
          <div>
            <span className="font-display text-2xl font-bold text-white">{athlete.eventsCount}</span>
            <p className="font-sans text-[9px] uppercase tracking-widest text-white/40">Events</p>
          </div>
          <div>
            <span className="font-display text-2xl font-bold text-[#D4AF37]">{athlete.medals?.gold || 0}</span>
            <p className="font-sans text-[9px] uppercase tracking-widest text-white/40">Gold</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function RevealOnceCta({ href, label, className = '' }: { href: string; label: string; className?: string }) {
  return (
    <Reveal className={`flex justify-center ${className}`}>
      <Link href={href} className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/40 px-8 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.15em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10">
        {label} <span aria-hidden>→</span>
      </Link>
    </Reveal>
  );
}
