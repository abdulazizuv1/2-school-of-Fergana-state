import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function AdminConfirmDialog({ open, onClose, onConfirm, title = 'Вы уверены?', description = 'Это действие нельзя отменить.' }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 900,
              background: 'rgba(0,0,0,0.5)',
            }}
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              zIndex: 901,
              background: 'white',
              borderRadius: '1.25rem',
              padding: '2rem',
              width: '100%',
              maxWidth: 400,
              boxShadow: 'var(--shadow-hover)',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(230,57,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={20} color="var(--color-vivid)" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.35rem' }}>{title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>{description}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
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
              <button
                onClick={() => { onConfirm(); onClose(); }}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-pill)',
                  border: 'none', background: 'var(--color-vivid)', color: 'white',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Удалить
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
