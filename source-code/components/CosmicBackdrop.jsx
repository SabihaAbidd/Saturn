import { useMemo } from 'react'
import * as THREE from 'three'

function makeRadialTexture({
  inner = '#fff3c4',
  middle = '#e59c3f',
  outer = 'rgba(0,0,0,0)',
  size = 512,
  radius = 0.5,
}) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    0,
    size * 0.5,
    size * 0.5,
    size * radius,
  )

  gradient.addColorStop(0.0, inner)
  gradient.addColorStop(0.14, middle)
  gradient.addColorStop(0.44, 'rgba(189, 104, 35, 0.18)')
  gradient.addColorStop(1.0, outer)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeNebulaTexture() {
  const size = 768
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, size, size)

  const warm = ctx.createRadialGradient(size * 0.58, size * 0.48, 0, size * 0.58, size * 0.48, size * 0.58)
  warm.addColorStop(0.0, 'rgba(255, 199, 104, 0.32)')
  warm.addColorStop(0.2, 'rgba(177, 96, 40, 0.16)')
  warm.addColorStop(0.62, 'rgba(79, 50, 33, 0.06)')
  warm.addColorStop(1.0, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = warm
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 180; i++) {
    const x = size * (0.2 + Math.random() * 0.7)
    const y = size * (0.08 + Math.random() * 0.82)
    const alpha = Math.random() * 0.05
    ctx.fillStyle = `rgba(255, 209, 126, ${alpha})`
    ctx.fillRect(x, y, Math.random() * 2.2 + 0.4, Math.random() * 2.2 + 0.4)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function CosmicBackdrop() {
  const sunTexture = useMemo(() => makeRadialTexture({}), [])
  const nebulaTexture = useMemo(() => makeNebulaTexture(), [])

  return (
    <>
      <sprite position={[-13.2, 6.4, -22]} scale={[11, 11, 1]} renderOrder={-20}>
        <spriteMaterial
          map={sunTexture}
          color="#ffc46e"
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      <sprite position={[9.2, 1.05, -31]} scale={[16, 10, 1]} renderOrder={-30}>
        <spriteMaterial
          map={nebulaTexture}
          color="#e6a451"
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>
    </>
  )
}
