import { useRef } from 'react';
import { useSpring } from 'framer-motion';

const isPointerFine =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches;

/**
 * Provides magnetic button physics via Framer Motion springs.
 * Only activates on pointer:fine devices (desktop).
 */
export function useMagneticButton() {
  const ref = useRef(null);

  const buttonX = useSpring(0, { stiffness: 200, damping: 20 });
  const buttonY = useSpring(0, { stiffness: 200, damping: 20 });
  const textX = useSpring(0, { stiffness: 200, damping: 20 });
  const textY = useSpring(0, { stiffness: 200, damping: 20 });

  const onMouseMove = (e) => {
    if (!isPointerFine || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      buttonX.set(dx * 0.35);
      buttonY.set(dy * 0.35);
      textX.set(dx * 0.15);
      textY.set(dy * 0.15);
    }
  };

  const onMouseLeave = () => {
    buttonX.set(0);
    buttonY.set(0);
    textX.set(0);
    textY.set(0);
  };

  return { ref, buttonX, buttonY, textX, textY, onMouseMove, onMouseLeave };
}
