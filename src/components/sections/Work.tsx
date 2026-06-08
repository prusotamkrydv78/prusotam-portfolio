'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT } from '@/lib/animations'
import ProjectRow from '@/components/ui/HoverProject'
import { projects } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const rows = sectionRef.current.querySelectorAll('[data-row]')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: EASE_OUT, stagger: 0.06,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{
        background: 'var(--white)',
        paddingTop: 'var(--section-v)',
        paddingBottom: 'var(--section-v)',
      }}
    >
      {/* Header */}
      <div className="container" style={{ marginBottom: 64 }}>
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          WORK
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h2 className="t-title" style={{ color: 'var(--text-primary)' }}>
            Selected<br />Work
          </h2>
          <span className="t-label" style={{ color: 'var(--text-secondary)' }}>
            {String(projects.length).padStart(2, '0')} projects
          </span>
        </div>
      </div>

      {/* Section rule */}
      <div className="container"><div className="section-rule" /></div>

      {/* Rows */}
      <div>
        {projects.map((p, i) => (
          <div key={p.index} data-row>
            <ProjectRow
              index={p.index}
              title={p.title}
              year={p.year}
              tags={p.tags}
              panel={p.panel}
              github={p.github}
              live={p.live}
              isLast={i === projects.length - 1}
            />
          </div>
        ))}
      </div>

      {/* View all */}
      <div className="container" style={{ marginTop: 48 }}>
        <a
          href="https://github.com/prusotamkrydv78"
          target="_blank"
          rel="noopener noreferrer"
          className="t-meta underline-sweep"
          style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
        >
          → View all projects on GitHub
        </a>
      </div>
    </section>
  )
}
