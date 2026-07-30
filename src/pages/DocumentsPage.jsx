import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Download, FileText, ShieldCheck, Info } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticButton from '@/components/ui/MagneticButton';
import FadeInView from '@/components/ui/FadeInView';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { lf } from '@/utils/localeField';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

/** Карточка документа с кнопкой скачивания. */
function DocumentCard({ title, description, meta, href, fileName }) {
  const { t } = useTranslation();

  return (
    <article
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--card-radius)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-card)',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: -46, right: -46, width: 150, height: 150,
          borderRadius: '50%', background: 'var(--color-primary)', opacity: 0.06,
        }}
      />

      <div style={{
        width: 52, height: 52, borderRadius: '1rem', background: 'var(--color-primary-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
        position: 'relative',
      }}>
        <FileText size={24} color="var(--color-primary)" strokeWidth={1.7} />
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700,
        color: 'var(--color-text)', margin: '0 0 0.6rem', lineHeight: 1.3, position: 'relative',
      }}>
        {title}
      </h3>

      <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 1.25rem', flex: 1, position: 'relative' }}>
        {description}
      </p>

      {meta && (
        <p style={{
          fontSize: '0.75rem', letterSpacing: '0.04em', color: 'var(--color-text-muted)',
          margin: '0 0 1.25rem', position: 'relative', opacity: 0.85,
        }}>
          {meta}
        </p>
      )}

      <div style={{ position: 'relative' }}>
        <a
          href={href}
          download={fileName}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
            minHeight: 48, padding: '0 1.5rem',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--gradient-primary)', color: '#fff',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.92rem',
            textDecoration: 'none',
            transition: 'box-shadow 220ms ease, transform 220ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(44,107,168,0.32)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Download size={17} /> {t('pages.documents.download')}
        </a>
      </div>
    </article>
  );
}

export default function DocumentsPage() {
  const { t } = useTranslation();
  const { data: docs = [] } = useFirestoreCollection('documents', { orderByField: 'order' });

  // Пока в админку не добавили ни одного документа — показываем встроенный паспорт.
  const passportFallback = {
    key: 'passport',
    title: t('pages.documents.items.passport.title'),
    description: t('pages.documents.items.passport.body'),
    meta: t('pages.documents.items.passport.meta'),
    href: SCHOOL_INFO.passportFile,
    fileName: 'Паспорт школы №2 Фергана 2025.docx',
  };

  const documents = docs.length > 0
    ? docs.map((d) => ({
        key: d.id,
        title: lf(d, 'title'),
        description: lf(d, 'desc'),
        meta: lf(d, 'meta'),
        href: d.file_url,
        fileName: lf(d, 'title'),
      }))
    : [passportFallback];

  const notes = [
    { icon: ShieldCheck, key: 'official' },
    { icon: Info,        key: 'request' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.documents.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.documents.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.documents.title')}
        subtitle={t('pages.documents.banner_subtitle')}
        breadcrumb={t('pages.documents.title')}
        image="/images/school-11.jpg"
      />

      <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          <SectionHeading
            label={t('pages.documents.badge')}
            title={t('pages.documents.section_title')}
            subtitle={t('pages.documents.section_subtitle')}
            align="left"
          />

          {/* auto-fit + ограничение ширины: одна карточка растягивается на всю
              колонку, а когда документов станет больше — встанут в два столбца */}
          <StaggerContainer
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: 'var(--section-gap)',
              maxWidth: 960,
            }}
          >
            {documents.map(({ key, ...doc }) => (
              <StaggerItem key={key} style={{ height: '100%' }}>
                <DocumentCard {...doc} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Пояснения */}
      <section style={{ background: 'var(--color-bg-soft)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {notes.map(({ icon: Icon, key }) => (
              <FadeInView key={key}>
                <div style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--card-radius)', padding: '1.5rem', height: '100%',
                }}>
                  <span style={{
                    width: 42, height: 42, borderRadius: '0.8rem', background: 'var(--color-accent-soft)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={19} color="var(--color-accent)" />
                  </span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.4rem' }}>
                      {t(`pages.documents.notes.${key}.title`)}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                      {t(`pages.documents.notes.${key}.body`)}
                    </p>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--section-gap)' }}>
            <MagneticButton to="/contact" variant="outline">
              {t('pages.documents.contact_cta')}
            </MagneticButton>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
