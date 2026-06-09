'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'
import { person } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const WEEKS  = 52
const DAYS   = 7
const HEAT_COLORS = [
  'var(--surface-2)',
  '#FFB899',
  '#FF8B5E',
  '#FF6633',
  '#FF4D00',
]

const MONTHS = [
  { label: 'Jun', week: 0  }, { label: 'Jul', week: 5  },
  { label: 'Aug', week: 9  }, { label: 'Sep', week: 13 },
  { label: 'Oct', week: 18 }, { label: 'Nov', week: 22 },
  { label: 'Dec', week: 26 }, { label: 'Jan', week: 31 },
  { label: 'Feb', week: 35 }, { label: 'Mar', week: 39 },
  { label: 'Apr', week: 44 }, { label: 'May', week: 48 },
]

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function hashN(n: number): number {
  let x = n
  x = ((x >> 16) ^ x) * 0x45d9f3b
  x = ((x >> 16) ^ x) * 0x45d9f3b
  x = (x >> 16) ^ x
  return ((x >>> 0) / 4294967295)
}

function activityLevel(week: number, day: number): number {
  const seed    = week * DAYS + day
  const h1      = hashN(seed)
  const h2      = hashN(seed + 5000)
  const recency = week / (WEEKS - 1)
  const weekday = day < 5
  const chance  = weekday ? 0.36 + recency * 0.34 : 0.10 + recency * 0.18
  if (h1 > chance) return 0
  if (h2 < 0.40)   return 1
  if (h2 < 0.68)   return 2
  if (h2 < 0.87)   return 3
  return 4
}

const HEATMAP: number[][] = Array.from({ length: WEEKS }, (_, w) =>
  Array.from({ length: DAYS }, (_, d) => activityLevel(w, d))
)

