import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <div className="navbar__logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
              <path d="M8 22V14L16 8L24 14V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 22V17H19V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="13" r="2" fill="white" opacity="0.8"/>
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#1e4d7b" />
                  <stop offset="1" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__name">SchemeConnect</span>
            <span className="navbar__tagline">NSFDC Digital Portal</span>
          </div>
        </Link>

        <nav className="navbar__nav">
          <Link to="/home" className={`navbar__link ${location.pathname === '/home' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/auth" className={`navbar__link ${location.pathname === '/auth' || location.pathname === '/profile' ? 'active' : ''}`}>
            Find Schemes
          </Link>
          <Link to="/calculator" className={`navbar__link ${location.pathname === '/calculator' ? 'active' : ''}`}>
            EMI Calculator
          </Link>
          <Link to="/partners" className={`navbar__link ${location.pathname === '/partners' ? 'active' : ''}`}>
            Partners
          </Link>
        </nav>

        <div className="navbar__actions">
          <div className="navbar__lang">
            <span className="navbar__lang-icon">🌐</span>
            <select className="navbar__lang-select" defaultValue="en">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
              <option value="ta">தமிழ்</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
