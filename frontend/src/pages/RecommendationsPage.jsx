import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import SchemeCard from '../components/SchemeCard';
import { schemes } from '../data/schemes';
import { matchScheme, parseNaturalLanguage } from '../utils/matchEngine';
import './RecommendationsPage.css';

const STEPS = ['Your Profile', 'Check Eligibility', 'Get Guidance'];

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState(null);
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const authenticated = sessionStorage.getItem('isAuthenticated');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (authenticated !== 'true' || !user.id) {
      navigate('/auth');
      return;
    }
    fetch(`http://localhost:5000/api/profile/${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (!data.user) throw new Error('Profile not found');
        const u = data.user;
        setProfile({
          ...u,
          category: u.category || 'SC',
          age: Number(u.age || 30),
          familyIncome: Number(u.familyIncome || 0),
          projectCost: Number(u.projectCost || 0),
        });
      })
      .catch(err => {
        console.error(err);
        alert('Please complete your profile first.');
        navigate('/profile');
      });
  }, [navigate]);

  const getRecommendations = () => {
    if (!profile) return;
    setLoading(true);

    setTimeout(() => {
      const parsed = condition.trim() ? parseNaturalLanguage(condition) : {};
      const combined = {
        ...profile,
        ...parsed,
        familyIncome: profile.familyIncome,
        age: profile.age,
        category: profile.category,
        state: profile.state,
        district: profile.district,
        education: profile.education,
        projectCost: parsed.projectCost || profile.projectCost,
        purpose: parsed.purpose || profile.purpose,
      };

      const matched = schemes.map(scheme => ({
        scheme,
        matchResult: matchScheme(combined, scheme),
      })).sort((a, b) => b.matchResult.matchPercentage - a.matchResult.matchPercentage);

      setResults(matched);
      setLoaded(true);
      setLoading(false);
    }, 900);
  };

  if (!profile || loading) {
    return (
      <div className="recommendations-page">
        <div className="container">
          <StepIndicator steps={STEPS} currentStep={1} />
          <div className="loading-state text-center">
            <div className="loading-state__spinner" />
            <h2 className="loading-state__title">
              {loading ? 'Analyzing Your Situation' : 'Loading Your Profile'}
            </h2>
            <p className="loading-state__desc">
              {loading
                ? 'Combining your saved profile with your request and checking government schemes...'
                : 'Fetching your saved details from MongoDB...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="recommendations-page">
        <div className="container">
          <StepIndicator steps={STEPS} currentStep={1} />
          <div className="recommendations-page__header animate-fade-in-up">
            <h1 className="recommendations-page__title">What do you need help with?</h1>
            <p className="recommendations-page__subtitle">
              Your personal details are already saved. Just describe your current need.
            </p>
          </div>

          <div className="card" style={{ maxWidth: 850, margin: '0 auto 32px' }}>
            <h3>Tell Sahayak AI your condition</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Example: “I want to start a tailoring business and need a ₹2 lakh loan.”
            </p>
            <textarea
              className="form-textarea"
              rows={5}
              value={condition}
              onChange={e => setCondition(e.target.value)}
              placeholder="Write in English, Hindi, Punjabi, or your own words..."
            />
            <button
              className="btn btn--cta btn--lg"
              style={{ marginTop: 16 }}
              onClick={getRecommendations}
              disabled={!condition.trim() && !profile.purpose}
            >
              🤖 Recommend My Schemes
            </button>
            <div style={{ marginTop: 18, fontSize: 14 }}>
              <strong>Saved profile:</strong> {profile.category} • {profile.state || 'State not set'} • ₹{Number(profile.familyIncome || 0).toLocaleString('en-IN')} annual income
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/profile" className="btn btn--ghost btn--sm">Edit saved profile</Link>
          </div>
        </div>
      </div>
    );
  }

  const eligibleCount = results.filter(r => r.matchResult.eligible).length;

  return (
    <div className="recommendations-page">
      <div className="container">
        <StepIndicator steps={STEPS} currentStep={1} />
        <div className="recommendations-page__header animate-fade-in-up">
          <div className="recommendations-page__summary">
            <h1 className="recommendations-page__title">Your Personalized Recommendations</h1>
            <p className="recommendations-page__subtitle">
              Based on your saved profile and current condition, we found <strong>{eligibleCount} schemes</strong> you may be eligible for.
            </p>
          </div>

          <div className="profile-summary card">
            <h4 className="profile-summary__title">Saved Profile</h4>
            <div className="profile-summary__grid">
              <div className="profile-summary__item"><span className="profile-summary__label">Age</span><span className="profile-summary__value">{profile.age} years</span></div>
              <div className="profile-summary__item"><span className="profile-summary__label">State</span><span className="profile-summary__value">{profile.state}</span></div>
              <div className="profile-summary__item"><span className="profile-summary__label">Income</span><span className="profile-summary__value">₹{(profile.familyIncome / 100000).toFixed(1)}L/yr</span></div>
              <div className="profile-summary__item"><span className="profile-summary__label">Category</span><span className="profile-summary__value">{profile.category}</span></div>
              <div className="profile-summary__item"><span className="profile-summary__label">Purpose</span><span className="profile-summary__value">{profile.purpose || 'From current request'}</span></div>
              <div className="profile-summary__item"><span className="profile-summary__label">Project Cost</span><span className="profile-summary__value">₹{(profile.projectCost / 100000).toFixed(1)}L</span></div>
            </div>
            <Link to="/profile" className="btn btn--ghost btn--sm">← Edit Profile</Link>
          </div>
        </div>

        <div className="recommendations-grid">
          {results.map((item, index) => (
            <SchemeCard key={item.scheme.id} scheme={item.scheme} matchResult={item.matchResult} index={index} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="no-results text-center">
            <p>No schemes matched your profile.</p>
            <Link to="/profile" className="btn btn--primary">← Edit Profile</Link>
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <button className="btn btn--secondary" onClick={() => { setLoaded(false); setResults([]); }}>
            Try another condition
          </button>
        </div>
      </div>
    </div>
  );
}
