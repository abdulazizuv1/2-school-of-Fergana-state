import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * «Линия через страницу»: тонкая вертикальная линия слева, которая
 * заполняется по мере прокрутки, плюс горизонтальная полоса сверху
 * (она же — единственный индикатор на узких экранах).
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Точка-бегунок едет по всей высоте линии
  const dotTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <>
      <div className="page-progress-line" aria-hidden="true">
        <motion.div
          className="page-progress-line__fill"
          style={{ height: '100%', scaleY: progress }}
        />
        <motion.div className="page-progress-line__dot" style={{ top: dotTop }} />
      </div>

      <motion.div
        className="top-progress-bar"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
    </>
  );
}
