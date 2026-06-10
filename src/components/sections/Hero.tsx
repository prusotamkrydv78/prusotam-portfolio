'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ShaderBackground from '@/components/ui/shader-background'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const TECH_BASE = [
  'REACT.JS', 'TYPESCRIPT', 'NODE.JS', 'ASP.NET CORE', 'REACT NATIVE',
  'MONGODB', 'SOCKET.IO', 'GSAP', 'THREE.JS', 'VERCEL', 'C#', 'JWT',
]
/* 4 copies — first two form the "visible" half, last two the "shadow" half.
   Animation moves -50% so the reset is seamless regardless of viewport width. */
const TECH_LOOP = [...TECH_BASE, ...TECH_BASE, ...TECH_BASE, ...TECH_BASE]

let _revealFn: (() => void) | null = null
export function triggerHeroReveal() { _revealFn?.() }

const splitChars = (text: string) =>
  text.split('').map((char, i) => (
    <span
      key={i}
      className="hero-char"
      style={{
        display: char === ' ' ? 'inline' : 'inline-block',
        transformOrigin: 'left bottom',
      }}
    >
      {char === ' ' ? ' ' : char}
    </span>
  ))

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  /* ─── Mouse parallax on headline words ─── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof window === 'undefined' || window.innerWidth < 768) return

    const words = el.querySelectorAll<HTMLSpanElement>('.hero-word')
    const line1 = words[0]
    const line2 = words[1]

    let tx1 = 0, ty1 = 0, cx1 = 0, cy1 = 0
    let tx2 = 0, ty2 = 0, cx2 = 0, cy2 = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      tx1 = Math.max(-10, Math.min(10, e.clientX * -0.006))
      ty1 = Math.max(-6,  Math.min(6,  e.clientY * -0.004))
      tx2 = Math.max(-10, Math.min(10, e.clientX *  0.005))
      ty2 = Math.max(-6,  Math.min(6,  e.clientY *  0.003))
    }
    const onLeave = () => { tx1 = ty1 = tx2 = ty2 = 0 }

    const loop = () => {
      cx1 += (tx1 - cx1) * 0.05; cy1 += (ty1 - cy1) * 0.05
      cx2 += (tx2 - cx2) * 0.05; cy2 += (ty2 - cy2) * 0.05
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

    const topBar     = el.querySelector<HTMLElement>('.hero-top-bar')
    const badge      = el.querySelector<HTMLElement>('.hero-badge')
    const chars      = el.querySelectorAll<HTMLElement>('.hero-char')
    const words      = el.querySelectorAll<HTMLSpanElement>('.hero-word')
    const desc       = el.querySelector<HTMLElement>('.hero-desc')
    const ctas       = el.querySelector<HTMLElement>('.hero-ctas')
    const pills      = el.querySelectorAll<HTMLElement>('.hero-pill')
    const infoGrid   = el.querySelector<HTMLElement>('.hero-info-grid')
    const ticker     = el.querySelector<HTMLElement>('.hero-ticker')
    const scrollHint = el.querySelector<HTMLElement>('.hero-scroll-hint')
    const arrowChar  = el.querySelector<HTMLElement>('.hero-scroll-arrow')

    gsap.set(topBar,     { opacity: 0 })
    gsap.set(badge,      { opacity: 0, y: -12 })
    gsap.set(chars,      { y: '120%', rotation: 6, opacity: 0 })
    gsap.set(desc,       { opacity: 0, y: 14 })
    gsap.set(ctas,       { opacity: 0, y: 14 })
    gsap.set(pills,      { opacity: 0, scale: 0.85 })
    gsap.set(infoGrid,   { opacity: 0, x: 18 })
    gsap.set(ticker,     { opacity: 0 })
    gsap.set(scrollHint, { opacity: 0 })

    let bounceTween: gsap.core.Tween | null = null
    let scrollST:    ScrollTrigger   | null = null

    const reveal = () => {
      const tl = gsap.timeline({
        onComplete() {
          if (arrowChar) {
            bounceTween = gsap.to(arrowChar, {
              y: 4, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1,
            })
          }
          scrollST = ScrollTrigger.create({
            trigger: el,
            start:   'top top',
            end:     'bottom top',
            scrub:   true,
            onUpdate(self) {
              const op = Math.max(0, 1 - self.progress * 1.5)
              const dy = self.progress * -50
              gsap.set([topBar, badge, desc, ctas, infoGrid], { opacity: op, y: dy })
              pills.forEach(p => gsap.set(p, { opacity: op, y: dy }))
              gsap.set(words, { opacity: op })
            },
          })
        },
      })

      tl.to(topBar,     { opacity: 1,                    duration: 0.55, ease: 'expo.out' },             0.0)
      tl.to(badge,      { opacity: 1, y: 0,              duration: 0.65, ease: 'expo.out' },             0.1)
      tl.to(chars,      { y: '0%', rotation: 0, opacity: 1, duration: 1.1,  ease: 'power4.out', stagger: 0.012 }, 0.25)
      tl.to(infoGrid,   { opacity: 1, x: 0,              duration: 0.8,  ease: 'expo.out' },             0.5)
      tl.to(desc,       { opacity: 1, y: 0,              duration: 0.65, ease: 'expo.out' },             0.65)
      tl.to(ctas,       { opacity: 1, y: 0,              duration: 0.65, ease: 'expo.out' },             0.75)
      tl.to(pills,      { opacity: 1, scale: 1,          duration: 0.5,  ease: 'back.out(1.4)', stagger: 0.04 }, 0.85)
      tl.to(ticker,     { opacity: 1,                    duration: 0.5,  ease: 'power2.out' },           0.9)
      tl.to(scrollHint, { opacity: 1,                    duration: 0.4,  ease: 'power2.out' },           1.05)
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
      style={{
        position:        'relative',
        minHeight:       '100vh',
        height:          '100svh',
        background:      '#111111',
        overflow:        'hidden',
        display:         'flex',
        flexDirection:   'column',
      }}
    >
      <style>{`
        @keyframes hero-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        @keyframes hero-tick {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hero-tick-inner {
          animation: hero-tick 24s linear infinite;
        }
        .hero-tick-inner:hover { animation-play-state: paused; }

        @media (max-width: 1023px) {
          .hero-meta-panel      { display: none !important; }
          .hero-headline-wrap   { padding-right: 0 !important; }
        }
        @media (max-width: 639px) {
          .hero-top-right { display: none !important; }
        }
      `}</style>

      {/* ── z:0 — WebGL2 nebula shader ── */}
      <ShaderBackground />

      {/* ── z:1 — all editorial content ── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ╔═══ TOP BAR ═══╗ */}
        <div
          className="hero-top-bar"
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        'clamp(18px,2.8vw,30px) clamp(24px,5vw,80px)',
            borderBottom:   '1px solid rgba(248,245,240,0.06)',
            flexShrink:     0,
          }}
        >
          {/* Monogram */}
          <span style={{
            fontFamily:    'var(--font-clash), Syne, sans-serif',
            fontWeight:    700,
            fontSize:      14,
            letterSpacing: '0.2em',
            color:         '#F8F5F0',
            textTransform: 'uppercase',
          }}>PKY</span>

          {/* Availability badge */}
          <div
            className="hero-badge"
            style={{
              display:         'inline-flex',
              alignItems:      'center',
              gap:             7,
              borderRadius:    0,
              border:          '1px solid rgba(255,77,0,0.2)',
              backgroundColor: 'rgba(255,77,0,0.06)',
              padding:         '6px 14px',
              fontFamily:      'var(--font-mono), "JetBrains Mono", monospace',
              fontSize:        10,
              letterSpacing:   '0.2em',
              textTransform:   'uppercase',
              color:           'rgba(248,245,240,0.7)',
              backdropFilter:  'blur(12px)',
            }}
          >
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: '#FF4D00',
              display: 'inline-block', flexShrink: 0,
              animation: 'hero-pulse 2.5s ease-in-out infinite',
            }} />
            Available for work
          </div>

          {/* Year / stack label */}
          <span
            className="hero-top-right"
            style={{
              fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
              fontSize:      10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         'rgba(248,245,240,0.28)',
            }}
          >FULL STACK · 2026</span>
        </div>

        {/* ╔═══ MAIN CONTENT ═══╗ */}
        <div style={{
          flex:            1,
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'flex-end',
          padding:         'clamp(20px,3vw,40px) clamp(24px,5vw,80px) clamp(20px,2.5vw,32px)',
        }}>

          {/* Headline row + right meta panel */}
          <div style={{
            display:     'flex',
            alignItems:  'flex-end',
            gap:         'clamp(28px,4vw,56px)',
            marginBottom:'clamp(18px,2.5vw,32px)',
          }}>

            {/* ── Headline ── */}
            <div className="hero-headline-wrap" style={{ flex: 1, paddingRight: 'clamp(0px,2vw,24px)' }}>

              {/* Section index label */}
              <p style={{
                fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
                fontSize:      10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         'rgba(248,245,240,0.22)',
                marginBottom:  'clamp(10px,1.8vw,18px)',
              }}>01 — HERO</p>

              <h1 style={{ margin: 0, lineHeight: 0.92, letterSpacing: '-0.03em' }}>

                {/* Line 1 — thin ghosted setup */}
                <div style={{ overflow: 'hidden' }}>
                  <span
                    className="hero-word"
                    style={{
                      display:       'block',
                      fontFamily:    'var(--font-clash), Syne, sans-serif',
                      fontWeight:    300,
                      fontSize:      'clamp(36px,6.8vw,105px)',
                      color:         'rgba(248,245,240,0.22)',
                      lineHeight:    0.95,
                      letterSpacing: '-0.03em',
                      fontStyle:     'italic',
                    }}
                  >{splitChars('Building High-Performance')}</span>
                </div>

                {/* Line 2 — heavy punchline */}
                <div style={{ overflow: 'hidden' }}>
                  <span
                    className="hero-word"
                    style={{
                      display:       'block',
                      fontFamily:    'var(--font-clash), Syne, sans-serif',
                      fontWeight:    800,
                      fontSize:      'clamp(36px,6.8vw,105px)',
                      color:         '#F8F5F0',
                      lineHeight:    0.95,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {splitChars('Digital Experiences')}
                    <span
                      className="hero-char"
                      style={{ display: 'inline-block', transformOrigin: 'left bottom', color: '#FF4D00' }}
                    >.</span>
                  </span>
                </div>
              </h1>
            </div>

            {/* ── Right meta panel — hidden < 1024px ── */}
            <div
              className="hero-info-grid hero-meta-panel"
              style={{
                flexShrink:     0,
                width:          'clamp(130px,13vw,185px)',
                display:        'flex',
                flexDirection:  'column',
                gap:            14,
                paddingBottom:  2,
              }}
            >
              {/* Large index number */}
              <span style={{
                display:       'block',
                fontFamily:    'var(--font-clash), Syne, sans-serif',
                fontWeight:    800,
                fontSize:      'clamp(60px,7.5vw,105px)',
                lineHeight:    1,
                letterSpacing: '-0.04em',
                color:         '#FF4D00',
                opacity:       0.8,
              }}>01</span>

              {/* Metadata rows */}
              {([
                { label: 'ROLE',   value: 'Full Stack Dev', dot: false },
                { label: 'FOCUS',  value: 'Web · Mobile',   dot: false },
                { label: 'STATUS', value: 'Open to work',   dot: true  },
              ] as const).map(item => (
                <div key={item.label}>
                  <p style={{
                    fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
                    fontSize:      9,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         'rgba(248,245,240,0.28)',
                    marginBottom:  3,
                  }}>{item.label}</p>
                  <p style={{
                    fontFamily:  'var(--font-mono), "JetBrains Mono", monospace',
                    fontSize:    11,
                    color:       'rgba(248,245,240,0.7)',
                    display:     'flex',
                    alignItems:  'center',
                    gap:         5,
                    margin:      0,
                  }}>
                    {item.dot && (
                      <span style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: '#FF4D00', display: 'inline-block', flexShrink: 0,
                        animation: 'hero-pulse 2.5s ease-in-out infinite',
                      }} />
                    )}
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, background: 'rgba(248,245,240,0.06)', marginBottom: 'clamp(18px,2.5vw,30px)' }} />

          {/* Desc + CTAs */}
          <div style={{
            display:     'flex',
            alignItems:  'flex-start',
            gap:         'clamp(20px,4vw,56px)',
            flexWrap:    'wrap',
            marginBottom:'clamp(16px,2vw,24px)',
          }}>
            <p
              className="hero-desc"
              style={{
                flex:       '1 1 280px',
                fontFamily: 'var(--font-cabinet), "Plus Jakarta Sans", sans-serif',
                fontSize:   'clamp(13px,1.4vw,16px)',
                color:      'rgba(248,245,240,0.5)',
                lineHeight: 1.7,
                maxWidth:   460,
                margin:     0,
              }}
            >
              Full Stack Developer crafting modern web applications, mobile apps, and real-time systems — with precision and speed.
            </p>

            <div className="hero-ctas" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
              <a
                href="#projects"
                style={{
                  display:         'inline-flex',
                  alignItems:      'center',
                  gap:             7,
                  backgroundColor: '#FF4D00',
                  color:           '#F8F5F0',
                  fontFamily:      'var(--font-mono), "JetBrains Mono", monospace',
                  fontSize:        10,
                  fontWeight:      600,
                  textTransform:   'uppercase',
                  letterSpacing:   '0.15em',
                  padding:         '12px 22px',
                  borderRadius:    0,
                  textDecoration:  'none',
                  transition:      'transform 0.3s cubic-bezier(0.19,1,0.22,1), background-color 0.2s ease',
                  whiteSpace:      'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.backgroundColor = '#E04400' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.backgroundColor = '#FF4D00' }}
              >
                View Projects ↗
              </a>
              <a
                href="#contact"
                style={{
                  display:         'inline-flex',
                  alignItems:      'center',
                  backgroundColor: 'rgba(248,245,240,0.04)',
                  color:           'rgba(248,245,240,0.7)',
                  fontFamily:      'var(--font-mono), "JetBrains Mono", monospace',
                  fontSize:        10,
                  fontWeight:      600,
                  textTransform:   'uppercase',
                  letterSpacing:   '0.15em',
                  padding:         '12px 22px',
                  borderRadius:    0,
                  border:          '1px solid rgba(248,245,240,0.1)',
                  textDecoration:  'none',
                  transition:      'transform 0.3s cubic-bezier(0.19,1,0.22,1), border-color 0.2s ease, background-color 0.2s ease',
                  whiteSpace:      'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'rgba(248,245,240,0.22)'; e.currentTarget.style.backgroundColor = 'rgba(248,245,240,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.borderColor = 'rgba(248,245,240,0.1)';  e.currentTarget.style.backgroundColor = 'rgba(248,245,240,0.04)' }}
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Tech pills */}
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 7, listStyle: 'none', margin: 0, padding: 0 }}>
            {(['REACT.JS', 'TYPESCRIPT', 'NODE.JS', 'ASP.NET CORE', 'REACT NATIVE', 'MONGODB'] as const).map(tech => (
              <li
                key={tech}
                className="hero-pill"
                style={{
                  borderRadius:    0,
                  border:          '1px solid rgba(248,245,240,0.08)',
                  backgroundColor: 'rgba(248,245,240,0.03)',
                  padding:         '5px 12px',
                  fontFamily:      'var(--font-mono), "JetBrains Mono", monospace',
                  fontSize:        9,
                  letterSpacing:   '0.14em',
                  textTransform:   'uppercase',
                  color:           'rgba(248,245,240,0.4)',
                  transition:      'color 0.25s ease, border-color 0.25s ease, background-color 0.25s ease',
                  cursor:          'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF4D00'; e.currentTarget.style.borderColor = 'rgba(255,77,0,0.22)'; e.currentTarget.style.backgroundColor = 'rgba(255,77,0,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,245,240,0.4)'; e.currentTarget.style.borderColor = 'rgba(248,245,240,0.08)'; e.currentTarget.style.backgroundColor = 'rgba(248,245,240,0.03)' }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* ╔═══ BOTTOM BAR: ticker + scroll hint ═══╗ */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          borderTop:      '1px solid rgba(248,245,240,0.06)',
          flexShrink:     0,
          height:         44,
          overflow:       'hidden',
        }}>
          {/* Marquee ticker */}
          <div
            className="hero-ticker"
            style={{
              flex:              1,
              overflow:          'hidden',
              height:            '100%',
              display:           'flex',
              alignItems:        'center',
              maskImage:         'linear-gradient(90deg, transparent 0%, black 6%, black 82%, transparent 100%)',
              WebkitMaskImage:   'linear-gradient(90deg, transparent 0%, black 6%, black 82%, transparent 100%)',
            }}
          >
            <div className="hero-tick-inner" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              {TECH_LOOP.map((t, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 18px' }}>
                  <span style={{ color: '#FF4D00', fontSize: 7, opacity: 0.65 }}>◆</span>
                  <span style={{
                    fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
                    fontSize:      9,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color:         'rgba(248,245,240,0.35)',
                  }}>{t}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div
            className="hero-scroll-hint"
            style={{
              flexShrink:    0,
              padding:       '0 clamp(24px,5vw,80px)',
              fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
              fontSize:      10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'rgba(248,245,240,0.22)',
              display:       'flex',
              alignItems:    'center',
              gap:           6,
              borderLeft:    '1px solid rgba(248,245,240,0.06)',
              height:        '100%',
            }}
          >
            <span className="hero-scroll-arrow" style={{ display: 'inline-block' }}>↓</span>
            Scroll
          </div>
        </div>
      </div>

      {/* Film grain overlay */}
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