export default function GitHubActivity() {
  const sectionRef = useRef<HTMLElement>(null)
  const stat1Ref   = useRef<HTMLSpanElement>(null)
  const stat2Ref   = useRef<HTMLSpanElement>(null)
  const stat3Ref   = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const el    = sectionRef.current
    const lines  = el.querySelectorAll('[data-line]')
    const label  = el.querySelector('.section-label')
    const cells  = el.querySelectorAll('.heat-cell')

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

      /* Stat counters — reverse counts down */
      const counters = [
        { ref: stat1Ref, target: person.stats.contributions, suffix: '+' },
        { ref: stat2Ref, target: person.stats.repos,         suffix: '+' },
        { ref: stat3Ref, target: person.stats.yearsCoding,   suffix: '+' },
      ]
      counters.forEach(({ ref, target, suffix }) => {
        if (!ref.current) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target, duration: 1.6, ease: 'power2.out',
          onUpdate() { if (ref.current) ref.current.textContent = Math.floor(obj.val) + suffix },
          onComplete() { if (ref.current) ref.current.textContent = target + suffix },
          scrollTrigger: { trigger: el, start: 'top 68%', end: 'top 15%' },
        })
      })

      /* Heatmap cells — opacity + scale entrance */
      gsap.fromTo(cells,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1, scale: 1,
          duration: 0.25, ease: 'elastic.out(1, 0.8)',
          stagger: { from: 'start', amount: 1.2 },
          scrollTrigger: { trigger: '.heatmap-wrap', start: 'top 82%', end: 'top 15%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="github"
      ref={sectionRef}
      style={{ background: 'var(--surface-1)', paddingTop: 'var(--section-v)', paddingBottom: 'var(--section-v)' }}
    >
      <style>{`
        .github-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 80px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .github-layout { grid-template-columns: 1fr; gap: 64px 0; }
        }
        .heatmap-wrap { overflow-x: auto; }
        .heat-cell:hover { transform: scale(1.35); z-index: 2; position: relative; }
        .heat-cell { transition: transform 0.15s ease; will-change: transform, opacity; }
        .github-link { transition: color 0.2s ease; }
        .github-link:hover { color: var(--accent) !important; }
        .github-link:hover::after { transform: scaleX(1); }
      `}</style>

      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 48 }}>
          OPEN SOURCE
        </p>

        <div className="github-layout">
          {/* Left */}
          <div>
            <div style={{ marginBottom: 4 }}>
              <div style={{ overflow: 'hidden' }}>
                <span data-line style={{
                  fontFamily: 'var(--font-display),Syne,sans-serif', fontWeight: 700,
                  fontSize: 'clamp(72px,12vw,140px)', lineHeight: 0.9, letterSpacing: '-0.04em',
                  color: 'var(--text-primary)', display: 'block',
                }}>
                  <span ref={stat1Ref}>0+</span>
                </span>
              </div>
            </div>
            <p className="t-label" style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>
              contributions last year
            </p>

            <div style={{ height: 1, background: 'var(--line)', marginBottom: 32 }} />

            <div style={{ display: 'flex', gap: 48, marginBottom: 40 }}>
              <div>
                <span ref={stat2Ref} style={{ fontFamily: 'var(--font-display),Syne,sans-serif', fontWeight: 600, fontSize: 'clamp(28px,4vw,40px)', color: 'var(--text-primary)', display: 'block', lineHeight: 1, marginBottom: 6 }}>0+</span>
                <span className="t-label" style={{ color: 'var(--text-secondary)' }}>repos</span>
              </div>
              <div>
                <span ref={stat3Ref} style={{ fontFamily: 'var(--font-display),Syne,sans-serif', fontWeight: 600, fontSize: 'clamp(28px,4vw,40px)', color: 'var(--text-primary)', display: 'block', lineHeight: 1, marginBottom: 6 }}>0+</span>
                <span className="t-label" style={{ color: 'var(--text-secondary)' }}>years active</span>
              </div>
            </div>

            <p style={{ fontFamily: 'var(--font-body),"Plus Jakarta Sans",sans-serif', fontSize: 16, lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 380, marginBottom: 32 }}>
              Every repo is a decision trail.
              How problems get broken down,
              what patterns get chosen,
              which tradeoffs get made.
            </p>

            <a
              href={person.githubUrl}
              target="_blank" rel="noopener noreferrer"
              className="t-label underline-sweep github-link"
              style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
            >
              → VIEW GITHUB PROFILE
            </a>
          </div>

          {/* Right — heatmap */}
          <div>
            <div className="heatmap-wrap">
              <div style={{ display: 'grid', gridTemplateColumns: `16px repeat(${WEEKS}, 14px)`, columnGap: 3, marginBottom: 4, paddingLeft: 2 }}>
                <span />
                {Array.from({ length: WEEKS }, (_, w) => {
                  const month = MONTHS.find((m) => m.week === w)
                  return (
                    <span key={w} style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 9, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'visible', lineHeight: 1 }}>
                      {month ? month.label : ''}
                    </span>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 3 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 16, flexShrink: 0 }}>
                  {DAY_LABELS.map((label, d) => (
                    <span key={d} style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 9, color: 'var(--text-secondary)', height: 12, lineHeight: '12px', display: 'block', textAlign: 'right' }}>
                      {label}
                    </span>
                  ))}
                </div>

                {HEATMAP.map((week, w) => (
                  <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {week.map((level, d) => (
                      <div
                        key={d}
                        className="heat-cell"
                        title={level === 0 ? 'No activity' : level < 3 ? 'Some activity' : 'High activity'}
                        style={{ width: 12, height: 12, borderRadius: 2, background: HEAT_COLORS[level], flexShrink: 0 }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, justifyContent: 'flex-end' }}>
                <span className="t-label" style={{ color: 'var(--text-secondary)', marginRight: 4 }}>Less</span>
                {HEAT_COLORS.map((color, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
                ))}
                <span className="t-label" style={{ color: 'var(--text-secondary)', marginLeft: 4 }}>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
