'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'
import { person, projects, stats } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const bioLines = [
  'A developer',
  'who builds',
  'things that',
  'actually work.',
]

const currentlyBuilding = projects.map((p) => p.title)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const statRefs   = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return
    const lines = sectionRef.current.querySelectorAll('[data-line]')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: '105%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: DUR_MID, ease: EASE_OUT, stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )

      stats.forEach((s, i) => {
        const el = statRefs.current[i]
        if (!el) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: s.value,
          duration: 1.4, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val) + s.suffix },
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        background: 'var(--surface-1)',
        paddingTop: 'var(--section-v)',
        paddingBottom: 'var(--section-v)',
      }}
    >
      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 48 }}>
          ABOUT
        </p>

        <div className="grid-12" style={{ alignItems: 'start' }}>
          {/* Left — col 1-5 */}
          <div style={{ gridColumn: '1 / 6' }}>
            {/* Bio */}
            <div style={{ marginBottom: 32 }}>
              {bioLines.map((line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <span
                    data-line
                    className="t-title"
                    style={{ display: 'block', color: 'var(--text-primary)', lineHeight: 1.05 }}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>

            <p className="t-body" style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 360 }}>
              Full Stack Developer based in {person.location}.<br />
              Building since 2023.
            </p>

            <div style={{ display: 'flex', gap: 24 }}>
              <a
                href={person.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="t-meta underline-sweep"
                style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
              >
                ↗ GitHub
              </a>
              <a
                href={`mailto:${person.email}`}
                className="t-meta underline-sweep"
                style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                data-cursor-copy
              >
                ↗ Email
              </a>
            </div>
          </div>

          {/* Right — col 7-12 */}
          <div style={{ gridColumn: '7 / 13' }}>
            {/* 2×2 stat grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                border: '1px solid var(--line)',
                marginBottom: 40,
              }}
            >
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    background: 'var(--white)',
                    padding: '24px 28px',
                    borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none',
                    borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
                  }}
                >
                  <span
                    ref={(el) => { statRefs.current[i] = el }}
                    style={{
                      fontFamily: 'var(--font-clash), Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: 48,
                      color: 'var(--text-primary)',
                      display: 'block',
                      lineHeight: 1,
                    }}
                  >
                    0{s.suffix}
                  </span>
                  <span className="t-label" style={{ color: 'var(--text-secondary)', marginTop: 8, display: 'block' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Currently building */}
            <p className="t-label" style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>
              Currently building:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {currentlyBuilding.map((name) => (
                <span
                  key={name}
                  className="t-label"
                  style={{
                    background: 'var(--black)',
                    color: 'var(--text-inverse)',
                    padding: '6px 12px',
                    borderRadius: 2,
                    cursor: 'default',
                    transition: 'background 0.25s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--black)' }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
