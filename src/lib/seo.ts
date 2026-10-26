import { Property, BlogArticle } from '../types/property';

// Shared SEO helpers used both at runtime (SeoManager) and at build time
// (vite-plugin-seo prerenders JSON-LD, crawlable HTML and the sitemap).

export const SITE_URL = 'https://propertylelo.com';
export const SITE_NAME = 'PropertyLelo';
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

export const DEFAULT_TITLE =
  'PropertyLelo | Verified Flats, Villas & Commercial Property in Noida, Gurgaon & Delhi NCR – 0% Brokerage';
export const DEFAULT_DESCRIPTION =
  'Buy RERA-verified 2, 3 & 4 BHK flats, luxury villas, penthouses, plots and assured-return commercial shops in Noida, Gurgaon, Delhi NCR, Mumbai, Bangalore, Pune & Hyderabad. Direct owner & builder deals with zero brokerage on PropertyLelo.';

// Approximate city-centre coordinates for GeoCoordinates schema (local SEO).
export const CITY_GEO: Record<string, { lat: number; lng: number; region: string }> = {
  'Delhi NCR': { lat: 28.6139, lng: 77.209, region: 'IN-DL' },
  Delhi: { lat: 28.6139, lng: 77.209, region: 'IN-DL' },
  Noida: { lat: 28.5355, lng: 77.391, region: 'IN-UP' },
  'Greater Noida': { lat: 28.4744, lng: 77.504, region: 'IN-UP' },
  Ghaziabad: { lat: 28.6692, lng: 77.4538, region: 'IN-UP' },
  Gurgaon: { lat: 28.4595, lng: 77.0266, region: 'IN-HR' },
  Faridabad: { lat: 28.4089, lng: 77.3178, region: 'IN-HR' },
  Mumbai: { lat: 19.076, lng: 72.8777, region: 'IN-MH' },
  Pune: { lat: 18.5204, lng: 73.8567, region: 'IN-MH' },
  Bangalore: { lat: 12.9716, lng: 77.5946, region: 'IN-KA' },
  Hyderabad: { lat: 17.385, lng: 78.4867, region: 'IN-TG' },
  Chennai: { lat: 13.0827, lng: 80.2707, region: 'IN-TN' },
  Kolkata: { lat: 22.5726, lng: 88.3639, region: 'IN-WB' },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, region: 'IN-GJ' }
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

/** Stable, keyword-rich slug: "<title>-<locality>-<city>--<id>" (id suffix keeps it unique). */
export function propertySlug(p: Pick<Property, 'id' | 'title' | 'locality' | 'city'>): string {
  const words = slugify(`${p.title} ${p.locality} ${p.city}`);
  return `${words}--${slugify(p.id)}`;
}

export function findPropertyBySlug<T extends Pick<Property, 'id' | 'title' | 'locality' | 'city'>>(
  list: T[],
  slug: string
): T | undefined {
  const idPart = slug.includes('--') ? slug.split('--').pop() : slug;
  return list.find((p) => propertySlug(p) === slug || slugify(p.id) === idPart || p.id === slug);
}

export function propertyPath(p: Pick<Property, 'id' | 'title' | 'locality' | 'city'>): string {
  return `/?property=${propertySlug(p)}`;
}

export function propertyUrl(p: Pick<Property, 'id' | 'title' | 'locality' | 'city'>): string {
  return `${SITE_URL}${propertyPath(p)}`;
}

export function cityPath(city: string): string {
  return `/?city=${encodeURIComponent(city)}`;
}

export function articlePath(article: Pick<BlogArticle, 'slug'>): string {
  return `/?article=${encodeURIComponent(article.slug)}`;
}

/** "3 BHK Apartment for Sale in Sector 150, Noida" style descriptor used in titles and alt text. */
export function propertyDescriptor(p: Property): string {
  const kind = p.bhk > 0 ? `${p.bhk} BHK ${p.type}` : p.type;
  const intent = p.category === 'Commercial' ? 'Commercial Space for Sale' : `${kind} for Sale`;
  return `${intent} in ${p.locality}, ${p.city}`;
}

