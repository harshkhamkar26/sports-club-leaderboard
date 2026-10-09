import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Layout from '@/components/Layout';
import CinematicBackground from '@/components/cinema/CinematicBackground';
import Reveal from '@/components/cinema/Reveal';
import { getRankings } from '@/lib/rankings';

export async function getStaticProps() {
  try {
    const rankings = await getRankings();
    return {
      props: { initialRankings: JSON.parse(JSON.stringify(rankings)) },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed to fetch rankings for leaderboard:", error);
    return {
      props: { initialRankings: [] },
      revalidate: 60,
    };
  }
}

export default function Leaderboard({ initialRankings }: { initialRankings: any[] }) {
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  
  const rankings = useMemo(() => {
    return initialRankings.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchesSchool = schoolFilter === 'All' || s.school?.name === schoolFilter;
      const matchesGender = genderFilter === 'All' 
        || (genderFilter === 'Men' && s.gender?.toUpperCase() === 'MALE')
        || (genderFilter === 'Women' && s.gender?.toUpperCase() === 'FEMALE');
      return matchesSearch && matchesSchool && matchesGender;
    });
  }, [initialRankings, search, schoolFilter, genderFilter]);

  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);

  const schools = useMemo(() => {
    const uniqueSchools = Array.from(new Set(initialRankings.map(s => s.school?.name).filter(Boolean)));
    return ['All', ...uniqueSchools.sort()];
  }, [initialRankings]);

  return (
    <Layout title="Leaderboard — The Race For Glory">
      <CinematicBackground tone="race" />
      
      <div className="relative z-10 w-full min-h-screen pt-32 pb-24 px-5 md:px-10">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center">
          
          {/* HERO */}
          <Reveal className="text-center mb-20">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.5em] text-[#D4AF37] mb-4">Leaderboard</p>
            <h1 className="font-display text-5xl md:text-7xl font-black uppercase text-white tracking-tight drop-shadow-2xl">
              The Race For Glory
            </h1>
            <p className="mt-4 font-sans text-sm font-light text-white/50 tracking-widest uppercase">
              "Every point changes the story."
            </p>
          </Reveal>

          {/* TOP 3 PODIUM */}
          {top3.length > 0 && (
            <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-end gap-6 md:gap-8 mb-16 md:mb-24 h-auto md:h-[500px]">
              
              {/* 3rd Place */}
              {top3[2] && (
                <div className="w-full md:w-1/3 order-3 md:order-3">
                  <PodiumCard athlete={top3[2]} rank={3} delay={0} />
                </div>
              )}
              
              {/* 1st Place */}
              {top3[0] && (
                <div className="w-full md:w-1/3 order-1 md:order-2">
                  <PodiumCard athlete={top3[0]} rank={1} delay={0.4} />
                </div>
              )}
              
              {/* 2nd Place */}
              {top3[1] && (
                <div className="w-full md:w-1/3 order-2 md:order-1">
                  <PodiumCard athlete={top3[1]} rank={2} delay={0.2} />
                </div>
              )}

            </div>
          )}

          {/* FILTERS */}
          <Reveal delay={0.6} className="w-full mb-12">
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl p-4 gap-4">
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">search</span>
                  <input
                    type="text"
                    placeholder="SEARCH ATHLETE..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm font-sans uppercase text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                  />
                </div>

                <div className="flex bg-black/40 border border-white/10 rounded-full p-1 shrink-0 justify-center">
                  {['All', 'Men', 'Women'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setGenderFilter(gender)}
                      className={`px-4 sm:px-5 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all ${
                        genderFilter === gender
                          ? 'bg-white/10 text-white'
                          : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto overflow-hidden">
                <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 hide-scrollbar">
                  {schools.map(s => (
                    <button
                      key={s}
                      onClick={() => setSchoolFilter(s)}
                      className={`whitespace-nowrap px-4 sm:px-6 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${
                        schoolFilter === s 
                          ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                          : 'bg-black/40 text-white/50 border border-white/10 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {s === 'All' ? 'All Schools' : s.replace('School of ', '')}
                    </button>
                  ))}
                </div>
                <Link
                  href="/schools"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/20 shrink-0 text-center"
                >
                  <span className="material-symbols-outlined text-sm">school</span>
                  School Rankings
                </Link>
              </div>
            </div>
          </Reveal>

          {/* RANKING LIST */}
          <div className="w-full flex flex-col gap-3">
            <div className="grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-3 border-b border-white/10 font-sans text-[10px] uppercase tracking-widest text-white/30 font-bold">
              <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
              <div className="col-span-6 sm:col-span-5 md:col-span-4">Athlete</div>
              <div className="col-span-3 hidden md:block">School / House</div>
              <div className="col-span-4 sm:col-span-3 md:col-span-2 text-right sm:text-center">Points</div>
              <div className="col-span-3 md:col-span-2 hidden sm:block text-center">Medals</div>
            </div>

            <LayoutGroup>
              <AnimatePresence>
                {rest.map((athlete) => (
                  <LeaderboardRow key={athlete.id} athlete={athlete} />
                ))}
                {rest.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center font-sans text-sm uppercase tracking-widest text-white/40"
                  >
                    No athletes found in the arena.
                  </motion.div>
                )}
              </AnimatePresence>
            </LayoutGroup>
          </div>

        </div>
      </div>
    </Layout>
  );
}

