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
    const el    = sectionRef.current
    const lines  = el.querySelectorAll('[data-line]')
    const label  = el.querySelector('.section-label')
    const extras = el.querySelectorAll('[data-extra]')
    const pills  = el.querySelectorAll('.tech-pill')
    const boxes  = el.querySelectorAll('.stat-box')

    const ctx = gsap.context(() => {
      /* Section label letter-spacing expand */
      if (label) gsap.fromTo(label,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.15em', duration: 0.6, ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 20%', scrub: 1 } }
      )

      /* Bio headline clip reveal */
      gsap.fromTo(lines,
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, duration: DUR_MID, ease: EASE_OUT, stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 78%', end: 'top 15%', scrub: 1 } }
      )

      /* Extra items */
      if (extras.length) gsap.fromTo(extras,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: DUR_MID, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 15%', scrub: 1 } }
      )

      /* Stat boxes entrance */
      if (boxes.length) gsap.fromTo(boxes,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.75)', stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 72%', end: 'top 15%', scrub: 1 } }
      )

      /* Tech pill entrance wave */
      if (pills.length) gsap.fromTo(pills,
        { scale: 0.8, opacity: 0, y: 4 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.8)', stagger: 0.04,
          scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 15%', scrub: 1 } }
      )

      /* Stats count-up (reverses on scroll up) */
      stats.forEach((s, i) => {
        const el2 = statRefs.current[i]
        if (!el2) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: s.value,
          duration: 1.4, ease: 'power2.out',
          onUpdate() { el2.textContent = Math.round(obj.val) + s.suffix },
          onComplete() { el2.textContent = s.value + s.suffix },
          scrollTrigger: { trigger: el2, start: 'top 88%', end: 'top 20%', scrub: 1 },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ background: 'var(--surface-1)', paddingTop: 'var(--section-v)', paddingBottom: 'var(--section-v)' }}
    >
      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 48 }}>
          ABOUT
        </p>

        <div className="grid-12" style={{ alignItems: 'start' }}>
          {/* Left — col 1-5 */}
          <div style={{ gridColumn: '1 / 6' }}>
            <div style={{ marginBottom: 32 }}>
              {bioLines.map((line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <span data-line className="t-title" style={{ display: 'block', color: 'var(--text-primary)', lineHeight: 1.05 }}>
                    {line}
                  </span>
                </div>
              ))}
            </div>

            <p data-extra style={{ fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif', fontSize: 16, lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 440, marginBottom: 32 }}>
              {person.role} based in {person.location}. Focused on shipping full-stack products — web, mobile, and real-time.
            </p>

            <div data-extra style={{ display: 'flex', gap: 16 }}>
              <a href={person.githubUrl} target="_blank" rel="noopener noreferrer"
                className="t-label underline-sweep"
                style={{ color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
              >↗ GitHub</a>
              <a href={`mailto:${person.email}`}
                className="t-label underline-sweep"
                style={{ color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
              >↗ Email</a>
            </div>
          </div>

          {/* Right — col 7-12 */}
          <div style={{ gridColumn: '7 / 13' }}>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="stat-box"
                  style={{
                    padding: '24px 20px',
                    background: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: 4,
                    transition: 'background 0.25s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--white)' }}
                >
                  <span
                    ref={el => { statRefs.current[i] = el }}
                    style={{ fontFamily: 'var(--font-display),Syne,sans-serif', fontWeight: 700, fontSize: 'clamp(28px,3vw,40px)', lineHeight: 1, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}
                  >
                    0{s.suffix}
                  </span>
                  <span className="t-label" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Currently building */}
            <p className="t-label" style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>CURRENTLY BUILDING</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {currentlyBuilding.map((name) => (
                <span
                  key={name}
                  className="tech-pill t-label"
                  style={{
                    background: 'var(--black)', color: 'var(--text-inverse)',
                    padding: '6px 12px', borderRadius: 2,
                    transition: 'background 0.2s ease, color 0.2s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--accent)'; el.style.color = 'var(--black)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--black)'; el.style.color = 'var(--text-inverse)' }}
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
