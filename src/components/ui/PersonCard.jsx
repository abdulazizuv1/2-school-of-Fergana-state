import { useTranslation } from 'react-i18next';
import { Clock, Quote } from 'lucide-react';
import LazyImage from './LazyImage';
import { lf } from '@/utils/localeField';

/** Инициалы для заглушки, когда фото ещё не загрузили. */
function initials(name = '') {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/**
 * Карточка человека: leadership | teacher | achiever.
 *
 * Во всех вариантах рамка фото имеет фиксированное соотношение сторон,
 * поэтому размер карточки не «прыгает» после того, как фото добавят.
 */
export default function PersonCard({ person, variant = 'teacher' }) {
  const { t } = useTranslation();
  const name = lf(person, 'name');
  // Админка сохраняет поле `experience`; старые записи могли иметь `experience_years`
  const experience = Number(person.experience ?? person.experience_years ?? 0);

  /* ─── Гордость школы ─── */
  if (variant === 'achiever') {
    return (
      <div
        className="text-center"
        style={{
          borderRadius: 'var(--card-radius)',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(10px)',
          padding: '1.75rem 1.25rem',
          height: '100%',
          transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms, background 380ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.11)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.1rem' }}>
          <div style={{
            width: 116, height: 116, borderRadius: '50%', overflow: 'hidden',
            border: '3px solid var(--color-accent-light)', flexShrink: 0,
            boxShadow: '0 8px 24px rgba(20,50,77,0.28)',
          }}>
            <LazyImage src={person.photo_url} alt={name} aspectRatio="1/1" placeholderText={initials(name)} />
          </div>
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem' }}>
          {name}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-accent-light)', margin: '0 0 0.85rem', lineHeight: 1.5 }}>
          {lf(person, 'achievement')}
        </p>
        {person.year && (
          <span style={{
            display: 'inline-block', padding: '3px 13px', borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.1)',
            fontSize: '0.74rem', color: 'rgba(244,249,253,0.82)',
          }}>
            {person.year}
          </span>
        )}
      </div>
    );
  }

  /* ─── Руководство ─── */
  if (variant === 'leadership') {
    return (
      <article
        style={{
          borderRadius: 'var(--card-radius)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
          const bar = e.currentTarget.querySelector('[data-bar]');
          if (bar) bar.style.transform = 'scaleX(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
          const bar = e.currentTarget.querySelector('[data-bar]');
          if (bar) bar.style.transform = 'scaleX(0)';
        }}
      >
        {/* Рамка фото — всегда 4:5, независимо от наличия и размера файла */}
        <div style={{ position: 'relative', width: '100%' }}>
          <LazyImage
            src={person.photo_url}
            alt={name}
            aspectRatio="4/5"
            objectPosition="center top"
            placeholderText={initials(name)}
          />
        </div>

        <div style={{ padding: '1.15rem 1.25rem 1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700,
            color: 'var(--color-text)', margin: '0 0 0.35rem', lineHeight: 1.3,
          }}>
            {name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
            {lf(person, 'position')}
          </p>
        </div>

        <div
          data-bar
          style={{
            height: 3, background: 'var(--gradient-accent)',
            transform: 'scaleX(0)', transformOrigin: 'left',
            transition: 'transform 340ms cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </article>
    );
  }

  /* ─── Учитель ─── */
  return (
    <article
      style={{
        borderRadius: 'var(--card-radius)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      <LazyImage
        src={person.photo_url}
        alt={name}
        aspectRatio="3/4"
        objectPosition="center top"
        placeholderText={initials(name)}
      />

      <div style={{ padding: '1rem 1.1rem 1.25rem', flex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: 700,
          color: 'var(--color-text)', margin: '0 0 0.5rem', lineHeight: 1.3,
        }}>
          {name}
        </h3>

        {lf(person, 'subject') && (
          <span style={{
            display: 'inline-block', padding: '3px 11px', borderRadius: 'var(--radius-pill)',
            background: 'var(--color-primary-soft)', border: '1px solid var(--color-border)',
            fontSize: '0.74rem', color: 'var(--color-primary)', marginBottom: '0.5rem',
          }}>
            {lf(person, 'subject')}
          </span>
        )}

        {experience > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: lf(person, 'bio') ? '0.6rem' : 0 }}>
            <Clock size={12} />
            <span>{experience} {t('pages.teachers.years_exp')}</span>
          </div>
        )}

        {lf(person, 'bio') && (
          <p style={{
            color: 'var(--color-text-muted)', fontSize: '0.82rem', lineHeight: 1.55, margin: 0,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
          }}>
            {lf(person, 'bio')}
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * Крупная карточка директора: круглая рамка фиксированного размера +
 * цитата. Вынесена сюда, чтобы страница руководства осталась простой.
 */
export function DirectorCard({ person, titleLabel, fallbackMessage }) {
  const name = lf(person || {}, 'name');

  return (
    <div className="director-card">
      <div
        style={{
          width: 'clamp(190px, 24vw, 260px)',
          aspectRatio: '1/1',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid var(--color-accent)',
          boxShadow: '0 16px 44px rgba(44,107,168,0.2)',
          flexShrink: 0,
          justifySelf: 'center',
        }}
      >
        <LazyImage
          src={person?.photo_url}
          alt={name}
          aspectRatio="1/1"
          objectPosition="center top"
          placeholderText={initials(name)}
        />
      </div>

      <div>
        <p style={{
          fontSize: '0.74rem', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase',
          color: 'var(--color-primary)', fontWeight: 600, marginBottom: '0.55rem',
        }}>
          {titleLabel}
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800,
          color: 'var(--color-text)', margin: '0 0 0.4rem', lineHeight: 1.2,
        }}>
          {name}
        </h2>
        <p style={{ color: 'var(--color-primary)', fontWeight: 500, marginBottom: '1.5rem' }}>
          {lf(person || {}, 'position')}
        </p>

        <blockquote style={{
          position: 'relative',
          borderLeft: '3px solid var(--color-accent)',
          paddingLeft: '1.5rem',
          fontSize: '1.05rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.75,
          margin: 0,
        }}>
          <Quote
            size={22}
            color="var(--color-accent)"
            style={{ opacity: 0.4, marginBottom: '0.4rem' }}
          />
          {lf(person || {}, 'message') || fallbackMessage}
        </blockquote>
      </div>
    </div>
  );
}
