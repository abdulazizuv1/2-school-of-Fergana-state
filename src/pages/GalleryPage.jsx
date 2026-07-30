import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Images } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import PageBanner from '@/components/ui/PageBanner';
import LazyImage from '@/components/ui/LazyImage';
import EmptyState from '@/components/ui/EmptyState';
import PageSkeleton from '@/components/ui/PageSkeleton';
import { SCHOOL_INFO } from '@/constants/schoolInfo';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

const CATEGORIES = ['all', 'events', 'classes', 'sport', 'clubs'];

export default function GalleryPage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const { data: photos = [], isLoading } = useFirestoreCollection('gallery', {
    orderByField: 'uploadedAt',
    direction: 'desc',
  });

  const filtered = useMemo(
    () => (category === 'all' ? photos : photos.filter((p) => p.category === category)),
    [photos, category],
  );

  const catLabels = {
    all:     t('pages.gallery.filter_all'),
    events:  t('pages.gallery.filter_events'),
    classes: t('pages.gallery.filter_classes'),
    sport:   t('pages.gallery.filter_sport'),
    clubs:   t('pages.gallery.filter_clubs'),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.gallery.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.gallery.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.gallery.title')}
        subtitle={t('pages.gallery.banner_subtitle')}
        breadcrumb={t('pages.gallery.title')}
        image="/images/school-01.jpg"
      />

      {isLoading ? (
        <PageSkeleton />
      ) : photos.length === 0 ? (
        <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
          <div className="container-site">
            <EmptyState
              icon={Images}
              title={t('pages.gallery.empty_title')}
              body={t('pages.gallery.empty_body')}
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
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '8px 20px', borderRadius: 'var(--radius-pill)',
                      border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: active ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: active ? '#fff' : 'var(--color-text-muted)',
                      cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                      fontWeight: 500, transition: 'all 200ms', flexShrink: 0,
                    }}
                  >
                    {catLabels[cat]}
                  </button>
                );
              })}
            </div>

            {/* Кладка */}
            <motion.div layout className="gallery-masonry" style={{ columns: 4, columnGap: '1rem' }}>
              <AnimatePresence>
                {filtered.map((photo, i) => (
                  <motion.button
                    key={photo.id}
                    layout
                    type="button"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    onClick={() => setLightboxIndex(i)}
                    aria-label={photo.category || t('pages.gallery.title')}
                    whileHover={{ scale: 1.015 }}
                    style={{
                      display: 'block', width: '100%', padding: 0, border: 'none', background: 'none',
                      breakInside: 'avoid', marginBottom: '1rem', cursor: 'pointer',
                      borderRadius: 'var(--card-radius)', overflow: 'hidden',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <LazyImage src={photo.url} alt={photo.category || ''} aspectRatio="1/1" />
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      )}

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={filtered.map((p) => ({ src: p.url }))}
      />
    </motion.div>
  );
}
