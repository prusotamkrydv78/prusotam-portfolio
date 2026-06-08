'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
        { opacity: 0, x: -24 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.08,
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
      style={{ background: 'var(--bg-canvas)', paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}
    >
      {/* Header */}
      <div className="container mb-16">
        <p
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: 'var(--type-micro)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--ink-muted)',
            marginBottom: '0.5rem',
          }}
        >
          PROJECTS /
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p
              style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontWeight: 800,
                fontSize: 'var(--type-title)',
                letterSpacing: '-0.03em',
                color: 'var(--ink-primary)',
                lineHeight: 1,
              }}
            >
              SELECTED
            </p>
            <p
              style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontWeight: 800,
                fontSize: 'var(--type-title)',
                letterSpacing: '-0.03em',
                color: 'var(--ink-primary)',
                lineHeight: 1,
              }}
            >
              WORK
            </p>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: 'clamp(24px, 3vw, 48px)',
              color: 'var(--ink-muted)',
              lineHeight: 1,
            }}
          >
            ({String(projects.length).padStart(2, '0')})
          </span>
        </div>
      </div>

      {/* Project rows */}
      <div>
        {projects.map((project, index) => (
          <div key={project.id} data-row>
            <ProjectRow
              id={project.id}
              title={project.title}
              year={project.year}
              tags={project.tags}
              visual={project.visual}
              github={project.github}
              live={project.live}
              isLast={index === projects.length - 1}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
