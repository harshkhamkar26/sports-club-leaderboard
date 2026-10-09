import React from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import CinematicBackground from "@/components/cinema/CinematicBackground";
import SectionHeading from "@/components/cinema/SectionHeading";
import Reveal from "@/components/cinema/Reveal";
import { prisma } from "@/lib/prisma";
import { getSchoolRankings } from "@/lib/analytics";

export async function getServerSideProps({ params }: any) {
  const { id } = params;

  try {
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            pointEntries: { include: { event: { include: { sport: true } } } },
            sport: true,
            department: true,
          },
        },
        departments: true,
      },
    });

    if (!school) {
      return { notFound: true };
    }

  // Calculate school stats
  const totalPoints = school.students.reduce(
    (sum, s) => sum + s.pointEntries.reduce((ps, pe) => ps + pe.points, 0),
    0
  );

  const gold = school.students.reduce(
    (sum, s) => sum + s.pointEntries.filter((pe) => pe.position === 1).length,
    0
  );
  const silver = school.students.reduce(
    (sum, s) => sum + s.pointEntries.filter((pe) => pe.position === 2).length,
    0
  );
  const bronze = school.students.reduce(
    (sum, s) => sum + s.pointEntries.filter((pe) => pe.position === 3).length,
    0
  );

  // Top athletes (bifurcated by gender)
  const allSchoolAthletes = school.students.map((s) => ({
    ...s,
    totalPoints: s.pointEntries.reduce((sum, pe) => sum + pe.points, 0),
  }));

  const topMaleAthlete = allSchoolAthletes
    .filter(s => s.gender?.toUpperCase() === 'MALE')
    .sort((a, b) => b.totalPoints - a.totalPoints)[0] || null;

  const topFemaleAthlete = allSchoolAthletes
    .filter(s => s.gender?.toUpperCase() === 'FEMALE')
    .sort((a, b) => b.totalPoints - a.totalPoints)[0] || null;

  // Strongest sports
  const sportStats: Record<string, number> = {};
  school.students.forEach((s) => {
    s.pointEntries.forEach((pe) => {
      const sportName = pe.event?.sport?.name || s.sport?.name || "General";
      sportStats[sportName] = (sportStats[sportName] || 0) + pe.points;
    });
  });
  const strongestSports = Object.entries(sportStats)
    .map(([name, pts]) => ({ name, points: Math.round(pts) }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  // All school rankings for context
  const allSchools = await getSchoolRankings();
  const schoolRank = allSchools.findIndex((s) => s.id === school.id) + 1;

  return {
    props: {
      school: JSON.parse(JSON.stringify(school)),
      stats: {
        totalPoints: Math.round(totalPoints),
        gold,
        silver,
        bronze,
        totalMedals: gold + silver + bronze,
        athleteCount: school.students.length,
        events: school.students.reduce(
          (sum, s) => sum + s.pointEntries.length,
          0
        ),
        departmentCount: school.departments.length,
        topMaleAthlete: topMaleAthlete
          ? {
              name: topMaleAthlete.name,
              photoUrl: topMaleAthlete.photoUrl,
              totalPoints: topMaleAthlete.totalPoints,
            }
          : null,
        topFemaleAthlete: topFemaleAthlete
          ? {
              name: topFemaleAthlete.name,
              photoUrl: topFemaleAthlete.photoUrl,
              totalPoints: topFemaleAthlete.totalPoints,
            }
          : null,
        strongestSports,
      },
      schoolRank,
    },
  };
  } catch (error) {
    console.error("Failed to fetch school profile:", error);
    return { notFound: true };
  }
}

interface SchoolProfileProps {
  school: any;
  stats: any;
  schoolRank: number;
}

