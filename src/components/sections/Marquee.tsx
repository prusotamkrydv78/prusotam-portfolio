import { skills } from '@/lib/data'

const ticker = [
  ...skills,
  ...skills, // doubled so the seamless loop math works
]

export default function Marquee() {
  return (
    <div style={{ background: 'var(--accent)', overflow: 'hidden' }}>
      {/* Row 1 — left */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee-left flex shrink-0 whitespace-nowrap">
          {ticker.map((s, i) => (
            <span
              key={`a-${i}`}
              className="font-[family-name:var(--font-dm-mono)] uppercase tracking-[0.2em]"
              style={{
                fontSize: 'var(--type-small)',
                color: 'var(--bg-invert)',
                padding: '0 1.5rem',
                lineHeight: '56px',
              }}
            >
              {s} ·
            </span>
          ))}
        </div>
        <div className="animate-marquee-left flex shrink-0 whitespace-nowrap" aria-hidden>
          {ticker.map((s, i) => (
            <span
              key={`b-${i}`}
              className="font-[family-name:var(--font-dm-mono)] uppercase tracking-[0.2em]"
              style={{
                fontSize: 'var(--type-small)',
                color: 'var(--bg-invert)',
                padding: '0 1.5rem',
                lineHeight: '56px',
              }}
            >
              {s} ·
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — right */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee-right flex shrink-0 whitespace-nowrap">
          {[...ticker].reverse().map((s, i) => (
            <span
              key={`c-${i}`}
              className="font-[family-name:var(--font-dm-mono)] uppercase tracking-[0.2em]"
              style={{
                fontSize: 'var(--type-small)',
                color: 'var(--bg-invert)',
                padding: '0 1.5rem',
                lineHeight: '56px',
              }}
            >
              {s} ·
            </span>
          ))}
        </div>
        <div className="animate-marquee-right flex shrink-0 whitespace-nowrap" aria-hidden>
          {[...ticker].reverse().map((s, i) => (
            <span
              key={`d-${i}`}
              className="font-[family-name:var(--font-dm-mono)] uppercase tracking-[0.2em]"
              style={{
                fontSize: 'var(--type-small)',
                color: 'var(--bg-invert)',
                padding: '0 1.5rem',
                lineHeight: '56px',
              }}
            >
              {s} ·
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
