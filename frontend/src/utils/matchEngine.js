/**
 * Simple frontend scheme matching engine
 * Simulates AI-driven eligibility matching with scoring
 */

/**
 * Match user profile against a scheme's eligibility criteria
 * @param {object} profile - User profile from input form
 * @param {object} scheme - Scheme data from schemes.json
 * @returns {object} { matchPercentage, reasons, eligible }
 */
export function matchScheme(profile, scheme) {
  const criteria = scheme.eligibility;
  const reasons = [];
  let score = 0;
  let maxScore = 0;

  // Age check (weight: 15)
  maxScore += 15;
  if (profile.age >= criteria.minAge && profile.age <= criteria.maxAge) {
    score += 15;
    reasons.push({ text: 'Age requirement satisfied', met: true });
  } else {
    reasons.push({ text: `Age must be ${criteria.minAge}-${criteria.maxAge} years`, met: false });
  }

  // Income check (weight: 25)
  maxScore += 25;
  if (profile.familyIncome <= criteria.maxFamilyIncome) {
    score += 25;
    reasons.push({ text: 'Income requirement satisfied', met: true });
  } else {
    reasons.push({ text: `Family income must be below ₹${(criteria.maxFamilyIncome / 100000).toFixed(1)} Lakh`, met: false });
  }

  // Category check (weight: 25)
  maxScore += 25;
  if (criteria.categories.includes(profile.category)) {
    score += 25;
    reasons.push({ text: 'Beneficiary criteria satisfied', met: true });
  } else {
    reasons.push({ text: `Category must be: ${criteria.categories.join(', ')}`, met: false });
  }

  // Purpose check (weight: 20)
  maxScore += 20;
  if (criteria.purposes.includes(profile.purpose)) {
    score += 20;
    reasons.push({ text: 'Project purpose matched', met: true });
  } else {
    // Partial match — check if purpose is related
    const purposeMap = {
      'business': ['self-employment', 'manufacturing', 'service', 'petty-trade'],
      'self-employment': ['business', 'petty-trade', 'street-vending'],
      'education': ['higher-education', 'professional-course'],
    };
    const related = purposeMap[profile.purpose] || [];
    if (related.some(p => criteria.purposes.includes(p))) {
      score += 10;
      reasons.push({ text: 'Project purpose partially matched', met: true });
    } else {
      reasons.push({ text: `Purpose should be: ${criteria.purposes.join(', ')}`, met: false });
    }
  }

  // Project cost check (weight: 15)
  maxScore += 15;
  if (profile.projectCost <= criteria.maxProjectCost) {
    score += 15;
    reasons.push({ text: 'Project cost suitable', met: true });
  } else {
    reasons.push({ text: `Max project cost: ₹${(criteria.maxProjectCost / 100000).toFixed(1)} Lakh`, met: false });
  }

  // Gender bonus for women-specific schemes
  if (criteria.gender === 'female' && profile.gender === 'female') {
    score += 5;
    maxScore += 5;
    reasons.push({ text: 'Women-specific scheme — priority eligibility', met: true });
  } else if (criteria.gender === 'female' && profile.gender !== 'female') {
    maxScore += 5;
    reasons.push({ text: 'This scheme is exclusively for women', met: false });
  }

  const matchPercentage = Math.round((score / maxScore) * 100);
  const eligible = matchPercentage >= 60;

  return {
    matchPercentage,
    reasons,
    eligible,
    score,
    maxScore,
  };
}

/**
 * Parse natural language profile input (simple keyword extraction)
 * This is a mock NLP parser — in production, this would call an AI API
 */
export function parseNaturalLanguage(text) {
  const parsed = {};
  const lower = text.toLowerCase();

  // State detection
  const states = [
    'punjab', 'haryana', 'rajasthan', 'uttar pradesh', 'maharashtra',
    'tamil nadu', 'karnataka', 'delhi', 'bihar', 'madhya pradesh',
    'west bengal', 'gujarat', 'kerala', 'andhra pradesh', 'telangana',
  ];
  for (const state of states) {
    if (lower.includes(state)) {
      parsed.state = state.charAt(0).toUpperCase() + state.slice(1);
      break;
    }
  }

  // Income detection (₹ or lakh/lac)
  const incomeMatch = lower.match(/(\d+\.?\d*)\s*(lakh|lac|l)/);
  if (incomeMatch) {
    parsed.familyIncome = parseFloat(incomeMatch[1]) * 100000;
  }

  // Purpose detection
  if (lower.includes('business') || lower.includes('vyapaar') || lower.includes('karobar')) {
    parsed.purpose = 'business';
  } else if (lower.includes('education') || lower.includes('padhai') || lower.includes('study')) {
    parsed.purpose = 'education';
  } else if (lower.includes('self-employment') || lower.includes('rozgar') || lower.includes('kaam')) {
    parsed.purpose = 'self-employment';
  }

  // Age detection
  const ageMatch = lower.match(/(\d+)\s*(saal|year|age|umar)/);
  if (ageMatch) {
    parsed.age = parseInt(ageMatch[1]);
  }

  // Category detection
  if (lower.includes(' sc ') || lower.includes('scheduled caste') || lower.includes('dalit')) {
    parsed.category = 'SC';
  } else if (lower.includes('obc') || lower.includes('other backward')) {
    parsed.category = 'OBC';
  }

  return parsed;
}
