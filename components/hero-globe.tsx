"use client"

import React, { useRef, useEffect } from "react"

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Preset circles (metaballs) representing the continents for a procedurally mapped dotted world map
// Coordinates are in degrees (lon: -180 to 180, lat: -90 to 90)
const LAND_CIRCLES = [
  { lon: -40, lat: 72, radius: 12 },   // Greenland
  { lon: -100, lat: 52, radius: 23 },  // Canada
  { lon: -120, lat: 60, radius: 18 },  // Alaska/NW Canada
  { lon: -75, lat: 46, radius: 11 },   // Eastern Canada
  { lon: -95, lat: 38, radius: 16 },   // USA Central
  { lon: -112, lat: 39, radius: 13 },  // USA West
  { lon: -82, lat: 34, radius: 12 },   // USA East
  { lon: -90, lat: 19, radius: 6 },    // Mexico/Central America
  { lon: -80, lat: 9, radius: 4 },     // Panama/Colombia connector
  { lon: -62, lat: -6, radius: 19 },   // South America North (Amazon)
  { lon: -52, lat: -10, radius: 14 },  // South America East (Brazil)
  { lon: -68, lat: -25, radius: 15 },  // South America Mid
  { lon: -71, lat: -42, radius: 9 },   // South America South (Chile/Argentina)
  { lon: 14, lat: 22, radius: 17 },    // Africa Northwest (Sahara)
  { lon: 28, lat: 25, radius: 13 },    // Africa Northeast (Egypt/Libya)
  { lon: 22, lat: 7, radius: 19 },     // Africa Central
  { lon: 32, lat: -2, radius: 14 },    // Africa East
  { lon: 24, lat: -19, radius: 13 },   // Africa South
  { lon: 47, lat: -19, radius: 6 },    // Madagascar
  { lon: 16, lat: 51, radius: 12 },    // Europe Central
  { lon: 1, lat: 46, radius: 8 },      // France/Spain
  { lon: 32, lat: 58, radius: 13 },    // Europe East (Ukraine/Western Russia)
  { lon: 12, lat: 62, radius: 9 },     // Scandinavia (Norway/Sweden)
  { lon: 24, lat: 65, radius: 8 },     // Scandinavia (Finland/North Sweden)
  { lon: -4, lat: 55, radius: 5 },     // United Kingdom
  { lon: 90, lat: 60, radius: 26 },    // Siberia Central
  { lon: 65, lat: 58, radius: 25 },    // Urals / Western Siberia
  { lon: 130, lat: 62, radius: 19 },   // Russia Far East
  { lon: 82, lat: 36, radius: 17 },    // Central Asia (Kazakhstan/Xinjiang)
  { lon: 44, lat: 22, radius: 11 },    // Saudi Arabia
  { lon: 112, lat: 36, radius: 20 },   // China East
  { lon: 122, lat: 48, radius: 15 },   // Northeast China / Manchuria
  { lon: 77, lat: 21, radius: 11 },    // India
  { lon: 102, lat: 16, radius: 9 },     // Indochina (Thailand/Vietnam)
  { lon: 114, lat: -1, radius: 7 },    // Indonesia (Borneo)
  { lon: 120, lat: -6, radius: 5 },    // Indonesia (Java/Sumatra)
  { lon: 122, lat: 11, radius: 5 },    // Philippines
  { lon: 138, lat: 36, radius: 6 },    // Japan
  { lon: 134, lat: -24, radius: 15 },  // Australia Central
  { lon: 144, lat: -30, radius: 10 },  // Australia Southeast
  { lon: 120, lat: -21, radius: 8 }    // Australia Northwest
]

// Query function to check if a lat/lon point lies on land
function checkIsLand(lat: number, lon: number): boolean {
  for (let i = 0; i < LAND_CIRCLES.length; i++) {
    const c = LAND_CIRCLES[i]
    let dLon = Math.abs(lon - c.lon)
    if (dLon > 180) dLon = 360 - dLon
    const dist = Math.hypot(lat - c.lat, dLon)
    if (dist < c.radius) return true
  }
  return false
}

