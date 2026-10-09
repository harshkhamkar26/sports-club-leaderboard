import React from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import CinematicBackground from "@/components/cinema/CinematicBackground";
import SectionHeading from "@/components/cinema/SectionHeading";
import Reveal from "@/components/cinema/Reveal";
import { getAthleteAnalytics } from "@/lib/analytics";
import { getRankings, getMaleRankings, getFemaleRankings } from "@/lib/rankings";
import { prisma } from "@/lib/prisma";

export async function getServerSideProps({ params }: any) {
  const { id } = params;

  try {
    const analytics = await getAthleteAnalytics(id);

    if (!analytics) {
      return { notFound: true };
    }

    const [globalRankings, maleRankings, femaleRankings] = await Promise.all([
      getRankings(),
      getMaleRankings(),
      getFemaleRankings()
    ]);

    const globalRank: string | number = globalRankings.find(a => a.id === id)?.rank || '-';
    let categoryRank: string | number = '-';
    if (analytics.student.gender === 'MALE') {
      categoryRank = maleRankings.find(a => a.id === id)?.rank || '-';
    } else if (analytics.student.gender === 'FEMALE') {
      categoryRank = femaleRankings.find(a => a.id === id)?.rank || '-';
    }

    return {
      props: {
        analytics: JSON.parse(JSON.stringify(analytics)),
        globalRank,
        categoryRank,
      },
    };
  } catch (error) {
    console.error("Failed to fetch athlete analytics:", error);
    return { notFound: true };
  }
}

interface AthleteAnalytics {
  student: {
    id: string;
    name: string;
    rollNumber: string;
    className: string;
    house: string | null;
    gender: string | null;
    photoUrl: string | null;
    school: { name: string; code: string; color: string | null } | null;
    department: { name: string; code: string } | null;
    sport: { name: string; icon: string | null } | null;
  };
  totalPoints: number;
  eventsCount: number;
  medals: { gold: number; silver: number; bronze: number };
  podiums: number;
  wins: number;
  participationRate: number;
  withdrawals: number;
  chartData: Array<{
    date: string;
    points: number;
    earned: number;
    event: string;
    position: number | null;
  }>;
  sportBreakdown: Array<{ name: string; points: number }>;
  eventHistory: Array<{
    eventName: string;
    eventDate: string;
    points: number;
    position: number | null;
    sport: string;
  }>;
  awards: Array<{
    id: string;
    name: string;
    description: string | null;
    year: number;
    awardCategory: { name: string } | null;
  }>;
}

