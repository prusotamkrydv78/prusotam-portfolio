'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, EASE_OUT } from '@/lib/animations'
import { person } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formState, setFormState] = useState({ name: '', email: '', message: '', company: '' })

  useEffect(() => {
    if (!sectionRef.current) return
    const el    = sectionRef.current
    const label = el.querySelector<HTMLElement>('.section-label')
    const rule  = el.querySelector<HTMLElement>('.contact-rule')
    const chars = el.querySelectorAll<HTMLElement>('[data-char]')
    const infos = el.querySelectorAll<HTMLElement>('[data-info]')
    const formEl = el.querySelector<HTMLElement>('[data-form]')

    const ctx = gsap.context(() => {

      /* ── Section label: letterSpacing expand ── */
      if (label) gsap.fromTo(label,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.15em', ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 1 } }
      )

      /* ── Rule: sweep from left ── */
      if (rule) gsap.fromTo(rule,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'top 55%', scrub: 1 } }
      )

      /* ── Headline: char-by-char slide up ── */
      if (chars.length) gsap.fromTo(chars,
        { y: '115%' },
        { y: '0%', ease: EASE_OUT, stagger: 0.018,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'center 70%', scrub: 1 } }
      )

      /* ── Info links: stagger from left ── */
      if (infos.length) gsap.fromTo(infos,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 72%', end: 'center 62%', scrub: 1 } }
      )

      /* ── Form: slide up from below ── */
      if (formEl) gsap.fromTo(formEl,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 70%', end: 'center 60%', scrub: 1 } }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const copyEmail = () => {
    navigator.clipboard.writeText(person.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-grid-bg"
      style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--section-v) var(--gutter)', position: 'relative' }}
    >
      <div className="container">
        <p data-extra className="t-label section-label" style={{ color: 'var(--accent)', marginBottom: 32 }}>
          GET IN TOUCH
        </p>

        {/* Sweep rule */}
        <div className="contact-rule" style={{ height: 1, background: 'var(--accent)', marginBottom: 56, width: '100%' }} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Info & Links */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div style={{ marginBottom: 32 }}>
                {['Open to', 'opportunities.'].map((line, li) => (
                  <div key={li} className="t-title" style={{ display: 'block', color: 'var(--text-inverse)', lineHeight: 1.05 }}>
                    {line.split('').map((char, ci) =>
                      char === ' '
                        ? <span key={ci} style={{ display: 'inline-block' }}>{' '}</span>
                        : (
                          <span key={ci} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                            <span data-char style={{ display: 'inline-block' }}>{char}</span>
                          </span>
                        )
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
                <div data-info style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="t-label" style={{ color: 'var(--text-secondary)', fontSize: 9 }}>01 / EMAIL</span>
                  <button
                    onClick={copyEmail}
                    className="t-lead underline-sweep"
                    style={{
                      background: 'none', border: 'none',
                      color: copied ? 'var(--text-inverse)' : 'var(--text-secondary)',
                      cursor: 'none', textAlign: 'left', display: 'inline-block', width: 'fit-content',
                      transition: 'color 0.3s', fontWeight: 500, padding: 0,
                    }}
                    data-cursor="highlight"
                    data-cursor-color="#F8F5F0"
                  >
                    <span style={{ transition: 'transform 0.25s var(--ease-out), opacity 0.25s ease', display: 'inline-block' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translate(3px,-3px)'; el.style.color = 'var(--accent)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.color = '' }}
                    >↗</span>{' '}
                    {copied ? 'Copied! ✓' : person.email}
                  </button>
                </div>

                <div data-info style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="t-label" style={{ color: 'var(--text-secondary)', fontSize: 9 }}>02 / GITHUB</span>
                  <a
                    href={person.githubUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="t-lead underline-sweep"
                    data-cursor="highlight"
                    data-cursor-color="#F8F5F0"
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, display: 'inline-block', width: 'fit-content', transition: 'color 0.3s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-inverse)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
                  >
                    <span style={{ transition: 'transform 0.25s var(--ease-out), color 0.25s ease', display: 'inline-block' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translate(3px,-3px)'; el.style.color = 'var(--accent)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.color = '' }}
                    >↗</span>{' '}
                    {person.github}
                  </a>
                </div>

                <div data-info style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="t-label" style={{ color: 'var(--text-secondary)', fontSize: 9 }}>03 / RESUME</span>
                  <a
                    href="/resume.pdf"
                    download="Prusotam_Kumar_Yadav_Resume.pdf"
                    target="_blank" rel="noopener noreferrer"
                    className="underline-sweep"
                    data-cursor="highlight"
                    data-cursor-color="#F8F5F0"
                    style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', fontSize: 12, color: 'rgba(248,245,240,0.6)', textDecoration: 'none', transition: 'color 0.25s ease', display: 'inline-block', width: 'fit-content' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-inverse)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(248,245,240,0.6)' }}
                  >
                    ↓ Download Resume
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7" data-form>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {status === 'success' ? (
                <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p className="t-heading" style={{ color: 'var(--accent)' }}>MESSAGE SENT SUCCESSFULLY</p>
                  <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
                    Thank you for reaching out, {formState.name}. I received your message and will get back to you as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle')
                      setFormState({ name: '', email: '', message: '', company: '' })
                    }}
                    className="t-label underline-sweep"
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'none', width: 'fit-content', padding: 0 }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  {/* Honeypot — hidden from humans, bots fill it and get silently dropped */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={formState.company}
                    onChange={e => setFormState(prev => ({ ...prev, company: e.target.value }))}
                    style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                  />

                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label htmlFor="form-name" className="t-label" style={{ color: 'rgba(248,245,240,0.4)', fontSize: 10 }}>01 / WHAT IS YOUR NAME?</label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formState.name}
                      onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                      disabled={status === 'loading'}
                      style={{
                        background: 'none',
                        border: 'none',
                        borderBottom: '1px solid rgba(248,245,240,0.15)',
                        padding: '8px 0 16px',
                        color: 'var(--text-inverse)',
                        fontSize: 18,
                        fontFamily: 'var(--font-cabinet), sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                      }}
                      onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderBottomColor = 'rgba(248,245,240,0.15)'}
                    />
                  </div>

                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label htmlFor="form-email" className="t-label" style={{ color: 'rgba(248,245,240,0.4)', fontSize: 10 }}>02 / WHAT IS YOUR EMAIL?</label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formState.email}
                      onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                      disabled={status === 'loading'}
                      style={{
                        background: 'none',
                        border: 'none',
                        borderBottom: '1px solid rgba(248,245,240,0.15)',
                        padding: '8px 0 16px',
                        color: 'var(--text-inverse)',
                        fontSize: 18,
                        fontFamily: 'var(--font-cabinet), sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                      }}
                      onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderBottomColor = 'rgba(248,245,240,0.15)'}
                    />
                  </div>

                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label htmlFor="form-message" className="t-label" style={{ color: 'rgba(248,245,240,0.4)', fontSize: 10 }}>03 / YOUR MESSAGE</label>
                    <textarea
                      id="form-message"
                      required
                      rows={4}
                      placeholder="Hello, I want to collaborate on..."
                      value={formState.message}
                      onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
                      disabled={status === 'loading'}
                      style={{
                        background: 'none',
                        border: 'none',
                        borderBottom: '1px solid rgba(248,245,240,0.15)',
                        padding: '8px 0 16px',
                        color: 'var(--text-inverse)',
                        fontSize: 18,
                        fontFamily: 'var(--font-cabinet), sans-serif',
                        outline: 'none',
                        resize: 'none',
                        transition: 'border-color 0.3s ease',
                      }}
                      onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderBottomColor = 'rgba(248,245,240,0.15)'}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="t-meta" style={{ color: 'var(--accent)' }}>
                      Failed to send message. Please copy my email instead.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="t-label"
                    data-cursor="highlight"
                    data-cursor-color="#F8F5F0"
                    style={{
                      background: 'none',
                      border: '1px solid var(--accent)',
                      color: 'var(--accent)',
                      padding: '16px 32px',
                      cursor: 'none',
                      width: 'fit-content',
                      marginTop: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
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