export function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const unitDotsRef = useRef<Point3D[]>([])
  
  // 1. Generate uniform unit sphere dots for the world map outline once upon mount
  useEffect(() => {
    const dots: Point3D[] = []
    const step = 4.2 // Grid sampling step in degrees for balanced density
    
    for (let lat = -80; lat <= 80; lat += step) {
      const latRad = lat * Math.PI / 180
      const cosLat = Math.cos(latRad)
      // Adjust longitude sample step size based on latitude to prevent polar clustering
      const lonStep = step / cosLat
      
      for (let lon = -180; lon < 180; lon += lonStep) {
        if (checkIsLand(lat, lon)) {
          dots.push({
            x: cosLat * Math.sin(lon * Math.PI / 180),
            y: Math.sin(latRad),
            z: cosLat * Math.cos(lon * Math.PI / 180)
          })
        }
      }
    }
    unitDotsRef.current = dots
  }, [])
  
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    
    let ctx = canvas.getContext("2d")
    if (!ctx) return
    
    let animationId: number
    let isDestroyed = false
    
    // Interactive mouse parallax variables
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
    
    // Canvas resizing keeping device pixel ratio sharp
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
    
    // 3D Matrix Transformations
    const TILT_RAD = 23.5 * Math.PI / 180 // 23.5 degrees Earth tilt
    
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
    
    const project = (x: number, y: number, z: number, cx: number, cy: number, cameraDist: number) => {
      const scale = cameraDist / (cameraDist - z)
      return {
        x: cx + x * scale,
        y: cy + y * scale,
        z: z
      }
    }
    
    // Draw vector padlock
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
      
      // Base
      context.beginPath()
      if (context.roundRect) {
        context.roundRect(-w / 2, bodyY - h / 2, w, h, 2)
      } else {
        context.rect(-w / 2, bodyY - h / 2, w, h)
      }
      context.fillStyle = "rgba(250, 204, 21, 0.25)"
      context.fill()
      context.stroke()
      
      // Unlocked Shackle (Leaves a visual gap)
      context.beginPath()
      const leftX = -w * 0.24
      const rightX = w * 0.24
      const topY = bodyY - h / 2 - w * 0.55
      
      context.moveTo(leftX, bodyY - h / 2)
      context.lineTo(leftX, topY + w * 0.24)
      context.arc(0, topY + w * 0.24, w * 0.24, Math.PI, 0, false)
      context.lineTo(rightX, topY + w * 0.38)
      
      context.stroke()
      context.restore()
    }
    
    // Render loop tick
    const tick = () => {
      if (isDestroyed || !canvas || !ctx) return
      
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const cx = width / 2
      const cy = height / 2
      
      ctx.clearRect(0, 0, width, height)
      
      // Radius scaled down to 0.28 (from 0.36) to prevent clipping when padlocks orbit and mouse tilts
      const R = Math.min(width, height) * 0.28
      const cameraDist = R * 2.5
      
      // Smooth cursor parallax lerping
      curMouseX += (targetMouseX - curMouseX) * 0.08
      curMouseY += (targetMouseY - curMouseY) * 0.08
      
      const time = performance.now() * 0.001
      
      // Clockwise West-to-East spins
      const globeAngle = time * 0.06
      const lock1Angle = time * -1.8  // Fast spiral 1 (clockwise)
      const lock2Angle = time * -2.4  // Super fast spiral 2 (clockwise)
      
      interface DrawDot {
        type: "dot"
        z: number
        x: number
        y: number
        size: number
        color: string
      }
      
      interface DrawSegment {
        type: "orbit-line" | "trail-line"
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
      
      type Drawable = DrawDot | DrawSegment | DrawLock
      const drawList: Drawable[] = []
      
      // 1. Render Dotted World Map Globe
      const unitDots = unitDotsRef.current
      unitDots.forEach((ud) => {
        const p_local: Point3D = {
          x: ud.x * R,
          y: ud.y * R,
          z: ud.z * R
        }
        
        // Spin West-to-East (negative angle for clockwise spin)
        let p = rotateY(p_local, -globeAngle)
        
        // Tilt Earth axis by 23.5-degrees
        p = rotateZ(p, TILT_RAD)
        
        // Parallax cursor yaw/pitch
        p = rotateY(p, curMouseX * 0.35)
        p = rotateX(p, curMouseY * 0.35)
        
        const proj = project(p.x, p.y, p.z, cx, cy, cameraDist)
        
        const normZ = proj.z / R
        let opacity = 0
        if (normZ >= 0) {
          opacity = 0.34 + 0.56 * normZ // Front side dots are bright white
        } else {
          opacity = 0.12 + 0.22 * (1 + normZ) // Back side dots are faded
        }
        
        const scale = cameraDist / (cameraDist - proj.z)
        
        drawList.push({
          type: "dot",
          z: proj.z,
          x: proj.x,
          y: proj.y,
          size: 1.5 * scale,
          color: `rgba(255, 255, 255, ${opacity})`
        })
      })
      
      // 2. Render Spiral Orbit Paths & Padlocks
      // Spiral revolves around the Earth's tilted axial polar coordinates
      const addSpiralOrbitAndLock = (
        orbitRadius: number,
        lockAngle: number,
        speed: number,
        oscillationFreq: number,
        maxLatRad: number
      ) => {
        const segments = 100
        const trailLength = 1.2 // Trail length in radians (~69 degrees)
        const direction = speed >= 0 ? 1 : -1
        
        // Generate spiral coordinates behind lock for one complete revolution
        for (let j = 0; j < segments; j++) {
          const angleDiff = (j / segments) * 2 * Math.PI
          const a1 = lockAngle - direction * angleDiff
          const a2 = lockAngle - direction * ((j + 1) / segments) * 2 * Math.PI
          
          // Spiral oscillation: latitude travels dynamically up & down between polar lines
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
          
          // Tilts: Share the EXACT SAME 23.5-degree axial tilt as the dotted world map!
          let p1 = rotateZ(p1_local, TILT_RAD)
          let p2 = rotateZ(p2_local, TILT_RAD)
          
          // Mouse parallax yaw/pitch
          p1 = rotateY(p1, curMouseX * 0.35)
          p1 = rotateX(p1, curMouseY * 0.35)
          p2 = rotateY(p2, curMouseX * 0.35)
          p2 = rotateX(p2, curMouseY * 0.35)
          
          const proj1 = project(p1.x, p1.y, p1.z, cx, cy, cameraDist)
          const proj2 = project(p2.x, p2.y, p2.z, cx, cy, cameraDist)
          
          const zAvg = (proj1.z + proj2.z) / 2
          
          if (angleDiff < trailLength) {
            // Tapered trail (shooting star)
            const opacityMultiplier = 1.0 - angleDiff / trailLength
            drawList.push({
              type: "trail-line",
              z: zAvg,
              x1: proj1.x,
              y1: proj1.y,
              x2: proj2.x,
              y2: proj2.y,
              color: `rgba(250, 204, 21, ${opacityMultiplier * 0.95})`,
              lineWidth: 1.0 + 3.0 * opacityMultiplier
            })
          } else {
            // Faint background spiral path
            const normZ = zAvg / orbitRadius
            const baseOpacity = normZ >= 0 ? 0.22 + 0.18 * normZ : 0.12 + 0.1 * (1 + normZ)
            drawList.push({
              type: "orbit-line",
              z: zAvg,
              x1: proj1.x,
              y1: proj1.y,
              x2: proj2.x,
              y2: proj2.y,
              color: `rgba(250, 204, 21, ${baseOpacity * 0.75})`,
              lineWidth: 0.8
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
        const lockSize = 14.5 * scale
        
        drawList.push({
          type: "lock",
          z: lockProj.z,
          x: lockProj.x,
          y: lockProj.y,
          size: lockSize
        })
      }
      
      // Orbit 1: Spanning up to 55-degrees latitude, fast clockwise spiral
      addSpiralOrbitAndLock(
        R * 1.22,
        lock1Angle,
        -1.8,
        0.22, // Oscillates up and down slowly over rotation
        55 * Math.PI / 180
      )
      
      // Orbit 2: Spanning up to 45-degrees latitude, super fast reverse-phase clockwise spiral
      addSpiralOrbitAndLock(
        R * 1.28,
        lock2Angle,
        -2.4,
        0.18,
        45 * Math.PI / 180
      )
      
      // 3. Painter's Algorithm Depth Sort (furthest to closest)
      drawList.sort((a, b) => a.z - b.z)
      
      // 4. Render Drawables
      drawList.forEach((el) => {
        if (el.type === "dot") {
          ctx.beginPath()
          ctx.arc(el.x, el.y, el.size, 0, Math.PI * 2)
          ctx.fillStyle = el.color
          ctx.fill()
        } else if (el.type === "orbit-line" || el.type === "trail-line") {
          ctx.beginPath()
          ctx.moveTo(el.x1, el.y1)
          ctx.lineTo(el.x2, el.y2)
          ctx.strokeStyle = el.color
          ctx.lineWidth = el.lineWidth
          ctx.stroke()
        } else if (el.type === "lock") {
          const size = el.size
          
          // Soft golden aura glow
          const glow = ctx.createRadialGradient(el.x, el.y, 1, el.x, el.y, size * 1.4)
          glow.addColorStop(0, "rgba(250, 204, 21, 0.45)")
          glow.addColorStop(1, "rgba(250, 204, 21, 0)")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(el.x, el.y, size * 1.4, 0, Math.PI * 2)
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
