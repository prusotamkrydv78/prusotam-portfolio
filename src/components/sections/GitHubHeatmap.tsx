'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, EASE_OUT } from '@/lib/animations'
import { person } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

export interface ContributionDay { date: string; count: number; level: number }

const WEEKS = 52
const DAYS  = 7
const HEAT_COLORS = [
  'var(--surface-2)',
  '#FFB899',
  '#FF8B5E',
  '#FF6633',
  '#FF4D00',
]
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_FULL  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

/* Deterministic, locale-independent date label, e.g. "Monday, June 9, 2025" */
function formatDate(iso: string): string {
  const dt = new Date(iso + 'T00:00:00Z')
  return `${WEEKDAY_FULL[dt.getUTCDay()]}, ${MONTH_FULL[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`
}

interface TipState { x: number; y: number; cell: ContributionDay }

/* ── Real data → week-column grid (GitHub style, Sunday-start columns) ──
   Day-of-week is derived in UTC so server and client render identically. */
function buildFromReal(days: ContributionDay[]) {
  const parsed = days.map((d) => {
    const dt = new Date(d.date + 'T00:00:00Z')
    return { level: d.level, count: d.count, date: d.date, dow: dt.getUTCDay(), month: dt.getUTCMonth() }
  })
  const lead = parsed[0]?.dow ?? 0
  const cells: ((typeof parsed)[number] | null)[] = [...Array(lead).fill(null), ...parsed]

  const weeks: (ContributionDay | null)[][] = []
  const weekMonth: (number | null)[] = []
  for (let i = 0; i < cells.length; i += 7) {
    const chunk = cells.slice(i, i + 7)
    weeks.push(chunk.map((c) => (c ? { date: c.date, count: c.count, level: c.level } : null)))
    const firstReal = chunk.find(Boolean) as (typeof parsed)[number] | undefined
    weekMonth.push(firstReal ? firstReal.month : null)
  }

  const months: { label: string; col: number }[] = []
  let last = -1
  weekMonth.forEach((m, col) => {
    if (m !== null && m !== last) { months.push({ label: MONTH_NAMES[m], col }); last = m }
  })
  return { weeks, months }
}

/* ── Deterministic generated fallback (used only if the live fetch fails) ── */
function hashN(n: number): number {
  let x = n
  x = ((x >> 16) ^ x) * 0x45d9f3b
  x = ((x >> 16) ^ x) * 0x45d9f3b
  x = (x >> 16) ^ x
  return (x >>> 0) / 4294967295
}
function genLevel(week: number, day: number): number {
  const seed = week * DAYS + day
  const h1 = hashN(seed)
  const h2 = hashN(seed + 5000)
  const recency = week / (WEEKS - 1)
  const weekday = day < 5
  const chance = weekday ? 0.36 + recency * 0.34 : 0.1 + recency * 0.18
  if (h1 > chance) return 0
  if (h2 < 0.4) return 1
  if (h2 < 0.68) return 2
  if (h2 < 0.87) return 3
  return 4
}
const FALLBACK_MONTHS = [
  { label: 'Jun', col: 0 }, { label: 'Jul', col: 5 }, { label: 'Aug', col: 9 },
  { label: 'Sep', col: 13 }, { label: 'Oct', col: 18 }, { label: 'Nov', col: 22 },
  { label: 'Dec', col: 26 }, { label: 'Jan', col: 31 }, { label: 'Feb', col: 35 },
  { label: 'Mar', col: 39 }, { label: 'Apr', col: 44 }, { label: 'May', col: 48 },
]
function buildFallback() {
  const weeks: (ContributionDay | null)[][] = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: DAYS }, (_, d) => ({ date: '', count: 0, level: genLevel(w, d) }))
  )
  return { weeks, months: FALLBACK_MONTHS }
}

function cellTitle(cell: ContributionDay | null): string {
  if (!cell) return ''
  if (!cell.date) return cell.level === 0 ? 'No activity' : cell.level < 3 ? 'Some activity' : 'High activity'
  const n = cell.count
  return `${n === 0 ? 'No' : n} contribution${n === 1 ? '' : 's'} on ${cell.date}`
}

