import { useId } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'uz', label: 'UZ' },
];

/**
 * Переключатель языка. layoutId уникален для каждого экземпляра —
 * иначе «пилюля» в шапке и в подвале дерутся за одну и ту же анимацию.
 */
export default function LangSwitcher({ light = false, bare = false }) {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const pillId = useId();

  const switchLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
  };

  /* Плоский вариант для шапки «Афиша»: без подложки, активный — зелёным */
  if (bare) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        {LANGS.map(({ code, label }) => {
          const isActive = current === code;
          return (
            <button
              key={code}
              onClick={() => switchLang(code)}
              aria-label={`Switch to ${label}`}
              aria-pressed={isActive}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                fontWeight: isActive ? 700 : 600,
                color: isActive
                  ? (light ? 'var(--color-accent-light)' : 'var(--color-accent)')
                  : (light ? 'rgba(255,255,255,0.5)' : 'var(--color-text-muted)'),
                transition: 'color 200ms ease',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        background: light ? 'rgba(255,255,255,0.12)' : 'var(--color-primary-soft)',
        borderRadius: 'var(--radius-pill)',
        padding: '3px',
        gap: 0,
        border: light ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--color-border)',
      }}
    >
      {LANGS.map(({ code, label }) => {
        const isActive = current === code;
        return (
          <button
            key={code}
            onClick={() => switchLang(code)}
            style={{
              position: 'relative',
              padding: '4px 12px',
              minHeight: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: 'var(--radius-pill)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: isActive
                ? '#fff'
                : light
                ? 'rgba(244,249,253,0.6)'
                : 'var(--color-text-muted)',
              transition: 'color 200ms ease',
              zIndex: 1,
            }}
            aria-label={`Switch to ${label}`}
          >
            {isActive && (
              <motion.div
                layoutId={`lang-pill-${pillId}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-pill)',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
