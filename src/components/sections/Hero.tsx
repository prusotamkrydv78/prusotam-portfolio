'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'
import { person } from '@/lib/data'
import MagneticButton from '@/components/ui/MagneticButton'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

export default function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const words = headlineRef.current?.querySelectorAll('.word')
    if (!words) return

    gsap.set(words, { y: '100%', opacity: 0 })
    gsap.set([subRef.current, ctaRef.current, scrollRef.current], { opacity: 0, y: 20 })

    const tl = gsap.timeline({ delay: 1.1 })
    tl.to(words, { y: '0%', opacity: 1, stagger: 0.08, duration: 0.9, ease: 'power3.out' })
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to(scrollRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')

    // Scroll indicator yoyo
    gsap.to('.scroll-line', {
      height: 8,
      opacity: 0.3,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 2,
    })
  }, [])

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,160,69,0.06) 0%, transparent 70%)`,
      }}
    >
      <div className="container w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_480px] gap-12 items-center min-h-screen py-32">

          {/* Left — Text */}
          <div className="flex flex-col justify-center">
            {/* Available badge */}
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                Available for work
              </span>
            </div>

            {/* Headline */}
            <div ref={headlineRef} className="overflow-visible">
              <div className="overflow-hidden">
                <span
                  className="word block leading-none"
                  style={{
                    fontSize: 'clamp(52px, 9vw, 120px)',
                    fontStyle: 'italic',
                    color: 'var(--text-primary)',
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: 700,
                  }}
                >
                  Full Stack
                </span>
              </div>
              <div className="overflow-hidden">
                <span
                  className="word block gradient-text leading-none"
                  style={{
                    fontSize: 'clamp(52px, 9vw, 120px)',
                    fontStyle: 'italic',
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: 700,
                  }}
                >
                  Developer.
                </span>
              </div>
              <div className="overflow-hidden mt-4">
                <span
                  className="word block"
                  style={{
                    fontSize: 'clamp(18px, 2.5vw, 28px)',
                    color: 'var(--text-secondary)',
                    fontStyle: 'normal',
                    fontFamily: 'var(--font-geist-sans), system-ui',
                    fontWeight: 400,
                  }}
                >
                  {person.tagline}
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p
              ref={subRef}
              className="mt-6 max-w-md text-base md:text-lg"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
            >
              React · TypeScript · Node.js · ASP.NET Core
              <br />
              Web · Mobile · Real-time systems
            </p>

            {/* CTA buttons */}
            <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mt-10">
              <MagneticButton
                onClick={scrollToProjects}
                className="px-8 py-4 rounded-sm text-sm font-medium tracking-wide transition-colors"
                style={{
                  background: 'var(--accent)',
                  color: '#080808',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              >
                View Work ↓
              </MagneticButton>
              <MagneticButton
                as="a"
                href={`mailto:${person.email}`}
                className="px-8 py-4 rounded-sm text-sm font-medium tracking-wide transition-colors"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              >
                Get in Touch
              </MagneticButton>
            </div>
          </div>

          {/* Right — 3D Canvas */}
          <div className="hidden md:block h-[480px] lg:h-[560px]">
            <Scene />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span
          className="text-[11px] tracking-[0.4em] uppercase"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          Scroll
        </span>
        <div
          className="scroll-line w-px"
          style={{ height: 32, background: 'var(--accent)' }}
        />
      </div>
    </section>
  )
}
