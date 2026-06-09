'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    number: '01',
    title: 'Understand',
    body: 'Before writing code, understand the problem. What does success actually look like? Who uses this? What breaks first under load?',
  },
  {
    number: '02',
    title: 'Architect',
    body: 'Choose the right structure before building. Database schema, API design, component hierarchy. Decisions made early are hardest to change later.',
  },
  {
    number: '03',
    title: 'Build',
    body: "Write clean, typed code. TypeScript everywhere. Commit often. Test what matters. Ship when it works, not when it's perfect.",
  },
  {
    number: '04',
    title: 'Refine',
    body: 'Performance audit. Accessibility check. Animation pass. The 20% of work that creates 80% of the impression.',
  },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const numRefs    = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return
    const el     = sectionRef.current
    const lines  = el.querySelectorAll('[data-line]')
    const label  = el.querySelector('.section-label')
    const titles = el.querySelectorAll('[data-title]')
    const bodies = el.querySelectorAll('[data-body]')

    const ctx = gsap.context(() => {
      /* Section label */
      if (label) gsap.fromTo(label,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.15em', duration: 0.6, ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 20%' } }
      )

      /* Headline */
      gsap.fromTo(lines,
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, duration: DUR_MID, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 78%', end: 'top 15%' } }
      )

      /* Step titles */
      gsap.fromTo(titles,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: DUR_MID, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 65%', end: 'top 15%' }, delay: 0.3 }
      )

      /* Step bodies */
      gsap.fromTo(bodies,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: DUR_MID, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 65%', end: 'top 15%' }, delay: 0.45 }
      )

      /* Numbers — flicker then count up */
      STEPS.forEach((_, i) => {
        const numEl = numRefs.current[i]
        if (!numEl) return
        const target = i + 1
        const obj    = { val: 0 }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 65%', end: 'top 15%' },
        })
        tl.to(numEl, { opacity: 0.2, duration: 0.08, yoyo: true, repeat: 3, ease: 'none' })
        tl.to(obj, {
          val: target, duration: 0.6, ease: 'power2.out',
          onUpdate() { numEl.textContent = String(Math.floor(obj.val)).padStart(2, '0') },
          onComplete() { numEl.textContent = String(target).padStart(2, '0') },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="process"
      ref={sectionRef}
      style={{ background: 'var(--black)', paddingTop: 'var(--section-v)', paddingBottom: 'var(--section-v)' }}
    >
      <style>{`
        .process-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: 64px;
        }
        @media (max-width: 860px) {
          .process-steps { grid-template-columns: repeat(2, 1fr); }
          .process-step:nth-child(odd) { border-left: none !important; }
          .process-step:nth-child(n+3) { border-top: 1px solid var(--line-dark); padding-top: 40px; }
        }
        @media (max-width: 520px) {
          .process-steps { grid-template-columns: 1fr; }
          .process-step { border-left: none !important; border-top: 1px solid var(--line-dark); padding-top: 32px; padding-left: 0 !important; }
          .process-step:first-child { border-top: none; }
        }
        .process-step { cursor: default; }
        .process-step:hover [data-title] { transform: translateX(6px); color: var(--accent) !important; }
        .process-step:hover [data-body]  { opacity: 1 !important; }
        [data-title], [data-body] { transition: transform 0.3s var(--ease-out), color 0.3s ease, opacity 0.25s ease; }
      `}</style>

      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--accent)', marginBottom: 48 }}>
          PROCESS
        </p>

        <h2>
          {['How I', 'approach it.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span data-line className="t-title" style={{ display: 'block', color: 'var(--text-inverse)' }}>
                {line}
              </span>
            </div>
          ))}
        </h2>

        <div className="process-steps">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="process-step"
              style={{ padding: '0 0 0 40px', borderLeft: i > 0 ? '1px solid var(--line-dark)' : 'none' }}
            >
              <span
                ref={(el) => { numRefs.current[i] = el }}
                style={{
                  fontFamily: 'var(--font-mono),"JetBrains Mono",monospace',
                  fontSize: 'clamp(32px,4vw,48px)', fontWeight: 400,
                  color: 'var(--accent)', display: 'block', lineHeight: 1, marginBottom: 20,
                }}
              >
                00
              </span>
              <h3 data-title style={{
                fontFamily: 'var(--font-display),Syne,sans-serif',
                fontWeight: 600, fontSize: 18, lineHeight: 1.2,
                color: 'var(--text-inverse)', marginBottom: 12,
              }}>
                {step.title}
              </h3>
              <p data-body style={{
                fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif',
                fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', opacity: 0.7,
              }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
