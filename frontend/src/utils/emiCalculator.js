/**
 * EMI Calculator Utility
 * Supports moratorium period where only interest accrues
 */

/**
 * Calculate EMI using reducing balance method
 * @param {number} principal - Loan amount in ₹
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} tenureMonths - Total tenure in months (including moratorium)
 * @param {number} moratoriumMonths - Moratorium period in months
 * @returns {object} { emi, totalInterest, totalPayment, effectivePrincipal }
 */
export function calculateEMI(principal, annualRate, tenureMonths, moratoriumMonths = 0) {
  if (!principal || !annualRate || !tenureMonths) {
    return { emi: 0, totalInterest: 0, totalPayment: 0, effectivePrincipal: principal };
  }

  const monthlyRate = annualRate / 12 / 100;
  
  // During moratorium, interest accrues and is added to principal
  let effectivePrincipal = principal;
  const moratoriumInterest = principal * monthlyRate * moratoriumMonths;
  effectivePrincipal = principal + moratoriumInterest;

  // EMI calculated on remaining tenure after moratorium
  const repaymentMonths = tenureMonths - moratoriumMonths;

  if (repaymentMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0, effectivePrincipal };
  }

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi =
    (effectivePrincipal * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
    (Math.pow(1 + monthlyRate, repaymentMonths) - 1);

  const totalPayment = emi * repaymentMonths + moratoriumInterest;
  const totalInterest = totalPayment - principal;

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    effectivePrincipal: Math.round(effectivePrincipal),
    moratoriumInterest: Math.round(moratoriumInterest),
    repaymentMonths,
  };
}

/**
 * Format number to Indian currency style
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}