function PodiumCard({ athlete, rank, delay }: { athlete: any, rank: number, delay: number }) {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;
  
  const heightClass = isFirst ? 'h-auto min-h-[340px] md:h-[480px]' : isSecond ? 'h-auto min-h-[300px] md:h-[400px]' : 'h-auto min-h-[280px] md:h-[360px]';
  const rankColor = isFirst ? 'text-[#D4AF37]' : isSecond ? 'text-[#e2e8f0]' : 'text-[#b45309]';
  const rankBorder = isFirst ? 'border-[#D4AF37]/50' : isSecond ? 'border-white/30' : 'border-[#b45309]/50';
  const glowClass = isFirst ? 'shadow-[0_0_40px_rgba(212,175,55,0.15)]' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, type: 'spring', damping: 20 }}
      className={`relative w-full rounded-3xl overflow-hidden border bg-[#111] group flex flex-col justify-end ${heightClass} ${rankBorder} ${glowClass}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src={athlete.photoUrl || `https://images.unsplash.com/photo-${isFirst ? '1552674605-db6ffd4facb5' : isSecond ? '1519861531473-9200262188bf' : '1546519638-68e109498ffc'}?q=80&w=800&auto=format&fit=crop`} 
          alt={athlete.name}
          className="w-full h-full object-cover object-top opacity-50 grayscale mix-blend-luminosity group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent`} />
      </div>

      <div className="relative z-10 p-5 sm:p-6 flex flex-col items-center text-center">
        <span className={`font-display text-4xl sm:text-5xl md:text-7xl font-black ${rankColor} drop-shadow-lg mb-1 sm:mb-2`}>
          {rank}
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-wide mb-1">
          {athlete.name}
        </h3>
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4">
          {athlete.className} • {athlete.school?.name?.replace('School of ', '')}
        </p>
        <div className="w-full grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
          <div>
            <div className="font-display text-xl sm:text-2xl font-bold text-white">{athlete.totalPoints}</div>
            <div className="font-sans text-[9px] uppercase tracking-widest text-white/40">Points</div>
          </div>
          <div>
            <div className="font-display text-xl sm:text-2xl font-bold text-white">{athlete.eventsCount}</div>
            <div className="font-sans text-[9px] uppercase tracking-widest text-white/40">Events</div>
          </div>
        </div>
      </div>
      
      {isFirst && (
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#D4AF37]/20 to-transparent pointer-events-none mix-blend-overlay" />
      )}
    </motion.div>
  );
}

function LeaderboardRow({ athlete }: { athlete: any }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/athlete/${athlete.id}`} className="group relative block w-full bg-[#111]/40 hover:bg-[#111] border border-white/[0.04] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-sm">
        
        {/* Hover Highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative grid grid-cols-12 gap-2 sm:gap-4 items-center px-4 sm:px-6 py-4 sm:py-5">
          {/* Rank */}
          <div className="col-span-2 sm:col-span-1 text-center">
            <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white/40 group-hover:text-white transition-colors">
              {String(athlete.rank).padStart(2, '0')}
            </span>
          </div>

          {/* Athlete */}
          <div className="col-span-6 sm:col-span-5 md:col-span-4 flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-white/10 overflow-hidden border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors">
              {athlete.photoUrl ? (
                <img src={athlete.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#333] to-[#111] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/30 text-sm">person</span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display text-xs sm:text-sm md:text-base font-bold uppercase text-white tracking-wide group-hover:text-[#D4AF37] transition-colors truncate">
                {athlete.name}
              </div>
              <div className="font-sans text-[9px] sm:text-[10px] uppercase tracking-widest text-white/40 truncate">
                {athlete.rollNumber}
              </div>
              {/* Mobile medals badge shown on mobile when medals column hidden */}
              <div className="sm:hidden flex items-center gap-1.5 mt-1 text-[10px]">
                {athlete.medals.gold > 0 && <span className="text-[#D4AF37]">🥇{athlete.medals.gold}</span>}
                {athlete.medals.silver > 0 && <span className="text-[#e2e8f0]">🥈{athlete.medals.silver}</span>}
                {athlete.medals.bronze > 0 && <span className="text-[#b45309]">🥉{athlete.medals.bronze}</span>}
              </div>
            </div>
          </div>

          {/* School / House */}
          <div className="col-span-3 hidden md:flex flex-col justify-center min-w-0">
            <div className="font-sans text-xs font-semibold uppercase text-white/70 truncate">
              {athlete.className}
            </div>
            <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 truncate">
              {athlete.school?.name}
            </div>
          </div>

          {/* Points */}
          <div className="col-span-4 sm:col-span-3 md:col-span-2 flex flex-col items-end sm:items-center justify-center">
            <div className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
              {athlete.totalPoints}
            </div>
            <span className="sm:hidden font-sans text-[9px] uppercase tracking-widest text-white/40">pts</span>
          </div>

          {/* Medals */}
          <div className="col-span-3 md:col-span-2 hidden sm:flex items-center justify-center gap-2">
             <div className="flex items-center gap-1">
               <span className="text-[#D4AF37] text-sm">🥇</span>
               <span className="font-display text-sm font-bold text-white/80">{athlete.medals.gold}</span>
             </div>
             <div className="flex items-center gap-1">
               <span className="text-[#e2e8f0] text-sm">🥈</span>
               <span className="font-display text-sm font-bold text-white/80">{athlete.medals.silver}</span>
             </div>
             <div className="flex items-center gap-1">
               <span className="text-[#b45309] text-sm">🥉</span>
               <span className="font-display text-sm font-bold text-white/80">{athlete.medals.bronze}</span>
             </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