export default function SchoolProfile({ school, stats, schoolRank }: SchoolProfileProps) {
  return (
    <Layout title={`${school.name} | UAI Sports`}>
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
      </Head>
      <CinematicBackground tone="race" />

      <div className="relative z-10 w-full min-h-screen pt-32 pb-24 px-5 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          {/* Hero */}
          <Reveal className="mb-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div
                className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-2 text-4xl font-black"
                style={{
                  background: school.color
                    ? `linear-gradient(135deg, ${school.color}, ${school.color}40)`
                    : "linear-gradient(135deg, #D4AF37, #D4AF3740)",
                  color: "black",
                  borderColor: school.color ? `${school.color}40` : "rgba(212,175,55,0.3)",
                }}
              >
                {school.logoUrl ? (
                  <img
                    src={school.logoUrl}
                    alt={school.name}
                    className="h-24 w-24 object-contain"
                  />
                ) : (
                  school.code
                )}
              </div>
              <div className="text-center md:text-left">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-[#D4AF37] mb-2">
                  Rank #{schoolRank} • School Championship
                </p>
                <h1 className="font-display text-4xl md:text-6xl font-black uppercase text-white">
                  {school.name}
                </h1>
                <p className="mt-2 font-sans text-sm text-white/50">
                  [{school.code}] • {school.departments.length} Departments
                </p>
              </div>
            </div>
          </Reveal>

          {/* Stats Grid */}
          <Reveal delay={0.2} className="mb-16">
            <SectionHeading
              kicker="School Profile"
              title="Performance Overview"
              align="center"
            />
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <StatCard value={stats.totalPoints} label="Total Points" accent />
            <StatCard value={stats.athleteCount} label="Athletes" />
            <StatCard value={stats.events} label="Events" />
            <StatCard value={stats.totalMedals} label="Total Medals" />
          </div>

          {/* Medals Breakdown */}
          <Reveal delay={0.3} className="mb-16">
            <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-2xl mx-auto">
              <div className="text-center p-2">
                <span className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#D4AF37]">
                  {stats.gold}
                </span>
                <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 mt-1">
                  Gold
                </div>
              </div>
              <div className="text-center p-2">
                <span className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#C0C0C0]">
                  {stats.silver}
                </span>
                <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 mt-1">
                  Silver
                </div>
              </div>
              <div className="text-center p-2">
                <span className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#CD7F32]">
                  {stats.bronze}
                </span>
                <div className="font-sans text-[10px] uppercase tracking-widest text-white/40 mt-1">
                  Bronze
                </div>
              </div>
            </div>
          </Reveal>

          {/* Top Athlete & Strongest Sports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Top Athletes */}
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-5 sm:p-6 md:p-8 backdrop-blur-sm h-full flex flex-col justify-center">
                <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-6 tracking-widest text-center">
                  Leading Athletes
                </h3>
                
                <div className="grid grid-cols-2 gap-4 sm:gap-8">
                  {/* Top Male */}
                  <div className="flex flex-col items-center text-center">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-3">Sportsman</p>
                    <div className="h-16 w-16 sm:h-20 sm:h-20 shrink-0 overflow-hidden rounded-full border border-white/10 mb-3">
                      {stats.topMaleAthlete ? (
                        stats.topMaleAthlete.photoUrl ? (
                          <img src={stats.topMaleAthlete.photoUrl} alt={stats.topMaleAthlete.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#333] to-[#111]">
                            <span className="font-display text-2xl font-bold text-white/30">
                              {stats.topMaleAthlete.name.split(" ").map((n: string) => n[0]).join("")}
                            </span>
                          </div>
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#111]"><span className="text-2xl opacity-20">?</span></div>
                      )}
                    </div>
                    {stats.topMaleAthlete ? (
                      <>
                        <h4 className="font-display text-base sm:text-lg font-black uppercase text-white leading-tight">{stats.topMaleAthlete.name}</h4>
                        <p className="font-sans text-xs text-white/50 mt-1">{stats.topMaleAthlete.totalPoints} pts</p>
                      </>
                    ) : (
                      <p className="font-sans text-xs text-white/40 mt-1">N/A</p>
                    )}
                  </div>

                  {/* Top Female */}
                  <div className="flex flex-col items-center text-center">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8B5CF6] mb-3">Sportswoman</p>
                    <div className="h-16 w-16 sm:h-20 sm:h-20 shrink-0 overflow-hidden rounded-full border border-white/10 mb-3">
                      {stats.topFemaleAthlete ? (
                        stats.topFemaleAthlete.photoUrl ? (
                          <img src={stats.topFemaleAthlete.photoUrl} alt={stats.topFemaleAthlete.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#333] to-[#111]">
                            <span className="font-display text-2xl font-bold text-white/30">
                              {stats.topFemaleAthlete.name.split(" ").map((n: string) => n[0]).join("")}
                            </span>
                          </div>
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#111]"><span className="text-2xl opacity-20">?</span></div>
                      )}
                    </div>
                    {stats.topFemaleAthlete ? (
                      <>
                        <h4 className="font-display text-base sm:text-lg font-black uppercase text-white leading-tight">{stats.topFemaleAthlete.name}</h4>
                        <p className="font-sans text-xs text-white/50 mt-1">{stats.topFemaleAthlete.totalPoints} pts</p>
                      </>
                    ) : (
                      <p className="font-sans text-xs text-white/40 mt-1">N/A</p>
                    )}
                  </div>
                </div>

              </div>
            </Reveal>

            {/* Strongest Sports */}
            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-5 sm:p-6 md:p-8 backdrop-blur-sm">
                <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-6 tracking-widest">
                  Strongest Sports
                </h3>
                <div className="space-y-4">
                  {stats.strongestSports.map((sport: any, i: number) => (
                    <div key={sport.name} className="flex items-center gap-3 sm:gap-4">
                      <span className="font-display text-sm font-bold text-white/40 w-5 sm:w-6 shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-sans text-xs sm:text-sm font-medium text-white min-w-[80px] sm:min-w-[120px] truncate">
                        {sport.name}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-[#D4AF37]"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(sport.points / stats.totalPoints) * 100}%`,
                          }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      </div>
                      <span className="font-display text-xs sm:text-sm font-bold text-[#D4AF37] w-12 sm:w-16 text-right shrink-0">
                        {sport.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Departments */}
          <Reveal delay={0.4}>
            <SectionHeading
              kicker="Departments"
              title="Academic Units"
              sub="The departments that make up this school."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {school.departments.map((dept: any) => (
              <Reveal key={dept.id} delay={0.1}>
                <div className="rounded-xl border border-white/10 bg-[#111]/40 p-6 text-center">
                  <h4 className="font-display text-xl font-bold uppercase text-white mb-1">
                    {dept.name}
                  </h4>
                  <p className="font-sans text-xs text-white/40 uppercase tracking-widest">
                    [{dept.code}]
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Back to rankings */}
          <Reveal delay={0.5} className="mt-16 text-center">
            <Link
              href="/schools"
              className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-8 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.15em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
            >
              ← Back to School Rankings
            </Link>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-8">
      <span
        className={`font-display text-4xl font-bold tabular-nums ${
          accent ? "text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" : "text-white"
        }`}
      >
        {value}
      </span>
      <span className="mt-3 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        {label}
      </span>
    </div>
  );
}
