'use client'

import { useEffect, useRef } from 'react'
import { gsap, DUR_SLOW, EASE_OUT } from '@/lib/animations'
import { person } from '@/lib/data'

const part1 = 'Full Stack'
const part2 = 'Developer'

function buildChars(str: string) {
  return str.split('').map((c, i) => (
    <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
      <span className="char" style={{ display: 'inline-block' }}>
        {c === ' ' ? ' ' : c}
      </span>
    </span>
  ))
}

/* Preloader calls this when strips peel away. Also called immediately on
   subsequent session visits (sessionStorage guard in Hero's own useEffect). */
let _revealFn: (() => void) | null = null
export function triggerHeroReveal() { _revealFn?.() }

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el     = ref.current
    const chars  = el.querySelectorAll<HTMLSpanElement>('.char')
    const sub    = el.querySelector<HTMLElement>('[data-sub]')
    const bottom = el.querySelector<HTMLElement>('[data-bottom]')
    const avail  = el.querySelector<HTMLElement>('[data-available]')

    /* Initialize all elements hidden — preloader covers during first visit */
    gsap.set(chars, { y: '110%' })
    if (sub)    gsap.set(sub,    { opacity: 0, y: 12 })
    if (bottom) gsap.set(bottom, { opacity: 0 })
    if (avail)  gsap.set(avail,  { opacity: 0 })

    const reveal = () => {
      gsap.to(chars,  { y: '0%',   duration: DUR_SLOW, ease: EASE_OUT, stagger: 0.025 })
      gsap.to(sub,    { opacity: 1, y: 0, duration: DUR_SLOW, ease: EASE_OUT, delay: 0.3 })
      gsap.to(bottom, { opacity: 1, duration: 0.6,     ease: EASE_OUT, delay: 0.55 })
      gsap.to(avail,  { opacity: 1, duration: 0.5,     ease: EASE_OUT, delay: 0.4 })
    }

    _revealFn = reveal

    return () => {
      _revealFn = null
      chars.forEach(c => gsap.killTweensOf(c))
      if (sub)    gsap.killTweensOf(sub)
      if (bottom) gsap.killTweensOf(bottom)
      if (avail)  gsap.killTweensOf(avail)
    }
  }, [])

  return (
    <section
      ref={ref}
      id="hero"
      style={{
        background: 'var(--black)',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '120px var(--gutter) 64px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Available label — top right */}
      <div
        data-available
        className="t-label"
        style={{
          position: 'absolute',
          top: 80,
          right: 'var(--gutter)',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'inline-block',
            boxShadow: '0 0 8px var(--accent)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        Available for work
      </div>

      {/* Headline */}
      <div style={{ maxWidth: '1100px' }}>
        <div
          className="t-display"
          style={{ display: 'block', color: 'var(--text-inverse)', marginBottom: '0.05em' }}
          aria-label="Full Stack Developer"
        >
          {buildChars(part1)}
        </div>
        <div
          className="t-display"
          style={{ display: 'block', color: 'var(--accent)' }}
        >
          {buildChars(part2)}
        </div>
      </div>

      {/* Subtitle */}
      <p
        data-sub
        className="t-body"
        style={{
          color: 'var(--text-secondary)',
          marginTop: 28,
          maxWidth: 560,
        }}
      >
        {person.stack.join(' · ')}
      </p>

      {/* Bottom row */}
      <div
        data-bottom
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px var(--gutter)',
          borderTop: '1px solid var(--line-dark)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="t-label" style={{ color: 'var(--text-secondary)' }}>
          ↓ scroll
        </span>
        <span className="t-label" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'inline-block',
            }}
          />
          Open to work
        </span>
      </div>
    </section>
  )
}
