export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.045} color="#5e4733" />
      <directionalLight
        color="#ffd08a"
        intensity={5.4}
        position={[-8.5, 5.2, 4.6]}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={1}
        shadow-camera-far={42}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.00035}
        shadow-radius={7}
      />
      <directionalLight color="#b77638" intensity={0.26} position={[-4, -3, -4]} />
      <directionalLight color="#53688d" intensity={0.18} position={[7, 2, -8]} />
    </>
  )
}
