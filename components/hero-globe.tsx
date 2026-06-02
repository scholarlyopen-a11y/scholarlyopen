"use client"

import Image from "next/image"
import { Unlock } from "lucide-react"

export function HeroGlobe() {
  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto flex items-center justify-center group select-none">
      {/* Scoped CSS animations for standard self-containment */}
      <style jsx global>{`
        @keyframes globe-spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes float-lock-1 {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          100% {
            transform: translateY(-16px) rotate(8deg) scale(1.05);
          }
        }
        @keyframes float-lock-2 {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          100% {
            transform: translateY(14px) rotate(-10deg) scale(0.95);
          }
        }
        @keyframes float-lock-3 {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          100% {
            transform: translateY(-10px) rotate(-6deg) scale(1.02);
          }
        }
        @keyframes glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.4)) drop-shadow(0 0 12px rgba(250, 204, 21, 0.2));
            opacity: 0.9;
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(250, 204, 21, 0.7)) drop-shadow(0 0 28px rgba(250, 204, 21, 0.3));
            opacity: 1;
          }
        }
      `}</style>

      {/* Outer pulsing radial glow backdrop */}
      <div className="absolute inset-0 bg-radial-gradient from-accent/15 via-transparent to-transparent rounded-full blur-3xl scale-125 pointer-events-none transition-transform duration-1000 group-hover:scale-150" />

      {/* Glassmorphic orbital background circle */}
      <div className="absolute inset-8 rounded-full bg-primary-foreground/5 backdrop-blur-xs border border-primary-foreground/10 shadow-2xl transition-all duration-700 group-hover:border-primary-foreground/20 group-hover:bg-primary-foreground/8" />

      {/* Rotating Dotted Globe */}
      <div 
        className="absolute inset-10 flex items-center justify-center opacity-85 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-[1.03]"
        style={{
          animation: "globe-spin-slow 75s linear infinite"
        }}
      >
        <Image 
          src="/images/globe-vector.png" 
          alt="Halftone Globe"
          width={400}
          height={400}
          className="w-full h-full object-contain pointer-events-none select-none filter brightness-110 contrast-105"
          priority
        />
      </div>

      {/* Floating Yellow Unlocked Padlocks (Unlocks) */}
      
      {/* Lock 1: Top Right */}
      <div 
        className="absolute top-[12%] right-[15%] transition-all duration-500 hover:scale-110"
        style={{
          animation: "float-lock-1 5s ease-in-out infinite alternate, glow-pulse 4s ease-in-out infinite"
        }}
      >
        <Unlock className="h-10 w-10 text-accent" strokeWidth={2.2} />
      </div>

      {/* Lock 2: Bottom Left */}
      <div 
        className="absolute bottom-[16%] left-[12%] transition-all duration-500 hover:scale-110"
        style={{
          animation: "float-lock-2 6s ease-in-out infinite alternate 1s, glow-pulse 4.5s ease-in-out infinite 0.5s"
        }}
      >
        <Unlock className="h-8 w-8 text-accent" strokeWidth={2.2} />
      </div>

      {/* Lock 3: Bottom Right */}
      <div 
        className="absolute bottom-[26%] right-[10%] transition-all duration-500 hover:scale-110"
        style={{
          animation: "float-lock-3 7s ease-in-out infinite alternate 2s, glow-pulse 5s ease-in-out infinite 1s"
        }}
      >
        <Unlock className="h-9 w-9 text-accent" strokeWidth={2.2} />
      </div>

      {/* Lock 4: Top Left */}
      <div 
        className="absolute top-[28%] left-[10%] transition-all duration-500 hover:scale-110"
        style={{
          animation: "float-lock-1 5.5s ease-in-out infinite alternate 0.5s, glow-pulse 3.5s ease-in-out infinite 1.5s"
        }}
      >
        <Unlock className="h-7 w-7 text-accent" strokeWidth={2.2} />
      </div>
    </div>
  )
}
