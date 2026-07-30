import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';

/**
 * Шапка внутренних страниц: фото школы + мягкое цветное затемнение,
 * хлебные крошки и заголовок с построчным появлением.
 */
function splitWords(el) {
  if (!el) return [];
  const text = el.textContent;
  el.innerHTML = text
    .split(' ')
    .map(
      (w) =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="wi" style="display:inline-block">${w}</span></span>`
    )
    .join(' ');
  return Array.from(el.querySelectorAll('.wi'));
}

export default function PageBanner({
  title,
  subtitle,
  breadcrumb,
  image = '/images/school-05.jpg',
}) {
  const { t } = useTranslation();
  const headingRef = useRef(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const words = splitWords(el);
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(words, { y: '110%' }, {
        y: '0%', duration: 0.85, stagger: 0.08, ease: 'power4.out', delay: 0.15,
      });
    });

    return () => ctx.revert();
  }, [title]);

  return (
    <div
      className="with-grain"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        minHeight: 'clamp(300px, 42vh, 440px)',
        paddingTop: 'calc(var(--navbar-h) + clamp(2rem, 5vw, 4rem))',
        paddingBottom: 'clamp(2rem, 4vw, 3.25rem)',
        paddingLeft: 'var(--section-px)',
        paddingRight: 'var(--section-px)',
        overflow: 'hidden',
      }}
    >
      {/* Фото */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Мягкое цветное затемнение вместо плоского чёрного.
          Без mix-blend-mode: в Chromium слой с soft-light поверх фиксированной
          шапки с backdrop-filter схлопывался в чёрный прямоугольник. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(20,50,77,0.72) 0%, rgba(20,50,77,0.48) 50%, rgba(20,50,77,0.76) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(60% 70% at 12% 30%, rgba(111,176,227,0.34) 0%, transparent 62%), radial-gradient(55% 60% at 88% 80%, rgba(168,217,111,0.28) 0%, transparent 62%)',
        }}
      />

      {/* Содержимое */}
      <div className="container-site" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <nav
          aria-label="breadcrumb"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem',
            color: 'rgba(244,249,253,0.65)', fontSize: '0.8rem',
          }}
        >
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'inherit', textDecoration: 'none', transition: 'color 200ms' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; }}
          >
            <Home size={13} />
            <span>{t('breadcrumb.home')}</span>
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: 'rgba(244,249,253,0.92)' }}>{breadcrumb || title}</span>
        </nav>

        <h1
          ref={headingRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-h1)',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-tight)',
            color: '#fff',
            lineHeight: 1.1,
            maxWidth: '18ch',
            margin: 0,
            textShadow: '0 3px 22px rgba(20,50,77,0.35)',
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              marginTop: '0.9rem',
              maxWidth: '54ch',
              color: 'rgba(255,255,255,0.86)',
              fontSize: 'var(--text-lg)',
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
