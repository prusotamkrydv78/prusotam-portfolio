'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import FloatingGeometry from './FloatingGeometry'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <FloatingGeometry />
      </Suspense>
    </Canvas>
  )
}
