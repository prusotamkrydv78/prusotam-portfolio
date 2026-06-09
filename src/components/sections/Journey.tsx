'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'
import { InteractiveHoverLinks, type HoverLinkItem } from '@/components/ui/interactive-hover-links'

gsap.registerPlugin(ScrollTrigger)

const JOURNEY_LINKS: HoverLinkItem[] = [
  {
    heading:    'Full Stack Developer',
    subheading: '2026 — Present · TypeScript · React · Node.js · ASP.NET Core — shipping production apps',
    imgSrc:     'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    href:       '#work',
  },
  {
    heading:    'Full Stack Transition',
    subheading: '2024 — 2025 · Real-time apps, REST APIs, mobile — 391+ GitHub contributions',
    imgSrc:     'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    href:       'https://github.com/prusotamkrydv78',
  },
  {
    heading:    'Started Coding',
    subheading: '2023 · First line of JavaScript — React in 3 months, full stack in 12',
    imgSrc:     'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    href:       'https://github.com/prusotamkrydv78',
  },
  {
    heading:    'Computer Science',
    subheading: '[Year] · [Degree / College Name] — CS / IT foundation',
    imgSrc:     'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    href:       '#',
  },
]

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const lines = sectionRef.current.querySelectorAll('[data-line]')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: '105%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: DUR_MID, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      style={{
        background:    'var(--white)',
        paddingTop:    'var(--section-v)',
        paddingBottom: 'var(--section-v)',
      }}
    >
      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 48 }}>
          JOURNEY
        </p>

        <h2 style={{ marginBottom: 64 }}>
          {['The path', 'here.'].map((line, i) => (
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

        <InteractiveHoverLinks links={JOURNEY_LINKS} />
      </div>
    </section>
  )
}
