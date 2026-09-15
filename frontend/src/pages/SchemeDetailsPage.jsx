import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSchemeById } from '../data/schemes';
import { formatCurrency } from '../utils/emiCalculator';
import StepIndicator from '../components/StepIndicator';
import './SchemeDetailsPage.css';

const STEPS = ['Tell Us About You', 'Check Eligibility', 'Get Guidance'];

export default function SchemeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const scheme = getSchemeById(id);

  if (!scheme) {
    return (
      <div className="scheme-details container text-center" style={{ padding: '100px 0' }}>
        <h2>Scheme Not Found</h2>
        <p>The requested scheme could not be found.</p>
        <Link to="/recommendations" className="btn btn--primary" style={{ marginTop: '20px' }}>
          ← Back to Recommendations
        </Link>
      </div>
    );
  }

  return (
    <div className="scheme-details">
      <div className="container">
        <StepIndicator steps={STEPS} currentStep={2} />

        {/* Back button */}
        <button className="scheme-details__back btn btn--ghost" onClick={() => navigate(-1)}>
          ← Back to Recommendations
        </button>

        {/* Header */}
        <div className="scheme-details__header animate-fade-in-up">
          <div className="scheme-details__header-content">
            <div className="scheme-details__badges">
              <span className="badge badge--primary">{scheme.organization}</span>
              <span className="badge badge--accent">{scheme.category}</span>
            </div>
            <h1 className="scheme-details__title">{scheme.name}</h1>
            <p className="scheme-details__desc">{scheme.overview}</p>
          </div>
        </div>

        <div className="scheme-details__layout">
          {/* Main Content */}
          <div className="scheme-details__main">
            {/* Financial Highlights */}
            <section className="detail-section card animate-fade-in-up">
              <h2 className="detail-section__title">
                <span className="detail-section__icon">💰</span>
                Financial Highlights
              </h2>
              <div className="financials-grid">
                <div className="financial-item">
                  <span className="financial-item__label">Maximum Loan Amount</span>
                  <span className="financial-item__value financial-item__value--primary">
                    {formatCurrency(scheme.financials.maxLoanAmount)}
                  </span>
                </div>
                <div className="financial-item">
                  <span className="financial-item__label">Interest Rate</span>
                  <span className="financial-item__value">{scheme.financials.interestRate}% p.a.</span>
                </div>
                <div className="financial-item">
                  <span className="financial-item__label">Financing</span>
                  <span className="financial-item__value">{scheme.financials.financingPercentage}%</span>
                </div>
                <div className="financial-item">
                  <span className="financial-item__label">Max Tenure</span>
                  <span className="financial-item__value">{scheme.financials.maxTenureMonths / 12} years</span>
                </div>
                <div className="financial-item">
                  <span className="financial-item__label">Moratorium</span>
                  <span className="financial-item__value">{scheme.financials.moratoriumMonths} months</span>
                </div>
                <div className="financial-item">
                  <span className="financial-item__label">Margin Money</span>
                  <span className="financial-item__value">{scheme.financials.marginMoney}%</span>
                </div>
              </div>
              {scheme.financials.subsidyAvailable && (
                <div className="subsidy-info">
                  <span className="subsidy-info__icon">🎁</span>
                  <div>
                    <strong>Subsidy Available</strong>
                    <p>{scheme.financials.subsidyDetails}</p>
                  </div>
                </div>
              )}
            </section>

            {/* Eligibility */}
            <section className="detail-section card animate-fade-in-up animate-delay-1">
              <h2 className="detail-section__title">
                <span className="detail-section__icon">✅</span>
                Eligibility Criteria
              </h2>
              <div className="eligibility-grid">
                <div className="eligibility-item">
                  <span className="eligibility-item__label">Age</span>
                  <span className="eligibility-item__value">
                    {scheme.eligibility.minAge} - {scheme.eligibility.maxAge} years
                  </span>
                </div>
                <div className="eligibility-item">
                  <span className="eligibility-item__label">Max Family Income</span>
                  <span className="eligibility-item__value">
                    {formatCurrency(scheme.eligibility.maxFamilyIncome)} / year
                  </span>
                </div>
                <div className="eligibility-item">
                  <span className="eligibility-item__label">Categories</span>
                  <span className="eligibility-item__value">
                    {scheme.eligibility.categories.join(', ')}
                  </span>
                </div>
                <div className="eligibility-item">
                  <span className="eligibility-item__label">Max Project Cost</span>
                  <span className="eligibility-item__value">
                    {formatCurrency(scheme.eligibility.maxProjectCost)}
                  </span>
                </div>
                {scheme.eligibility.gender && (
                  <div className="eligibility-item">
                    <span className="eligibility-item__label">Gender</span>
                    <span className="eligibility-item__value" style={{ textTransform: 'capitalize' }}>
                      {scheme.eligibility.gender} only
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Documents */}
            <section className="detail-section card animate-fade-in-up animate-delay-2">
              <h2 className="detail-section__title">
                <span className="detail-section__icon">📄</span>
                Required Documents
              </h2>
              <ul className="documents-list">
                {scheme.documents.map((doc, i) => (
                  <li key={i} className="documents-list__item">
                    <span className="documents-list__check">📋</span>
                    {doc}
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section className="detail-section card animate-fade-in-up animate-delay-3">
              <h2 className="detail-section__title">
                <span className="detail-section__icon">⭐</span>
                Key Benefits
              </h2>
              <ul className="benefits-list">
                {scheme.benefits.map((benefit, i) => (
                  <li key={i} className="benefits-list__item">
                    <span className="benefits-list__icon">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>

            {/* Application Process */}
            <section className="detail-section card animate-fade-in-up animate-delay-4">
              <h2 className="detail-section__title">
                <span className="detail-section__icon">📝</span>
                Application Process
              </h2>
              <ol className="process-list">
                {scheme.applicationProcess.map((step, i) => (
                  <li key={i} className="process-list__item">
                    <span className="process-list__number">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="scheme-details__sidebar">
            <div className="sidebar-card card animate-fade-in-up animate-delay-1">
              <h3 className="sidebar-card__title">Quick Actions</h3>
              <div className="sidebar-card__actions">
                <Link
                  to={`/calculator?amount=${scheme.financials.maxLoanAmount}&rate=${scheme.financials.interestRate}&tenure=${scheme.financials.maxTenureMonths}&moratorium=${scheme.financials.moratoriumMonths}`}
                  className="btn btn--primary btn--full"
                >
                  🧮 Calculate EMI
                </Link>
                <Link to="/partners" className="btn btn--secondary btn--full">
                  📍 Find Channel Partner
                </Link>
              </div>
            </div>

            <div className="sidebar-card card animate-fade-in-up animate-delay-2">
              <h3 className="sidebar-card__title">Tags</h3>
              <div className="sidebar-card__tags">
                {scheme.tags.map((tag, i) => (
                  <span key={i} className="badge badge--primary">{tag}</span>
                ))}
              </div>
            </div>

            <div className="sidebar-card sidebar-card--info card animate-fade-in-up animate-delay-3">
              <h3 className="sidebar-card__title">💡 Tip</h3>
              <p className="sidebar-card__text">
                Apply through a registered Channel Partner near you for faster processing.
                Use our Partner Locator to find the nearest SCA, NGO, or MFI.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
