'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, EASE_OUT, DUR_MID } from '@/lib/animations'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ── Project data ─────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    index: '01',
    title: 'LinkMe',
    desc: 'Social platform for developers — connect, share, and ship together.',
    year: '2026',
    cat: 'Full Stack',
    tags: 'TypeScript · C#',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/prusotamkrydv78/LinkMe',
  },
  {
    id: 2,
    index: '02',
    title: 'Native Ecommerce',
    desc: 'Cross-platform mobile shopping app with real-time cart and .NET API.',
    year: '2025',
    cat: 'Mobile',
    tags: 'React Native · .NET',
    img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/prusotamkrydv78/Native_Eccomerce',
  },
  {
    id: 3,
    index: '03',
    title: 'ChatX',
    desc: 'Real-time messaging with WebSocket rooms and live user presence.',
    year: '2024',
    cat: 'Real-time',
    tags: 'Socket.IO · Node.js',
    img: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/prusotamkrydv78/message_app',
  },
  {
    id: 4,
    index: '04',
    title: 'X Clone',
    desc: 'Full-featured Twitter clone — feed, profiles, likes, and retweets.',
    year: '2024',
    cat: 'Social',
    tags: 'React · MongoDB',
    img: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/prusotamkrydv78/X',
  },
  {
    id: 5,
    index: '05',
    title: 'MongoX Vercel',
    desc: 'Serverless MongoDB REST API deployed on Vercel Edge Functions.',
    year: '2023',
    cat: 'Backend',
    tags: 'Node.js · Serverless',
    img: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/prusotamkrydv78/mongoXvercel',
  },
  {
    id: 6,
    index: '06',
    title: 'Expense Tracker',
    desc: 'Finance dashboard with charts, categories, and monthly spend reports.',
    year: '2023',
    cat: 'Finance',
    tags: 'React · Node.js',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/prusotamkrydv78', // TODO: replace with the real Expense Tracker repo URL
  },
  {
    id: 7,
    index: '07',
    title: 'Real Estate App',
    desc: 'Property listing platform with map integration and advanced filters.',
    year: '2023',
    cat: 'Platform',
    tags: 'Next.js · MongoDB',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/prusotamkrydv78', // TODO: replace with the real Real Estate App repo URL
  },
]

const N      = PROJECTS.length
const CARD_W = 260
const CARD_H = 360

/* ── Branded placeholder tiles ─────────────────────────────────
   On-brand amber-on-dark patterns + a soft accent glow, one variant
   per project (keyed by id). No external image dependency. Swap in
   real screenshots later by restoring an <img src={project.img}/>. */
