'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/lib/data'
import ProjectCard from '@/components/ui/ProjectCard'
import { ExternalLink } from 'lucide-react'

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
  </svg>
)

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      document.querySelectorAll('.project-row').forEach((row) => {
        gsap.fromTo(row,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 80%' },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between mb-20">
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace' }}
            >
              — Work —
            </p>
            <h2
              style={{
                fontSize: 'clamp(32px, 5vw, 64px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
              }}
            >
              Selected Work
            </h2>
          </div>
          <span
            className="text-sm pb-2"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            (0{projects.length} projects)
          </span>
        </div>

        <div className="divider mb-20" style={{ background: 'var(--accent)', opacity: 0.4 }} />

        {/* Project rows */}
        <div className="flex flex-col gap-24">
          {projects.map((project, i) => {
            const isEven = i % 2 === 1
            return (
              <div
                key={project.id}
                className={`project-row grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isEven ? 'md:[direction:rtl]' : ''}`}
              >
                {/* Text side */}
                <div className={`flex flex-col gap-5 ${isEven ? 'md:[direction:ltr]' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}
                    >
                      {project.id}
                    </span>
                    <span
                      className="h-px flex-1"
                      style={{ background: 'var(--border)' }}
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: 'clamp(28px, 4vw, 48px)',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="text-sm italic"
                    style={{ color: 'var(--accent)' }}
                  >
                    {project.tagline}
                  </p>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)', maxWidth: '440px' }}
                  >
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-sm"
                        style={{
                          border: '1px solid var(--border)',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-geist-mono), monospace',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-5 mt-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--accent)] group"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <GithubIcon />
                      <span className="relative">
                        GitHub ↗
                        <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: 'var(--accent)' }} />
                      </span>
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--accent)] group"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <ExternalLink size={14} />
                        <span className="relative">
                          Live ↗
                          <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: 'var(--accent)' }} />
                        </span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Code window */}
                <div className={isEven ? 'md:[direction:ltr]' : ''}>
                  <ProjectCard
                    title={project.title}
                    codeSnippet={project.codeSnippet}
                    filename={project.filename}
                    projectColor={project.color}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
