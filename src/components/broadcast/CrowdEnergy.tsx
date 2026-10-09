import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CrowdEnergyProps {
  cheerCount: number;
  maxCheerCount?: number;
  isActive?: boolean;
}

const ENERGY_LEVELS = [
  { label: "LOW", color: "#3B82F6", threshold: 0 },
  { label: "WARM", color: "#F59E0B", threshold: 25 },
  { label: "HOT", color: "#EF4444", threshold: 50 },
  { label: "SCORCHING", color: "#D4AF37", threshold: 75 },
  { label: "MAXIMUM", color: "#FF10F0", threshold: 100 },
];

export default function CrowdEnergy({
  cheerCount,
  maxCheerCount = 200,
  isActive = true,
}: CrowdEnergyProps) {
  const [energyPercent, setEnergyPercent] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const percent = Math.min(Math.round((cheerCount / maxCheerCount) * 100), 100);
    setEnergyPercent(percent);
  }, [cheerCount, maxCheerCount]);

  // Generate floating particles based on energy
  useEffect(() => {
    if (!isActive) return;

    const particleCount = Math.floor(energyPercent / 5);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, [energyPercent, isActive]);

  const currentLevel =
    ENERGY_LEVELS.filter((l) => energyPercent >= l.threshold).pop() ||
    ENERGY_LEVELS[0];

  return (
    <div className="relative flex flex-col items-center gap-4 py-6">
      {/* Energy label */}
      <div className="flex items-center gap-2">
        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/40">
          LIVE CROWD ENERGY
        </span>
        <span
          className="font-display text-sm font-bold"
          style={{ color: currentLevel.color }}
        >
          {currentLevel.label}
        </span>
      </div>

      {/* Energy bars */}
      <div className="flex items-end gap-1 h-16 w-full max-w-md">
        {Array.from({ length: 10 }).map((_, i) => {
          const barHeight = Math.min(
            Math.floor(energyPercent / 10),
            10
          );
          const isActiveBar = i < barHeight;
          const delay = i * 0.1;

          return (
            <motion.div
              key={i}
              className="flex-1 rounded-sm relative overflow-hidden"
              style={{
                backgroundColor: isActiveBar
                  ? currentLevel.color
                  : "rgba(255,255,255,0.05)",
                height: "100%",
              }}
              initial={{ height: "0%" }}
              animate={{
                height: isActiveBar ? `${(barHeight / 10) * 100}%` : "0%",
              }}
              transition={{ duration: 0.8, delay }}
            >
              {isActiveBar && (
                <motion.div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background: `linear-gradient(180deg, transparent 0%, ${currentLevel.color}40 100%)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Percentage */}
      <div className="flex items-center gap-3">
        <span className="font-display text-3xl font-bold text-white">
          {energyPercent}%
        </span>
        <span className="font-sans text-xs uppercase tracking-widest text-white/40">
          UAI SUPPORT
        </span>
      </div>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: currentLevel.color,
            boxShadow: `0 0 6px ${currentLevel.color}`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 2 + (p.id % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.id * 0.1,
          }}
        />
      ))}
    </div>
  );
}