const TILE_PATTERNS: { backgroundImage: string; backgroundSize: string }[] = [
  { backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,77,0,0.10) 0 1.5px, transparent 1.5px 13px)', backgroundSize: 'auto' },
  { backgroundImage: 'radial-gradient(rgba(255,77,0,0.16) 1.2px, transparent 1.6px)', backgroundSize: '18px 18px' },
  { backgroundImage: 'linear-gradient(rgba(255,77,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.10) 1px, transparent 1px)', backgroundSize: '22px 22px' },
  { backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,77,0,0.09) 0 1px, transparent 1px 11px)', backgroundSize: 'auto' },
  { backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,77,0,0.07) 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, rgba(255,77,0,0.07) 0 1px, transparent 1px 12px)', backgroundSize: 'auto' },
  { backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,77,0,0.09) 0 1px, transparent 1px 13px)', backgroundSize: 'auto' },
  { backgroundImage: 'repeating-radial-gradient(circle at 70% 30%, rgba(255,77,0,0.10) 0 1px, transparent 1px 16px)', backgroundSize: 'auto' },
]
const GLOW_POS: React.CSSProperties[] = [
  { top: -50, right: -40 },
  { bottom: -50, left: -40 },
  { top: -50, left: -40 },
  { bottom: -50, right: -40 },
  { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' },
  { top: -50, left: '50%', marginLeft: -120 },
  { bottom: -50, left: '50%', marginLeft: -120 },
]

/* ── Project card ─────────────────────────────────────────── */
function ProjectCard({
  project,
  onHoverChange,
}: {
  project: typeof PROJECTS[0]
  onHoverChange?: (h: boolean) => void
}) {
  const [hovered, setHovered] = useState(false)
  const tileVariant = (project.id - 1) % TILE_PATTERNS.length

  const handleEnter = () => { setHovered(true);  onHoverChange?.(true)  }
  const handleLeave = () => { setHovered(false); onHoverChange?.(false) }

  return (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'block', textDecoration: 'none' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        style={{
          width:        CARD_W,
          height:       CARD_H,
          borderRadius: 8,
          overflow:     'hidden',
          position:     'relative',
          background:   '#111111',
          border:       `1px solid ${hovered ? 'rgba(255,77,0,0.45)' : 'rgba(248,245,240,0.1)'}`,
          transition:   'border-color 0.3s ease',
          boxShadow:     hovered ? '0 20px 60px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Branded placeholder tile — amber-on-dark pattern + accent glow + ghost index */}
        <div style={{ position: 'absolute', inset: 0, background: '#0d0d0d', overflow: 'hidden' }} aria-hidden="true">
          {/* pattern layer */}
          <div
            style={{
              position:        'absolute',
              inset:            0,
              backgroundImage:  TILE_PATTERNS[tileVariant].backgroundImage,
              backgroundSize:   TILE_PATTERNS[tileVariant].backgroundSize,
              opacity:          hovered ? 0.7 : 0.42,
              transition:      'opacity 0.35s ease',
            }}
          />
          {/* accent glow — position varies per project */}
          <div
            style={{
              position:     'absolute',
              width:         240,
              height:        240,
              borderRadius: '50%',
              background:   'radial-gradient(circle, rgba(255,77,0,0.42) 0%, transparent 70%)',
              filter:       'blur(28px)',
              opacity:       hovered ? 1 : 0.55,
              transition:   'opacity 0.35s ease',
              ...GLOW_POS[tileVariant],
            }}
          />
          {/* large ghosted project index */}
          <span
            style={{
              position:       'absolute',
              top:            '42%',
              left:           '50%',
              transform:      'translate(-50%,-50%)',
              fontFamily:     'var(--font-clash), Syne, sans-serif',
              fontWeight:      800,
              fontSize:        130,
              lineHeight:      1,
              letterSpacing:  '-0.04em',
              color:           hovered ? 'rgba(255,77,0,0.22)' : 'rgba(248,245,240,0.07)',
              transition:     'color 0.35s ease',
              userSelect:     'none',
            }}
          >
            {project.index}
          </span>
        </div>
        <div
          style={{
            position:   'absolute',
            inset:       0,
            background:  'linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.5) 55%, rgba(10,10,10,0.1) 100%)',
          }}
        />

        {/* top row */}
        <div
          style={{
            position:       'absolute',
            top:             12,
            left:            12,
            right:           12,
            display:         'flex',
            justifyContent:  'space-between',
            alignItems:      'flex-start',
          }}
        >
          <span
            style={{
              fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
              fontSize:       9,
              letterSpacing:  '0.12em',
              color:          '#FF4D00',
              background:     'rgba(255,77,0,0.1)',
              border:         '1px solid rgba(255,77,0,0.25)',
              padding:        '2px 6px',
              borderRadius:   2,
            }}
          >
            {project.cat.toUpperCase()}
          </span>
          <ArrowUpRight
            size={14}
            style={{
              color:      hovered ? '#FF4D00' : 'rgba(248,245,240,0.45)',
              transition: 'color 0.3s ease',
            }}
          />
        </div>

        {/* bottom info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, color: '#FF4D00', letterSpacing: '0.12em' }}>
              {project.index}
            </span>
            <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, color: 'rgba(248,245,240,0.3)', letterSpacing: '0.08em' }}>
              {project.year}
            </span>
          </div>
          <h3
            style={{
              fontFamily:  'var(--font-clash), var(--font-display), Syne, sans-serif',
              fontWeight:   600,
              fontSize:     15,
              color:        '#F8F5F0',
              lineHeight:   1.2,
              margin:       '0 0 6px',
            }}
          >
            {project.title}
          </h3>
          <p
            style={{
              fontFamily:  'var(--font-body), "Plus Jakarta Sans", sans-serif',
              fontSize:     11,
              color:        'rgba(248,245,240,0.5)',
              lineHeight:   1.55,
              margin:        0,
            }}
          >
            {project.desc}
          </p>
        </div>
      </div>
    </a>
  )
}

/* ── Work section — title + cards in one pinned 100 vh block ── */
export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([])
  const hoverRefs  = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    /* ── Header entrance ── */
    const lines = el.querySelectorAll('[data-line]')
    const headerCtx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: '105%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: DUR_MID, ease: EASE_OUT, stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      )
    })

    /* ── Shared position calculator ── */
    const getCardProps = (progress: number, i: number) => {
      const W = el.offsetWidth
      const H = el.offsetHeight
      const cx = W / 2
      const apexY  = H * 0.62
      const STEP_X = Math.min(W * 0.22, 310)
      const SAG    = 38
      const TILT   = 9
      const activeFloat = progress * (N - 1)
      const offset = i - activeFloat
      const dist   = Math.abs(offset)
      return {
        x:        cx + offset * STEP_X,
        y:        apexY + offset * offset * SAG,
        xPercent: -50,
        yPercent: -50,
        rotation: offset * TILT,
        scale:    Math.max(0.72, 1.12 - dist * 0.13),
        opacity:  Math.max(0.07, 1.0 - dist * 0.28),
        zIndex:   Math.round(Math.max(0, 100 - dist * 30)),
      }
    }

    const progressTracker = { current: 0 }
    const update = (progress: number) => {
      progressTracker.current = progress
      itemRefs.current.forEach((item, i) => {
        if (item) gsap.set(item, getCardProps(progress, i))
      })
    }

    /* ── Seed: cards stacked lower-right, hidden — they fan in on approach ── */
    const W0 = el.offsetWidth
    const H0 = el.offsetHeight
    itemRefs.current.forEach(item => {
      if (!item) return
      gsap.set(item, {
        x: W0 * 0.82, y: H0 * 0.72,   // lower-right but inside section
        xPercent: -50, yPercent: -50,
        opacity: 0, scale: 0.6, rotation: 22,
      })
    })

    /* ── Fan-in: plays once as the section approaches, BEFORE the pin starts.
       It animates toward getCardProps(0) — the exact state the pinned scrub
       begins at — so the handoff below is seamless (no jump). ── */
    const fanIn = ScrollTrigger.create({
      trigger: el,
      start:   'top 72%',
      once:    true,
      onEnter: () => {
        itemRefs.current.forEach((item, i) => {
          if (!item) return
          gsap.to(item, { ...getCardProps(0, i), duration: 0.9, ease: 'expo.out', delay: i * 0.06 })
        })
      },
    })

    /* ── Pinned scrub: the single source of truth for card positions.
       On its first frame it kills any in-flight fan-in tween and takes over.
       Since progress 0 == the fan-in target, there's no stick and no snap —
       cards track the scroll from the moment the section pins. ── */
    let tookOver = false
    const st = ScrollTrigger.create({
      trigger: el,
      pin:     true,
      start:   'top top',
      end:     `+=${N * 700}`,
      scrub:   1.2,
      onUpdate: (self) => {
        if (!tookOver) {
          tookOver = true
          itemRefs.current.forEach(item => item && gsap.killTweensOf(item))
        }
        update(self.progress)
      },
    })

    const onResize = () => {
      if (tookOver) update(progressTracker.current)
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      headerCtx.revert()
      st.kill()
      fanIn.kill()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      {/* ── Pinned full-height block: title lives here so it stays visible ── */}
      <section
        id="work"
        ref={sectionRef}
        style={{
          position:   'relative',
          height:     '100svh',
          overflow:   'hidden',
          background: 'var(--white)',
        }}
      >
        {/* Header — normal flow at the top of the pinned block */}
        <div
          className="container"
          style={{ paddingTop: 'clamp(40px,5vw,68px)', paddingBottom: 0, position: 'relative', zIndex: 10 }}
        >
          <div style={{ overflow: 'hidden', marginBottom: 20 }}>
            <p
              data-line
              className="t-label section-label"
              style={{ color: 'var(--text-secondary)', display: 'block' }}
            >
               WORK 
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>
              {['Selected', 'Work'].map((line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <span
                    data-line
                    className="t-title"
                    style={{ display: 'block', color: 'var(--text-primary)' }}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </h2>

            <div style={{ overflow: 'hidden' }}>
              <span
                data-line
                style={{
                  fontFamily:    'var(--font-mono), "JetBrains Mono", monospace',
                  fontSize:       12,
                  letterSpacing:  '0.15em',
                  color:          'rgba(17,17,17,0.4)',
                  display:        'block',
                }}
              >
                {String(N).padStart(2, '0')} PROJECTS
              </span>
            </div>
          </div>
        </div>

        {/* Cards — absolutely positioned, animated by GSAP */}
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { itemRefs.current[i] = el }}
            style={{
              position:   'absolute',
              top:         0,
              left:        0,
              willChange: 'transform, opacity',
            }}
          >
            {/* Inner wrapper: GSAP rise on hover — isolated from scrub transforms */}
            <div ref={(el) => { hoverRefs.current[i] = el }}>
              <ProjectCard
                project={project}
                onHoverChange={(h) => {
                  const hw = hoverRefs.current[i]
                  if (!hw) return
                  gsap.to(hw, h
                    ? { y: -20, duration: 0.4, ease: 'back.out(1.6)' }
                    : { y:   0, duration: 0.35, ease: 'power2.out'   }
                  )
                }}
              />
            </div>
          </div>
        ))}

        {/* GitHub link at bottom centre */}
        <div
          style={{
            position:      'absolute',
            bottom:         28,
            left:           '50%',
            transform:     'translateX(-50%)',
            zIndex:         10,
          }}
        >
          <a
            href="https://github.com/prusotamkrydv78"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="highlight"
            data-cursor-color="#111111"
            className="underline-sweep"
            style={{
              fontFamily:     'var(--font-mono), "JetBrains Mono", monospace',
              fontSize:        11,
              letterSpacing:   '0.15em',
              color:           'var(--accent)',
              textDecoration:  'none',
              whiteSpace:     'nowrap',
            }}
          >
            → View all projects on GitHub
          </a>
        </div>
      </section>

    </>
  )
}
