'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'
import { useFloatingPanel } from '@/hooks/useFloatingPanel'

gsap.registerPlugin(ScrollTrigger)

const JOURNEY = [
  {
    year: '2026 —',
    title: 'Full Stack Developer',
    subtitle: 'Independent',
    body: 'Building with TypeScript, React, Node.js, and ASP.NET Core. Working across web and mobile platforms. Shipping production apps from scratch.',
  },
  {
    year: '2024 — 2025',
    title: 'Full Stack Transition',
    subtitle: null,
    body: 'Moved from frontend-only to full stack. Built real-time apps, REST APIs, and mobile applications. 391+ GitHub contributions in the last year.',
  },
  {
    year: '2023',
    title: 'Started Coding',
    subtitle: null,
    body: 'First line of JavaScript. React within 3 months. Full stack within 12. Still going.',
  },
  {
    year: '[Year] —',
    title: '[Degree / College Name]',
    subtitle: 'Computer Science / IT',
    body: '← Update with your actual education details.',
  },
]

type JourneyCanvas = 'network' | 'layers' | 'terminal' | 'hex'
const JOURNEY_CANVAS: JourneyCanvas[] = ['network', 'layers', 'terminal', 'hex']

function JourneyPanelCanvas({ type }: { type: JourneyCanvas }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width  = 320
    canvas.height = 220
    const W = 320, H = 220
    let raf: number, t = 0

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#1C1C1C'
      ctx.fillRect(0, 0, W, H)
      t += 0.016

      if (type === 'network') {
        /* Connected nodes — full stack interconnection */
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
          ctx.fillStyle = '#FF4D00'; ctx.fill()
        })

      } else if (type === 'layers') {
        /* Stacking layers — transition / growth */
        for (let i = 4; i >= 0; i--) {
          const yOff = ((t * 20 + i * 36) % (H + 40)) - 20
          ctx.strokeStyle = `rgba(255,77,0,${0.15 + i * 0.12})`
          ctx.lineWidth = 1
          ctx.strokeRect(24 + i * 6, yOff, W - 48 - i * 12, 32)
        }

      } else if (type === 'terminal') {
        /* Code lines appearing — first line of code */
        const lineWidths = [160, 120, 200, 80, 180, 140, 220, 100]
        const lineH = 9
        const startY = 24
        const lineGap = 22

        for (let i = 0; i < lineWidths.length; i++) {
          const cycleDur = 2.4
          const phase = (t * 0.65 + i * 0.3) % cycleDur
          let w: number, alpha: number
          if (phase < 1) {
            w = lineWidths[i] * phase
            alpha = 0.7
          } else {
            w = lineWidths[i]
            alpha = 0.7 * (1 - (phase - 1) / (cycleDur - 1))
          }
          if (alpha < 0.02) continue
          ctx.fillStyle = `rgba(255,77,0,${alpha * 0.5})`
          ctx.fillRect(24, startY + i * lineGap, w, lineH)
          if (phase < 1) {
            ctx.fillStyle = `rgba(255,77,0,${alpha})`
            ctx.fillRect(24 + w, startY + i * lineGap, 2, lineH)
          }
        }
        /* Blinking cursor at bottom */
        if (Math.floor(t * 2) % 2 === 0) {
          ctx.fillStyle = 'rgba(255,77,0,0.9)'
          ctx.fillRect(24, startY + (lineWidths.length - 1) * lineGap, 2, lineH)
        }

      } else if (type === 'hex') {
        /* Hex grid — structured, education/foundation */
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
  }, [type])

  return <canvas ref={canvasRef} width={320} height={220} style={{ display: 'block' }} />
}

function JourneyEntry({ entry, canvasType }: {
  entry: typeof JOURNEY[0]
  canvasType: JourneyCanvas
}) {
  const { panelRef, showPanel, hidePanel } = useFloatingPanel()

  return (
    <div style={{ position: 'relative' }}>
      <div
        className="journey-entry"
        style={{ cursor: 'default' }}
        onMouseEnter={showPanel}
        onMouseLeave={hidePanel}
      >
        {/* Year column */}
        <div style={{ overflow: 'hidden', paddingTop: 4 }}>
          <span
            data-year
            className="t-meta"
            style={{ color: 'var(--accent)', display: 'block', fontWeight: 500 }}
          >
            {entry.year}
          </span>
        </div>

        {/* Content column */}
        <div data-entry-content>
          <h3
            style={{
              fontFamily: 'var(--font-display), Syne, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(18px, 2vw, 24px)',
              lineHeight: 1.2,
              color: 'var(--text-primary)',
              marginBottom: entry.subtitle ? 6 : 12,
            }}
          >
            {entry.title}
          </h3>
          {entry.subtitle && (
            <p
              className="t-label"
              style={{ color: 'var(--text-secondary)', marginBottom: 12 }}
            >
              {entry.subtitle}
            </p>
          )}
          <p
            style={{
              fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
              fontSize: 15,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: 560,
            }}
          >
            {entry.body}
          </p>
        </div>
      </div>

      {/* Floating panel — fixed, tracks cursor */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          visibility: 'hidden',
          zIndex: 9999,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        }}
      >
        <JourneyPanelCanvas type={canvasType} />
      </div>
    </div>
  )
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const years    = sectionRef.current.querySelectorAll('[data-year]')
    const contents = sectionRef.current.querySelectorAll('[data-entry-content]')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        years,
        { y: '105%' },
        {
          y: '0%',
          duration: DUR_MID, ease: EASE_OUT, stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )

      gsap.from(contents, {
        opacity: 0, y: 20,
        duration: DUR_MID, ease: EASE_OUT, stagger: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        delay: 0.1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      style={{
        background: 'var(--white)',
        paddingTop: 'var(--section-v)',
        paddingBottom: 'var(--section-v)',
      }}
    >
      <style>{`
        .journey-entry {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 0 64px;
          border-top: 1px solid var(--line);
          padding-top: 40px;
          padding-bottom: 40px;
        }
        @media (max-width: 680px) {
          .journey-entry {
            grid-template-columns: 1fr;
            gap: 12px 0;
          }
        }
      `}</style>

      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 48 }}>
          JOURNEY
        </p>

        <h2 style={{ marginBottom: 64 }}>
          {['The path', 'here.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span
                className="t-title"
                style={{ display: 'block', color: 'var(--text-primary)' }}
              >
                {line}
              </span>
            </div>
          ))}
        </h2>

        <div>
          {JOURNEY.map((entry, i) => (
            <JourneyEntry
              key={i}
              entry={entry}
              canvasType={JOURNEY_CANVAS[i]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
