import { Link } from 'react-router-dom';
import { Facebook, MapPin, Phone, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../ui/LangSwitcher';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
        color: 'rgba(244,249,253,0.6)', fontSize: '0.875rem',
        textDecoration: 'none', padding: '0.22rem 0',
        transition: 'color 200ms, transform 200ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(3px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(244,249,253,0.6)'; e.currentTarget.style.transform = 'translateX(0)'; }}
    >
      <ChevronRight size={12} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
      {children}
    </Link>
  );
}

function SocialButton({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: 42, height: 42, borderRadius: '50%',
        border: '1px solid rgba(244,249,253,0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(244,249,253,0.6)',
        transition: 'color 200ms, border-color 200ms, background 200ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.borderColor = 'var(--color-accent-light)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(244,249,253,0.6)';
        e.currentTarget.style.borderColor = 'rgba(244,249,253,0.22)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <Icon size={18} />
    </a>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="with-grain" style={{ background: 'var(--gradient-dark)', color: 'var(--color-text-inv)' }}>
      {/* Цветная полоска сверху */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--color-primary-light), var(--color-accent), var(--color-warm))' }} />

      <div className="container-site" style={{ paddingTop: '3.5rem', paddingBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '2.5rem' }}>
          {/* Бренд */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.1rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '13px', background: 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.18)',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-accent-light)' }}>2</span>
              </div>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>ШКОЛА № 2</div>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'rgba(244,249,253,0.45)', textTransform: 'uppercase' }}>ФЕРГАНА</div>
              </div>
            </div>

            <p style={{ color: 'rgba(244,249,253,0.55)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem', maxWidth: '30ch' }}>
              {SCHOOL_INFO.nameRu}. {t('footer.tagline')}
            </p>

            <div style={{ display: 'flex', gap: '0.55rem' }}>
              <SocialButton href={SCHOOL_INFO.facebook} icon={Facebook} label="Facebook" />
            </div>
          </div>

          {/* Школа */}
          <div>
            <p className="footer-heading">{t('footer.links_school')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <FooterLink to="/about">{t('nav.about')}</FooterLink>
              <FooterLink to="/leadership">{t('nav.leadership')}</FooterLink>
              <FooterLink to="/teachers">{t('nav.teachers')}</FooterLink>
              <FooterLink to="/documents">{t('nav.documents')}</FooterLink>
            </div>
          </div>

          {/* Деятельность */}
          <div>
            <p className="footer-heading">{t('footer.links_activity')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <FooterLink to="/achievers">{t('nav.achievers')}</FooterLink>
              <FooterLink to="/clubs">{t('nav.clubs')}</FooterLink>
              <FooterLink to="/education">{t('nav.education')}</FooterLink>
              <FooterLink to="/news">{t('nav.news')}</FooterLink>
              <FooterLink to="/gallery">{t('nav.gallery')}</FooterLink>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <p className="footer-heading">{t('footer.contacts')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'rgba(244,249,253,0.6)', fontSize: '0.85rem', lineHeight: 1.55 }}>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: 3, color: 'var(--color-accent-light)' }} />
                <span>{SCHOOL_INFO.addressRu}</span>
              </div>
              <a
                href={`tel:${SCHOOL_INFO.phone.replace(/[^+\d]/g, '')}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(244,249,253,0.6)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 200ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(244,249,253,0.6)'; }}
              >
                <Phone size={14} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                {SCHOOL_INFO.phone}
              </a>
              <a
                href={`tel:${SCHOOL_INFO.phoneMobile.replace(/[^+\d]/g, '')}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(244,249,253,0.6)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 200ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(244,249,253,0.6)'; }}
              >
                <Phone size={14} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                {SCHOOL_INFO.phoneMobile}
              </a>
              <FooterLink to="/contact">{t('nav.contact')}</FooterLink>
            </div>
          </div>
        </div>

        {/* Нижняя строка */}
        <div style={{
          borderTop: '1px solid rgba(244,249,253,0.1)',
          marginTop: '2.75rem', paddingTop: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ color: 'rgba(244,249,253,0.35)', fontSize: '0.8rem', margin: 0 }}>
            © {year} {SCHOOL_INFO.nameShortRu}, {t('about_section.city')}. {t('footer.rights')}
          </p>
          <LangSwitcher light />
        </div>
      </div>

      <style>{`
        .footer-heading {
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(244,249,253,0.35);
          margin-bottom: 1rem;
        }
      `}</style>
    </footer>
  );
}