export default function GitHubHeatmap({ days, total }: { days: ContributionDay[] | null; total: number }) {
  const sectionRef = useRef<HTMLElement>(null)
  const stat1Ref   = useRef<HTMLSpanElement>(null)
  const stat2Ref   = useRef<HTMLSpanElement>(null)
  const stat3Ref   = useRef<HTMLSpanElement>(null)

  const { weeks, months } = days && days.length ? buildFromReal(days) : buildFallback()

  const [tip, setTip] = useState<TipState | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const el    = sectionRef.current
    const lines = el.querySelectorAll('[data-line]')
    const label = el.querySelector('.section-label')
    const cells = el.querySelectorAll('.heat-cell')

    const ctx = gsap.context(() => {
      if (label) gsap.fromTo(label,
        { opacity: 0, letterSpacing: '0em' },
        { opacity: 1, letterSpacing: '0.15em', ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 1 } }
      )

      gsap.fromTo(lines,
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'top 60%', scrub: 1 } }
      )

      const CELL_DUR = 0.5
      const STAGGER  = 1.0

      const heatTl = gsap.timeline({
        scrollTrigger: { trigger: '.heatmap-wrap', start: 'top 85%', end: 'top 60%', scrub: 1 },
      })

      const counters = [
        { ref: stat1Ref, target: total,                  suffix: '+' },
        { ref: stat2Ref, target: person.stats.repos,     suffix: '+' },
        { ref: stat3Ref, target: person.stats.yearsCoding, suffix: '+' },
      ]
      counters.forEach(({ ref, target, suffix }) => {
        if (!ref.current) return
        const obj = { val: 0 }
        heatTl.to(obj, {
          val: target,
          duration: STAGGER + CELL_DUR,
          ease: 'none',
          onUpdate() { if (ref.current) ref.current.textContent = Math.floor(obj.val) + suffix },
          onComplete() { if (ref.current) ref.current.textContent = target + suffix },
        }, 0)
      })

      heatTl.fromTo(cells,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, ease: EASE_OUT, stagger: { from: 'start', amount: STAGGER }, duration: CELL_DUR },
        0
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [total])

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
        .heatmap-wrap { overflow-x: auto; scrollbar-width: none; }
        .heatmap-wrap::-webkit-scrollbar { display: none; }
        .heat-cell:hover { z-index: 3; position: relative; }
        .heat-cell { will-change: transform, opacity; }
        .github-link { transition: color 0.2s ease; }
        .github-link:hover { color: var(--accent) !important; }
        .github-link:hover::after { transform: scaleX(1); }
        @keyframes gh-tip-in {
          from { opacity: 0; transform: translate(-50%, calc(-100% - 6px)); }
          to   { opacity: 1; transform: translate(-50%, -100%); }
        }
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
              data-cursor="highlight"
              data-cursor-color="#111111"
              className="t-label underline-sweep github-link"
              style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
            >
              → VIEW GITHUB PROFILE
            </a>
          </div>

          {/* Right — heatmap */}
          <div>
            <div className="heatmap-wrap">
              <div style={{ display: 'grid', gridTemplateColumns: `16px repeat(${weeks.length}, 14px)`, columnGap: 3, marginBottom: 4, paddingLeft: 2 }}>
                <span />
                {weeks.map((_, w) => {
                  const month = months.find((m) => m.col === w)
                  return (
                    <span key={w} style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 9, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'visible', lineHeight: 1 }}>
                      {month ? month.label : ''}
                    </span>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 3 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 16, flexShrink: 0 }}>
                  {DAY_LABELS.map((labelTxt, d) => (
                    <span key={d} style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 9, color: 'var(--text-secondary)', height: 12, lineHeight: '12px', display: 'block', textAlign: 'right' }}>
                      {labelTxt}
                    </span>
                  ))}
                </div>

                {weeks.map((week, w) => (
                  <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {week.map((cell, d) => (
                      <div
                        key={d}
                        className="heat-cell"
                        aria-label={cellTitle(cell)}
                        onMouseEnter={cell ? (e) => {
                          const target = e.currentTarget
                          const r = target.getBoundingClientRect()
                          setTip({ x: r.left + r.width / 2, y: r.top, cell })
                          gsap.to(target, { scale: 1.35, rotation: 15, duration: 0.2, ease: 'back.out(2.5)', overwrite: 'auto' })
                        } : undefined}
                        onMouseLeave={cell ? (e) => {
                          setTip(null)
                          gsap.to(e.currentTarget, { scale: 1, rotation: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
                        } : undefined}
                        style={{ width: 12, height: 12, borderRadius: 2, background: cell ? HEAT_COLORS[cell.level] : 'transparent', flexShrink: 0 }}
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

      {/* ── Custom hover tooltip (replaces native title) ── */}
      {tip && (
        <div
          role="tooltip"
          style={{
            position:      'fixed',
            left:           tip.x,
            top:            tip.y - 10,
            transform:     'translate(-50%, -100%)',
            zIndex:         200,
            pointerEvents: 'none',
            background:    '#0d0d0d',
            border:        '1px solid rgba(255,77,0,0.35)',
            borderRadius:   7,
            padding:       '10px 13px',
            minWidth:       148,
            boxShadow:     '0 12px 34px rgba(0,0,0,0.5)',
            animation:     'gh-tip-in 0.16s cubic-bezier(0.19,1,0.22,1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 5 }}>
            <span style={{
              width: 9, height: 9, borderRadius: 2, flexShrink: 0,
              background: HEAT_COLORS[tip.cell.level], alignSelf: 'center',
            }} />
            <span style={{
              fontFamily: 'var(--font-display), Syne, sans-serif', fontWeight: 700,
              fontSize: 19, lineHeight: 1, color: '#F8F5F0',
            }}>
              {tip.cell.count}
            </span>
            <span style={{
              fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
              fontSize: 12, color: 'rgba(248,245,240,0.55)',
            }}>
              {tip.cell.count === 1 ? 'contribution' : 'contributions'}
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'rgba(248,245,240,0.42)',
          }}>
            {tip.cell.date ? formatDate(tip.cell.date) : 'Contribution activity'}
          </div>

          {/* caret pointing down to the cell */}
          <span style={{
            position: 'absolute', left: '50%', bottom: -5, width: 9, height: 9,
            background: '#0d0d0d',
            borderRight:  '1px solid rgba(255,77,0,0.35)',
            borderBottom: '1px solid rgba(255,77,0,0.35)',
            transform: 'translateX(-50%) rotate(45deg)',
          }} />
        </div>
      )}
    </section>
  )
}
