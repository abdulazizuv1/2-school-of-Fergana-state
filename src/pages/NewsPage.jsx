import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Newspaper } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import NewsCard from '@/components/ui/NewsCard';
import EmptyState from '@/components/ui/EmptyState';
import PageSkeleton from '@/components/ui/PageSkeleton';
import MagneticButton from '@/components/ui/MagneticButton';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

const CATEGORIES = ['all', 'news', 'event', 'sport', 'science'];
const PAGE_SIZE = 9;

export default function NewsPage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const { data: news = [], isLoading } = useFirestoreCollection('news', {
    orderByField: 'date',
    direction: 'desc',
  });

  const filtered = useMemo(
    () => (category === 'all' ? news : news.filter((n) => n.category === category)),
    [news, category],
  );

  const shown = filtered.slice(0, visible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.news.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.news.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.news.title')}
        subtitle={t('pages.news.banner_subtitle')}
        breadcrumb={t('pages.news.title')}
        image="/images/school-09.jpg"
      />

      {isLoading ? (
        <PageSkeleton />
      ) : news.length === 0 ? (
        <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
          <div className="container-site">
            <EmptyState
              icon={Newspaper}
              title={t('pages.news.empty_title')}
              body={t('pages.news.empty_body')}
            />
          </div>
        </section>
      ) : (
        <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
          <div className="container-site">
            {/* Категории */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: 'var(--section-gap)' }}>
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setVisible(PAGE_SIZE); }}
                    style={{
                      padding: '8px 20px', borderRadius: 'var(--radius-pill)',
                      border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: active ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: active ? '#fff' : 'var(--color-text-muted)',
                      cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                      fontWeight: 500, transition: 'all 200ms', flexShrink: 0,
                    }}
                  >
                    {cat === 'all' ? t('pages.news.all_categories') : cat}
                  </button>
                );
              })}
            </div>

            {/* Сетка новостей */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                alignItems: 'start',
              }}
            >
              {shown.map((article) => (
                <NewsCard key={article.id} article={article} variant="featured" />
              ))}
            </div>

            {shown.length < filtered.length && (
              <div style={{ textAlign: 'center', marginTop: 'var(--section-gap)' }}>
                <MagneticButton variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  {t('pages.news.load_more')}
                </MagneticButton>
              </div>
            )}
          </div>
        </section>
      )}
    </motion.div>
  );
}
