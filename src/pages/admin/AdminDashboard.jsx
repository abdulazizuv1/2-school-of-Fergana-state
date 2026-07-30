import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { Newspaper, Users, Trophy, Layers, Plus, UserPlus, Loader2 } from 'lucide-react';
import { db } from '@/firebase/config';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

const statCards = [
  { key: 'news',      label: 'Новости',         icon: Newspaper, color: '#2C6BA8', bg: 'rgba(44,107,168,0.1)' },
  { key: 'teachers',  label: 'Учителя',          icon: Users,     color: '#5EC6A0', bg: 'rgba(94,198,160,0.12)' },
  { key: 'achievers', label: 'Гордость школы',   icon: Trophy,    color: '#F2A93B', bg: 'rgba(242,169,59,0.12)' },
  { key: 'clubs',     label: 'Клубы и кружки',   icon: Layers,    color: '#7AB648', bg: 'rgba(122,182,72,0.12)' },
];

const quickActions = [
  { icon: Plus,     label: 'Добавить новость',    to: '/admin/news',      color: 'var(--color-primary)' },
  { icon: UserPlus, label: 'Добавить учителя',     to: '/admin/teachers',  color: '#5EC6A0' },
  { icon: Trophy,   label: 'Добавить достижение',  to: '/admin/achievers', color: '#F2A93B' },
  { icon: Layers,   label: 'Добавить кружок',      to: '/admin/clubs',     color: '#7AB648' },
];

export default function AdminDashboard() {
  const { data: counts, isLoading: countsLoading } = useQuery({
    queryKey: ['admin-counts'],
    queryFn: async () => {
      const [news, teachers, achievers, clubs] = await Promise.all([
        getDocs(collection(db, 'news')),
        getDocs(collection(db, 'teachers')),
        getDocs(collection(db, 'achievers')),
        getDocs(collection(db, 'clubs')),
      ]);
      return { news: news.size, teachers: teachers.size, achievers: achievers.size, clubs: clubs.size };
    },
    staleTime: 0,
  });

  const { data: recentNews = [], isLoading: newsLoading } = useFirestoreCollection('news', {
    orderByField: 'date',
    direction: 'desc',
    limit: 5,
    queryOptions: { staleTime: 0 },
  });

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
        Обзор
      </h2>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {statCards.map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} style={{
            background: 'white',
            borderRadius: '1.25rem',
            boxShadow: 'var(--shadow-card)',
            padding: '1.5rem',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
              {countsLoading ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> : (counts?.[key] ?? 0)}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Recent news */}
        <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: 'var(--shadow-card)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Последние новости</h3>
            <Link to="/admin/news" style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', textDecoration: 'none' }}>Все →</Link>
          </div>
          {newsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem' }}>
              <Loader2 size={20} color="var(--color-text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : recentNews.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>Нет новостей</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentNews.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 500 }}>{a.title_ru || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{a.date ? new Date(a.date).toLocaleDateString('ru-RU') : ''}</div>
                  </div>
                  <Link to="/admin/news" style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', textDecoration: 'none', flexShrink: 0 }}>Изменить</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: 'var(--shadow-card)', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 1.25rem' }}>Быстрые действия</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {quickActions.map(({ icon: Icon, label, to, color }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  transition: 'all 200ms',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--color-text)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={color} />
                </div>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
