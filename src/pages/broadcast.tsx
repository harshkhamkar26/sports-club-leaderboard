import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import CinematicBackground from "@/components/cinema/CinematicBackground";
import { getLiveBroadcast } from "@/lib/analytics";
import InstagramGate from "@/components/broadcast/InstagramGate";
import BroadcastPlayer from "@/components/broadcast/BroadcastPlayer";
import CheerButton, { CHEER_CONFIG, CheerType } from "@/components/broadcast/CheerButton";
import CheerTicker from "@/components/broadcast/CheerTicker";
import CrowdEnergy from "@/components/broadcast/CrowdEnergy";

import { getRankings } from "@/lib/rankings";

export async function getServerSideProps() {
  try {
    const broadcast = await getLiveBroadcast();
    const rankings = await getRankings();
    
    // Get top 5 overall leaders
    const topLeaders = rankings.slice(0, 5);

    return {
      props: {
        broadcast: broadcast ? JSON.parse(JSON.stringify(broadcast)) : null,
        leaders: JSON.parse(JSON.stringify(topLeaders)),
      },
    };
  } catch (error) {
    console.error("Failed to fetch live broadcast:", error);
    return {
      props: {
        broadcast: null,
        leaders: [],
      },
    };
  }
}

interface Cheer {
  id: string;
  type: string;
  sessionId: string | null;
  createdAt: string;
}

interface BroadcastData {
  id: string;
  title: string;
  description: string | null;
  streamUrl: string | null;
  thumbnail: string | null;
  status: string;
  startedAt: string | null;
  viewerCount: number;
  chatEnabled: boolean;
  cheerEnabled: boolean;
  instagramGateEnabled: boolean;
  event: {
    id: string;
    name: string;
    sport: { name: string } | null;
    category: string | null;
    venue: string | null;
    startTime: string | null;
  } | null;
  recentCheers: Cheer[];
  cheerCount: number;
  viewerSessionCount: number;
}

