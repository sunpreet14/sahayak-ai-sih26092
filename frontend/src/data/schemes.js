import schemesData from '../../../data/schemes.json';

export const schemes = schemesData;

export function getSchemeById(id) {
  return schemes.find(s => s.id === id);
}

export function getSchemesByCategory(category) {
  return schemes.filter(s => s.category === category);
}

export function getAllCategories() {
  return [...new Set(schemes.map(s => s.category))];
}
