'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

const QUOTES = [
  {
    quote: "391 commits in the last 12 months. The streak doesn't lie.",
    author: 'GitHub Activity',
    meta: 'prusotamkrydv78',
  },
  {
    quote: 'Built full stack in under a year. React to ASP.NET to React Native — one developer.',
    author: 'Project Record',
    meta: '2023 → 2026',
  },
  {
    quote: '72 public repositories. Every one a decision trail.',
    author: 'Open Source',
    meta: 'github.com/prusotamkrydv78',
  },
  {
    quote: 'Real-time, mobile, serverless. Different paradigms, same developer.',
    author: 'Stack Breadth',
    meta: 'ChatX · Native Ecommerce · MongoX',
  },
]

const TICKER_ITEMS = [
  'Consistent committer',
  'MERN + .NET breadth',
  'Real-time systems',
  'TypeScript-first',
  'Production deployed',
  'Mobile + Web',
  '391+ contributions',
  '72 public repos',
  'Self-taught, production-ready',
]
const TICKER_LOOP = [...TICKER_ITEMS, ...TICKER_ITEMS]

const NUM_STYLE = {
  fontFamily: 'var(--font-display), Syne, sans-serif',
  fontWeight: 700,
  fontSize: 72,
  lineHeight: 1,
  letterSpacing: '-0.03em',
  color: 'var(--accent)',
  marginBottom: 14,
  display: 'block',
} as const

const BODY_MUTED = {
  fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
  fontSize: 14,
  lineHeight: 1.65,
  color: 'rgba(248,245,240,0.5)',
} as const

