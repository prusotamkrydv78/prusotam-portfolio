'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'

const ParticleGrid = dynamic(() => import('@/components/canvas/ParticleGrid'), { ssr: false })

const nameLines = [
  { text: 'PRUSOTAM', delay: 0,    accent: false },
  { text: 'KUMAR',    delay: 0.22, accent: false },
  { text: 'YADAV.',   delay: 0.44, accent: true  },
]

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const letterGroups = containerRef.current.querySelectorAll<HTMLSpanElement>('[data-letters]')
    const bar   = containerRef.current.querySelector('[data-bar]')
    const badge = containerRef.current.querySelector('[data-badge]')

    const ctx = gsap.context(() => {
      letterGroups.forEach((group) => {
        const delay = parseFloat(group.getAttribute('data-delay') ?? '0')
        const letters = group.querySelectorAll<HTMLSpanElement>('.letter')
        gsap.fromTo(
          letters,
          { y: '110%', rotation: 3, opacity: 0 },
          {
            y: '0%', rotation: 0, opacity: 1,
            duration: 0.9, ease: 'expo.out', stagger: 0.04, delay,
          }
        )
      })

      gsap.fromTo(bar,   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', delay: 0.9 })
      gsap.fromTo(badge, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', delay: 1.1 })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative overflow-hidden"
      style={{ background: 'var(--bg-invert)', height: '100svh' }}
    >
      <ParticleGrid />

      {/* Availability badge */}
      <div
        data-badge
        style={{ opacity: 0 }}
        className="absolute top-16 right-[var(--gutter)] flex items-center gap-2.5
                   font-[family-name:var(--font-dm-mono)]
                   uppercase tracking-[0.18em] text-[var(--accent)]"
      >
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'inline-block',
            boxShadow: '0 0 6px var(--accent)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <span style={{ fontSize: '12px' }}>OPEN TO WORK</span>
      </div>

      {/* Name block */}
      <div className="absolute bottom-20 left-[var(--gutter)]">
        {nameLines.map(({ text, delay, accent }) => (
          <div
            key={text}
            data-letters
            data-delay={String(delay)}
            style={{ overflow: 'hidden', lineHeight: 0.92 }}
          >
            {text.split('').map((char, i) => (
              <span
                key={i}
                className="letter"
                style={{
                  display: 'inline-block',
                  fontSize: 'var(--type-display)',
                  fontFamily: 'var(--font-syne), sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: accent && char === '.' ? 'var(--accent)' : 'var(--ink-invert)',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom info bar */}
      <div
        data-bar
        style={{
          opacity: 0,
          borderTop: '1px solid rgba(245,242,238,0.08)',
        }}
        className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-between px-[var(--gutter)]
                   font-[family-name:var(--font-dm-mono)]
                   text-[var(--type-micro)] uppercase tracking-[0.2em]"
      >
        <span style={{ color: 'rgba(184,176,168,0.7)' }}>Full Stack Developer</span>
        <span className="hidden sm:block" style={{ color: 'rgba(184,176,168,0.5)' }}>
          React · TypeScript · Node.js · ASP.NET
        </span>
        <span style={{ color: 'rgba(184,176,168,0.7)' }}>↓ Scroll</span>
      </div>
    </section>
  )
}
