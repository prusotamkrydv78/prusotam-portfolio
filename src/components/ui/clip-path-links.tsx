'use client'

import React from 'react'
import { useAnimate } from 'framer-motion'

/* ── Clip-path constants ─────────────────────────────────────── */
export const NO_CLIP           = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
export const BOTTOM_RIGHT_CLIP = 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)'
export const TOP_RIGHT_CLIP    = 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
export const BOTTOM_LEFT_CLIP  = 'polygon(0 100%, 0 100%, 0 100%, 0 100%)'
export const TOP_LEFT_CLIP     = 'polygon(0 0, 0 0, 0 100%, 0 100%)'

export type Corner = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

export const ENTRANCE_KEYFRAMES: Record<Corner, string[]> = {
  bottomLeft:  [BOTTOM_LEFT_CLIP,  NO_CLIP],
  bottomRight: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  topLeft:     [TOP_LEFT_CLIP,     NO_CLIP],
  topRight:    [TOP_RIGHT_CLIP,    NO_CLIP],
}

export const EXIT_KEYFRAMES: Record<Corner, string[]> = {
  bottomLeft:  [NO_CLIP, BOTTOM_LEFT_CLIP],
  bottomRight: [NO_CLIP, BOTTOM_RIGHT_CLIP],
  topLeft:     [NO_CLIP, TOP_LEFT_CLIP],
  topRight:    [NO_CLIP, TOP_RIGHT_CLIP],
}

/* ── Corner detection ────────────────────────────────────────── */
function getCorner(e: React.MouseEvent, elem: Element): Corner {
  const { clientX, clientY } = e
  const { left, top, width, height } = elem.getBoundingClientRect()
  const isLeft = clientX < left + width  / 2
  const isTop  = clientY < top  + height / 2
  if (isLeft  && isTop)  return 'topLeft'
  if (!isLeft && isTop)  return 'topRight'
  if (isLeft)            return 'bottomLeft'
  return 'bottomRight'
}

/* ── Types ───────────────────────────────────────────────────── */
export interface LinkBoxProps {
  Icon?: React.ComponentType<{ className?: string }>
  href: string
  label?: React.ReactNode
  labelHover?: React.ReactNode
  download?: boolean
  className?: string
  target?: string
  rel?: string
}

/* ── LinkBox ─────────────────────────────────────────────────── */
export function LinkBox({
  Icon, href, label, labelHover, download, className = '',
  target, rel,
}: LinkBoxProps) {
  const [scope, animate] = useAnimate()

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const corner = getCorner(e, e.currentTarget)
    animate(scope.current, { clipPath: ENTRANCE_KEYFRAMES[corner] }, {
      duration: 0.4, ease: [0.25, 1, 0.5, 1],
    })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const corner = getCorner(e, e.currentTarget)
    animate(scope.current, { clipPath: EXIT_KEYFRAMES[corner] }, {
      duration: 0.4, ease: [0.25, 1, 0.5, 1],
    })
  }

  const defaultContent = Icon
    ? <Icon className="w-5 h-5" />
    : <span style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>

  const hoverContent = Icon
    ? <Icon className="w-5 h-5" />
    : <span style={{ fontFamily: 'var(--font-mono),"JetBrains Mono",monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{labelHover ?? label}</span>

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      {...(download ? { download: true } : {})}
      className={`relative grid h-20 w-full place-content-center ${className}`}
      style={{ background: '#111111', color: 'rgba(248,245,240,0.45)', cursor: 'none' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {defaultContent}

      {/* Hover overlay — wipes in from the entry corner */}
      <div
        ref={scope}
        className="absolute inset-0 grid place-content-center transition-colors duration-300 pointer-events-none"
        style={{ clipPath: BOTTOM_RIGHT_CLIP, background: '#FF4D00', color: '#111111' }}
      >
        {hoverContent}
      </div>
    </a>
  )
}
