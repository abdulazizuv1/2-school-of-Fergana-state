import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';

export default function AdminModal({ open, onClose, title, children, onSave, saving }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'black',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              right: 0, top: 0, bottom: 0,
              width: 'min(480px, 100vw)',
              background: 'white',
              boxShadow: 'var(--shadow-hover)',
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              flexShrink: 0,
            }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', borderRadius: '0.5rem', color: 'var(--color-text-muted)', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {children}
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem',
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--color-border)',
              flexShrink: 0,
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-border)', background: 'transparent',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem', cursor: 'pointer', color: 'var(--color-text-muted)',
                }}
              >
                Отмена
              </button>
              <MagneticButton
                type="button"
                variant="primary"
                icon={Save}
                onClick={onSave}
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </MagneticButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
