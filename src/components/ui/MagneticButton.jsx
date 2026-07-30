import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMagneticButton } from '@/hooks/useMagneticButton';

const MotionLink = motion.create(Link);

const variantStyles = {
  primary: {
    background: 'var(--gradient-primary)',
    color: '#fff',
    border: 'none',
    hoverShadow: '0 12px 30px rgba(44,107,168,0.32)',
  },
  accent: {
    background: 'var(--gradient-accent)',
    color: '#14324D',
    border: 'none',
    hoverShadow: '0 12px 30px rgba(122,182,72,0.38)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: '2px solid var(--color-primary)',
    hoverBg: 'var(--color-primary)',
    hoverColor: '#fff',
  },
  'outline-white': {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.65)',
    hoverBg: 'rgba(255,255,255,0.22)',
    hoverColor: '#fff',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: 'none',
    hoverBg: 'var(--color-primary-soft)',
  },
};

/**
 * Кнопка с «магнитным» эффектом на устройствах с точным указателем.
 * Рендерится как <Link>, <a> или <button> в зависимости от пропсов.
 */
export default function MagneticButton({
  children,
  href,
  to,
  onClick,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  type = 'button',
  disabled = false,
  download = false,
  ariaLabel,
}) {
  const { ref, buttonX, buttonY, textX, textY, onMouseMove, onMouseLeave } =
    useMagneticButton();

  const vs = variantStyles[variant] || variantStyles.primary;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    minHeight: '50px',
    padding: '0 1.75rem',
    borderRadius: 'var(--radius-pill)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.95rem',
    letterSpacing: '-0.01em',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap',
    background: vs.background,
    color: vs.color,
    border: vs.border || 'none',
    opacity: disabled ? 0.6 : 1,
    transition: 'background 220ms ease, color 220ms ease, box-shadow 220ms ease',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: variant === 'outline-white' ? 'blur(8px)' : undefined,
  };

  const inner = (
    <motion.span
      style={{ x: textX, y: textY, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} />}
    </motion.span>
  );

  const motionProps = {
    ref,
    style: { ...baseStyle, x: buttonX, y: buttonY },
    onMouseMove,
    onMouseLeave,
    whileHover: disabled ? undefined : {
      background: vs.hoverBg || vs.background,
      color: vs.hoverColor || vs.color,
      boxShadow: vs.hoverShadow,
      scale: 1.03,
    },
    whileTap: disabled ? undefined : { scale: 0.98 },
    className,
    'aria-label': ariaLabel,
  };

  if (to) {
    return <MotionLink to={to} {...motionProps}>{inner}</MotionLink>;
  }

  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <motion.a
        href={href}
        {...(download ? { download: true } : {})}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} {...motionProps}>
      {inner}
    </motion.button>
  );
}