export default function AthleteProfile({ analytics, globalRank, categoryRank }: { analytics: AthleteAnalytics, globalRank: number | string, categoryRank: number | string }) {
  const { student, totalPoints, eventsCount, medals, podiums, wins, participationRate, withdrawals, chartData, sportBreakdown, eventHistory, awards } = analytics;

  const getParticipationLabel = (rate: number) => {
    if (rate >= 90) return { label: "ELITE PARTICIPATION", color: "#D4AF37" };
    if (rate >= 75) return { label: "HIGH", color: "#3B82F6" };
    if (rate >= 50) return { label: "MODERATE", color: "#F59E0B" };
    return { label: "LOW", color: "#EF4444" };
  };

  const participation = getParticipationLabel(participationRate);

  return (
    <Layout title={`${student.name} | Athlete Profile — UAIU Sports`}>
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
      </Head>
      <CinematicBackground tone="story" />

      <div className="relative z-10 w-full min-h-screen pt-32 pb-24 px-5 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          {/* Hero Section */}
          <Reveal className="mb-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-[#D4AF37]/30">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#333] to-[#111]">
                      <span className="font-display text-4xl font-bold text-white/30">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 rounded-full border-2 border-[#060606] bg-[#D4AF37] px-3 py-1 font-display text-sm font-bold text-black" title="Category Rank">
                  #{categoryRank}
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-[#D4AF37] mb-2">
                  Athlete Performance Intelligence
                </p>
                <h1 className="font-display text-4xl md:text-6xl font-black uppercase text-white">
                  {student.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <span className="font-sans text-xs text-white/50">
                    {student.rollNumber}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="font-sans text-xs text-white/50">
                    {student.department?.name || student.className}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="font-sans text-xs text-white/50">
                    {student.school?.name}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="font-sans text-xs text-white/50">
                    {student.gender === "MALE" ? "Sportsman" : student.gender === "FEMALE" ? "Sportswoman" : "Athlete"}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Stats Grid */}
          <Reveal delay={0.2} className="mb-16">
            <SectionHeading
              kicker="Performance Overview"
              title="Athlete Intelligence"
              align="center"
            />
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <StatCard value={totalPoints} label="Total Points" accent />
            <StatCard value={eventsCount} label="Events" />
            <StatCard value={medals.gold} label="Gold Medals" />
            <StatCard value={podiums} label="Podiums" />
          </div>

          {/* Participation Rate */}
          <Reveal delay={0.3} className="mb-16">
            <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-8 backdrop-blur-sm">
              <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-6 tracking-widest">
                Participation Rate
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="relative h-6 w-full rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: `${participationRate}%`,
                        background: `linear-gradient(90deg, ${participation.color}, ${participation.color}80)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${participationRate}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between">
                    <span className="font-sans text-xs text-white/40">0%</span>
                    <span className="font-sans text-xs text-white/40">50%</span>
                    <span className="font-sans text-xs text-white/40">100%</span>
                  </div>
                </div>
                <div className="text-center">
                  <span
                    className="font-display text-3xl font-bold"
                    style={{ color: participation.color }}
                  >
                    {participationRate}%
                  </span>
                  <p
                    className="font-sans text-xs uppercase tracking-widest mt-1"
                    style={{ color: participation.color }}
                  >
                    {participation.label}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div>
                  <span className="font-display text-xl font-bold text-white">
                    {eventsCount}
                  </span>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                    Events Participated
                  </p>
                </div>
                <div>
                  <span className="font-display text-xl font-bold text-white">
                    {eventsCount - withdrawals}
                  </span>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                    Completed
                  </p>
                </div>
                <div>
                  <span className="font-display text-xl font-bold text-white">
                    {withdrawals}
                  </span>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                    Withdrawals
                  </p>
                </div>
                <div>
                  <span className="font-display text-xl font-bold text-[#D4AF37]">
                    {wins}
                  </span>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                    Wins
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Performance Grid: Chart + Sport Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Points Over Time Chart */}
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-5 sm:p-6 md:p-8 backdrop-blur-sm">
                <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-6 tracking-widest">
                  Points Over Time
                </h3>
                <div className="h-64 overflow-hidden">
                  {chartData.length > 0 ? (
                    <LineChart data={chartData} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/30">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Sport Breakdown */}
            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-5 sm:p-6 md:p-8 backdrop-blur-sm">
                <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-6 tracking-widest">
                  Sport Breakdown
                </h3>
                <div className="space-y-4">
                  {sportBreakdown.map((sport, i) => (
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
                            width: `${(sport.points / totalPoints) * 100}%`,
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

          {/* Event History */}
          <Reveal delay={0.4}>
            <SectionHeading
              kicker="Event History"
              title="Performance Timeline"
              sub="Every competition, every result, every point earned."
            />
          </Reveal>

          <div className="mt-12 space-y-4">
            {eventHistory.map((entry, i) => (
              <Reveal key={`${entry.eventName}-${i}`} delay={i * 0.05}>
                <div className="relative rounded-xl border border-white/[0.04] bg-[#111]/40 p-4 md:p-6 group hover:border-white/[0.1] hover:bg-[#111] transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-black ${
                          entry.position === 1
                            ? "bg-[#D4AF37] text-black"
                            : entry.position === 2
                            ? "bg-[#C0C0C0] text-black"
                            : entry.position === 3
                            ? "bg-[#CD7F32] text-black"
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        {entry.position || "?"}
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-bold uppercase text-white">
                          {entry.eventName}
                        </h4>
                        <p className="font-sans text-xs text-white/40">
                          {new Date(entry.eventDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="font-display text-xl font-bold text-[#D4AF37]">
                          +{entry.points}
                        </span>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                          Points
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="font-sans text-xs uppercase tracking-widest text-white/40">
                          {entry.sport}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            {eventHistory.length === 0 && (
              <div className="text-center py-20 text-white/30 font-sans text-sm uppercase tracking-widest">
                No event history available for this season.
              </div>
            )}
          </div>

          {/* Awards */}
          {awards && awards.length > 0 && (
            <Reveal delay={0.5} className="mt-16">
              <SectionHeading
                kicker="Awards"
                title="Recognition"
                sub="Honors and achievements earned."
              />
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                {awards.map((award) => (
                  <div
                    key={award.id}
                    className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6"
                  >
                    <h3 className="font-display text-xl font-bold uppercase text-[#D4AF37]">
                      {award.name}
                    </h3>
                    {award.awardCategory && (
                      <p className="font-sans text-xs uppercase tracking-widest text-white/40 mt-1">
                        {award.awardCategory.name}
                      </p>
                    )}
                    {award.description && (
                      <p className="font-sans text-sm text-white/60 mt-2">
                        {award.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          )}
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

// Simple SVG Line Chart
function LineChart({ data }: { data: Array<{ date: string; points: number }> }) {
  const maxPoints = Math.max(...data.map((d) => d.points), 1);
  const chartHeight = 200;
  const chartWidth = 500;
  const padding = 34;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (chartWidth - padding * 2);
    const y = chartHeight - (d.points / maxPoints) * (chartHeight - padding * 2);
    return { x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      width="100%"
      height={chartHeight}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className="overflow-hidden w-full h-full"
    >
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((pct) => (
        <line
          key={pct}
          x1={padding}
          y1={chartHeight - padding - (pct / 100) * (chartHeight - padding * 2)}
          x2={chartWidth - padding}
          y2={chartHeight - padding - (pct / 100) * (chartHeight - padding * 2)}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      ))}

      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="#D4AF37"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Points */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#D4AF37"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.05 }}
        />
      ))}

      {/* Y-axis labels */}
      {[0, 25, 50, 75, 100].map((pct) => {
        const val = Math.round((pct / 100) * maxPoints);
        return (
          <text
            key={pct}
            x={padding - 8}
            y={chartHeight - padding - (pct / 100) * (chartHeight - padding * 2) + 4}
            className="fill-white/30 font-sans text-[10px]"
            textAnchor="end"
          >
            {val}
          </text>
        );
      })}

      {/* X-axis labels */}
      {data.map((d, i) => {
        const x = padding + (i / Math.max(data.length - 1, 1)) * (chartWidth - padding * 2);
        return (
          <text
            key={i}
            x={x}
            y={chartHeight - padding + 15}
            className="fill-white/30 font-sans text-[10px]"
            textAnchor="middle"
          >
            {d.date}
          </text>
        );
      })}
    </svg>
  );
}
