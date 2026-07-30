import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  LayoutDashboard, Newspaper, Users, Crown, Trophy, Layers, BookOpen, Image, LogOut,
  FileText, Info,
} from 'lucide-react';
import { auth } from '@/firebase/config';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',      to: '/admin/dashboard' },
  { icon: Info,            label: 'О школе',         to: '/admin/about' },
  { icon: Newspaper,       label: 'Новости',         to: '/admin/news' },
  { icon: Users,           label: 'Учителя',         to: '/admin/teachers' },
  { icon: Crown,           label: 'Руководство',     to: '/admin/leadership' },
  { icon: Trophy,          label: 'Гордость школы',  to: '/admin/achievers' },
  { icon: Layers,          label: 'Клубы и кружки',  to: '/admin/clubs' },
  { icon: BookOpen,        label: 'Учебный план',    to: '/admin/curriculum' },
  { icon: FileText,        label: 'Документы',       to: '/admin/documents' },
  { icon: Image,           label: 'Галерея',         to: '/admin/gallery' },
];

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const currentPage = navItems.find((item) => location.pathname.startsWith(item.to));

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: 260,
        background: 'var(--color-bg-dark)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: '9px',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, color: 'white', lineHeight: 1.1 }}>MAKTAB</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(240,244,255,0.35)', textTransform: 'uppercase', lineHeight: 1 }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '1rem 0' }} />

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.875rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'white' : 'rgba(240,244,255,0.5)',
                background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                transition: 'all 200ms',
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.background.includes('0.10')) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.style.background.includes('0.10')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(240,244,255,0.5)';
                }
              }}
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'rgba(240,244,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email || ''}
          </span>
          <button
            onClick={handleLogout}
            title="Выйти"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', borderRadius: '0.5rem', color: 'rgba(240,244,255,0.4)', display: 'flex', flexShrink: 0, transition: 'color 200ms' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-vivid)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,244,255,0.4)'; }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg)' }}>
        {/* Topbar */}
        <header style={{
          height: 64,
          background: 'white',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 5,
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            {currentPage?.label || 'Admin'}
          </h1>
          {user && (
            <div style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}>
              {user.email[0].toUpperCase()}
            </div>
          )}
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
