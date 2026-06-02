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
  // Greenland
  { lon: -40, lat: 72, radius: 12 },   
  { lon: -55, lat: 78, radius: 8 },
  { lon: -30, lat: 70, radius: 7 },
  
  // North America
  { lon: -100, lat: 52, radius: 23 },  // Canada
  { lon: -125, lat: 60, radius: 17 },  // Alaska/NW Canada
  { lon: -75, lat: 46, radius: 11 },   // Eastern Canada
  { lon: -140, lat: 62, radius: 10 },  // Aleutians / West Alaska
  { lon: -95, lat: 38, radius: 16 },   // USA Central
  { lon: -115, lat: 38, radius: 13 },  // USA West
  { lon: -82, lat: 34, radius: 12 },   // USA East
  { lon: -120, lat: 45, radius: 11 },
  { lon: -75, lat: 40, radius: 8 },
  { lon: -102, lat: 24, radius: 9 },   // Mexico
  { lon: -90, lat: 19, radius: 6 },    // Central America
  { lon: -84, lat: 12, radius: 4 },
  { lon: -80, lat: 9, radius: 3 },     // Panama
  { lon: -72, lat: 19, radius: 4 },    // Caribbean
  { lon: -64, lat: 14, radius: 3 },
  { lon: -80, lat: 22, radius: 4 },
  
  // South America
  { lon: -62, lat: -6, radius: 19 },   // Brazil North/Amazon
  { lon: -52, lat: -10, radius: 14 },  // Brazil East
  { lon: -72, lat: -4, radius: 12 },   // Peru/Ecuador
  { lon: -68, lat: -22, radius: 15 },  // Bolivia/Paraguay
  { lon: -58, lat: -20, radius: 13 },
  { lon: -70, lat: -38, radius: 12 },  // Chile/Argentina
  { lon: -68, lat: -48, radius: 9 },   // Patagonia
  
  // Africa
  { lon: 14, lat: 22, radius: 17 },    // Sahara West
  { lon: 2, lat: 20, radius: 13 },
  { lon: -8, lat: 16, radius: 11 },
  { lon: 10, lat: 12, radius: 14 },
  { lon: 28, lat: 25, radius: 13 },    // Sahara East
  { lon: 32, lat: 20, radius: 10 },
  { lon: 22, lat: 7, radius: 19 },     // Central Africa
  { lon: 30, lat: -2, radius: 14 },    // East Africa
  { lon: 16, lat: -4, radius: 13 },
  { lon: 24, lat: -20, radius: 13 },   // South Africa
  { lon: 28, lat: -28, radius: 10 },
  { lon: 47, lat: -19, radius: 6 },    // Madagascar
  { lon: 49, lat: -14, radius: 4 },
  
  // Europe
  { lon: 16, lat: 51, radius: 11 },    // Central Europe
  { lon: 8, lat: 48, radius: 9 },
  { lon: -1, lat: 43, radius: 7 },     // Spain/Portugal
  { lon: -5, lat: 40, radius: 6 },
  { lon: 32, lat: 58, radius: 13 },    // Eastern Europe
  { lon: 42, lat: 52, radius: 11 },
  { lon: 28, lat: 50, radius: 10 },
  { lon: 12, lat: 62, radius: 9 },     // Scandinavia
  { lon: 24, lat: 66, radius: 8 },
  { lon: 16, lat: 57, radius: 6 },
  { lon: -4, lat: 55, radius: 5 },     // United Kingdom
  { lon: -8, lat: 53, radius: 4 },     // Ireland
  { lon: 13, lat: 42, radius: 4 },     // Italy
  { lon: 22, lat: 38, radius: 3 },     // Greece
  
  // Asia
  { lon: 90, lat: 60, radius: 26 },    // Siberia
  { lon: 65, lat: 58, radius: 25 },
  { lon: 115, lat: 62, radius: 22 },
  { lon: 140, lat: 64, radius: 18 },
  { lon: 155, lat: 65, radius: 13 },
  { lon: 82, lat: 36, radius: 17 },    // Central Asia
  { lon: 68, lat: 35, radius: 13 },
  { lon: 55, lat: 32, radius: 10 },
  { lon: 44, lat: 22, radius: 11 },    // Middle East (Saudi)
  { lon: 52, lat: 18, radius: 8 },
  { lon: 112, lat: 36, radius: 20 },   // China East
  { lon: 122, lat: 48, radius: 15 },
  { lon: 104, lat: 28, radius: 12 },
  { lon: 77, lat: 21, radius: 11 },    // India
  { lon: 74, lat: 14, radius: 7 },
  { lon: 102, lat: 16, radius: 9 },     // Southeast Asia
  { lon: 106, lat: 11, radius: 6 },
  { lon: 138, lat: 36, radius: 6 },    // Japan
  { lon: 142, lat: 41, radius: 5 },
  { lon: 114, lat: -1, radius: 7 },    // Indonesia (Borneo)
  { lon: 120, lat: -6, radius: 5 },    // Java/Sumatra
  { lon: 122, lat: 11, radius: 5 },    // Philippines
  
  // Australia
  { lon: 134, lat: -24, radius: 15 },  
  { lon: 144, lat: -30, radius: 10 },  
  { lon: 148, lat: -34, radius: 6 },
  { lon: 120, lat: -21, radius: 8 },
  { lon: 146, lat: -42, radius: 3 },   // Tasmania
  { lon: 172, lat: -41, radius: 5 }    // New Zealand
]

