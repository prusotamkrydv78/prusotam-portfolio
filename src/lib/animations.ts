import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const EASE_OUT = 'expo.out'
export const EASE_IN  = 'expo.in'
export const EASE_IO  = 'expo.inOut'

export const DUR_FAST = 0.4
export const DUR_MID  = 0.9
export const DUR_SLOW = 1.3

/* Shared scroll defaults — play forward on enter, reverse on scroll back */
export const ST_REV = {
  start:         'top 82%',
  end:           'top 20%',
} as const

/* ── scrollReveal ── general fade+up ───────────────────────────── */
export function scrollReveal(
  target: string | Element,
  options: gsap.TweenVars & { scrollTrigger?: Partial<ScrollTrigger.Vars> } = {}
) {
  const { scrollTrigger: stOpts, ...tweenOpts } = options as any
  return gsap.from(target, {
    opacity: 0,
    y: 32,
    duration: DUR_MID,
    ease: EASE_OUT,
    scrollTrigger: { trigger: target as Element, ...ST_REV, ...(stOpts || {}) },
    ...tweenOpts,
  })
}

/* ── staggerReveal ── for lists and grids ───────────────────────── */
export function staggerReveal(
  targets: string | Element | NodeListOf<Element>,
  trigger: string | Element,
  options: gsap.TweenVars & { scrollTrigger?: Partial<ScrollTrigger.Vars> } = {}
) {
  const { scrollTrigger: stOpts, ...tweenOpts } = options as any
  return gsap.from(targets, {
    opacity: 0,
    y: 28,
    duration: 0.8,
    ease: EASE_OUT,
    stagger: 0.07,
    scrollTrigger: {
      trigger: trigger as Element,
      start: 'top 80%', end: 'top 15%',
      ...(stOpts || {}),
    },
    ...tweenOpts,
  })
}

/* ── clipReveal ── for headlines (overflow:hidden > [data-line]) ── */
export function clipReveal(
  trigger: string | Element,
  lines: string | Element | NodeListOf<Element>,
  options: gsap.TweenVars & { scrollTrigger?: Partial<ScrollTrigger.Vars> } = {}
) {
  const { scrollTrigger: stOpts, ...tweenOpts } = options as any
  return gsap.fromTo(
    lines,
    { y: '108%', rotation: 1.5, opacity: 0 },
    {
      y: '0%', rotation: 0, opacity: 1,
      duration: 1.0, ease: EASE_OUT, stagger: 0.055,
      scrollTrigger: {
        trigger: trigger as Element,
        start: 'top 85%', end: 'top 10%',
        ...(stOpts || {}),
      },
      ...tweenOpts,
    }
  )
}

/* ── slideIn ── for 1px horizontal rules ───────────────────────── */
export function slideIn(
  target: string | Element,
  from: 'left' | 'right' = 'left',
  options: gsap.TweenVars & { scrollTrigger?: Partial<ScrollTrigger.Vars> } = {}
) {
  const { scrollTrigger: stOpts, ...tweenOpts } = options as any
  return gsap.fromTo(
    target,
    { scaleX: 0 },
    {
      scaleX: 1,
      transformOrigin: from === 'left' ? 'left center' : 'right center',
      duration: 0.9, ease: EASE_OUT,
      scrollTrigger: {
        trigger: target as Element,
        start: 'top 88%', end: 'top 20%',
        ...(stOpts || {}),
      },
      ...tweenOpts,
    }
  )
}

/* ── sectionLabel ── letter-spacing expand on scroll ────────────── */
export function sectionLabel(
  target: string | Element | NodeListOf<Element>,
  trigger: string | Element,
  options: gsap.TweenVars & { scrollTrigger?: Partial<ScrollTrigger.Vars> } = {}
) {
  const { scrollTrigger: stOpts, ...tweenOpts } = options as any
  return gsap.fromTo(
    target,
    { opacity: 0, letterSpacing: '0em' },
    {
      opacity: 1, letterSpacing: '0.15em',
      duration: 0.6, ease: EASE_OUT,
      scrollTrigger: {
        trigger: trigger as Element,
        start: 'top 88%', end: 'top 20%',
        ...(stOpts || {}),
      },
      ...tweenOpts,
    }
  )
}

/* ── textReveal ── legacy helper ───────────────────────────────── */
export function textReveal(
  target: string | Element | NodeListOf<Element>,
  options: gsap.TweenVars = {}
) {
  const selector = typeof target === 'string' ? `${target} .reveal-inner` : target
  return gsap.from(selector, {
    y: '105%', rotation: 1.5,
    duration: DUR_MID, ease: EASE_OUT, stagger: 0.05,
    ...options,
  })
}

/* ── fadeUp ── simple fade + translate ─────────────────────────── */
export function fadeUp(
  target: string | Element | NodeListOf<Element>,
  options: gsap.TweenVars = {}
) {
  return gsap.from(target, {
    opacity: 0, y: 28,
    duration: DUR_MID, ease: EASE_OUT,
    ...options,
  })
}

export { gsap, ScrollTrigger }
