'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 3000
const MOBILE_COUNT   = 500
const SPEED          = 0.015
const REPULSE_RADIUS = 150
const REPULSE_STRENGTH = 0.3

interface Particle {
  x: number; y: number; z: number
  vx: number; vy: number
  ox: number; oy: number
}

function isMobile() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
}

export default function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse     = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const count = isMobile() ? MOBILE_COUNT : PARTICLE_COUNT
    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width  = W
    canvas.height = H

    const particles: Particle[] = Array.from({ length: count }, () => {
      const x = Math.random() * W
      const y = Math.random() * H
      return { x, y, ox: x, oy: y, z: Math.random() * 100 - 50, vx: 0, vy: 0 }
    })

    const onResize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W
      canvas.height = H
    }
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove)

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      particles.forEach((p) => {
        // drift
        p.ox += (Math.random() - 0.5) * SPEED
        p.oy += (Math.random() - 0.5) * SPEED

        // repulsion
        const dx = p.x - mouse.current.x
        const dy = p.y - mouse.current.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < REPULSE_RADIUS) {
          const force = (REPULSE_RADIUS - d) / REPULSE_RADIUS * REPULSE_STRENGTH
          p.vx += (dx / d) * force
          p.vy += (dy / d) * force
        }

        p.vx *= 0.92
        p.vy *= 0.92
        p.x = p.ox + p.vx
        p.y = p.oy + p.vy

        // wrap
        if (p.ox < 0) p.ox = W
        if (p.ox > W) p.ox = 0
        if (p.oy < 0) p.oy = H
        if (p.oy > H) p.oy = 0

        const alpha = 0.15 + (p.z + 50) / 100 * 0.4
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245,242,238,${alpha})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
