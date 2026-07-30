import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LazyImage from './LazyImage';
import { lf } from '@/utils/localeField';

const CATEGORY_COLORS = {
  news:    { bg: 'rgba(44,107,168,0.10)',  color: '#2C6BA8' },
  event:   { bg: 'rgba(242,169,59,0.14)',  color: '#C9821F' },
  sport:   { bg: 'rgba(94,198,160,0.14)',  color: '#37997A' },
  science: { bg: 'rgba(79,195,199,0.14)',  color: '#2F9296' },
  default: { bg: 'rgba(122,182,72,0.13)',  color: '#5E9134' },
};

function formatDate(timestamp, lang) {
  if (!timestamp) return '';
  const date = timestamp?.toDate?.() || new Date(timestamp);
  return new Intl.DateTimeFormat(lang === 'uz' ? 'uz-UZ' : lang === 'en' ? 'en-GB' : 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * News card in two variants: "featured" (vertical, large) and "compact" (horizontal, small).
 */
export default function NewsCard({ article, variant = 'compact' }) {
  const { i18n } = useTranslation();
  const catStyle = CATEGORY_COLORS[article?.category] || CATEGORY_COLORS.default;
  const dateStr = formatDate(article?.date, i18n.language);

  if (variant === 'featured') {
    return (
      <Link
        to={`/news/${article?.slug || article?.id || ''}`}
        style={{
          display: 'flex', flexDirection: 'column',
          borderRadius: 'var(--card-radius)', overflow: 'hidden',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)', textDecoration: 'none', height: '100%',
          transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms',
        }}
        className="group"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
          const im = e.currentTarget.querySelector('img');
          if (im) im.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
          const im = e.currentTarget.querySelector('img');
          if (im) im.style.transform = 'scale(1)';
        }}
      >
        <LazyImage src={article?.photo_url || ''} alt={lf(article, 'title')} aspectRatio="16/9" />
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center gap-3 mb-3">
            <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: catStyle.bg, color: catStyle.color, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {article?.category}
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{dateStr}</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2vw, 1.45rem)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text)', margin: '0 0 0.75rem', lineHeight: 1.25, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {lf(article, 'title')}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.65, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', marginBottom: '1rem', flex: 1 }}>
            {lf(article, 'content')?.slice(0, 200)}
          </p>
          <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.85rem' }}>
            <div className="flex items-center gap-4" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              {article?.date && <span className="flex items-center gap-1"><Calendar size={13} />{dateStr}</span>}
              {article?.views && <span className="flex items-center gap-1"><Eye size={13} />{article.views}</span>}
            </div>
            <ArrowRight size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>
      </Link>
    );
  }

  // Compact variant
  return (
    <Link
      to={`/news/${article?.slug || article?.id || ''}`}
      style={{
        display: 'flex', gap: '1rem', borderRadius: 'var(--card-radius)', overflow: 'hidden',
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)', padding: '1rem', textDecoration: 'none',
        alignItems: 'flex-start',
        transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1), box-shadow 320ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
    >
      <div style={{ width: 96, flexShrink: 0, borderRadius: '0.85rem', overflow: 'hidden' }}>
        <LazyImage src={article?.photo_url || ''} alt={lf(article, 'title')} aspectRatio="1/1" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: catStyle.bg, color: catStyle.color, fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-block', marginBottom: '0.4rem' }}>
          {article?.category}
        </span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.3rem', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {lf(article, 'title')}
        </h3>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{dateStr}</span>
      </div>
    </Link>
  );
}
