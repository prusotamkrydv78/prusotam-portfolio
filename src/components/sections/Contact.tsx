'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'
import { person } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [copied, setCopied]   = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const lines  = sectionRef.current.querySelectorAll('[data-line]')
    const extras = sectionRef.current.querySelectorAll('[data-extra]')

    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { y: '105%' },
          {
            y: '0%',
            duration: DUR_MID, ease: EASE_OUT, delay: i * 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
          }
        )
      })
      gsap.fromTo(
        extras,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: DUR_MID, ease: EASE_OUT, stagger: 0.08, delay: 0.35,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const copyEmail = () => {
    navigator.clipboard.writeText(person.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-grid-bg"
      style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--section-v) var(--gutter)',
        position: 'relative',
      }}
    >
      {/* Label */}
      <p
        data-extra
        className="t-label section-label"
        style={{ color: 'var(--accent)', marginBottom: 32 }}
      >
        GET IN TOUCH
      </p>

      {/* Headline */}
      <div style={{ marginBottom: 48 }}>
        {['Open to', 'opportunities.'].map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <span
              data-line
              className="t-title"
              style={{ display: 'block', color: 'var(--text-inverse)', lineHeight: 1.05 }}
            >
              {line}
            </span>
          </div>
        ))}
      </div>

      {/* Links */}
      <div data-extra style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
        <button
          onClick={copyEmail}
          className="t-lead underline-sweep"
          style={{
            background: 'none', border: 'none',
            color: copied ? 'var(--text-inverse)' : 'var(--text-secondary)',
            cursor: 'none', textAlign: 'left',
            transition: 'color 0.3s',
            fontWeight: 500,
            padding: 0,
          }}
          data-cursor-copy
        >
          ↗ {copied ? 'Copied!' : person.email}
        </button>

        <a
          href={person.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="t-lead underline-sweep"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
          data-cursor-copy
        >
          ↗ {person.github}
        </a>
      </div>

      {/* Bottom row */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px var(--gutter)',
          borderTop: '1px solid var(--line-dark)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span className="t-label" style={{ color: 'var(--text-secondary)' }}>
          Available for freelance and full-time roles
        </span>
        <span className="t-label" style={{ color: 'var(--text-secondary)' }}>
          {person.location} — 2026
        </span>
      </div>
    </section>
  )
}
