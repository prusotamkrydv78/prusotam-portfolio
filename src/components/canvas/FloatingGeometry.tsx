'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.LineSegments>(null)
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useThree(({ gl }) => {
    gl.domElement.addEventListener('mousemove', (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    })
  })

  useFrame(() => {
    if (!meshRef.current || !groupRef.current) return

    meshRef.current.rotation.x += 0.003
    meshRef.current.rotation.y += 0.005
    if (wireRef.current) {
      wireRef.current.rotation.x = meshRef.current.rotation.x
      wireRef.current.rotation.y = meshRef.current.rotation.y
    }

    target.current.x += (mouse.current.x * 0.3 - target.current.x) * 0.05
    target.current.y += (mouse.current.y * 0.3 - target.current.y) * 0.05

    groupRef.current.rotation.y = target.current.x
    groupRef.current.rotation.x = target.current.y
  })

  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.4, 1), [])
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo])

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geo}>
        <meshStandardMaterial
          color="#e8a045"
          transparent
          opacity={0.15}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <lineSegments ref={wireRef} geometry={edgesGeo}>
        <lineBasicMaterial color="#e8a045" transparent opacity={0.6} />
      </lineSegments>

      {/* Particles */}
      <ParticleField />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={4} color="#e8a045" />
      <pointLight position={[-3, -2, -2]} intensity={1} color="#f0ede8" />
    </group>
  )
}

const PARTICLE_COUNT = 200
const PARTICLE_POSITIONS = new Float32Array(PARTICLE_COUNT * 3)
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const r = 3 + Math.random() * 2
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  PARTICLE_POSITIONS[i * 3] = r * Math.sin(phi) * Math.cos(theta)
  PARTICLE_POSITIONS[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
  PARTICLE_POSITIONS[i * 3 + 2] = r * Math.cos(phi)
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PARTICLE_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#f0ede8" size={0.025} sizeAttenuation transparent opacity={0.6} />
    </points>
  )
}
