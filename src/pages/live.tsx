import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import CinematicBackground from "@/components/cinema/CinematicBackground";
import SpotyIntro from "@/components/spoty/SpotyIntro";
import {
  LIVE_DISPLAY_CONFIG,
  getLiveDisplayData,
  LiveAthlete,
  LiveSchool,
  LiveEventInfo,
} from "@/lib/liveDisplay";

export async function getServerSideProps() {
  try {
    const data = await getLiveDisplayData();
    return {
      props: {
        initialData: JSON.parse(JSON.stringify(data)),
      },
    };
  } catch (error) {
    console.error("Failed to fetch live display data:", error);
    return {
      props: {
        initialData: { maleLeader: null, femaleLeader: null, schools: [], activeEvent: null },
      },
    };
  }
}

type Screen = "intro" | "male" | "female" | "schools";

export default function LiveTVPage({
  initialData,
}: {
  initialData: {
    maleLeader: LiveAthlete | null;
    femaleLeader: LiveAthlete | null;
    schools: LiveSchool[];
    activeEvent: LiveEventInfo | null;
  };
}) {
  const [data, setData] = useState(initialData);
  const [screen, setScreen] = useState<Screen>("intro");
  const [isDisplayMode, setIsDisplayMode] = useState(false);
  const [showControlsInDisplay, setShowControlsInDisplay] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [clock, setClock] = useState(new Date());
  
  // Phase state for SpotyIntro timeline
  const [introPhase, setIntroPhase] = useState(0);

  const screenIndexRef = useRef(0);
  const rotationRef = useRef<NodeJS.Timeout | null>(null);
  const refreshRef = useRef<NodeJS.Timeout | null>(null);
  const clockRef = useRef<NodeJS.Timeout | null>(null);

  const SCREENS: Screen[] = ["intro", "male", "female", "schools"];

  const getDuration = (s: Screen): number => {
    switch (s) {
      case "intro":
        return 7500; // wait 7.5s for intro to finish playing
      case "male":
        return LIVE_DISPLAY_CONFIG.maleDuration;
      case "female":
        return LIVE_DISPLAY_CONFIG.femaleDuration;
      case "schools":
        return LIVE_DISPLAY_CONFIG.schoolDuration;
    }
  };

  const goToNext = useCallback(() => {
    screenIndexRef.current = (screenIndexRef.current + 1) % SCREENS.length;
    setScreen(SCREENS[screenIndexRef.current]);
  }, []);

  const goToPrev = useCallback(() => {
    screenIndexRef.current =
      (screenIndexRef.current - 1 + SCREENS.length) % SCREENS.length;
    setScreen(SCREENS[screenIndexRef.current]);
  }, []);

  const goToScreen = useCallback((s: Screen) => {
    screenIndexRef.current = SCREENS.indexOf(s);
    setScreen(s);
  }, []);

  // Clock
  useEffect(() => {
    clockRef.current = setInterval(() => setClock(new Date()), 1000);
    return () => {
      if (clockRef.current) clearInterval(clockRef.current);
    };
  }, []);

  // Intro Timeline
  useEffect(() => {
    if (screen !== "intro") return;
    const TIMELINE = [
      { phase: 1, at: 500 },   // university identity
      { phase: 2, at: 2500 },  // PRESENTS
      { phase: 3, at: 4000 },  // LIVE DISPLAY
      { phase: 4, at: 6500 },  // year -> finish
    ];
    const timers: NodeJS.Timeout[] = [];
    TIMELINE.forEach((step) => {
      timers.push(
        setTimeout(() => {
          setIntroPhase(step.phase);
        }, step.at)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [screen]);

  // Rotation
  useEffect(() => {
    if (isPaused) return;

    const duration = getDuration(screen);
    rotationRef.current = setTimeout(goToNext, duration);

    return () => {
      if (rotationRef.current) clearTimeout(rotationRef.current);
    };
  }, [screen, isPaused, goToNext]);

  // Data refresh
  useEffect(() => {
    refreshRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/live-display");
        if (res.ok) {
          const fresh = await res.json();
          if (fresh) setData(JSON.parse(JSON.stringify(fresh)));
        }
      } catch (e) {
        console.error("Refresh error:", e);
      }
    }, LIVE_DISPLAY_CONFIG.refreshInterval);

    return () => {
      if (refreshRef.current) clearInterval(refreshRef.current);
    };
  }, []);

  // Fullscreen mode
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Display Mode controls visibility: auto-hide during presentation, show on movement/touch
  useEffect(() => {
    if (!isDisplayMode) {
      setShowControlsInDisplay(true);
      return;
    }
    setShowControlsInDisplay(true);
    let timeout: NodeJS.Timeout;
    const handleActivity = () => {
      setShowControlsInDisplay(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControlsInDisplay(false);
      }, 3500);
    };
    timeout = setTimeout(() => {
      setShowControlsInDisplay(false);
    }, 3500);

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [isDisplayMode]);

  // Keyboard controls: F = fullscreen, D = display mode, arrows = nav, P = pause, ESC = exit
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      }
      if (e.key === "d" || e.key === "D") setIsDisplayMode((prev) => !prev);
      if (e.key === "Escape" && isDisplayMode) setIsDisplayMode(false);
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "p" || e.key === "P") setIsPaused((p) => !p);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToNext, goToPrev, isDisplayMode]);

  const { maleLeader, femaleLeader, schools, activeEvent } = data;

  return (
    <>
      <Head>
        <title>UAI SPORTS LIVE — Digital Broadcast</title>
        <meta name="theme-color" content="#060606" />
      </Head>

      {/* TV Frame */}
      <div
        className="relative min-h-screen flex flex-col justify-between bg-[#060606] text-white overflow-hidden font-sans selection:bg-transparent"
        style={{ cursor: isDisplayMode && !showControlsInDisplay ? "none" : undefined }}
      >
        {/* Cinematic Background */}
        {screen !== "intro" && <CinematicBackground tone="live" />}

        {/* TV Header Bar — Persistent across all states */}
        <header
          className="relative z-20 flex items-center justify-between px-4 sm:px-6 md:px-12 py-3 sm:py-4 bg-black/40 backdrop-blur-md"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Left: Branding — Official Universal AI University & UAI Sports Club */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <img
              src="/images/uaiu-logo.png"
              alt="Universal AI University"
              className="h-6 sm:h-8 md:h-10 w-auto object-contain opacity-95 shrink-0 max-w-[110px] xs:max-w-[140px] sm:max-w-none"
            />
            <span className="h-5 sm:h-7 w-px bg-white/20 shrink-0 hidden xs:block" />
            <img
              src="/images/sports-club-logo.png"
              alt="UAI Sports Club"
              className="h-7 sm:h-9 md:h-10 w-auto object-contain opacity-90 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-display text-xs sm:text-sm md:text-lg font-black uppercase tracking-[0.15em] text-white truncate">
                UAI Sports Club
              </span>
              {activeEvent ? (
                <span className="font-sans text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#D4AF37] truncate">
                  {activeEvent.sport?.name || "Sports"} • Season 2026–2027
                </span>
              ) : (
                <span className="font-sans text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40 truncate">
                  Season 2026–2027 • Live Display
                </span>
              )}
            </div>
          </div>

          {/* Right: Skip Intro (during intro) + LIVE indicator + Clock (Always unobstructed) */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            {screen === "intro" && (
              <button
                type="button"
                onClick={() => goToScreen("male")}
                className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-[#07152E]/70 px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#AAB6C8] backdrop-blur-md transition-all hover:border-[#D4AF37]/50 hover:bg-[#07152E]/90 hover:text-[#D4AF37]"
                aria-label="Skip introduction"
              >
                <span>Skip</span>
                <span className="hidden xs:inline">intro</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 px-2.5 sm:px-4 py-1 sm:py-1.5">
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#ef4444]"></span>
              </span>
              <span className="font-sans text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#ef4444]">
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="font-data-tabular text-sm sm:text-lg md:text-xl font-bold text-white/80">
                {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="hidden sm:inline font-sans text-[10px] uppercase tracking-widest text-white/40">
                {clock.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
              </span>
            </div>
          </div>
        </header>

        {/* Event Banner — if real event exists */}
        {activeEvent && LIVE_DISPLAY_CONFIG.showEventBanner && (
          <div className="relative z-10 mx-auto max-w-[1600px] w-full px-4 sm:px-6 md:px-12 mt-3">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-5 py-2.5">
              <span className="flex items-center gap-2 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ef4444]">
                Live Event
              </span>
              <span className="font-display text-sm md:text-lg font-bold uppercase text-white truncate">
                {activeEvent.name}
              </span>
              {activeEvent.category && (
                <span className="hidden md:inline font-sans text-xs text-white/50">
                  {activeEvent.category}
                </span>
              )}
              {activeEvent.venue && (
                <span className="hidden lg:inline-flex items-center gap-1 font-sans text-xs text-white/40 ml-auto">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  {activeEvent.venue}
                </span>
              )}
            </div>
          </div>
        )}

        {/* MAIN DISPLAY AREA */}
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center w-full min-h-[calc(100vh-220px)] pb-24 sm:pb-28 px-4 sm:px-6 md:px-12">
          {screen === "intro" ? (
            <SpotyIntro 
              phase={introPhase} 
              onComplete={() => goToScreen("male")} 
              title1="LIVE" 
              title2="DISPLAY" 
              title3="OS" 
              isLiveDisplay
            />
          ) : (
            <section className="relative z-10 w-full max-w-[1600px] flex flex-col items-center justify-center my-auto">
              <AnimatePresence mode="wait">
                {screen === "male" && (
                  <AthleteScreen
                    key="male"
                    athlete={maleLeader}
                    accent="gold"
                    category="SPORTSMAN"
                  />
                )}
                {screen === "female" && (
                  <AthleteScreen
                    key="female"
                    athlete={femaleLeader}
                    accent="ultraviolet"
                    category="SPORTSWOMAN"
                  />
                )}
                {screen === "schools" && <SchoolScreen key="schools" schools={schools} />}
              </AnimatePresence>
            </section>
          )}
        </main>

        {/* Ticker */}
        {LIVE_DISPLAY_CONFIG.tickerEnabled && (
          <LiveTicker
            maleLeader={maleLeader}
            femaleLeader={femaleLeader}
            schools={schools}
            activeEvent={activeEvent}
          />
        )}

        {/* Bottom Control Bar — Integrated Display Mode and TV Controls */}
        <div
          className={`fixed bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2.5 bg-black/75 backdrop-blur-xl rounded-full border border-white/15 px-3 py-1.5 sm:px-4 sm:py-2 shadow-[0_10px_35px_rgba(0,0,0,0.8)] max-w-[calc(100vw-24px)] overflow-x-auto no-scrollbar control-bar ${
            isDisplayMode && !showControlsInDisplay ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <button
            onClick={goToPrev}
            className="px-2.5 sm:px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-semibold transition shrink-0 active:scale-95"
            title="Previous Screen"
          >
            ← Prev
          </button>
          <button
            onClick={() => setIsPaused((p) => !p)}
            className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition shrink-0 active:scale-95 ${
              isPaused
                ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
                : "bg-white/15 hover:bg-white/25 text-white"
            }`}
          >
            {isPaused ? "▶ Resume" : "❚❚ Pause"}
          </button>
          <button
            onClick={goToNext}
            className="px-2.5 sm:px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-semibold transition shrink-0 active:scale-95"
            title="Next Screen"
          >
            Next →
          </button>
          <button
            onClick={() => goToScreen("male")}
            className="px-2.5 sm:px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-semibold transition shrink-0 hidden xs:inline-flex active:scale-95"
            title="Restart Rotation"
          >
            ⟳ Restart
          </button>

          <span className="h-4 w-px bg-white/20 shrink-0 mx-0.5" />

          {/* Repositioned Enter / Exit Display Mode Button */}
          <button
            onClick={() => setIsDisplayMode((d) => !d)}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 active:scale-95 ${
              isDisplayMode
                ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/30"
            }`}
            title={isDisplayMode ? "Exit Display Mode (Esc)" : "Enter Display Mode (D)"}
          >
            <span className="material-symbols-outlined text-xs sm:text-sm">
              {isDisplayMode ? "fullscreen_exit" : "fullscreen"}
            </span>
            <span>{isDisplayMode ? "Exit Display Mode" : "Enter Display Mode"}</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .control-bar {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .control-bar:hover,
        .control-bar:focus-within {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
      `}</style>
    </>
  );
}

// ─── ATHLETE SCREEN ───────────────────────────────────────────────

function AthleteScreen({
  athlete,
  category,
  accent = "gold",
}: {
  athlete: LiveAthlete | null;
  category: string;
  accent?: "gold" | "ultraviolet";
}) {
  const accentColor = accent === "gold" ? "#D4AF37" : "#8B5CF6";

  if (!athlete) {
    return (
      <motion.div
        key={`fallback-${category}`}
        initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-8 text-center max-w-3xl mx-auto"
      >
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/10 bg-white/[0.03] shadow-[0_0_50px_rgba(212,175,55,0.15)]">
          <span className="text-5xl">🏅</span>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4">
            <span className="material-symbols-outlined text-[#D4AF37] text-sm">emoji_events</span>
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              UAI Athletics Championship • Season 2026–2027
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white mb-3">
            SPORTS PERSON <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF2B2] to-[#D4AF37]">OF THE YEAR</span>
          </h1>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/50">
            {category} • LEADER TO BE ANNOUNCED
          </p>
        </div>
      </motion.div>
    );
  }

  const firstName = athlete.name.split(" ")[0];
  const lastName = athlete.name.split(" ").slice(1).join(" ");

  return (
    <motion.div
      key={`${category}-${athlete.id}`}
      initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[1600px] flex flex-col md:flex-row items-center gap-8 md:gap-16"
    >
      {/* Left Content */}
      <div className="flex-1 order-2 md:order-1 text-center md:text-left relative z-10">
        {/* Main Feature Heading — SPORTS PERSON OF THE YEAR */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2 sm:mb-3">
            <span className="material-symbols-outlined text-[#D4AF37] text-sm sm:text-base">emoji_events</span>
            <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
              UAI Athletics Championship • Season 2026–2027
            </span>
          </div>

          <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.98]">
            SPORTS PERSON{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF2B2] to-[#D4AF37]">
              OF THE YEAR
            </span>
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-3 mt-3">
            <span className="h-px w-6 sm:w-10 bg-[#D4AF37]/60 hidden md:block" />
            <span
              className={`font-sans text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full ${
                accent === "gold"
                  ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                  : "bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/35 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
              }`}
            >
              {category} LEADER • STANDING #{String(athlete.rank).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        {/* Athlete Name & Standing */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center md:justify-start gap-3 sm:gap-5 mb-2"
        >
          <span
            className={`font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black shrink-0 ${
              accent === "gold"
                ? "text-[#D4AF37] drop-shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                : "text-[#8B5CF6] drop-shadow-[0_0_30px_rgba(139,92,246,0.35)]"
            }`}
          >
            #{String(athlete.rank).padStart(2, "0")}
          </span>
          <div className="text-left min-w-0">
            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-[0.92] tracking-tight break-words">
              {firstName}
              <br />
              {lastName}
            </h2>
          </div>
        </motion.div>

        {/* School & Sport Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2"
        >
          {athlete.sport && (
            <span className="flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold text-white/90">
              <span className="material-symbols-outlined text-sm sm:text-base" style={{ color: accentColor }}>
                {athlete.sport.icon || "sports"}
              </span>
              {athlete.sport.name}
            </span>
          )}
          {athlete.school && (
            <span className="flex items-center gap-1.5 font-sans text-xs sm:text-sm text-white/60">
              <span className="material-symbols-outlined text-xs sm:text-sm text-white/40">school</span>
              {athlete.school.name}
            </span>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Stat value={athlete.totalPoints} label="Points" accentColor={accentColor} big />
          <Stat value={athlete.eventsCount} label="Events" />
          <Stat value={athlete.medals.gold} label="Gold" />
          <Stat value={athlete.podiums} label="Podiums" />
        </motion.div>
      </div>

      {/* Right — Visual */}
      <div className="flex-1 order-1 md:order-2 relative flex items-center justify-center">
        <div
          className="relative h-44 w-44 sm:h-56 sm:w-56 md:h-[36vw] md:w-[36vw] max-w-md max-h-[480px] rounded-full overflow-hidden border shrink-0"
          style={{
            borderColor:
              accent === "gold" ? "rgba(212,175,55,0.35)" : "rgba(139,92,246,0.35)",
            background:
              accent === "gold"
                ? "radial-gradient(circle, rgba(212,175,55,0.12), transparent 70%)"
                : "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)",
          }}
        >
          {athlete.photoUrl ? (
            <motion.img
              src={athlete.photoUrl}
              alt={athlete.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#111] to-[#1a1a1a]">
              <span className="font-display text-7xl font-black text-white/15">
                {firstName[0]}
                {lastName[0]}
              </span>
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow:
              accent === "gold"
                ? "0 0 80px rgba(212,175,55,0.15)"
                : "0 0 80px rgba(139,92,246,0.2)",
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── SCHOOL SCREEN ────────────────────────────────────────────────

function SchoolScreen({ schools }: { schools: LiveSchool[] }) {
  if (!schools || schools.length === 0) {
    return (
      <motion.div
        key="schools-fallback"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <span className="font-display text-6xl">🏆</span>
        <h2 className="font-display text-5xl font-black uppercase text-white">
          School Rankings Coming Soon
        </h2>
      </motion.div>
    );
  }

  const maxPoints = Math.max(...schools.map((s) => s.totalPoints), 1);

  return (
    <motion.div
      key="schools"
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="text-center mb-8 sm:mb-10">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-3">
          UAI School Championship
        </p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tight">
          The Race for Campus Glory
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {schools.slice(0, 5).map((school, i) => {
          const pct = (school.totalPoints / maxPoints) * 100;
          const isFirst = i === 0;

          return (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-8 p-3 sm:p-0 rounded-xl sm:rounded-none bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-0"
            >
              {/* Rank & name */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <span
                  className="font-display text-3xl sm:text-5xl md:text-6xl font-black w-10 sm:w-16 shrink-0 text-center"
                  style={{ color: isFirst ? "#D4AF37" : "rgba(255,255,255,0.15)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="w-auto sm:w-48 md:w-56 min-w-0">
                  <h3
                    className="font-display text-base sm:text-lg md:text-2xl font-bold uppercase text-white truncate"
                    style={{ color: isFirst ? "#D4AF37" : "inherit" }}
                  >
                    {school.name}
                  </h3>
                </div>

                {/* Mobile Points badge */}
                <div className="sm:hidden ml-auto text-right shrink-0">
                  <span className="font-display text-lg font-black text-[#D4AF37]">
                    {school.totalPoints.toLocaleString()}
                  </span>
                  <span className="block font-sans text-[8px] uppercase tracking-widest text-white/40">
                    PTS
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="flex-1 h-3.5 sm:h-5 md:h-8 rounded-full bg-white/[0.04] border border-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full flex items-center justify-end pr-2 sm:pr-3"
                  style={{
                    background: school.color
                      ? `linear-gradient(90deg, ${school.color}50, ${school.color})`
                      : "linear-gradient(90deg, #D4AF3750, #D4AF37)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                >
                  <span className="font-display text-[10px] sm:text-sm md:text-lg font-bold text-white">
                    {school.totalPoints.toLocaleString()}
                  </span>
                </motion.div>
              </div>

              {/* Desktop Points */}
              <div className="hidden sm:block w-24 md:w-28 shrink-0 text-right">
                <span className="font-display text-lg sm:text-xl md:text-3xl font-black text-white">
                  {school.totalPoints.toLocaleString()}
                </span>
                <span className="block font-sans text-[9px] sm:text-[10px] uppercase tracking-widest text-white/40">
                  Points
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────

function LiveTicker({
  maleLeader,
  femaleLeader,
  schools,
  activeEvent,
}: {
  maleLeader: LiveAthlete | null;
  femaleLeader: LiveAthlete | null;
  schools: LiveSchool[];
  activeEvent: LiveEventInfo | null;
}) {
  const items = [
    ...(activeEvent
      ? [`${activeEvent.sport?.name || "SPORTS"} — ${activeEvent.name}`]
      : ["UAI SPORTS LIVE"]),
    maleLeader ? `SPORTSMAN • ${maleLeader.name} — ${maleLeader.totalPoints} PTS` : "",
    femaleLeader ? `SPORTSWOMAN • ${femaleLeader.name} — ${femaleLeader.totalPoints} PTS` : "",
    schools[0] ? `${schools[0].name.toUpperCase()} LEADS THE CAMPUS RACE — ${schools[0].totalPoints} PTS` : "",
    "FOLLOW @SPORTSCLUB_UAI — UNIVERSAL AI UNIVERSITY",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <footer className="relative z-20 h-10 border-t border-white/[0.06] bg-black/50 flex items-center overflow-hidden">
      <div className="flex items-center gap-4 marquee-track whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.2em] text-white/60">
        <span className="flex items-center gap-2 mx-4">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ef4444]"></span>
          </span>
          <span className="text-white/80 font-bold">LIVE</span>
        </span>
        {items}
      </div>
      <style jsx>{`
        .marquee-track {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}

// ─── STAT BLOCK ───────────────────────────────────────────────────

function Stat({
  value,
  label,
  accentColor = "#D4AF37",
  big = false,
}: {
  value: number;
  label: string;
  accentColor?: string;
  big?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
      <span
        className={`font-display font-black tabular-nums ${
          big ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
        }`}
        style={big ? { color: accentColor } : { color: "#fff" }}
      >
        {value.toLocaleString()}
      </span>
      <span className="mt-1 font-sans text-[9px] uppercase tracking-[0.25em] text-white/40">
        {label}
      </span>
    </div>
  );
}