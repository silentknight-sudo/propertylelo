import { useEffect } from 'react';
import { Property } from '../types/property';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  propertyUrl,
  propertyMetaTitle,
  propertyMetaDescription,
  propertyJsonLd,
  propertyFaqJsonLd,
  breadcrumbJsonLd,
  listingsItemListJsonLd,
  cityMetaTitle,
  cityMetaDescription,
  cityPath
} from '../lib/seo';

interface SeoManagerProps {
  properties: Property[];
  selectedCity: string;
  activeProperty: Property | null;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(id: string, data: unknown | null) {
  let el = document.getElementById(id);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function applyHead(title: string, description: string, url: string, image: string) {
  document.title = title;
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', image);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
  setCanonical(url);
}

/**
 * Keeps <head> (title, description, canonical, OpenGraph, JSON-LD) in sync with
 * what the visitor is looking at, so every property and city view is a
 * distinct, indexable page for JS-rendering crawlers like Googlebot.
 */
export function SeoManager({ properties, selectedCity, activeProperty }: SeoManagerProps) {
  useEffect(() => {
    if (activeProperty) {
      const url = propertyUrl(activeProperty);
      applyHead(
        propertyMetaTitle(activeProperty),
        propertyMetaDescription(activeProperty),
        url,
        activeProperty.images?.[0] || DEFAULT_OG_IMAGE
      );
      setMeta('property', 'og:type', 'product');
      setJsonLd('jsonld-active-listing', propertyJsonLd(activeProperty));
      setJsonLd('jsonld-active-faq', propertyFaqJsonLd(activeProperty));
      setJsonLd(
        'jsonld-breadcrumb',
        breadcrumbJsonLd([
          { name: SITE_NAME, url: `${SITE_URL}/` },
          { name: `Property in ${activeProperty.city}`, url: `${SITE_URL}${cityPath(activeProperty.city)}` },
          { name: activeProperty.title, url }
        ])
      );
      return;
    }

    setMeta('property', 'og:type', 'website');
    setJsonLd('jsonld-active-listing', null);
    setJsonLd('jsonld-active-faq', null);

    const city = selectedCity && selectedCity !== 'Delhi NCR' ? selectedCity : '';
    if (city) {
      const inCity = properties.filter((p) => p.city.toLowerCase() === city.toLowerCase());
      const url = `${SITE_URL}${cityPath(city)}`;
      applyHead(cityMetaTitle(city), cityMetaDescription(city, inCity.length), url, inCity[0]?.images?.[0] || DEFAULT_OG_IMAGE);
      setJsonLd(
        'jsonld-breadcrumb',
        breadcrumbJsonLd([
          { name: SITE_NAME, url: `${SITE_URL}/` },
          { name: `Property in ${city}`, url }
        ])
      );
      setJsonLd('jsonld-listings', listingsItemListJsonLd(inCity.length ? inCity : properties, `Property for sale in ${city}`));
    } else {
      applyHead(DEFAULT_TITLE, DEFAULT_DESCRIPTION, `${SITE_URL}/`, DEFAULT_OG_IMAGE);
      setJsonLd('jsonld-breadcrumb', null);
      setJsonLd('jsonld-listings', listingsItemListJsonLd(properties, 'Verified properties for sale on PropertyLelo'));
    }
  }, [activeProperty, selectedCity, properties]);

  return null;
}
