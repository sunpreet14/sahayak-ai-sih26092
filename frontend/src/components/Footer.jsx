import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h3 className="footer__title">SchemeConnect</h3>
            <p className="footer__desc">
              AI-powered platform connecting marginalized entrepreneurs
              with government financial assistance schemes.
            </p>
            <p className="footer__org">
              An initiative under NSFDC, Ministry of Social Justice & Empowerment
            </p>
          </div>

          <div className="footer__links">
            <h4 className="footer__heading">Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/profile">Find Schemes</Link>
            <Link to="/calculator">EMI Calculator</Link>
            <Link to="/partners">Channel Partners</Link>
          </div>

          <div className="footer__links">
            <h4 className="footer__heading">Resources</h4>
            <a href="#about">About NSFDC</a>
            <a href="#schemes">All Schemes</a>
            <a href="#faq">FAQs</a>
            <a href="#contact">Contact Us</a>
          </div>

          <div className="footer__links">
            <h4 className="footer__heading">Help</h4>
            <a href="#grievance">Grievance Portal</a>
            <a href="#toll-free">Toll Free: 1800-XXX-XXXX</a>
            <a href="#email">Email Support</a>
            <a href="#accessibility">Accessibility</a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__disclaimer">
            Prototype developed for Smart India Hackathon 2026. Not an official government website.
          </p>
          <p className="footer__copyright">
            © 2026 SchemeConnect — Smart India Hackathon Prototype
          </p>
        </div>
      </div>
    </footer>
  );
}
