'use client'

import { useRef, useState, useCallback } from 'react'

const CHARS = '!@#$%^&*<>?/|ABCDEFabcdef0123456789'

interface ScrambleTextProps {
  text: string
  className?: string
  triggerOnMount?: boolean
}

export default function ScrambleText({ text, className = '', triggerOnMount = false }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    let iteration = 0
    intervalRef.current = setInterval(() => {
      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i < iteration) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      iteration += 0.5
      if (iteration >= text.length) {
        clearInterval(intervalRef.current!)
        setDisplay(text)
      }
    }, 40)
  }, [text])

  return (
    <span className={className} onMouseEnter={scramble}>
      {display}
    </span>
  )
}
