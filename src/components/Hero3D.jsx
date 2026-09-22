import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function Core({ reduced }) {
  const outer = useRef()
  const inner = useRef()
  const group = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const p = state.pointer
    mouse.current.x += (p.x - mouse.current.x) * 0.05
    mouse.current.y += (p.y - mouse.current.y) * 0.05
    if (group.current) {
      group.current.rotation.y = mouse.current.x * 0.6
      group.current.rotation.x = -mouse.current.y * 0.4
    }
    if (!reduced) {
      if (outer.current) {
        outer.current.rotation.x += delta * 0.12
        outer.current.rotation.y += delta * 0.18
      }
      if (inner.current) inner.current.rotation.y -= delta * 0.25
    }
  })

  return (
    <group ref={group}>
      <Float speed={reduced ? 0 : 1.6} rotationIntensity={0.4} floatIntensity={1.1}>
        <mesh ref={inner}>
          <icosahedronGeometry args={[1.05, 8]} />
          <MeshDistortMaterial
            color="#7c5cff"
            emissive="#3a1f8f"
            emissiveIntensity={0.6}
            roughness={0.25}
            metalness={0.7}
            distort={reduced ? 0 : 0.42}
            speed={2.2}
          />
        </mesh>
        <mesh ref={outer} scale={1.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#c4a8ff" wireframe transparent opacity={0.28} />
        </mesh>
        <Rings reduced={reduced} />
      </Float>
    </group>
  )
}

function Rings({ reduced }) {
  const r1 = useRef()
  const r2 = useRef()
  useFrame((_, delta) => {
    if (reduced) return
    if (r1.current) r1.current.rotation.z += delta * 0.35
    if (r2.current) r2.current.rotation.z -= delta * 0.25
  })
  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.07, 16, 16), [])
  return (
    <>
      <group ref={r1} rotation={[Math.PI / 2.6, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[2.35, 0.006, 8, 120]} />
          <meshBasicMaterial color="#b9a1ff" transparent opacity={0.55} />
        </mesh>
        <mesh geometry={dotGeo} position={[2.35, 0, 0]}>
          <meshBasicMaterial color="#e6dbff" />
        </mesh>
      </group>
      <group ref={r2} rotation={[-Math.PI / 3, 0.8, 0]}>
        <mesh>
          <torusGeometry args={[2.85, 0.005, 8, 120]} />
          <meshBasicMaterial color="#ff7ad9" transparent opacity={0.35} />
        </mesh>
        <mesh geometry={dotGeo} position={[-2.85, 0, 0]} scale={0.8}>
          <meshBasicMaterial color="#ffc2ec" />
        </mesh>
      </group>
    </>
  )
}

export default function Hero3D({ reduced }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} color="#e9dcff" />
      <pointLight position={[-5, -3, -4]} intensity={6} color="#ff7ad9" />
      <pointLight position={[3, -4, 3]} intensity={5} color="#7c5cff" />
      <Suspense fallback={null}>
        <Core reduced={reduced} />
        {!reduced && (
          <Sparkles count={70} scale={[7, 6, 4]} size={2.2} speed={0.35} opacity={0.6} color="#d1bdff" />
        )}
      </Suspense>
    </Canvas>
  )
}
