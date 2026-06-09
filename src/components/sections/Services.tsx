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
    if (!sectionRef.current) return
    const lines = sectionRef.current.querySelectorAll('[data-line]')
    const cards = sectionRef.current.querySelectorAll('[data-card]')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: '105%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: DUR_MID, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', end: 'top 20%', scrub: 1 },
        }
      )

      gsap.from(cards, {
        opacity: 0, y: 28,
        duration: DUR_MID, ease: EASE_OUT, stagger: 0.08,
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%', end: 'top 20%', scrub: 1 },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        background: 'var(--surface-1)',
        paddingTop: 'var(--section-v)',
        paddingBottom: 'var(--section-v)',
      }}
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
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 48 }}>
          SERVICES
        </p>

        <h2 style={{ marginBottom: 64 }}>
          {['What I', 'can do.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span
                data-line
                className="t-title"
                style={{ display: 'block', color: 'var(--text-primary)' }}
              >
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
                borderTop: '1px solid var(--line)',
                borderRight: i < SERVICES.length - 1 ? '1px solid var(--line)' : undefined,
              }}
            >
              <span
                className="t-meta"
                style={{ color: 'var(--accent)', display: 'block', marginBottom: 16 }}
              >
                {svc.index}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display), Syne, sans-serif',
                  fontWeight: 600,
                  fontSize: 22,
                  lineHeight: 1.2,
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                }}
              >
                {svc.title}
              </h3>
              <p
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {svc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="t-label"
                    style={{
                      background: 'var(--black)',
                      color: 'var(--text-inverse)',
                      padding: '4px 8px',
                      borderRadius: 2,
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
