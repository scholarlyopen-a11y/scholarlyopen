"use client"

import React, { useRef, useEffect } from "react"

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
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
      
      interface DrawSegment {
        type: "globe-line" | "orbit-line" | "trail-line"
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
      
      // 1. Generate Globe Latitude segments
      const latCount = 9
      const lonSegments = 36
      for (let i = 0; i < latCount; i++) {
        const lat = -Math.PI / 2 + ((i + 1) / (latCount + 1)) * Math.PI
        const r = R * Math.cos(lat)
        const y = R * Math.sin(lat)
        
        for (let j = 0; j < lonSegments; j++) {
          const theta1 = (j / lonSegments) * 2 * Math.PI
          const theta2 = ((j + 1) / lonSegments) * 2 * Math.PI
          
          const p1_local: Point3D = { x: r * Math.sin(theta1), y: y, z: r * Math.cos(theta1) }
          const p2_local: Point3D = { x: r * Math.sin(theta2), y: y, z: r * Math.cos(theta2) }
          
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
            opacity = 0.28 + 0.47 * normZ // Front: Bright white
          } else {
            opacity = 0.12 + 0.16 * (1 + normZ) // Back: Translucent/faint white
          }
          
          drawList.push({
            type: "globe-line",
            z: zAvg,
            x1: proj1.x,
            y1: proj1.y,
            x2: proj2.x,
            y2: proj2.y,
            color: `rgba(255, 255, 255, ${opacity})`,
            lineWidth: normZ >= 0 ? 1.05 : 0.8
          })
        }
      }
      
      // 2. Generate Globe Longitude segments
      const lonCount = 12
      const latSegments = 24
      for (let i = 0; i < lonCount; i++) {
        const lon = (i / lonCount) * 2 * Math.PI
        
        for (let j = 0; j < latSegments; j++) {
          const lat1 = -Math.PI / 2 + (j / latSegments) * Math.PI
          const lat2 = -Math.PI / 2 + ((j + 1) / latSegments) * Math.PI
          
          const p1_local: Point3D = {
            x: R * Math.cos(lat1) * Math.sin(lon),
            y: R * Math.sin(lat1),
            z: R * Math.cos(lat1) * Math.cos(lon)
          }
          
          const p2_local: Point3D = {
            x: R * Math.cos(lat2) * Math.sin(lon),
            y: R * Math.sin(lat2),
            z: R * Math.cos(lat2) * Math.cos(lon)
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
            opacity = 0.28 + 0.47 * normZ
          } else {
            opacity = 0.12 + 0.16 * (1 + normZ)
          }
          
          drawList.push({
            type: "globe-line",
            z: zAvg,
            x1: proj1.x,
            y1: proj1.y,
            x2: proj2.x,
            y2: proj2.y,
            color: `rgba(255, 255, 255, ${opacity})`,
            lineWidth: normZ >= 0 ? 1.05 : 0.8
          })
        }
      }
      
      // 3. Render 5 Spiral Orbit Paths & Open Padlocks
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
        if (el.type === "globe-line" || el.type === "orbit-line" || el.type === "trail-line") {
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
