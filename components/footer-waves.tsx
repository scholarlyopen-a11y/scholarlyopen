"use client"

import React from "react"

export function FooterWaves() {
  return (
    <div 
      className="relative w-full overflow-hidden leading-none select-none pointer-events-none -mb-[1px]" 
      style={{ height: "76px", transform: "translateZ(0)" }}
      aria-hidden="true"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes waveMotionBack {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-300px, 3px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes waveMotionMid {
          0% {
            transform: translate3d(-260px, 0, 0);
          }
          50% {
            transform: translate3d(0, -4px, 0);
          }
          100% {
            transform: translate3d(-260px, 0, 0);
          }
        }
        @keyframes waveMotionFront {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-380px, 2px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .footer-wave-back {
          animation: waveMotionBack 22s ease-in-out infinite;
          will-change: transform;
        }
        .footer-wave-mid {
          animation: waveMotionMid 15s ease-in-out infinite;
          will-change: transform;
        }
        .footer-wave-front {
          animation: waveMotionFront 10s ease-in-out infinite;
          will-change: transform;
        }
      `}} />

      <svg
        className="w-[2200px] sm:w-[2600px] h-full block"
        viewBox="0 0 2400 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Layer 1: Luminous Brand Pista Green */}
          <linearGradient id="pistaWaveBack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#85d1a0" stopOpacity="0.80" />
            <stop offset="30%" stopColor="#a3e6b9" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#7ecb98" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#85d1a0" stopOpacity="0.80" />
          </linearGradient>

          {/* Layer 2: Mid Emerald / Leaf Green */}
          <linearGradient id="midBrandWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#245a3c" stopOpacity="0.90" />
            <stop offset="50%" stopColor="#2e734c" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#245a3c" stopOpacity="0.90" />
          </linearGradient>

          {/* Layer 3: Solid Dark Green (Seamlessly merges into footer body) */}
          <linearGradient id="frontDarkGreenWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0b2416" stopOpacity="1" />
            <stop offset="45%" stopColor="#103420" stopOpacity="1" />
            <stop offset="100%" stopColor="#0a2014" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Back Wave Layer - Pista Green */}
        <path
          className="footer-wave-back"
          d="M0,32 Q300,5 600,36 T1200,28 T1800,40 T2400,32 L2400,120 L0,120 Z"
          fill="url(#pistaWaveBack)"
        />

        {/* Mid Wave Layer - Leaf Green */}
        <path
          className="footer-wave-mid"
          d="M0,52 Q350,18 700,58 T1400,48 T2100,62 T2400,52 L2400,120 L0,120 Z"
          fill="url(#midBrandWave)"
        />

        {/* Front Wave Layer - Our Dark Green */}
        <path
          className="footer-wave-front"
          d="M0,72 Q280,32 560,76 T1120,64 T1680,78 T2240,70 L2400,74 L2400,120 L0,120 Z"
          fill="url(#frontDarkGreenWave)"
        />
      </svg>
    </div>
  )
}
