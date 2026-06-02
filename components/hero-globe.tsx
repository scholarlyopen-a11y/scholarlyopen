"use client"

import React, { useRef, useEffect } from "react"

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface UnitSegment {
  p1: Point3D;
  p2: Point3D;
}

// 1. High-fidelity Continent Polygon Coordinates (lat/lon in degrees)
const NORTH_AMERICA = [
  { lat: 72, lon: -168 }, { lat: 70, lon: -145 }, { lat: 60, lon: -140 },
  { lat: 55, lon: -165 }, { lat: 52, lon: -175 }, { lat: 50, lon: -180 },
  { lat: 48, lon: -125 }, { lat: 38, lon: -123 }, { lat: 30, lon: -115 },
  { lat: 24, lon: -110 }, { lat: 22, lon: -105 }, { lat: 16, lon: -95 },
  { lat: 15, lon: -90 }, { lat: 10, lon: -83 }, { lat: 9, lon: -79 },
  { lat: 10, lon: -74 }, { lat: 15, lon: -82 }, { lat: 20, lon: -87 },
  { lat: 25, lon: -80 }, { lat: 28, lon: -82 }, { lat: 25, lon: -97 },
  { lat: 28, lon: -96 }, { lat: 30, lon: -85 }, { lat: 33, lon: -78 },
  { lat: 38, lon: -75 }, { lat: 43, lon: -70 }, { lat: 47, lon: -65 },
  { lat: 48, lon: -53 }, { lat: 52, lon: -55 }, { lat: 58, lon: -62 },
  { lat: 60, lon: -64 }, { lat: 64, lon: -75 }, { lat: 68, lon: -78 },
  { lat: 73, lon: -95 }, { lat: 78, lon: -105 }, { lat: 80, lon: -120 },
  { lat: 75, lon: -140 }, { lat: 72, lon: -168 }
]

const SOUTH_AMERICA = [
  { lat: 12, lon: -72 }, { lat: 9, lon: -60 }, { lat: 5, lon: -52 },
  { lat: 0, lon: -48 }, { lat: -5, lon: -35 }, { lat: -10, lon: -36 },
  { lat: -20, lon: -40 }, { lat: -28, lon: -48 }, { lat: -35, lon: -55 },
  { lat: -42, lon: -62 }, { lat: -50, lon: -65 }, { lat: -55, lon: -67 },
  { lat: -54, lon: -73 }, { lat: -48, lon: -75 }, { lat: -40, lon: -74 },
  { lat: -30, lon: -72 }, { lat: -20, lon: -70 }, { lat: -12, lon: -78 },
  { lat: -5, lon: -81 }, { lat: 0, lon: -80 }, { lat: 5, lon: -77 },
  { lat: 9, lon: -79 }, { lat: 12, lon: -72 }
]

const GREENLAND = [
  { lat: 78, lon: -73 }, { lat: 82, lon: -60 }, { lat: 83, lon: -40 },
  { lat: 83, lon: -20 }, { lat: 80, lon: -12 }, { lat: 75, lon: -18 },
  { lat: 70, lon: -22 }, { lat: 65, lon: -35 }, { lat: 60, lon: -43 },
  { lat: 60, lon: -47 }, { lat: 65, lon: -53 }, { lat: 70, lon: -54 },
  { lat: 75, lon: -58 }, { lat: 78, lon: -73 }
]

const AFRICA = [
  { lat: 37, lon: 10 }, { lat: 36, lon: 15 }, { lat: 32, lon: 15 },
  { lat: 31, lon: 25 }, { lat: 31, lon: 34 }, { lat: 27, lon: 34 },
  { lat: 22, lon: 37 }, { lat: 12, lon: 43 }, { lat: 11, lon: 48 },
  { lat: 5, lon: 51 }, { lat: -5, lon: 40 }, { lat: -10, lon: 40 },
  { lat: -20, lon: 35 }, { lat: -25, lon: 33 }, { lat: -34, lon: 20 },
  { lat: -33, lon: 18 }, { lat: -20, lon: 13 }, { lat: -12, lon: 13 },
  { lat: -5, lon: 12 }, { lat: 0, lon: 9 }, { lat: 5, lon: 9 },
  { lat: 5, lon: 0 }, { lat: 6, lon: -8 }, { lat: 12, lon: -16 },
  { lat: 15, lon: -17 }, { lat: 20, lon: -16 }, { lat: 25, lon: -15 },
  { lat: 30, lon: -10 }, { lat: 35, lon: -6 }, { lat: 35, lon: 0 },
  { lat: 37, lon: 5 }, { lat: 37, lon: 10 }
]

