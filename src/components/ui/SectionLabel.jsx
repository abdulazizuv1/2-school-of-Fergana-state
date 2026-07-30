import FadeInView from './FadeInView';

/**
 * Small pre-heading label: line + uppercase text.
 * Used above every section H2.
 */
export default function SectionLabel({ text, light = false }) {
  return (
    <FadeInView direction="left" className="flex items-center gap-3 mb-4">
      <div
        style={{
          width: 28,
          height: 2,
          borderRadius: 2,
          background: 'var(--gradient-accent)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: 'var(--tracking-caps)',
          textTransform: 'uppercase',
          color: light ? 'rgba(244,249,253,0.7)' : 'var(--color-primary)',
        }}
      >
        {text}
      </span>
    </FadeInView>
  );
}
