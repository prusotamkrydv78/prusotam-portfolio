'use client'

import LenisProvider from './LenisProvider'
import Cursor from '@/components/ui/Cursor'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <Cursor />
      {children}
    </LenisProvider>
  )
}
