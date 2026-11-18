"use client"

import React from "react"

export function FooterWaves() {
  return (
    <div 
      className="relative w-full overflow-hidden leading-none select-none pointer-events-none" 
      style={{ height: "92px", transform: "translateZ(0)" }}
      aria-hidden="true"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes waveFloatPista {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-260px, 3px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes waveFloatMint {
          0% {
            transform: translate3d(-180px, 0, 0);
          }
          50% {
            transform: translate3d(40px, -4px, 0);
          }
          100% {
            transform: translate3d(-180px, 0, 0);
          }
        }
        @keyframes waveFloatEmerald {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-320px, 3px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .footer-wave-pista {
          animation: waveFloatPista 24s ease-in-out infinite;
          will-change: transform;
        }
        .footer-wave-mint {
          animation: waveFloatMint 17s ease-in-out infinite;
          will-change: transform;
        }
        .footer-wave-emerald {
          animation: waveFloatEmerald 12s ease-in-out infinite;
          will-change: transform;
        }
      `}} />

      <svg
        className="w-[2800px] sm:w-[3200px] h-full block"
        viewBox="0 0 2800 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Lighter, delicate, luminous Pista Green Gradient */}
          <linearGradient id="pistaGlowLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.48" />
            <stop offset="25%" stopColor="#dcfce7" stopOpacity="0.82" />
            <stop offset="50%" stopColor="#cbf5d4" stopOpacity="0.62" />
            <stop offset="75%" stopColor="#d1fae5" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.48" />
          </linearGradient>

          {/* Translucent Fresh Mint / Soft Emerald Gradient */}
          <linearGradient id="mintGlowMid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.32" />
            <stop offset="35%" stopColor="#6ee7b7" stopOpacity="0.52" />
            <stop offset="70%" stopColor="#34d399" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#86efac" stopOpacity="0.32" />
          </linearGradient>

          {/* Deep Forest Emerald Ambient Ribbon */}
          <linearGradient id="emeraldGlowDeep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.18" />
          </linearGradient>

          {/* Soft Glow Filter to merge lines into a cohesive organic aura */}
          <filter id="waveSoftMerge" x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Backlight Highlights */}
        <ellipse cx="700" cy="50" rx="550" ry="24" fill="#a7f3d0" opacity="0.08" filter="url(#waveSoftMerge)" />
        <ellipse cx="2100" cy="55" rx="550" ry="24" fill="#a7f3d0" opacity="0.08" filter="url(#waveSoftMerge)" />

        {/* Wave Ribbon 3: Deep Emerald (Back layer) */}
        <g className="footer-wave-emerald">
          <path
            d="M-250,63.7 Q-250,63.7 -200,62.5 Q-150,61.3 -100,59.9 Q-50,58.5 0,56.95 Q50,55.4 100,53.8 Q150,52.2 200,50.55 Q250,48.9 300,47.349999999999994 Q350,45.8 400,44.349999999999994 Q450,42.9 500,41.75 Q550,40.6 600,39.650000000000006 Q650,38.7 700,38.1 Q750,37.5 800,37.25 Q850,37 900,37.1 Q950,37.2 1000,37.7 Q1050,38.2 1100,39 Q1150,39.8 1200,40.9 Q1250,42 1300,43.3 Q1350,44.6 1400,46.150000000000006 Q1450,47.7 1500,49.3 Q1550,50.9 1600,52.55 Q1650,54.2 1700,55.8 Q1750,57.4 1800,58.849999999999994 Q1850,60.3 1900,61.55 Q1950,62.8 2000,63.8 Q2050,64.8 2100,65.5 Q2150,66.2 2200,66.55000000000001 Q2250,66.9 2300,66.9 Q2350,66.9 2400,66.55000000000001 Q2450,66.2 2500,65.45 Q2550,64.7 2600,63.7 Q2650,62.7 2700,61.45 Q2750,60.2 2800,58.7 Q2850,57.2 2900,55.6 Q2950,54 3000,52.35 L3050,50.7 L3050,77.9 Q3050,77.9 3000,79.4 Q2950,80.9 2900,82.4 Q2850,83.9 2800,85.35 Q2750,86.8 2700,88.15 Q2650,89.5 2600,90.7 Q2550,91.9 2500,92.95 Q2450,94 2400,94.75 Q2350,95.5 2300,96 Q2250,96.5 2200,96.75 Q2150,97 2100,96.9 Q2050,96.8 2000,96.44999999999999 Q1950,96.1 1900,95.44999999999999 Q1850,94.8 1800,93.85 Q1750,92.9 1700,91.80000000000001 Q1650,90.7 1600,89.4 Q1550,88.1 1500,86.65 Q1450,85.2 1400,83.75 Q1350,82.3 1300,80.8 Q1250,79.3 1200,77.85 Q1150,76.4 1100,75.05000000000001 Q1050,73.7 1000,72.55000000000001 Q950,71.4 900,70.45 Q850,69.5 800,68.8 Q750,68.1 700,67.69999999999999 Q650,67.3 600,67.15 Q550,67 500,67.15 Q450,67.3 400,67.8 Q350,68.3 300,69 Q250,69.7 200,70.7 Q150,71.7 100,72.9 Q50,74.1 0,75.4 Q-50,76.7 -100,78.15 Q-150,79.6 -200,81.1 Z"
            fill="url(#emeraldGlowDeep)"
            filter="url(#waveSoftMerge)"
          />
        </g>

        {/* Wave Ribbon 2: Fresh Mint (Mid layer) */}
        <g className="footer-wave-mint">
          <path
            d="M-250,51.6 Q-250,51.6 -200,53.25 Q-150,54.9 -100,56 Q-50,57.1 0,57.55 Q50,58 100,57.7 Q150,57.4 200,56.45 Q250,55.5 300,53.95 Q350,52.4 400,50.349999999999994 Q450,48.3 500,45.95 Q550,43.6 600,41.1 Q650,38.6 700,36.150000000000006 Q750,33.7 800,31.5 Q850,29.3 900,27.5 Q950,25.7 1000,24.45 Q1050,23.2 1100,22.65 Q1150,22.1 1200,22.200000000000003 Q1250,22.3 1300,23.1 Q1350,23.9 1400,25.35 Q1450,26.8 1500,28.75 Q1550,30.7 1600,33 Q1650,35.3 1700,37.8 Q1750,40.3 1800,42.8 Q1850,45.3 1900,47.55 Q1950,49.8 2000,51.7 Q2050,53.6 2100,54.95 Q2150,56.3 2200,57.05 Q2250,57.8 2300,57.849999999999994 Q2350,57.9 2400,57.2 Q2450,56.5 2500,55.2 Q2550,53.9 2600,52.05 Q2650,50.2 2700,47.95 Q2750,45.7 2800,43.25 Q2850,40.8 2900,38.3 Q2950,35.8 3000,33.45 L3050,31.1 L3050,61.8 Q3050,61.8 3000,63.699999999999996 Q2950,65.6 2900,67.6 Q2850,69.6 2800,71.55 Q2750,73.5 2700,75.25 Q2650,77 2600,78.5 Q2550,80 2500,81.15 Q2450,82.3 2400,82.94999999999999 Q2350,83.6 2300,83.8 Q2250,84 2200,83.7 Q2150,83.4 2100,82.6 Q2050,81.8 2000,80.6 Q1950,79.4 1900,77.85 Q1850,76.3 1800,74.44999999999999 Q1750,72.6 1700,70.65 Q1650,68.7 1600,66.7 Q1550,64.7 1500,62.8 Q1450,60.9 1400,59.25 Q1350,57.6 1300,56.25 Q1250,54.9 1200,53.95 Q1150,53 1100,52.55 Q1050,52.1 1000,52.150000000000006 Q950,52.2 900,52.7 Q850,53.2 800,54.150000000000006 Q750,55.1 700,56.5 Q650,57.9 600,59.599999999999994 Q550,61.3 500,63.199999999999996 Q450,65.1 400,67.1 Q350,69.1 300,71.05 Q250,73 200,74.8 Q150,76.6 100,78.15 Q50,79.7 0,80.85 Q-50,82 -100,82.75 Q-150,83.5 -200,83.75 Z"
            fill="url(#mintGlowMid)"
            filter="url(#waveSoftMerge)"
          />
        </g>

        {/* Wave Ribbon 1: Luminous Light Pista Green (Forefront layer) */}
        <g className="footer-wave-pista">
          <path
            d="M-250,17.7 Q-250,17.7 -200,19.85 Q-150,22 -100,24.6 Q-50,27.2 0,30 Q50,32.8 100,35.4 Q150,38 200,40.15 Q250,42.3 300,43.7 Q350,45.1 400,45.55 Q450,46 500,45.5 Q550,45 600,43.6 Q650,42.2 700,40.05 Q750,37.9 800,35.3 Q850,32.7 900,29.900000000000002 Q950,27.1 1000,24.5 Q1050,21.9 1100,19.75 Q1150,17.6 1200,16.25 Q1250,14.9 1300,14.45 Q1350,14 1400,14.5 Q1450,15 1500,16.45 Q1550,17.9 1600,20.049999999999997 Q1650,22.2 1700,24.85 Q1750,27.5 1800,30.3 Q1850,33.1 1900,35.7 Q1950,38.3 2000,40.4 Q2050,42.5 2100,43.8 Q2150,45.1 2200,45.55 Q2250,46 2300,45.45 Q2350,44.9 2400,43.45 Q2450,42 2500,39.85 Q2550,37.7 2600,35.05 Q2650,32.4 2700,29.6 Q2750,26.8 2800,24.200000000000003 Q2850,21.6 2900,19.55 Q2950,17.5 3000,16.15 L3050,14.8 L3050,41.3 Q3050,41.3 3000,42.55 Q2950,43.8 2900,45.55 Q2850,47.3 2800,49.45 Q2750,51.6 2700,53.8 Q2650,56 2600,58.15 Q2550,60.3 2500,62.099999999999994 Q2450,63.9 2400,65.2 Q2350,66.5 2300,67.2 Q2250,67.9 2200,67.85 Q2150,67.8 2100,67.05 Q2050,66.3 2000,64.95 Q1950,63.6 1900,61.75 Q1850,59.9 1800,57.75 Q1750,55.6 1700,53.400000000000006 Q1650,51.2 1600,49.1 Q1550,47 1500,45.25 Q1450,43.5 1400,42.3 Q1350,41.1 1300,40.6 Q1250,40.1 1200,40.25 Q1150,40.4 1100,41.25 Q1050,42.1 1000,43.55 Q950,45 900,46.9 Q850,48.8 800,51 Q750,53.2 700,55.400000000000006 Q650,57.6 600,59.650000000000006 Q550,61.7 500,63.35 Q450,65 400,66.1 Q350,67.2 300,67.6 Q250,68 200,67.7 Q150,67.4 100,66.45 Q50,65.5 0,63.95 Q-50,62.4 -100,60.4 Q-150,58.4 -200,56.2 Z"
            fill="url(#pistaGlowLight)"
            filter="url(#waveSoftMerge)"
          />
        </g>
      </svg>
    </div>
  )
}
