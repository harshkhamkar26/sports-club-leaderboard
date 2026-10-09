import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InstagramGateProps {
  onUnlock: () => void;
  broadcastTitle?: string;
}

export default function InstagramGate({ onUnlock, broadcastTitle }: InstagramGateProps) {
  const [hasFollowed, setHasFollowed] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Generate or retrieve session ID
    let sid = localStorage.getItem("broadcast_session_id");
    if (!sid) {
      sid = `viewer_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem("broadcast_session_id", sid);
    }
    setSessionId(sid);

    // Check if already unlocked in this session
    const unlocked = localStorage.getItem("instagram_unlocked");
    if (unlocked) {
      setHasFollowed(true);
      setTimeout(() => onUnlock(), 500);
    }
  }, [onUnlock]);

  const handleFollowClick = () => {
    setIsRedirecting(true);
    // Open Instagram in a new tab
    window.open("https://www.instagram.com/sportsclub_uai/", "_blank");

    // Simulate return after user clicks "I've followed"
    setTimeout(() => {
      setIsRedirecting(false);
    }, 1000);
  };

  const handleConfirmFollow = async () => {
    setHasFollowed(true);
    localStorage.setItem("instagram_unlocked", "true");

    // Record viewer session
    try {
      await fetch("/api/viewer-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          instagramFollowed: true,
        }),
      });
    } catch (e) {
      console.error("Failed to record viewer session:", e);
    }

    // Unlock after brief animation
    setTimeout(() => onUnlock(), 800);
  };

  return (
    <AnimatePresence>
      {!hasFollowed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative mx-auto my-auto w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111] p-6 sm:p-8 text-center shadow-2xl"
          >
            {/* Lock icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
              className="mb-4 sm:mb-6 flex justify-center"
            >
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                <span className="text-3xl sm:text-4xl">🔒</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-2xl font-black uppercase text-white mb-2"
            >
              BROADCAST LOCKED
            </motion.h2>

            {broadcastTitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-sans text-sm font-light text-white/60 mb-6"
              >
                {broadcastTitle}
              </motion.p>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-xs text-white/50 mb-8 leading-relaxed"
            >
              Follow the official Sports Club Instagram to unlock the broadcast.
            </motion.p>

            {/* Instagram handle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3"
            >
              <span className="text-xl">📱</span>
              <span className="font-sans text-sm font-bold text-white">@SPORTSCLUB_UAI</span>
            </motion.div>

            {/* Follow button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={handleFollowClick}
              disabled={isRedirecting}
              className="mb-4 w-full rounded-xl bg-gradient-to-r from-[#833AB8] via-[#E1306C] to-[#F77700] px-6 py-4 font-sans text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {isRedirecting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ↻
                  </motion.span>
                  Opening Instagram...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  FOLLOW ON INSTAGRAM
                  <span>↗</span>
                </span>
              )}
            </motion.button>

            {/* I've followed button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={handleConfirmFollow}
              className="w-full rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest text-[#D4AF37] transition-all hover:bg-[#D4AF37]/20"
            >
              I'VE FOLLOWED ✓
            </motion.button>

            {/* QR Code placeholder for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 flex flex-col items-center gap-2"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                {/* Simple QR representation */}
                <div className="grid grid-cols-3 gap-[2px] h-16 w-16">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/80"
                      style={{
                        opacity: Math.random() > 0.3 ? 1 : 0.3,
                        transform: `scale(${0.8 + Math.random() * 0.4})`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                QR Code for Mobile Users
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
