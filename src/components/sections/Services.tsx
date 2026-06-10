'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    index: '01',
    title: 'Frontend Development',
    body: 'Building fast, accessible React applications with TypeScript. Component systems, animation, responsive layouts that work on every device and screen size.',
    tags: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
  },
  {
    index: '02',
    title: 'Backend & API',
    body: 'REST API design and implementation using Node.js, Express, and ASP.NET Core. JWT authentication, database integration, serverless deployment on Vercel.',
    tags: ['Node.js', 'Express', 'ASP.NET', 'MongoDB'],
  },
  {
    index: '03',
    title: 'Mobile Development',
    body: 'Cross-platform mobile apps with React Native. Shared codebase for iOS and Android. Native feel with JavaScript velocity. Customer apps and admin panels both.',
    tags: ['React Native', 'TypeScript', 'Expo'],
  },
  {
    index: '04',
    title: 'Real-Time Systems',
    body: 'WebSocket-based features with Socket.IO. Live chat, notifications, collaborative interfaces. Understanding of event-driven architecture and connection state management.',
    tags: ['Socket.IO', 'WebSocket', 'Node.js'],
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const label  = el.querySelector<HTMLElement>('.services-label')
    const lines  = el.querySelectorAll('[data-line]')
    const idxs   = el.querySelectorAll<HTMLElement>('[data-svc-idx]')
    const titles = el.querySelectorAll<HTMLElement>('[data-svc-title]')
    const bodies = el.querySelectorAll<HTMLElement>('[data-svc-body]')
    const tags   = el.querySelectorAll<HTMLElement>('[data-svc-tag]')
    const dividers = el.querySelectorAll<HTMLElement>('[data-svc-divider]')

    const ctx = gsap.context(() => {
      /* ── Section label ── */
      if (label) {
        gsap.fromTo(label,
          { opacity: 0, letterSpacing: '0em' },
          { opacity: 1, letterSpacing: '0.15em', ease: EASE_OUT,
            scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 50%', scrub: 1 } }
        )
      }

      /* ── Headline clip-reveal ── */
      gsap.fromTo(lines,
        { y: '108%', opacity: 0 },
        { y: '0%', opacity: 1, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 78%', end: 'top 20%', scrub: 1 } }
      )

      /* ── Top border lines sweep in ── */
      gsap.fromTo(dividers,
        { scaleX: 0 },
        { scaleX: 1, ease: EASE_OUT, stagger: 0.1, transformOrigin: 'left center',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', end: 'top 40%', scrub: 1 } }
      )

      /* ── Card index numbers ── */
      gsap.fromTo(idxs,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%', end: 'top 35%', scrub: 1 } }
      )

      /* ── Card titles — clip up from overflow:hidden ── */
      gsap.fromTo(titles,
        { clipPath: 'inset(0 0 100% 0)', y: 16 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, ease: EASE_OUT, stagger: 0.12,
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', end: 'top 30%', scrub: 1 } }
      )

      /* ── Card body copy ── */
      gsap.fromTo(bodies,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%', end: 'top 25%', scrub: 1 } }
      )

      /* ── Tags — staggered pop ── */
      gsap.fromTo(tags,
        { opacity: 0, y: 8, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, ease: EASE_OUT, stagger: 0.04,
          scrollTrigger: { trigger: gridRef.current, start: 'top 72%', end: 'top 20%', scrub: 1 } }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ background: 'var(--surface-1)', paddingTop: 'var(--section-v)', paddingBottom: 'var(--section-v)' }}
    >
      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .services-card:nth-child(even) { border-right: none !important; }
        }
        @media (max-width: 560px) {
          .services-grid { grid-template-columns: 1fr; }
          .services-card { border-right: none !important; }
        }
      `}</style>

      <div className="container">
        <p
          className="t-label section-label services-label"
          style={{ color: 'var(--text-secondary)', marginBottom: 48 }}
        >
          SERVICES
        </p>

        <h2 style={{ marginBottom: 64 }}>
          {['What I', 'can do.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span data-line className="t-title" style={{ display: 'block', color: 'var(--text-primary)' }}>
                {line}
              </span>
            </div>
          ))}
        </h2>

        <div ref={gridRef} className="services-grid">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.index}
              data-card
              className="services-card"
              style={{
                padding: '40px 32px',
                borderRight: i < SERVICES.length - 1 ? '1px solid var(--line)' : undefined,
                position: 'relative',
              }}
            >
              {/* Animated top border */}
              <div
                data-svc-divider
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', transformOrigin: 'left center' }}
              />

              {/* Index */}
              <span
                data-svc-idx
                className="t-meta"
                style={{ color: 'var(--accent)', display: 'block', marginBottom: 16 }}
              >
                {svc.index}
              </span>

              {/* Title */}
              <div style={{ overflow: 'hidden', marginBottom: 12 }}>
                <h3
                  data-svc-title
                  style={{
                    fontFamily: 'var(--font-display), Syne, sans-serif',
                    fontWeight: 600,
                    fontSize: 22,
                    lineHeight: 1.2,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {svc.title}
                </h3>
              </div>

              {/* Body */}
              <p
                data-svc-body
                style={{
                  fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  marginBottom: 20,
                }}
              >
                {svc.body}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {svc.tags.map((tag) => (
                  <span
                    key={tag}
                    data-svc-tag
                    className="t-label"
                    style={{
                      background: 'var(--black)',
                      color: 'var(--text-inverse)',
                      padding: '4px 8px',
                      borderRadius: 2,
                      display: 'inline-block',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
