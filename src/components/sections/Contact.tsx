'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { person } from '@/lib/data'
import MagneticButton from '@/components/ui/MagneticButton'
import { Mail, Send } from 'lucide-react'

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
  </svg>
)

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(headlineRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      // Animate form out, success in
      gsap.to(formRef.current, { opacity: 0, y: -20, duration: 0.4, onComplete: () => {
        if (formRef.current) formRef.current.style.display = 'none'
        if (successRef.current) {
          successRef.current.style.display = 'flex'
          gsap.fromTo(successRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
        }
      }})
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">

          {/* Left — Headline */}
          <div>
            <h2
              ref={headlineRef}
              style={{
                fontSize: 'clamp(64px, 10vw, 128px)',
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              Let&apos;s
              <br />
              <span className="gradient-text">Talk.</span>
            </h2>

            <p
              className="mt-8 text-base leading-relaxed max-w-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Have a project in mind? Open to fullstack, frontend, or backend roles.
            </p>

            <div className="flex flex-col gap-3 mt-8">
              <a
                href={`mailto:${person.email}`}
                className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--accent)] group w-fit"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Mail size={14} />
                <span className="relative">
                  {person.email}
                  <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: 'var(--accent)' }} />
                </span>
              </a>
              <a
                href={person.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--accent)] group w-fit"
                style={{ color: 'var(--text-secondary)' }}
              >
                <GithubIcon />
                <span className="relative">
                  github.com/prusotamkrydv78
                  <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: 'var(--accent)' }} />
                </span>
              </a>
            </div>
          </div>

          {/* Right — Form */}
          <div className="relative">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <label className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}>Name</label>
                <input
                  className="form-input"
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}>Email</label>
                <input
                  className="form-input"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}>Message</label>
                <textarea
                  className="form-input resize-none"
                  rows={5}
                  required
                  placeholder="What's on your mind?"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>

              {status === 'error' && (
                <p className="text-sm" style={{ color: '#ff5f57' }}>
                  Something went wrong. Try emailing directly.
                </p>
              )}

              <MagneticButton
                type="submit"
                className="flex items-center gap-3 px-8 py-4 rounded-sm text-sm font-medium self-start"
                style={{
                  background: status === 'sending' ? 'var(--accent-dim)' : 'var(--accent)',
                  color: '#080808',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  cursor: status === 'sending' ? 'wait' : 'pointer',
                }}
              >
                <Send size={14} />
                {status === 'sending' ? 'Sending...' : 'Send Message →'}
              </MagneticButton>
            </form>

            {/* Success state */}
            <div
              ref={successRef}
              className="absolute inset-0 flex-col items-start justify-center gap-4"
              style={{ display: 'none' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
                <span style={{ color: 'var(--accent)', fontSize: '20px' }}>✓</span>
              </div>
              <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Message sent.
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                I'll get back to you soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
