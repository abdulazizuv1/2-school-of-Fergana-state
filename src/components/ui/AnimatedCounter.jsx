import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * Animates a number from 0 to target when scrolled into view.
 */
export default function AnimatedCounter({ target, suffix = '', className = '' }) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 50, damping: 20 });
  const displayRef = useRef(null);

  const { ref: inViewRef, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      count.set(target);
    }
  }, [inView, target, count]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${Math.round(v)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [spring, suffix]);

  return (
    <span
      ref={(el) => {
        inViewRef(el);
        displayRef.current = el;
      }}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      0{suffix}
    </span>
  );
}
