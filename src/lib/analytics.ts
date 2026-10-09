import { prisma } from "./prisma";

/**
 * UAI Sports OS — Analytics Engine
 * All aggregation logic for the Sports Command Center.
 */

// ─── School Rankings ─────────────────────────────────────────────

export async function getSchoolRankings() {
  const schools = await prisma.school.findMany({
    include: {
      students: {
        include: {
          pointEntries: true,
        },
      },
    },
  });

  return schools
    .map((school) => {
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

      return {
        id: school.id,
        name: school.name,
        code: school.code,
        color: school.color,
        logoUrl: school.logoUrl,
        totalPoints: Math.round(totalPoints),
        athleteCount: school.students.length,
        gold,
        silver,
        bronze,
        totalMedals: gold + silver + bronze,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);
}

// ─── House Rankings ──────────────────────────────────────────────

export async function getHouseRankings() {
  const students = await prisma.student.findMany({
    include: {
      pointEntries: true,
    },
  });

  const houses: Record<string, any> = {};

  students.forEach((s) => {
    const houseName = s.house || "Unaffiliated";
    if (!houses[houseName]) {
      houses[houseName] = {
        name: houseName,
        gold: 0,
        silver: 0,
        bronze: 0,
        totalPoints: 0,
        athleteCount: 0,
      };
    }
    houses[houseName].totalPoints += s.pointEntries.reduce((sum, pe) => sum + pe.points, 0);
    houses[houseName].gold += s.pointEntries.filter((pe) => pe.position === 1).length;
    houses[houseName].silver += s.pointEntries.filter((pe) => pe.position === 2).length;
    houses[houseName].bronze += s.pointEntries.filter((pe) => pe.position === 3).length;
    houses[houseName].athleteCount += 1;
  });

  return Object.values(houses)
    .map((h: any) => ({
      ...h,
      totalPoints: Math.round(h.totalPoints),
      totalMedals: h.gold + h.silver + h.bronze,
    }))
    .sort((a: any, b: any) => b.totalPoints - a.totalPoints);
}

// ─── Athlete Analytics ───────────────────────────────────────────

export async function getAthleteAnalytics(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      school: true,
      department: true,
      sport: true,
      pointEntries: {
        include: { event: { include: { sport: true } } },
        orderBy: { event: { date: "asc" } },
      },
      eventParticipants: {
        include: { event: true, student: true },
      },
      awards: {
        include: { awardCategory: true },
      },
    },
  });

  if (!student) return null;

  // Total points
  const totalPoints = student.pointEntries.reduce((sum, pe) => sum + pe.points, 0);

  // Medals
  const gold = student.pointEntries.filter((pe) => pe.position === 1).length;
  const silver = student.pointEntries.filter((pe) => pe.position === 2).length;
  const bronze = student.pointEntries.filter((pe) => pe.position === 3).length;
  const podiums = gold + silver + bronze;

  // Participation rate
  const allEvents = await prisma.event.findMany({
    where: { sportId: student.sportId || undefined },
  });
  const participated = student.eventParticipants.filter(
    (ep) => ep.status === "PARTICIPATED" || ep.status === "WINNER"
  ).length;
  const eligible = allEvents.length > 0 ? allEvents.length : 1;
  const participationRate = Math.round((participated / eligible) * 100);

  // Wins
  const wins = student.pointEntries.filter((pe) => pe.position === 1).length;

  // Withdrawals
  const withdrawals = student.eventParticipants.filter(
    (ep) => ep.status === "WITHDRAWN" || ep.status === "ABSENT" || ep.status === "DISQUALIFIED"
  ).length;

  // Cumulative points over time
  let cumulative = 0;
  const chartData = student.pointEntries.map((pe) => {
    cumulative += pe.points;
    return {
      date: new Date(pe.event.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      points: cumulative,
      earned: pe.points,
      event: pe.event.name,
      position: pe.position,
    };
  });

  // Sport breakdown
  const sportBreakdown: Record<string, number> = {};
  student.pointEntries.forEach((pe) => {
    const sportName = pe.event.sportId ? pe.event.sport?.name || "Unknown" : "General";
    sportBreakdown[sportName] = (sportBreakdown[sportName] || 0) + pe.points;
  });

  const sportBreakdownArr = Object.entries(sportBreakdown)
    .map(([name, pts]) => ({ name, points: Math.round(pts) }))
    .sort((a, b) => b.points - a.points);

  // Event history
  const eventHistory = student.pointEntries.map((pe) => ({
    eventName: pe.event.name,
    eventDate: pe.event.date,
    points: pe.points,
    position: pe.position,
    sport: pe.event.sport?.name || "General",
  }));

  return {
    student: {
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      className: student.className,
      house: student.house,
      gender: student.gender,
      photoUrl: student.photoUrl,
      school: student.school,
      department: student.department,
      sport: student.sport,
    },
    totalPoints: Math.round(totalPoints),
    eventsCount: student.pointEntries.length,
    medals: { gold, silver, bronze },
    podiums,
    wins,
    participationRate,
    withdrawals,
    chartData,
    sportBreakdown: sportBreakdownArr,
    eventHistory,
    awards: student.awards,
  };
}

