'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { timeline } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<SVGLineElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Draw timeline line on scroll
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength?.() ?? 600
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        })
      }

      // Entry reveals
      document.querySelectorAll('.timeline-entry').forEach((entry, i) => {
        gsap.fromTo(entry,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: entry, start: 'top 80%' },
            delay: i * 0.1,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <p
          className="text-xs tracking-widest uppercase mb-4"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          — Journey —
        </p>
        <h2
          className="mb-20"
          style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
          }}
        >
          How I got here.
        </h2>

        <div className="relative max-w-2xl">
          {/* SVG timeline line */}
          <svg
            className="absolute left-0 top-0 h-full"
            width="2"
            style={{ overflow: 'visible' }}
          >
            <line
              ref={lineRef}
              x1="1" y1="0" x2="1" y2="100%"
              stroke="var(--accent)"
              strokeWidth="2"
              className="timeline-line"
            />
          </svg>

          <div className="flex flex-col gap-16 pl-10">
            {timeline.map((item, i) => (
              <div key={i} className="timeline-entry relative">
                {/* Dot */}
                <div
                  className="absolute -left-[41px] top-1 w-3 h-3 rounded-full border-2"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--accent)' }}
                />

                <span
                  className="block text-xs tracking-widest uppercase mb-2"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace' }}
                >
                  {item.period}
                </span>

                <h3
                  className="mb-1"
                  style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-sm mb-3"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}
                >
                  {item.company}
                </p>

                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded-sm"
                      style={{
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-geist-mono), monospace',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
