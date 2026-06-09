'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles } from 'lucide-react'
import ShaderBackground from '@/components/ui/shader-background'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const TECH = [
  'REACT.JS', 'TYPESCRIPT', 'NODE.JS', 'ASP.NET CORE', 'REACT NATIVE',
  'MONGODB', 'SOCKET.IO', 'GSAP', 'THREE.JS', 'VERCEL', 'C#', 'NEXT.JS',
]

let _revealFn: (() => void) | null = null
export function triggerHeroReveal() { _revealFn?.() }

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const splitToSpans = (text: string) =>
    text.split('').map((char, i) => (
      <span
        key={i}
        className="hero-char"
        style={{ display: char === ' ' ? 'inline' : 'inline-block', transformOrigin: 'left bottom' }}
      >
        {char === ' ' ? ' ' : char}
      </span>
    ))

  /* ── Mouse parallax on the two headline lines ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el || window.innerWidth < 768) return

    const words = el.querySelectorAll<HTMLSpanElement>('.hero-word')
    const l1 = words[0], l2 = words[1]
    let tx1 = 0, ty1 = 0, cx1 = 0, cy1 = 0
    let tx2 = 0, ty2 = 0, cx2 = 0, cy2 = 0
    let raf: number, hovering = false

    const onMove = (e: MouseEvent) => {
      hovering = true
      tx1 = Math.max(-10, Math.min(10, e.clientX * -0.005))
      ty1 = Math.max(-5,  Math.min(5,  e.clientY * -0.003))
      tx2 = Math.max(-10, Math.min(10, e.clientX *  0.004))
      ty2 = Math.max(-5,  Math.min(5,  e.clientY *  0.003))
    }
    const onLeave = () => { hovering = false; tx1 = ty1 = tx2 = ty2 = 0 }

    const loop = () => {
      const f = hovering ? 0.06 : 0.04
      cx1 += (tx1 - cx1) * f; cy1 += (ty1 - cy1) * f
      cx2 += (tx2 - cx2) * f; cy2 += (ty2 - cy2) * f
      if (l1) gsap.set(l1, { x: cx1, y: cy1 })
      if (l2) gsap.set(l2, { x: cx2, y: cy2 })
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

  /* ── GSAP reveal (triggered by Preloader) ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const badge     = el.querySelector<HTMLElement>('.hero-badge')
    const chars     = el.querySelectorAll<HTMLElement>('.hero-char')
    const words     = el.querySelectorAll<HTMLSpanElement>('.hero-word')
    const desc      = el.querySelector<HTMLElement>('.hero-desc')
    const ctas      = el.querySelector<HTMLElement>('.hero-ctas')
    const infoGrid  = el.querySelector<HTMLElement>('.hero-info-grid')
    const topBar    = el.querySelector<HTMLElement>('.hero-top-bar')
    const btmBar    = el.querySelector<HTMLElement>('.hero-btm-bar')
    const arrow     = el.querySelector<HTMLElement>('.hero-scroll-arrow')

    gsap.set(topBar,   { opacity: 0 })
    gsap.set(badge,    { opacity: 0, y: -10 })
    gsap.set(chars,    { y: '115%', rotation: 5, opacity: 0 })
    gsap.set(infoGrid, { opacity: 0, x: 24 })
    gsap.set(desc,     { opacity: 0, y: 14 })
    gsap.set(ctas,     { opacity: 0, y: 14 })
    gsap.set(btmBar,   { opacity: 0 })

    let bounce: gsap.core.Tween | null = null
    let scrollST: ScrollTrigger | null = null

    const reveal = () => {
      const tl = gsap.timeline({
        onComplete() {
          if (arrow) {
            bounce = gsap.to(arrow, { y: 5, duration: 0.85, ease: 'sine.inOut', yoyo: true, repeat: -1 })
          }
          scrollST = ScrollTrigger.create({
            trigger: el, start: 'top top', end: 'bottom top', scrub: true,
            onUpdate(self) {
              const op = Math.max(0, 1 - self.progress * 1.6)
              const dy = self.progress * -40
              gsap.set([topBar, badge, desc, ctas, infoGrid, btmBar], { opacity: op })
              gsap.set(words, { opacity: op, y: dy })
            },
          })
        },
      })

      tl.to(topBar,   { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
      tl.to(badge,    { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out' }, 0.12)
      tl.to(chars,    { y: '0%', rotation: 0, opacity: 1, duration: 1.15, ease: 'power4.out', stagger: 0.011 }, 0.18)
      tl.to(infoGrid, { opacity: 1, x: 0, duration: 0.85, ease: 'expo.out' }, 0.5)
      tl.to(desc,     { opacity: 1, y: 0, duration: 0.65, ease: 'expo.out' }, 0.68)
      tl.to(ctas,     { opacity: 1, y: 0, duration: 0.65, ease: 'expo.out' }, 0.78)
      tl.to(btmBar,   { opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.88)
    }

    _revealFn = reveal
    return () => {
      _revealFn = null
      bounce?.kill()
      scrollST?.kill()
    }
  }, [])

  const monoStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono),"JetBrains Mono",monospace',
  }
  const accentDot: React.CSSProperties = {
    width: 5, height: 5, borderRadius: '50%',
    background: '#FF4D00', flexShrink: 0,
    animation: 'hero-pulse 2s ease-in-out infinite',
    display: 'inline-block',
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{ position: 'relative', height: '100svh', minHeight: 600, overflow: 'hidden', background: '#111111' }}
    >
      <style>{`
        @keyframes hero-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @media (max-width:1024px) { .hero-meta-right{display:none!important} }
        @media (max-width:768px)  { .hero-desc-row{flex-direction:column!important;align-items:flex-start!important;gap:20px!important} }
      `}</style>

      {/* ── z0: WebGL shader ── */}
      <ShaderBackground />

      {/* ── z1: radial vignette (pulls edges to black so text pops) ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(17,17,17,0.75) 100%)',
      }} />

      {/* ── z2: grain ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.032,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
      }} />

      {/* ── z3: content ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        padding: '0 var(--gutter)',
      }}>

        {/* ── TOP BAR ── */}
        <div className="hero-top-bar" style={{
          height: 58, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(248,245,240,0.07)',
        }}>
          <span style={{ ...monoStyle, fontSize: 10, letterSpacing: '0.28em', color: 'rgba(248,245,240,0.25)' }}>
            PKY
          </span>

          <div className="hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            border: '1px solid rgba(255,77,0,0.28)',
            backgroundColor: 'rgba(255,77,0,0.07)',
            borderRadius: 9999, padding: '6px 14px',
            ...monoStyle, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(248,245,240,0.8)',
          }}>
            <Sparkles className="h-3 w-3 text-[#FF4D00]" aria-hidden />
            <span>Available for work</span>
          </div>

          <span style={{ ...monoStyle, fontSize: 10, letterSpacing: '0.2em', color: 'rgba(248,245,240,0.25)' }}>
            FULL STACK · 2026
          </span>
        </div>

        {/* ── SPACER ── pushes headline block toward bottom third */}
        <div style={{ flex: 1 }} />

        {/* ── HEADLINE + META ROW ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>

          {/* Left: two-line headline */}
          <h1 style={{ margin: 0, flex: 1, minWidth: 0 }}>
            <div style={{ overflow: 'hidden' }}>
              <span
                className="hero-word"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-clash),Georgia,serif',
                  fontWeight: 300, fontStyle: 'italic',
                  fontVariationSettings: "'WONK' 0,'SOFT' 50,'opsz' 144",
                  fontSize: 'clamp(40px,7.8vw,122px)',
                  color: 'rgba(248,245,240,0.28)',
                  lineHeight: 0.91, letterSpacing: '-0.04em',
                }}
              >
                {splitToSpans('Building High-Performance')}
              </span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span
                className="hero-word"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-clash),Georgia,serif',
                  fontWeight: 900, fontStyle: 'italic',
                  fontVariationSettings: "'WONK' 1,'SOFT' 0,'opsz' 144",
                  fontSize: 'clamp(40px,7.8vw,122px)',
                  color: '#F8F5F0',
                  lineHeight: 0.91, letterSpacing: '-0.04em',
                }}
              >
                {splitToSpans('Digital Experiences')}
                <span className="hero-char" style={{ display: 'inline-block', transformOrigin: 'left bottom', color: '#FF4D00' }}>.</span>
              </span>
            </div>
          </h1>

          {/* Right: index + metadata — hides on < 1024px */}
          <div className="hero-info-grid hero-meta-right" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            gap: 16, paddingLeft: 56, flexShrink: 0,
          }}>
            {/* Large index number */}
            <span style={{
              fontFamily: 'var(--font-clash),Georgia,serif',
              fontWeight: 900, fontStyle: 'italic',
              fontVariationSettings: "'WONK' 1,'SOFT' 0,'opsz' 144",
              fontSize: 'clamp(52px,6vw,96px)',
              lineHeight: 1, color: '#FF4D00', letterSpacing: '-0.05em',
            }}>01</span>

            <div style={{ width: 32, height: 1, background: 'rgba(248,245,240,0.12)' }} />

            {/* Metadata items */}
            {[
              { label: 'ROLE',   value: 'Full Stack Developer', dot: false },
              { label: 'FOCUS',  value: 'Web · Mobile · Real-time', dot: false },
              { label: 'STATUS', value: 'Open to work', dot: true },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'right' }}>
                <div style={{ ...monoStyle, fontSize: 9, letterSpacing: '0.24em', color: 'rgba(248,245,240,0.28)', marginBottom: 4, textTransform: 'uppercase' }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif',
                  fontSize: 13, fontWeight: 500, color: '#F8F5F0',
                  display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'flex-end',
                }}>
                  {item.dot && <span style={accentDot} />}
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DESCRIPTION + CTAs ── */}
        <div className="hero-desc-row" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 32,
          marginBottom: 0,
        }}>
          <p className="hero-desc" style={{
            fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif',
            fontSize: 'clamp(14px,1.4vw,16px)',
            color: 'rgba(248,245,240,0.48)',
            lineHeight: 1.72, maxWidth: 460, margin: 0,
          }}>
            Full Stack Developer crafting modern web applications, mobile apps,
            and real-time systems — built fast and built to last.
          </p>

          <div className="hero-ctas" style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
            <a
              href="#work"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FF4D00', color: '#111111',
                ...monoStyle, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '13px 26px', borderRadius: 9999,
                textDecoration: 'none',
                transition: 'transform .3s var(--ease-out), background-color .3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.backgroundColor = '#E04400' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.backgroundColor = '#FF4D00' }}
            >
              Explore Projects <span>↗</span>
            </a>
            <a
              href="#contact"
              style={{
                display: 'flex', alignItems: 'center',
                background: 'rgba(248,245,240,0.04)',
                color: 'rgba(248,245,240,0.72)',
                ...monoStyle, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '13px 26px', borderRadius: 9999,
                border: '1px solid rgba(248,245,240,0.11)',
                backdropFilter: 'blur(12px)',
                textDecoration: 'none',
                transition: 'border-color .3s, background-color .3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,245,240,0.28)'; e.currentTarget.style.backgroundColor = 'rgba(248,245,240,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,245,240,0.11)'; e.currentTarget.style.backgroundColor = 'rgba(248,245,240,0.04)' }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* ── BOTTOM BAR: ticker + scroll hint ── */}
        <div className="hero-btm-bar" style={{
          height: 44, marginTop: 20, flexShrink: 0,
          borderTop: '1px solid rgba(248,245,240,0.07)',
          display: 'flex', alignItems: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Marquee tape */}
          <ul className="animate-ticker" style={{
            display: 'flex', gap: 40, listStyle: 'none',
            padding: 0, margin: 0, width: 'max-content',
          }}>
            {[...TECH, ...TECH].map((t, i) => (
              <li key={i} style={{
                ...monoStyle, fontSize: 9, letterSpacing: '0.22em',
                color: i % TECH.length === 0 ? 'rgba(255,77,0,0.5)' : 'rgba(248,245,240,0.22)',
                whiteSpace: 'nowrap', userSelect: 'none',
              }}>{t}</li>
            ))}
          </ul>

          {/* Scroll hint — sits center with a mask so ticker passes through */}
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            padding: '0 20px',
            background: 'linear-gradient(90deg, transparent, #111111 28%, #111111 72%, transparent)',
          }}>
            <span style={{
              ...monoStyle, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(248,245,240,0.3)',
              display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
            }}>
              <span className="hero-scroll-arrow" style={{ display: 'inline-block' }}>↓</span>
              SCROLL
            </span>
          </div>

          {/* Fade edges */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, pointerEvents: 'none',
            background: 'linear-gradient(to right, #111111, transparent)',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, pointerEvents: 'none',
            background: 'linear-gradient(to left, #111111, transparent)',
          }} />
        </div>

      </div>
    </section>
  )
}
