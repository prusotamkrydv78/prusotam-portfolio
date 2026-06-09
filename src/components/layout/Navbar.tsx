'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { person } from '@/lib/data'

const NAV_LINKS = [
  { index: '01', label: 'Work',     href: '#work'     },
  { index: '02', label: 'About',    href: '#about'    },
  { index: '03', label: 'Services', href: '#services' },
  { index: '04', label: 'Contact',  href: '#contact'  },
]

type Theme = 'light' | 'dark'

/* Concrete colour values so GSAP can tween them (no CSS-var limits) */
const CLR_LIGHT = '#F5F0EA'  /* --white / cream  */
const CLR_DARK  = '#111111'  /* --black           */

export default function Navbar() {
  /* ── refs ── */
  const navRef          = useRef<HTMLElement>(null)
  const hamburgerRef    = useRef<HTMLDivElement>(null)
  const overlayRef      = useRef<HTMLDivElement>(null)
  const navContentRef   = useRef<HTMLDivElement>(null)
  const logoRef         = useRef<HTMLAnchorElement>(null)
  const logoLetterRefs  = useRef<(HTMLSpanElement | null)[]>([])
  const line1Ref        = useRef<HTMLSpanElement>(null)
  const line2Ref        = useRef<HTMLSpanElement>(null)
  const closeLblRef     = useRef<HTMLSpanElement>(null)
  const closeLblWrapRef = useRef<HTMLSpanElement>(null)
  const stripsRef       = useRef<HTMLDivElement[]>([])
  const linkInnerRefs   = useRef<(HTMLAnchorElement | null)[]>([])
  const linkIdxRefs     = useRef<(HTMLSpanElement | null)[]>([])
  const waveRefs        = useRef<(SVGSVGElement | null)[]>([])

  const isOpenRef = useRef(false)
  const isAnimRef = useRef(false)

  const [isOpen,        setIsOpen]        = useState(false)
  const [theme,         setTheme]         = useState<Theme>('dark')
  const [hoveredIdx,    setHoveredIdx]    = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<string>('')
  const [currentTime,   setCurrentTime]   = useState('')

  /* ── entry slide-down ── */
  useEffect(() => {
    if (!navRef.current) return
    gsap.fromTo(
      [navRef.current, hamburgerRef.current],
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 1.1 }
    )
  }, [])

  /* ── hamburger hover — lines shift when menu is closed ── */
  const handleHamburgerEnter = useCallback(() => {
    if (isOpenRef.current) return
    gsap.to(line1Ref.current, { x:  4, duration: 0.3, ease: 'expo.out' })
    gsap.to(line2Ref.current, { x: -4, duration: 0.3, ease: 'expo.out', delay: 0.05 })
  }, [])

  const handleHamburgerLeave = useCallback(() => {
    if (isOpenRef.current) return
    gsap.to([line1Ref.current, line2Ref.current], { x: 0, duration: 0.25, ease: 'expo.out' })
  }, [])

  /* ── live clock ── */
  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  /* ── active section ── */
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1))
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  /* ── dark/light section theme ── */
  useEffect(() => {
    const check = () => {
      const y = window.scrollY
      const hero    = document.getElementById('hero')
      const process = document.getElementById('process')
      const proof   = document.getElementById('proof')
      const contact = document.getElementById('contact')
      const inHero    = hero    ? y < hero.offsetHeight - 64 : false
      const inProcess = process ? y+64 >= process.offsetTop && y+64 < process.offsetTop+process.offsetHeight : false
      const inProof   = proof   ? y+64 >= proof.offsetTop   && y+64 < proof.offsetTop+proof.offsetHeight     : false
      const inContact = contact ? y+64 >= contact.offsetTop : false
      setTheme(inHero || inProcess || inProof || inContact ? 'dark' : 'light')
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])

  /* ────────────────────────────────────────────────────────
     Shared helper: revert nav-bar + hamburger colours to
     their "closed" state (dark background, light elements)
  ──────────────────────────────────────────────────────── */
  const revertNavColors = (tl: gsap.core.Timeline, at: number | string) => {
    if (navRef.current)    tl.to(navRef.current,    { backgroundColor: 'rgba(17,17,17,0.97)', duration: 0.3, ease: 'none' }, at)
    if (logoRef.current)   tl.to(logoRef.current,   { color: CLR_LIGHT,                       duration: 0.25, ease: 'none' }, at)
    if (line1Ref.current)  tl.to(line1Ref.current,  { backgroundColor: CLR_LIGHT,             duration: 0.25, ease: 'none' }, at)
    if (line2Ref.current)  tl.to(line2Ref.current,  { backgroundColor: CLR_LIGHT,             duration: 0.25, ease: 'none' }, at)
    if (closeLblRef.current) tl.to(closeLblRef.current, { color: CLR_LIGHT,                   duration: 0.25, ease: 'none' }, at)
  }

  /* ── close ── */
  const closeMenu = useCallback(() => {
    if (isAnimRef.current || !isOpenRef.current) return
    isAnimRef.current = true
    isOpenRef.current = false

    const overlay = overlayRef.current
    if (!overlay) { isAnimRef.current = false; return }

    const tl = gsap.timeline({
      onComplete() {
        isAnimRef.current = false
        setIsOpen(false)
        setHoveredIdx(null)
        overlay.style.visibility = 'hidden'
        overlay.style.pointerEvents = 'none'
        document.body.style.overflow = ''
        ;(window as any).lenis?.start()
      },
    })

    tl.to(navContentRef.current, { opacity: 0, y: -20, duration: 0.3, ease: 'expo.in' }, 0)
    revertNavColors(tl, 0)
    tl.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.4, ease: 'expo.inOut' }, 0)
    tl.to(line2Ref.current, { rotation: 0, y: 0, duration: 0.4, ease: 'expo.inOut' }, 0)
    tl.to(closeLblWrapRef.current, { maxWidth: 0, duration: 0.25, ease: 'power2.in' }, 0)
    tl.to(stripsRef.current, {
      x: '100vw', duration: 0.45, ease: 'expo.inOut',
      stagger: { each: 0.05, from: 'start' },
    }, '-=0.1')
  }, [])

  /* ── open ── */
  const openMenu = useCallback(() => {
    if (isAnimRef.current || isOpenRef.current) return
    isAnimRef.current = true
    isOpenRef.current = true
    setIsOpen(true)
    setHoveredIdx(null)

    const overlay = overlayRef.current
    if (!overlay) { isAnimRef.current = false; return }

    overlay.style.visibility = 'visible'
    overlay.style.pointerEvents = 'auto'
    document.body.style.overflow = 'hidden'
    ;(window as any).lenis?.stop()

    gsap.set(stripsRef.current,                       { x: '100vw' })
    gsap.set(navContentRef.current,                   { opacity: 0, y: 30 })
    gsap.set(linkInnerRefs.current.filter(Boolean),   { y: '110%', rotation: 3 })
    gsap.set(linkIdxRefs.current.filter(Boolean),     { opacity: 0, x: -10 })
    gsap.set(closeLblWrapRef.current,                 { maxWidth: 0 })

    const tl = gsap.timeline({ onComplete() { isAnimRef.current = false } })

    /* nav bar → cream; logo + lines + CLOSE label → dark */
    if (navRef.current)      tl.to(navRef.current,      { backgroundColor: 'rgba(245,240,234,0.97)', duration: 0.3, ease: 'none' }, 0)
    if (logoRef.current)     tl.to(logoRef.current,     { color: CLR_DARK,            duration: 0.25, ease: 'none' }, 0)
    if (line1Ref.current)    tl.to(line1Ref.current,    { backgroundColor: CLR_DARK,  duration: 0.25, ease: 'none' }, 0)
    if (line2Ref.current)    tl.to(line2Ref.current,    { backgroundColor: CLR_DARK,  duration: 0.25, ease: 'none' }, 0)
    if (closeLblRef.current) tl.to(closeLblRef.current, { color: CLR_DARK,            duration: 0.25, ease: 'none' }, 0)

    /* hamburger → X */
    tl.to(line1Ref.current, { rotation:  45, y:  4.25, duration: 0.4, ease: 'expo.inOut' }, 0)
    tl.to(line2Ref.current, { rotation: -45, y: -4.25, duration: 0.4, ease: 'expo.inOut' }, 0)
    tl.to(closeLblWrapRef.current, { maxWidth: 80, duration: 0.35, ease: 'power2.out' }, 0.3)

    /* 8 bands slide in top-to-bottom */
    tl.to(stripsRef.current, {
      x: 0, duration: 0.55, ease: 'expo.inOut',
      stagger: { each: 0.06, from: 'start' },
    }, 0)

    /* content fades in after last band lands */
    tl.to(navContentRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, '+=0.05')

    /* link clip-reveal */
    tl.to(linkInnerRefs.current.filter(Boolean), {
      y: '0%', rotation: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07,
    }, '-=0.4')

    /* index numbers */
    tl.to(linkIdxRefs.current.filter(Boolean), {
      opacity: 1, x: 0, duration: 0.5, ease: 'expo.out', stagger: 0.07,
    }, '-=0.6')
  }, [])

  const toggleMenu = useCallback(() => {
    if (isOpenRef.current) closeMenu(); else openMenu()
  }, [openMenu, closeMenu])

  const handleLinkClick = useCallback((href: string) => {
    if (!isOpenRef.current) return
    isAnimRef.current = true
    isOpenRef.current = false

    const overlay = overlayRef.current
    if (!overlay) { isAnimRef.current = false; return }

    const tl = gsap.timeline({
      onComplete() {
        isAnimRef.current = false
        setIsOpen(false)
        setHoveredIdx(null)
        overlay.style.visibility = 'hidden'
        overlay.style.pointerEvents = 'none'
        document.body.style.overflow = ''
        const lenis = (window as any).lenis
        lenis?.start()
        setTimeout(() => {
          if (lenis) lenis.scrollTo(href, { duration: 1.4 })
          else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
        }, 60)
      },
    })

    tl.to(navContentRef.current, { opacity: 0, y: -20, duration: 0.3, ease: 'expo.in' }, 0)
    revertNavColors(tl, 0)
    tl.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.35, ease: 'expo.inOut' }, 0)
    tl.to(line2Ref.current, { rotation: 0, y: 0, duration: 0.35, ease: 'expo.inOut' }, 0)
    tl.to(closeLblWrapRef.current, { maxWidth: 0, duration: 0.25, ease: 'power2.in' }, 0)
    tl.to(stripsRef.current, {
      x: '100vw', duration: 0.45, ease: 'expo.inOut',
      stagger: { each: 0.05, from: 'start' },
    }, '-=0.1')
  }, [])

  /* ── Escape key ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpenRef.current) closeMenu() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeMenu])

  return (
    <>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .availability-pulse { display:inline-block; animation:pulse-dot 2s ease-in-out infinite; }
        @media (max-width: 768px) {
          .overlay-sidebar    { display: none !important; }
          .overlay-left       { width: 100% !important; padding-left: 32px !important; padding-right: 32px !important; }
          .overlay-link-txt   { font-size: clamp(44px,12vw,80px) !important; }
          .overlay-bottom-bar { padding: 20px 32px !important; }
        }
      `}</style>

      {/* ── Persistent nav bar ── */}
      <nav
        ref={navRef}
        id="top-nav"
        className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-[var(--gutter)]"
        style={{ opacity: 0, backgroundColor: 'rgba(17,17,17,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <a
          ref={logoRef}
          href="#"
          onClick={e => { e.preventDefault(); !isOpenRef.current && window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          data-cursor="highlight" data-cursor-color="#111111"
          style={{ fontFamily: 'var(--font-clash),Syne,sans-serif', fontWeight: 700, fontSize: 17, color: CLR_LIGHT, textDecoration: 'none', display: 'inline-flex' }}
          onMouseEnter={() => {
            const els = logoLetterRefs.current.filter(Boolean)
            gsap.to(els, { y: -3, duration: 0.2, stagger: 0.03, ease: 'power2.out', yoyo: true, repeat: 1 })
          }}
        >
          {person.monogram.split('').map((ch, i) => (
            <span
              key={i}
              ref={el => { logoLetterRefs.current[i] = el }}
              style={{ display: 'inline-block', color: ch === '.' ? 'var(--accent)' : 'inherit' }}
            >
              {ch}
            </span>
          ))}
        </a>
      </nav>

      {/* ── Hamburger ── */}
      <div
        ref={hamburgerRef}
        id="hamburger-btn"
        style={{ position: 'fixed', top: 0, right: 'var(--gutter)', height: 64, zIndex: 102, display: 'flex', alignItems: 'center', opacity: 0 }}
      >
        <div
          data-cursor="highlight" data-cursor-color="#111111"
          onClick={toggleMenu}
          onMouseEnter={handleHamburgerEnter}
          onMouseLeave={handleHamburgerLeave}
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 8px', cursor: 'none' }}
        >
          <span ref={closeLblWrapRef} style={{ display: 'inline-block', overflow: 'hidden', maxWidth: 0, whiteSpace: 'nowrap' }}>
            <span
              ref={closeLblRef}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono),"JetBrains Mono",monospace',
                fontSize: 10, letterSpacing: '0.12em',
                color: CLR_LIGHT,
                userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
              }}
            >
              CLOSE
            </span>
          </span>

          <button
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            style={{ background: 'none', border: 'none', padding: '8px 0 8px 4px', cursor: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7 }}
          >
            <span ref={line1Ref} style={{ display: 'block', width: 28, height: 1.5, backgroundColor: CLR_LIGHT, borderRadius: 1, transformOrigin: 'center center' }} />
            <span ref={line2Ref} style={{ display: 'block', width: 28, height: 1.5, backgroundColor: CLR_LIGHT, borderRadius: 1, transformOrigin: 'center center' }} />
          </button>
        </div>
      </div>

      {/* ── Fullscreen overlay ── */}
      <div
        ref={overlayRef}
        id="nav-overlay"
        style={{ position: 'fixed', inset: 0, zIndex: 99, visibility: 'hidden', pointerEvents: 'none', overflow: 'hidden' }}
      >
        {/* 8 horizontal cream bands */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <div
            key={i}
            ref={el => { if (el) stripsRef.current[i] = el }}
            style={{
              position: 'absolute', top: `${i * 12.5}%`, left: 0,
              width: '100%', height: 'calc(12.5% + 1px)',
              backgroundColor: 'var(--white)', zIndex: 1,
            }}
          />
        ))}

        {/* Orange line below nav bar */}
        <div style={{ position: 'absolute', top: 64, left: 0, width: '100%', height: 2, backgroundColor: 'var(--accent)', zIndex: 2 }} />

        {/* Nav content — above strips */}
        <div
          ref={navContentRef}
          style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>

            {/* Left: links */}
            <div
              className="overlay-left"
              style={{ width: '60%', paddingLeft: 120, paddingRight: 48, paddingTop: 140, paddingBottom: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <p style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', fontSize: 11, letterSpacing: '0.1em', color: 'var(--accent)', margin: '0 0 44px 0' }}>
                [ NAVIGATION ]
              </p>

              <div onMouseLeave={() => setHoveredIdx(null)}>
                {NAV_LINKS.map(({ index, label, href }, i) => (
                  <div
                    key={label}
                    style={{ position: 'relative', paddingTop: 6, marginBottom: 0, cursor: 'none' }}
                    onMouseEnter={() => setHoveredIdx(i)}
                  >
                    <span
                      ref={el => { linkIdxRefs.current[i] = el }}
                      style={{ position: 'absolute', top: 2, left: 0, fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', fontSize: 13, letterSpacing: '0.04em', color: 'var(--accent)' }}
                    >
                      {index}
                    </span>

                    <div style={{ overflow: 'hidden', display: 'inline-block', marginLeft: 52, position: 'relative', verticalAlign: 'top' }}>
                      <svg
                        ref={el => { waveRefs.current[i] = el }}
                        aria-hidden="true" viewBox="0 0 1000 60" preserveAspectRatio="none"
                        style={{ position: 'absolute', top: '50%', left: 0, width: '125%', height: 44, transform: 'translateY(-50%)', pointerEvents: 'none' }}
                      >
                        <path
                          d="M0,30 Q83,0 167,30 Q250,60 333,30 Q417,0 500,30 Q583,60 667,30 Q750,0 833,30 Q917,60 1000,30"
                          fill="none" stroke="#C8EF4A" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round"
                          style={{
                            strokeDasharray: 2200,
                            strokeDashoffset: (activeSection === href.slice(1) || hoveredIdx === i) ? 0 : 2200,
                            opacity: (activeSection === href.slice(1) || hoveredIdx === i) ? 0.88 : 0,
                            transition: 'stroke-dashoffset 1.3s cubic-bezier(0.45,0,0.1,1), opacity 0.35s ease',
                          }}
                        />
                      </svg>

                      <a
                        ref={el => { linkInnerRefs.current[i] = el }}
                        href={href}
                        onClick={e => { e.preventDefault(); handleLinkClick(href) }}
                        className="overlay-link-txt"
                        style={{
                          display: 'block', position: 'relative',
                          fontFamily: 'var(--font-clash),Syne,sans-serif', fontWeight: 800,
                          fontSize: 'clamp(60px,9vw,120px)', lineHeight: 0.9, letterSpacing: '-0.04em',
                          color: (activeSection === href.slice(1) || hoveredIdx === i) ? 'var(--accent)' : CLR_DARK,
                          opacity: hoveredIdx !== null && hoveredIdx !== i && activeSection !== href.slice(1) ? 0.2 : 1,
                          transition: 'color 0.2s ease, opacity 0.2s ease',
                          textDecoration: 'none', whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                      </a>
                    </div>

                    <div style={{
                      height: 1, background: 'var(--accent)',
                      transform: hoveredIdx === i ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left center',
                      transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
                      marginTop: 6, marginLeft: 52,
                    }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: sidebar */}
            <div
              className="overlay-sidebar"
              style={{ width: '40%', padding: '140px 80px 40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 28 }}
            >
              <a
                href={`mailto:${person.email}`}
                data-cursor="highlight" data-cursor-color="#111111"
                style={{ fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif', fontSize: 15, color: 'rgba(17,17,17,0.45)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = CLR_DARK)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(17,17,17,0.45)')}
              >
                {person.email}
              </a>

              <a
                href={person.githubUrl}
                target="_blank" rel="noopener noreferrer"
                data-cursor="highlight" data-cursor-color="#111111"
                style={{ fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif', fontSize: 15, color: 'rgba(17,17,17,0.45)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = CLR_DARK)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(17,17,17,0.45)')}
              >
                {person.github}
              </a>

              <a
                href="/resume.pdf"
                download="Prusotam_Kumar_Yadav_Resume.pdf"
                target="_blank" rel="noopener noreferrer"
                data-cursor="highlight" data-cursor-color="#111111"
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-mono),"JetBrains Mono",monospace',
                  fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                  color: 'rgba(17,17,17,0.6)', textDecoration: 'none',
                  border: '1px solid rgba(17,17,17,0.2)', padding: '10px 20px',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(17,17,17,0.6)'; e.currentTarget.style.borderColor = 'rgba(17,17,17,0.2)' }}
              >
                [ Download CV ]
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="overlay-bottom-bar"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 120px' }}
          >
            <p style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', fontSize: 11, letterSpacing: '0.04em', color: 'var(--accent)', margin: 0 }}>
              <span className="availability-pulse">●</span>{' '}Available for work
            </p>
            <p style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', fontSize: 11, letterSpacing: '0.04em', color: 'rgba(17,17,17,0.4)', margin: 0 }}>
              {currentTime}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
