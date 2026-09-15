import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/emiCalculator';
import './SchemeCard.css';

export default function SchemeCard({ scheme, matchResult, index = 0 }) {
  const metReasons = matchResult.reasons.filter(r => r.met);
  const unmetReasons = matchResult.reasons.filter(r => !r.met);

  return (
    <div
      className="scheme-card card card--interactive animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="scheme-card__header">
        <div className="scheme-card__title-row">
          <div>
            <h3 className="scheme-card__name">{scheme.name}</h3>
            <p className="scheme-card__org">{scheme.organization} — {scheme.category}</p>
          </div>
          <div className={`scheme-card__match ${matchResult.matchPercentage >= 80 ? 'high' : matchResult.matchPercentage >= 60 ? 'medium' : 'low'}`}>
            <span className="scheme-card__match-value">{matchResult.matchPercentage}%</span>
            <span className="scheme-card__match-label">Match</span>
          </div>
        </div>
      </div>

      <div className="scheme-card__body">
        <p className="scheme-card__desc">{scheme.description}</p>

        <div className="scheme-card__stats">
          <div className="scheme-card__stat">
            <span className="scheme-card__stat-label">Max Loan</span>
            <span className="scheme-card__stat-value">{formatCurrency(scheme.financials.maxLoanAmount)}</span>
          </div>
          <div className="scheme-card__stat">
            <span className="scheme-card__stat-label">Interest Rate</span>
            <span className="scheme-card__stat-value">{scheme.financials.interestRate}% p.a.</span>
          </div>
          <div className="scheme-card__stat">
            <span className="scheme-card__stat-label">Tenure</span>
            <span className="scheme-card__stat-value">{scheme.financials.maxTenureMonths / 12} years</span>
          </div>
        </div>

        <div className="scheme-card__eligibility">
          <h4 className="scheme-card__elig-title">Eligibility Check</h4>
          <div className="scheme-card__reasons">
            {metReasons.map((r, i) => (
              <span key={i} className="scheme-card__reason met">
                <span className="scheme-card__reason-icon">✓</span>
                {r.text}
              </span>
            ))}
            {unmetReasons.map((r, i) => (
              <span key={i} className="scheme-card__reason unmet">
                <span className="scheme-card__reason-icon">✗</span>
                {r.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="scheme-card__footer">
        <div className="scheme-card__tags">
          {scheme.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="badge badge--primary">{tag}</span>
          ))}
        </div>
        <Link to={`/scheme/${scheme.id}`} className="btn btn--primary btn--sm">
          View Details →
        </Link>
      </div>
    </div>
  );
}
