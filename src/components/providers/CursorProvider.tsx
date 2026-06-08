'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type CursorVariant = 'default' | 'hover' | 'hidden'

interface CursorContextType {
  variant: CursorVariant
  setVariant: (v: CursorVariant) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const CursorContext = createContext<CursorContextType>({
  variant: 'default',
  setVariant: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
})

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>('default')

  const onMouseEnter = useCallback(() => setVariant('hover'), [])
  const onMouseLeave = useCallback(() => setVariant('default'), [])

  return (
    <CursorContext.Provider value={{ variant, setVariant, onMouseEnter, onMouseLeave }}>
      {children}
    </CursorContext.Provider>
  )
}

export const useCursor = () => useContext(CursorContext)
