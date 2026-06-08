'use client'

import { useEffect, useRef } from 'react'

/* ─── Colours ────────────────────────────────────────────────── */
const LIGHT = { r: 17,  g: 17,  b: 17  }  // #111111 — on light sections
const DARK  = { r: 248, g: 245, b: 240 }  // #F8F5F0 — on dark sections

/* Sections that have a dark background */
const DARK_SELECTOR = '#hero, #process, #proof, #contact'

/* ─── Trail settings ─────────────────────────────────────────── */
const MAX_PTS     = 80    // max stored positions
const LERP        = 0.18  // mouse-to-smooth lerp — organic but not laggy
const BASE_WIDTH  = 2.5   // px at the cursor tip

interface Pt { x: number; y: number }

/* ─── Component ───────────────────────────────────────────────── */
export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    /* Skip on touch / reduced-motion — restore native cursor */
    const coarse       = window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coarse || reducedMotion) {
      document.documentElement.style.cursor = 'auto'
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.style.display = 'block'

    /* ── Sizing ── */
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── State ── */
    const mouse     = { x: -1, y: -1 }   // raw mouse; -1 = not yet received
    const smooth    = { x: -1, y: -1 }   // lerped position
    const pts: Pt[] = []                  // trail points
    const col       = { ...LIGHT }        // current stroke colour (floating RGB)
    let   isDark    = false               // target theme
    let   raf       = 0

    /* ── Mouse tracking ── */
    const onMove = (e: MouseEvent) => {
      /* First event — snap smooth immediately so there's no draw-from-corner */
      if (mouse.x === -1) {
        smooth.x = e.clientX
        smooth.y = e.clientY
      }
      mouse.x = e.clientX
      mouse.y = e.clientY

      /* Section theme */
      const el = document.elementFromPoint(e.clientX, e.clientY)
      isDark = el?.closest(DARK_SELECTOR) !== null
    }
    window.addEventListener('mousemove', onMove)

    /* ── Draw loop ── */
    const tick = () => {
      /* Nothing until the mouse has entered the viewport */
      if (mouse.x === -1) {
        raf = requestAnimationFrame(tick)
        return
      }

      /* Step 1 — lerp smooth position toward real mouse */
      smooth.x += (mouse.x - smooth.x) * LERP
      smooth.y += (mouse.y - smooth.y) * LERP

      /* Step 2 — push smoothed point if it moved enough */
      const last = pts[pts.length - 1]
      const dx   = last ? smooth.x - last.x : Infinity
      const dy   = last ? smooth.y - last.y : Infinity
      if (dx * dx + dy * dy > 1) {
        pts.push({ x: smooth.x, y: smooth.y })
      }

      /* Step 3 — trim trail to max length */
      if (pts.length > MAX_PTS) pts.splice(0, pts.length - MAX_PTS)

      /* Step 4 — lerp stroke colour toward section target */
      const target = isDark ? DARK : LIGHT
      col.r += (target.r - col.r) * 0.05
      col.g += (target.g - col.g) * 0.05
      col.b += (target.b - col.b) * 0.05
      const stroke = `rgb(${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)})`

      /* Step 5 — clear canvas */
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      /* Step 6 — draw tapered quadratic spline through midpoints */
      if (pts.length >= 3) {
        ctx.lineCap  = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = stroke  // same colour for all segments; set once

        for (let i = 1; i < pts.length - 1; i++) {
          const t  = i / (pts.length - 1)  // 0 = tail, 1 = head
          const p0 = pts[i - 1]
          const p1 = pts[i]
          const p2 = pts[i + 1]

          /* Midpoints give C1-continuous curve with no visual seam */
          const sx = (p0.x + p1.x) / 2
          const sy = (p0.y + p1.y) / 2
          const ex = (p1.x + p2.x) / 2
          const ey = (p1.y + p2.y) / 2

          ctx.globalAlpha = 0.88 * t        // tail fades to transparent
          ctx.lineWidth   = BASE_WIDTH * t  // tail tapers to zero width

          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.quadraticCurveTo(p1.x, p1.y, ex, ey)
          ctx.stroke()
        }

        /* Always reset globalAlpha so it doesn't bleed into other renders */
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'none',  /* shown via JS only on pointer:fine devices */
      }}
    />
  )
}
