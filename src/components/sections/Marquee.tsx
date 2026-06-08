import { skills } from '@/lib/data'

/* Duplicate so the seamless loop works */
const ticker = [...skills, ...skills]

export default function Ticker() {
  return (
    <div
      style={{
        background: 'var(--accent)',
        height: 52,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="animate-ticker"
        style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
      >
        {ticker.map((s, i) => (
          <span
            key={i}
            className="t-label"
            style={{
              color: 'var(--black)',
              letterSpacing: '0.12em',
              padding: '0 20px',
            }}
          >
            {s} /
          </span>
        ))}
      </div>
    </div>
  )
}
