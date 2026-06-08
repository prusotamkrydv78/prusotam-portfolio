'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

type CellType = 'A' | 'B' | 'C' | 'D'

interface BentoCell {
  name: string
  type: CellType
  col: string
  row: string
  description?: string
}

const CELLS: BentoCell[] = [
  // TYPE A — dark large (2col × 2row)
  { name: 'React.js',     type: 'A', col: '1 / 3', row: '1 / 3' },
  { name: 'TypeScript',   type: 'A', col: '1 / 3', row: '3 / 5' },

  // TYPE B — surface wide (3col × 1row)
  { name: 'Node.js',      type: 'B', col: '3 / 6', row: '1', description: 'Server-side JavaScript runtime' },
  { name: 'ASP.NET Core', type: 'B', col: '3 / 6', row: '2', description: 'Cross-platform web framework' },
  { name: 'React Native', type: 'B', col: '3 / 6', row: '3', description: 'Cross-platform mobile' },

  // TYPE C — white bordered (2col × 1row)
  { name: 'MongoDB',      type: 'C', col: '3 / 5', row: '4' },
  { name: 'Socket.IO',    type: 'C', col: '5 / 7', row: '4' },
  { name: 'Express',      type: 'C', col: '1 / 3', row: '5' },
  { name: 'Tailwind',     type: 'C', col: '3 / 5', row: '5' },

  // TYPE D — accent small (1col × 1row)
  { name: 'JWT',     type: 'D', col: '6', row: '1' },
  { name: 'Git',     type: 'D', col: '6', row: '2' },
  { name: 'Vercel',  type: 'D', col: '6', row: '3' },
  { name: 'C#',      type: 'D', col: '5', row: '5' },
  { name: 'Next.js', type: 'D', col: '6', row: '5' },
]

const CELL_MIN_HEIGHT = 120

function cellBg(type: CellType): string {
  switch (type) {
    case 'A': return 'var(--black)'
    case 'B': return 'var(--surface-1)'
    case 'C': return 'var(--white)'
    case 'D': return 'var(--accent)'
  }
}

export default function BentoStack() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const lines = sectionRef.current.querySelectorAll('[data-line]')
    const cells  = sectionRef.current.querySelectorAll('.bento-cell')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: '105%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: 0.9, ease: EASE_OUT, stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      )

      gsap.from(cells, {
        opacity: 0,
        scale: 0.97,
        duration: 0.6,
        ease: EASE_OUT,
        stagger: { from: 'start', amount: 0.5 },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="stack"
      ref={sectionRef}
      style={{
        background: 'var(--white)',
        paddingTop: 'var(--section-v)',
        paddingBottom: 'var(--section-v)',
      }}
    >
      <style>{`
        .bento-cell {
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
          cursor: default;
        }
        .bento-cell-a:hover { background: #1C1C1C !important; transform: scale(1.01); }
        .bento-cell-b:hover { background: var(--surface-2) !important; transform: scale(1.01); }
        .bento-cell-c:hover { background: var(--surface-1) !important; border-color: var(--accent) !important; transform: scale(1.01); }
        .bento-cell-d:hover { background: var(--accent-dim) !important; transform: scale(1.01); }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-top: 64px;
        }

        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: auto;
          }
          .bento-cell { grid-column: auto !important; grid-row: auto !important; }
        }

        @media (max-width: 560px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="container">
        <p className="t-label section-label" style={{ color: 'var(--text-secondary)', marginBottom: 48 }}>
          STACK
        </p>

        <h2>
          {['Tools of', 'the trade.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span
                data-line
                className="t-title"
                style={{ display: 'block', color: 'var(--text-primary)' }}
              >
                {line}
              </span>
            </div>
          ))}
        </h2>

        <div className="bento-grid">
          {CELLS.map((cell) => {
            const typeClass = `bento-cell-${cell.type.toLowerCase()}`
            const isA = cell.type === 'A'
            const isB = cell.type === 'B'
            const isC = cell.type === 'C'
            const isD = cell.type === 'D'

            return (
              <div
                key={cell.name}
                className={`bento-cell ${typeClass}`}
                style={{
                  gridColumn: cell.col,
                  gridRow: cell.row,
                  background: cellBg(cell.type),
                  border: isC ? '1px solid var(--line)' : 'none',
                  borderRadius: 4,
                  padding: isD ? '20px 16px' : isA ? '28px' : '24px 28px',
                  minHeight: isA ? CELL_MIN_HEIGHT * 2 + 10 : CELL_MIN_HEIGHT,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: isD ? 'flex-end' : 'space-between',
                }}
              >
                {isA && (
                  <>
                    <span
                      className="t-label"
                      style={{ color: 'var(--accent)' }}
                    >
                      PRIMARY
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display), Syne, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(24px, 3vw, 32px)',
                        lineHeight: 1.1,
                        color: 'var(--text-inverse)',
                      }}
                    >
                      {cell.name}
                    </span>
                  </>
                )}

                {isB && (
                  <>
                    <span
                      style={{
                        fontFamily: 'var(--font-display), Syne, sans-serif',
                        fontWeight: 600,
                        fontSize: 22,
                        lineHeight: 1.1,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {cell.name}
                    </span>
                    {cell.description && (
                      <span
                        style={{
                          fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
                          fontSize: 13,
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                        }}
                      >
                        {cell.description}
                      </span>
                    )}
                  </>
                )}

                {isC && (
                  <span
                    style={{
                      fontFamily: 'var(--font-display), Syne, sans-serif',
                      fontWeight: 600,
                      fontSize: 17,
                      color: 'var(--text-primary)',
                      lineHeight: 1.1,
                      marginTop: 'auto',
                    }}
                  >
                    {cell.name}
                  </span>
                )}

                {isD && (
                  <span
                    className="t-label"
                    style={{ color: 'var(--black)' }}
                  >
                    {cell.name}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
