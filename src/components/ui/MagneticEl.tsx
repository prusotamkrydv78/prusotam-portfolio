'use client'

import { useRef, ReactNode } from 'react'
import { gsap } from 'gsap'

interface Props {
  children: ReactNode
  strength?: number
}

export default function MagneticEl({ children, strength = 0.35 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const bounds = useRef<DOMRect | null>(null)

  const handleEnter = () => {
    if (!ref.current) return
    bounds.current = ref.current.getBoundingClientRect()
  }

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || !bounds.current) return
    const b = bounds.current
    const cx = b.left + b.width / 2
    const cy = b.top  + b.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    gsap.to(ref.current, {
      x: dx * strength,
      y: dy * strength,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const handleLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-block' }}
    >
      {children}
    </div>
  )
}