// ─── Admin Dashboard Analytics ───────────────────────────────────

export async function getAdminAnalytics() {
  const [
    athleteCount,
    eventCount,
    sportCount,
    participationCount,
    totalPoints,
    goldMedals,
    liveBroadcast,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.event.count(),
    prisma.sport.count(),
    prisma.eventParticipant.count({
      where: { status: { in: ["PARTICIPATED", "WINNER"] } },
    }),
    prisma.pointEntry.aggregate({
      _sum: { points: true },
    }),
    prisma.pointEntry.count({
      where: { position: 1 },
    }),
    prisma.broadcast.findFirst({
      where: { status: "LIVE" },
      include: { event: true },
    }),
  ]);

  // Points by month
  const pointEntries = await prisma.pointEntry.findMany({
    include: { event: { include: { sport: true } } },
  });

  const pointsByMonth: Record<string, number> = {};
  pointEntries.forEach((pe) => {
    const month = new Date(pe.event.date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
    });
    pointsByMonth[month] = (pointsByMonth[month] || 0) + pe.points;
  });

  // Participation by month
  const participants = await prisma.eventParticipant.findMany({
    include: { event: true, student: { include: { school: true } } },
  });

  const participationByMonth: Record<string, number> = {};
  participants.forEach((p) => {
    const month = new Date(p.event.date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
    });
    participationByMonth[month] = (participationByMonth[month] || 0) + 1;
  });

  // Medals by sport
  const medalsBySport: Record<string, { gold: number; silver: number; bronze: number }> = {};
  pointEntries.forEach((pe) => {
    const sportName = pe.event.sport?.name || "General";
    if (!medalsBySport[sportName]) {
      medalsBySport[sportName] = { gold: 0, silver: 0, bronze: 0 };
    }
    if (pe.position === 1) medalsBySport[sportName].gold++;
    if (pe.position === 2) medalsBySport[sportName].silver++;
    if (pe.position === 3) medalsBySport[sportName].bronze++;
  });

  // Participation by gender
  const genderParticipation: Record<string, number> = {};
  participants.forEach((p) => {
    const gender = p.student.gender || "Unknown";
    genderParticipation[gender] = (genderParticipation[gender] || 0) + 1;
  });

  // Participation by school
  const schoolParticipation: Record<string, number> = {};
  participants.forEach((p) => {
    const schoolName = p.student.school?.name || "Unknown";
    schoolParticipation[schoolName] = (schoolParticipation[schoolName] || 0) + 1;
  });

  // Participation by house
  const houseParticipation: Record<string, number> = {};
  participants.forEach((p) => {
    const houseName = p.student.house || "Unaffiliated";
    houseParticipation[houseName] = (houseParticipation[houseName] || 0) + 1;
  });

  return {
    overview: {
      athletes: athleteCount,
      events: eventCount,
      activeSports: sportCount,
      totalParticipations: participationCount,
      totalPoints: Math.round(totalPoints._sum.points || 0),
      goldMedals,
      liveEvent: liveBroadcast
        ? {
            title: liveBroadcast.title,
            eventName: liveBroadcast.event?.name || "Unknown",
            status: liveBroadcast.status,
          }
        : null,
    },
    charts: {
      pointsByMonth: Object.entries(pointsByMonth).map(([month, pts]) => ({
        month,
        points: Math.round(pts),
      })),
      participationByMonth: Object.entries(participationByMonth).map(([month, count]) => ({
        month,
        count,
      })),
      medalsBySport: Object.entries(medalsBySport).map(([sport, medals]) => ({
        sport,
        ...medals,
      })),
      participationByGender: Object.entries(genderParticipation).map(([gender, count]) => ({
        gender,
        count,
      })),
      participationBySchool: Object.entries(schoolParticipation)
        .map(([school, count]) => ({ school, count }))
        .sort((a, b) => b.count - a.count),
      participationByHouse: Object.entries(houseParticipation)
        .map(([house, count]) => ({ house, count }))
        .sort((a, b) => b.count - a.count),
    },
  };
}

