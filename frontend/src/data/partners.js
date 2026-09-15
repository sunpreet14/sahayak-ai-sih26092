import partnersData from '../../../data/partners.json';

export const partners = partnersData;

export function getPartnerById(id) {
  return partners.find(p => p.id === id);
}

export function getPartnersByState(state) {
  return partners.filter(p => p.state.toLowerCase() === state.toLowerCase());
}

export function getPartnersByScheme(schemeId) {
  return partners.filter(p => p.supportedSchemes.includes(schemeId));
}

export function getPartnersByType(type) {
  return partners.filter(p => p.type.includes(type));
}
