'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

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

  const splitTextToSpans = (text: string) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="hero-char"
        style={{
          display: char === ' ' ? 'inline' : 'inline-block',
          transformOrigin: 'left bottom',
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

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
            if (i === 0) {
              ctx.moveTo(xs[i], ys[i])
            } else {
              ctx.lineTo(xs[i], ys[i])
            }
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

  /* ─── Mouse parallax on headlines ─── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el || window.innerWidth < 768) return

    const words = el.querySelectorAll<HTMLSpanElement>('.hero-word')
    const line1 = words[0]  // "Full Stack"
    const line2 = words[1]  // "Developer."

    let tx1 = 0, ty1 = 0, cx1 = 0, cy1 = 0
    let tx2 = 0, ty2 = 0, cx2 = 0, cy2 = 0
    let raf: number
    let isHovering = false

    const onMove = (e: MouseEvent) => {
      isHovering = true
      tx1 = Math.max(-12, Math.min(12, e.clientX * -0.008))
      ty1 = Math.max(-8,  Math.min(8,  e.clientY * -0.005))
      tx2 = Math.max(-12, Math.min(12, e.clientX *  0.006))
      ty2 = Math.max(-8,  Math.min(8,  e.clientY *  0.004))
    }
    const onLeave = () => { isHovering = false; tx1 = ty1 = tx2 = ty2 = 0 }

    const loop = () => {
      const lf = isHovering ? 0.06 : 0.04
      cx1 += (tx1 - cx1) * lf; cy1 += (ty1 - cy1) * lf
      cx2 += (tx2 - cx2) * lf; cy2 += (ty2 - cy2) * lf
      if (line1) gsap.set(line1, { x: cx1, y: cy1 })
      if (line2) gsap.set(line2, { x: cx2, y: cy2 })
      raf = requestAnimationFrame(loop)
    }
    loop()

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  /* ─── GSAP reveal (called by Preloader when strips exit) ─── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const badge      = el.querySelector<HTMLElement>('.hero-badge')
    const chars      = el.querySelectorAll<HTMLElement>('.hero-char')
    const words      = el.querySelectorAll<HTMLSpanElement>('.hero-word')
    const desc       = el.querySelector<HTMLElement>('.hero-desc')
    const ctas       = el.querySelector<HTMLElement>('.hero-ctas')
    const pills      = el.querySelectorAll<HTMLElement>('.hero-pill')
    const infoGrid   = el.querySelector<HTMLElement>('.hero-info-grid')
    const scrollHint = el.querySelector<HTMLElement>('.hero-scroll-hint')
    const arrowChar  = el.querySelector<HTMLElement>('.hero-scroll-arrow')

    gsap.set(badge,      { opacity: 0, y: -16 })
    gsap.set(chars,      { y: '120%', rotation: 7, opacity: 0 })
    gsap.set(desc,       { opacity: 0, y: 16 })
    gsap.set(ctas,       { opacity: 0, y: 16 })
    gsap.set(pills,      { opacity: 0, scale: 0.8 })
    gsap.set(infoGrid,   { opacity: 0, y: 20 })
    gsap.set(scrollHint, { opacity: 0 })

    /* Scroll hint arrow bounce — infinite after reveal */
    let bounceTween: gsap.core.Tween | null = null

    /* Fade hero elements on scroll out */
    let scrollST: ScrollTrigger | null = null

    const reveal = () => {
      const tl = gsap.timeline({
        onComplete() {
          /* Bounce ↓ arrow */
          if (arrowChar) {
            bounceTween = gsap.to(arrowChar, {
              y: 4, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1,
            })
          }
          /* Fade elements as hero scrolls away */
          scrollST = ScrollTrigger.create({
            trigger: el,
            start:   'top top',
            end:     'bottom top',
            scrub:   true,
            onUpdate(self) {
              const opacity = Math.max(0, 1 - self.progress * 1.5)
              const yOffset = self.progress * -50
              gsap.set([badge, desc, ctas, infoGrid], { opacity, y: yOffset })
              pills.forEach(p => gsap.set(p, { opacity, y: yOffset }))
              gsap.set(words, { opacity })
            },
          })
        },
      })
      tl.to(badge,      { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.1)
      tl.to(chars,      { y: '0%', rotation: 0, opacity: 1, duration: 1.2, ease: 'power4.out', stagger: 0.012 }, 0.2)
      tl.to(desc,       { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.6)
      tl.to(ctas,       { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.7)
      tl.to(pills,      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.05 }, 0.8)
      tl.to(infoGrid,   { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.9)
      tl.to(scrollHint, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.1)
    }

    _revealFn = reveal
    return () => {
      _revealFn = null
      bounceTween?.kill()
      scrollST?.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{ position: 'relative', minHeight: '100vh', height: '100svh', background: '#111111', overflow: 'hidden' }}
    >
      <style>{`
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

      {/* ── Background Glow Blobs ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', left: '50%', top: 0, width: 520, height: 520,
          transform: 'translateX(-50%)', borderRadius: '50%',
          backgroundColor: 'rgba(248, 245, 240, 0.035)', filter: 'blur(140px)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0, width: 360, height: 360,
          borderRadius: '50%',
          backgroundColor: 'rgba(248, 245, 240, 0.025)', filter: 'blur(120px)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '25%', width: 400, height: 400,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 77, 0, 0.02)', filter: 'blur(150px)',
        }} />
      </div>

      {/* ── z:1 — all text content centered flex ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 clamp(24px, 5vw, 80px)',
        textAlign: 'center',
      }}>

        {/* Top Badge */}
        <div
          className="hero-badge"
          style={{
            marginBottom: 'clamp(16px, 3vw, 24px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            borderRadius: 9999,
            border: '1px solid rgba(248, 245, 240, 0.1)',
            backgroundColor: 'rgba(17, 17, 17, 0.6)',
            padding: '8px 16px',
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(248, 245, 240, 0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#FF4D00]" aria-hidden="true" />
          <span>Available for work</span>
        </div>

        {/* Centered Headline */}
        <h1
          className="hero-title"
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(16px, 3vw, 24px)',
            maxWidth: 1000,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
          }}
        >
          {/* Line 1 */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <span
              className="hero-word"
              style={{
                display:       'block',
                fontFamily:    'var(--font-clash), Syne, sans-serif',
                fontWeight:    800,
                fontSize:      'clamp(40px, 7vw, 110px)',
                color:         '#F8F5F0',
                lineHeight:    0.95,
                letterSpacing: '-0.03em',
              }}
            >{splitTextToSpans("Building High-Performance")}</span>
          </div>

          {/* Line 2 */}
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <span
              className="hero-word"
              style={{
                display:       'block',
                fontFamily:    'var(--font-clash), Syne, sans-serif',
                fontWeight:    800,
                fontSize:      'clamp(40px, 7vw, 110px)',
                color:         '#F8F5F0',
                lineHeight:    0.95,
                letterSpacing: '-0.03em',
              }}
            >
              {splitTextToSpans("Digital Experiences")}
              <span className="hero-char" style={{ display: 'inline-block', transformOrigin: 'left bottom', color: '#FF4D00' }}>.</span>
            </span>
          </div>
        </h1>

        {/* Description */}
        <p
          className="hero-desc"
          style={{
            fontFamily: 'var(--font-cabinet), "Plus Jakarta Sans", sans-serif',
            fontSize: 'clamp(15px, 2.2vw, 19px)',
            color: 'rgba(248, 245, 240, 0.65)',
            textAlign: 'center',
            maxWidth: 720,
            lineHeight: 1.6,
            marginBottom: 'clamp(20px, 4vw, 32px)',
          }}
        >
          Full Stack Developer specializing in crafting modern web applications, mobile apps, and real-time interactive experiences with precision and speed.
        </p>

        {/* CTA Buttons */}
        <div
          className="hero-ctas"
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 'clamp(24px, 5vw, 40px)',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#projects"
            className="hero-btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#FF4D00',
              color: '#F8F5F0',
              fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              padding: '16px 32px',
              borderRadius: 9999,
              transition: 'transform 0.3s var(--ease-out), background-color 0.3s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = '#E04400';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#FF4D00';
            }}
          >
            Explore Projects <span style={{ transition: 'transform 0.3s ease' }}>↗</span>
          </a>
          <a
            href="#contact"
            className="hero-btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(248, 245, 240, 0.04)',
              color: 'rgba(248, 245, 240, 0.8)',
              fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              padding: '16px 32px',
              borderRadius: 9999,
              border: '1px solid rgba(248, 245, 240, 0.1)',
              backdropFilter: 'blur(12px)',
              transition: 'transform 0.3s var(--ease-out), border-color 0.3s ease, background-color 0.3s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(248, 245, 240, 0.25)';
              e.currentTarget.style.backgroundColor = 'rgba(248, 245, 240, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(248, 245, 240, 0.1)';
              e.currentTarget.style.backgroundColor = 'rgba(248, 245, 240, 0.04)';
            }}
          >
            Get in Touch
          </a>
        </div>

        {/* Tech Tag Pills List */}
        <ul
          className="hero-pills"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
            maxWidth: 800,
            listStyle: 'none',
            padding: 0,
            margin: '0 auto clamp(24px, 5vw, 40px) auto',
          }}
        >
          {TECH.slice(0, 6).map((tech) => (
            <li
              key={tech}
              className="hero-pill"
              style={{
                borderRadius: 9999,
                border: '1px solid rgba(248, 245, 240, 0.08)',
                backgroundColor: 'rgba(248, 245, 240, 0.03)',
                padding: '8px 16px',
                backdropFilter: 'blur(8px)',
                fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
                fontSize: 11,
                letterSpacing: '0.15em',
                color: 'rgba(248, 245, 240, 0.55)',
                transition: 'color 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FF4D00';
                e.currentTarget.style.borderColor = 'rgba(255, 77, 0, 0.3)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 77, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(248, 245, 240, 0.55)';
                e.currentTarget.style.borderColor = 'rgba(248, 245, 240, 0.08)';
                e.currentTarget.style.backgroundColor = 'rgba(248, 245, 240, 0.03)';
              }}
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Info Grid */}
        <div
          className="hero-info-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            width: '100%',
            maxWidth: 800,
            margin: '0 auto',
            borderRadius: 16,
            border: '1px solid rgba(248, 245, 240, 0.08)',
            backgroundColor: 'rgba(248, 245, 240, 0.02)',
            padding: '20px clamp(16px, 4vw, 32px)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {([
            { label: 'ROLE',   value: 'Full Stack Developer',     dot: false },
            { label: 'FOCUS',  value: 'Web · Mobile · Real-time', dot: false },
            { label: 'STATUS', value: 'Open to work',             dot: true  },
          ] as const).map(item => (
            <div key={item.label} className="hero-info-item" style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
                fontSize:      10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color:         'rgba(248, 245, 240, 0.4)',
                marginBottom:  8,
              }}>{item.label}</div>
              <div style={{
                fontFamily: 'var(--font-sans), "Cabinet Grotesk", sans-serif',
                fontSize:   15,
                fontWeight: 600,
                color:      '#F8F5F0',
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
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

      {/* BOTTOM CENTER: scroll hint */}
      <div
        className="hero-scroll-hint"
        style={{
          position:      'absolute',
          bottom:        32,
          left:          '50%',
          transform:     'translateX(-50%)',
          fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
          fontSize:      11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         'rgba(248,245,240,0.3)',
          zIndex:        3,
        }}
      ><span className="hero-scroll-arrow" style={{ display: 'inline-block' }}>↓</span> Scroll</div>

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
