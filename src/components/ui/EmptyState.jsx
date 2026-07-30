import { Inbox } from 'lucide-react';
import MagneticButton from './MagneticButton';

/**
 * Аккуратная заглушка для разделов, куда ещё не добавили содержимое.
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title,
  body,
  actionLabel,
  actionTo,
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'clamp(2.5rem, 6vw, 4.5rem) 1.5rem',
        background: 'var(--color-surface)',
        border: '1px dashed var(--color-border-strong)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: 620,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: 68, height: 68, borderRadius: '1.4rem',
          background: 'var(--color-primary-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.4rem',
        }}
      >
        <Icon size={30} color="var(--color-primary)" strokeWidth={1.6} />
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700,
        color: 'var(--color-text)', margin: '0 0 0.6rem',
      }}>
        {title}
      </h3>

      {body && (
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 auto', maxWidth: '46ch' }}>
          {body}
        </p>
      )}

      {actionLabel && actionTo && (
        <div style={{ marginTop: '1.75rem' }}>
          <MagneticButton to={actionTo} variant="outline">{actionLabel}</MagneticButton>
        </div>
      )}
    </div>
  );
}
