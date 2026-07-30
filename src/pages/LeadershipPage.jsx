import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Crown } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import PersonCard, { DirectorCard } from '@/components/ui/PersonCard';
import EmptyState from '@/components/ui/EmptyState';
import PageSkeleton from '@/components/ui/PageSkeleton';
import FadeInView from '@/components/ui/FadeInView';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

export default function LeadershipPage() {
  const { t } = useTranslation();
  const { data: leadership = [], isLoading } = useFirestoreCollection('leadership', { orderByField: 'order' });

  // Данные приходят только из админки: первая запись (наименьший order) — директор,
  // остальные — заместители. Пока никого не добавили — показываем пустое состояние.
  const director = leadership[0];
  const deputies = leadership.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.leadership.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.leadership.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.leadership.title')}
        subtitle={t('pages.leadership.banner_subtitle')}
        breadcrumb={t('pages.leadership.title')}
        image="/images/school-12.jpg"
      />

      {isLoading ? (
        <PageSkeleton />
      ) : leadership.length === 0 ? (
        <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
          <div className="container-site">
            <EmptyState
              icon={Crown}
              title={t('pages.leadership.empty_title')}
              body={t('pages.leadership.empty_body')}
            />
          </div>
        </section>
      ) : (
        <>
          {/* Директор */}
          <section style={{ background: 'var(--color-surface)', padding: 'var(--section-py) var(--section-px)' }}>
            <div className="container-site">
              <FadeInView>
                <DirectorCard
                  person={director}
                  titleLabel={t('pages.leadership.director_title')}
                  fallbackMessage={t('pages.leadership.default_message')}
                />
              </FadeInView>
            </div>
          </section>

          {/* Заместители */}
          {deputies.length > 0 && (
            <section style={{ background: 'var(--color-bg-soft)', padding: 'var(--section-py) var(--section-px)' }}>
              <div className="container-site">
                <SectionHeading
                  label={t('pages.leadership.banner_subtitle')}
                  title={t('pages.leadership.team_title')}
                  subtitle={t('pages.leadership.team_subtitle')}
                  align="left"
                />

                <StaggerContainer
                  className="people-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                    gap: '1.5rem',
                    marginTop: 'var(--section-gap)',
                  }}
                >
                  {deputies.map((person) => (
                    <StaggerItem key={person.id} style={{ height: '100%' }}>
                      <PersonCard person={person} variant="leadership" />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </section>
          )}
        </>
      )}
    </motion.div>
  );
}
