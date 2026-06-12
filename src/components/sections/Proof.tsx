'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, EASE_OUT } from '@/lib/animations'

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

const NUM_STYLE = {
  fontFamily: 'var(--font-display), Syne, sans-serif',
  fontWeight: 700,
  fontSize: 72,
  lineHeight: 1,
  letterSpacing: '-0.03em',
  color: 'var(--accent)',
  marginBottom: 14,
  display: 'block',
  transformOrigin: 'left center',
} as const

const BODY_MUTED = {
  fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
  fontSize: 14,
  lineHeight: 1.65,
  color: 'rgba(248,245,240,0.5)',
} as const

/* Word-split component for stat body text */
function BodyWords({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span data-stat-word="" style={{ display: 'inline-block', marginRight: '0.3em' }}>{word}</span>
        </span>
      ))}
    </>
  )
}

/* Per-word spans for the rotating quote */
function QuoteWords({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          data-quote-word=""
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </span>
      ))}
    </>
  )
}

const HEADLINE = ['People say', 'things.']

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
    const el = sectionRef.current

    const label      = el.querySelector<HTMLElement>('.section-label')
    const chars      = el.querySelectorAll<HTMLElement>('[data-char]')
    const dividers   = el.querySelectorAll<HTMLElement>('[data-divider]')
    const statBlocks = el.querySelectorAll<HTMLElement>('.proof-stat, .proof-stat-first')
    const statLabels = el.querySelectorAll<HTMLElement>('[data-stat-label]')
    const statWords  = el.querySelectorAll<HTMLElement>('[data-stat-word]')

    const ctx = gsap.context(() => {

      /* ── Section label: letterSpacing expand ── */
      if (label) gsap.fromTo(label,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.15em', ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 1 } }
      )

      /* ── Headline: character-by-character clip slide up ── */
      if (chars.length) gsap.fromTo(chars,
        { y: '115%' },
        { y: '0%', ease: EASE_OUT, stagger: 0.022,
          scrollTrigger: { trigger: el, start: 'top 84%', end: 'center 70%', scrub: 1 } }
      )

      /* ── Horizontal divider lines sweep from left ── */
      if (dividers.length) gsap.fromTo(dividers,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'center 62%', scrub: 1 } }
      )

      /* ── Quote block: per-word stagger rise on scroll ── */
      if (quoteRef.current) {
        const quoteWords = quoteRef.current.querySelectorAll<HTMLElement>('[data-quote-word]')
        const quoteMeta  = quoteRef.current.querySelector<HTMLElement>('[data-quote-meta]')
        if (quoteWords.length) gsap.fromTo(quoteWords,
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, ease: EASE_OUT,
            stagger: { each: 0.035, from: 'start' },
            scrollTrigger: { trigger: quoteRef.current, start: 'top 88%', end: 'top 55%', scrub: 1 } }
        )
        if (quoteMeta) gsap.fromTo(quoteMeta,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, ease: EASE_OUT,
            scrollTrigger: { trigger: quoteRef.current, start: 'top 78%', end: 'top 52%', scrub: 1 } }
        )
      }

      /* ── Stat blocks: staggered rise ── */
      if (statBlocks.length) gsap.fromTo(statBlocks,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, ease: EASE_OUT, stagger: 0.12,
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%', end: 'center 65%', scrub: 1 } }
      )

      /* ── Stat numbers: scale pop ── */
      const numEls = [stat1Ref, stat2Ref, stat3Ref]
      numEls.forEach((ref) => {
        if (!ref.current) return
        gsap.fromTo(ref.current,
          { scale: 1.55, opacity: 0 },
          { scale: 1, opacity: 1, ease: EASE_OUT,
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%', end: 'center 65%', scrub: 1 } }
        )
      })

      /* Count up: 5+ */
      const o1 = { val: 0 }
      gsap.to(o1, {
        val: 5, ease: 'none',
        onUpdate() { if (stat1Ref.current) stat1Ref.current.textContent = Math.floor(o1.val) + '+' },
        onComplete() { if (stat1Ref.current) stat1Ref.current.textContent = '5+' },
        scrollTrigger: { trigger: statsRef.current, start: 'top 72%', end: 'center 65%', scrub: 1 },
      })

      /* Count up: 3 */
      const o2 = { val: 0 }
      gsap.to(o2, {
        val: 3, ease: 'none',
        onUpdate() { if (stat2Ref.current) stat2Ref.current.textContent = String(Math.floor(o2.val)) },
        onComplete() { if (stat2Ref.current) stat2Ref.current.textContent = '3' },
        scrollTrigger: { trigger: statsRef.current, start: 'top 72%', end: 'center 65%', scrub: 1 },
      })

      /* ── Stat labels: letterSpacing + opacity ── */
      if (statLabels.length) gsap.fromTo(statLabels,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.12em', ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%', end: 'center 63%', scrub: 1 } }
      )

      /* ── Stat body words: cascade opacity wave ── */
      if (statWords.length) gsap.fromTo(statWords,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, ease: EASE_OUT, stagger: 0.012,
          scrollTrigger: { trigger: statsRef.current, start: 'top 76%', end: 'center 60%', scrub: 1 } }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /* Quote auto-rotation every 5s — per-word stagger */
  useEffect(() => {
    const advance = () => {
      if (isAnimating.current || !quoteRef.current) return
      isAnimating.current = true
      const next = (activeIdxRef.current + 1) % QUOTES.length

      const wordEls = quoteRef.current.querySelectorAll<HTMLElement>('[data-quote-word]')
      const metaEl  = quoteRef.current.querySelector<HTMLElement>('[data-quote-meta]')

      const tl = gsap.timeline({
        onComplete() {
          activeIdxRef.current = next
          setDisplayIdx(next)
          // double rAF to let React flush the new text into the DOM
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (!quoteRef.current) { isAnimating.current = false; return }
            const newWords = quoteRef.current.querySelectorAll<HTMLElement>('[data-quote-word]')
            const newMeta  = quoteRef.current.querySelector<HTMLElement>('[data-quote-meta]')
            gsap.fromTo(newWords,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, stagger: { each: 0.04, from: 'start' },
                ease: EASE_OUT, duration: 0.45,
                onComplete() { isAnimating.current = false } }
            )
            if (newMeta) gsap.fromTo(newMeta,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, ease: EASE_OUT, duration: 0.4, delay: 0.18 }
            )
          }))
        },
      })

      tl.to(wordEls, {
        y: -20, opacity: 0,
        stagger: { each: 0.028, from: 'start' },
        ease: 'power2.in', duration: 0.28,
      })
      if (metaEl) tl.to(metaEl, { y: -10, opacity: 0, ease: 'power2.in', duration: 0.22 }, '<0.05')
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
          .proof-stats      { grid-template-columns: 1fr; }
          .proof-stat       { padding-left: 0; border-left: none;
                              border-top: 1px solid var(--line-dark); padding-top: 40px; }
          .proof-stat-first { border-top: none; padding-top: 0; }
        }
      `}</style>

      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--accent)', marginBottom: 48 }}>
          PROOF
        </p>

        {/* Headline: character-by-character slide-up */}
        <h2 style={{ marginBottom: 72 }}>
          {HEADLINE.map((line, li) => (
            <div key={li} className="t-title" style={{ display: 'block', color: 'var(--text-inverse)', lineHeight: 1.05 }}>
              {line.split('').map((char, ci) =>
                char === ' '
                  ? <span key={ci} style={{ display: 'inline-block' }}>{' '}</span>
                  : (
                    <span key={ci} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                      <span data-char style={{ display: 'inline-block' }}>{char}</span>
                    </span>
                  )
              )}
            </div>
          ))}
        </h2>

        <div data-divider style={{ height: 1, background: 'var(--line-dark)', marginBottom: 56 }} />

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
              fontStyle: 'italic', maxWidth: 860, marginBottom: 28,
            }}>
              <QuoteWords text={q.quote} />
            </p>

            <div data-quote-meta="" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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

        <div data-divider style={{ height: 1, background: 'var(--line-dark)', marginBottom: 72 }} />

        {/* Stats */}
        <div ref={statsRef} className="proof-stats" style={{ marginBottom: 80 }}>

          <div className="proof-stat-first">
            <span style={NUM_STYLE}><span ref={stat1Ref}>0+</span></span>
            <p data-stat-label className="t-label" style={{ color: 'rgba(248,245,240,0.6)', marginBottom: 10 }}>
              Technologies mastered
            </p>
            <p style={BODY_MUTED}>
              <BodyWords text="React · Node.js · TypeScript · ASP.NET Core · React Native" />
            </p>
          </div>

          <div className="proof-stat">
            <span style={NUM_STYLE}><span ref={stat2Ref}>0</span></span>
            <p data-stat-label className="t-label" style={{ color: 'rgba(248,245,240,0.6)', marginBottom: 10 }}>
              Live deployed projects
            </p>
            <p style={BODY_MUTED}>
              <BodyWords text="ChatX · MongoX · LinkMe — production deployments on Vercel" />
            </p>
          </div>

          <div className="proof-stat">
            <span style={NUM_STYLE}><span ref={stat3Ref}>{'< 1yr'}</span></span>
            <p data-stat-label className="t-label" style={{ color: 'rgba(248,245,240,0.6)', marginBottom: 10 }}>
              Frontend to full stack
            </p>
            <p style={BODY_MUTED}>
              <BodyWords text="Started coding 2023. Full stack by 2024. React Native by 2025." />
            </p>
          </div>

        </div>
      </div>

      <div style={{ height: 'clamp(64px, 8vw, 100px)', background: 'var(--black)' }} />
    </section>
  )
}
