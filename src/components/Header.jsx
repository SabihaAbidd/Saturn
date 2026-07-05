/**
 * Header.jsx
 * Fixed top bar — minimal, editorial, gold on void.
 */
import './Header.css'

export default function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="header-logo">
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="7.5" stroke="#C9A96E" strokeWidth="0.7"/>
          <ellipse cx="9" cy="9" rx="13.5" ry="3.8" stroke="#C9A96E" strokeWidth="0.7" fill="none"/>
        </svg>
        <span>C O S M O S</span>
      </div>
      <button className="header-menu" aria-label="Open menu">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </header>
  )
}
