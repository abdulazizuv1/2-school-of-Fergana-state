import { Link } from 'react-router-dom';
import { Users, Clock, ArrowUpRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { lf } from '@/utils/localeField';
import { clubPath, isMainClub } from '@/utils/clubs';

const PALETTE = [
  { from: '#2C6BA8', to: '#6FB0E3' },
  { from: '#7AB648', to: '#A8D96F' },
  { from: '#F2A93B', to: '#FFCB77' },
  { from: '#4FC3C7', to: '#8FE0E2' },
  { from: '#E8776B', to: '#F5A79E' },
  { from: '#5EC6A0', to: '#9BE0C6' },
];

/**
 * Карточка кружка / клуба. Кликабельна целиком — ведёт на страницу кружка.
 */
export default function ClubCard({ club, index = 0 }) {
  const { t } = useTranslation();
  const c = PALETTE[index % PALETTE.length];

  const Icon = club.icon_name ? (LucideIcons[club.icon_name] || LucideIcons.Sparkles) : LucideIcons.Sparkles;
  const members = club.members_count ?? club.members;
  const schedule = lf(club, 'schedule');
  const main = isMainClub(club);

  return (
    <Link
      to={clubPath(club)}
      style={{
        width: 316,
        minHeight: 400,
        borderRadius: 'var(--card-radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        textDecoration: 'none',
        transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1), box-shadow 400ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
        const arrow = e.currentTarget.querySelector('[data-arrow]');
        if (arrow) arrow.style.transform = 'translate(3px, -3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        const arrow = e.currentTarget.querySelector('[data-arrow]');
        if (arrow) arrow.style.transform = 'translate(0,0)';
      }}
    >
      {/* Шапка: фото или цветной градиент с иконкой */}
      <div
        style={{
          position: 'relative',
          height: 168,
          background: `linear-gradient(135deg, ${c.from} 0%, ${c.to} 100%)`,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {club.photo_url && (
          <img
            src={club.photo_url}
            alt=""
            aria-hidden="true"
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
          />
        )}

        {/* Декоративные круги */}
        <div aria-hidden="true" style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', top: -46, right: -34 }} />
        <div aria-hidden="true" style={{ position: 'absolute', width: 92, height: 92, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', bottom: -30, left: -18 }} />

        {/* Бейдж «клуб / кружок» */}
        <span
          style={{
            position: 'absolute', top: '1rem', left: '1rem',
            background: 'rgba(255,255,255,0.92)',
            color: main ? 'var(--color-primary)' : 'var(--color-text)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 12px',
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase',
          }}
        >
          {main ? t('clubs_page.type_club') : t('clubs_page.type_circle')}
        </span>

        <div
          style={{
            position: 'absolute', bottom: '1rem', left: '1rem',
            width: 54, height: 54, borderRadius: '1rem',
            background: 'rgba(255,255,255,0.24)',
            border: '1px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon size={26} color="white" strokeWidth={1.7} />
        </div>

        <ArrowUpRight
          data-arrow
          size={20}
          color="white"
          style={{
            position: 'absolute', bottom: '1.4rem', right: '1.2rem',
            transition: 'transform 300ms cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </div>

      {/* Содержимое */}
      <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.28rem', fontWeight: 700,
          letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text)', margin: '0 0 0.5rem',
        }}>
          {lf(club, 'name')}
        </h3>

        <p style={{
          fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, flex: 1,
          margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        }}>
          {lf(club, 'description')}
        </p>

        {(members || schedule) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
            borderTop: '1px solid var(--color-border)', paddingTop: '0.85rem', marginTop: '1rem',
          }}>
            {members ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                <Users size={14} color="var(--color-primary)" /> {members}
              </span>
            ) : null}
            {schedule ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                <Clock size={14} color="var(--color-primary)" /> {schedule}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </Link>
  );
}
