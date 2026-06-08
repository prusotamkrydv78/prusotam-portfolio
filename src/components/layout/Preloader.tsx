'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { triggerHeroReveal } from '@/components/sections/Hero'

export default function Preloader() {
  const overlayRef  = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const counterRef  = useRef<HTMLSpanElement>(null)
  const nameRef     = useRef<HTMLDivElement>(null)
  const roleRef     = useRef<HTMLDivElement>(null)
  const vertBarRef  = useRef<HTMLDivElement>(null)
  const horizBarRef = useRef<HTMLDivElement>(null)
  const stripsRef   = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    document.body.style.overflow = 'hidden'
    ;(window as any).lenis?.stop()

    const counterEl  = counterRef.current!
    const counterObj = { value: 0 }

    /* Phase 1 — label fade-ins */
    gsap.fromTo(nameRef.current,
      { opacity: 0 },
      { opacity: 0.3, duration: 0.6, ease: 'power2.out' }
    )
    gsap.fromTo(roleRef.current,
      { opacity: 0 },
      { opacity: 0.3, duration: 0.6, ease: 'power2.out', delay: 0.3 }
    )

    /* Phase 1 — counter 0 → 100 + synced bars (2.5s — visible and weighty) */
    gsap.to(counterObj, {
      value: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate() { counterEl.textContent = Math.round(counterObj.value) + '%' },
    })
    gsap.to(vertBarRef.current,  { scaleY: 1, duration: 2.5, ease: 'power2.inOut' })
    gsap.to(horizBarRef.current, { scaleX: 1, duration: 2.5, ease: 'power2.inOut' })

    /* Phase 2 — exit: 0.4s beat after counter lands, then curtain exits */
    const delayed = gsap.delayedCall(2.95, () => {
      const tl = gsap.timeline({
        onComplete() {
          overlay.style.display = 'none'
          document.body.style.overflow = ''
          ;(window as any).lenis?.start()
        },
      })

      /* Content fades out so 100% lingers for a beat */
      tl.to(contentRef.current, { opacity: 0, duration: 0.4, ease: 'expo.in' })
      /* Pause */
      tl.to({}, { duration: 0.15 })
      /* 8 panels lift off from center outward — cubic motion */
      tl.to(stripsRef.current, {
        yPercent: -100,
        duration: 1.0,
        ease: 'power3.inOut',
        stagger: { amount: 0.45, from: 'center' },
      })
      /* Hero rises into the vacated space 0.6s before last strip exits */
      tl.add(() => { triggerHeroReveal() }, '-=0.6')
    })

    return () => {
      delayed.kill()
      gsap.killTweensOf([counterObj, vertBarRef.current, horizBarRef.current, nameRef.current, roleRef.current])
    }
  }, [])

  return (
    <div
      ref={overlayRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}
    >
      {/* 8 cream strips — contrast against dark hero, peel away in cubic motion */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <div
          key={i}
          ref={el => { if (el) stripsRef.current[i] = el }}
          style={{
            position: 'absolute',
            top: 0,
            left: `${i * 12.5}%`,
            width: 'calc(12.5% + 1px)',
            height: '100vh',
            background: 'var(--white)',
          }}
        />
      ))}

      {/* Content layer — above strips via DOM order */}
      <div
        ref={contentRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {/* Top-left: name */}
        <div
          ref={nameRef}
          style={{
            position: 'absolute',
            top: 'clamp(24px, 4vw, 48px)',
            left: 'clamp(24px, 5vw, 80px)',
            fontFamily: 'var(--font-jb-mono), "JetBrains Mono", monospace',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(17,17,17,0.4)',
            opacity: 0,
          }}
        >
          PRUSOTAM YADAV
        </div>

        {/* Bottom-right: role */}
        <div
          ref={roleRef}
          style={{
            position: 'absolute',
            bottom: 'clamp(52px, 7vw, 72px)',
            right: 'clamp(24px, 5vw, 80px)',
            fontFamily: 'var(--font-jb-mono), "JetBrains Mono", monospace',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(17,17,17,0.4)',
            opacity: 0,
          }}
        >
          FULL STACK DEVELOPER
        </div>

        {/* Bottom-left: large percentage counter */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 'clamp(24px, 5vw, 80px)',
          }}
        >
          <span
            ref={counterRef}
            style={{
              fontFamily: 'var(--font-clash), Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(80px, 14vw, 180px)',
              color: 'var(--black)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              display: 'block',
            }}
          >
            0%
          </span>
        </div>

        {/* Right edge: vertical progress bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 'clamp(24px, 5vw, 80px)',
            width: 1,
            height: '100%',
            background: 'rgba(17,17,17,0.1)',
          }}
        >
          <div
            ref={vertBarRef}
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--accent)',
              transformOrigin: 'top center',
              transform: 'scaleY(0)',
            }}
          />
        </div>

        {/* Bottom edge: horizontal accent line */}
        <div
          ref={horizBarRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 2,
            width: '100%',
            background: 'var(--accent)',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  )
}
