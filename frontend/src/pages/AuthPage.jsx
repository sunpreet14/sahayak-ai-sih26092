import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (sessionStorage.getItem('isAuthenticated') === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (isLogin) {
      // ─── LOGIN FLOW ─────────────────────────────
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Login failed');
          setLoading(false);
          return;
        }

        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('user', JSON.stringify(data.user));

        navigate('/home');
      } catch (err) {
        console.error('Login error:', err);
        setError('Unable to connect to backend server. Make sure server is running on port 5000.');
      }
    } else {
      // ─── REGISTRATION FLOW ──────────────────────
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            mobile: formData.mobile.trim(),
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Registration failed');
          setLoading(false);
          return;
        }

        // Auto login on successful registration and navigate home
        sessionStorage.setItem('isAuthenticated', 'true');
        if (data.user) {
          sessionStorage.setItem('user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('user', JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
          }));
        }

        navigate('/home');
      } catch (err) {
        console.error('Registration error:', err);
        setError('Unable to connect to backend server. Make sure server is running on port 5000.');
      }
    }

    setLoading(false);
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMsg('');
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        
        {/* Left Visual Panel */}
        <div className="auth-visual">
          <div className="auth-visual__gov-header">
            <span className="gov-emblem">🏛️</span>
            <div className="gov-text">
              <span className="gov-text-en">GOVERNMENT OF INDIA</span>
              <span className="gov-text-dept">Ministry of Social Justice & Empowerment</span>
            </div>
          </div>
          
          <div className="auth-visual__content">
            <h2 className="auth-visual__title">Empowering Marginalized Entrepreneurs</h2>
            <p className="auth-visual__subtitle">
              Secure access to NSFDC financial assistance programs, subsidies, and schemes tailored to your profile.
            </p>
            <div className="auth-visual__stats">
              <div className="auth-stat">
                <strong>₹20L</strong>
                <span>Max Assistance</span>
              </div>
              <div className="auth-stat">
                <strong>4-6%</strong>
                <span>Interest Rates</span>
              </div>
            </div>
          </div>
          
          <div className="auth-visual__footer">
            <span className="trust-badge">✓ Secure Government Portal</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <h2 className="auth-title">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Login to access your personalized schemes' 
                : 'Register to check your eligibility for government schemes'}
            </p>

            {/* Error Message */}
            {error && (
              <div className="auth-error">
                ⚠️ {error}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                color: '#15803d',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✅ {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group form-group--floating">
                  <input 
                    type="text" 
                    name="name" 
                    className="form-input" 
                    placeholder=" " 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                  <label className="form-label">Full Name as per Aadhaar</label>
                </div>
              )}

              <div className="form-group form-group--floating">
                <input 
                  type="email" 
                  name="email" 
                  className="form-input" 
                  placeholder=" " 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
                <label className="form-label">Email Address</label>
              </div>

              {!isLogin && (
                <div className="form-group form-group--floating">
                  <input 
                    type="tel" 
                    name="mobile" 
                    className="form-input" 
                    placeholder=" " 
                    pattern="[0-9]{10}"
                    value={formData.mobile}
                    onChange={handleChange}
                    required 
                  />
                  <label className="form-label">Mobile Number (Aadhaar linked)</label>
                </div>
              )}

              <div className="form-group form-group--floating">
                <input 
                  type="password" 
                  name="password" 
                  className="form-input" 
                  placeholder=" " 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <label className="form-label">Password</label>
              </div>

              <button 
                type="submit" 
                className="btn btn--cta btn--full auth-btn"
                disabled={loading}
                style={loading ? { opacity: 0.7, cursor: 'wait' } : {}}
              >
                {loading 
                  ? '⏳ Please wait...' 
                  : (isLogin ? 'Login to Portal' : 'Register & Continue')
                }
              </button>
            </form>

            <div className="auth-toggle">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={handleToggle} className="auth-toggle-btn">
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
