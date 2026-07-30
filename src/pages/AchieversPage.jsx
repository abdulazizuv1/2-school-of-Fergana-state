import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Trophy } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import PersonCard from '@/components/ui/PersonCard';
import EmptyState from '@/components/ui/EmptyState';
import PageSkeleton from '@/components/ui/PageSkeleton';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

export default function AchieversPage() {
  const { t } = useTranslation();
  const { data: displayAchievers = [], isLoading } = useFirestoreCollection('achievers', { orderByField: 'year', direction: 'desc' });
  const [year, setYear] = useState('all');
  const [category, setCategory] = useState('all');

  const years = useMemo(() => ['all', ...new Set(displayAchievers.map((a) => a.year))].sort((a, b) => a === 'all' ? -1 : b - a), [displayAchievers]);
  const categories = useMemo(() => ['all', ...new Set(displayAchievers.map((a) => a.category).filter(Boolean))], [displayAchievers]);

  const filtered = useMemo(() =>
    displayAchievers.filter((a) =>
      (year === 'all' || a.year === year) &&
      (category === 'all' || a.category === category)
    ), [displayAchievers, year, category]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.achievers.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.achievers.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.achievers.title')}
        subtitle={t('pages.achievers.banner_subtitle')}
        breadcrumb={t('pages.achievers.title')}
        image="/images/school-10.jpg"
      />

      {isLoading ? (
        <PageSkeleton />
      ) : displayAchievers.length === 0 ? (
        <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
          <div className="container-site">
            <EmptyState
              icon={Trophy}
              title={t('pages.achievers.empty_title')}
              body={t('pages.achievers.empty_body')}
            />
          </div>
        </section>
      ) : (
      <section className="with-grain" style={{ background: 'var(--gradient-dark)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          <SectionHeading label={t('achievers_section.badge')} title={t('pages.achievers.title')} align="center" light />

          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2.5rem', marginBottom: '3rem' }}>
            {/* Year dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={{ appearance: 'none', padding: '8px 36px 8px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}
              >
                {years.map((y) => <option key={y} value={y} style={{ background: 'var(--color-bg-dark)' }}>{y === 'all' ? t('pages.achievers.filter_all') : y}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', pointerEvents: 'none' }} />
            </div>

            {/* Category chips */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.2)',
                  background: category === cat ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
                  color: category === cat ? '#0A0E1A' : 'rgba(240,244,255,0.7)',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500,
                  transition: 'all 200ms',
                }}
              >
                {cat === 'all' ? t('pages.achievers.filter_all') : cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gap: '1.5rem' }}
          >
            <AnimatePresence>
              {filtered.map((person) => (
                <motion.div
                  key={person.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{ position: 'relative', height: '100%' }}
                >
                  <PersonCard person={person} variant="achiever" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      )}
    </motion.div>
  );
}
