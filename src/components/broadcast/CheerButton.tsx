import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type CheerType = "CLAP" | "FIRE" | "GO" | "CHAMPIONS" | "SUPPORT";

interface CheerButtonProps {
  type: CheerType;
  label: string;
  icon: string;
  color: string;
  onClick: (type: CheerType) => void;
  disabled?: boolean;
}

const CHEER_CONFIG: Record<CheerType, { label: string; icon: string; color: string }> = {
  CLAP: { label: "LET'S GO!", icon: "👏", color: "#3B82F6" },
  FIRE: { label: "FIRE!", icon: "🔥", color: "#EF4444" },
  GO: { label: "COME ON UAi!", icon: "💪", color: "#10B981" },
  CHAMPIONS: { label: "CHAMPIONS!", icon: "🏆", color: "#D4AF37" },
  SUPPORT: { label: "SUPPORT!", icon: "❤️", color: "#EC4899" },
};

export default function CheerButton({
  type,
  label,
  icon,
  color,
  onClick,
  disabled,
}: CheerButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled || isAnimating) return;
    setIsAnimating(true);
    onClick(type);

    // Reset animation state
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`relative flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-4 py-2.5 sm:py-3 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      <span className="text-base sm:text-lg shrink-0">{icon}</span>
      <span className="truncate">{label}</span>

      {/* Particle burst on click */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-xs pointer-events-none"
                style={{ color }}
                initial={{
                  opacity: 1,
                  scale: 0.5,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 1.5,
                  x: Math.cos((i * Math.PI) / 4) * 30,
                  y: Math.sin((i * Math.PI) / 4) * 30,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {icon}
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export { CHEER_CONFIG };
