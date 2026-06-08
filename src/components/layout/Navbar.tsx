'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { person } from '@/lib/data'

/* ─── Nav link data ───────────────────────────────────────────── */
const NAV_LINKS = [
  { index: '01', label: 'Work',     href: '#work'     },
  { index: '02', label: 'About',    href: '#about'    },
  { index: '03', label: 'Services', href: '#services' },
  { index: '04', label: 'Contact',  href: '#contact'  },
]

type Theme = 'light' | 'dark'

export default function Navbar() {
  /* ── DOM refs ── */
  const navRef          = useRef<HTMLElement>(null)
  const hamburgerRef    = useRef<HTMLDivElement>(null)
  const overlayRef      = useRef<HTMLDivElement>(null)
  const line1Ref        = useRef<HTMLSpanElement>(null)
  const line2Ref        = useRef<HTMLSpanElement>(null)
  const closeLblRef     = useRef<HTMLSpanElement>(null)
  const closeLblWrapRef = useRef<HTMLSpanElement>(null)
  const sidebarRef      = useRef<HTMLDivElement>(null)
  const linkInnerRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const linkIdxRefs   = useRef<(HTMLSpanElement | null)[]>([])
  const waveRefs      = useRef<(SVGSVGElement | null)[]>([])

  /* ── Mutable flags (avoid stale closures) ── */
  const isOpenRef = useRef(false)
  const isAnimRef = useRef(false)

  /* ── React state (render-layer only) ── */
  const [isOpen,         setIsOpen]         = useState(false)
  const [theme,          setTheme]          = useState<Theme>('dark')
  const [hoveredIdx,     setHoveredIdx]     = useState<number | null>(null)
  const [activeSection,  setActiveSection]  = useState<string>('')

  /* ── Entry slide-down ── */
  useEffect(() => {
    if (!navRef.current) return
    gsap.fromTo([navRef.current, hamburgerRef.current],
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 1.1 }
    )
  }, [])

  /* ── Active section tracking ── */
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  /* ── Dark-section theme detection ── */
  useEffect(() => {
    const onScroll = () => {
      const y       = window.scrollY
      const hero    = document.getElementById('hero')
      const process = document.getElementById('process')
      const proof   = document.getElementById('proof')
      const contact = document.getElementById('contact')
      const inHero    = hero    ? y < hero.offsetHeight - 64 : false
      const inProcess = process ? y + 64 >= process.offsetTop && y + 64 < process.offsetTop + process.offsetHeight : false
      const inProof   = proof   ? y + 64 >= proof.offsetTop   && y + 64 < proof.offsetTop   + proof.offsetHeight   : false
      const inContact = contact ? y + 64 >= contact.offsetTop : false
      setTheme(inHero || inProcess || inProof || inContact ? 'dark' : 'light')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Menu helpers ── */
  const closeMenu = useCallback(() => {
    if (isAnimRef.current || !isOpenRef.current) return
    isAnimRef.current = true
    isOpenRef.current = false

    const overlay = overlayRef.current
    if (!overlay) { isAnimRef.current = false; return }

    gsap.timeline({
      onComplete() {
        isAnimRef.current = false
        setIsOpen(false)
        setHoveredIdx(null)
        overlay.style.pointerEvents = 'none'
        document.body.style.overflow = ''
        ;(window as any).lenis?.start()
      },
    })
      .to(overlay,
        { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)', duration: 0.6, ease: 'expo.inOut' },
        0
      )
      .to(line1Ref.current, { rotation: 0, y: 0, duration: 0.4, ease: 'expo.inOut' }, 0)
      .to(line2Ref.current, { rotation: 0, y: 0, duration: 0.4, ease: 'expo.inOut' }, 0)
      .to(closeLblWrapRef.current, { maxWidth: 0, duration: 0.25, ease: 'power2.in' }, 0)
  }, [])

  const openMenu = useCallback(() => {
    if (isAnimRef.current || isOpenRef.current) return
    isAnimRef.current = true
    isOpenRef.current = true
    setIsOpen(true)
    setHoveredIdx(null)

    const overlay = overlayRef.current
    if (!overlay) { isAnimRef.current = false; return }

    overlay.style.pointerEvents = 'auto'
    document.body.style.overflow = 'hidden'
    ;(window as any).lenis?.stop()

    /* Reset link elements before animating in */
    gsap.set(linkInnerRefs.current.filter(Boolean), { y: '110%', rotation: 3 })
    gsap.set(linkIdxRefs.current.filter(Boolean),   { opacity: 0, x: -10 })
    gsap.set(waveRefs.current.filter(Boolean),       { opacity: 0 })
    if (sidebarRef.current) gsap.set(sidebarRef.current, { opacity: 0, y: 20 })

    gsap.timeline({
      onComplete() { isAnimRef.current = false },
    })
      /* overlay wipes in from right edge */
      .fromTo(overlay,
        { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' },
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.7, ease: 'expo.inOut' },
        0
      )
      /* two lines rotate into X */
      .to(line1Ref.current, { rotation: 45,  y:  4.25, duration: 0.4, ease: 'expo.inOut' }, 0)
      .to(line2Ref.current, { rotation: -45, y: -4.25, duration: 0.4, ease: 'expo.inOut' }, 0)
      /* CLOSE label slides in via maxWidth */
      .to(closeLblWrapRef.current, { maxWidth: 80, duration: 0.35, ease: 'power2.out' }, 0.3)
      /* link text slides up from clip */
      .to(
        linkInnerRefs.current.filter(Boolean),
        { y: '0%', rotation: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 },
        0.4
      )
      /* index numbers fade in from left */
      .to(
        linkIdxRefs.current.filter(Boolean),
        { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out', stagger: 0.08 },
        0.55
      )
      /* sidebar fades up */
      .to(sidebarRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.7)
      /* wave lines fade in after text lands */
      .to(waveRefs.current.filter(Boolean), { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.07 }, 0.85)
  }, [])

  const toggleMenu = useCallback(() => {
    if (isOpenRef.current) closeMenu(); else openMenu()
  }, [openMenu, closeMenu])

  const handleLinkClick = useCallback((href: string) => {
    if (!isOpenRef.current) return
    isAnimRef.current = true
    isOpenRef.current = false

    const overlay = overlayRef.current
    if (!overlay) return

    gsap.timeline({
      onComplete() {
        isAnimRef.current = false
        setIsOpen(false)
        setHoveredIdx(null)
        overlay.style.pointerEvents = 'none'
        document.body.style.overflow = ''
        const lenis = (window as any).lenis
        lenis?.start()
        /* Small delay so Lenis fully restarts before scrolling */
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(href, { duration: 1.4 })
          } else {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
          }
        }, 60)
      },
    })
      .to(overlay,
        { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)', duration: 0.5, ease: 'expo.inOut' },
        0
      )
      .to(line1Ref.current, { rotation: 0, y: 0, duration: 0.35, ease: 'expo.inOut' }, 0)
      .to(line2Ref.current, { rotation: 0, y: 0, duration: 0.35, ease: 'expo.inOut' }, 0)
      .to(closeLblRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0)
  }, [])

  /* ── Escape key ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenRef.current) closeMenu()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeMenu])

  /* Navbar bar matches hero dark background → text always light */
  const textColor = 'var(--text-inverse)'

  return (
    <>
      {/* ── Styles ── */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .availability-pulse {
          display: inline-block;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .overlay-sidebar  { display: none !important; }
          .overlay-left     { width: 100% !important; padding-left: 32px !important; padding-right: 32px !important; }
          .overlay-link-txt { font-size: clamp(44px, 12vw, 80px) !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════════
          Persistent nav bar — 64px fixed, z-100
      ════════════════════════════════════════════ */}
      <nav
        ref={navRef}
        id="top-nav"
        className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-[var(--gutter)]"
        style={{
          opacity: 0,
          background: 'rgba(17, 17, 17, 0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); !isOpenRef.current && window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          data-cursor="highlight"
          data-cursor-color="white"
          style={{
            fontFamily: 'var(--font-clash), Syne, sans-serif',
            fontWeight: 700,
            fontSize: 17,
            color: textColor,
            textDecoration: 'none',
            transition: 'color 0.3s',
          }}
        >
          {person.monogram}
        </a>

      </nav>

      {/* ════════════════════════════════════════════
          Hamburger / close — z-102, always above overlay
      ════════════════════════════════════════════ */}
      <div
        ref={hamburgerRef}
        id="hamburger-btn"
        style={{
          position: 'fixed',
          top: 0,
          right: 'var(--gutter)',
          height: 64,
          zIndex: 102,
          display: 'flex',
          alignItems: 'center',
          opacity: 0,
        }}
      >
        <div data-cursor="highlight" data-cursor-color="white" onClick={toggleMenu} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 8px', cursor: 'none' }}>

          {/* "CLOSE" — clipped to maxWidth:0 when closed, slides open on menu open */}
          <span
            ref={closeLblWrapRef}
            style={{ display: 'inline-block', overflow: 'hidden', maxWidth: 0, whiteSpace: 'nowrap' }}
          >
            <span
              ref={closeLblRef}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: '0.12em',
                color: 'var(--text-inverse)',
                userSelect: 'none',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              CLOSE
            </span>
          </span>

          {/* Hamburger button — 2 lines → X */}
          <button
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 0 8px 4px',
              cursor: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 7,
            }}
          >
            <span
              ref={line1Ref}
              style={{
                display: 'block',
                width: 28,
                height: 1.5,
                background: 'var(--text-inverse)',
                borderRadius: 1,
                transformOrigin: 'center center',
              }}
            />
            <span
              ref={line2Ref}
              style={{
                display: 'block',
                width: 28,
                height: 1.5,
                background: 'var(--text-inverse)',
                borderRadius: 1,
                transformOrigin: 'center center',
              }}
            />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          Fullscreen overlay — z-101 (covers full screen)
      ════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        id="nav-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 101,
          background: '#18120E',
          clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
        }}
      >
        {/* ── Left: navigation links ────────────────────── */}
        <div
          className="overlay-left"
          style={{
            width: '60%',
            paddingLeft: 120,
            paddingRight: 48,
            paddingTop: 140,
            paddingBottom: 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Section label */}
          <p style={{
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            margin: '0 0 44px 0',
          }}>
            [ NAVIGATION ]
          </p>

          {/* Links */}
          <div onMouseLeave={() => setHoveredIdx(null)}>
            {NAV_LINKS.map(({ index, label, href }, i) => (
              <div
                key={label}
                style={{ position: 'relative', paddingTop: 6, marginBottom: 0, cursor: 'none' }}
                onMouseEnter={() => setHoveredIdx(i)}
              >
                {/* Index number — floats top-left */}
                <span
                  ref={el => { linkIdxRefs.current[i] = el }}
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: 0,
                    fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
                    fontSize: 13,
                    letterSpacing: '0.04em',
                    color: 'var(--accent)',
                  }}
                >
                  {index}
                </span>

                {/*
                  Clip container: inline-block so it shrinks to the exact word width,
                  marginLeft replaces paddingLeft so the wave SVG inside also gets that width.
                */}
                <div style={{
                  overflow: 'visible',
                  display: 'inline-block',
                  marginLeft: 52,
                  position: 'relative',
                  verticalAlign: 'top',
                }}>

                  {/* Snake wave — spans 150% of the word width */}
                  <svg
                    ref={el => { waveRefs.current[i] = el }}
                    aria-hidden="true"
                    viewBox="0 0 1000 60"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      width: '125%',
                      height: 44,
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <path
                      d="M0,30 Q83,0 167,30 Q250,60 333,30 Q417,0 500,30 Q583,60 667,30 Q750,0 833,30 Q917,60 1000,30"
                      fill="none"
                      stroke="#C8EF4A"
                      strokeWidth={22}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 2200,
                        strokeDashoffset: (activeSection === href.slice(1) || hoveredIdx === i) ? 0 : 2200,
                        opacity: (activeSection === href.slice(1) || hoveredIdx === i) ? 0.88 : 0,
                        transition: 'stroke-dashoffset 1.3s cubic-bezier(0.45, 0, 0.1, 1), opacity 0.35s ease',
                      }}
                    />
                  </svg>

                  {/* Link text — sits above wave (DOM order + position:relative) */}
                  <a
                    ref={el => { linkInnerRefs.current[i] = el }}
                    href={href}
                    onClick={(e) => { e.preventDefault(); handleLinkClick(href) }}
                    className="overlay-link-txt"
                    style={{
                      display: 'block',
                      position: 'relative',
                      fontFamily: 'var(--font-clash), Syne, sans-serif',
                      fontWeight: 800,
                      fontSize: 'clamp(60px, 9vw, 120px)',
                      lineHeight: 0.9,
                      letterSpacing: '-0.04em',
                      /* Active = accent always; hovered = accent; others dim on hover */
                      color: (activeSection === href.slice(1) || hoveredIdx === i)
                        ? 'var(--accent)'
                        : 'var(--text-inverse)',
                      opacity: hoveredIdx !== null && hoveredIdx !== i && activeSection !== href.slice(1)
                        ? 0.25
                        : 1,
                      transition: 'color 0.2s ease, opacity 0.2s ease',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </a>
                </div>

                {/* Underline sweep */}
                <div style={{
                  height: 1,
                  background: 'var(--accent)',
                  transform: hoveredIdx === i ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left center',
                  transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  marginTop: 6,
                  marginLeft: 52,
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: sidebar — desktop only ─────────────── */}
        <div
          ref={sidebarRef}
          className="overlay-sidebar"
          style={{
            width: '40%',
            padding: '140px 80px 80px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            gap: 28,
          }}
        >
          {/* Email */}
          <a
            href={`mailto:${person.email}`}
            data-cursor="highlight"
            style={{
              fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
              fontSize: 15,
              color: 'rgba(248,245,240,0.5)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-inverse)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.5)')}
          >
            {person.email}
          </a>

          {/* GitHub */}
          <a
            href={person.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="highlight"
            style={{
              fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
              fontSize: 15,
              color: 'rgba(248,245,240,0.5)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-inverse)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.5)')}
          >
            {person.github}
          </a>

          {/* Download CV */}
          <a
            href="/resume.pdf"
            download="Prusotam_Kumar_Yadav_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="highlight"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: 'rgba(248,245,240,0.7)',
              textDecoration: 'none',
              border: '1px solid rgba(248,245,240,0.2)',
              padding: '10px 20px',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--accent)'
              e.currentTarget.style.borderColor = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(248,245,240,0.7)'
              e.currentTarget.style.borderColor = 'rgba(248,245,240,0.2)'
            }}
          >
            [ Download CV ]
          </a>

          {/* Availability */}
          <p style={{
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: '0.04em',
            color: 'var(--accent)',
            margin: 0,
          }}>
            <span className="availability-pulse">●</span>
            {' '}Available for work
          </p>
        </div>
      </div>
    </>
  )
}
