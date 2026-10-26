import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

interface Reveal3DProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Scroll-linked 3D entrance: the section tilts back on the X axis and rises
 * into place as it enters the viewport. All transforms resolve to identity
 * once revealed, so fixed-position descendants are unaffected afterwards.
 */
export const Reveal3D: React.FC<Reveal3DProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.6'] });

  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.2, 0.85, 1]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`[overflow-x:clip] ${className ?? ''}`}>
      <motion.div
        style={{ rotateX, y, scale, opacity, transformPerspective: 1400, transformOrigin: '50% 0%' }}
      >
        {children}
      </motion.div>
    </div>
  );
};
