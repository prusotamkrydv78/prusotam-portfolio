'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function Intro() {
  const introRef = useRef<HTMLDivElement>(null)
  const pkRef = useRef<HTMLSpanElement>(null)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Skip intro if already played this session
    if (sessionStorage.getItem('introPlayed')) {
      setShow(false)
      document.body.style.overflow = 'auto'
      return
    }

    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline()

    tl.set(pkRef.current, { opacity: 0, scale: 0.8 })
      .to(pkRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 })
      .to(pkRef.current, { scale: 5, opacity: 0, duration: 0.5, ease: 'power3.in', delay: 0.4 })
      .to(introRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' })
      .add(() => {
        setShow(false)
        document.body.style.overflow = 'auto'
        sessionStorage.setItem('introPlayed', 'true')
      })

  }, [])

  if (!show) return null

  return (
    <div
      ref={introRef}
      className="fixed inset-0 flex items-center justify-center z-[1000]"
      style={{ background: 'var(--bg-primary)' }}
    >
      <span
        ref={pkRef}
        className="font-bold tracking-widest"
        style={{
          color: 'var(--accent)',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '24px',
        }}
      >
        PK
      </span>
    </div>
  )
}
