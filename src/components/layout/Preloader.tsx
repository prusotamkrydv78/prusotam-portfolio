'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { triggerHeroReveal } from '@/components/sections/Hero'
import Lenis from 'lenis'

/* Number of vertical cream strips that form the loading screen and break apart on exit.
   Width/position are derived from this, so any count tiles seamlessly. */
const STRIP_COUNT = 8

export default function Preloader() {
  const overlayRef   = useRef<HTMLDivElement>(null)
  const contentRef   = useRef<HTMLDivElement>(null)
  const counterRef   = useRef<HTMLSpanElement>(null)
  const bigTextRef   = useRef<HTMLDivElement>(null)
  const innerBarRef  = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const stripsRef    = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const cursorCanvas = document.querySelector('canvas') as HTMLCanvasElement | null

    /* ── Skip path: only for users who prefer reduced motion ──
       Hide the overlay immediately, restore page state, and reveal the hero as
       soon as it has registered its entrance (retry across frames until ready).
       Everyone else always sees the ~3s intro on every visit. */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      overlay.style.display = 'none'
      document.body.style.overflow = ''
      document.body.style.cursor = 'none'
      ;(window as unknown as { lenis?: Lenis }).lenis?.start()
      if (cursorCanvas) cursorCanvas.style.display = 'block'

      let tries = 0
      let rafId = 0
      const fire = () => {
        if (triggerHeroReveal()) return        // hero ready → revealed, stop
        if (++tries < 90) rafId = requestAnimationFrame(fire)
      }
      rafId = requestAnimationFrame(fire)
      return () => cancelAnimationFrame(rafId)
    }

    /* Hide custom cursor while loading */
    if (cursorCanvas) cursorCanvas.style.display = 'none'
    document.body.style.cursor = 'default'

    document.body.style.overflow = 'hidden'
    ;(window as unknown as { lenis?: Lenis }).lenis?.stop()

    const counterEl  = counterRef.current!
    const bigText    = bigTextRef.current!
    const innerBar   = innerBarRef.current!
    const bottomBar  = bottomBarRef.current!
    const counterObj = { value: 0 }

    /* Fade in content layer */
    gsap.fromTo(contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    )

    /* Smooth counter — linear ease, every rAF frame, no integer jumps */
    gsap.to(counterObj, {
      value:    100,
      duration: 2.5,
      ease:     'none',
      onUpdate() {
        const v = counterObj.value
        /* Use toFixed(1) internally but display as integer — avoids floor-jump */
        const display = Math.min(100, Math.round(v))
        counterEl.textContent = display + '%'
        innerBar.style.width  = v + '%'
        bottomBar.style.width = v + '%'
        bigText.style.opacity = String(0.06 + (v / 100) * 0.06)
      },
    })

    /* Exit — 0.45s beat after counter lands */
    const delayed = gsap.delayedCall(2.95, () => {
      const tl = gsap.timeline({
        onComplete() {
          overlay.style.display    = 'none'
          document.body.style.overflow = ''
          ;(window as unknown as { lenis?: Lenis }).lenis?.start()
          if (cursorCanvas) cursorCanvas.style.display = 'block'
          document.body.style.cursor = 'none'
        },
      })

      /* Strips break apart — stagger from center */
      tl.to(stripsRef.current, {
        yPercent: -100,
        duration: 1.0,
        ease: 'power3.inOut',
        stagger: { amount: 0.45, from: 'center' },
      }, 0)

      /* Content moves up WITH the screen — no separate fade, rides with the center strip */
      tl.to(contentRef.current, {
        yPercent: -100,
        duration: 1.0,
        ease: 'power3.inOut',
      }, 0)

      tl.add(() => { triggerHeroReveal() }, '-=0.6')
    })

    return () => {
      delayed.kill()
      gsap.killTweensOf([counterObj, bigText])
      if (cursorCanvas) cursorCanvas.style.display = 'block'
      document.body.style.cursor = 'none'
    }
  }, [])

  const cornerLabel: React.CSSProperties = {
    position:      'absolute',
    fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
    fontSize:      11,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color:         'rgba(17,17,17,0.35)',
  }

  return (
    <div
      ref={overlayRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}
    >
      {/* ─── Cream strips — collectively form the loading screen ─── */}
      {Array.from({ length: STRIP_COUNT }, (_, i) => (
        <div
          key={i}
          ref={el => { if (el) stripsRef.current[i] = el }}
          style={{
            position: 'absolute',
            top:      0,
            left:     `${i * (100 / STRIP_COUNT)}%`,
            width:    `calc(${100 / STRIP_COUNT}% + 1px)`,
            height:   '100vh',
            background: 'var(--white)',
          }}
        />
      ))}

      {/* ─── Content layer — sits above strips via DOM order ─── */}
      <div
        ref={contentRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}
      >
        {/* Thin horizontal centre line — structural grid feel */}
        <div style={{
          position:   'absolute',
          top:        '50%',
          left:       0,
          width:      '100%',
          height:     1,
          background: 'rgba(17,17,17,0.07)',
          transform:  'translateY(-50%)',
        }} />

        {/* Large watermark text — decorative, barely visible */}
        <div
          ref={bigTextRef}
          style={{
            position:   'absolute',
            top:        '50%',
            left:       '50%',
            transform:  'translate(-50%, -50%)',
            textAlign:  'center',
            opacity:    0.06,
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {['FULL STACK', 'DEVELOPER'].map(line => (
            <div key={line} style={{
              fontFamily:    'var(--font-clash), Syne, sans-serif',
              fontWeight:    800,
              fontSize:      'clamp(56px, 10vw, 140px)',
              color:         '#111111',
              letterSpacing: '-0.04em',
              lineHeight:    0.9,
            }}>
              {line}
            </div>
          ))}
        </div>

        {/* Counter box wrapper — fixed size, blur bg behind */}
        <div style={{
          position:  'absolute',
          top:       '50%',
          left:      '50%',
          transform: 'translate(-50%, -50%)',
          width:     340,
          height:    240,
        }}>
          {/* Dark gray blurred blob */}
          <div style={{
            position:     'absolute',
            inset:        '-24px',
            background:   'rgba(55,55,65,0.5)',
            filter:       'blur(36px)',
            borderRadius: 8,
          }} />

          {/* Counter content */}
          <div style={{
            position:       'relative',
            width:          '100%',
            height:         '100%',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            14,
          }}>
            <span style={{
              fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
              fontSize:      10,
              letterSpacing: '0.25em',
              textTransform: 'uppercase' as const,
              color:         'rgba(255,77,0,0.8)',
            }}>
              LOADING
            </span>

            <span
              ref={counterRef}
              style={{
                fontFamily:         'var(--font-clash), Syne, sans-serif',
                fontWeight:         800,
                fontSize:           'clamp(72px, 12vw, 140px)',
                color:              '#111111',
                letterSpacing:      '-0.05em',
                lineHeight:         1,
                display:            'block',
                fontVariantNumeric: 'tabular-nums',
                width:              '100%',
                textAlign:          'center',
              }}
            >
              0%
            </span>

            {/* Inner progress bar */}
            <div style={{ width: '80%', height: 1, background: 'rgba(255,77,0,0.2)', position: 'relative' }}>
              <div
                ref={innerBarRef}
                style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '0%', background: '#FF4D00' }}
              />
            </div>
          </div>
        </div>

        {/* Four corner labels */}
        <div style={{ ...cornerLabel, top: 32, left: 'clamp(24px,5vw,64px)' }}>
          PRUSOTAM YADAV
        </div>
        <div style={{ ...cornerLabel, top: 32, right: 'clamp(24px,5vw,64px)', textAlign: 'right' }}>
          PORTFOLIO — 2026
        </div>
        <div style={{ ...cornerLabel, bottom: 32, left: 'clamp(24px,5vw,64px)' }}>
          INDIA
        </div>
        <div style={{ ...cornerLabel, bottom: 32, right: 'clamp(24px,5vw,64px)', textAlign: 'right' }}>
          FULL STACK DEVELOPER
        </div>

        {/* Bottom accent line — orange fill synced with counter */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 2, background: 'rgba(17,17,17,0.08)' }}>
          <div
            ref={bottomBarRef}
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '0%', background: '#FF4D00' }}
          />
        </div>
      </div>
    </div>
  )
}
