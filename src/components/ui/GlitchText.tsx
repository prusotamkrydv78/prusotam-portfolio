'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'

interface Props {
  text: string
  className?: string
}

export default function GlitchText({ text, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const handleEnter = () => {
    if (!ref.current) return
    tlRef.current?.kill()
    tlRef.current = gsap.timeline()
      .to(ref.current, {
        x: 2, y: -1,
        textShadow: '2px 0 var(--accent), -2px 0 rgba(255,0,100,0.3)',
        filter: 'blur(0.5px)',
        duration: 0.08, ease: 'none',
      })
      .to(ref.current, {
        x: -2, y: 1,
        textShadow: '-2px 0 var(--accent), 2px 0 rgba(255,0,100,0.3)',
        duration: 0.08, ease: 'none',
      })
      .to(ref.current, {
        x: 0, y: 0, textShadow: 'none', filter: 'none',
        duration: 0.08, ease: 'none',
      })
  }

  const handleLeave = () => {
    if (!ref.current) return
    tlRef.current?.kill()
    gsap.to(ref.current, { x: 0, y: 0, textShadow: 'none', filter: 'none', duration: 0.1 })
  }

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {text}
    </span>
  )
}
