import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Search, Users } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import PersonCard from '@/components/ui/PersonCard';
import EmptyState from '@/components/ui/EmptyState';
import PageSkeleton from '@/components/ui/PageSkeleton';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { lf } from '@/utils/localeField';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

const TABS = ['all', 'teacher', 'staff'];

export default function TeachersPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data: displayTeachers = [], isLoading } = useFirestoreCollection('teachers', { orderByField: 'order' });

  const filtered = useMemo(() => displayTeachers.filter((p) => {
    if (filter !== 'all' && p.category !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      lf(p, 'name').toLowerCase().includes(q) ||
      lf(p, 'subject').toLowerCase().includes(q)
    );
  }), [displayTeachers, filter, search]);

  const tabLabels = {
    all: t('pages.teachers.filter_all'),
    teacher: t('pages.teachers.filter_teachers'),
    staff: t('pages.teachers.filter_staff'),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.teachers.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.teachers.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.teachers.title')}
        subtitle={t('pages.teachers.banner_subtitle')}
        breadcrumb={t('pages.teachers.title')}
        image="/images/school-07.jpg"
      />

      {isLoading ? (
        <PageSkeleton />
      ) : displayTeachers.length === 0 ? (
        <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
          <div className="container-site">
            <EmptyState
              icon={Users}
              title={t('pages.teachers.empty_title')}
              body={t('pages.teachers.empty_body')}
            />
          </div>
        </section>
      ) : (
      <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          {/* Filter + Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {/* Filter tabs */}
            <div style={{ display: 'flex', background: 'var(--color-surface)', borderRadius: 'var(--radius-pill)', padding: 3, border: '1px solid var(--color-border)', position: 'relative' }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    position: 'relative', padding: '6px 20px', border: 'none', background: 'transparent',
                    borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500,
                    color: filter === tab ? '#fff' : 'var(--color-text-muted)', zIndex: 1,
                    transition: 'color 200ms',
                  }}
                >
                  {filter === tab && (
                    <motion.div
                      layoutId="teacher-filter-pill"
                      style={{ position: 'absolute', inset: 0, background: 'var(--color-primary)', borderRadius: 'var(--radius-pill)', zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('pages.teachers.search_placeholder')}
                style={{
                  width: '100%', height: 42, paddingLeft: 40, paddingRight: 16,
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem', background: 'var(--color-surface)',
                  color: 'var(--color-text)', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="popLayout">
            <motion.div
              className="teachers-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gap: '1.5rem' }}
              layout
            >
              {filtered.map((person) => (
                <motion.div
                  key={person.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ height: '100%' }}
                >
                  <PersonCard person={person} variant="teacher" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
              {t('pages.teachers.nothing_found')}
            </div>
          )}
        </div>
      </section>
      )}
    </motion.div>
  );
}
