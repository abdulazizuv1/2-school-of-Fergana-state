import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Full-screen entry loader. Shows min 1.8s.
 * Animates SVG "2" via stroke-dashoffset draw effect.
 * Calls onComplete when done.
 */
export default function AppLoader({ onComplete }) {
  const pathRef = useRef(null);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const minTime = 1800;
    const start = Date.now();

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) { clearInterval(progressInterval); return 1; }
        return p + 0.02;
      });
    }, 36);

    // Animate SVG stroke
    const path = pathRef.current;
    if (path) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        path.animate(
          [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
          { duration: 1200, easing: 'ease-in-out', fill: 'forwards' }
        );
      } else {
        path.style.strokeDashoffset = 0;
      }
    }

    const timer = setTimeout(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minTime - elapsed);
      setTimeout(() => {
        setDone(true);
        setTimeout(() => onComplete?.(), 750);
      }, remaining);
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  // Кольцо прогресса и цифра живут в одном viewBox 140×140 с общим центром (70,70),
  // поэтому «2» гарантированно оказывается внутри круга при любом размере.
  const R = 52;
  const circumference = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gradient-dark)',
            overflow: 'hidden',
          }}
        >
          {/* Pulsing radial bg */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.18, 0.35] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(111,176,227,0.45) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Кольцо прогресса + прорисовка «2» в одном SVG */}
          <div style={{ marginBottom: '1.75rem' }}>
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" aria-hidden="true">
              {/* Фоновое кольцо */}
              <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

              {/* Кольцо прогресса */}
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="var(--color-accent-light)"
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '70px 70px',
                  transition: 'stroke-dashoffset 120ms linear',
                }}
              />

              {/* Стилизованная «2». Исходный контур занимает бокс 18…62 × 8…70,
                  поэтому его центр (40, 39) переносим в центр кольца и уменьшаем. */}
              <g transform="translate(70 70) scale(0.72) translate(-40 -39)">
                <path
                  ref={pathRef}
                  d="M 18,28 C 18,14 32,8 45,12 C 58,16 62,28 55,38 C 50,45 40,52 26,65 L 22,70 L 62,70"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>

          {/* School name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              letterSpacing: '0.25em',
              color: 'var(--color-text-inv)',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            ШКОЛА № 2 · ФЕРГАНА
          </motion.div>

          {/* Thin accent line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 1.2, duration: 0.4, ease: 'easeOut' }}
            style={{ height: 2, background: 'var(--color-accent)', borderRadius: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
