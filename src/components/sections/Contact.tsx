'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticEl from '@/components/ui/MagneticEl'
import { meta } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const lines  = sectionRef.current.querySelectorAll('[data-line]')
    const extras = sectionRef.current.querySelectorAll('[data-extra]')

    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { y: '105%', opacity: 0 },
          {
            y: '0%', opacity: 1,
            duration: 0.9, ease: 'expo.out', delay: i * 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
          }
        )
      })
      gsap.fromTo(
        extras,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.6, ease: 'expo.out', stagger: 0.08, delay: 0.4,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const copyEmail = () => {
    navigator.clipboard.writeText(meta.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative grid-overlay"
      style={{
        background: 'var(--bg-invert)',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
        paddingLeft: 'var(--gutter)',
        paddingRight: 'var(--gutter)',
        textAlign: 'center',
      }}
    >
      {/* Label */}
      <p
        style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: 'var(--type-micro)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--ink-muted)',
          marginBottom: '2rem',
        }}
      >
        LET&apos;S BUILD /
      </p>

      {/* Headline */}
      <div className="mb-14">
        <div style={{ overflow: 'hidden' }}>
          <span
            data-line
            style={{
              display: 'block',
              fontFamily: 'var(--font-syne), sans-serif',
              fontWeight: 800,
              fontSize: 'var(--type-display)',
              letterSpacing: '-0.03em',
              color: 'var(--ink-invert)',
              lineHeight: 0.92,
            }}
          >
            Have an idea?
          </span>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <span
            data-line
            style={{
              display: 'block',
              fontFamily: 'var(--font-syne), sans-serif',
              fontWeight: 800,
              fontSize: 'var(--type-display)',
              letterSpacing: '-0.03em',
              color: 'var(--accent)',
              lineHeight: 0.92,
            }}
          >
            Let&apos;s make it.
          </span>
        </div>
      </div>

      {/* Email */}
      <MagneticEl>
        <button
          data-extra
          onClick={copyEmail}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'none',
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: 'clamp(14px, 1.8vw, 20px)',
            color: copied ? 'var(--accent)' : 'var(--ink-invert)',
            marginBottom: '1rem',
            display: 'block',
            transition: 'color 0.3s',
          }}
          className="underline-sweep"
        >
          {copied ? 'COPIED ✓' : meta.email}
        </button>
      </MagneticEl>

      {/* GitHub */}
      <MagneticEl>
        <a
          data-extra
          href={meta.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: 'clamp(14px, 1.8vw, 20px)',
            color: 'var(--ink-invert)',
            textDecoration: 'none',
            display: 'block',
          }}
          className="underline-sweep"
        >
          github.com/prusotamkrydv78
        </a>
      </MagneticEl>

      {/* Availability */}
      <p
        data-extra
        style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: 'var(--type-micro)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--ink-muted)',
          marginTop: '3rem',
        }}
      >
        CURRENTLY OPEN FOR FREELANCE AND FULL-TIME ROLES
      </p>
    </section>
  )
}
