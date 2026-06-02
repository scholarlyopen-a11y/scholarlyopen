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
    
    // Mouse interaction states for dynamic parallax tilt
    let targetMouseX = 0
    let targetMouseY = 0
    let curMouseX = 0
    let curMouseY = 0
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      // Normalize to [-1, 1] range
      targetMouseX = x / (rect.width / 2)
      targetMouseY = y / (rect.height / 2)
    }
    
    const handleMouseLeave = () => {
      targetMouseX = 0
      targetMouseY = 0
    }
    
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)
    
    // Resize handler to support responsive canvas layouts & device pixel ratio sharp visuals
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
    
    // 3D Math Helper Constants & Functions
    const TILT_RAD = 23.5 * Math.PI / 180 // Earth's axial tilt: 23.5 degrees
    
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
    
    // Draw vector unlocked padlock in yellow
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
      context.fillStyle = "rgba(250, 204, 21, 0.2)"
      context.fill()
      context.strokeStyle = "#facc15"
      context.stroke()
      
      // Padlock shackle - open/unlocked
      context.beginPath()
      const leftX = -w * 0.24
      const rightX = w * 0.24
      const topY = bodyY - h / 2 - w * 0.55
      
      // Left leg (connected hinge)
      context.moveTo(leftX, bodyY - h / 2)
      context.lineTo(leftX, topY + w * 0.24)
      
      // Top curved arch
      context.arc(0, topY + w * 0.24, w * 0.24, Math.PI, 0, false)
      
      // Right leg (disconnected/open, shorter to show a clear gap)
      context.lineTo(rightX, topY + w * 0.38)
      
      context.strokeStyle = "#facc15"
      context.stroke()
      
      context.restore()
    }
    
    // Core animation tick
    const tick = () => {
      if (isDestroyed || !canvas || !ctx) return
      
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const cx = width / 2
      const cy = height / 2
      
      // Clear with absolute transparency
      ctx.clearRect(0, 0, width, height)
      
      // Responsive sphere size
      const R = Math.min(width, height) * 0.36
      const cameraDist = R * 2.5
      
      // Smooth out cursor movements
      curMouseX += (targetMouseX - curMouseX) * 0.08
      curMouseY += (targetMouseY - curMouseY) * 0.08
      
      const time = performance.now() * 0.001
      
      // Rotation rates
      const globeAngle = time * 0.07 // Slow rotation
      const orbit1Angle = time * 1.9 // Fast yellow orbit 1
      const orbit2Angle = time * -2.4 // Fast reverse orbit 2
      
      // Depth sorting collection
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
      
      // 1. Generate Globe Latitudes
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
          
          // Rotate Earth West-to-East (-globeAngle to spin clockwise)
          let p1 = rotateY(p1_local, -globeAngle)
          let p2 = rotateY(p2_local, -globeAngle)
          
          // Apply 23.5-degree Earth tilt
          p1 = rotateZ(p1, TILT_RAD)
          p2 = rotateZ(p2, TILT_RAD)
          
          // Apply interactive mouse tilting (Yaw & Pitch)
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
            opacity = 0.28 + 0.47 * normZ // Closer features are brighter white
          } else {
            opacity = 0.12 + 0.16 * (1 + normZ) // Further/back features are faint white
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
      
      // 2. Generate Globe Longitudes
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
          
          // Rotate Earth West-to-East
          let p1 = rotateY(p1_local, -globeAngle)
          let p2 = rotateY(p2_local, -globeAngle)
          
          // Apply Earth tilt
          p1 = rotateZ(p1, TILT_RAD)
          p2 = rotateZ(p2, TILT_RAD)
          
          // Apply interactive mouse tilting
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
      
      // 3. Orbits & Locks Generators
      const addOrbitAndLock = (
        orbitRadius: number,
        tiltX: number,
        tiltZ: number,
        lockAngle: number
      ) => {
        const orbitSegments = 90
        const trailLength = 1.15 // length of trail in radians (~66 degrees)
        
        for (let j = 0; j < orbitSegments; j++) {
          const a1 = (j / orbitSegments) * 2 * Math.PI
          const a2 = ((j + 1) / orbitSegments) * 2 * Math.PI
          
          const p1_local: Point3D = { x: orbitRadius * Math.cos(a1), y: 0, z: orbitRadius * Math.sin(a1) }
          const p2_local: Point3D = { x: orbitRadius * Math.cos(a2), y: 0, z: orbitRadius * Math.sin(a2) }
          
          // Fixed tilt
          let p1 = rotateX(p1_local, tiltX)
          p1 = rotateZ(p1, tiltZ)
          
          let p2 = rotateX(p2_local, tiltX)
          p2 = rotateZ(p2, tiltZ)
          
          // Mouse tilts
          p1 = rotateY(p1, curMouseX * 0.35)
          p1 = rotateX(p1, curMouseY * 0.35)
          p2 = rotateY(p2, curMouseX * 0.35)
          p2 = rotateX(p2, curMouseY * 0.35)
          
          const proj1 = project(p1.x, p1.y, p1.z, cx, cy, cameraDist)
          const proj2 = project(p2.x, p2.y, p2.z, cx, cy, cameraDist)
          
          const zAvg = (proj1.z + proj2.z) / 2
          
          // Determine if segment falls within the "falling star" trail trailing the padlock
          let diff = lockAngle - a1
          while (diff < 0) diff += 2 * Math.PI
          while (diff >= 2 * Math.PI) diff -= 2 * Math.PI
          
          if (diff < trailLength) {
            // Tapered trail lines (shooting star)
            const opacityMultiplier = 1.0 - diff / trailLength
            drawList.push({
              type: "trail-line",
              z: zAvg,
              x1: proj1.x,
              y1: proj1.y,
              x2: proj2.x,
              y2: proj2.y,
              color: `rgba(250, 204, 21, ${opacityMultiplier * 0.95})`,
              lineWidth: 1.0 + 3.2 * opacityMultiplier
            })
          } else {
            // Background orbit lines
            const normZ = zAvg / orbitRadius
            const baseOpacity = normZ >= 0 ? 0.22 + 0.18 * normZ : 0.12 + 0.1 * (1 + normZ)
            drawList.push({
              type: "orbit-line",
              z: zAvg,
              x1: proj1.x,
              y1: proj1.y,
              x2: proj2.x,
              y2: proj2.y,
              color: `rgba(250, 204, 21, ${baseOpacity})`,
              lineWidth: 0.8
            })
          }
        }
        
        // Padlock Position
        const lock_local: Point3D = {
          x: orbitRadius * Math.cos(lockAngle),
          y: 0,
          z: orbitRadius * Math.sin(lockAngle)
        }
        
        let lock_tilted = rotateX(lock_local, tiltX)
        lock_tilted = rotateZ(lock_tilted, tiltZ)
        
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
      
      // Orbit 1: Angled positively, fast forward speed
      addOrbitAndLock(
        R * 1.22,
        34 * Math.PI / 180,
        22 * Math.PI / 180,
        orbit1Angle
      )
      
      // Orbit 2: Angled negatively, very fast reverse speed
      addOrbitAndLock(
        R * 1.28,
        -46 * Math.PI / 180,
        -30 * Math.PI / 180,
        orbit2Angle
      )
      
      // 4. Painter's Algorithm Depth Sort (Furthest z to closest z)
      drawList.sort((a, b) => a.z - b.z)
      
      // 5. Render elements
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
          
          // Draw soft radiant glow underneath lock
          const glow = ctx.createRadialGradient(el.x, el.y, 1, el.x, el.y, size * 1.4)
          glow.addColorStop(0, "rgba(250, 204, 21, 0.4)")
          glow.addColorStop(1, "rgba(250, 204, 21, 0)")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(el.x, el.y, size * 1.4, 0, Math.PI * 2)
          ctx.fill()
          
          // Draw Lock vector
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
      className="relative w-full aspect-square max-w-[460px] mx-auto flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
    >
      <canvas 
        ref={canvasRef}
        className="block bg-transparent pointer-events-none"
      />
    </div>
  )
}