export default function Proof() {
  const sectionRef   = useRef<HTMLElement>(null)
  const quoteRef     = useRef<HTMLDivElement>(null)
  const statsRef     = useRef<HTMLDivElement>(null)
  const stat1Ref     = useRef<HTMLSpanElement>(null)
  const stat2Ref     = useRef<HTMLSpanElement>(null)
  const stat3Ref     = useRef<HTMLSpanElement>(null)
  const isAnimating  = useRef(false)
  const activeIdxRef = useRef(0)

  const [displayIdx, setDisplayIdx] = useState(0)

  useEffect(() => {
    if (!sectionRef.current || !statsRef.current) return

    const el    = sectionRef.current
    const lines = el.querySelectorAll('[data-line]')
    const label = el.querySelector('.section-label')

    const ctx = gsap.context(() => {
      /* Section label */
      if (label) gsap.fromTo(label,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.15em', duration: 0.6, ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 20%', scrub: 1 } }
      )

      /* Clip-reveal headline */
      gsap.fromTo(lines,
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, duration: DUR_MID, ease: EASE_OUT, stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 78%', end: 'top 20%', scrub: 1 } }
      )

      /* Count up: 5+ — reverses to 0 on scroll back */
      const o1 = { val: 0 }
      gsap.to(o1, {
        val: 5, duration: 1.3, ease: 'power2.out',
        onUpdate() { if (stat1Ref.current) stat1Ref.current.textContent = Math.floor(o1.val) + '+' },
        onComplete() { if (stat1Ref.current) stat1Ref.current.textContent = '5+' },
        scrollTrigger: { trigger: statsRef.current, start: 'top 82%', end: 'top 20%', scrub: 1 },
      })

      /* Count up: 3 */
      const o2 = { val: 0 }
      gsap.to(o2, {
        val: 3, duration: 0.9, ease: 'power2.out', delay: 0.15,
        onUpdate() { if (stat2Ref.current) stat2Ref.current.textContent = String(Math.floor(o2.val)) },
        onComplete() { if (stat2Ref.current) stat2Ref.current.textContent = '3' },
        scrollTrigger: { trigger: statsRef.current, start: 'top 82%', end: 'top 20%', scrub: 1 },
      })

      /* Fade in: < 1yr */
      if (stat3Ref.current) {
        gsap.fromTo(stat3Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: EASE_OUT, delay: 0.3,
            scrollTrigger: { trigger: statsRef.current, start: 'top 82%', end: 'top 20%', scrub: 1 } }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /* Quote auto-rotation every 5s */
  useEffect(() => {
    const advance = () => {
      if (isAnimating.current || !quoteRef.current) return
      isAnimating.current = true
      const next = (activeIdxRef.current + 1) % QUOTES.length

      gsap.to(quoteRef.current, {
        y: -16, opacity: 0,
        duration: 0.45, ease: 'power2.in',
        onComplete() {
          activeIdxRef.current = next
          setDisplayIdx(next)
          requestAnimationFrame(() => {
            if (!quoteRef.current) { isAnimating.current = false; return }
            gsap.fromTo(quoteRef.current,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: EASE_OUT,
                onComplete() { isAnimating.current = false } }
            )
          })
        },
      })
    }

    const timer = setInterval(advance, 5000)
    return () => clearInterval(timer)
  }, [])

  const q = QUOTES[displayIdx]

  return (
    <section
      id="proof"
      ref={sectionRef}
      style={{ background: 'var(--black)', paddingTop: 'var(--section-v)' }}
    >
      <style>{`
        @keyframes proof-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .proof-bar-fill {
          animation: proof-fill 5s linear forwards;
          transform-origin: left center;
        }
        .proof-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .proof-stat {
          padding-left: 40px;
          border-left: 1px solid var(--line-dark);
        }
        @media (max-width: 720px) {
          .proof-stats         { grid-template-columns: 1fr; }
          .proof-stat          { padding-left: 0; border-left: none;
                                  border-top: 1px solid var(--line-dark); padding-top: 40px; }
          .proof-stat-first    { border-top: none; padding-top: 0; }
        }
      `}</style>

      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--accent)', marginBottom: 48 }}>
          PROOF
        </p>

        <h2 style={{ marginBottom: 72 }}>
          {['People say', 'things.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span data-line className={`t-title ${i === 0 ? 't-title--light' : 't-title--heavy'}`} style={{ display: 'block', color: i === 0 ? 'rgba(248,245,240,0.28)' : 'var(--text-inverse)' }}>
                {line}
              </span>
            </div>
          ))}
        </h2>

        <div style={{ height: 1, background: 'var(--line-dark)', marginBottom: 56 }} />

        {/* Rotating quote */}
        <div style={{ position: 'relative', marginBottom: 40 }}>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', top: 0, left: 0,
              fontFamily: 'var(--font-display), Syne, sans-serif',
              fontWeight: 700, fontSize: 120, lineHeight: 1,
              color: 'var(--accent)', opacity: 0.25,
              userSelect: 'none', pointerEvents: 'none', zIndex: 0,
            }}
          >
            &quot;
          </span>

          <div ref={quoteRef} style={{ paddingTop: 72, position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-display), Syne, sans-serif',
              fontWeight: 600, fontSize: 'clamp(22px, 3vw, 36px)',
              lineHeight: 1.4, color: 'var(--text-inverse)',
              fontStyle: 'italic', maxWidth: 700, marginBottom: 28,
            }}>
              {q.quote}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="t-label" style={{ color: 'var(--accent)' }}>{q.author}</span>
              <span style={{ display: 'block', width: 1, height: 12, background: 'rgba(248,245,240,0.2)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono), "JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.04em', color: 'rgba(248,245,240,0.4)' }}>
                {q.meta}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bars */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 80 }}>
          {QUOTES.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: 'rgba(248,245,240,0.15)', overflow: 'hidden' }}>
              {i === displayIdx && (
                <div key={`fill-${displayIdx}`} className="proof-bar-fill"
                  style={{ width: '100%', height: '100%', background: 'var(--accent)' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--line-dark)', marginBottom: 72 }} />

        {/* Stats */}
        <div ref={statsRef} className="proof-stats" style={{ marginBottom: 80 }}>
          <div className="proof-stat-first">
            <span style={NUM_STYLE}><span ref={stat1Ref}>0+</span></span>
            <p className="t-label" style={{ color: 'rgba(248,245,240,0.6)', marginBottom: 10 }}>Technologies mastered</p>
            <p style={BODY_MUTED}>React · Node.js · TypeScript · ASP.NET Core · React Native</p>
          </div>

          <div className="proof-stat">
            <span style={NUM_STYLE}><span ref={stat2Ref}>0</span></span>
            <p className="t-label" style={{ color: 'rgba(248,245,240,0.6)', marginBottom: 10 }}>Live deployed projects</p>
            <p style={BODY_MUTED}>ChatX · MongoX · LinkMe — production deployments on Vercel</p>
          </div>

          <div className="proof-stat">
            <span style={NUM_STYLE}><span ref={stat3Ref}>{'< 1yr'}</span></span>
            <p className="t-label" style={{ color: 'rgba(248,245,240,0.6)', marginBottom: 10 }}>Frontend to full stack</p>
            <p style={BODY_MUTED}>Started coding 2023. Full stack by 2024. React Native by 2025.</p>
          </div>
        </div>
      </div>

      {/* Full-width ticker strip */}
      <div style={{ overflow: 'hidden', height: 48, background: 'var(--surface-dark)', display: 'flex', alignItems: 'center' }}>
        <div className="animate-ticker" style={{ animationDuration: '35s', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
          {TICKER_LOOP.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 24px' }}>
              <span style={{ color: 'var(--accent)', fontSize: 12, lineHeight: 1, fontFamily: 'var(--font-mono), monospace' }}>★</span>
              <span style={{ fontFamily: 'var(--font-mono), "JetBrains Mono", monospace', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(248,245,240,0.7)' }}>
                {item}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ height: 'clamp(64px, 8vw, 100px)', background: 'var(--black)' }} />
    </section>
  )
}
