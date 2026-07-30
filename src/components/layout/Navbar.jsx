import { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  School, Crown, Users, Trophy, Layers, BookOpen, Info, Menu, X, Phone,
  ChevronDown, FileText, Newspaper, Images,
} from 'lucide-react';
import LangSwitcher from '../ui/LangSwitcher';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

/* ─── Логотип-ячейка слева ────────────────────────────────────── */
function Logo({ light, onClick }) {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      onClick={onClick}
      className="nav-cell nav-cell--logo"
      style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none', flexShrink: 0 }}
    >
      <span style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: 'var(--gradient-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-bg-dark)', lineHeight: 1 }}>
          2
        </span>
      </span>

      <span style={{ lineHeight: 1.15, display: 'block' }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700,
          letterSpacing: '-0.01em',
          color: light ? '#fff' : 'var(--color-bg-dark)',
          transition: 'color 300ms ease',
        }}>
          {t('brand.name')}
        </span>
        <span style={{
          display: 'block',
          fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: light ? 'rgba(255,255,255,0.6)' : 'var(--color-text-muted)',
          transition: 'color 300ms ease',
        }}>
          {t('brand.tagline')}
        </span>
      </span>
    </Link>
  );
}

/* ─── Выпадающее меню ─────────────────────────────────────────── */
function DropdownItem({ icon: Icon, label, to, onClose }) {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: '0.7rem',
        padding: '0.6rem 0.8rem', borderRadius: '0.7rem',
        textDecoration: 'none',
        background: isActive ? 'var(--color-accent-soft)' : 'transparent',
        transition: 'background 160ms ease, transform 160ms ease',
      })}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent-soft)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}
    >
      <Icon size={17} color="var(--color-primary)" strokeWidth={1.9} style={{ flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--color-text)' }}>{label}</span>
    </NavLink>
  );
}

