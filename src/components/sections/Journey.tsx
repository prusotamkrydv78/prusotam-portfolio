'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

const JOURNEY = [
  {
    year: '2026 —',
    title: 'Full Stack Developer',
    subtitle: 'Independent',
    body: 'Building with TypeScript, React, Node.js, and ASP.NET Core. Working across web and mobile platforms. Shipping production apps from scratch.',
  },
  {
    year: '2024 — 2025',
    title: 'Full Stack Transition',
    subtitle: null,
    body: 'Moved from frontend-only to full stack. Built real-time apps, REST APIs, and mobile applications. 391+ GitHub contributions in the last year.',
  },
  {
    year: '2023',
    title: 'Started Coding',
    subtitle: null,
    body: 'First line of JavaScript. React within 3 months. Full stack within 12. Still going.',
  },
  {
    year: '[Year] —',
    title: '[Degree / College Name]',
    subtitle: 'Computer Science / IT',
    body: '← Update with your actual education details.',
  },
]

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const years    = sectionRef.current.querySelectorAll('[data-year]')
    const contents = sectionRef.current.querySelectorAll('[data-entry-content]')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        years,
        { y: '105%' },
        {
          y: '0%',
          duration: DUR_MID, ease: EASE_OUT, stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )

      gsap.from(contents, {
        opacity: 0, y: 20,
        duration: DUR_MID, ease: EASE_OUT, stagger: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        delay: 0.1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      style={{
        background: 'var(--white)',
        paddingTop: 'var(--section-v)',
        paddingBottom: 'var(--section-v)',
      }}
    >
      <style>{`
        .journey-entry {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 0 64px;
          border-top: 1px solid var(--line);
          padding-top: 40px;
          padding-bottom: 40px;
        }
        @media (max-width: 680px) {
          .journey-entry {
            grid-template-columns: 1fr;
            gap: 12px 0;
          }
        }
      `}</style>

      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 48 }}>
          JOURNEY
        </p>

        <h2 style={{ marginBottom: 64 }}>
          {['The path', 'here.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span
                className="t-title"
                style={{ display: 'block', color: 'var(--text-primary)' }}
              >
                {line}
              </span>
            </div>
          ))}
        </h2>

        <div>
          {JOURNEY.map((entry, i) => (
            <div key={i} className="journey-entry">
              {/* Year column */}
              <div style={{ overflow: 'hidden', paddingTop: 4 }}>
                <span
                  data-year
                  className="t-meta"
                  style={{
                    color: 'var(--accent)',
                    display: 'block',
                    fontWeight: 500,
                  }}
                >
                  {entry.year}
                </span>
              </div>

              {/* Content column */}
              <div data-entry-content>
                <h3
                  style={{
                    fontFamily: 'var(--font-display), Syne, sans-serif',
                    fontWeight: 600,
                    fontSize: 'clamp(18px, 2vw, 24px)',
                    lineHeight: 1.2,
                    color: 'var(--text-primary)',
                    marginBottom: entry.subtitle ? 6 : 12,
                  }}
                >
                  {entry.title}
                </h3>
                {entry.subtitle && (
                  <p
                    className="t-label"
                    style={{ color: 'var(--text-secondary)', marginBottom: 12 }}
                  >
                    {entry.subtitle}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    maxWidth: 560,
                  }}
                >
                  {entry.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
