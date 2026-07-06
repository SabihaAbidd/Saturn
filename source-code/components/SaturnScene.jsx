import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

import CosmicBackdrop from './CosmicBackdrop'
import SaturnPlanet from './SaturnPlanet'
import SaturnRings from './SaturnRings'
import SceneLighting from './SceneLighting'

export default function SaturnScene() {
  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.96,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{
        fov: 36,
        near: 0.1,
        far: 2000,
        position: [0, 2.05, 9.2],
      }}
      style={{ background: '#03040a' }}
    >
      <color attach="background" args={['#03040a']} />
      <Environment resolution={256}>
        <Lightformer form="circle" color="#ffd08c" intensity={4.2} scale={7} position={[-8, 5, 3]} />
        <Lightformer form="rect" color="#6a7da2" intensity={0.7} scale={[8, 3, 1]} position={[6, 2, -8]} />
        <Lightformer form="ring" color="#c07b35" intensity={0.35} scale={5} position={[-2, -4, -5]} />
      </Environment>

      <SceneLighting />
      <CosmicBackdrop />

      <Stars
        radius={340}
        depth={95}
        count={4000}
        factor={0.95}
        saturation={0.04}
        fade
        speed={0.08}
      />
      <Stars
        radius={260}
        depth={70}
        count={180}
        factor={3.6}
        saturation={0.45}
        fade
        speed={0.04}
      />

      <SaturnPlanet />
      <SaturnRings />

      <OrbitControls
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={7.6}
        maxDistance={14.5}
        autoRotate
        autoRotateSpeed={0.18}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.045}
      />

      <EffectComposer>
        <Bloom
          intensity={0.62}
          luminanceThreshold={0.82}
          luminanceSmoothing={0.28}
          mipmapBlur
          blendFunction={BlendFunction.ADD}
        />
        <Vignette
          offset={0.28}
          darkness={0.78}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Canvas>
  )
}