// Check if a point lies on land using the high-fidelity metaballs centers
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
  
  // Generate uniform unit sphere dots once when component mounts
  useEffect(() => {
    const dots: Point3D[] = []
    const step = 4.0 // High resolution grid step size in degrees
    
    for (let lat = -80; lat <= 80; lat += step) {
      const latRad = lat * Math.PI / 180
      const cosLat = Math.cos(latRad)
      // Adjust longitude density based on latitude to prevent polar clustering
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
    
    // Resize handler to match device pixel ratio for sharp rendering
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
    const TILT_RAD = 23.5 * Math.PI / 180 // Earth's 23.5-degree axial tilt
    
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
    
    // Draw highly-detailed open padlock swung open to show visual gap
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
      
      // Padlock base (body)
      context.beginPath()
      if (context.roundRect) {
        context.roundRect(-w / 2, bodyY - h / 2, w, h, 2)
      } else {
        context.rect(-w / 2, bodyY - h / 2, w, h)
      }
      context.fillStyle = "rgba(250, 204, 21, 0.25)"
      context.fill()
      context.stroke()
      
      // Open / Unlocked Shackle (Swung open by 25 degrees on the left hinge)
      context.save()
      const leftX = -w * 0.24
      context.translate(leftX, bodyY - h / 2)
      context.rotate(25 * Math.PI / 180) // Swing open realistic padlock!
      
      context.beginPath()
      context.moveTo(0, 0)
      context.lineTo(0, -w * 0.55 + w * 0.24)
      context.arc(w * 0.24, -w * 0.55 + w * 0.24, w * 0.24, Math.PI, 0, false)
      context.lineTo(w * 0.48, -w * 0.55 + w * 0.38)
      
      context.strokeStyle = "#facc15"
      context.stroke()
      context.restore()
      
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
      
      // Radius set to 0.27 to leave plenty of canvas bounds for 5 orbiting padlocks and mouse parallax
      const R = Math.min(width, height) * 0.27
      const cameraDist = R * 2.5
      
      // Smooth cursor parallax lerp
      curMouseX += (targetMouseX - curMouseX) * 0.08
      curMouseY += (targetMouseY - curMouseY) * 0.08
      
      const time = performance.now() * 0.001
      
      // West-to-East clockwise rotation
      const globeAngle = time * 0.06
      
      // Angles for 5 unlocked padlocks moving at different speeds (all clockwise matching Earth)
      const lock1Angle = time * -1.5
      const lock2Angle = time * -2.1 + 1.2
      const lock3Angle = time * -1.2 + 2.5
      const lock4Angle = time * -2.7 + 3.8
      const lock5Angle = time * -1.8 + 5.1
      
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
      
      // 1. Render Cyan/Light Blue Dotted World Map Globe (Like Group 189)
      const unitDots = unitDotsRef.current
      unitDots.forEach((ud) => {
        const p_local: Point3D = {
          x: ud.x * R,
          y: ud.y * R,
          z: ud.z * R
        }
        
        // Spin clockwise
        let p = rotateY(p_local, -globeAngle)
        
        // Axial tilt
        p = rotateZ(p, TILT_RAD)
        
        // Mouse tilting
        p = rotateY(p, curMouseX * 0.35)
        p = rotateX(p, curMouseY * 0.35)
        
        const proj = project(p.x, p.y, p.z, cx, cy, cameraDist)
        
        const normZ = proj.z / R
        let opacity = 0
        if (normZ >= 0) {
          opacity = 0.35 + 0.55 * normZ // Front: Bright glowing cyan/blue
        } else {
          opacity = 0.12 + 0.23 * (1 + normZ) // Back: Soft translucent cyan/blue
        }
        
        const scale = cameraDist / (cameraDist - proj.z)
        
        // Volumetric Halftone Shading size calculation: front dots are larger, back dots are tiny
        // This beautifully maps the shaded volume contours of Group 189
        const size = (0.9 + 1.8 * Math.max(0, normZ)) * scale
        
        drawList.push({
          type: "dot",
          z: proj.z,
          x: proj.x,
          y: proj.y,
          size: size,
          // Gorgeous Sky Blue/Cyan color matching Group 189
          color: `rgba(56, 189, 248, ${opacity})` 
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
