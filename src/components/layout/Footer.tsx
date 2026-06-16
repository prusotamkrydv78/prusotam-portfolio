'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { person } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const SITEMAP = [
  { label: 'Work',     href: '#work' },
  { label: 'About',    href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact',  href: '#contact' },
]

/* Marquee items (moved here from the old straight Proof ticker) */
const MARQUEE = [
  'TypeScript-first', 'Production deployed', 'Mobile + Web', '391+ contributions',
  '72 public repos', 'Self-taught, production-ready', 'Consistent committer',
  'MERN + .NET breadth', 'Real-time systems',
]
const REPEATS = 4
const MARQUEE_SEQ = Array.from({ length: REPEATS }).flatMap(() => MARQUEE)

const MUTED = 'rgba(246,243,237,0.5)'

const META: React.CSSProperties = {
  fontFamily: 'var(--font-mono),"JetBrains Mono",monospace',
  fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'rgba(246,243,237,0.3)',
}

export default function Footer() {
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const giantTextRef = useRef<HTMLDivElement>(null)
  const headingRef   = useRef<HTMLHeadingElement>(null)
  const linksRef     = useRef<HTMLDivElement>(null)
  const curveTextRef = useRef<SVGTextPathElement>(null)

  /* ── Cinematic scroll choreography (parallax giant text + staggered reveal) ── */
  useEffect(() => {
    if (!wrapperRef.current) return
    const ctx = gsap.context(() => {
      /* Giant background wordmark — parallax in */
      gsap.fromTo(giantTextRef.current,
        { yPercent: 18, scale: 0.82, opacity: 0 },
        { yPercent: 0, scale: 1, opacity: 1, ease: 'power1.out',
          scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', end: 'bottom bottom', scrub: 1 } }
      )
      /* Heading + links — staggered rise */
      gsap.fromTo([headingRef.current, linksRef.current],
        { y: 56, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: wrapperRef.current, start: 'top 45%', end: 'bottom bottom', scrub: 1 } }
      )
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  /* ── Parabolic marquee — animate text along the curved path ── */
  useEffect(() => {
    const tp = curveTextRef.current
    if (!tp) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false
    let tween: gsap.core.Tween | null = null

    const start = () => {
      if (cancelled || !curveTextRef.current) return
      let oneSet = 0
      try { oneSet = (tp.getComputedTextLength() || 0) / REPEATS } catch { /* not measurable yet */ }
      if (!oneSet || !isFinite(oneSet)) oneSet = 2200
      gsap.set(tp, { attr: { startOffset: -oneSet } })
      if (reduce) return
      tween = gsap.to(tp, { attr: { startOffset: -oneSet * 2 }, duration: oneSet / 55, ease: 'none', repeat: -1 })
    }

    if (typeof document !== 'undefined' && document.fonts?.ready) document.fonts.ready.then(start)
    else start()
    return () => { cancelled = true; tween?.kill() }
  }, [])

  const scrollTo = (href: string) => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis
    if (href === '#top') {
      if (lenis) lenis.scrollTo(0, { duration: 1.6 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (lenis) lenis.scrollTo(href, { duration: 1.4 })
    else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const linkBase: React.CSSProperties = {
    fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif',
    fontSize: 15, color: MUTED, textDecoration: 'none',
    transition: 'color 0.25s ease', cursor: 'none',
  }
  const onEnter = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = 'var(--g-room-ink)' }
  const onLeave = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = MUTED }

  return (
    <>
      <style>{`
        @keyframes footer-pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes footer-breathe {
          0%   { transform: translate(-50%,-50%) scale(1);    opacity: 0.4; }
          100% { transform: translate(-50%,-50%) scale(1.12); opacity: 0.78; }
        }
        @keyframes footer-heartbeat {
          0%,100% { transform: scale(1); }
          15%,45% { transform: scale(1.25); }
          30%     { transform: scale(1); }
        }
        .footer-aurora {
          background: radial-gradient(circle at 50% 50%,
            rgba(201,119,78,0.20) 0%, rgba(201,119,78,0.07) 42%, transparent 70%);
          animation: footer-breathe 8s ease-in-out infinite alternate;
        }
        .footer-bg-grid {
          background-size: 60px 60px;
          background-image:
            linear-gradient(to right,  rgba(246,243,237,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(246,243,237,0.04) 1px, transparent 1px);
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 26%, #000 74%, transparent);
                  mask-image: linear-gradient(to bottom, transparent, #000 26%, #000 74%, transparent);
        }
        /* Giant background wordmark — stroke + gradient-clip */
        .footer-giant {
          font-family: var(--font-serif), Georgia, serif;
          font-weight: 400; line-height: 0.82; letter-spacing: -0.05em;
          font-size: clamp(90px, 24vw, 400px);
          color: transparent;
          -webkit-text-stroke: 1px rgba(246,243,237,0.07);
          background: linear-gradient(180deg, rgba(246,243,237,0.11) 0%, transparent 62%);
          -webkit-background-clip: text; background-clip: text;
        }
        /* Metallic glow heading */
        .footer-glow {
          background: linear-gradient(180deg, var(--g-room-ink) 0%, rgba(246,243,237,0.42) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 0 22px rgba(246,243,237,0.13));
        }
        .footer-primary-links { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(20px,4vw,48px); }
        .footer-sitemap { display: flex; flex-wrap: wrap; justify-content: center; gap: 22px; margin-top: 26px; }
        .footer-bottom { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        @media (max-width: 640px) { .footer-bottom { justify-content: center; text-align: center; } }
        .footer-backtop {
          width: 46px; height: 46px; border-radius: 50%; cursor: none;
          border: 1px solid rgba(246,243,237,0.18); background: rgba(246,243,237,0.03);
          display: grid; place-content: center; color: rgba(246,243,237,0.6);
          transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .footer-backtop:hover { color: var(--g-accent-warm); border-color: rgba(201,119,78,0.5); background: rgba(201,119,78,0.08); }
        .footer-backtop svg { transition: transform 0.3s ease; }
        .footer-backtop:hover svg { transform: translateY(-3px); }
      `}</style>

      {/* ── Curtain-reveal wrapper: clip-path clips the viewport-fixed footer to this box,
            so the footer sits still while the page scrolls over it ── */}
      <div
        ref={wrapperRef}
        style={{ position: 'relative', height: '100vh', width: '100%', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <footer id="site-footer"
          style={{
            position: 'fixed', bottom: 0, left: 0, width: '100%', height: '100vh',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            overflow: 'hidden', background: 'var(--g-room)', color: 'var(--g-room-ink)',
            borderTop: '1px solid var(--g-room-line)',
          }}
        >
          {/* Ambient background */}
          <div className="footer-aurora" style={{ position: 'absolute', left: '50%', top: '50%', width: '80vw', height: '60vh', transform: 'translate(-50%,-50%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
          <div className="footer-bg-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

          {/* Giant background wordmark */}
          <div
            ref={giantTextRef}
            className="footer-giant"
            aria-hidden="true"
            style={{ position: 'absolute', bottom: '-4vh', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', zIndex: 0, pointerEvents: 'none', userSelect: 'none' }}
          >
            PRUSOTAM
          </div>

          {/* ── Top: parabolic marquee ── */}
          <div aria-hidden="true" style={{ position: 'relative', zIndex: 10, overflow: 'hidden', paddingTop: 'clamp(84px,10vh,130px)' }}>
            <svg viewBox="0 0 1440 200" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
              <defs><path id="footer-curve" d="M 0,168 Q 720,58 1440,168" fill="none" /></defs>
              <text style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', fontSize: '30px', fontWeight: 500, letterSpacing: '4px' }}>
                <textPath ref={curveTextRef} href="#footer-curve" startOffset={0}>
                  {MARQUEE_SEQ.map((item, i) => (
                    <tspan key={i}>
                      <tspan fill="#C9774E" style={{ fontSize: '0.62em' }}>{'  ✦  '}</tspan>
                      <tspan fill="rgba(246,243,237,0.5)">{item.toUpperCase()}</tspan>
                    </tspan>
                  ))}
                </textPath>
              </text>
            </svg>
          </div>

          {/* ── Center: heading + links ── */}
          <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 var(--gutter)', width: '100%', maxWidth: 1100, margin: '0 auto' }}>
            <p className="t-label" style={{ color: 'var(--g-accent-warm)', marginBottom: 22 }}>[ LET&apos;S CONNECT ]</p>

            <h2
              ref={headingRef}
              className="footer-glow"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 400,
                fontSize: 'clamp(40px,7vw,104px)', lineHeight: 1.0, letterSpacing: '-0.03em',
                textAlign: 'center', margin: '0 0 14px',
              }}
            >
              Let&apos;s build<br />something great.
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(32px,5vh,56px)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--g-accent-warm)', display: 'inline-block', flexShrink: 0, animation: 'footer-pulse 2.4s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', fontSize: 12, letterSpacing: '0.04em', color: MUTED }}>
                Available for work — {person.location}
              </span>
            </div>

            <div ref={linksRef} style={{ width: '100%' }}>
              {/* Primary links */}
              <div className="footer-primary-links">
                <a href={`mailto:${person.email}`} data-cursor="highlight" data-cursor-color="#F8F5F0" className="underline-sweep"
                   style={{ ...linkBase, fontSize: 17 }} onMouseEnter={onEnter} onMouseLeave={onLeave}>Email ↗</a>
                <a href={person.githubUrl} target="_blank" rel="noopener noreferrer" data-cursor="highlight" data-cursor-color="#F8F5F0" className="underline-sweep"
                   style={{ ...linkBase, fontSize: 17 }} onMouseEnter={onEnter} onMouseLeave={onLeave}>GitHub ↗</a>
                <a href="/resume.pdf" download="Prusotam_Kumar_Yadav_Resume.pdf" data-cursor="highlight" data-cursor-color="#F8F5F0" className="underline-sweep"
                   style={{ ...linkBase, fontSize: 17 }} onMouseEnter={onEnter} onMouseLeave={onLeave}>Resume ↓</a>
              </div>

              {/* Sitemap */}
              <div className="footer-sitemap">
                {SITEMAP.map(({ label, href }) => (
                  <a key={href} href={href} onClick={e => { e.preventDefault(); scrollTo(href) }}
                     data-cursor="highlight" data-cursor-color="#F8F5F0" className="underline-sweep"
                     style={{ ...META, color: 'rgba(246,243,237,0.4)', cursor: 'none', textDecoration: 'none' }}
                     onMouseEnter={e => (e.currentTarget.style.color = 'var(--g-room-ink)')}
                     onMouseLeave={e => (e.currentTarget.style.color = 'rgba(246,243,237,0.4)')}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="footer-bottom" style={{ position: 'relative', zIndex: 20, padding: 'clamp(20px,3vh,32px) var(--gutter)' }}>
            <span style={META}>© 2026 Prusotam Kumar Yadav</span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={META}>Crafted with</span>
              <span style={{ color: 'var(--g-accent-warm)', fontSize: 13, display: 'inline-block', animation: 'footer-heartbeat 2s cubic-bezier(0.25,1,0.5,1) infinite' }}>❤</span>
              <span style={META}>by Prusotam</span>
            </span>

            <button onClick={() => scrollTo('#top')} className="footer-backtop" aria-label="Back to top">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </>
  )
}
