'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  text: string
  className?: string
  delay?: number
  splitBy?: 'word' | 'line'
}

export default function TextReveal({ text, className = '', delay = 0, splitBy = 'word' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const spans = containerRef.current.querySelectorAll<HTMLSpanElement>('.inner')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { y: '105%', rotation: 2, opacity: 0 },
        {
          y: '0%',
          rotation: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          stagger: splitBy === 'word' ? 0.05 : 0.12,
          delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [delay, splitBy])

  const units = splitBy === 'word' ? text.split(' ') : text.split('\n')

  return (
    <div ref={containerRef} className={className}>
      {units.map((unit, i) => (
        <span
          key={i}
          style={{ overflow: 'hidden', display: splitBy === 'word' ? 'inline-block' : 'block', marginRight: splitBy === 'word' ? '0.28em' : undefined }}
        >
          <span className="inner" style={{ display: 'inline-block' }}>
            {unit}
          </span>
        </span>
      ))}
    </div>
  )
}
