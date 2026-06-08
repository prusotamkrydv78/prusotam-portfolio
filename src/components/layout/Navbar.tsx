'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import GlitchText from '@/components/ui/GlitchText'
import MagneticEl from '@/components/ui/MagneticEl'

const links = [
  { label: 'WORK',    href: '#work'    },
  { label: 'ABOUT',   href: '#about'   },
  { label: 'CONTACT', href: '#contact' },
]

export default function Navbar() {
  const navRef  = useRef<HTMLElement>(null)
  const [dark, setDark] = useState(true) // hero is dark, start dark

  useEffect(() => {
    if (!navRef.current) return
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 1.2 }
    )

    const onScroll = () => {
      const hero    = document.getElementById('hero')
      const contact = document.getElementById('contact')
      const scrollY = window.scrollY
      const vh = window.innerHeight

      const inHero    = hero    ? scrollY < hero.offsetHeight - 56                 : false
      const inContact = contact ? scrollY + 56 >= contact.offsetTop               : false
      setDark(inHero || inContact)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const linkColor = dark ? 'var(--ink-invert)' : 'var(--ink-primary)'

  return (
    <nav
      ref={navRef}
      style={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-[100] h-14 flex items-center justify-between px-[var(--gutter)]"
    >
      {/* Monogram */}
      <MagneticEl>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <GlitchText
            text="PK /"
            className="font-[family-name:var(--font-dm-mono)] text-[13px] tracking-[0.15em] text-[var(--accent)]"
          />
        </a>
      </MagneticEl>

      {/* Nav links */}
      <ul className="flex items-center gap-8">
        {links.map(({ label, href }) => (
          <li key={label}>
            <MagneticEl>
              <a
                href={href}
                onClick={(e) => handleClick(e, href)}
                style={{ color: linkColor, transition: 'color 0.4s ease' }}
                className="relative font-[family-name:var(--font-dm-mono)] text-[11px] uppercase tracking-[0.15em]"
              >
                <GlitchText text={label} />
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 hover:scale-x-100 transition-transform duration-300"
                  style={{ background: linkColor }}
                  aria-hidden
                />
              </a>
            </MagneticEl>
          </li>
        ))}
      </ul>
    </nav>
  )
}
