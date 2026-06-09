'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const TECH = [
  'REACT.JS', 'TYPESCRIPT', 'NODE.JS', 'ASP.NET CORE', 'REACT NATIVE',
  'MONGODB', 'SOCKET.IO', 'GSAP', 'THREE.JS', 'VERCEL', 'C#',
]

const WAVE_PALETTE = [
  { offset: 0,           amplitude: 65, frequency: 0.0028, color: 'rgba(255,77,0,0.5)',     opacity: 0.5,  lineWidth: 2.0, shadowBlur: 40 },
  { offset: Math.PI*0.6, amplitude: 85, frequency: 0.0022, color: 'rgba(255,77,0,0.25)',    opacity: 0.3,  lineWidth: 1.5, shadowBlur: 25 },
  { offset: Math.PI*1.1, amplitude: 50, frequency: 0.0035, color: 'rgba(248,245,240,0.12)', opacity: 0.2,  lineWidth: 1.0, shadowBlur: 15 },
  { offset: Math.PI*1.6, amplitude: 75, frequency: 0.0018, color: 'rgba(255,77,0,0.12)',    opacity: 0.15, lineWidth: 1.0, shadowBlur: 10 },
]

const MOUSE_INFLUENCE  = 55
const INFLUENCE_RADIUS = 350

let _revealFn: (() => void) | null = null
export function triggerHeroReveal() { _revealFn?.() }

