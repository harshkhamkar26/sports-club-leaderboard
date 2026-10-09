import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getSportRankings } from '@/lib/rankings';
import { prisma } from '@/lib/prisma';
import { motion } from 'framer-motion';
import Avatar from '@/components/Avatar';
import AnimatedCounter from '@/components/AnimatedCounter';
import CinematicBackground from '@/components/cinema/CinematicBackground';
import Reveal from '@/components/cinema/Reveal';

export async function getServerSideProps(context: any) {
  const sportId = context.params?.id as string;
  
  try {
    const sport = await prisma.sport.findUnique({
      where: { id: sportId },
      include: {
        events: true,
      }
    });

    if (!sport) {
      return { notFound: true };
    }

    const rankings = await getSportRankings(sport.id);
    const top3 = rankings.slice(0, 3);
    const totalAthletes = rankings.length;
    const totalPoints = rankings.reduce((sum, r) => sum + r.totalPoints, 0);

    return { 
      props: { 
        sport: JSON.parse(JSON.stringify(sport)),
        top3: JSON.parse(JSON.stringify(top3)),
        rankings: JSON.parse(JSON.stringify(rankings)),
        totalAthletes,
        totalPoints
      } 
    };
  } catch (error) {
    console.error("Failed to fetch sport details:", error);
    return { notFound: true };
  }
}

