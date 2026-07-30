import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import ClubCard from '@/components/ui/ClubCard';
import EmptyState from '@/components/ui/EmptyState';
import PageSkeleton from '@/components/ui/PageSkeleton';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { isMainClub } from '@/utils/clubs';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

export default function ClubsPage() {
  const { t } = useTranslation();
  const { data: clubs = [], isLoading } = useFirestoreCollection('clubs', { orderByField: 'order' });

  const { mainClubs, circles } = useMemo(() => ({
    mainClubs: clubs.filter(isMainClub),
    circles:   clubs.filter((c) => !isMainClub(c)),
  }), [clubs]);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: 'var(--section-gap)',
    justifyItems: 'center',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.clubs.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.clubs.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.clubs.title')}
        subtitle={t('pages.clubs.banner_subtitle')}
        breadcrumb={t('pages.clubs.title')}
        image="/images/school-02.jpg"
      />

      {isLoading ? (
        <PageSkeleton />
      ) : clubs.length === 0 ? (
        <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
          <div className="container-site">
            <EmptyState
              icon={Sparkles}
              title={t('pages.clubs.empty_title')}
              body={t('pages.clubs.empty_body')}
            />
          </div>
        </section>
      ) : (
        <>
          {/* Клуб */}
          {mainClubs.length > 0 && (
            <section style={{ background: 'var(--color-surface)', padding: 'var(--section-py) var(--section-px)' }}>
              <div className="container-site">
                <SectionHeading
                  label={t('clubs_page.type_club')}
                  title={t('clubs_page.clubs_title')}
                  subtitle={t('clubs_page.clubs_subtitle')}
                  align="left"
                />
                <StaggerContainer style={gridStyle}>
                  {mainClubs.map((club, i) => (
                    <StaggerItem key={club.id}>
                      <ClubCard club={club} index={i} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </section>
          )}

          {/* Кружки */}
          {circles.length > 0 && (
            <section style={{ background: 'var(--color-bg-soft)', padding: 'var(--section-py) var(--section-px)' }}>
              <div className="container-site">
                <SectionHeading
                  label={t('clubs_page.type_circle')}
                  title={t('clubs_page.circles_title')}
                  subtitle={t('clubs_page.circles_subtitle')}
                  align="left"
                />
                <StaggerContainer style={gridStyle}>
                  {circles.map((club, i) => (
                    <StaggerItem key={club.id}>
                      <ClubCard club={club} index={i + 1} />
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
