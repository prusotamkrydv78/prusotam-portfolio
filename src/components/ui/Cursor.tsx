'use client'

import { useEffect, useRef } from 'react'

/* ─── Colours ────────────────────────────────────────────────── */
const LIGHT = { r: 17,  g: 17,  b: 17  }   // #111111 — light sections
const DARK  = { r: 248, g: 245, b: 240 }   // #F8F5F0 — dark sections
const DARK_SELECTOR      = '#hero, #process, #proof, #contact'
const DARK_SELECTOR_NAV  = `${DARK_SELECTOR}, #top-nav, #hamburger-btn`

/* ─── Trail settings ─────────────────────────────────────────── */
const MAX_PTS        = 80    // max stored trail points
const LERP           = 0.18  // smooth-to-mouse lerp factor
const MAX_WIDTH      = 5.0   // px at widest point of bell curve
const IDLE_THRESHOLD = 120   // ms before retraction begins
const DOT_LERP       = 0.38  // dot ball follows mouse faster than trail
const DOT_R          = 5     // dot ball radius px

/* ─── Types ──────────────────────────────────────────────────── */
interface Pt { x: number; y: number }

interface HlState {
  cx: number; cy: number          // element centre on screen
  rx: number; ry: number          // ellipse radii (element half-size + padding)
  progress:   number              // 0 → 1: arc completion
  opacity:    number              // 1 → 0: fade-out
  phase:      'drawing' | 'holding' | 'erasing'
  holdFrames: number
  color:      string              // stroke color for this ellipse
}