export default function SportDetail({ sport, top3, rankings, totalAthletes, totalPoints }: any) {
  const rank1 = top3[0] || null;
  const rank2 = top3[1] || null;
  const rank3 = top3[2] || null;

  return (
    <Layout title={`${sport.name} - UAI Sports Directory`}>
      <CinematicBackground tone="arena" />
      
      <div className="relative z-10 w-full min-h-screen pt-32 pb-24 px-5 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          
          {/* Hero */}
          <Reveal className="text-center mb-12 sm:mb-16">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#D4AF37] mb-3 sm:mb-4">
              Sport Profile
            </p>
            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-black uppercase text-white tracking-tight drop-shadow-2xl break-words">
              {sport.icon && <span className="mr-3 sm:mr-4 material-symbols-outlined align-middle">{sport.icon}</span>}
              {sport.name}
            </h1>
            <p className="mt-3 sm:mt-4 font-sans text-xs sm:text-sm font-light text-white/50 tracking-widest uppercase">
              {sport.gender === 'MIXED' ? 'Mixed Category' : sport.gender === 'MEN' ? "Men's Category" : sport.gender === 'WOMEN' ? "Women's Category" : 'Open Category'}
            </p>
          </Reveal>

          {/* Key Stats */}
          <Reveal delay={0.1} className="mb-12 sm:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-[#111]/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 text-center">
                <div className="font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Total Athletes</div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white">
                  <AnimatedCounter value={totalAthletes} />
                </div>
              </div>
              <div className="bg-[#111]/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 text-center">
                <div className="font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Total Events</div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white">
                  <AnimatedCounter value={sport.events.length} />
                </div>
              </div>
              <div className="bg-[#111]/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)] text-center">
                <div className="font-sans text-xs uppercase tracking-widest text-[#D4AF37]/80 mb-2">Total Points Awarded</div>
                <div className="font-display text-3xl sm:text-4xl font-bold text-[#D4AF37]">
                  <AnimatedCounter value={totalPoints} />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Podium */}
          {totalAthletes > 0 ? (
            <Reveal delay={0.2} className="mb-16 sm:mb-20">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase text-center mb-8 sm:mb-10">Top Performers</h2>
              <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 sm:gap-4 md:gap-8 min-h-[300px]">
                {/* 1st Place (First on mobile stack) */}
                {rank1 && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center order-1 md:order-2 z-20">
                    <Link href={`/athlete/${rank1.id}`}>
                      <Avatar photoUrl={rank1.photoUrl} name={rank1.name} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-3 sm:mb-4 hover:scale-110 transition-transform cursor-pointer" />
                    </Link>
                    <div className="bg-gradient-to-t from-[#111] to-[#D4AF37]/20 border border-[#D4AF37]/50 w-36 sm:w-40 h-36 sm:h-40 md:h-52 rounded-t-lg flex flex-col items-center justify-start pt-4 shadow-[0_-10px_30px_rgba(212,175,55,0.2)]">
                      <span className="font-display text-4xl font-black text-[#D4AF37]">1</span>
                      <span className="font-sans text-xs sm:text-sm uppercase font-bold text-white mt-1.5 sm:mt-2 truncate w-32 text-center">{rank1.name}</span>
                      <span className="font-display text-lg sm:text-xl text-[#D4AF37] font-bold mt-1">{rank1.totalPoints} <span className="text-[10px]">PTS</span></span>
                    </div>
                  </motion.div>
                )}

                {/* 2nd Place */}
                {rank2 && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col items-center order-2 md:order-1 z-10">
                    <Link href={`/athlete/${rank2.id}`}>
                      <Avatar photoUrl={rank2.photoUrl} name={rank2.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#C0C0C0] mb-3 sm:mb-4 hover:scale-110 transition-transform cursor-pointer" />
                    </Link>
                    <div className="bg-gradient-to-t from-[#111] to-[#222] border border-white/10 w-32 sm:w-36 h-28 sm:h-32 md:h-40 rounded-t-lg flex flex-col items-center justify-start pt-4">
                      <span className="font-display text-3xl font-black text-[#C0C0C0]">2</span>
                      <span className="font-sans text-xs uppercase text-white/50 mt-1.5 truncate w-24 text-center">{rank2.name.split(' ')[0]}</span>
                      <span className="font-display text-base sm:text-lg text-white font-bold mt-1">{rank2.totalPoints} <span className="text-[10px]">PTS</span></span>
                    </div>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {rank3 && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center order-3 z-0">
                    <Link href={`/athlete/${rank3.id}`}>
                      <Avatar photoUrl={rank3.photoUrl} name={rank3.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#CD7F32] mb-3 sm:mb-4 hover:scale-110 transition-transform cursor-pointer" />
                    </Link>
                    <div className="bg-gradient-to-t from-[#111] to-[#222] border border-white/10 w-32 sm:w-36 h-24 sm:h-28 md:h-32 rounded-t-lg flex flex-col items-center justify-start pt-4">
                      <span className="font-display text-3xl font-black text-[#CD7F32]">3</span>
                      <span className="font-sans text-xs uppercase text-white/50 mt-1.5 truncate w-24 text-center">{rank3.name.split(' ')[0]}</span>
                      <span className="font-display text-base sm:text-lg text-white font-bold mt-1">{rank3.totalPoints} <span className="text-[10px]">PTS</span></span>
                    </div>
                  </motion.div>
                )}
              </div>
            </Reveal>
          ) : (
             <div className="text-center py-20 bg-[#111]/40 backdrop-blur-md rounded-2xl border border-white/5 mb-20">
               <span className="material-symbols-outlined text-4xl text-white/20 mb-4 block">sports_score</span>
               <p className="font-sans text-sm uppercase tracking-widest text-white/30">No results recorded yet for this sport.</p>
             </div>
          )}

          {/* Full Leaderboard Table */}
          {rankings.length > 0 && (
            <Reveal delay={0.3}>
              <h2 className="font-display text-2xl font-bold text-white uppercase mb-6">Full Leaderboard</h2>
              <div className="bg-[#111]/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/40">
                        <th className="py-3 sm:py-4 px-3 sm:px-6 font-sans text-xs uppercase tracking-widest text-white/50 w-16 sm:w-20">Rank</th>
                        <th className="py-3 sm:py-4 px-3 sm:px-6 font-sans text-xs uppercase tracking-widest text-white/50">Athlete</th>
                        <th className="py-3 sm:py-4 px-3 sm:px-6 font-sans text-xs uppercase tracking-widest text-white/50 hidden md:table-cell">Gender</th>
                        <th className="py-3 sm:py-4 px-3 sm:px-6 font-sans text-xs uppercase tracking-widest text-white/50 hidden sm:table-cell text-center">Events</th>
                        <th className="py-3 sm:py-4 px-3 sm:px-6 font-sans text-xs uppercase tracking-widest text-white/50 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="font-sans text-sm text-white">
                      {rankings.map((athlete: any) => (
                        <tr key={athlete.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                          <td className="py-2.5 sm:py-3 px-3 sm:px-6">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-display font-bold text-xs sm:text-sm ${
                              athlete.rank === 1 ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]' :
                              athlete.rank === 2 ? 'bg-[#C0C0C0] text-black' :
                              athlete.rank === 3 ? 'bg-[#CD7F32] text-black' :
                              'bg-white/10 text-white/50 group-hover:text-white'
                            }`}>
                              {athlete.rank}
                            </div>
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 sm:px-6">
                            <Link href={`/athlete/${athlete.id}`} className="flex items-center gap-2.5 sm:gap-3">
                              <Avatar photoUrl={athlete.photoUrl} name={athlete.name} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${athlete.rank === 1 ? 'border border-[#D4AF37]' : ''}`} />
                              <div className="font-display text-base sm:text-lg font-bold uppercase group-hover:text-[#D4AF37] transition-colors">{athlete.name}</div>
                            </Link>
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 sm:px-6 text-white/50 hidden md:table-cell">{athlete.gender === 'MALE' ? 'Sportsman' : athlete.gender === 'FEMALE' ? 'Sportswoman' : '-'}</td>
                          <td className="py-2.5 sm:py-3 px-3 sm:px-6 hidden sm:table-cell text-center font-display text-base sm:text-lg text-white/80">{athlete.eventsCount}</td>
                          <td className="py-2.5 sm:py-3 px-3 sm:px-6 text-right font-display text-lg sm:text-xl font-bold text-[#D4AF37]">{athlete.totalPoints}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          )}

        </div>
      </div>
    </Layout>
  );
}
