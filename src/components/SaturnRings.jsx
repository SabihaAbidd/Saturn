import { useMemo } from 'react'
import * as THREE from 'three'

const PLANET_RADIUS = 2
const INNER = PLANET_RADIUS * 1.22
const OUTER = PLANET_RADIUS * 2.85
const TILT = THREE.MathUtils.degToRad(-28)

function seeded(index) {
  const s = Math.sin(index * 12.9898) * 43758.5453
  return s - Math.floor(s)
}

function makeRingTexture() {
  const width = 2048
  const height = 32
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(width, height)
  const data = image.data

  const bands = [
    [0.00, 0.07, 0.04, [98, 84, 64]],
    [0.07, 0.17, 0.14, [132, 113, 82]],
    [0.17, 0.34, 0.68, [198, 174, 128]],
    [0.34, 0.47, 0.78, [222, 197, 145]],
    [0.47, 0.515, 0.08, [54, 43, 31]],
    [0.515, 0.545, 0.01, [22, 18, 14]],
    [0.545, 0.70, 0.56, [184, 159, 113]],
    [0.70, 0.84, 0.36, [146, 124, 88]],
    [0.84, 0.96, 0.10, [105, 90, 67]],
    [0.96, 1.00, 0.02, [70, 61, 48]],
  ]

  for (let x = 0; x < width; x++) {
    const r = x / (width - 1)
    const ripple = Math.sin(r * 680) * 0.025 + Math.sin(r * 1550) * 0.014
    const grain = seeded(x) * 0.18 - 0.09
    let color = [0, 0, 0]
    let alpha = 0

    for (const [start, end, peak, c] of bands) {
      if (r >= start && r <= end) {
        const t = (r - start) / (end - start)
        const envelope = Math.sin(t * Math.PI)
        color = c
        alpha = THREE.MathUtils.clamp(peak * envelope + ripple + grain, 0, 0.72)
        break
      }
    }

    for (let y = 0; y < height; y++) {
      const rowNoise = seeded(x * 13 + y * 19) * 18 - 9
      const idx = (y * width + x) * 4
      data[idx + 0] = THREE.MathUtils.clamp(color[0] + rowNoise, 0, 255)
      data[idx + 1] = THREE.MathUtils.clamp(color[1] + rowNoise * 0.85, 0, 255)
      data[idx + 2] = THREE.MathUtils.clamp(color[2] + rowNoise * 0.65, 0, 255)
      data[idx + 3] = Math.round(alpha * 255)
    }
  }

  ctx.putImageData(image, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 12
  return texture
}

function makeRingGeometry() {
  const radialSegments = 96
  const tubularSegments = 768
  const positions = []
  const uvs = []
  const indices = []

  for (let j = 0; j <= radialSegments; j++) {
    const radialT = j / radialSegments
    const radius = THREE.MathUtils.lerp(INNER, OUTER, radialT)

    for (let i = 0; i <= tubularSegments; i++) {
      const angleT = i / tubularSegments
      const angle = angleT * Math.PI * 2
      positions.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      uvs.push(radialT, angleT)
    }
  }

  const row = tubularSegments + 1
  for (let j = 0; j < radialSegments; j++) {
    for (let i = 0; i < tubularSegments; i++) {
      const a = j * row + i
      const b = a + 1
      const c = (j + 1) * row + i
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function makeParticleGeometry() {
  const count = 7200
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const palette = [
    new THREE.Color('#d8bf88'),
    new THREE.Color('#a98f62'),
    new THREE.Color('#f1d89b'),
    new THREE.Color('#75624a'),
  ]

  for (let i = 0; i < count; i++) {
    const cluster = seeded(i * 5) ** 1.8
    const radius = THREE.MathUtils.lerp(INNER + 0.03, OUTER - 0.05, cluster)
    const angle = seeded(i * 7) * Math.PI * 2
    const vertical = (seeded(i * 11) - 0.5) * 0.018
    const arcJitter = (seeded(i * 17) - 0.5) * 0.012
    const finalAngle = angle + arcJitter

    positions[i * 3 + 0] = Math.cos(finalAngle) * radius
    positions[i * 3 + 1] = vertical
    positions[i * 3 + 2] = Math.sin(finalAngle) * radius

    const color = palette[Math.floor(seeded(i * 23) * palette.length)]
    const intensity = 0.45 + seeded(i * 29) * 0.55
    colors[i * 3 + 0] = color.r * intensity
    colors[i * 3 + 1] = color.g * intensity
    colors[i * 3 + 2] = color.b * intensity
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

export default function SaturnRings() {
  const geometry = useMemo(() => makeRingGeometry(), [])
  const particles = useMemo(() => makeParticleGeometry(), [])
  const texture = useMemo(() => makeRingTexture(), [])

  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: texture,
    alphaMap: texture,
    transparent: true,
    opacity: 0.98,
    alphaTest: 0.018,
    side: THREE.DoubleSide,
    depthWrite: false,
    roughness: 0.83,
    metalness: 0,
    transmission: 0,
    clearcoat: 0.08,
    clearcoatRoughness: 0.9,
    color: '#d1b77f',
    emissive: '#2a1d10',
    emissiveIntensity: 0.18,
  }), [texture])

  const depthMaterial = useMemo(() => new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    alphaMap: texture,
    alphaTest: 0.1,
  }), [texture])

  return (
    <group rotation={[TILT, 0, 0]}>
      <mesh
        castShadow
        receiveShadow
        customDepthMaterial={depthMaterial}
        geometry={geometry}
        material={material}
        renderOrder={1}
      />
      <points geometry={particles} renderOrder={2}>
        <pointsMaterial
          vertexColors
          size={0.012}
          sizeAttenuation
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
