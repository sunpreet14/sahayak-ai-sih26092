import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { parseNaturalLanguage } from '../utils/matchEngine';
import './ProfilePage.css';

const STEPS = ['Tell Us About You', 'Check Eligibility', 'Get Guidance'];

const STATES = [
  'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Delhi', 'Gujarat', 'Haryana',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

const PURPOSES = [
  { value: 'business', label: 'Start / Expand Business' },
  { value: 'self-employment', label: 'Self Employment' },
  { value: 'education', label: 'Education / Professional Course' },
  { value: 'green-energy', label: 'Green / Sustainable Business' },
  { value: 'handicraft', label: 'Handicraft / Artisan Work' },
  { value: 'food-processing', label: 'Food Processing' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [nlpText, setNlpText] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (user.id) {
        fetch(`http://localhost:5000/api/profile/${user.id}`)
          .then(r => r.json())
          .then(data => {
            if (data.user) {
              setFormData(prev => ({
                ...prev,
                ...data.user,
                caste: data.user.category || prev.caste || 'SC',
                age: data.user.age ?? '',
                familyIncome: data.user.familyIncome ?? '',
                projectCost: data.user.projectCost ?? ''
              }));
            }
          })
          .catch(err => console.error('Profile fetch error:', err));
      }
    }
  }, [navigate]);
  const [nlpParsed, setNlpParsed] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    caste: '',
    category: 'SC',
    state: '',
    district: '',
    pinCode: '',
    familyIncome: '',
    purpose: '',
    projectCost: '',
    education: '',
  });

  const completionFields = ['age', 'gender', 'category', 'state', 'district', 'pinCode', 'familyIncome'];
  const completionPercent = Math.round(
    (completionFields.filter(f => formData[f] && formData[f].toString().trim() !== '').length / completionFields.length) * 100
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNlpParse = () => {
    if (!nlpText.trim()) return;
    const parsed = parseNaturalLanguage(nlpText);
    setNlpParsed(parsed);
    // Auto-fill fields
    setFormData(prev => ({
      ...prev,
      ...(parsed.state && { state: parsed.state }),
      ...(parsed.familyIncome && { familyIncome: parsed.familyIncome.toString() }),
      ...(parsed.purpose && { purpose: parsed.purpose }),
      ...(parsed.age && { age: parsed.age.toString() }),
      ...(parsed.category && { category: parsed.category }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profile = {
      ...formData,
      age: parseInt(formData.age) || 30,
      familyIncome: parseInt(formData.familyIncome) || 200000,
      projectCost: parseInt(formData.projectCost) || 500000,
      category: formData.category || 'SC',
      state: formData.state || 'Punjab',
    };
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user.id) {
      navigate('/auth');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save profile');
      setSaveMessage('Profile saved successfully. Your details are now stored and will be remembered by Sahayak AI.');
    } catch (error) {
      console.error('Profile save error:', error);
      alert('Could not save your profile. Make sure the backend is running.');
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-page__header text-center animate-fade-in-up">
          <h1 className="profile-page__title">My Profile</h1>
          <p className="profile-page__subtitle">
            Help us find the best government schemes for you. You can fill the form
            or simply describe your situation below.
          </p>
        </div>

        {/* NLP Input */}
        <div className="nlp-section card animate-fade-in-up animate-delay-1">
          <div className="nlp-section__header">
            <span className="nlp-section__icon">🗣️</span>
            <div>
              <h3 className="nlp-section__title">Describe in Your Own Words</h3>
              <p className="nlp-section__hint">You can write in Hindi, Punjabi, or English</p>
            </div>
          </div>
          <textarea
            className="form-textarea nlp-section__input"
            placeholder='Example: "Main Punjab mein rehta hoon, meri family income ₹2.5 lakh hai aur mujhe apna business start karna hai."'
            value={nlpText}
            onChange={(e) => setNlpText(e.target.value)}
            rows={3}
          />
          <div className="nlp-section__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleNlpParse}
              disabled={!nlpText.trim()}
            >
              🤖 Auto-Fill from Text
            </button>
            {nlpParsed && (
              <div className="nlp-parsed">
                <span className="nlp-parsed__label">Detected:</span>
                {nlpParsed.state && <span className="badge badge--primary">📍 {nlpParsed.state}</span>}
                {nlpParsed.familyIncome && <span className="badge badge--accent">💰 ₹{(nlpParsed.familyIncome / 100000).toFixed(1)}L</span>}
                {nlpParsed.purpose && <span className="badge badge--success">🎯 {nlpParsed.purpose}</span>}
                {nlpParsed.age && <span className="badge badge--warning">🧑 {nlpParsed.age} yrs</span>}
                {nlpParsed.category && <span className="badge badge--primary">📋 {nlpParsed.category}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form className="profile-form animate-fade-in-up animate-delay-2" onSubmit={handleSubmit}>
          
          {/* Profile Completion Indicator */}
          <div className="profile-completion card mb-6">
            <div className="profile-completion__header">
              <span className="profile-completion__title">Profile Completion</span>
              <span className="profile-completion__percent">{completionPercent}%</span>
            </div>
            <div className="profile-completion__bar">
              <div 
                className="profile-completion__fill" 
                style={{ width: `${completionPercent}%`, backgroundColor: completionPercent === 100 ? 'var(--success-500)' : 'var(--primary-500)' }}
              ></div>
            </div>
            <p className="profile-completion__hint">
              Complete your profile to get more accurate government scheme recommendations.
            </p>
          </div>

          <div className="profile-form__grid">
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                name="age"
                className="form-input"
                placeholder="e.g. 28"
                value={formData.age}
                onChange={handleChange}
                min="17"
                max="100"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Caste / Category *</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="OBC">Other Backward Class (OBC)</option>
                <option value="DNT">Denotified / Nomadic / Semi-Nomadic</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">State *</label>
              <select name="state" className="form-select" value={formData.state} onChange={handleChange} required>
                <option value="">Select State</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <input
                type="text"
                name="district"
                className="form-input"
                placeholder="e.g. Ludhiana"
                value={formData.district}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">PIN Code *</label>
              <input
                type="text"
                name="pinCode"
                className="form-input"
                placeholder="e.g. 141001"
                value={formData.pinCode}
                onChange={handleChange}
                pattern="[0-9]{6}"
                maxLength="6"
                title="Please enter a valid 6-digit Indian PIN code"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Annual Family Income (₹) *</label>
              <input
                type="number"
                name="familyIncome"
                className="form-input"
                placeholder="e.g. 250000"
                value={formData.familyIncome}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Education Status</label>
              <select name="education" className="form-select" value={formData.education} onChange={handleChange}>
                <option value="">Select Education Level</option>
                <option value="below-10th">Below 10th</option>
                <option value="10th">10th Pass</option>
                <option value="12th">12th Pass</option>
                <option value="graduate">Graduate</option>
                <option value="post-graduate">Post Graduate</option>
                <option value="professional">Professional Degree</option>
              </select>
            </div>
          </div>

          <div className="profile-form__submit">
            <button type="submit" className="btn btn--cta btn--lg btn--full">
              💾 Save Profile
            </button>
            {saveMessage && <p className="profile-form__privacy" style={{ color: 'var(--success-600, #16834b)', fontWeight: 600 }}>✅ {saveMessage}</p>}
            <p className="profile-form__privacy">
              🔒 Your profile is securely saved in MongoDB and used to personalize your recommendations.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
