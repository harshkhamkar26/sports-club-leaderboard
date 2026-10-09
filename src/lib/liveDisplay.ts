import { prisma } from "./prisma";
import { getMaleRankings, getFemaleRankings } from "./rankings";

/**
 * UAi SPORTS LIVE — Centralized configuration for the TV/venue display.
 * All timing and toggle settings live here for easy adjustment.
 */

export const LIVE_DISPLAY_CONFIG = {
  maleDuration: 8000,
  femaleDuration: 8000,
  schoolDuration: 10000,
  refreshInterval: 30000, // data sync interval in ms
  tickerEnabled: true,
  showScores: true,
  showEventBanner: true,
};

export interface LiveAthlete {
  id: string;
  name: string;
  rollNumber: string;
  gender: string | null;
  photoUrl: string | null;
  totalPoints: number;
  eventsCount: number;
  medals: { gold: number; silver: number; bronze: number };
  podiums: number;
  sport: { name: string; icon: string | null } | null;
  school: { name: string; code: string; color: string | null } | null;
  department: { name: string; code: string } | null;
  rank: number;
}

export interface LiveSchool {
  id: string;
  name: string;
  code: string;
  color: string | null;
  totalPoints: number;
  athleteCount: number;
  gold: number;
  silver: number;
  bronze: number;
  totalMedals: number;
  rank: number;
}

export interface LiveEventInfo {
  id: string;
  name: string;
  category: string | null;
  venue: string | null;
  sport: { name: string; icon: string | null } | null;
  status: string;
  startTime: Date | null;
  score?: { teamA: string; scoreA: number; teamB: string; scoreB: number } | null;
}

export interface LiveDisplayData {
  maleLeader: LiveAthlete | null;
  femaleLeader: LiveAthlete | null;
  schools: LiveSchool[];
  activeEvent: LiveEventInfo | null;
}

/**
 * Fetch all data needed for the live TV display.
 * Uses real ranking data from the database.
 */
export async function getLiveDisplayData(): Promise<LiveDisplayData> {
  const [maleRankings, femaleRankings] = await Promise.all([
    getMaleRankings(),
    getFemaleRankings()
  ]);

  // Map to LiveAthlete format for male leader
  const maleLeaderRaw = maleRankings.length > 0 ? maleRankings[0] : null;
  const maleLeader: LiveAthlete | null = maleLeaderRaw ? {
    id: maleLeaderRaw.id,
    name: maleLeaderRaw.name,
    rollNumber: maleLeaderRaw.rollNumber,
    gender: maleLeaderRaw.gender,
    photoUrl: maleLeaderRaw.photoUrl,
    totalPoints: maleLeaderRaw.totalPoints,
    eventsCount: maleLeaderRaw.eventsCount,
    medals: maleLeaderRaw.medals,
    podiums: maleLeaderRaw.medals.gold + maleLeaderRaw.medals.silver + maleLeaderRaw.medals.bronze,
    sport: maleLeaderRaw.sport || null,
    school: maleLeaderRaw.school || null,
    department: maleLeaderRaw.department || null,
    rank: maleLeaderRaw.rank
  } : null;

  // Map to LiveAthlete format for female leader
  const femaleLeaderRaw = femaleRankings.length > 0 ? femaleRankings[0] : null;
  const femaleLeader: LiveAthlete | null = femaleLeaderRaw ? {
    id: femaleLeaderRaw.id,
    name: femaleLeaderRaw.name,
    rollNumber: femaleLeaderRaw.rollNumber,
    gender: femaleLeaderRaw.gender,
    photoUrl: femaleLeaderRaw.photoUrl,
    totalPoints: femaleLeaderRaw.totalPoints,
    eventsCount: femaleLeaderRaw.eventsCount,
    medals: femaleLeaderRaw.medals,
    podiums: femaleLeaderRaw.medals.gold + femaleLeaderRaw.medals.silver + femaleLeaderRaw.medals.bronze,
    sport: femaleLeaderRaw.sport || null,
    school: femaleLeaderRaw.school || null,
    department: femaleLeaderRaw.department || null,
    rank: femaleLeaderRaw.rank
  } : null;

  // School rankings from analytics helper
  const { getSchoolRankings } = await import("./analytics");
  const rawSchools = await getSchoolRankings();
  const schools: LiveSchool[] = rawSchools.map((s, i) => ({ ...s, rank: i + 1 }));

  // Active live event (if any real live event exists)
  const activeEventRaw = await prisma.broadcast.findFirst({
    where: { status: "LIVE" },
    include: { event: { include: { sport: true } } },
  });

  let activeEvent: LiveEventInfo | null = null;
  if (activeEventRaw?.event) {
    activeEvent = {
      id: activeEventRaw.event.id,
      name: activeEventRaw.event.name,
      category: activeEventRaw.event.category,
      venue: activeEventRaw.event.venue,
      sport: activeEventRaw.event.sport,
      status: activeEventRaw.status,
      startTime: activeEventRaw.event.startTime,
      score: null, // would come from a score model when available
    };
  }

  return { maleLeader, femaleLeader, schools, activeEvent };
}