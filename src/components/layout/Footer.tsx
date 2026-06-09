'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, EASE_OUT } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!footerRef.current) return
    const items = footerRef.current.querySelectorAll('[data-col]')
    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE_OUT, stagger: 0.08,
          scrollTrigger: { trigger: footerRef.current, start: 'top 95%', end: 'top 60%' } }
      )
    }, footerRef)
    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts: object) => void } }).lenis
    if (lenis) {
      lenis.scrollTo(0, { duration: 2.0 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer
      ref={footerRef}
      style={{
        background: 'var(--white)',
        borderTop: '1px solid var(--line)',
        padding: '20px var(--gutter)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span data-col className="t-label" style={{ color: 'var(--text-secondary)' }}>
        Portfolio. © 2026
      </span>
      <span data-col className="t-label" style={{ color: 'var(--text-secondary)' }}>
        Built with Next.js + GSAP
      </span>
      <button
        data-col
        onClick={scrollToTop}
        className="t-label"
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'none', transition: 'color 0.2s' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
      >
        ↑ Back to top
      </button>
    </footer>
  )
}
