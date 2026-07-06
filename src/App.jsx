import { useEffect, useState } from 'react'
import { Loader, useProgress } from '@react-three/drei'
import SaturnScene from './components/SaturnScene'
import InfoSection from './components/InfoSection'
import './App.css'

function CinematicLoader() {
  const { active, progress } = useProgress()
  const [visible, setVisible] = useState(true)
  const isComplete = !active && (progress >= 100 || progress === 0)

  useEffect(() => {
    if (!isComplete) {
      setVisible(true)
      return undefined
    }

    const timeout = window.setTimeout(() => setVisible(false), 900)
    return () => window.clearTimeout(timeout)
  }, [isComplete])

  if (!visible) return null

  return (
    <div className={`cinematic-loader${isComplete ? ' is-complete' : ''}`} aria-live="polite" aria-label="Loading Saturn experience">
      <div className="loader-orbit" aria-hidden="true">
        <span />
      </div>
      <p className="loader-label">ENTERING ORBIT</p>
      <Loader
        containerStyles={{
          position: 'relative',
          inset: 'auto',
          width: 'min(220px, 58vw)',
          height: 'auto',
          background: 'transparent',
          display: 'block',
          zIndex: 'auto',
          transition: 'none',
        }}
        innerStyles={{
          width: '100%',
          height: 1,
          background: 'rgba(201, 169, 110, 0.18)',
          textAlign: 'center',
          overflow: 'visible',
        }}
        barStyles={{
          height: 1,
          background: '#c9a96e',
          boxShadow: '0 0 16px rgba(201, 169, 110, 0.34)',
          transition: 'transform 280ms ease',
          transformOrigin: 'left center',
        }}
        dataStyles={{
          display: 'inline-block',
          position: 'relative',
          marginTop: '16px',
          color: 'rgba(212, 196, 160, 0.68)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.56rem',
          fontWeight: 300,
          letterSpacing: '0.34em',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
        dataInterpolation={(value) => `${Math.round(value)}%`}
        initialState={() => true}
      />
    </div>
  )
}

export default function App() {
  return (
    <main className="app">
      <CinematicLoader />
      <section className="hero" aria-label="Interactive 3D Saturn visualization">
        <SaturnScene />
      </section>
      <InfoSection />
    </main>
  )
}
