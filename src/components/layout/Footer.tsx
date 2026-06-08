'use client'

import { person } from '@/lib/data'
import { Mail } from 'lucide-react'

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
  </svg>
)

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      className="py-10 px-6 md:px-10"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}
      >
        {/* Left */}
        <div className="flex flex-col gap-2">
          <span
            className="font-bold tracking-widest text-sm"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            {person.initials} — {person.name}
          </span>
          <div className="flex items-center gap-4 mt-1">
            <a
              href={person.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <GithubIcon /> GitHub ↗
            </a>
            <a
              href={`mailto:${person.email}`}
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Mail size={14} /> Email ↗
            </a>
          </div>
        </div>

        {/* Center */}
        <p className="text-xs hidden md:block" style={{ color: 'var(--text-muted)' }}>
          Built with Next.js + GSAP + R3F
          <br />
          <span>© 2026 Prusotam Kumar Yadav</span>
        </p>

        {/* Right */}
        <button
          onClick={scrollToTop}
          className="text-sm transition-colors hover:text-[var(--accent)]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          Scroll back up ↑
        </button>
      </div>

      <p className="text-xs mt-6 md:hidden" style={{ color: 'var(--text-muted)' }}>
        Built with Next.js + GSAP + R3F · © 2026 Prusotam Kumar Yadav
      </p>
    </footer>
  )
}
