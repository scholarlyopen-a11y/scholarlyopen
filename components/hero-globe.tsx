"use client"

import Image from "next/image"

export function HeroGlobe() {
  return (
    <div 
      className="relative w-full aspect-square max-w-[460px] mx-auto flex items-center justify-center group select-none"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Scoped CSS animations for 23.5-degree tilted Earth and 3D dashed orbital rings */}
      <style jsx global>{`
        @keyframes earth-spin-clockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes orbit-ring-z1 {
          0% {
            transform: rotateX(66deg) rotateY(15deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(66deg) rotateY(15deg) rotateZ(360deg);
          }
        }
        @keyframes orbit-ring-z2 {
          0% {
            transform: rotateX(-50deg) rotateY(30deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(-50deg) rotateY(30deg) rotateZ(-360deg);
          }
        }
        @keyframes orbit-ring-z3 {
          0% {
            transform: rotateX(74deg) rotateY(-20deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(74deg) rotateY(-20deg) rotateZ(360deg);
          }
        }
        @keyframes pulse-ring-glow {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.5)) drop-shadow(0 0 12px rgba(250, 204, 21, 0.2));
            opacity: 0.85;
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(250, 204, 21, 0.8)) drop-shadow(0 0 24px rgba(250, 204, 21, 0.4));
            opacity: 1;
          }
        }
      `}</style>

      {/* Outer pulsing radial glow backdrop */}
      <div className="absolute inset-0 bg-radial-gradient from-accent/10 via-transparent to-transparent rounded-full blur-3xl scale-125 pointer-events-none transition-transform duration-1000 group-hover:scale-150" />

      {/* Tilted Earth Wrapper (23.5-degree axial tilt to the right) */}
      <div 
        className="absolute w-[70%] h-[70%] rounded-full overflow-hidden flex items-center justify-center border border-primary-foreground/10 bg-primary-foreground/5 shadow-2xl transition-all duration-700 group-hover:border-primary-foreground/20 group-hover:bg-primary-foreground/8"
        style={{
          transform: "rotate(23.5deg)",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Globe rotating clockwise from West to East */}
        <div 
          className="w-[105%] h-[105%] relative opacity-85 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-[1.03]"
          style={{
            animation: "earth-spin-clockwise 60s linear infinite"
          }}
        >
          <Image 
            src="/images/globe-vector.png" 
            alt="Rotating Halftone Globe"
            fill
            className="object-contain pointer-events-none select-none filter brightness-110 contrast-105"
            priority
          />
        </div>
      </div>

      {/* Concentric, Glowing Yellow "Unlock" Rings Orbiting at Varying Speeds and Angles */}

      {/* Inner Ring (Ring 1) */}
      <div 
        className="absolute w-[76%] h-[76%] rounded-full pointer-events-none"
        style={{
          border: "2px dashed var(--accent)",
          transformStyle: "preserve-3d",
          animation: "orbit-ring-z1 12s linear infinite, pulse-ring-glow 5s ease-in-out infinite"
        }}
      />

      {/* Middle Ring (Ring 2) - Rotating in Reverse */}
      <div 
        className="absolute w-[86%] h-[86%] rounded-full pointer-events-none"
        style={{
          border: "1.5px dashed var(--accent)",
          transformStyle: "preserve-3d",
          animation: "orbit-ring-z2 18s linear infinite, pulse-ring-glow 6s ease-in-out infinite 1s"
        }}
      />

      {/* Outer Ring (Ring 3) */}
      <div 
        className="absolute w-[96%] h-[96%] rounded-full pointer-events-none"
        style={{
          border: "1px dashed var(--accent)",
          transformStyle: "preserve-3d",
          animation: "orbit-ring-z3 26s linear infinite, pulse-ring-glow 7s ease-in-out infinite 2s"
        }}
      />
    </div>
  )
}
