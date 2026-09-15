import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { partners } from '../data/partners';
import './PartnerLocatorPage.css';

const PARTNER_TYPES = ['All', 'SCA', 'MFI', 'NGO'];
const STATES = ['All', ...new Set(partners.map(p => p.state))];

export default function PartnerLocatorPage() {
  const [filterType, setFilterType] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user.id) return;
    fetch(`http://localhost:5000/api/profile/${user.id}`)
      .then(r => r.json())
      .then(data => setProfile(data.user || null))
      .catch(() => {});
  }, []);

  const toRad = value => (Number(value) * Math.PI) / 180;
  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const userLocation = useMemo(() => {
    if (!profile) return null;
    // Use the saved district/state as the user's location anchor. If an exact
    // district is present in the prototype dataset, use its coordinates.
    const exactDistrict = partners.find(p =>
      p.district?.toLowerCase() === String(profile.district || '').toLowerCase() &&
      p.state?.toLowerCase() === String(profile.state || '').toLowerCase()
    );
    if (exactDistrict) return exactDistrict.coordinates;

    const sameState = partners.find(p =>
      p.state?.toLowerCase() === String(profile.state || '').toLowerCase()
    );
    return sameState?.coordinates || null;
  }, [profile]);

  const filteredPartners = useMemo(() => {
    const profileState = String(profile?.state || '').toLowerCase();
    const profileCategory = String(profile?.category || '').toLowerCase();

    let list = partners
      .filter(p => p.status === 'Active')
      .filter(p => !profileCategory || p.categories.some(c => c.toLowerCase() === profileCategory))
      .map(p => ({
        ...p,
        calculatedDistance: userLocation
          ? distanceKm(userLocation.lat, userLocation.lng, p.coordinates.lat, p.coordinates.lng)
          : Number(p.distanceKm || 9999)
      }));

    // Prefer eligible partners in the user's saved state. If fewer than 3
    // exist, fill the remaining slots with the closest eligible partners.
    if (profileState) {
      const sameState = list.filter(p => p.state.toLowerCase() === profileState)
        .sort((a, b) => a.calculatedDistance - b.calculatedDistance);
      const otherStates = list.filter(p => p.state.toLowerCase() !== profileState)
        .sort((a, b) => a.calculatedDistance - b.calculatedDistance);
      list = [...sameState, ...otherStates];
    } else {
      list.sort((a, b) => a.calculatedDistance - b.calculatedDistance);
    }

    if (filterState !== 'All') list = list.filter(p => p.state === filterState);
    if (filterType !== 'All') list = list.filter(p => p.type.includes(filterType));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.district.toLowerCase().includes(q));
    }

    return list.slice(0, 5);
  }, [filterType, filterState, searchQuery, profile, userLocation]);

  return (
    <div className="partner-page">
      <div className="container">
        <div className="partner-page__header text-center animate-fade-in-up">
          <h1 className="partner-page__title">
            <span className="partner-page__icon">📍</span>
            Channel Partner Locator
          </h1>
          <p className="partner-page__subtitle">
            Find eligible channel partners based on your saved profile and nearest available location.
          </p>
          <div className="partner-page__disclaimer badge badge--warning">
            ⓘ Prototype — Partner data shown is for demonstration purposes only
          </div>
          {profile && (
            <div style={{ marginTop: 10, color: 'var(--text-secondary)', fontSize: 14 }}>
              Routing for <strong>{profile.district || profile.state || 'your saved profile'}</strong>
              {profile.category ? ` • ${profile.category}` : ''}
            </div>
          )}
        </div>

        <div className="partner-layout">
          <div className="partner-map card animate-fade-in-up animate-delay-1">
            <div className="partner-map__canvas">
              <div className="partner-map__overlay">
                <svg width="100%" height="100%" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M200 50 L350 40 L400 80 L420 150 L400 200 L380 250 L350 300 L300 350 L250 370 L200 350 L180 300 L170 250 L180 200 L200 150 Z"
                    fill="var(--primary-50)" stroke="var(--primary-200)" strokeWidth="1.5" />
                  {filteredPartners.map((partner, i) => {
                    const x = 180 + (partner.coordinates.lng - 70) * 15;
                    const y = 380 - (partner.coordinates.lat - 8) * 12;
                    return (
                      <g key={partner.id}>
                        <circle cx={x} cy={y} r="6" fill="var(--primary-500)" stroke="white" strokeWidth="2">
                          <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                        </circle>
                        <circle cx={x} cy={y} r="12" fill="var(--primary-500)" opacity="0.15">
                          <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                        </circle>
                      </g>
                    );
                  })}
                </svg>
                <div className="partner-map__label">{filteredPartners.length} eligible partners shown</div>
              </div>
            </div>
          </div>

          <div className="partner-list animate-fade-in-up animate-delay-2">
            <div className="partner-search">
              <input type="text" className="form-input partner-search__input" placeholder="Search by name or district..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            <div className="partner-filters">
              <div className="partner-filter-group">
                <label className="partner-filter-label">Type</label>
                <div className="partner-filter-chips">
                  {PARTNER_TYPES.map(type => (
                    <button key={type} className={`partner-chip ${filterType === type ? 'active' : ''}`} onClick={() => setFilterType(type)}>{type}</button>
                  ))}
                </div>
              </div>
              <div className="partner-filter-group">
                <label className="partner-filter-label">State</label>
                <select className="form-select partner-filter-select" value={filterState} onChange={e => setFilterState(e.target.value)}>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="partner-cards">
              {filteredPartners.map((partner, index) => (
                <div key={partner.id} className="partner-card card card--interactive animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="partner-card__header">
                    <div className="partner-card__type-badge">{partner.type.includes('SCA') ? '🏛️' : partner.type.includes('MFI') ? '🏦' : '🤝'}</div>
                    <div><h3 className="partner-card__name">{partner.name}</h3><p className="partner-card__type">{partner.type}</p></div>
                  </div>
                  <div className="partner-card__body">
                    <div className="partner-card__info">
                      <div className="partner-card__detail"><span className="partner-card__detail-icon">📍</span><span>{partner.address}</span></div>
                      <div className="partner-card__detail"><span className="partner-card__detail-icon">📞</span><span>{partner.phone}</span></div>
                      <div className="partner-card__detail"><span className="partner-card__detail-icon">🕐</span><span>{partner.operatingHours}</span></div>
                    </div>
                    <div className="partner-card__meta">
                      <div className="partner-card__distance"><span className="partner-card__distance-value">{partner.calculatedDistance.toFixed(1)} km</span><span className="partner-card__distance-label">estimated distance</span></div>
                      <div className="partner-card__rating">⭐ {partner.rating}</div>
                      <span className={`badge ${partner.status === 'Active' ? 'badge--success' : 'badge--warning'}`}>{partner.status}</span>
                    </div>
                    <div className="partner-card__schemes"><span className="partner-card__schemes-label">Supports:</span>{partner.categories.map((cat, i) => <span key={i} className="badge badge--primary">{cat}</span>)}</div>
                  </div>
                  <div className="partner-card__actions">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${partner.coordinates.lat},${partner.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">📍 View Location</a>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${partner.coordinates.lat},${partner.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm">🧭 Get Directions</a>
                  </div>
                </div>
              ))}
              {filteredPartners.length === 0 && <div className="no-partners text-center"><p>No eligible channel partners found for this profile.</p><button className="btn btn--ghost" onClick={() => { setFilterType('All'); setFilterState('All'); setSearchQuery(''); }}>Clear Filters</button></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
