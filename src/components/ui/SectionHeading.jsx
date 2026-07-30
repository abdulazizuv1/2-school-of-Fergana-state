import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from './SectionLabel';
import FadeInView from './FadeInView';

gsap.registerPlugin(ScrollTrigger);

/**
 * Manually splits heading text into words for GSAP clip-path reveal.
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

/**
 * Section heading with optional label, GSAP word reveal on scroll,
 * and optional subtitle.
 */
export default function SectionHeading({
  label,
  title,
  accentWord,
  subtitle,
  align = 'left',
  light = false,
  level = 'h2',
  className = '',
}) {
  const headingRef = useRef(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const words = splitWords(el);
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.065,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [title]);

  // Render title with optional accent word highlighted
  const renderTitle = () => {
    if (!accentWord || !title.includes(accentWord)) {
      return title;
    }
    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span
          style={{
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {accentWord}
        </span>
        {parts[1]}
      </>
    );
  };

  const Tag = level;

  return (
    <div
      className={`${className}`}
      style={{ textAlign: align }}
    >
      {label && <SectionLabel text={label} light={light} />}
      <Tag
        ref={headingRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-h2)',
          fontWeight: 700,
          letterSpacing: 'var(--tracking-tight)',
          lineHeight: 1.15,
          marginBottom: subtitle ? '1rem' : 0,
          color: light ? 'var(--color-text-inv)' : 'var(--color-primary)',
        }}
      >
        {renderTitle()}
      </Tag>
      {subtitle && (
        <FadeInView delay={0.2}>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: light ? 'rgba(244,249,253,0.7)' : 'var(--color-text-muted)',
              maxWidth: align === 'center' ? '62ch' : '58ch',
              margin: align === 'center' ? '0 auto 1.25rem' : '0 0 1.25rem',
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>
        </FadeInView>
      )}
    </div>
  );
}