const EURASIA = [
  { lat: 36, lon: -6 }, { lat: 37, lon: -9 }, { lat: 42, lon: -9 },
  { lat: 43, lon: -1 }, { lat: 48, lon: -5 }, { lat: 50, lon: 2 },
  { lat: 53, lon: 5 }, { lat: 54, lon: 8 }, { lat: 57, lon: 8 },
  { lat: 55, lon: 12 }, { lat: 56, lon: 16 }, { lat: 59, lon: 18 },
  { lat: 63, lon: 20 }, { lat: 65, lon: 24 }, { lat: 60, lon: 27 },
  { lat: 59, lon: 30 }, { lat: 64, lon: 38 }, { lat: 68, lon: 39 },
  { lat: 70, lon: 28 }, { lat: 68, lon: 15 }, { lat: 62, lon: 5 },
  { lat: 58, lon: 6 }, { lat: 60, lon: 30 }, { lat: 67, lon: 45 },
  { lat: 70, lon: 60 }, { lat: 73, lon: 72 }, { lat: 76, lon: 95 },
  { lat: 72, lon: 120 }, { lat: 70, lon: 140 }, { lat: 70, lon: 170 },
  { lat: 65, lon: 180 }, { lat: 60, lon: 165 }, { lat: 56, lon: 163 },
  { lat: 51, lon: 156 }, { lat: 46, lon: 142 }, { lat: 43, lon: 132 },
  { lat: 38, lon: 125 }, { lat: 35, lon: 129 }, { lat: 37, lon: 120 },
  { lat: 31, lon: 122 }, { lat: 22, lon: 114 }, { lat: 21, lon: 108 },
  { lat: 10, lon: 104 }, { lat: 6, lon: 102 }, { lat: 10, lon: 98 },
  { lat: 16, lon: 96 }, { lat: 22, lon: 90 }, { lat: 16, lon: 81 },
  { lat: 8, lon: 77 }, { lat: 19, lon: 72 }, { lat: 25, lon: 67 },
  { lat: 25, lon: 58 }, { lat: 27, lon: 50 }, { lat: 12, lon: 43 },
  { lat: 28, lon: 34 }, { lat: 31, lon: 34 }, { lat: 35, lon: 36 },
  { lat: 36, lon: 30 }, { lat: 40, lon: 26 }, { lat: 41, lon: 29 },
  { lat: 44, lon: 34 }, { lat: 46, lon: 30 }, { lat: 41, lon: 22 },
  { lat: 38, lon: 23 }, { lat: 40, lon: 18 }, { lat: 45, lon: 13 },
  { lat: 41, lon: 15 }, { lat: 38, lon: 16 }, { lat: 40, lon: 14 },
  { lat: 44, lon: 10 }, { lat: 43, lon: 6 }, { lat: 43, lon: 3 },
  { lat: 41, lon: 2 }, { lat: 39, lon: -1 }, { lat: 36, lon: -6 }
]

const AUSTRALIA = [
  { lat: -12, lon: 131 }, { lat: -11, lon: 136 }, { lat: -12, lon: 136 },
  { lat: -15, lon: 136 }, { lat: -14, lon: 141 }, { lat: -11, lon: 142 },
  { lat: -15, lon: 145 }, { lat: -20, lon: 148 }, { lat: -25, lon: 153 },
  { lat: -30, lon: 153 }, { lat: -35, lon: 150 }, { lat: -38, lon: 147 },
  { lat: -38, lon: 144 }, { lat: -35, lon: 138 }, { lat: -37, lon: 139 },
  { lat: -35, lon: 136 }, { lat: -33, lon: 132 }, { lat: -32, lon: 125 },
  { lat: -35, lon: 118 }, { lat: -34, lon: 115 }, { lat: -32, lon: 115 },
  { lat: -28, lon: 114 }, { lat: -25, lon: 113 }, { lat: -22, lon: 114 },
  { lat: -20, lon: 118 }, { lat: -17, lon: 122 }, { lat: -15, lon: 125 },
  { lat: -14, lon: 129 }, { lat: -12, lon: 131 }
]

