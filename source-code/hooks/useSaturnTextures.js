import { useMemo } from 'react'
import * as THREE from 'three'

function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123
  return s - Math.floor(s)
}

function noise(x, y) {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)

  const a = hash(i + j * 57)
  const b = hash(i + 1 + j * 57)
  const c = hash(i + (j + 1) * 57)
  const d = hash(i + 1 + (j + 1) * 57)
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(a, b, u),
    THREE.MathUtils.lerp(c, d, u),
    v,
  )
}

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

function mixColor(a, b, t) {
  return [
    THREE.MathUtils.lerp(a[0], b[0], t),
    THREE.MathUtils.lerp(a[1], b[1], t),
    THREE.MathUtils.lerp(a[2], b[2], t),
  ]
}

function buildSaturnMap() {
  const width = 2048
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(width, height)
  const data = image.data

  const palette = [
    hexToRgb('#e8d2a2'),
    hexToRgb('#c99a5e'),
    hexToRgb('#f1dcaa'),
    hexToRgb('#9e6f3d'),
    hexToRgb('#d9b071'),
    hexToRgb('#7d5836'),
    hexToRgb('#f4e2bc'),
  ]

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1)
    const latitude = Math.abs(v - 0.5) * 2
    const broad = (
      Math.sin(v * 38.0 + 0.7) * 0.5 +
      Math.sin(v * 81.0 + 1.8) * 0.27 +
      Math.sin(v * 151.0) * 0.12 +
      0.5
    )

    const bandIndex = Math.floor(THREE.MathUtils.clamp(broad, 0, 0.999) * (palette.length - 1))
    const nextIndex = Math.min(palette.length - 1, bandIndex + 1)
    const colorT = THREE.MathUtils.smoothstep(broad * (palette.length - 1) - bandIndex, 0, 1)
    const base = mixColor(palette[bandIndex], palette[nextIndex], colorT)

    for (let x = 0; x < width; x++) {
      const u = x / (width - 1)
      const wave = Math.sin(u * 34 + v * 22) * 0.012 + Math.sin(u * 91 + v * 47) * 0.005
      const streak = noise(u * 36, v * 460 + wave * 140) * 2 - 1
      const fine = noise(u * 260, v * 900) * 2 - 1
      const microBand = Math.sin((v + wave) * 420.0) * 0.04
      const stormTrace = Math.sin(u * 25.0 + noise(v * 90, 1.3) * 8.0) * 0.018
      const polarShade = THREE.MathUtils.smoothstep(0.68, 1.0, latitude) * 0.34
      const brightness = 1.0 + streak * 0.075 + fine * 0.025 + microBand + stormTrace - polarShade

      const idx = (y * width + x) * 4
      data[idx + 0] = THREE.MathUtils.clamp(base[0] * brightness, 0, 255)
      data[idx + 1] = THREE.MathUtils.clamp(base[1] * brightness, 0, 255)
      data[idx + 2] = THREE.MathUtils.clamp(base[2] * brightness, 0, 255)
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(image, 0, 0)

  const haze = ctx.createLinearGradient(0, 0, 0, height)
  haze.addColorStop(0, 'rgba(60, 36, 18, 0.22)')
  haze.addColorStop(0.25, 'rgba(255, 232, 188, 0.05)')
  haze.addColorStop(0.55, 'rgba(255, 228, 170, 0.08)')
  haze.addColorStop(1, 'rgba(47, 27, 12, 0.28)')
  ctx.fillStyle = haze
  ctx.fillRect(0, 0, width, height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
  return texture
}

let cache = null

function getTextures() {
  if (!cache) {
    cache = { saturnMap: buildSaturnMap() }
  }
  return cache
}

export function useSaturnTextures() {
  return useMemo(() => getTextures(), [])
}
