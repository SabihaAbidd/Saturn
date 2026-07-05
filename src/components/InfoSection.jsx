/**
 * InfoSection.jsx
 * The HTML content section below the 3D canvas.
 * All typography — no canvas, no 3D, no overlays.
 */
import { useEffect, useRef } from 'react'
import './InfoSection.css'

/* Mouse icon SVG (drag) */
function IconDrag() {
  return (
    <svg className="ctrl-icon" viewBox="0 0 22 30" fill="none" aria-hidden="true">
      <rect x="3.5" y="1" width="15" height="24" rx="7.5" stroke="#C9A96E" strokeWidth="0.9"/>
      <line x1="11" y1="5.5" x2="11" y2="10.5" stroke="#C9A96E" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  )
}

/* Mouse icon SVG (scroll) */
function IconScroll() {
  return (
    <svg className="ctrl-icon" viewBox="0 0 22 30" fill="none" aria-hidden="true">
      <rect x="3.5" y="1" width="15" height="24" rx="7.5" stroke="#C9A96E" strokeWidth="0.9"/>
      <line x1="11" y1="5.5" x2="11" y2="10.5" stroke="#C9A96E" strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M7 20 L11 24.5 L15 20" stroke="#C9A96E" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
      <path d="M7 15 L11 10.5 L15 15" stroke="#C9A96E" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export default function InfoSection() {
  const sectionRef = useRef(null)

  /* Scroll-triggered reveal for child elements */
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal') ?? []
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.18 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="info-section" ref={sectionRef} aria-label="Saturn information">
      {/* Ambient radial glow */}
      <div className="info-glow" aria-hidden="true" />

      <div className="info-content">
        <p className="eyebrow reveal">THE RINGED GIANT</p>
        <div className="divider reveal" aria-hidden="true" />
        <h1 className="planet-title reveal">SATURN</h1>
        <div className="title-dot reveal" aria-hidden="true" />
        <blockquote className="tagline reveal">
          "The jewel of our solar system."
        </blockquote>
        <p className="description reveal">
          Saturn is the sixth planet from the Sun and is famous<br />
          for its breathtaking ring system made of ice and rock particles.
        </p>
        <div className="controls-row reveal" role="note" aria-label="Interaction hints">
          <div className="ctrl-item">
            <IconDrag />
            <span>DRAG TO ROTATE</span>
          </div>
          <span className="ctrl-dot" aria-hidden="true">·</span>
          <div className="ctrl-item">
            <IconScroll />
            <span>SCROLL TO ZOOM</span>
          </div>
        </div>
      </div>
    </section>
  )
}