export function propertyImageAlt(p: Property, index = 0): string {
  const kind = p.bhk > 0 ? `${p.bhk} BHK ${p.type}` : p.type;
  return `${p.title} – ${kind} in ${p.locality}, ${p.city}${index > 0 ? ` (photo ${index + 1})` : ''}`;
}

export function propertyMetaTitle(p: Property): string {
  return `${p.title} – ${propertyDescriptor(p)} | ${p.priceFormatted.replace(/\*$/, '')} | ${SITE_NAME}`;
}

export function propertyMetaDescription(p: Property): string {
  const bits = [
    `${p.title} in ${p.locality}, ${p.city}`,
    `${p.priceFormatted.replace(/\*$/, '')}`,
    `${p.area.toLocaleString('en-IN')} sq.ft`,
    p.bhk > 0 ? `${p.bhk} BHK` : p.type,
    p.possession,
    p.reraId ? `RERA ${p.reraId}` : p.verified ? 'Verified listing' : ''
  ].filter(Boolean);
  const text = `${bits.join(' • ')}. ${p.description}`;
  return text.length > 158 ? `${text.slice(0, 155).trimEnd()}…` : text;
}

export function cityMetaTitle(city: string): string {
  return `Property in ${city} – Verified Flats, Villas & Commercial Space for Sale | ${SITE_NAME}`;
}

export function cityMetaDescription(city: string, count: number): string {
  return `Explore ${count > 0 ? `${count}+ ` : ''}verified flats, villas, plots and commercial property for sale in ${city}. Compare prices per sq.ft, RERA-approved projects and buy directly from owners & builders with zero brokerage.`;
}

const schemaTypeFor = (p: Property): string => {
  if (p.category === 'Commercial' || p.type === 'Plot' || p.type === 'Commercial Office' || p.type === 'Retail Shop' || p.type === 'Food Court') {
    return 'Place';
  }
  if (p.type === 'Villa' || p.type === 'Independent House') return 'SingleFamilyResidence';
  return 'Apartment';
};

/** schema.org RealEstateListing with an Offer and the underlying accommodation. */
export function propertyJsonLd(p: Property) {
  const geo = CITY_GEO[p.city];
  const url = propertyUrl(p);
  const accommodation: Record<string, unknown> = {
    '@type': schemaTypeFor(p),
    name: p.title,
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.locality,
      addressLocality: p.city,
      addressRegion: p.state,
      postalCode: p.pincode,
      addressCountry: 'IN'
    },
    floorSize: { '@type': 'QuantitativeValue', value: p.area, unitCode: 'FTK' }
  };
  if (p.bhk > 0) {
    accommodation.numberOfRooms = p.bhk;
    accommodation.numberOfBedrooms = p.bhk;
    accommodation.numberOfBathroomsTotal = p.bathrooms;
  }
  if (p.amenities?.length) {
    accommodation.amenityFeature = p.amenities.slice(0, 12).map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true
    }));
  }
  if (geo) {
    accommodation.geo = { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    url,
    name: `${p.title} – ${propertyDescriptor(p)}`,
    description: p.description,
    image: p.images?.slice(0, 5),
    datePosted: /^\d{4}-\d{2}-\d{2}/.test(p.postedDate) ? p.postedDate : undefined,
    identifier: p.reraId ? { '@type': 'PropertyValue', propertyID: 'RERA', value: p.reraId } : p.id,
    about: accommodation,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      businessFunction: 'http://purl.org/goodrelations/v1#Sell',
      url,
      seller: {
        '@type': p.postedBy === 'Owner' ? 'Person' : 'Organization',
        name: p.developerName || p.posterName
      }
    }
  };
}

export function propertyFaqJsonLd(p: Property) {
  if (!p.faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url
    }))
  };
}

export function listingsItemListJsonLd(list: Property[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: propertyUrl(p),
      name: `${p.title} – ${propertyDescriptor(p)}`,
      image: p.images?.[0]
    }))
  };
}
