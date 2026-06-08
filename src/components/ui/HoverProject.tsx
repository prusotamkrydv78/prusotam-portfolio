'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'

type Visual = 'network' | 'layers' | 'ripple' | 'grid' | 'hex'

/* ── Abstract canvas visuals ── */
function useAbstractCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, visual: Visual) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width  = 360
    const H = canvas.height = 240
    let raf: number
    let t = 0

    const accent = '#00E5A0'

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#1A1A1A'
      ctx.fillRect(0, 0, W, H)
      t += 0.02

      if (visual === 'network') {
        // animated dot network
        const dots = Array.from({ length: 12 }, (_, i) => ({
          x: 40 + (i % 4) * 90 + Math.sin(t + i) * 12,
          y: 40 + Math.floor(i / 4) * 90 + Math.cos(t * 0.7 + i) * 12,
        }))
        dots.forEach((a, i) => {
          dots.forEach((b, j) => {
            if (j <= i) return
            const d = Math.hypot(a.x - b.x, a.y - b.y)
            if (d < 130) {
              ctx.strokeStyle = `rgba(0,229,160,${1 - d / 130})`
              ctx.lineWidth = 0.5
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
            }
          })
          ctx.beginPath(); ctx.arc(a.x, a.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = accent; ctx.fill()
        })

      } else if (visual === 'layers') {
        // stacked rectangles drifting
        for (let i = 0; i < 5; i++) {
          const y = 30 + i * 40 + Math.sin(t + i * 0.8) * 6
          const alpha = 0.1 + i * 0.15
          ctx.strokeStyle = `rgba(0,229,160,${alpha})`
          ctx.lineWidth = 1
          ctx.strokeRect(40 + i * 8, y, W - 80 - i * 16, 28)
        }

      } else if (visual === 'ripple') {
        // concentric circles
        for (let i = 0; i < 5; i++) {
          const r = 20 + i * 38 + ((t * 30 + i * 40) % 190)
          const alpha = Math.max(0, 1 - r / 190) * 0.6
          ctx.strokeStyle = `rgba(0,229,160,${alpha})`
          ctx.lineWidth = 1.5
          ctx.beginPath(); ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2); ctx.stroke()
        }

      } else if (visual === 'grid') {
        // fragmented grid tiles
        const cols = 6, rows = 4, cw = W / cols, ch = H / rows
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const ox = Math.sin(t + r * 0.5 + c * 0.3) * 4
            const oy = Math.cos(t * 0.8 + c * 0.5) * 4
            const alpha = 0.05 + Math.abs(Math.sin(t + r + c)) * 0.2
            ctx.strokeStyle = `rgba(0,229,160,${alpha})`
            ctx.lineWidth = 0.5
            ctx.strokeRect(c * cw + ox + 2, r * ch + oy + 2, cw - 4, ch - 4)
          }
        }

      } else if (visual === 'hex') {
        // hexagonal pulse grid
        const size = 28
        const hx = size * Math.sqrt(3)
        const hy = size * 1.5
        for (let r = -1; r < 5; r++) {
          for (let c = -1; c < 7; c++) {
            const x = c * hx + (r % 2) * hx / 2
            const y = r * hy + H / 2 - 60
            const pulse = Math.sin(t * 2 + r + c) * 0.5 + 0.5
            ctx.strokeStyle = `rgba(0,229,160,${0.08 + pulse * 0.25})`
            ctx.lineWidth = 1
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
              const a = Math.PI / 3 * i - Math.PI / 6
              const px = x + size * Math.cos(a)
              const py = y + size * Math.sin(a)
              i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
            }
            ctx.closePath(); ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [visual, canvasRef])
}

/* ── Follower card ── */
function ProjectCard({ visual }: { visual: Visual }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useAbstractCanvas(canvasRef, visual)
  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={240}
      style={{ display: 'block', borderRadius: 4 }}
    />
  )
}

/* ── Row ── */
interface RowProps {
  id:       string
  title:    string
  year:     string
  tags:     string[]
  visual:   Visual
  github:   string
  live:     string | null
  isLast:   boolean
}

export default function ProjectRow({ id, title, year, tags, visual, github, live, isLast }: RowProps) {
  const rowRef     = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const xRef = useRef(0), yRef = useRef(0)
  const txRef = useRef(0), tyRef = useRef(0)
  const rafRef = useRef<number>(0)

  // lerp follower
  useEffect(() => {
    const tick = () => {
      txRef.current += (xRef.current - txRef.current) * 0.1
      tyRef.current += (yRef.current - tyRef.current) * 0.1
      if (cardRef.current) {
        cardRef.current.style.transform = `translate(${txRef.current}px, ${tyRef.current}px) translate(-50%, -50%)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current) return
    const rect = rowRef.current.getBoundingClientRect()
    xRef.current = e.clientX - rect.left
    yRef.current = e.clientY - rect.top
  }

  const handleEnter = () => {
    setHovered(true)
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'expo.out' })
    }
  }

  const handleLeave = () => {
    setHovered(false)
    if (cardRef.current) {
      gsap.to(cardRef.current, { scale: 0.85, opacity: 0, duration: 0.25, ease: 'expo.in' })
    }
  }

  return (
    <a
      href={live ?? github}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <div
        ref={rowRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          borderBottom: isLast ? 'none' : '1px solid var(--bg-surface)',
          background: hovered ? 'var(--bg-invert)' : 'transparent',
          transition: 'background 0.3s',
          cursor: 'none',
          padding: '28px 0',
        }}
      >
        <div className="flex items-center justify-between container">
          {/* Title */}
          <span
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 52px)',
              letterSpacing: '-0.02em',
              color: hovered ? 'var(--accent)' : 'var(--ink-primary)',
              transition: 'color 0.3s',
            }}
          >
            {title}
          </span>

          {/* Meta */}
          <div
            className="hidden sm:flex items-center gap-6"
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: 'var(--type-small)',
              color: 'var(--ink-muted)',
            }}
          >
            <span>{year}</span>
            <span>{tags.join(' · ')}</span>
          </div>
        </div>

        {/* Floating preview card */}
        <div
          ref={cardRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            opacity: 0,
            zIndex: 50,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <ProjectCard visual={visual} />
        </div>
      </div>
    </a>
  )
}
