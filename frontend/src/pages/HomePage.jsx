import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-pattern" />
        <div className="container hero__container">
          <div className="hero__content animate-fade-in-up">
            <div className="hero__badge" style={{ display: 'none' }}></div>
            <h1 className="hero__title">
              Find Government Schemes
              <span className="hero__title-accent"> You're Eligible For</span>
            </h1>
            <p className="hero__subtitle">
              Connecting marginalized entrepreneurs with the right government financial assistance —
              personalized, transparent, and accessible in your language.
            </p>
            <div className="hero__actions">
              <a href="/sahayak/index.html" className="btn btn--cta btn--lg">
                Get Started
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#how-it-works" className="btn btn--secondary btn--lg">
                How It Works
              </a>
            </div>
            <div className="hero__trust">
              <div className="hero__trust-item">
                <span className="hero__trust-number">5</span>
                <span className="hero__trust-label">Schemes (Demo)</span>
              </div>
              <div className="hero__trust-divider" />
              <div className="hero__trust-item">
                <span className="hero__trust-number">8</span>
                <span className="hero__trust-label">Partners (Demo)</span>
              </div>
              <div className="hero__trust-divider" />
              <div className="hero__trust-item">
                <span className="hero__trust-number">₹20L</span>
                <span className="hero__trust-label">Max Assistance</span>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
              * Data shown is for prototype demonstration purposes
            </div>
          </div>
          <div className="hero__visual animate-fade-in-up animate-delay-2">
            <div className="hero__card-stack">
              <div className="hero__float-card hero__float-card--1">
                <span className="hero__float-icon">🏦</span>
                <div>
                  <strong>Term Loan Scheme</strong>
                  <span>94% Match</span>
                </div>
              </div>
              <div className="hero__float-card hero__float-card--2">
                <span className="hero__float-icon">📊</span>
                <div>
                  <strong>EMI: ₹8,542/mo</strong>
                  <span>6% Interest Rate</span>
                </div>
              </div>
              <div className="hero__float-card hero__float-card--3 hero__typing-card">
                <span className="hero__float-icon">💬</span>
                <div className="hero__typing-container">
                  <span className="hero__typing-text">Mujhe ₹2 lakh ka loan chahiye apna tailoring business start karne ke liye.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works section" id="how-it-works">
        <div className="container text-center">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle" style={{ margin: '0 auto var(--space-12)' }}>
            Three simple steps to discover and access government schemes designed for you
          </p>
          <div className="steps-grid">
            <div className="step-card animate-fade-in-up animate-delay-1">
              <div className="step-card__number">1</div>
              <div className="step-card__icon">📝</div>
              <h3 className="step-card__title">Tell Us About You</h3>
              <p className="step-card__desc">
                Share your basic details or simply describe your situation in your own words — we understand Hindi, Punjabi, and more.
              </p>
            </div>
            <div className="step-card animate-fade-in-up animate-delay-2">
              <div className="step-card__number">2</div>
              <div className="step-card__icon">🤖</div>
              <h3 className="step-card__title">AI Checks Eligibility</h3>
              <p className="step-card__desc">
                Our AI matches your profile against all available schemes and gives you personalized recommendations with match scores.
              </p>
            </div>
            <div className="step-card animate-fade-in-up animate-delay-3">
              <div className="step-card__number">3</div>
              <div className="step-card__icon">🎯</div>
              <h3 className="step-card__title">Get Guidance</h3>
              <p className="step-card__desc">
                View detailed scheme info, calculate your EMI, find the nearest channel partner, and understand the exact documents you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features section section--alt">
        <div className="container">
          <div className="features__grid">
            <div className="features__content">
              <h2 className="section-title">Built for Those Who Need It Most</h2>
              <p className="section-subtitle">
                Designed specifically for marginalized entrepreneurs who face barriers accessing financial support.
              </p>
              <div className="features__list">
                <div className="feature-item">
                  <div className="feature-item__icon">🌐</div>
                  <div>
                    <h4 className="feature-item__title">Multilingual Support</h4>
                    <p className="feature-item__desc">Describe your needs in Hindi, Punjabi, Tamil, or any language you're comfortable with.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-item__icon">🔍</div>
                  <div>
                    <h4 className="feature-item__title">Transparent Eligibility</h4>
                    <p className="feature-item__desc">See exactly why you qualify or don't — no hidden criteria, no confusion.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-item__icon">📍</div>
                  <div>
                    <h4 className="feature-item__title">Partner Locator</h4>
                    <p className="feature-item__desc">Find SCAs, NGOs, and MFIs near you that can process your application.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-item__icon">🧮</div>
                  <div>
                    <h4 className="feature-item__title">Financial Planning</h4>
                    <p className="feature-item__desc">Calculate EMI, understand moratorium periods, and plan repayments before you apply.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="features__visual">
              <div className="features__phone">
                <div className="features__phone-notch" />
                <div className="features__phone-screen">
                  <div className="features__phone-content">
                    <div className="mini-card">
                      <span className="mini-card__match">94%</span>
                      <span className="mini-card__name">Term Loan Scheme</span>
                      <span className="mini-card__detail">₹15L • 6% • 10 years</span>
                    </div>
                    <div className="mini-card">
                      <span className="mini-card__match">87%</span>
                      <span className="mini-card__name">Micro Credit Finance</span>
                      <span className="mini-card__detail">₹2L • 5% • 3 years</span>
                    </div>
                    <div className="mini-card">
                      <span className="mini-card__match">82%</span>
                      <span className="mini-card__name">Green Business Loan</span>
                      <span className="mini-card__detail">₹10L • 5% • 8 years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section">
        <div className="container text-center">
          <div className="cta-box">
            <h2 className="cta-box__title">Build or Complete Your Profile</h2>
            <p className="cta-box__desc">
              Keep your details updated for future reference and accurate scheme recommendations.
            </p>
            <Link to="/profile" className="btn btn--cta btn--lg">
              Complete Profile
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
