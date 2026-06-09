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

export function InteractiveHoverLinks({ links }: InteractiveHoverLinksProps) {
  return (
    <div style={{ width: '100%' }}>
      {links.map((link) => (
        <HoverLink key={link.heading} {...link} />
      ))}
    </div>
  )
}

function HoverLink({ heading, subheading, href }: HoverLinkItem) {
  return (
    <motion.a
      href={href}
      initial="initial"
      whileHover="whileHover"
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
      {/* Left — heading letters + subheading */}
      <div>
        <motion.span
          variants={{
            initial:    { x: 0 },
            whileHover: { x: -16 },
          }}
          transition={{ type: 'spring', staggerChildren: 0.045, delayChildren: 0.15 }}
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
          {heading.split('').map((l, i) => (
            <motion.span
              key={i}
              variants={{
                initial:    { x: 0 },
                whileHover: { x: 16 },
              }}
              transition={{ type: 'spring' }}
              style={{ display: 'inline-block' }}
            >
              {l === ' ' ? ' ' : l}
            </motion.span>
          ))}
        </motion.span>

        <motion.span
          variants={{
            initial:    { opacity: 0.45 },
            whileHover: { opacity: 1 },
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

      {/* Right — arrow slides in on hover */}
      <div style={{ overflow: 'hidden', flexShrink: 0 }}>
        <motion.div
          variants={{
            initial:    { x: '100%', opacity: 0 },
            whileHover: { x: '0%',   opacity: 1 },
          }}
          transition={{ type: 'spring' }}
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
