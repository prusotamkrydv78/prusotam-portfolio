'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills, marqueeRow1, marqueeRow2 } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database & Cloud',
  tools: 'Tools & Workflow',
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.skill-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const marquee1 = [...marqueeRow1, ...marqueeRow1]
  const marquee2 = [...marqueeRow2, ...marqueeRow2]

  return (
    <section id="skills" ref={sectionRef} className="section-padding overflow-hidden" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container mb-16">
        <p
          className="text-xs tracking-widest uppercase mb-4"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          — Skills —
        </p>
        <h2
          style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
          }}
        >
          What I work with.
        </h2>
      </div>

      {/* Marquee */}
      <div className="flex flex-col gap-4 mb-20">
        {/* Row 1 — left */}
        <div className="marquee-row flex overflow-hidden">
          <div className="animate-marquee-left flex gap-8 whitespace-nowrap">
            {marquee1.map((s, i) => (
              <span key={i} className="flex items-center gap-4" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px' }}>
                {s}
                <span style={{ color: 'var(--accent)' }}>·</span>
              </span>
            ))}
          </div>
        </div>
        {/* Row 2 — right */}
        <div className="marquee-row flex overflow-hidden">
          <div className="animate-marquee-right flex gap-8 whitespace-nowrap">
            {marquee2.map((s, i) => (
              <span key={i} className="flex items-center gap-4" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px' }}>
                {s}
                <span style={{ color: 'var(--accent)' }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skill cards grid */}
      <div ref={cardsRef} className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {(Object.keys(skills) as Array<keyof typeof skills>).map((key) => (
            <div
              key={key}
              className="skill-card rounded-sm p-6 transition-all duration-300 group"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px var(--accent-glow)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              <p
                className="text-[11px] uppercase tracking-widest mb-4"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                {categoryLabels[key]}
              </p>
              <ul className="flex flex-col gap-2">
                {skills[key].map((skill) => (
                  <li
                    key={skill}
                    className="text-sm flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span style={{ color: 'var(--accent)' }}>·</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
