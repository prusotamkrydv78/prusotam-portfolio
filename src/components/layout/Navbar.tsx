'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { person } from '@/lib/data'

const links = [
  { label: 'Work',    href: '#work'    },
  { label: 'About',   href: '#about'   },
  { label: 'Contact', href: '#contact' },
]

type Theme = 'light' | 'dark'

export default function Navbar() {
  const navRef     = useRef<HTMLElement>(null)
  const maskRef    = useRef<HTMLDivElement>(null)
  const linksRef   = useRef<(HTMLAnchorElement | null)[]>([])
  const [theme, setTheme]     = useState<Theme>('dark') // hero is dark
  const [scrolled, setScrolled] = useState(false)

  /* Slide down on load */
  useEffect(() => {
    if (!navRef.current) return
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 1.1 }
    )
  }, [])

  /* Section theme detection + scroll blur */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      const hero    = document.getElementById('hero')
      const contact = document.getElementById('contact')
      const inHero    = hero    ? y < hero.offsetHeight - 64 : false
      const inContact = contact ? y + 64 >= contact.offsetTop : false
      setTheme(inHero || inContact ? 'dark' : 'light')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Nav mask hover */
  const handleLinkHover = (el: HTMLAnchorElement | null) => {
    if (!el || !navRef.current || !maskRef.current) return
    const navRect  = navRef.current.getBoundingClientRect()
    const linkRect = el.getBoundingClientRect()
    gsap.to(maskRef.current, {
      x: linkRect.left - navRect.left,
      width: linkRect.width + 24,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
    })
  }

  const handleNavLeave = () => {
    if (!maskRef.current) return
    gsap.to(maskRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' })
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const textColor  = theme === 'dark' ? 'var(--text-inverse)' : 'var(--text-primary)'
  const blurClass  = scrolled ? (theme === 'dark' ? 'nav-blur-dark' : 'nav-blur-light') : ''

  return (
    <nav
      ref={navRef}
      style={{ opacity: 0 }}
      className={`fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-[var(--gutter)] transition-colors duration-300 ${blurClass}`}
      onMouseLeave={handleNavLeave}
    >
      {/* Brand */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        style={{
          fontFamily: 'var(--font-clash), Syne, sans-serif',
          fontWeight: 700,
          fontSize: 17,
          color: textColor,
          textDecoration: 'none',
          transition: 'color 0.3s',
        }}
      >
        {person.monogram}
      </a>

      {/* Links + mask */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Sliding mask */}
        <div
          ref={maskRef}
          style={{
            position: 'absolute',
            height: 28,
            background: theme === 'dark' ? 'rgba(248,245,240,0.1)' : 'rgba(17,17,17,0.06)',
            borderRadius: 4,
            opacity: 0,
            pointerEvents: 'none',
            top: '50%',
            transform: 'translateY(-50%)',
            left: -12,
          }}
        />

        {links.map(({ label, href }, i) => (
          <a
            key={label}
            ref={(el) => { linksRef.current[i] = el }}
            href={href}
            onClick={(e) => handleClick(e, href)}
            onMouseEnter={() => handleLinkHover(linksRef.current[i])}
            className="t-label"
            style={{
              color: textColor,
              textDecoration: 'none',
              padding: '6px 12px',
              transition: 'color 0.3s',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}
