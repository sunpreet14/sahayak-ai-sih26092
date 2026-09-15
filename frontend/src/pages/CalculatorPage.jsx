import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { calculateEMI, formatCurrency } from '../utils/emiCalculator';
import './CalculatorPage.css';

export default function CalculatorPage() {
  const [searchParams] = useSearchParams();

  const [loanAmount, setLoanAmount] = useState(parseInt(searchParams.get('amount')) || 500000);
  const [interestRate, setInterestRate] = useState(parseFloat(searchParams.get('rate')) || 6.0);
  const [tenure, setTenure] = useState(parseInt(searchParams.get('tenure')) || 60);
  const [moratorium, setMoratorium] = useState(parseInt(searchParams.get('moratorium')) || 6);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const res = calculateEMI(loanAmount, interestRate, tenure, moratorium);
    setResult(res);
  }, [loanAmount, interestRate, tenure, moratorium]);

  return (
    <div className="calculator-page">
      <div className="container">
        <div className="calculator-page__header text-center animate-fade-in-up">
          <h1 className="calculator-page__title">
            <span className="calculator-page__icon">🧮</span>
            EMI Calculator
          </h1>
          <p className="calculator-page__subtitle">
            Plan your loan repayment with moratorium support. All calculations are instant and run locally.
          </p>
        </div>

        <div className="calculator-layout">
          {/* Input Panel */}
          <div className="calculator-inputs card animate-fade-in-up animate-delay-1">
            <h3 className="calculator-inputs__title">Loan Parameters</h3>

            <div className="calc-field">
              <div className="calc-field__header">
                <label className="form-label">Loan Amount</label>
                <span className="calc-field__value">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="calc-slider"
              />
              <div className="calc-field__range">
                <span>₹10K</span>
                <span>₹20L</span>
              </div>
            </div>

            <div className="calc-field">
              <div className="calc-field__header">
                <label className="form-label">Interest Rate</label>
                <span className="calc-field__value">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="calc-slider"
              />
              <div className="calc-field__range">
                <span>1%</span>
                <span>15%</span>
              </div>
            </div>

            <div className="calc-field">
              <div className="calc-field__header">
                <label className="form-label">Tenure</label>
                <span className="calc-field__value">{tenure} months ({(tenure / 12).toFixed(1)} yrs)</span>
              </div>
              <input
                type="range"
                min="6"
                max="120"
                step="6"
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
                className="calc-slider"
              />
              <div className="calc-field__range">
                <span>6 months</span>
                <span>10 years</span>
              </div>
            </div>

            <div className="calc-field">
              <div className="calc-field__header">
                <label className="form-label">Moratorium Period</label>
                <span className="calc-field__value">{moratorium} months</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={moratorium}
                onChange={(e) => setMoratorium(parseInt(e.target.value))}
                className="calc-slider"
              />
              <div className="calc-field__range">
                <span>0 months</span>
                <span>24 months</span>
              </div>
            </div>

            <div className="calc-note">
              <span className="calc-note__icon">💡</span>
              <p>During moratorium, only interest accrues. EMI payments begin after the moratorium period ends.</p>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calculator-results animate-fade-in-up animate-delay-2">
            {result && (
              <>
                <div className="result-card result-card--emi card">
                  <span className="result-card__label">Monthly EMI</span>
                  <span className="result-card__value">{formatCurrency(result.emi)}</span>
                  <span className="result-card__sub">
                    for {result.repaymentMonths} months after moratorium
                  </span>
                </div>

                <div className="result-card card">
                  <span className="result-card__label">Total Interest</span>
                  <span className="result-card__value result-card__value--accent">
                    {formatCurrency(result.totalInterest)}
                  </span>
                </div>

                <div className="result-card card">
                  <span className="result-card__label">Total Repayment</span>
                  <span className="result-card__value">{formatCurrency(result.totalPayment)}</span>
                </div>

                {result.moratoriumInterest > 0 && (
                  <div className="result-card card">
                    <span className="result-card__label">Moratorium Interest</span>
                    <span className="result-card__value result-card__value--warning">
                      {formatCurrency(result.moratoriumInterest)}
                    </span>
                    <span className="result-card__sub">Added to principal</span>
                  </div>
                )}

                {/* Breakdown Chart */}
                <div className="breakdown card">
                  <h4 className="breakdown__title">Payment Breakdown</h4>
                  <div className="breakdown__bar">
                    <div
                      className="breakdown__segment breakdown__segment--principal"
                      style={{ width: `${(loanAmount / result.totalPayment) * 100}%` }}
                    >
                      <span>Principal</span>
                    </div>
                    <div
                      className="breakdown__segment breakdown__segment--interest"
                      style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }}
                    >
                      <span>Interest</span>
                    </div>
                  </div>
                  <div className="breakdown__legend">
                    <div className="breakdown__legend-item">
                      <span className="breakdown__dot breakdown__dot--principal" />
                      Principal: {formatCurrency(loanAmount)} ({((loanAmount / result.totalPayment) * 100).toFixed(1)}%)
                    </div>
                    <div className="breakdown__legend-item">
                      <span className="breakdown__dot breakdown__dot--interest" />
                      Interest: {formatCurrency(result.totalInterest)} ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>

                <div className="calc-actions">
                  <Link to="/partners" className="btn btn--primary btn--full">
                    📍 Find Channel Partner
                  </Link>
                  <Link to="/recommendations" className="btn btn--secondary btn--full">
                    ← Back to Schemes
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
