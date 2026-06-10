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
  const rightRef   = useRef<HTMLDivElement>(null)
  const statRefs   = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return
    const el    = sectionRef.current
    const right = rightRef.current

    const label      = el.querySelector<HTMLElement>('.section-label')
    const lines      = el.querySelectorAll<HTMLElement>('[data-line]')
    const descWords  = el.querySelectorAll<HTMLElement>('[data-desc-word]')
    const links      = el.querySelectorAll<HTMLElement>('[data-link]')
    const boxes      = right?.querySelectorAll<HTMLElement>('.stat-box') ?? []
    const statLabels = right?.querySelectorAll<HTMLElement>('[data-stat-label]') ?? []
    const buildLabel = right?.querySelector<HTMLElement>('[data-build-label]')
    const pills      = right?.querySelectorAll<HTMLElement>('.tech-pill') ?? []

    const ctx = gsap.context(() => {

      /* ── Section label: letterSpacing expand ── */
      if (label) gsap.fromTo(label,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.15em', ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 58%', scrub: 1 } }
      )

      /* ── Bio headline: each line clips up from overflow:hidden ── */
      gsap.fromTo(lines,
        { y: '108%' },
        { y: '0%', ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'center 72%', scrub: 1 } }
      )

      /* ── Description: word-by-word cascade up ── */
      if (descWords.length) gsap.fromTo(descWords,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, ease: EASE_OUT, stagger: 0.018,
          scrollTrigger: { trigger: el, start: 'top 76%', end: 'center 64%', scrub: 1 } }
      )

      /* ── Links: slide in from left ── */
      if (links.length) gsap.fromTo(links,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 70%', end: 'center 60%', scrub: 1 } }
      )

      /* ── Stat boxes: rise + scale in ── */
      if (boxes.length) gsap.fromTo(boxes,
        { y: 28, opacity: 0, scale: 0.93 },
        { y: 0, opacity: 1, scale: 1, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: right, start: 'top 85%', end: 'center 68%', scrub: 1 } }
      )

      /* ── Stat numbers: scale pop + count-up ── */
      stats.forEach((s, i) => {
        const numEl = statRefs.current[i]
        if (!numEl) return
        const obj = { val: 0 }

        gsap.fromTo(numEl,
          { scale: 1.45, opacity: 0 },
          { scale: 1, opacity: 1, ease: EASE_OUT,
            scrollTrigger: { trigger: right, start: 'top 85%', end: 'center 68%', scrub: 1 } }
        )

        gsap.to(obj, {
          val: s.value, ease: 'none',
          onUpdate() { numEl.textContent = Math.round(obj.val) + s.suffix },
          onComplete() { numEl.textContent = s.value + s.suffix },
          scrollTrigger: { trigger: right, start: 'top 65%', end: 'center 65%', scrub: 1 },
        })
      })

      /* ── Stat labels: fade up after boxes ── */
      if (statLabels.length) gsap.fromTo(statLabels,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, ease: EASE_OUT, stagger: 0.08,
          scrollTrigger: { trigger: right, start: 'top 80%', end: 'center 65%', scrub: 1 } }
      )

      /* ── "Currently Building" label: slide + letterSpacing ── */
      if (buildLabel) gsap.fromTo(buildLabel,
        { opacity: 0, x: -14, letterSpacing: '0em' },
        { opacity: 1, x: 0, letterSpacing: '0.1em', ease: EASE_OUT,
          scrollTrigger: { trigger: right, start: 'top 75%', end: 'center 62%', scrub: 1 } }
      )

      /* ── Tech pills: stagger pop from below ── */
      if (pills.length) gsap.fromTo(pills,
        { opacity: 0, y: 14, scale: 0.82 },
        { opacity: 1, y: 0, scale: 1, ease: EASE_OUT, stagger: 0.06,
          scrollTrigger: { trigger: right, start: 'top 70%', end: 'center 58%', scrub: 1 } }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const descText = `${person.role} based in ${person.location}. Focused on shipping full-stack products — web, mobile, and real-time.`

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ background: 'var(--surface-1)', paddingTop: 'var(--section-v)', paddingBottom: 'var(--section-v)' }}
    >
      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 48 }}>
          [ABOUT]
        </p>

        <div className="grid-12" style={{ alignItems: 'start' }}>

          {/* ── Left col 1–5 ── */}
          <div style={{ gridColumn: '1 / 6' }}>

            {/* Bio headline */}
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

            {/* Description — word-by-word reveal */}
            <p style={{
              fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif',
              fontSize: 16, lineHeight: 1.75,
              color: 'var(--text-secondary)', maxWidth: 440, marginBottom: 32,
            }}>
              {descText.split(' ').map((word, i) => (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                  <span
                    data-desc-word=""
                    style={{ display: 'inline-block', marginRight: '0.28em' }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </p>

            {/* Links */}
            <div style={{ display: 'flex', gap: 16 }}>
              <a
                data-link
                data-cursor="highlight"
                data-cursor-color="#111111"
                href={person.githubUrl} target="_blank" rel="noopener noreferrer"
                className="t-label underline-sweep"
                style={{ color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
              >↗ GITHUB</a>
              <a
                data-link
                data-cursor="highlight"
                data-cursor-color="#111111"
                href={`mailto:${person.email}`}
                className="t-label underline-sweep"
                style={{ color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
              >↗ EMAIL</a>
            </div>
          </div>

          {/* ── Right col 7–12 ── */}
          <div ref={rightRef} style={{ gridColumn: '7 / 13' }}>

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
                    style={{
                      fontFamily: 'var(--font-display),Syne,sans-serif',
                      fontWeight: 700, fontSize: 'clamp(28px,3vw,40px)',
                      lineHeight: 1, color: 'var(--text-primary)',
                      display: 'block', marginBottom: 6,
                      transformOrigin: 'left center',
                    }}
                  >
                    0{s.suffix}
                  </span>
                  <span data-stat-label className="t-label" style={{ color: 'var(--text-secondary)' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Currently Building */}
            <p
              data-build-label
              className="t-label"
              style={{ color: 'var(--text-secondary)', marginBottom: 12 }}
            >
              CURRENTLY BUILDING
            </p>
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
                  onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.background = 'var(--accent)'; t.style.color = 'var(--black)' }}
                  onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.background = 'var(--black)'; t.style.color = 'var(--text-inverse)' }}
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
