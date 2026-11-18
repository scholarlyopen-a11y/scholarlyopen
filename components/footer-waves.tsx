"use client"

import React from "react"

export function FooterWaves() {
  return (
    <div 
      className="relative w-full overflow-hidden leading-none select-none pointer-events-none" 
      style={{ height: "68px", transform: "translateZ(0)" }}
      aria-hidden="true"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes waveMotionBack {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-350px, 3px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes waveMotionMid {
          0% {
            transform: translate3d(-300px, 0, 0);
          }
          50% {
            transform: translate3d(0, -4px, 0);
          }
          100% {
            transform: translate3d(-300px, 0, 0);
          }
        }
        @keyframes waveMotionFront {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-450px, 2px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .footer-wave-back {
          animation: waveMotionBack 24s ease-in-out infinite;
          will-change: transform;
        }
        .footer-wave-mid {
          animation: waveMotionMid 16s ease-in-out infinite;
          will-change: transform;
        }
        .footer-wave-front {
          animation: waveMotionFront 11s ease-in-out infinite;
          will-change: transform;
        }
      `}} />

      <svg
        className="w-[2000px] sm:w-[2400px] h-full block"
        viewBox="0 0 2400 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradBack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3d4b5c" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#4c5d73" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3d4b5c" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="waveGradMid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4e627a" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#5f7794" stopOpacity="0.70" />
            <stop offset="100%" stopColor="#4e627a" stopOpacity="0.55" />
          </linearGradient>

          <linearGradient id="waveGradFront" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67809f" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#7a97ba" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#67809f" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Back Wave Layer */}
        <path
          className="footer-wave-back"
          d="M0,45 Q300,10 600,48 T1200,42 T1800,52 T2400,45 L2400,120 L0,120 Z"
          fill="url(#waveGradBack)"
        />

        {/* Mid Wave Layer */}
        <path
          className="footer-wave-mid"
          d="M0,62 Q350,25 700,68 T1400,58 T2100,72 T2400,62 L2400,120 L0,120 Z"
          fill="url(#waveGradMid)"
        />

        {/* Front Wave Layer */}
        <path
          className="footer-wave-front"
          d="M0,78 Q280,38 560,82 T1120,70 T1680,85 T2240,75 L2400,80 L2400,120 L0,120 Z"
          fill="url(#waveGradFront)"
        />
      </svg>
    </div>
  )
}
