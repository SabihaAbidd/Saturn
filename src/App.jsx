import SaturnScene from './components/SaturnScene'
import InfoSection from './components/InfoSection'
import './App.css'

export default function App() {
  return (
    <main className="app">
      <section className="hero" aria-label="Interactive 3D Saturn visualization">
        <SaturnScene />
      </section>
      <InfoSection />
    </main>
  )
}