export default function BroadcastPage({ broadcast, leaders = [] }: { broadcast: BroadcastData | null, leaders?: any[] }) {
  const [unlocked, setUnlocked] = useState(false);
  const [cheers, setCheers] = useState<Cheer[]>(broadcast?.recentCheers || []);
  const [cheerCount, setCheerCount] = useState(broadcast?.cheerCount || 0);
  const [viewerCount, setViewerCount] = useState(broadcast?.viewerCount || 0);
  const [sessionId, setSessionId] = useState("");
  const [isSendingCheer, setIsSendingCheer] = useState<CheerType | null>(null);
  const [currentScore, setCurrentScore] = useState<{ teamA: number; teamB: number }>({ teamA: 42, teamB: 39 });
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Generate session ID
  useEffect(() => {
    let sid = localStorage.getItem("broadcast_session_id");
    if (!sid) {
      sid = `viewer_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem("broadcast_session_id", sid);
    }
    setSessionId(sid);

    // Record viewer session
    if (broadcast) {
      fetch("/api/viewer-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, instagramFollowed: false }),
      }).catch(console.error);
    }
  }, [broadcast]);

  // Poll for new cheers and viewer count
  useEffect(() => {
    if (!broadcast) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/cheers?broadcastId=${broadcast.id}`);
        if (res.ok) {
          const data = await res.json();
          setCheerCount(data.totalCheers);
          // Prepend new cheers
          if (data.recentCheers && data.recentCheers.length > 0) {
            setCheers((prev) => {
              const newCheers = data.recentCheers.filter(
                (c: Cheer) => !prev.find((p) => p.id === c.id)
              );
              return [...newCheers, ...prev].slice(0, 50);
            });
          }
        }

        // Update viewer count
        const bcRes = await fetch(`/api/broadcasts?id=${broadcast.id}`);
        if (bcRes.ok) {
          const bcData = await bcRes.json();
          setViewerCount(bcData.viewerCount || 0);
        }
      } catch (e) {
        console.error("Poll error:", e);
      }
    };

    poll();
    pollRef.current = setInterval(poll, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [broadcast]);

  const handleCheer = async (type: CheerType) => {
    if (!broadcast || !broadcast.cheerEnabled) return;

    setIsSendingCheer(type);

    try {
      const res = await fetch("/api/cheers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          broadcastId: broadcast.id,
          sessionId,
          type,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newCheer: Cheer = {
          id: data.cheer.id,
          type,
          sessionId,
          createdAt: new Date().toISOString(),
        };
        setCheers((prev) => [newCheer, ...prev].slice(0, 50));
        setCheerCount((prev) => prev + 1);
      }
    } catch (e) {
      console.error("Cheer error:", e);
    } finally {
      setIsSendingCheer(null);
    }
  };

  // If no broadcast is live
  if (!broadcast) {
    return (
      <>
        <Head>
          <title>Broadcast | UAI Sports Network</title>
          <meta name="theme-color" content="#0a0a0a" />
        </Head>
        <div className="relative min-h-screen bg-[#060606] overflow-hidden">
          <CinematicBackground tone="live" />
          <div className="relative z-10 flex min-h-screen items-center justify-center px-5">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-8"
              >
                <span className="text-8xl">📺</span>
                <h1 className="font-display text-5xl font-black uppercase text-white">
                  No Live Broadcast
                </h1>
                <p className="font-sans text-lg text-white/50 max-w-md">
                  There are no live broadcasts at this time. Check back soon for
                  the next UAI Sports Network event.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Broadcast | UAI Sports Network</title>
        <meta name="theme-color" content="#0a0a0a" />
        <meta
          name="description"
          content={`Watch ${broadcast.title} live on UAI Sports Network. Follow @SPORTSCLUB_UAI to unlock.`}
        />
      </Head>

      <div className="relative min-h-screen bg-[#060606] overflow-hidden font-sans">
        <CinematicBackground tone="live" />

        {/* HEADER */}
        <header className="relative z-20 w-full flex justify-between items-center sm:items-start p-4 sm:p-6 md:p-12 gap-4">
          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
              <span className="flex items-center gap-2 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40 px-3 sm:px-4 py-1 sm:py-1.5 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#ef4444]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]"></span>
                </span>
                LIVE
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/50">
                Season 2026–2027
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-wide text-white truncate">
              UAI SPORTS NETWORK
            </h1>
          </div>
          <img
            src="/images/sports-club-logo.png"
            alt="UAI Sports Club"
            className="h-9 sm:h-12 w-auto object-contain opacity-50 shrink-0"
          />
        </header>

        {/* MAIN CONTENT */}
        <main className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-5 md:px-10 pb-24">
          {/* Desktop: Two-column layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8">
            {/* Video + Event Info (8 cols) */}
            <div className="lg:col-span-8">
              <BroadcastPlayer
                streamUrl={broadcast.streamUrl}
                thumbnail={broadcast.thumbnail}
                title={broadcast.title}
                description={broadcast.description}
                status={broadcast.status}
                startedAt={broadcast.startedAt}
                event={broadcast.event}
              />

              {/* Crowd Energy */}
              <div className="mt-8">
                <CrowdEnergy cheerCount={cheerCount} maxCheerCount={500} />
              </div>
            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Top Student Leaders */}
              {leaders && leaders.length > 0 && (
                <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#111]/80 p-6 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-8xl">emoji_events</span>
                  </div>
                  <h3 className="font-display text-sm font-bold uppercase text-[#D4AF37] mb-4 tracking-widest flex items-center gap-2 relative z-10">
                    <span className="material-symbols-outlined text-sm">leaderboard</span>
                    Championship Leaders
                  </h3>
                  <div className="space-y-3 relative z-10">
                    {leaders.map((leader, idx) => (
                      <div key={leader.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/60'}`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{leader.name}</div>
                            <div className="text-[10px] text-white/50 uppercase tracking-wide">{leader.school?.name || leader.rollNumber}</div>
                          </div>
                        </div>
                        <div className="font-display font-black text-lg text-[#D4AF37]">
                          {leader.totalPoints}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Score */}
              <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-6 backdrop-blur-sm">
                <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-4 tracking-widest">
                  CURRENT MATCH
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-lg font-bold text-white">Team A</span>
                    <span className="font-display text-3xl font-black text-[#D4AF37]">
                      {currentScore.teamA}
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-lg font-bold text-white">Team B</span>
                    <span className="font-display text-3xl font-black text-[#D4AF37]">
                      {currentScore.teamB}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cheer Buttons */}
              <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-6 backdrop-blur-sm">
                <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-4 tracking-widest">
                  🔥 CHEER THE ATHLETES
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(CHEER_CONFIG).map(([type, config]) => (
                    <CheerButton
                      key={type}
                      type={type as CheerType}
                      label={config.label}
                      icon={config.icon}
                      color={config.color}
                      onClick={handleCheer}
                      disabled={isSendingCheer === type}
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="font-display text-2xl font-bold text-[#D4AF37]">
                    {cheerCount}
                  </span>
                  <span className="font-sans text-xs uppercase tracking-widest text-white/40">
                    cheers
                  </span>
                </div>
              </div>

              {/* Live Chat / Cheers */}
              <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-6 backdrop-blur-sm">
                <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-4 tracking-widest">
                  LIVE CHAT / CHEERS
                </h3>
                <CheerTicker cheers={cheers} totalCheers={cheerCount} />
              </div>

              {/* Viewer Count */}
              <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                <span className="font-sans text-xs uppercase tracking-widest text-white/40">
                  LIVE VIEWERS
                </span>
                <span className="font-display text-xl font-bold text-[#60a5fa]">
                  {viewerCount}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden flex flex-col gap-6">
            {/* Video */}
            <BroadcastPlayer
              streamUrl={broadcast.streamUrl}
              thumbnail={broadcast.thumbnail}
              title={broadcast.title}
              description={broadcast.description}
              status={broadcast.status}
              startedAt={broadcast.startedAt}
              event={broadcast.event}
            />

            {/* Viewer Count (Mobile) */}
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
              <span className="font-sans text-xs uppercase tracking-widest text-white/40">
                LIVE VIEWERS
              </span>
              <span className="font-display text-xl font-bold text-[#60a5fa]">
                {viewerCount}
              </span>
            </div>

            {/* Top Student Leaders (Mobile) */}
            {leaders && leaders.length > 0 && (
              <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#111]/80 p-5 sm:p-6 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-7xl">emoji_events</span>
                </div>
                <h3 className="font-display text-sm font-bold uppercase text-[#D4AF37] mb-4 tracking-widest flex items-center gap-2 relative z-10">
                  <span className="material-symbols-outlined text-sm">leaderboard</span>
                  Championship Leaders
                </h3>
                <div className="space-y-2.5 relative z-10">
                  {leaders.map((leader, idx) => (
                    <div key={leader.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${idx === 0 ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/60'}`}>
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm truncate">{leader.name}</div>
                          <div className="text-[10px] text-white/50 uppercase tracking-wide truncate">{leader.school?.name || leader.rollNumber}</div>
                        </div>
                      </div>
                      <div className="font-display font-black text-lg text-[#D4AF37] shrink-0 ml-2">
                        {leader.totalPoints}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Info */}
            <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-5 sm:p-6 backdrop-blur-sm">
              <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-4 tracking-widest">
                EVENT INFO
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-sans text-xs uppercase tracking-widest text-white/40">
                    Sport
                  </span>
                  <p className="font-sans text-base sm:text-lg font-bold text-white">
                    {broadcast.event?.sport?.name || "Sports"}
                  </p>
                </div>
                <div>
                  <span className="font-sans text-xs uppercase tracking-widest text-white/40">
                    Category
                  </span>
                  <p className="font-sans text-base sm:text-lg font-bold text-white">
                    {broadcast.event?.category || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-sans text-xs uppercase tracking-widest text-white/40">
                    Venue
                  </span>
                  <p className="font-sans text-base sm:text-lg font-bold text-white">
                    {broadcast.event?.venue || "TBD"}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Score */}
            <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-5 sm:p-6 backdrop-blur-sm">
              <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-4 tracking-widest">
                CURRENT SCORE
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-base sm:text-lg font-bold text-white">Team A</span>
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#D4AF37]">
                    {currentScore.teamA}
                  </span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex items-center justify-between">
                  <span className="font-sans text-base sm:text-lg font-bold text-white">Team B</span>
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#D4AF37]">
                    {currentScore.teamB}
                  </span>
                </div>
              </div>
            </div>

            {/* Cheer Bar */}
            <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-5 sm:p-6 backdrop-blur-sm">
              <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-4 tracking-widest">
                🔥 CHEER THE ATHLETES
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                {Object.entries(CHEER_CONFIG).map(([type, config]) => (
                  <CheerButton
                    key={type}
                    type={type as CheerType}
                    label={config.label}
                    icon={config.icon}
                    color={config.color}
                    onClick={handleCheer}
                    disabled={isSendingCheer === type}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="font-display text-2xl font-bold text-[#D4AF37]">
                  {cheerCount}
                </span>
                <span className="font-sans text-xs uppercase tracking-widest text-white/40">
                  cheers
                </span>
              </div>
              <CrowdEnergy cheerCount={cheerCount} maxCheerCount={500} />
            </div>

            {/* Live Chat */}
            <div className="rounded-2xl border border-white/10 bg-[#111]/60 p-5 sm:p-6 backdrop-blur-sm">
              <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-4 tracking-widest">
                LIVE CHAT
              </h3>
              <CheerTicker cheers={cheers} totalCheers={cheerCount} />
            </div>
          </div>
        </main>

        {/* Instagram Gate */}
        {broadcast.instagramGateEnabled && !unlocked && (
          <InstagramGate
            onUnlock={() => setUnlocked(true)}
            broadcastTitle={broadcast.title}
          />
        )}
      </div>
    </>
  );
}
