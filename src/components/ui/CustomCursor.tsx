'use client'

import { useEffect, useRef } from 'react'
import { useCursor } from '@/components/providers/CursorProvider'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const { variant } = useCursor()
  const pos = useRef({ x: 0, y: 0 })
  const followerPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      followerPos.current.x = lerp(followerPos.current.x, pos.current.x, 0.1)
      followerPos.current.y = lerp(followerPos.current.y, pos.current.y, 0.1)
      if (followerRef.current) {
        followerRef.current.style.left = `${followerPos.current.x}px`
        followerRef.current.style.top = `${followerPos.current.y}px`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)

    // Add hover listeners to interactive elements
    const addHover = () => {
      document.querySelectorAll('a, button, .magnetic').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          dotRef.current?.classList.add('hover')
          followerRef.current?.classList.add('hover')
        })
        el.addEventListener('mouseleave', () => {
          dotRef.current?.classList.remove('hover')
          followerRef.current?.classList.remove('hover')
        })
      })
    }

    addHover()
    const observer = new MutationObserver(addHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null
  }

  return (
    <>
      <div
        id="custom-cursor"
        ref={dotRef}
        className={variant === 'hover' ? 'hover' : ''}
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}
      />
      <div
        id="cursor-follower"
        ref={followerRef}
        className={variant === 'hover' ? 'hover' : ''}
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9998 }}
      />
    </>
  )
}
