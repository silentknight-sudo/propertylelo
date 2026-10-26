import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, MotionValue } from 'motion/react';
import { MapPin, ShieldCheck, ArrowUpRight, Sparkles, Maximize2, BedDouble } from 'lucide-react';
import { Property } from '../types/property';
import { propertyPath, propertyImageAlt, propertyDescriptor } from '../lib/seo';

interface FeaturedShowcaseProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

interface ShowcaseCardProps {
  property: Property;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onSelect: (property: Property) => void;
  flat?: boolean;
}

// Each card swings on the Y axis as it travels through the centre of the
// viewport, giving the horizontal track a rotating-carousel depth effect.
const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ property, index, total, progress, onSelect, flat }) => {
  const centre = total > 1 ? index / (total - 1) : 0;
  const spread = total > 1 ? 1 / (total - 1) : 1;
  const range = [centre - spread * 1.2, centre, centre + spread * 1.2];
  const rotateY = useTransform(progress, range, [28, 0, -28]);
  const scale = useTransform(progress, range, [0.86, 1, 0.86]);
  const z = useTransform(progress, range, [-120, 0, -120]);
  const imageX = useTransform(progress, range, ['-12%', '0%', '12%']);
  const href = propertyPath(property);

  return (
    <motion.article
      style={flat ? undefined : { rotateY, scale, z, transformPerspective: 1600 }}
      className="relative shrink-0 w-[82vw] sm:w-[60vw] lg:w-[44vw] xl:w-[38vw] h-[56vh] max-h-[540px] rounded-[2rem] overflow-hidden bg-[#071f49] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] border border-white/10 group"
    >
      <motion.img
        src={property.images?.[0]}
        alt={propertyImageAlt(property)}
        loading="lazy"
        decoding="async"
        style={flat ? undefined : { x: imageX, scale: 1.25 }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001233] via-[#001233]/45 to-transparent" />

      <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/25">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
          {property.category === 'Commercial' ? 'Commercial Pick' : 'Spotlight Home'}
        </span>
        <span className="text-white/70 font-heading text-sm font-bold tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-200/90 font-bold mb-2">{propertyDescriptor(property)}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold font-heading leading-tight">
          <a
            href={href}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey) return;
              e.preventDefault();
              onSelect(property);
            }}
            className="after:absolute after:inset-0 focus:outline-none focus-visible:underline"
          >
            {property.title}
          </a>
        </h3>
        {property.tagline && <p className="mt-1.5 text-sm text-blue-100/85 line-clamp-2">{property.tagline}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-blue-50/90">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF6B35]" />
            {property.locality}, {property.city}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {property.bhk > 0 ? <BedDouble className="w-4 h-4 text-[#FF6B35]" /> : <Maximize2 className="w-4 h-4 text-[#FF6B35]" />}
            {property.bhk > 0 ? `${property.bhk} BHK` : `${property.area.toLocaleString('en-IN')} sq.ft`}
          </span>
          {property.reraId && (
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              RERA {property.reraId}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <span className="text-2xl sm:text-3xl font-black font-heading text-white">{property.priceFormatted}</span>
          <span aria-hidden="true" className="pointer-events-none relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/40 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

/**
 * Pinned section: vertical scrolling drives a horizontal, depth-rotated track
 * of the best listings. Falls back to a native horizontal scroller when the
 * visitor prefers reduced motion.
 */
export const FeaturedShowcase: React.FC<FeaturedShowcaseProps> = ({ properties, onSelectProperty }) => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const spotlight = useMemo(() => {
    const featured = properties.filter((p) => p.featured);
    const rest = properties.filter((p) => !p.featured);
    return [...featured, ...rest].slice(0, 6);
  }, [properties]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [spotlight.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const headingY = useTransform(smooth, [0, 1], [0, -40]);
  const barScale = useTransform(smooth, [0, 1], [0.05, 1]);

  if (spotlight.length === 0) return null;

  const header = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-200 text-xs font-bold uppercase tracking-wider mb-3 border border-white/15">
        <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
        Spotlight Listings
      </div>
      <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
        Featured Properties for Sale <span className="text-[#FF6B35]">this Week</span>
      </h2>
      <p className="mt-2 text-sm sm:text-base text-blue-100/80 max-w-2xl">
        Hand-picked RERA-verified projects and owner listings — from assured-return commercial space on Noida Expressway to
        luxury homes in Gurgaon, Mumbai and Bangalore.
      </p>
    </div>
  );

  if (reduceMotion) {
    return (
      <section ref={sectionRef} aria-label="Featured properties" className="py-16 bg-[#001233]">
        {header}
        <div className="mt-8 flex gap-6 overflow-x-auto px-4 sm:px-8 pb-4 snap-x">
          {spotlight.map((p, i) => (
            <div key={p.id} className="snap-center">
              <ShowcaseCard property={p} index={i} total={spotlight.length} progress={scrollYProgress} onSelect={onSelectProperty} flat />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Featured properties"
      className="relative bg-[#001233]"
      style={{ height: `${100 + spotlight.length * 55}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center pt-28 pb-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <motion.div style={{ y: headingY }} className="relative">
          {header}
        </motion.div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative mt-8 flex gap-6 sm:gap-10 pl-4 sm:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-[10vw] [transform-style:preserve-3d] will-change-transform"
        >
          {spotlight.map((p, i) => (
            <ShowcaseCard key={p.id} property={p} index={i} total={spotlight.length} progress={smooth} onSelect={onSelectProperty} />
          ))}
        </motion.div>

        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8">
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div style={{ scaleX: barScale }} className="h-full origin-left bg-gradient-to-r from-[#FF6B35] to-[#ffb38a]" />
          </div>
        </div>
      </div>
    </section>
  );
};
