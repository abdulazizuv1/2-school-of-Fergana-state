import { AlertCircle } from 'lucide-react';

const baseInputStyle = {
  width: '100%',
  border: '1px solid var(--color-border)',
  borderRadius: '0.75rem',
  padding: '0.6rem 1rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  color: 'var(--color-text)',
  background: 'white',
  outline: 'none',
  transition: 'border-color 200ms',
};

export default function AdminFormField({ label, name, type = 'text', register, error, options, rows, placeholder }) {
  const borderColor = error ? 'var(--color-vivid)' : 'var(--color-border)';

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {label}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          {...(register ? register(name) : {})}
          rows={rows || 4}
          placeholder={placeholder}
          style={{ ...baseInputStyle, borderColor, resize: 'vertical', minHeight: 100 }}
        />
      ) : type === 'select' ? (
        <select
          {...(register ? register(name) : {})}
          style={{ ...baseInputStyle, borderColor, cursor: 'pointer' }}
        >
          {(options || []).map(({ value, label: optLabel }) => (
            <option key={value} value={value}>{optLabel}</option>
          ))}
        </select>
      ) : (
        <input
          {...(register ? register(name) : {})}
          type={type}
          placeholder={placeholder}
          style={{ ...baseInputStyle, borderColor }}
        />
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem', color: 'var(--color-vivid)', fontSize: '0.75rem' }}>
          <AlertCircle size={13} />
          {error}
        </div>
      )}
    </div>
  );
}
