/**
 * Full-page skeleton shown as Suspense fallback during lazy route loading.
 */
export default function PageSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Banner placeholder */}
      <div
        style={{
          minHeight: 'clamp(300px, 42vh, 440px)',
          background: 'var(--gradient-dark)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: 'calc(var(--navbar-h) + 3rem) clamp(1.25rem, 5vw, 5rem) 3rem',
        }}
      >
        <div style={{ width: '50%' }}>
          <div style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.08)', marginBottom: '1rem', width: '30%' }} />
          <div style={{ height: 48, borderRadius: 8, background: 'rgba(255,255,255,0.06)', width: '80%' }} />
        </div>
      </div>

      {/* Content placeholder */}
      <div style={{ padding: '4rem clamp(1.25rem, 5vw, 6rem)', maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 24,
              borderRadius: 6,
              marginBottom: '1rem',
              width: `${85 - i * 10}%`,
              background: 'linear-gradient(90deg, #e8ecf4 0%, #f4f6fc 50%, #e8ecf4 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.6s linear infinite',
            }}
          />
        ))}
      </div>
    </div>
  );
}
