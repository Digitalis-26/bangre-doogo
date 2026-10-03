'use client';

import React from 'react';
import { motion } from 'motion/react';

export function AnimatedGreenGoldBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-gradient-to-b from-[#062116] via-[#092e1e] to-[#04150e]">
      {/* Dynamic Animated Ambient Mesh / Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1],
          rotate: [0, 45, 90, 0],
          opacity: [0.35, 0.55, 0.4, 0.35],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-1/4 -left-1/4 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-[#10b981]/40 via-[#059669]/25 to-transparent blur-[120px]"
      />

      {/* Floating Radiant Gold Orb - Top Right */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 70, -30, 0],
          scale: [1, 1.25, 0.9, 1],
          opacity: [0.4, 0.7, 0.5, 0.4],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-10 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#f59e0b]/35 via-[#d97706]/20 to-transparent blur-[110px]"
      />

      {/* Deep Emerald Orb - Bottom Center / Left */}
      <motion.div
        animate={{
          x: [0, 70, -50, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.18, 0.92, 1],
          opacity: [0.3, 0.6, 0.45, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute -bottom-20 left-10 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#047857]/40 via-[#10b981]/20 to-transparent blur-[130px]"
      />

      {/* Warm Golden Core Shimmer - Center Ambient */}
      <motion.div
        animate={{
          scale: [0.9, 1.2, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/15 to-emerald-400/20 blur-[100px]"
      />

      {/* Subtle Golden Ray Stream */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          rotate: [-15, -10, -15],
          x: [-20, 20, -20],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 left-1/4 w-[900px] h-32 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent blur-2xl transform -rotate-12"
      />

      {/* Subtle Sacred / Geometric Pattern Texture */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fbbf24 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Floating Golden Sparks / Light Specks */}
      {[...Array(14)].map((_, i) => {
        const leftPercent = ((i * 7 + 13) % 94) + 3;
        const initialTopPercent = ((i * 11 + 7) % 88) + 6;
        const size = (i % 3) + 2.5;
        const duration = 9 + (i % 7) * 2;
        const delay = (i * 1.3) % 5;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, y: 0 }}
            animate={{
              opacity: [0.1, 0.85, 0.1],
              y: [-15, -80, -15],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }}
            style={{
              left: `${leftPercent}%`,
              top: `${initialTopPercent}%`,
              width: `${size}px`,
              height: `${size}px`,
            }}
            className="absolute rounded-full bg-gradient-to-r from-amber-300 to-yellow-200 shadow-[0_0_8px_#f59e0b]"
          />
        );
      })}

      {/* Vignette Edge Shading */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />
    </div>
  );
}