const UNITED_KINGDOM = [
  { lat: 58.5, lon: -4.5 }, { lat: 57.5, lon: -2.0 }, { lat: 56.0, lon: -2.5 },
  { lat: 54.0, lon: -0.5 }, { lat: 52.5, lon: 1.5 }, { lat: 51.0, lon: 1.3 },
  { lat: 50.0, lon: -5.0 }, { lat: 52.0, lon: -5.0 }, { lat: 53.0, lon: -4.5 },
  { lat: 54.5, lon: -3.5 }, { lat: 55.0, lon: -5.0 }, { lat: 56.5, lon: -6.0 },
  { lat: 57.5, lon: -6.0 }, { lat: 58.5, lon: -4.5 }
]

const JAPAN = [
  { lat: 45.5, lon: 142.0 }, { lat: 44.0, lon: 145.0 }, { lat: 43.0, lon: 145.5 },
  { lat: 42.0, lon: 141.0 }, { lat: 41.5, lon: 142.0 }, { lat: 40.0, lon: 142.0 },
  { lat: 36.0, lon: 140.5 }, { lat: 35.0, lon: 139.5 }, { lat: 33.5, lon: 136.0 },
  { lat: 33.0, lon: 132.0 }, { lat: 32.5, lon: 130.0 }, { lat: 33.5, lon: 130.0 },
  { lat: 34.5, lon: 133.0 }, { lat: 35.5, lon: 135.0 }, { lat: 37.5, lon: 137.5 },
  { lat: 38.5, lon: 139.0 }, { lat: 41.0, lon: 140.0 }, { lat: 42.0, lon: 140.0 },
  { lat: 43.5, lon: 140.5 }, { lat: 45.5, lon: 142.0 }
]

const CONTINENTS = [
  NORTH_AMERICA,
  SOUTH_AMERICA,
  GREENLAND,
  AFRICA,
  EURASIA,
  AUSTRALIA,
  UNITED_KINGDOM,
  JAPAN
]

// Subdivide long polygon edges to wrap smoothly around sphere curvature
function subdivideSegment(
  v1: { lat: number; lon: number },
  v2: { lat: number; lon: number },
  maxStep = 3.5
) {
  const dist = Math.hypot(v2.lat - v1.lat, v2.lon - v1.lon)
  const steps = Math.max(1, Math.ceil(dist / maxStep))
  const subSegments: { lat: number; lon: number }[] = []
  
  for (let s = 0; s <= steps; s++) {
    const t = s / steps
    let lon1 = v1.lon
    let lon2 = v2.lon
    let dLon = lon2 - lon1
    if (dLon > 180) {
      lon2 -= 360
    } else if (dLon < -180) {
      lon2 += 360
    }
    
    const lat = v1.lat + (v2.lat - v1.lat) * t
    const lon = lon1 + (lon2 - lon1) * t
    subSegments.push({ lat, lon })
  }
  return subSegments
}

