'use client'

import { useAnimate } from 'framer-motion'
import { Mail } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { LinkBox } from '@/components/ui/clip-path-links'
import {
  NO_CLIP,
  BOTTOM_RIGHT_CLIP,
  TOP_RIGHT_CLIP,
  BOTTOM_LEFT_CLIP,
  TOP_LEFT_CLIP,
  ENTRANCE_KEYFRAMES,
  EXIT_KEYFRAMES,
  Corner
} from '@/components/ui/clip-path-links'

gsap.registerPlugin(ScrollTrigger)

const MONO_BASE = {
  fontFamily: 'var(--font-mono),"JetBrains Mono",monospace',
  fontSize: 10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'rgba(248,245,240,0.25)',
}

function getCorner(e: React.MouseEvent, elem: Element): Corner {
  const { clientX, clientY } = e
  const { left, top, width, height } = elem.getBoundingClientRect()
  const isLeft = clientX < left + width  / 2
  const isTop  = clientY < top  + height / 2
  if (isLeft  && isTop)  return 'topLeft'
  if (!isLeft && isTop)  return 'topRight'
  if (isLeft)            return 'bottomLeft'
  return 'bottomRight'
}

const TextLinkBox = ({ label, href, download, className = 'h-12' }: {
  label: string
  href: string
  download?: boolean
  className?: string
}) => {
  const [scope, animate] = useAnimate()

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const corner = getCorner(e, e.currentTarget)
    animate(scope.current, { clipPath: ENTRANCE_KEYFRAMES[corner] }, {
      duration: 0.4, ease: [0.25, 1, 0.5, 1],
    })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const corner = getCorner(e, e.currentTarget)
    animate(scope.current, { clipPath: EXIT_KEYFRAMES[corner] }, {
      duration: 0.4, ease: [0.25, 1, 0.5, 1],
    })
  }

  return (
    <a
      href={href}
      download={download}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative grid w-full place-content-center ${className}`}
      style={{ background: '#111111', color: 'rgba(248,245,240,0.35)', cursor: 'none' }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase'
      }}>
        {label}
      </span>

      {/* Hover overlay — orange wipe */}
      <div
        ref={scope}
        style={{
          clipPath: BOTTOM_RIGHT_CLIP,
          background: '#FF4D00',
          color: '#111111',
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          {label}
        </span>
      </div>
    </a>
  )
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-row', {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 95%',
          end: 'bottom bottom',
          scrub: 1
        }
      })
    })
    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis
    if (lenis) lenis.scrollTo(0, { duration: 2.0 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer ref={footerRef} style={{ background: 'var(--black)' }}>
      {/* ── Part 1: Social links grid ─────────────────────────── */}
      <div
        className="divide-y divide-[rgba(248,245,240,0.08)] border border-[rgba(248,245,240,0.08)]"
        style={{ borderTop: '1px solid rgba(248,245,240,0.08)' }}
      >
        {/* Row 1 — 2 equal columns — main contact links (tall cells) */}
        <div className="grid grid-cols-2 divide-x divide-[rgba(248,245,240,0.08)] footer-row">
          <LinkBox
            Icon={Mail}
            href="mailto:prusotamkumaryadav78@gmail.com"
          />
          <LinkBox
            Icon={FaGithub}
            href="https://github.com/prusotamkrydv78"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>

        {/* Row 2 — 3 columns — text cells (medium height) */}
        <div className="grid grid-cols-3 divide-x divide-[rgba(248,245,240,0.08)] footer-row">
          <TextLinkBox label="↓ Resume" href="/resume.pdf" download />
          <TextLinkBox label="● Available" href="#contact" />
          <TextLinkBox label="India · 2026" href="#" />
        </div>

        {/* Row 3 — 4 columns — tech stack text (short, decorative) */}
        <div className="grid grid-cols-4 divide-x divide-[rgba(248,245,240,0.08)] footer-row">
          <TextLinkBox label="React" href="#" className="h-10" />
          <TextLinkBox label="TypeScript" href="#" className="h-10" />
          <TextLinkBox label="Next.js" href="#" className="h-10" />
          <TextLinkBox label="GSAP" href="#" className="h-10" />
        </div>
      </div>

      {/* ── Part 2: Bottom strip ──────────────────────────────── */}
      <div style={{
        borderTop: '1px solid rgba(248,245,240,0.06)',
        padding: '14px clamp(24px,5vw,80px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={MONO_BASE}>Portfolio. © 2026</span>
        <span style={MONO_BASE}>Built with Next.js · GSAP · WebGL</span>
        <button
          onClick={scrollToTop}
          style={{ background: 'none', border: 'none', cursor: 'none', ...MONO_BASE, transition: 'color 0.25s ease' }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(248,245,240,0.8)'
          }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(248,245,240,0.25)' }}
        >
          ↑ Back to top
        </button>
      </div>
    </footer>
  )
}
