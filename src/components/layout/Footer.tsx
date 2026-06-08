'use client'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--white)',
        borderTop: '1px solid var(--line)',
        padding: '20px var(--gutter)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span className="t-label" style={{ color: 'var(--text-secondary)' }}>
        Portfolio. © 2026
      </span>
      <span className="t-label" style={{ color: 'var(--text-secondary)' }}>
        Built with Next.js + GSAP
      </span>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="t-label"
        style={{
          background: 'none', border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
      >
        ↑ Back to top
      </button>
    </footer>
  )
}
