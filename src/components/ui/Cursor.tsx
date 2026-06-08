'use client'

import { useEffect, useRef, useState } from 'react'

type CursorState = 'default' | 'view' | 'copy'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CursorState>('default')
  const [dark, setDark]   = useState(true)

  useEffect(() => {
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX
      dotY = e.clientY

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`
      }

      // Check section for ring border color
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const inDark = el?.closest('#hero, #contact') !== null
      setDark(inDark)

      // Check cursor-view / cursor-copy context
      const viewEl = el?.closest('[data-cursor-view]')
      const copyEl = el?.closest('[data-cursor-copy]')
      setState(viewEl ? 'view' : copyEl ? 'copy' : 'default')
    }

    const loop = () => {
      ringX += (dotX - ringX) * 0.12
      ringY += (dotY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const ringColor = dark ? 'var(--text-inverse)' : 'var(--text-primary)'
  const showPill  = state === 'view' || state === 'copy'
  const pillText  = state === 'view' ? 'VIEW' : 'COPY'

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        id="cursor-dot"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 10000,
          transition: showPill ? 'opacity 0.2s' : 'none',
          opacity: showPill ? 0 : 1,
        }}
      />

      {/* Ring / pill */}
      <div
        ref={ringRef}
        id="cursor-ring"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: showPill ? 'auto' : 36,
          height: showPill ? 'auto' : 36,
          borderRadius: showPill ? 20 : '50%',
          border: showPill ? 'none' : `1.5px solid ${ringColor}`,
          background: showPill ? 'var(--accent)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: showPill ? '6px 14px' : 0,
          transition: 'border-color 0.3s, background 0.2s, border-radius 0.2s, width 0.2s, height 0.2s',
        }}
      >
        {showPill && (
          <span
            style={{
              fontFamily: 'var(--font-jb-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.12em',
              color: 'var(--black)',
              whiteSpace: 'nowrap',
            }}
          >
            {pillText}
          </span>
        )}
      </div>
    </>
  )
}
