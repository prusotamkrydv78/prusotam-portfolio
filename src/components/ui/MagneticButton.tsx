'use client'

import { useRef, ReactNode } from 'react'
import { gsap } from 'gsap'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  as?: 'button' | 'a'
}

export default function MagneticButton({
  children, className = '', style, onClick, href,
  target, rel, type = 'button', as = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' })
    gsap.to(innerRef.current, { x: x * 0.5, y: y * 0.5, duration: 0.3, ease: 'power2.out' })
  }

  const onMouseLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  const Tag = as as any
  const extraProps = as === 'a' ? { href, target, rel } : { type, onClick }

  return (
    <Tag
      ref={ref}
      className={`magnetic inline-block ${className}`}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...extraProps}
    >
      <span ref={innerRef} className="inline-block">{children}</span>
    </Tag>
  )
}
