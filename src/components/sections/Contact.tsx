'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'
import { person } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const el     = sectionRef.current
    const lines  = el.querySelectorAll('[data-line]')
    const extras = el.querySelectorAll('[data-extra]')
    const label  = el.querySelector('.section-label')
    const rule   = el.querySelector('.contact-rule')

    const ctx = gsap.context(() => {
      /* Section label */
      if (label) gsap.fromTo(label,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.15em', duration: 0.6, ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 20%' } }
      )

      /* Horizontal rule sweep before words */
      if (rule) gsap.fromTo(rule,
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 0.6, ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 78%', end: 'top 20%' } }
      )

      /* Headline clip reveal — 0.1s after rule */
      gsap.fromTo(lines,
        { y: '105%' },
        { y: '0%', duration: DUR_MID, ease: EASE_OUT, stagger: 0.08, delay: 0.1,
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 20%' } }
      )

      /* Extra items */
      gsap.fromTo(extras,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: DUR_MID, ease: EASE_OUT, stagger: 0.08, delay: 0.35,
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 20%' } }
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
      style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--section-v) var(--gutter)', position: 'relative' }}
    >
      <p data-extra className="t-label section-label" style={{ color: 'var(--accent)', marginBottom: 32 }}>
        GET IN TOUCH
      </p>

      {/* Sweep rule */}
      <div className="contact-rule" style={{ height: 1, background: 'var(--accent)', marginBottom: 32, width: '100%' }} />

      <div style={{ marginBottom: 48 }}>
        {['Open to', 'opportunities.'].map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <span data-line className="t-title" style={{ display: 'block', color: 'var(--text-inverse)', lineHeight: 1.05 }}>
              {line}
            </span>
          </div>
        ))}
      </div>

      <div data-extra style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
        <button
          onClick={copyEmail}
          className="t-lead underline-sweep"
          style={{
            background: 'none', border: 'none',
            color: copied ? 'var(--text-inverse)' : 'var(--text-secondary)',
            cursor: 'none', textAlign: 'left',
            transition: 'color 0.3s', fontWeight: 500, padding: 0,
          }}
          data-cursor="highlight"
        >
          <span style={{ transition: 'transform 0.25s var(--ease-out), opacity 0.25s ease', display: 'inline-block' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translate(3px,-3px)'; el.style.color = 'var(--accent)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.color = '' }}
          >↗</span>{' '}
          {copied ? 'Copied! ✓' : person.email}
        </button>

        <a
          href={person.githubUrl}
          target="_blank" rel="noopener noreferrer"
          className="t-lead underline-sweep"
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
        >
          <span style={{ transition: 'transform 0.25s var(--ease-out)', display: 'inline-block' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(3px,-3px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
          >↗</span>{' '}
          {person.github}
        </a>

        <a
          href="/resume.pdf"
          download="Prusotam_Kumar_Yadav_Resume.pdf"
          target="_blank" rel="noopener noreferrer"
          className="underline-sweep"
          data-cursor="highlight"
          style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', fontSize: 12, color: 'rgba(248,245,240,0.6)', textDecoration: 'none', transition: 'color 0.25s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-inverse)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(248,245,240,0.6)' }}
        >
          ↓ Download Resume
        </a>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px var(--gutter)', borderTop: '1px solid var(--line-dark)', display: 'flex', justifyContent: 'space-between' }}>
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
