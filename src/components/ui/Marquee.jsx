/**
 * Бесконечная бегущая лента. Список дублируется ровно один раз, а трек
 * сдвигается на -50% — стык получается незаметным, пауза при наведении.
 */
export default function Marquee({
  items = [],
  duration = 40,
  reverse = false,
  separator = '•',
  style = {},
}) {
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div className="marquee-viewport" style={style}>
      <div
        className={`marquee-track${reverse ? ' reverse' : ''}`}
        style={{
          display: 'flex',
          width: 'max-content',
          alignItems: 'center',
          gap: '2.25rem',
          whiteSpace: 'nowrap',
          '--marquee-duration': `${duration}s`,
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2.25rem',
              flexShrink: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.95rem, 1.5vw, 1.3rem)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            {item}
            <span aria-hidden="true" style={{ color: 'var(--color-accent-light)', fontSize: '0.7em' }}>
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
