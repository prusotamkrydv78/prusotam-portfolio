'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { meta, stats } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const techTags = [
  { label: 'React.js',     x: '5%',  y: '8%',  rot: -2 },
  { label: 'TypeScript',   x: '36%', y: '2%',  rot:  1 },
  { label: 'Node.js',      x: '66%', y: '10%', rot: -3 },
  { label: 'ASP.NET Core', x: '8%',  y: '36%', rot:  2 },
  { label: 'React Native', x: '46%', y: '30%', rot: -1 },
  { label: 'MongoDB',      x: '70%', y: '40%', rot:  3 },
  { label: 'Socket.IO',    x: '16%', y: '60%', rot: -2 },
  { label: 'GSAP',         x: '50%', y: '56%', rot:  1 },
  { label: 'Three.js',     x: '76%', y: '62%', rot: -3 },
  { label: 'Tailwind CSS', x: '2%',  y: '80%', rot:  2 },
  { label: 'Next.js',      x: '40%', y: '78%', rot: -1 },
  { label: 'C#',           x: '72%', y: '82%', rot:  3 },
]

const bioLines = [
  'I write code.',
  'I design systems.',
  'I obsess over the gap between the two.',
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const statRefs   = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return
    const lines = sectionRef.current.querySelectorAll<HTMLSpanElement>('[data-line]')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: '105%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: 0.9, ease: 'expo.out', stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )

      stats.forEach((s, i) => {
        const el = statRefs.current[i]
        if (!el) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: s.value,
          duration: 1.4,
          ease: 'power2.out',
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
        background: 'var(--bg-canvas)',
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      <div className="container">
        <p
          className="mb-12"
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: 'var(--type-micro)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--ink-muted)',
          }}
        >
          A / ABOUT
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-16 lg:gap-24 items-start">
          {/* Left — bio */}
          <div>
            <div className="mb-10">
              {bioLines.map((line, i) => (
                <div key={i} style={{ overflow: 'hidden', marginBottom: '0.1em' }}>
                  <span
                    data-line
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-syne), sans-serif',
                      fontWeight: 800,
                      fontSize: 'clamp(22px, 3.5vw, 44px)',
                      letterSpacing: '-0.02em',
                      color: 'var(--ink-primary)',
                      lineHeight: 1.1,
                    }}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>

            <p
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 'var(--type-body)',
                lineHeight: 1.7,
                color: 'var(--ink-secondary)',
                maxWidth: '360px',
                marginBottom: '2rem',
              }}
            >
              Full Stack Developer based in {meta.location}.<br />
              Building since 2023: React, TypeScript, Node.js, ASP.NET Core, React Native, MongoDB.
            </p>

            <div className="flex gap-6">
              <a
                href={meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-sweep"
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: 'var(--type-small)',
                  color: 'var(--ink-primary)',
                  textDecoration: 'none',
                }}
              >
                GitHub ↗
              </a>
              <a
                href={`mailto:${meta.email}`}
                className="underline-sweep"
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: 'var(--type-small)',
                  color: 'var(--ink-primary)',
                  textDecoration: 'none',
                }}
              >
                Email ↗
              </a>
            </div>
          </div>

          {/* Right — stats + tags */}
          <div className="flex flex-col gap-12">
            {/* 2×2 stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '2px',
                    padding: '20px 24px',
                  }}
                >
                  <span
                    ref={(el) => { statRefs.current[i] = el }}
                    style={{
                      fontFamily: 'var(--font-syne), sans-serif',
                      fontWeight: 800,
                      fontSize: 'clamp(28px, 4vw, 48px)',
                      color: 'var(--ink-primary)',
                      display: 'block',
                      lineHeight: 1,
                    }}
                  >
                    0{s.suffix}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: 'var(--type-micro)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--ink-muted)',
                      marginTop: '8px',
                      display: 'block',
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech tag cluster */}
            <div style={{ position: 'relative', height: '220px' }}>
              {techTags.map((tag) => (
                <span
                  key={tag.label}
                  style={{
                    position: 'absolute',
                    left: tag.x,
                    top: tag.y,
                    transform: `rotate(${tag.rot}deg)`,
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: 'var(--type-micro)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    background: 'var(--bg-invert)',
                    color: 'var(--accent)',
                    padding: '5px 10px',
                    borderRadius: '2px',
                    whiteSpace: 'nowrap',
                    cursor: 'default',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.transform = 'rotate(0deg) scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.transform = `rotate(${tag.rot}deg)`
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
