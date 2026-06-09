'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT } from '@/lib/animations'
import { skills } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger)

const ticker = [...skills, ...skills]

export default function Ticker() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(wrapRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE_OUT,
          scrollTrigger: { trigger: wrapRef.current, start: 'top 90%', end: 'top 20%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{ background: 'var(--accent)', height: 52, overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
      <div className="animate-ticker" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
        {ticker.map((s, i) => (
          <span
            key={i}
            className="t-label"
            style={{ color: 'var(--black)', letterSpacing: '0.12em', padding: '0 20px' }}
          >
            {s} /
          </span>
        ))}
      </div>
    </div>
  )
}
