'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import type { PanelType } from '@/lib/data'

/* ── Abstract canvas animations ── */
function useAbstractCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, type: PanelType) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width  = 320
    canvas.height = 220
    const W = 320, H = 220
    let raf: number, t = 0
    const orange = '#FF4D00'

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#1C1C1C'
      ctx.fillRect(0, 0, W, H)
      t += 0.016

      if (type === 'network') {
        const nodes = Array.from({ length: 10 }, (_, i) => ({
          x: 30 + (i % 4) * 85 + Math.sin(t + i) * 10,
          y: 30 + Math.floor(i / 4) * 80 + Math.cos(t * 0.8 + i) * 10,
        }))
        nodes.forEach((a, i) => {
          nodes.forEach((b, j) => {
            if (j <= i) return
            const d = Math.hypot(a.x - b.x, a.y - b.y)
            if (d < 120) {
              ctx.strokeStyle = `rgba(255,77,0,${(1 - d / 120) * 0.6})`
              ctx.lineWidth = 0.8
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
            }
          })
          ctx.beginPath(); ctx.arc(a.x, a.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = orange; ctx.fill()
        })

      } else if (type === 'layers') {
        for (let i = 4; i >= 0; i--) {
          const yOff = ((t * 20 + i * 36) % (H + 40)) - 20
          ctx.strokeStyle = `rgba(255,77,0,${0.15 + i * 0.12})`
          ctx.lineWidth = 1
          ctx.strokeRect(24 + i * 6, yOff, W - 48 - i * 12, 32)
        }

      } else if (type === 'ripple') {
        for (let i = 0; i < 4; i++) {
          const phase = (t * 0.8 + i * 0.6) % (Math.PI * 2)
          const r     = 20 + i * 46 + Math.sin(phase) * 12
          const alpha = Math.max(0, 0.7 - r / 160)
          ctx.strokeStyle = `rgba(255,77,0,${alpha})`
          ctx.lineWidth = 1.2
          ctx.beginPath(); ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2); ctx.stroke()
        }

      } else if (type === 'grid') {
        const cols = 5, rows = 5
        const cw = (W - 48) / cols, ch = (H - 48) / rows
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const flicker = Math.sin(t * 3 + r * 1.7 + c * 2.3)
            const alpha = flicker > 0.3 ? 0.55 : 0.08
            ctx.fillStyle = `rgba(255,77,0,${alpha})`
            ctx.fillRect(24 + c * cw + 4, 24 + r * ch + 4, cw - 8, ch - 8)
          }
        }

      } else if (type === 'hex') {
        const size = 22, hx = size * Math.sqrt(3), hy = size * 1.5
        for (let r = -1; r < 6; r++) {
          for (let c = -1; c < 8; c++) {
            const x = c * hx + (r % 2) * hx / 2
            const y = r * hy
            const wave = Math.sin(t * 1.5 - c * 0.5)
            const alpha = 0.06 + (wave * 0.5 + 0.5) * 0.3
            ctx.strokeStyle = `rgba(255,77,0,${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            for (let k = 0; k < 6; k++) {
              const a  = Math.PI / 3 * k - Math.PI / 6
              const px = x + size * Math.cos(a)
              const py = y + size * Math.sin(a)
              k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
            }
            ctx.closePath(); ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [type, canvasRef])
}

function PanelCanvas({ type }: { type: PanelType }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useAbstractCanvas(ref, type)
  return <canvas ref={ref} width={320} height={220} style={{ display: 'block' }} />
}

/* ── Project row ── */
interface Props {
  index:   string
  title:   string
  year:    string
  tags:    string[]
  panel:   PanelType
  github:  string
  live:    string | null
  isLast:  boolean
}

export default function ProjectRow({ index, title, year, tags, panel, github, live, isLast }: Props) {
  const rowRef    = useRef<HTMLDivElement>(null)
  const panelRef  = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const txRef = useRef(0), tyRef = useRef(0)
  const xRef  = useRef(0), yRef  = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const loop = () => {
      txRef.current += (xRef.current - txRef.current) * 0.1
      tyRef.current += (yRef.current - tyRef.current) * 0.1
      if (panelRef.current) {
        panelRef.current.style.transform =
          `translate(${txRef.current - 160}px, ${tyRef.current - 110}px)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleMove = (e: React.MouseEvent) => {
    if (!rowRef.current) return
    const r = rowRef.current.getBoundingClientRect()
    xRef.current = e.clientX - r.left
    yRef.current = e.clientY - r.top
  }

  const handleEnter = () => {
    setHovered(true)
    if (panelRef.current)
      gsap.fromTo(panelRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1,    opacity: 1, duration: 0.35, ease: 'expo.out' }
      )
  }

  const handleLeave = () => {
    setHovered(false)
    if (panelRef.current)
      gsap.to(panelRef.current, { scale: 1.05, opacity: 0, duration: 0.25, ease: 'expo.in' })
  }

  return (
    <a
      href={live ?? github}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'block', textDecoration: 'none' }}
      data-cursor-view
    >
      <div
        ref={rowRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onMouseMove={handleMove}
        style={{
          position: 'relative',
          borderBottom: isLast ? 'none' : '1px solid var(--line)',
          background: hovered ? 'var(--surface-1)' : 'transparent',
          transition: 'background 0.25s ease',
          cursor: 'none',
          padding: '0 var(--gutter)',
        }}
      >
        {/* 12-col grid row */}
        <div
          className="grid-12 container"
          style={{ padding: 0, alignItems: 'center', height: '88px' }}
        >
          {/* Index — col 1-2 */}
          <span
            className="t-label col-span-2"
            style={{ color: 'var(--text-secondary)', gridColumn: '1 / 3' }}
          >
            {index}
          </span>

          {/* Title — col 3-8 */}
          <span
            className="t-heading"
            style={{
              gridColumn: '3 / 9',
              color: hovered ? 'var(--accent)' : 'var(--text-primary)',
              transition: 'color 0.25s ease',
              fontWeight: 600,
            }}
          >
            {title}
          </span>

          {/* Year — col 9-10 */}
          <span
            className="t-label"
            style={{ gridColumn: '9 / 11', color: 'var(--text-secondary)' }}
          >
            {year}
          </span>

          {/* Tags — col 11-12 */}
          <span
            className="t-label"
            style={{ gridColumn: '11 / 13', color: 'var(--text-secondary)' }}
          >
            {tags.join(' · ')}
          </span>
        </div>

        {/* Hover panel */}
        <div
          ref={panelRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            opacity: 0,
            zIndex: 50,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          }}
        >
          <PanelCanvas type={panel} />
        </div>
      </div>
    </a>
  )
}
