import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Facebook, ExternalLink } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticButton from '@/components/ui/MagneticButton';
import FadeInView from '@/components/ui/FadeInView';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

export default function ContactPage() {
  const { t } = useTranslation();

  const contacts = [
    { icon: MapPin,    label: t('about_page.facts.address'), text: SCHOOL_INFO.addressRu },
    { icon: Phone,     label: t('form.phone'),  text: SCHOOL_INFO.phone,       href: `tel:${SCHOOL_INFO.phone.replace(/[^+\d]/g, '')}` },
    { icon: Phone,     label: t('form.phone'),  text: SCHOOL_INFO.phoneMobile, href: `tel:${SCHOOL_INFO.phoneMobile.replace(/[^+\d]/g, '')}` },
    { icon: Mail,      label: 'Email',          text: SCHOOL_INFO.email,       href: `mailto:${SCHOOL_INFO.email}` },
    { icon: Facebook,  label: 'Facebook',       text: 'school2fergana',        href: SCHOOL_INFO.facebook,  external: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.contact.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.contact.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.contact.title')}
        subtitle={t('pages.contact.banner_subtitle')}
        breadcrumb={t('pages.contact.title')}
        image="/images/school-05.jpg"
      />

      <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <FadeInView>
            <SectionHeading
              label={t('contact_section.badge')}
              title={t('contact_section.title')}
              align="left"
            />
          </FadeInView>

          {/* Контакты */}
          <FadeInView delay={0.1}>
            <div style={{
              marginTop: '1.75rem',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--card-radius)', padding: 'clamp(1.5rem, 3vw, 2rem)',
              boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}>
                {contacts.map(({ icon: Icon, label, text, href, external }) => (
                  <div key={`${label}-${text}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <span style={{
                      width: 42, height: 42, borderRadius: '0.8rem', background: 'var(--color-primary-soft)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={18} color="var(--color-primary)" />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: '0.7rem', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase',
                        color: 'var(--color-text-muted)', margin: '0 0 0.2rem',
                      }}>
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 200ms' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text)'; }}
                        >
                          {text}
                          {external && <ExternalLink size={12} style={{ opacity: 0.5 }} />}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.5 }}>{text}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>

          {/* Карта */}
          <FadeInView delay={0.15}>
            <div style={{
              borderRadius: 'var(--card-radius)', overflow: 'hidden', height: 420,
              border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)',
            }}>
              <iframe
                src={SCHOOL_INFO.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title={t('contact_section.map_title')}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <MagneticButton href={SCHOOL_INFO.mapLink} variant="outline" icon={ExternalLink}>
                {t('contact_section.map_title')}
              </MagneticButton>
            </div>
          </FadeInView>
        </div>
      </section>
    </motion.div>
  );
}
