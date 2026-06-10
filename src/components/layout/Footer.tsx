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

const MUTED = 'rgba(248,245,240,0.5)'

const META: React.CSSProperties = {
  fontFamily: 'var(--font-mono),"JetBrains Mono",monospace',
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(248,245,240,0.3)',
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-row', {
        opacity: 0, y: 24, duration: 0.7, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: 'footer', start: 'top 85%', end: 'center bottom', scrub: 1 },
      })
      gsap.fromTo('.footer-word',
        { yPercent: 35, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: 'expo.out',
          scrollTrigger: { trigger: 'footer', start: 'top 65%', end: 'bottom bottom', scrub: 1 } }
      )
    }, footerRef)
    return () => ctx.revert()
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
    display: 'inline-block', width: 'fit-content',
    fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif',
    fontSize: 15, color: MUTED, textDecoration: 'none',
    transition: 'color 0.25s ease', cursor: 'none',
  }
  const onLinkEnter = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-inverse)' }
  const onLinkLeave = (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = MUTED }

  return (
    <footer
      ref={footerRef}
      style={{ background: 'var(--black)', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--line-dark)' }}
    >
      <style>{`
        @keyframes footer-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .footer-grid  { display: grid; grid-template-columns: 1.25fr 1fr; gap: 64px; align-items: start; }
        .footer-links { display: flex; gap: 72px; }
        @media (max-width: 820px) {
          .footer-grid  { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 480px) {
          .footer-links { gap: 44px; }
        }
        .footer-meta-bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .footer-backtop { background: none; border: none; padding: 0; cursor: none; transition: color 0.25s ease; }
        .footer-backtop:hover { color: rgba(248,245,240,0.8) !important; }
      `}</style>

      <div
        className="container"
        style={{ paddingTop: 'clamp(72px,9vw,120px)', paddingBottom: 'clamp(28px,3vw,40px)', position: 'relative', zIndex: 1 }}
      >
        <div className="footer-grid">
          {/* ── Left — CTA + status ── */}
          <div className="footer-row">
            <p className="t-label" style={{ color: 'var(--accent)', marginBottom: 28 }}>[ LET&apos;S CONNECT ]</p>
            <a
              href={`mailto:${person.email}`}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-display),Syne,sans-serif',
                fontWeight: 700, fontSize: 'clamp(34px,5vw,72px)', lineHeight: 1.02,
                letterSpacing: '-0.03em', color: 'var(--text-inverse)', textDecoration: 'none',
                cursor: 'none', transition: 'color 0.3s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-inverse)')}
            >
              Let&apos;s build<br />something great.
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'clamp(28px,3vw,40px)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0, animation: 'footer-pulse 2.4s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', fontSize: 12, letterSpacing: '0.04em', color: MUTED }}>
                Available for work — {person.location}
              </span>
            </div>
          </div>

          {/* ── Right — link columns ── */}
          <div className="footer-row footer-links">
            <div>
              <p className="t-label" style={{ color: 'rgba(248,245,240,0.35)', marginBottom: 20 }}>[ SITEMAP ]</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {SITEMAP.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    data-cursor="highlight" data-cursor-color="#F8F5F0"
                    className="underline-sweep"
                    onClick={e => { e.preventDefault(); scrollTo(href) }}
                    style={linkBase}
                    onMouseEnter={onLinkEnter}
                    onMouseLeave={onLinkLeave}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="t-label" style={{ color: 'rgba(248,245,240,0.35)', marginBottom: 20 }}>[ ELSEWHERE ]</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a
                  href={person.githubUrl} target="_blank" rel="noopener noreferrer"
                  data-cursor="highlight" data-cursor-color="#F8F5F0"
                  className="underline-sweep" style={linkBase}
                  onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}
                >
                  GitHub ↗
                </a>
                <a
                  href={`mailto:${person.email}`}
                  data-cursor="highlight" data-cursor-color="#F8F5F0"
                  className="underline-sweep" style={linkBase}
                  onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}
                >
                  Email ↗
                </a>
                <a
                  href="/resume.pdf" download="Prusotam_Kumar_Yadav_Resume.pdf"
                  data-cursor="highlight" data-cursor-color="#F8F5F0"
                  className="underline-sweep" style={linkBase}
                  onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}
                >
                  Resume ↓
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="footer-row" style={{ height: 1, background: 'var(--line-dark)', margin: 'clamp(48px,6vw,80px) 0 28px' }} />

        {/* ── Meta bar ── */}
        <div className="footer-row footer-meta-bar">
          <span style={META}>© 2026 Prusotam Kumar Yadav</span>
          <span style={META}>Built with Next.js · GSAP · WebGL</span>
          <button onClick={() => scrollTo('#top')} className="footer-backtop" style={META}>↑ Back to top</button>
        </div>
      </div>

      {/* ── Oversized wordmark — bleeds off the bottom edge ── */}
      <div style={{ overflow: 'hidden', lineHeight: 0.72, paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>
        <p
          className="footer-word"
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-display),Syne,sans-serif', fontWeight: 800,
            fontSize: 'clamp(44px,16vw,230px)', letterSpacing: '-0.04em',
            color: 'rgba(248,245,240,0.06)', margin: 0, whiteSpace: 'nowrap',
            textAlign: 'center', userSelect: 'none',
          }}
        >
          PRUSOTAM
        </p>
      </div>
    </footer>
  )
}
