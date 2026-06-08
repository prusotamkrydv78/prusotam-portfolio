'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { person } from '@/lib/data'
import { Mail } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const numRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Text line reveals
      const lines = textRef.current?.querySelectorAll('p, .link-item')
      if (lines) {
        gsap.fromTo(lines,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: textRef.current, start: 'top 75%' },
          }
        )
      }

      // Section number
      gsap.fromTo(numRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )

      // Stat counters
      const stats = [
        { el: '#stat-years-code', target: person.stats.yearsCode },
        { el: '#stat-years-fs', target: person.stats.yearsFullstack },
        { el: '#stat-projects', target: person.stats.projects },
        { el: '#stat-repos', target: person.stats.repos },
      ]

      stats.forEach(({ el, target }) => {
        const element = document.querySelector(el)
        if (!element) return
        const obj = { val: 0 }
        gsap.fromTo(obj,
          { val: 0 },
          {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => { element.textContent = Math.round(obj.val) + '+' },
            scrollTrigger: { trigger: statsRef.current, start: 'top 80%', once: true },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-12 md:gap-20">

          {/* Section number */}
          <div ref={numRef} className="hidden md:flex items-start pt-2">
            <span
              className="select-none"
              style={{
                fontSize: '120px',
                lineHeight: 1,
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontWeight: 700,
              }}
            >
              02
            </span>
          </div>

          {/* Content */}
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-6"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace' }}
            >
              — About —
            </p>

            <h2
              className="mb-8"
              style={{
                fontSize: 'clamp(28px, 4vw, 52px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
              }}
            >
              {person.name}
            </h2>

            <div ref={textRef} className="max-w-xl flex flex-col gap-5">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '17px' }}>
                Full Stack Developer based in India. I've been writing code since 2023 and have built
                production-grade apps across the entire stack — from pixel-polished React UIs to
                ASP.NET APIs and real-time systems.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '17px' }}>
                My work spans web, mobile (React Native), and cross-platform systems. I care about
                the intersection of clean architecture and thoughtful UI — software should work
                beautifully, not just correctly.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '17px' }}>
                When I'm not writing code, I'm probably reading architecture docs or picking apart
                how other people's interfaces work.
              </p>

              <div className="flex flex-col gap-2 mt-2">
                <a
                  href={person.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-item flex items-center gap-2 text-sm transition-colors hover:text-[var(--accent)] group w-fit"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                  <span className="relative">
                    prusotamkrydv78 ↗
                    <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: 'var(--accent)' }} />
                  </span>
                </a>
                <a
                  href={`mailto:${person.email}`}
                  className="link-item flex items-center gap-2 text-sm transition-colors hover:text-[var(--accent)] group w-fit"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Mail size={14} />
                  <span className="relative">
                    {person.email} ↗
                    <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: 'var(--accent)' }} />
                  </span>
                </a>
              </div>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              {[
                { id: 'stat-years-code', value: `${person.stats.yearsCode}+`, label: 'Years\nCoding' },
                { id: 'stat-years-fs', value: `${person.stats.yearsFullstack}+`, label: 'Years\nFullstack' },
                { id: 'stat-projects', value: `${person.stats.projects}+`, label: 'Production\nProjects' },
                { id: 'stat-repos', value: `${person.stats.repos}+`, label: 'GitHub\nRepos' },
              ].map(({ id, value, label }) => (
                <div key={id} className="flex flex-col gap-1">
                  <span
                    id={id}
                    style={{
                      fontSize: 'clamp(32px, 5vw, 48px)',
                      fontFamily: 'Georgia, serif',
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                    }}
                  >
                    {value}
                  </span>
                  <span
                    className="text-[11px] uppercase tracking-widest whitespace-pre-line"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
