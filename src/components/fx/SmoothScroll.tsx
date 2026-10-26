import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

/** Inertial smooth scrolling (Lenis) plus a brand-coloured reading-progress bar. */
export const SmoothScroll: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      allowNestedScroll: true,
      // Let modals, drawers and dropdowns keep their own native scrolling
      prevent: (node: HTMLElement) =>
        Boolean(node.closest?.('[role="dialog"], .fixed.inset-0, .overflow-y-auto, .overflow-auto, [data-lenis-prevent]'))
    });

    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    // Pause inertial scrolling while a modal has locked the page
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      lenis.destroy();
    };
  }, [reduceMotion]);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left bg-gradient-to-r from-[#FF6B35] via-[#ff9a6b] to-[#4f8cff] pointer-events-none"
      style={{ scaleX }}
    />
  );
};
