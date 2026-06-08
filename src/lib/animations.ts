import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const EASE_OUT = 'expo.out'
export const EASE_IN  = 'expo.in'
export const EASE_IO  = 'expo.inOut'

export const DUR_FAST = 0.4
export const DUR_MID  = 0.9
export const DUR_SLOW = 1.3

/**
 * Clip-reveal for headlines.
 * Assumes each word is wrapped:
 *   <div style="overflow:hidden; display:inline-block"><span>word</span></div>
 */
export function textReveal(
  target: string | Element | NodeListOf<Element>,
  options: gsap.TweenVars = {}
) {
  const selector = typeof target === 'string' ? `${target} .reveal-inner` : target
  return gsap.from(selector, {
    y: '105%',
    rotation: 1.5,
    duration: DUR_MID,
    ease: EASE_OUT,
    stagger: 0.05,
    ...options,
  })
}

/** Fade + translate-up, used for body text and secondary elements */
export function fadeUp(
  target: string | Element | NodeListOf<Element>,
  options: gsap.TweenVars = {}
) {
  return gsap.from(target, {
    opacity: 0,
    y: 28,
    duration: DUR_MID,
    ease: EASE_OUT,
    ...options,
  })
}

/** Scroll-triggered fade-up for every section's content */
export function scrollReveal(
  target: string | Element,
  options: gsap.TweenVars = {}
) {
  return gsap.from(target, {
    opacity: 0,
    y: 32,
    duration: DUR_MID,
    ease: EASE_OUT,
    scrollTrigger: {
      trigger: target as Element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    ...options,
  })
}

export { gsap, ScrollTrigger }