function Dropdown({ items, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      style={{
        position: 'absolute', top: '100%', left: 0,
        minWidth: 250,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        borderRadius: '0 0 1rem 1rem',
        boxShadow: 'var(--shadow-hover)',
        border: '1px solid var(--color-border)',
        borderTop: '2px solid var(--color-accent)',
        padding: '0.45rem', zIndex: 100,
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.to}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.035 }}
        >
          <DropdownItem {...item} onClose={onClose} />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Шапка ───────────────────────────────────────────────────── */
export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  /**
   * Гистерезис: «светлая шапка» включается после 80px и выключается
   * только ниже 40px — иначе на границе порога шапка мигала.
   */
  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 40 : y > 80));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setScrolled(window.scrollY > 80);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isLight = !scrolled;

  const navGroups = [
    {
      key: 'school',
      label: t('nav.school'),
      items: [
        { icon: School, label: t('nav.about'),      to: '/about' },
        { icon: Crown,  label: t('nav.leadership'), to: '/leadership' },
        { icon: Users,  label: t('nav.teachers'),   to: '/teachers' },
      ],
    },
    {
      key: 'activity',
      label: t('nav.activity'),
      items: [
        { icon: Trophy, label: t('nav.achievers'), to: '/achievers' },
        { icon: Layers, label: t('nav.clubs'),     to: '/clubs' },
      ],
    },
    {
      key: 'education',
      label: t('nav.education'),
      items: [
        { icon: BookOpen, label: t('nav.curriculum'), to: '/education' },
        { icon: Info,     label: t('nav.edu_info'),   to: '/education?tab=info' },
      ],
    },
  ];

  const singleLinks = [
    { icon: Newspaper, label: t('nav.news'),      to: '/news' },
    { icon: Images,    label: t('nav.gallery'),   to: '/gallery' },
    { icon: FileText,  label: t('nav.documents'), to: '/documents' },
  ];

  // Строчные пункты набраны капсом с разрядкой — как в макете «Афиша»
  const linkStyle = (isActive) => ({
    position: 'relative',
    fontFamily: 'var(--font-body)',
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
    color: isLight
      ? (isActive ? '#fff' : 'rgba(255,255,255,0.85)')
      : (isActive ? 'var(--color-bg-dark)' : 'var(--color-text-muted)'),
    textDecoration: 'none',
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    background: 'none', border: 'none', padding: 0,
    cursor: 'pointer',
    transition: 'color 200ms ease',
    whiteSpace: 'nowrap',
  });

  const divider = isLight ? 'rgba(255,255,255,0.22)' : 'var(--color-border)';

  return (
    <>
      <header
        className={`site-nav${isLight ? ' site-nav--light' : ''}`}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: scrolled ? 64 : 78,
          display: 'flex', alignItems: 'stretch',
          background: scrolled ? 'rgba(255,255,255,0.94)' : 'transparent',
          backdropFilter: scrolled ? 'saturate(180%) blur(18px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(18px)' : 'none',
          borderBottom: `1px solid ${divider}`,
          boxShadow: scrolled ? '0 4px 22px rgba(30,42,54,0.07)' : 'none',
          transition: 'height 300ms ease, background 300ms ease, border-color 300ms ease, box-shadow 300ms ease, backdrop-filter 300ms ease',
        }}
      >
        {/* Ячейка логотипа */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 clamp(1rem, 2vw, 28px)', borderRight: `1px solid ${divider}`, transition: 'border-color 300ms ease' }}>
          <Logo light={isLight} />
        </div>

        {/* Навигация */}
        <nav className="hidden lg:flex" style={{ alignItems: 'stretch', flex: 1, padding: '0 clamp(1rem, 2.4vw, 34px)', gap: 'clamp(1.1rem, 2.2vw, 2rem)' }}>
          {navGroups.map((group) => (
            <div
              key={group.key}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => setActiveDropdown(group.key)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="nav-link"
                style={linkStyle(activeDropdown === group.key)}
                aria-expanded={activeDropdown === group.key}
              >
                {group.label}
                <ChevronDown
                  size={13}
                  style={{
                    transition: 'transform 200ms',
                    transform: activeDropdown === group.key ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              <AnimatePresence>
                {activeDropdown === group.key && (
                  <Dropdown items={group.items} onClose={() => setActiveDropdown(null)} />
                )}
              </AnimatePresence>
            </div>
          ))}

          {singleLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="nav-link" style={({ isActive }) => ({ ...linkStyle(isActive), alignSelf: 'center' })}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Языки + кнопка «Контакты» вплотную к правому краю */}
        <div className="hidden lg:flex" style={{ alignItems: 'stretch', marginLeft: 'auto', borderLeft: `1px solid ${divider}`, transition: 'border-color 300ms ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 clamp(0.75rem, 1.5vw, 20px)' }}>
            <LangSwitcher light={isLight} bare />
          </div>

          <Link
            to="/contact"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              alignSelf: 'stretch', padding: '0 clamp(1.25rem, 2.2vw, 30px)',
              background: 'var(--color-accent-light)',
              color: 'var(--color-bg-dark)',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem',
              textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'background 220ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-accent-light)'; }}
          >
            <Phone size={16} /> {t('nav.contact')}
          </Link>
        </div>

        {/* Мобильный бургер — display задаётся классами, не инлайном */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden ml-auto flex items-center justify-center"
          aria-label={t('nav.open_menu')}
          style={{
            alignSelf: 'stretch',
            padding: '0 1.1rem',
            background: 'var(--color-accent-light)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-bg-dark)',
          }}
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Мобильное меню */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'var(--gradient-dark)',
              display: 'flex', flexDirection: 'column',
              padding: '1.5rem',
              overflowY: 'auto',
            }}
          >
            <div className="flex items-center justify-between mb-9">
              <Logo light onClick={() => setMobileOpen(false)} />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label={t('nav.close_menu')}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', color: 'white', padding: '9px', display: 'flex' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ flex: 1 }}>
              {navGroups.map((group, gi) => (
                <div key={group.key} style={{ marginBottom: '1.75rem' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent-light)', marginBottom: '0.85rem' }}>
                    {group.label}
                  </p>
                  {group.items.map((item, i) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 26 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: gi * 0.07 + i * 0.045 + 0.1 }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'white', textDecoration: 'none', padding: '0.32rem 0', lineHeight: 1.25 }}
                        className="link-underline"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ))}

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent-light)', marginBottom: '0.85rem' }}>
                  {t('footer.links_other')}
                </p>
                {[...singleLinks, { label: t('nav.contact'), to: '/contact' }].map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 + i * 0.045 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'white', textDecoration: 'none', padding: '0.32rem 0' }}
                      className="link-underline"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <p style={{ color: 'rgba(244,249,253,0.5)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {SCHOOL_INFO.phone}
              </p>
              <LangSwitcher light />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
