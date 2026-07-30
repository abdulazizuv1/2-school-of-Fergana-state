import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Compass } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.not_found.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section
        style={{
          background: 'var(--color-bg)',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          padding: 'calc(var(--navbar-h) + var(--section-py)) var(--section-px) var(--section-py)',
        }}
      >
        <div className="container-site">
          <p
            aria-hidden="true"
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 16vw, 11rem)',
              fontWeight: 800,
              lineHeight: 1,
              margin: '0 0 1rem',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.55,
            }}
          >
            404
          </p>

          <EmptyState
            icon={Compass}
            title={t('pages.not_found.heading')}
            body={t('pages.not_found.body')}
            actionLabel={t('breadcrumb.home')}
            actionTo="/"
          />
        </div>
      </section>
    </motion.div>
  );
}
