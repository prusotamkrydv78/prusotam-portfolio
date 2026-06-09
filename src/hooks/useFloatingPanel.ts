import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function useFloatingPanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  const targetX  = useRef(0)
  const targetY  = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)
  const rafId    = useRef<number | undefined>(undefined)

  const onMouseMove = useRef((e: MouseEvent) => {
    targetX.current = e.clientX
    targetY.current = e.clientY
  })

  const startTracking = () => {
    const loop = () => {
      currentX.current += (targetX.current - currentX.current) * 0.1
      currentY.current += (targetY.current - currentY.current) * 0.1
      if (panelRef.current) {
        // Use gsap.set so GSAP owns all transform components — no conflict with scale
        gsap.set(panelRef.current, {
          x: currentX.current,
          y: currentY.current,
          xPercent: -50,
          yPercent: -60,
        })
      }
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
  }

  const stopTracking = () => {
    if (rafId.current !== undefined) {
      cancelAnimationFrame(rafId.current)
      rafId.current = undefined
    }
  }

  const showPanel = (e?: { clientX: number; clientY: number }) => {
    if (!panelRef.current) return
    if (e) {
      targetX.current  = e.clientX
      targetY.current  = e.clientY
      currentX.current = e.clientX
      currentY.current = e.clientY
    }
    // Position panel immediately at cursor — GSAP owns x/y/xPercent/yPercent
    // so the following fromTo (scale+opacity) merges cleanly with the position
    gsap.set(panelRef.current, {
      x: currentX.current,
      y: currentY.current,
      xPercent: -50,
      yPercent: -60,
    })
    window.addEventListener('mousemove', onMouseMove.current)
    startTracking()
    gsap.fromTo(
      panelRef.current,
      { scale: 0.85, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'expo.out' }
    )
  }

  const hidePanel = () => {
    if (!panelRef.current) return
    window.removeEventListener('mousemove', onMouseMove.current)
    stopTracking()
    gsap.to(panelRef.current, { scale: 1.05, autoAlpha: 0, duration: 0.25, ease: 'expo.in' })
  }

  useEffect(() => {
    const handler = onMouseMove.current
    return () => {
      stopTracking()
      window.removeEventListener('mousemove', handler)
    }
  }, [])

  return { panelRef, showPanel, hidePanel }
}
