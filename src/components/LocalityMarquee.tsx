import React from 'react';
import { MapPin } from 'lucide-react';
import { CITIES_DATA } from '../data/mockData';
import { cityPath } from '../lib/seo';

interface LocalityMarqueeProps {
  onSelectCity: (city: string) => void;
}

// Two counter-scrolling rows of locality searches. Besides the motion, these
// are real links that give crawlers keyword-rich internal paths per city.
const ROW_A = CITIES_DATA.flatMap((c) =>
  c.popularLocalities.slice(0, 3).map((loc) => ({ label: `Flats in ${loc}`, city: c.name }))
);
const ROW_B = CITIES_DATA.flatMap((c) => [
  { label: `Property in ${c.name}`, city: c.name },
  { label: `${c.name} • ${c.avgPriceSqft}`, city: c.name }
]);

const Row: React.FC<{ items: { label: string; city: string }[]; reverse?: boolean; onSelectCity: (city: string) => void }> = ({
  items,
  reverse,
  onSelectCity
}) => (
  <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
    <div className={`flex shrink-0 gap-3 pr-3 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
      {[...items, ...items].map((item, i) => (
        <a
          key={`${item.label}-${i}`}
          href={cityPath(item.city)}
          aria-hidden={i >= items.length ? true : undefined}
          tabIndex={i >= items.length ? -1 : undefined}
          onClick={(e) => {
            e.preventDefault();
            onSelectCity(item.city);
          }}
          className="inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-blue-50 hover:bg-[#FF6B35] hover:border-[#FF6B35] hover:text-white transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-[#FF6B35] group-hover:text-white" />
          {item.label}
        </a>
      ))}
    </div>
  </div>
);

export const LocalityMarquee: React.FC<LocalityMarqueeProps> = ({ onSelectCity }) => (
  <nav aria-label="Popular property searches" className="marquee-pause bg-[#001233] py-8 space-y-3 border-t border-white/5">
    <Row items={ROW_A} onSelectCity={onSelectCity} />
    <Row items={ROW_B} reverse onSelectCity={onSelectCity} />
  </nav>
);
