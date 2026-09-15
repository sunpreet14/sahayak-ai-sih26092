import './StepIndicator.css';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step-indicator__step ${
            index < currentStep ? 'completed' : index === currentStep ? 'active' : ''
          }`}
        >
          <div className="step-indicator__circle">
            {index < currentStep ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <span className="step-indicator__label">{step}</span>
          {index < steps.length - 1 && <div className="step-indicator__line" />}
        </div>
      ))}
    </div>
  );
}
