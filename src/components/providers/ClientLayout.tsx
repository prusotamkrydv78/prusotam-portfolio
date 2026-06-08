'use client'

import dynamic from 'next/dynamic'
import LenisProvider from './LenisProvider'

const WebGLCursor = dynamic(
  () => import('@/components/canvas/WebGLCursor'),
  { ssr: false }
)

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <WebGLCursor />
      {children}
    </LenisProvider>
  )
}
