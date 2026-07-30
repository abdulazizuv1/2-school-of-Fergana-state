import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LogIn, AlertCircle, Lock, Mail } from 'lucide-react';
import { auth } from '@/firebase/config';
import MagneticButton from '@/components/ui/MagneticButton';

const inputStyle = {
  width: '100%',
  height: 44,
  padding: '0.5rem 0',
  border: 'none',
  borderBottom: '1px solid var(--color-border)',
  background: 'transparent',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  color: 'var(--color-text)',
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      const code = err.code || '';
      const messages = {
        'auth/invalid-credential':        'Неверный email или пароль',
        'auth/user-not-found':            'Пользователь не найден',
        'auth/wrong-password':            'Неверный пароль',
        'auth/invalid-email':             'Неверный формат email',
        'auth/user-disabled':             'Аккаунт отключён',
        'auth/operation-not-allowed':     'Email/Password вход не включён в Firebase Console',
        'auth/too-many-requests':         'Слишком много попыток. Попробуйте позже',
      };
      setError(messages[code] || `Ошибка: ${code || err.message}`);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="with-grain"
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <motion.div
        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'white',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-hover)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '14px',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1 }}>2</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.375rem' }}>
            Панель управления
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Введите данные для входа
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                {...register('email', { required: true })}
                type="email"
                style={{ ...inputStyle, paddingLeft: '1.75rem' }}
                placeholder="admin@school2.uz"
              />
            </div>
            <div style={{ height: 1, background: errors.email ? 'var(--color-vivid)' : 'var(--color-border)' }} />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Пароль
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                {...register('password', { required: true })}
                type="password"
                style={{ ...inputStyle, paddingLeft: '1.75rem' }}
                placeholder="••••••••"
              />
            </div>
            <div style={{ height: 1, background: errors.password ? 'var(--color-vivid)' : 'var(--color-border)' }} />
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: 'var(--color-vivid)', fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  padding: '0.6rem 0.85rem',
                  background: 'rgba(230,57,70,0.06)',
                  borderRadius: '0.75rem',
                }}
              >
                <AlertCircle size={15} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <MagneticButton
            type="submit"
            variant="primary"
            icon={LogIn}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </MagneticButton>
        </form>
      </motion.div>
    </div>
  );
}