export function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const unitContinentSegmentsRef = useRef<UnitSegment[]>([])
  
  // Precompute subdivided unit segments once on mount
  useEffect(() => {
    const segments: UnitSegment[] = []
    
    CONTINENTS.forEach((poly) => {
      for (let i = 0; i < poly.length - 1; i++) {
        const subPoints = subdivideSegment(poly[i], poly[i + 1])
        
        for (let j = 0; j < subPoints.length - 1; j++) {
          const pt1 = subPoints[j]
          const pt2 = subPoints[j + 1]
          
          const lat1 = pt1.lat * Math.PI / 180
          const lon1 = pt1.lon * Math.PI / 180
          const p1: Point3D = {
            x: Math.cos(lat1) * Math.sin(lon1),
            y: Math.sin(lat1),
            z: Math.cos(lat1) * Math.cos(lon1)
          }
          
          const lat2 = pt2.lat * Math.PI / 180
          const lon2 = pt2.lon * Math.PI / 180
          const p2: Point3D = {
            x: Math.cos(lat2) * Math.sin(lon2),
            y: Math.sin(lat2),
            z: Math.cos(lat2) * Math.cos(lon2)
          }
          
          segments.push({ p1, p2 })
        }
      }
    })
    
    unitContinentSegmentsRef.current = segments
  }, [])
  
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    
    let ctx = canvas.getContext("2d")
    if (!ctx) return
    
    let animationId: number
    let isDestroyed = false
    
    // Parallax mouse variables
    let targetMouseX = 0
    let targetMouseY = 0
    let curMouseX = 0
    let curMouseY = 0
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      targetMouseX = x / (rect.width / 2)
      targetMouseY = y / (rect.height / 2)
    }
    
    const handleMouseLeave = () => {
      targetMouseX = 0
      targetMouseY = 0
    }
    
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)
    
    // Canvas resizing
    const resizeCanvas = () => {
      if (isDestroyed) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      
      ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
    }
    
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    
    // 3D rotations helper constants
    const TILT_RAD = 23.5 * Math.PI / 180 // Earth's axial tilt
    
    const rotateY = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return {
        x: p.x * cos - p.z * sin,
        y: p.y,
        z: p.x * sin + p.z * cos
      }
    }
    
    const rotateX = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return {
        x: p.x,
        y: p.y * cos - p.z * sin,
        z: p.y * sin + p.z * cos
      }
    }
    
    const rotateZ = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return {
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos,
        z: p.z
      }
    }
    
    // Correct Canvas Y-axis inversion (cy - y * scale) so map is not upside down
    const project = (x: number, y: number, z: number, cx: number, cy: number, cameraDist: number) => {
      const scale = cameraDist / (cameraDist - z)
      return {
        x: cx + x * scale,
        y: cy - y * scale,
        z: z
      }
    }
    
    // Draw lock perfectly UPRIGHT (billboard style) with keyhole slot centered so it doesn't look like a shopping bag
    const drawLock = (context: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
      context.save()
      context.translate(cx, cy)
      context.strokeStyle = "#facc15" // Yellow-400
      context.fillStyle = "#facc15"
      context.lineWidth = 1.8
      context.lineCap = "round"
      context.lineJoin = "round"
      
      const w = size
      const h = size * 0.65
      const bodyY = size * 0.15
      
      // Padlock Body
      context.beginPath()
      if (context.roundRect) {
        context.roundRect(-w / 2, bodyY - h / 2, w, h, 2.5)
      } else {
        context.rect(-w / 2, bodyY - h / 2, w, h)
      }
      context.fillStyle = "rgba(250, 204, 21, 0.25)"
      context.fill()
      context.stroke()
      
      // keyhole slot (circle + slot underneath)
      context.beginPath()
      context.arc(0, bodyY - w * 0.04, w * 0.08, 0, Math.PI * 2)
      context.moveTo(0, bodyY - w * 0.04)
      context.lineTo(0, bodyY + w * 0.14)
      context.lineWidth = 1.45
      context.stroke()
      
      // Standard open shackle (connected left, looping over, cut short on the right leaving a large gap)
      // Drawn perfectly vertical, no crooked rotation
      context.beginPath()
      context.lineWidth = 1.8
      const leftX = -w * 0.26
      const rightX = w * 0.26
      const topY = bodyY - h / 2 - w * 0.55
      
      context.moveTo(leftX, bodyY - h / 2)
      context.lineTo(leftX, topY + w * 0.26)
      context.arc(0, topY + w * 0.26, w * 0.26, Math.PI, 0, false)
      context.lineTo(rightX, topY + w * 0.35)
      
      context.stroke()
      context.restore()
    }
    
    // Tick frame rendering
    const tick = () => {
      if (isDestroyed || !canvas || !ctx) return
      
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const cx = width / 2
      const cy = height / 2
      
      ctx.clearRect(0, 0, width, height)
      
      // Radius increased to 0.33 (from 0.27) to fit the Hero Column size beautifully
      const R = Math.min(width, height) * 0.33
      const cameraDist = R * 2.5
      
      // Smooth cursor parallax lerp
      curMouseX += (targetMouseX - curMouseX) * 0.08
      curMouseY += (targetMouseY - curMouseY) * 0.08
      
      const time = performance.now() * 0.001
      
      // Clockwise rotation
      const globeAngle = time * 0.06
      
      // Angles for 5 locks
      const lock1Angle = time * -1.5
      const lock2Angle = time * -2.1 + 1.2
      const lock3Angle = time * -1.2 + 2.5
      const lock4Angle = time * -2.7 + 3.8
      const lock5Angle = time * -1.8 + 5.1
      
      interface DrawSegment {
        type: "continent-line" | "orbit-line" | "trail-line"
        z: number
        x1: number
        y1: number
        x2: number
        y2: number
        color: string
        lineWidth: number
      }
      
      interface DrawLock {
        type: "lock"
        z: number
        x: number
        y: number
        size: number
      }
      
      type Drawable = DrawSegment | DrawLock
      const drawList: Drawable[] = []
      
      // Note: Latitudes and Longitudes loops have been fully removed to leave a clean world map outlines globe
      
      // 1. Generate Accurate World Map Outline wrapping beautifully
      const unitContinentSegments = unitContinentSegmentsRef.current
      unitContinentSegments.forEach((seg) => {
        const p1_local: Point3D = {
          x: seg.p1.x * R,
          y: seg.p1.y * R,
          z: seg.p1.z * R
        }
        
        const p2_local: Point3D = {
          x: seg.p2.x * R,
          y: seg.p2.y * R,
          z: seg.p2.z * R
        }
        
        let p1 = rotateY(p1_local, -globeAngle)
        let p2 = rotateY(p2_local, -globeAngle)
        
        p1 = rotateZ(p1, TILT_RAD)
        p2 = rotateZ(p2, TILT_RAD)
        
        p1 = rotateY(p1, curMouseX * 0.35)
        p1 = rotateX(p1, curMouseY * 0.35)
        p2 = rotateY(p2, curMouseX * 0.35)
        p2 = rotateX(p2, curMouseY * 0.35)
        
        const proj1 = project(p1.x, p1.y, p1.z, cx, cy, cameraDist)
        const proj2 = project(p2.x, p2.y, p2.z, cx, cy, cameraDist)
        
        const zAvg = (proj1.z + proj2.z) / 2
        const normZ = zAvg / R
        
        let opacity = 0
        if (normZ >= 0) {
          opacity = 0.35 + 0.53 * normZ // High-fidelity bright continents
        } else {
          opacity = 0.12 + 0.20 * (1 + normZ) // Translucent back continent curves
        }
        
        drawList.push({
          type: "continent-line",
          z: zAvg,
          x1: proj1.x,
          y1: proj1.y,
          x2: proj2.x,
          y2: proj2.y,
          color: `rgba(255, 255, 255, ${opacity})`,
          lineWidth: normZ >= 0 ? 1.35 : 0.85
        })
      })
      
      // 2. Render 5 Spiral Orbit Paths & Open Padlocks
      // All orbits revolve around the exact same 23.5-degree polar axis
      const addSpiralOrbitAndLock = (
        orbitRadius: number,
        lockAngle: number,
        speed: number,
        oscillationFreq: number,
        maxLatRad: number,
        baseLockSize: number
      ) => {
        const segments = 90
        const trailLength = 1.25 // Length of trailing shooting star trail
        const direction = speed >= 0 ? 1 : -1
        
        for (let j = 0; j < segments; j++) {
          const angleDiff = (j / segments) * 2 * Math.PI
          const a1 = lockAngle - direction * angleDiff
          const a2 = lockAngle - direction * ((j + 1) / segments) * 2 * Math.PI
          
          // Spiral oscillation in local coordinates
          const lat1 = Math.sin(a1 * oscillationFreq) * maxLatRad
          const cosLat1 = Math.cos(lat1)
          const p1_local: Point3D = {
            x: orbitRadius * cosLat1 * Math.sin(a1),
            y: orbitRadius * Math.sin(lat1),
            z: orbitRadius * cosLat1 * Math.cos(a1)
          }
          
          const lat2 = Math.sin(a2 * oscillationFreq) * maxLatRad
          const cosLat2 = Math.cos(lat2)
          const p2_local: Point3D = {
            x: orbitRadius * cosLat2 * Math.sin(a2),
            y: orbitRadius * Math.sin(lat2),
            z: orbitRadius * cosLat2 * Math.cos(a2)
          }
          
          // 23.5-degree axial tilt alignment
          let p1 = rotateZ(p1_local, TILT_RAD)
          let p2 = rotateZ(p2_local, TILT_RAD)
          
          // Mouse tilts
          p1 = rotateY(p1, curMouseX * 0.35)
          p1 = rotateX(p1, curMouseY * 0.35)
          p2 = rotateY(p2, curMouseX * 0.35)
          p2 = rotateX(p2, curMouseY * 0.35)
          
          const proj1 = project(p1.x, p1.y, p1.z, cx, cy, cameraDist)
          const proj2 = project(p2.x, p2.y, p2.z, cx, cy, cameraDist)
          
          const zAvg = (proj1.z + proj2.z) / 2
          
          if (angleDiff < trailLength) {
            // Bright fading yellow trail
            const opacityMultiplier = 1.0 - angleDiff / trailLength
            drawList.push({
              type: "trail-line",
              z: zAvg,
              x1: proj1.x,
              y1: proj1.y,
              x2: proj2.x,
              y2: proj2.y,
              color: `rgba(250, 204, 21, ${opacityMultiplier * 0.95})`,
              lineWidth: 0.8 + 2.8 * opacityMultiplier
            })
          } else {
            // Very faint background spiral path
            const normZ = zAvg / orbitRadius
            const baseOpacity = normZ >= 0 ? 0.20 + 0.16 * normZ : 0.10 + 0.08 * (1 + normZ)
            drawList.push({
              type: "orbit-line",
              z: zAvg,
              x1: proj1.x,
              y1: proj1.y,
              x2: proj2.x,
              y2: proj2.y,
              color: `rgba(250, 204, 21, ${baseOpacity * 0.6})`,
              lineWidth: 0.75
            })
          }
        }
        
        // Padlock Position
        const lockLat = Math.sin(lockAngle * oscillationFreq) * maxLatRad
        const lockCosLat = Math.cos(lockLat)
        const lock_local: Point3D = {
          x: orbitRadius * lockCosLat * Math.sin(lockAngle),
          y: orbitRadius * Math.sin(lockLat),
          z: orbitRadius * lockCosLat * Math.cos(lockAngle)
        }
        
        let lock_tilted = rotateZ(lock_local, TILT_RAD)
        lock_tilted = rotateY(lock_tilted, curMouseX * 0.35)
        lock_tilted = rotateX(lock_tilted, curMouseY * 0.35)
        
        const lockProj = project(lock_tilted.x, lock_tilted.y, lock_tilted.z, cx, cy, cameraDist)
        
        const scale = cameraDist / (cameraDist - lockProj.z)
        const lockSize = baseLockSize * scale
        
        drawList.push({
          type: "lock",
          z: lockProj.z,
          x: lockProj.x,
          y: lockProj.y,
          size: lockSize
        })
      }
      
      // Lock 1: Largest padlock, fast spiral orbit
      addSpiralOrbitAndLock(
        R * 1.15,
        lock1Angle,
        -1.5,
        0.20,
        55 * Math.PI / 180,
        18.0
      )
      
      // Lock 2: Medium-large padlock, very fast spiral orbit
      addSpiralOrbitAndLock(
        R * 1.21,
        lock2Angle,
        -2.1,
        0.16,
        45 * Math.PI / 180,
        14.5
      )
      
      // Lock 3: Medium-small padlock, moderate speed
      addSpiralOrbitAndLock(
        R * 1.27,
        lock3Angle,
        -1.2,
        0.24,
        35 * Math.PI / 180,
        11.5
      )
      
      // Lock 4: Small padlock, extremely fast spiral orbit
      addSpiralOrbitAndLock(
        R * 1.33,
        lock4Angle,
        -2.7,
        0.13,
        60 * Math.PI / 180,
        9.0
      )
      
      // Lock 5: Tiny padlock, steady speed, narrow spiral latitude
      addSpiralOrbitAndLock(
        R * 1.09,
        lock5Angle,
        -1.8,
        0.30,
        25 * Math.PI / 180,
        6.5
      )
      
      // 3. Painter's Algorithm Depth Sort (furthest to closest)
      drawList.sort((a, b) => a.z - b.z)
      
      // 4. Render Drawables
      drawList.forEach((el) => {
        if (
          el.type === "continent-line" ||
          el.type === "orbit-line" ||
          el.type === "trail-line"
        ) {
          ctx.beginPath()
          ctx.moveTo(el.x1, el.y1)
          ctx.lineTo(el.x2, el.y2)
          ctx.strokeStyle = el.color
          ctx.lineWidth = el.lineWidth
          ctx.stroke()
        } else if (el.type === "lock") {
          const size = el.size
          
          // Soft glowing golden halo under locks
          const glow = ctx.createRadialGradient(el.x, el.y, 1, el.x, el.y, size * 1.45)
          glow.addColorStop(0, "rgba(250, 204, 21, 0.45)")
          glow.addColorStop(1, "rgba(250, 204, 21, 0)")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(el.x, el.y, size * 1.45, 0, Math.PI * 2)
          ctx.fill()
          
          drawLock(ctx, el.x, el.y, size)
        }
      })
      
      animationId = requestAnimationFrame(tick)
    }
    
    tick()
    
    return () => {
      isDestroyed = true
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square max-w-[460px] mx-auto flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-visible"
    >
      <canvas 
        ref={canvasRef}
        className="block bg-transparent pointer-events-none overflow-visible"
      />
    </div>
  )
}