/* ─── Component ───────────────────────────────────────────────── */
export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    /* Skip on touch / reduced-motion — restore native cursor */
    const coarse        = window.matchMedia('(pointer: coarse)').matches
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

    /* ── Mutable state (inside closure — no React re-renders) ── */
    const mouse  = { x: -1, y: -1 }   // raw mouse; -1 = not yet received
    const smooth = { x: -1, y: -1 }   // lerped position (trail)
    const dot    = { x: -1, y: -1 }   // fast-lerp position (dot ball)
    const pts: Pt[] = []               // trail points
    const col = { ...LIGHT }           // current stroke colour (float RGB)
    let isDark       = false
    let lastMoveTime = Date.now()
    let raf          = 0
    let hl: HlState | null = null      // active highlight ellipse
    let activeHlEl: Element | null = null  // element currently being highlighted

    /* ── Mouse tracking ── */
    const onMove = (e: MouseEvent) => {
      if (mouse.x === -1) { smooth.x = e.clientX; smooth.y = e.clientY; dot.x = e.clientX; dot.y = e.clientY }
      mouse.x = e.clientX
      mouse.y = e.clientY
      lastMoveTime = Date.now()

      const el = document.elementFromPoint(e.clientX, e.clientY)
      const navOpen = (document.getElementById('nav-overlay') as HTMLElement | null)?.style.visibility === 'visible'
      isDark = el?.closest(navOpen ? DARK_SELECTOR : DARK_SELECTOR_NAV) !== null
    }
    window.addEventListener('mousemove', onMove)

    /* ── Highlight element listeners ── */
    const attachHighlight = (el: Element) => {
      el.addEventListener('mouseenter', () => {
        activeHlEl = el
        const r = el.getBoundingClientRect()
        const colorAttr = (el as HTMLElement).dataset?.cursorColor
        hl = {
          cx: r.left + r.width  / 2,
          cy: r.top  + r.height / 2,
          rx: r.width  / 2 + 10,
          ry: r.height / 2 + 8,
          progress:   0,
          opacity:    1,
          phase:      'drawing',
          holdFrames: 0,
          color:      colorAttr ?? '#C8EF4A',
        }
      })
      el.addEventListener('mouseleave', () => {
        activeHlEl = null
        if (hl) hl.phase = 'erasing'
      })
    }

    /* Attach to elements already in the DOM */
    document.querySelectorAll('[data-cursor="highlight"]').forEach(attachHighlight)

    /* Pick up elements added later (e.g. after route transitions) */
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => m.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return
        if (node.matches('[data-cursor="highlight"]')) attachHighlight(node)
        node.querySelectorAll('[data-cursor="highlight"]').forEach(attachHighlight)
      }))
    })
    observer.observe(document.body, { childList: true, subtree: true })

    /* ── Main animation loop ── */
    const tick = () => {
      /* Wait until first mousemove */
      if (mouse.x === -1) { raf = requestAnimationFrame(tick); return }

      const isIdle = Date.now() - lastMoveTime > IDLE_THRESHOLD

      /* ── Step 1: Update trail points ── */
      if (!isIdle) {
        /* Normal — accumulate smoothed points */
        smooth.x += (mouse.x - smooth.x) * LERP
        smooth.y += (mouse.y - smooth.y) * LERP

        const last = pts[pts.length - 1]
        const dx = last ? smooth.x - last.x : Infinity
        const dy = last ? smooth.y - last.y : Infinity
        if (dx * dx + dy * dy > 1) pts.push({ x: smooth.x, y: smooth.y })
        if (pts.length > MAX_PTS) pts.splice(0, pts.length - MAX_PTS)
      } else {
        /* Idle — drop tail points so the stroke retreats along its own drawn path */
        if (pts.length > 0) pts.splice(0, 1)
      }

      /* ── Step 2: Update dot position (always, even on idle) ── */
      dot.x += (mouse.x - dot.x) * DOT_LERP
      dot.y += (mouse.y - dot.y) * DOT_LERP

      /* ── Step 4: Lerp stroke colour ── */
      const target = isDark ? DARK : LIGHT
      col.r += (target.r - col.r) * 0.05
      col.g += (target.g - col.g) * 0.05
      col.b += (target.b - col.b) * 0.05
      const stroke = `rgb(${Math.round(col.r)},${Math.round(col.g)},${Math.round(col.b)})`

      /* ── Step 5: Clear canvas ── */
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      /* ── Step 6: Draw calligraphy trail (bell-curve width) ── */
      if (pts.length >= 3) {
        ctx.lineCap     = 'round'
        ctx.lineJoin    = 'round'
        ctx.strokeStyle = stroke

        for (let i = 1; i < pts.length - 1; i++) {
          const t  = i / (pts.length - 1)  // 0 = tail end, 1 = cursor tip
          const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1]

          /* Midpoints ensure C1-continuous spline with no seam between segments */
          const sx = (p0.x + p1.x) / 2, sy = (p0.y + p1.y) / 2
          const ex = (p1.x + p2.x) / 2, ey = (p1.y + p2.y) / 2

          /* Bell-curve: 0 at both ends, peaks at t=0.5 */
          ctx.lineWidth   = Math.max(0.3, Math.sin(t * Math.PI) * MAX_WIDTH)
          /* Alpha: bell-curve base + linear boost so the tip stays slightly visible */
          ctx.globalAlpha = Math.max(0.05, Math.sin(t * Math.PI) * 0.85 + t * 0.15)

          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.quadraticCurveTo(p1.x, p1.y, ex, ey)
          ctx.stroke()
        }

        ctx.globalAlpha = 1  // always reset so it doesn't leak
      }

      /* ── Step 7: Live-update highlight bounds (handles dynamic element resize) ── */
      if (activeHlEl && hl && hl.phase !== 'erasing') {
        const r = activeHlEl.getBoundingClientRect()
        const tcx = r.left + r.width  / 2
        const tcy = r.top  + r.height / 2
        const trx = r.width  / 2 + 10
        const try_ = r.height / 2 + 8
        hl.cx += (tcx - hl.cx) * 0.12
        hl.cy += (tcy - hl.cy) * 0.12
        hl.rx += (trx - hl.rx) * 0.12
        hl.ry += (try_ - hl.ry) * 0.12
      }

      /* ── Step 8: Draw highlight ellipse ── */
      if (hl !== null) {
        ctx.save()
        ctx.beginPath()

        const STEPS = 80
        const drawn = Math.floor(hl.progress * STEPS)

        for (let i = 0; i <= drawn; i++) {
          /* 2.2π = slightly more than one full rotation — open ends, no clean closure */
          const angle   = (i / STEPS) * Math.PI * 2.2
          /* Sine wobble on both axes for a hand-drawn, imperfect feel */
          const wobX    = Math.sin(angle * 3 + 1.2) * 2.5
          const wobY    = Math.cos(angle * 2 + 0.8) * 2.0
          const x = hl.cx + (hl.rx + wobX) * Math.cos(angle)
          const y = hl.cy + (hl.ry + wobY) * Math.sin(angle)
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.strokeStyle = hl.color
        ctx.lineWidth   = 1.8
        ctx.lineCap     = 'round'
        ctx.globalAlpha = hl.opacity * 0.7
        ctx.stroke()
        ctx.restore()

        /* Advance phase state */
        if (hl.phase === 'drawing') {
          hl.progress = Math.min(1, hl.progress + 0.045) // ~22 frames to complete
          if (hl.progress >= 1) hl.phase = 'holding'
        } else if (hl.phase === 'holding') {
          hl.holdFrames++
          /* After 0.5s holding, subtle opacity pulse — feels alive */
          if (hl.holdFrames > 30) {
            hl.opacity = 0.6 + Math.sin(Date.now() * 0.004) * 0.2
          }
        } else {
          /* erasing */
          hl.opacity -= 0.06
          if (hl.opacity <= 0) hl = null
        }
      }

      /* ── Step 9: Draw dot ball ── */
      ctx.save()
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, DOT_R, 0, Math.PI * 2)
      ctx.fillStyle = stroke
      ctx.globalAlpha = 0.92
      ctx.fill()
      ctx.restore()

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      observer.disconnect()
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
        display: 'none',  /* shown only on pointer:fine devices (set via JS above) */
      }}
    />
  )
}