// ─── Broadcast Analytics ─────────────────────────────────────────

export async function getBroadcastAnalytics(broadcastId: string) {
  const broadcast = await prisma.broadcast.findUnique({
    where: { id: broadcastId },
    include: {
      cheers: true,
      broadcastSessions: true,
      viewerSessions: true,
    },
  });

  if (!broadcast) return null;

  const cheerCount = broadcast.cheers.length;
  const viewerCount = broadcast.viewerSessions.length;
  const instagramClicks = broadcast.viewerSessions.filter(
    (vs) => vs.instagramFollowed
  ).length;

  // Cheer type breakdown
  const cheerTypes: Record<string, number> = {};
  broadcast.cheers.forEach((c) => {
    cheerTypes[c.type] = (cheerTypes[c.type] || 0) + 1;
  });

  // Average watch time (approximate)
  const sessionsWithDuration = broadcast.viewerSessions.filter(
    (vs) => vs.leftAt && vs.joinedAt
  );
  const avgWatchTime =
    sessionsWithDuration.length > 0
      ? sessionsWithDuration.reduce((sum, vs) => {
          const duration =
            (new Date(vs.leftAt!).getTime() - new Date(vs.joinedAt).getTime()) /
            1000 /
            60;
          return sum + duration;
        }, 0) / sessionsWithDuration.length
      : 0;

  return {
    broadcast: {
      id: broadcast.id,
      title: broadcast.title,
      description: broadcast.description,
      status: broadcast.status,
      startedAt: broadcast.startedAt,
      endedAt: broadcast.endedAt,
      viewerCount: broadcast.viewerCount,
    },
    analytics: {
      totalViewers: viewerCount,
      totalCheers: cheerCount,
      instagramClicks,
      avgWatchTime: Math.round(avgWatchTime),
      cheerTypeBreakdown: cheerTypes,
    },
  };
}

// ─── Public Broadcast Data ───────────────────────────────────────

export async function getLiveBroadcast() {
  const broadcast = await prisma.broadcast.findFirst({
    where: { status: "LIVE" },
    include: {
      event: { include: { sport: true } },
      cheers: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      _count: {
        select: { cheers: true, viewerSessions: true },
      },
    },
  });

  if (!broadcast) return null;

  return {
    id: broadcast.id,
    title: broadcast.title,
    description: broadcast.description,
    streamUrl: broadcast.streamUrl,
    thumbnail: broadcast.thumbnail,
    status: broadcast.status,
    startedAt: broadcast.startedAt,
    viewerCount: broadcast.viewerCount,
    chatEnabled: broadcast.chatEnabled,
    cheerEnabled: broadcast.cheerEnabled,
    instagramGateEnabled: broadcast.instagramGateEnabled,
    event: broadcast.event
      ? {
          id: broadcast.event.id,
          name: broadcast.event.name,
          sport: broadcast.event.sport,
          category: broadcast.event.category,
          venue: broadcast.event.venue,
          startTime: broadcast.event.startTime,
        }
      : null,
    recentCheers: broadcast.cheers,
    cheerCount: broadcast._count.cheers,
    viewerSessionCount: broadcast._count.viewerSessions,
  };
}

// ─── Cheer Aggregation ───────────────────────────────────────────

export async function getCheerStats(broadcastId: string) {
  const [cheerCount, cheerTypeBreakdown, mostCheeredAthletes] = await Promise.all([
    prisma.cheer.count({ where: { broadcastId } }),
    prisma.cheer.groupBy({
      by: ["type"],
      where: { broadcastId },
      _count: { type: true },
      orderBy: { _count: { type: "desc" } },
    }),
    prisma.cheer.groupBy({
      by: ["studentId"],
      where: { broadcastId, studentId: { not: null } },
      _count: { studentId: true },
      orderBy: { _count: { studentId: "desc" } },
      take: 5,
    }),
  ]);

  const mostCheered = await Promise.all(
    mostCheeredAthletes.map(async (mc) => {
      const student = await prisma.student.findUnique({
        where: { id: mc.studentId! },
        select: { name: true, photoUrl: true },
      });
      return {
        studentId: mc.studentId,
        name: student?.name || "Unknown",
        photoUrl: student?.photoUrl,
        cheerCount: mc._count.studentId,
      };
    })
  );

  return {
    totalCheers: cheerCount,
    byType: cheerTypeBreakdown.map((ct) => ({
      type: ct.type,
      count: ct._count.type,
    })),
    mostCheered,
  };
}
