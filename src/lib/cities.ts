export const DEFAULT_CITIES: string[] = [
  'Delhi NCR',
  'Mumbai',
  'Bangalore',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Gurgaon',
  'Noida',
  'Greater Noida',
  'Faridabad',
  'Ghaziabad',
  'Jaipur',
  'Chandigarh',
  'Lucknow',
  'Goa',
  'Kochi',
  'Indore',
  'Surat',
  'Bhopal',
  'Nagpur',
  'Dehradun',
  'Vadodara',
  'Coimbatore',
  'Visakhapatnam',
  'Mysore',
  'Patna',
  'Bhubaneswar',
  'Ranchi'
];

const STORAGE_KEY = 'propertylelo_custom_cities';

export function getCustomCities(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAllCities(): string[] {
  const custom = getCustomCities();
  const set = new Set<string>();
  DEFAULT_CITIES.forEach((c) => set.add(c));
  custom.forEach((c) => {
    if (c && typeof c === 'string' && c.trim()) {
      set.add(c.trim());
    }
  });
  return Array.from(set);
}

export function saveNewCity(newCity: string): string[] {
  const trimmed = newCity.trim();
  if (!trimmed) return getAllCities();

  const custom = getCustomCities();
  // Case-insensitive check
  const exists = custom.some((c) => c.toLowerCase() === trimmed.toLowerCase()) ||
                 DEFAULT_CITIES.some((c) => c.toLowerCase() === trimmed.toLowerCase());

  if (!exists) {
    custom.push(trimmed);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    } catch (e) {
      console.error('Failed to save custom city to localStorage', e);
    }
  }

  return getAllCities();
}

/**
 * Format numeric INR value to conversational Indian Currency String
 * e.g. 15000000 -> ₹1.50 Crore, 7500000 -> ₹75 Lakh
 */
export function formatIndianCurrency(price: number): string {
  if (!price || isNaN(price) || price <= 0) return '₹0';
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    const lakh = price / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`;
  }
  if (price >= 1000) {
    return `₹${(price / 1000).toFixed(0)}k`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}
