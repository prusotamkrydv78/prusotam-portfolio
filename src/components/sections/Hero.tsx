'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, DUR_SLOW, EASE_OUT } from '@/lib/animations'
import { person } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

/* Split "Full Stack Developer" into two parts:
   "Full Stack" → white
   "Developer"  → orange accent */
const part1 = 'Full Stack'
const part2 = 'Developer'

function buildChars(str: string) {
  return str.split('').map((c, i) => (
    <span
      key={i}
      style={{ overflow: 'hidden', display: 'inline-block' }}
    >
      <span className="char" style={{ display: 'inline-block' }}>{c === ' ' ? ' ' : c}</span>
    </span>
  ))
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chars   = ref.current.querySelectorAll<HTMLSpanElement>('.char')
    const sub     = ref.current.querySelector('[data-sub]')
    const bottom  = ref.current.querySelector('[data-bottom]')

    const ctx = gsap.context(() => {
      gsap.from(chars, {
        y: '110%',
        duration: DUR_SLOW,
        ease: EASE_OUT,
        stagger: 0.025,
        delay: 0.1,
      })
      gsap.from(sub, {
        opacity: 0, y: 12,
        duration: DUR_SLOW,
        ease: EASE_OUT,
        delay: 0.7,
      })
      gsap.from(bottom, {
        opacity: 0,
        duration: 0.6,
        ease: EASE_OUT,
        delay: 1.1,
      })
    }, ref)

    return () => ctx.revert()
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
