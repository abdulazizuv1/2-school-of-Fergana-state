import { motion } from 'framer-motion';

const directionMap = {
  up:    { y: 50, x: 0 },
  down:  { y: -50, x: 0 },
  left:  { y: 0, x: -60 },
  right: { y: 0, x: 60 },
  none:  { y: 0, x: 0 },
};

/**
 * Wraps children in a scroll-triggered fade + slide animation.
 */
export default function FadeInView({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  as = 'div',
}) {
  const Tag = motion[as] || motion.div;
  const { x, y } = directionMap[direction] || directionMap.up;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
