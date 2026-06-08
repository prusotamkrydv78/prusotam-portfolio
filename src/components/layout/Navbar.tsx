'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import ScrambleText from '@/components/ui/ScrambleText'
import { person } from '@/lib/data'

const links = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Slide down on load
    gsap.fromTo(navRef.current,
      { y: '-100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.8, delay: 0.8, ease: 'power3.out' }
    )

    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuRef.current) return
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.set(menuRef.current, { display: 'flex' })
      gsap.fromTo(menuRef.current,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power4.inOut' }
      )
      gsap.fromTo('.menu-link',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, delay: 0.3, ease: 'power3.out' }
      )
    } else {
      document.body.style.overflow = 'auto'
      gsap.to(menuRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'power4.inOut',
        onComplete: () => {
          if (menuRef.current) menuRef.current.style.display = 'none'
        },
      })
    }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10 py-5"
        style={{
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'backdrop-filter 0.3s, border-bottom 0.3s',
        }}
      >
        {/* Monogram */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}
          className="text-sm font-bold tracking-widest"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          {person.initials}
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={(e) => { e.preventDefault(); scrollTo(l.href) }}
                className="text-sm relative group transition-colors"
                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-geist-sans), system-ui' }}
              >
                <ScrambleText text={l.label} />
                <span
                  className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: 'var(--accent)' }}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span className="block w-6 h-px" style={{ background: 'var(--text-primary)' }} />
          <span className="block w-4 h-px" style={{ background: 'var(--text-primary)' }} />
          <span className="block w-6 h-px" style={{ background: 'var(--text-primary)' }} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[200] flex-col items-start justify-center px-8"
        style={{ background: 'var(--bg-primary)', display: 'none' }}
      >
        <button
          className="absolute top-5 right-6 text-2xl"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>
        <ul className="flex flex-col gap-4 mt-8">
          {links.map((l) => (
            <li key={l.label} className="overflow-hidden">
              <a
                href={l.href}
                onClick={(e) => { e.preventDefault(); scrollTo(l.href) }}
                className="menu-link block font-bold"
                style={{
                  fontSize: 'clamp(48px, 10vw, 96px)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-geist-sans), system-ui',
                  lineHeight: 1.1,
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
