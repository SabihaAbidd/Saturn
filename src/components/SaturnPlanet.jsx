import { useMemo } from 'react'
import * as THREE from 'three'
import { useSaturnTextures } from '../hooks/useSaturnTextures'

const ATM_VERT = /* glsl */`
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const ATM_FRAG = /* glsl */`
  precision highp float;

  uniform vec3 glowColor;
  uniform vec3 lightDir;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vWorldPos);
    vec3 l = normalize(lightDir);
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.75);
    float lit = smoothstep(-0.35, 0.75, dot(n, l));
    float alpha = fresnel * lit * 0.34;
    gl_FragColor = vec4(glowColor, alpha);
  }
`

const LIGHT_DIRECTION = new THREE.Vector3(-1.25, 0.42, 0.58).normalize()

export default function SaturnPlanet() {
  const { saturnMap } = useSaturnTextures()

  const planetMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: saturnMap,
    color: '#f0c982',
    roughness: 0.64,
    metalness: 0,
    clearcoat: 0.04,
    clearcoatRoughness: 0.78,
    sheen: 0.18,
    sheenColor: new THREE.Color('#d6a766'),
    specularIntensity: 0.24,
    specularColor: new THREE.Color('#ffe1a0'),
    envMapIntensity: 0.38,
  }), [saturnMap])

  const atmosphereMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color('#ffc56e') },
      lightDir: { value: LIGHT_DIRECTION },
    },
    vertexShader: ATM_VERT,
    fragmentShader: ATM_FRAG,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  return (
    <group>
      <mesh castShadow receiveShadow scale={[1, 0.918, 1]} renderOrder={0}>
        <sphereGeometry args={[2, 160, 160]} />
        <primitive object={planetMaterial} attach="material" />
      </mesh>

      <mesh scale={[1.045, 1.045 * 0.918, 1.045]} renderOrder={3}>
        <sphereGeometry args={[2, 96, 96]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </group>
  )
}
