import React, { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import CinematicBackground from "@/components/cinema/CinematicBackground";
import Reveal from "@/components/cinema/Reveal";
import { getRankings, getMaleRankings, getFemaleRankings } from "@/lib/rankings";

export async function getServerSideProps() {
  try {
    const [allAthletes, maleAthletes, femaleAthletes] = await Promise.all([
      getRankings(),
      getMaleRankings(),
      getFemaleRankings()
    ]);
    return {
      props: { 
        allAthletes: JSON.parse(JSON.stringify(allAthletes)),
        maleAthletes: JSON.parse(JSON.stringify(maleAthletes)),
        femaleAthletes: JSON.parse(JSON.stringify(femaleAthletes))
      },
    };
  } catch (error) {
    console.error("Failed to fetch athletes:", error);
    return {
      props: { allAthletes: [], maleAthletes: [], femaleAthletes: [] },
    };
  }
}

interface Athlete {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  house: string | null;
  school?: { name: string; code: string; color: string | null } | null;
  photoUrl: string | null;
  gender: string | null;
  totalPoints: number;
  eventsCount: number;
  rank: number;
  medals: { gold: number; silver: number; bronze: number };
}

interface Props {
  allAthletes: Athlete[];
  maleAthletes: Athlete[];
  femaleAthletes: Athlete[];
}

export default function AthletesPage({ allAthletes, maleAthletes, femaleAthletes }: Props) {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");

  const activeAthletes = useMemo(() => {
    if (genderFilter === "Men") return maleAthletes;
    if (genderFilter === "Women") return femaleAthletes;
    return allAthletes;
  }, [genderFilter, allAthletes, maleAthletes, femaleAthletes]);

  const filtered = useMemo(() => {
    if (!search) return activeAthletes;
    return activeAthletes.filter((a) => {
      return a.name.toLowerCase().includes(search.toLowerCase()) ||
             a.rollNumber.toLowerCase().includes(search.toLowerCase());
    });
  }, [activeAthletes, search]);

  return (
    <Layout title="Athletes | UAI Sports Directory">
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
      </Head>
      <CinematicBackground tone="arena" />

      <div className="relative z-10 w-full min-h-screen pt-32 pb-24 px-5 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          
          {/* Hero */}
          <Reveal className="text-center mb-20">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.5em] text-[#D4AF37] mb-4">
              The Athletes
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-black uppercase text-white tracking-tight drop-shadow-2xl">
              Meet The Competitors
            </h1>
            <p className="mt-4 font-sans text-sm font-light text-white/50 tracking-widest uppercase">
              Performance. Discipline. Legacy.
            </p>
          </Reveal>

          {/* Filters */}
          <Reveal delay={0.2} className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="SEARCH ATHLETE..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm font-sans uppercase text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>

              <div className="flex items-center gap-1 sm:gap-2 bg-[#111]/40 p-1 rounded-full border border-white/5 backdrop-blur-md w-full sm:w-auto justify-center">
                {["All", "Men", "Women"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`relative px-3 sm:px-6 py-2 rounded-full font-sans text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
                      genderFilter === g
                        ? "text-black"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {genderFilter === g && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{g === "All" ? "All" : g === "Men" ? "Sportsmen" : "Sportswomen"}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Athletes Grid with Layout Animation */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((athlete, i) => (
                <motion.div
                  key={athlete.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    layout: { type: "spring", bounce: 0.2, duration: 0.6 },
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <Link href={`/athlete/${athlete.id}`} className="block h-full">
                    <div className="relative h-full overflow-hidden rounded-2xl bg-[#0c0c0e] border border-white/10 transition-colors group-hover:border-[#D4AF37]/50 shadow-lg group-hover:shadow-[0_15px_35px_rgba(212,175,55,0.1)]">
                      
                      {/* Premium Background Glow on Hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#D4AF37]/10 to-transparent" />

                      {/* Rank Badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                          <span className="font-display text-sm font-bold text-[#D4AF37]">
                            #{athlete.rank}
                          </span>
                        </div>
                      </div>

                      {/* Large Athlete Image (Trading Card Style) */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111]">
                        {athlete.photoUrl ? (
                          <img
                            src={athlete.photoUrl}
                            alt={athlete.name}
                            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a24] to-[#0a0a0f] group-hover:from-[#222230] transition-colors duration-500">
                            <span className="font-display text-5xl font-black text-white/5">
                              {athlete.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent" />
                      </div>

                      {/* Card Content */}
                      <div className="relative z-10 -mt-6 p-6">
                        <div className="mb-4">
                          <h3 className="font-display text-2xl font-black uppercase text-white group-hover:text-[#D4AF37] transition-colors leading-none">
                            {athlete.name}
                          </h3>
                          <p className="mt-1 font-sans text-[10px] uppercase tracking-widest text-[#D4AF37]">
                            {athlete.school?.name || "UAI Athlete"}
                          </p>
                          <p className="mt-1 font-sans text-xs text-white/40">
                            {athlete.className} • {athlete.rollNumber}
                          </p>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                          <div className="text-center">
                            <span className="block font-display text-lg font-bold text-white group-hover:text-white transition-colors">
                              {athlete.totalPoints}
                            </span>
                            <span className="font-sans text-[9px] uppercase tracking-widest text-white/40">
                              Points
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="block font-display text-lg font-bold text-white">
                              {athlete.eventsCount}
                            </span>
                            <span className="font-sans text-[9px] uppercase tracking-widest text-white/40">
                              Events
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="block font-display text-lg font-bold text-[#D4AF37]">
                              {athlete.medals.gold}
                            </span>
                            <span className="font-sans text-[9px] uppercase tracking-widest text-[#D4AF37]/60">
                              Gold
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-32"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
                <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <p className="font-sans text-sm uppercase tracking-widest text-white/30">
                No athletes match your criteria
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </Layout>
  );
}
