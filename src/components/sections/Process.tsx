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
    const el = sectionRef.current
    if (!el) return

    const label    = el.querySelector<HTMLElement>('.section-label')
    const lines    = el.querySelectorAll('[data-line]')
    const cards    = el.querySelectorAll<HTMLElement>('[data-card]')
    const borders  = el.querySelectorAll<HTMLElement>('[data-border]')
    const titles   = el.querySelectorAll<HTMLElement>('[data-title]')
    const bodies   = el.querySelectorAll<HTMLElement>('[data-body]')
    const stepsEl  = el.querySelector<HTMLElement>('.process-steps')

    const ctx = gsap.context(() => {

      /* ── Section label ── */
      gsap.fromTo(label,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.15em', ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 58%', scrub: 1 } }
      )

      /* ── Headline: each line clips up as a solid block ── */
      gsap.fromTo(lines,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, ease: EASE_OUT, stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 18%', scrub: 1 } }
      )

      /* ── Left borders grow downward card by card ── */
      gsap.fromTo(borders,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, ease: 'none', stagger: 0.1,
          scrollTrigger: { trigger: stepsEl, start: 'top 88%', end: 'center 70%', scrub: 1 } }
      )

      /* ── Cards slide up from below ── */
      gsap.fromTo(cards,
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, ease: EASE_OUT, stagger: 0.12,
          scrollTrigger: { trigger: stepsEl, start: 'top 88%', end: 'center 70%', scrub: 1 } }
      )

      /* ── Numbers: scale-in from large + count up ── */
      numRefs.current.forEach((numEl, i) => {
        if (!numEl) return
        const target = i + 1
        const obj    = { val: 0 }

        gsap.fromTo(numEl,
          { scale: 1.6, opacity: 0 },
          { scale: 1, opacity: 1, ease: EASE_OUT,
            scrollTrigger: { trigger: stepsEl, start: 'top 88%', end: 'center 70%', scrub: 1 } }
        )

        gsap.to(obj, {
          val: target, ease: 'none',
          onUpdate() { numEl.textContent = String(Math.floor(obj.val)).padStart(2, '0') },
          onComplete() { numEl.textContent = String(target).padStart(2, '0') },
          scrollTrigger: { trigger: stepsEl, start: 'top 95%', end: 'center 60%', scrub: 1 },
        })
      })

      /* ── Titles: clip-path reveal from below ── */
      gsap.fromTo(titles,
        { clipPath: 'inset(0 0 100% 0)', y: 12 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, ease: EASE_OUT, stagger: 0.12,
          scrollTrigger: { trigger: stepsEl, start: 'top 85%', end: 'center 65%', scrub: 1 } }
      )

      /* ── Bodies: dim → bright stagger ── */
      gsap.fromTo(bodies,
        { opacity: 0, y: 16 },
        { opacity: 0.7, y: 0, ease: EASE_OUT, stagger: 0.12,
          scrollTrigger: { trigger: stepsEl, start: 'top 82%', end: 'center 60%', scrub: 1 } }
      )

      /* ── Subtle parallax on the whole headline as you scroll past ── */
      gsap.to(el.querySelector('h2'), {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="process"
      ref={sectionRef}
      style={{ background: 'var(--black)', paddingTop: 'var(--section-v)', paddingBottom: 'var(--section-v)', overflow: 'hidden' }}
    >
      <style>{`
        .process-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: 64px;
        }
        @media (max-width: 860px) {
          .process-steps { grid-template-columns: repeat(2, 1fr); }
          .process-step:nth-child(odd) [data-border] { display: none; }
          .process-step:nth-child(n+3) { padding-top: 40px; }
        }
        @media (max-width: 520px) {
          .process-steps { grid-template-columns: 1fr; }
          .process-step [data-border] { display: none; }
          .process-step { padding-left: 0 !important; padding-top: 32px; }
          .process-step:first-child { padding-top: 0; }
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
              data-card
              className="process-step"
              style={{ padding: '0 0 0 40px', position: 'relative' }}
            >
              {/* Animated left border */}
              {i > 0 && (
                <div
                  data-border
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: 1, height: '100%',
                    background: 'var(--line-dark)',
                    transformOrigin: 'top center',
                  }}
                />
              )}

              {/* Number */}
              <span
                ref={el => { numRefs.current[i] = el }}
                style={{
                  fontFamily: 'var(--font-mono),"JetBrains Mono",monospace',
                  fontSize: 'clamp(32px,4vw,48px)', fontWeight: 400,
                  color: 'var(--accent)', display: 'block',
                  lineHeight: 1, marginBottom: 20,
                  transformOrigin: 'left center',
                }}
              >
                00
              </span>

              {/* Title */}
              <div style={{ overflow: 'hidden', marginBottom: 12 }}>
                <h3
                  data-title
                  style={{
                    fontFamily: 'var(--font-display),Syne,sans-serif',
                    fontWeight: 600, fontSize: 18, lineHeight: 1.2,
                    color: 'var(--text-inverse)', margin: 0,
                  }}
                >
                  {step.title}
                </h3>
              </div>

              {/* Body */}
              <p
                data-body
                style={{
                  fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif',
                  fontSize: 14, lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  opacity: 0,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
