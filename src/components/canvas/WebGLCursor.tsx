'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
/* ── GLSL ── */
const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
uniform vec2  uMouse;
uniform vec2  uResolution;
uniform float uTime;

// Simplex-style smooth noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

void main() {
  vec2 uv   = gl_FragCoord.xy / uResolution;
  vec2 mouse = uMouse;

  float n    = noise(uv * 3.0 + uTime * 0.5) * 0.05;
  float dist = length(uv - mouse) + n;

  // soft blob
  float blob = smoothstep(0.10, 0.0, dist);

  // accent mint-green: #00E5A0
  vec3  color = vec3(0.0, 0.898, 0.627);
  float alpha = blob * 0.55;

  gl_FragColor = vec4(color, alpha);
}
`

function BlobMesh({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { size } = useThree()
  const uMouse  = useRef(new THREE.Vector2(0.5, 0.5))
  const matRef  = useRef<THREE.ShaderMaterial>(null)

  useEffect(() => {
    if (!matRef.current) return
    matRef.current.uniforms.uResolution.value.set(size.width, size.height)
  }, [size])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    // lerp mouse position
    uMouse.current.x += (mouse.current.x - uMouse.current.x) * 0.08
    uMouse.current.y += (mouse.current.y - uMouse.current.y) * 0.08
    matRef.current.uniforms.uMouse.value.copy(uMouse.current)
    matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        uniforms={{
          uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uTime:       { value: 0 },
        }}
      />
    </mesh>
  )
}

export default function WebGLCursor() {
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen',
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: false }}
        style={{ width: '100%', height: '100%' }}
        camera={{ near: 0.1, far: 10, position: [0, 0, 1] }}
      >
        <BlobMesh mouse={mouseRef} />
      </Canvas>
    </div>
  )
}
