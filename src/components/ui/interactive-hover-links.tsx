'use client'

import { motion } from "framer-motion"
import { ArrowRight } from 'lucide-react'

export interface HoverLinkItem {
  heading: string
  subheading: string
  imgSrc: string
  href: string
}

interface InteractiveHoverLinksProps {
  links: HoverLinkItem[]
}

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
const SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const

export function InteractiveHoverLinks({ links }: InteractiveHoverLinksProps) {
  return (
    <div style={{ width: '100%' }}>
      {links.map((link, i) => (
        <HoverLink key={link.heading} {...link} index={i} />
      ))}
    </div>
  )
}

function HoverLink({ heading, subheading, href, index }: HoverLinkItem & { index: number }) {
  return (
    <motion.a
      href={href}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: '-80px' }}
      style={{
        position:       'relative',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        borderBottom:   '1px solid var(--line)',
        paddingTop:     40,
        paddingBottom:  40,
        textDecoration: 'none',
        cursor:         'pointer',
      }}
    >
      <div>
        {/* Heading — chars rise up on scroll, shift right on hover */}
        <motion.span
          variants={{
            hidden:   {},
            visible:  { transition: { staggerChildren: 0.038, delayChildren: index * 0.1 } },
            hover:    { x: -16, transition: SPRING },
          }}
          style={{
            display:       'block',
            fontFamily:    'var(--font-clash), Syne, sans-serif',
            fontWeight:    700,
            fontSize:      'clamp(28px, 4vw, 52px)',
            lineHeight:    1.1,
            letterSpacing: '-0.02em',
            color:         'var(--text-secondary)',
            transition:    'color 0.3s ease',
          }}
          className="ihl-heading"
        >
          {heading.split('').map((l, ci) => (
            <motion.span
              key={ci}
              variants={{
                hidden:   { y: 28, opacity: 0 },
                visible:  { y: 0,  opacity: 1, transition: { ease: EASE_EXPO, duration: 0.65 } },
                hover:    { x: 16, transition: SPRING },
              }}
              style={{ display: 'inline-block' }}
            >
              {l === ' ' ? ' ' : l}
            </motion.span>
          ))}
        </motion.span>

        {/* Subheading — fades up after chars */}
        <motion.span
          variants={{
            hidden:   { opacity: 0, y: 10 },
            visible:  { opacity: 0.45, y: 0, transition: { ease: EASE_EXPO, duration: 0.5, delay: index * 0.1 + 0.32 } },
            hover:    { opacity: 1 },
          }}
          style={{
            marginTop:  8,
            display:    'block',
            fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
            fontSize:   14,
            color:      'var(--text-secondary)',
          }}
        >
          {subheading}
        </motion.span>
      </div>

      {/* Arrow — slides in on hover only */}
      <div style={{ overflow: 'hidden', flexShrink: 0 }}>
        <motion.div
          variants={{
            hidden:   { x: '100%', opacity: 0 },
            visible:  { x: '100%', opacity: 0 },
            hover:    { x: '0%',   opacity: 1, transition: SPRING },
          }}
          style={{ padding: 16 }}
        >
          <ArrowRight size={32} color="var(--accent)" />
        </motion.div>
      </div>

      <style>{`
        a:hover .ihl-heading { color: var(--text-primary) !important; }
      `}</style>
    </motion.a>
  )
}