export default function Hero() {
  const sectionRef     = useRef<HTMLElement>(null)
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const mouseRef       = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })

  /* ─── Canvas wave animation ─── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* Mobile — skip canvas entirely */
    if (window.innerWidth < 768) {
      canvas.style.display = 'none'
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf: number
    let time = 0

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    /* Init mouse to center so waves look symmetric on first load */
    mouseRef.current.x = canvas.width  / 2
    mouseRef.current.y = canvas.height / 2
    targetMouseRef.current.x = canvas.width  / 2
    targetMouseRef.current.y = canvas.height / 2

    const onResize     = resize
    const onMouseMove  = (e: MouseEvent) => {
      targetMouseRef.current.x = e.clientX
      targetMouseRef.current.y = e.clientY
    }
    window.addEventListener('resize',    onResize)
    window.addEventListener('mousemove', onMouseMove)

    /* Compute y for a single x on a given wave */
    const getY = (x: number, wave: typeof WAVE_PALETTE[0]) => {
      const amp = reducedMotion ? 20 : wave.amplitude

      let mouseEffect = 0
      if (!reducedMotion) {
        const dx   = x - mouseRef.current.x
        const dy   = canvas.height / 2 - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const inf  = Math.max(0, 1 - dist / INFLUENCE_RADIUS)
        mouseEffect = inf * MOUSE_INFLUENCE * Math.sin(time * 0.0012 + x * 0.008 + wave.offset)
      }

      return canvas.height * 0.52
        + Math.sin(x * wave.frequency + time * 0.0018 + wave.offset) * amp
        + Math.sin(x * wave.frequency * 0.35 + time * 0.0025) * (amp * 0.4)
        + mouseEffect
    }

    const draw = () => {
      /* Lerp mouse toward target */
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08

      /* Solid dark background — canvas owns the fill */
      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.lineCap  = 'round'
      ctx.lineJoin = 'round'

      WAVE_PALETTE.forEach(wave => {
        /* Cache point y-values so we compute trig only once per wave */
        const xs: number[] = []
        const ys: number[] = []
        for (let x = 0; x <= canvas.width; x += 3) {
          xs.push(x)
          ys.push(getY(x, wave))
        }

        const tracePath = () => {
          ctx.beginPath()
          for (let i = 0; i < xs.length; i++) {
            i === 0 ? ctx.moveTo(xs[i], ys[i]) : ctx.lineTo(xs[i], ys[i])
          }
        }

        /* Pass 1 — fat glow layer */
        ctx.save()
        tracePath()
        ctx.lineWidth   = wave.lineWidth * 3
        ctx.strokeStyle = wave.color
        ctx.globalAlpha = wave.opacity * 0.3
        ctx.shadowBlur  = wave.shadowBlur
        ctx.shadowColor = wave.color
        ctx.stroke()
        ctx.restore()

        /* Pass 2 — crisp line on top */
        ctx.save()
        tracePath()
        ctx.lineWidth   = wave.lineWidth
        ctx.strokeStyle = wave.color
        ctx.globalAlpha = wave.opacity
        ctx.shadowBlur  = 0
        ctx.stroke()
        ctx.restore()
      })

      time++
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize',    onResize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  /* ─── GSAP reveal (called by Preloader when strips exit) ─── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const words       = el.querySelectorAll<HTMLSpanElement>('.hero-word')
    const topRight    = el.querySelector<HTMLElement>('.hero-top-right')
    const infoItems   = el.querySelectorAll<HTMLElement>('[data-hero-info]')
    const scrollHint  = el.querySelector<HTMLElement>('.hero-scroll-hint')
    const bottomStrip = el.querySelector<HTMLElement>('.hero-bottom-strip')

    gsap.set(words,       { y: '110%', rotation: 2 })
    gsap.set(topRight,    { opacity: 0, x: 20 })
    gsap.set(infoItems,   { opacity: 0, y: 16 })
    gsap.set(scrollHint,  { opacity: 0 })
    gsap.set(bottomStrip, { y: 48, opacity: 0 })

    const reveal = () => {
      const tl = gsap.timeline()
      tl.to(words,       { y: '0%', rotation: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, 0.1)
      tl.to(topRight,    { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' }, 0.6)
      tl.to(infoItems,   { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1 }, 0.8)
      tl.to(scrollHint,  { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.0)
      tl.to(bottomStrip, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }, 0.9)
    }

    _revealFn = reveal
    return () => { _revealFn = null }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{ position: 'relative', height: '100svh', background: '#111111', overflow: 'hidden' }}
    >
      <style>{`
        @keyframes hero-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes hero-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.45; }
        }
      `}</style>

      {/* ── z:0 — canvas wave background ── */}
      <canvas
        ref={canvasRef}
        style={{
          position:      'absolute',
          inset:         0,
          width:         '100%',
          height:        '100%',
          zIndex:        0,
          pointerEvents: 'none',
        }}
      />

      {/* ── z:1 — all text content ── */}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>

        {/* TOP-RIGHT: availability badge */}
        <div
          className="hero-top-right"
          style={{
            position:      'absolute',
            top:           32,
            right:         'clamp(24px,5vw,80px)',
            display:       'flex',
            alignItems:    'center',
            gap:           8,
            fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
            fontSize:      11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color:         '#FF4D00',
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#FF4D00',
            display: 'inline-block', animation: 'hero-pulse 2s ease-in-out infinite',
          }} />
          Available for work
        </div>

        {/* CENTER: headline + info row */}
        <div style={{
          position:  'absolute',
          top:       '50%',
          left:      'clamp(24px,5vw,80px)',
          right:     'clamp(24px,5vw,80px)',
          transform: 'translateY(-55%)',
        }}>
          {/* Year label */}
          <div style={{
            fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
            fontSize:      11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'rgba(248,245,240,0.3)',
            marginBottom:  24,
          }}>[ 2026 ]</div>

          {/* Line 1 */}
          <div style={{ overflow: 'hidden' }}>
            <span
              className="hero-word"
              style={{
                display:       'block',
                fontFamily:    'var(--font-clash), Syne, sans-serif',
                fontWeight:    800,
                fontSize:      'clamp(64px,10vw,168px)',
                color:         '#F8F5F0',
                lineHeight:    0.9,
                letterSpacing: '-0.04em',
              }}
            >Full Stack</span>
          </div>

          {/* Line 2 */}
          <div style={{ overflow: 'hidden' }}>
            <span
              className="hero-word"
              style={{
                display:       'block',
                fontFamily:    'var(--font-clash), Syne, sans-serif',
                fontWeight:    800,
                fontSize:      'clamp(64px,10vw,168px)',
                color:         '#F8F5F0',
                lineHeight:    0.9,
                letterSpacing: '-0.04em',
              }}
            >Developer<span style={{ color: '#FF4D00' }}>.</span></span>
          </div>

          {/* Info row */}
          <div style={{
            display:    'flex',
            gap:        40,
            marginTop:  40,
            borderTop:  '1px solid rgba(248,245,240,0.08)',
            paddingTop: 20,
            flexWrap:   'wrap',
          }}>
            {([
              { label: 'ROLE',   value: 'Full Stack Developer',     dot: false },
              { label: 'FOCUS',  value: 'Web · Mobile · Real-time', dot: false },
              { label: 'STATUS', value: 'Open to work',             dot: true  },
            ] as const).map(item => (
              <div key={item.label} data-hero-info="">
                <div style={{
                  fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
                  fontSize:      10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color:         '#FF4D00',
                  marginBottom:  6,
                }}>{item.label}</div>
                <div style={{
                  fontFamily: 'var(--font-sans), "Cabinet Grotesk", sans-serif',
                  fontSize:   14,
                  color:      'rgba(248,245,240,0.65)',
                  display:    'flex',
                  alignItems: 'center',
                  gap:        item.dot ? 8 : 0,
                }}>
                  {item.dot && (
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%', background: '#FF4D00',
                      display: 'inline-block', flexShrink: 0,
                      animation: 'hero-pulse 2s ease-in-out infinite',
                    }} />
                  )}
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM-LEFT: scroll hint */}
        <div
          className="hero-scroll-hint"
          style={{
            position:      'absolute',
            bottom:        64,
            left:          'clamp(24px,5vw,80px)',
            fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
            fontSize:      11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'rgba(248,245,240,0.3)',
          }}
        >↓ Scroll</div>

        {/* BOTTOM: tech marquee strip */}
        <div
          className="hero-bottom-strip"
          style={{
            position:   'absolute',
            bottom:     0,
            left:       0,
            width:      '100%',
            height:     48,
            borderTop:  '1px solid rgba(248,245,240,0.06)',
            display:    'flex',
            alignItems: 'center',
            overflow:   'hidden',
            background: 'rgba(248,245,240,0.02)',
          }}
        >
          <div style={{
            display:    'flex',
            whiteSpace: 'nowrap',
            animation:  'hero-marquee 30s linear infinite',
          }}>
            {[...TECH, ...TECH].map((item, i) => (
              <span key={i} style={{
                fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
                fontSize:      11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:         'rgba(248,245,240,0.25)',
                paddingRight:  '2.5em',
              }}>
                {item}&nbsp;<span style={{ color: 'rgba(255,77,0,0.4)' }}>/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── z:2 — grain texture overlay (on top of both canvas and content) ── */}
      <div style={{
        position:        'absolute',
        inset:           0,
        zIndex:          2,
        pointerEvents:   'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        opacity:         0.03,
      }} />
    </section>
  )
}
