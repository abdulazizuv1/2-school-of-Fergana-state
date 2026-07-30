import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, Share2, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PageBanner from '@/components/ui/PageBanner';
import LazyImage from '@/components/ui/LazyImage';
import NewsCard from '@/components/ui/NewsCard';
import FadeInView from '@/components/ui/FadeInView';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { lf } from '@/utils/localeField';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

export default function NewsDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: articles = [] } = useFirestoreCollection('news', { where: ['slug', '==', slug], limit: 1 });
  const { data: related = [] } = useFirestoreCollection('news', { orderByField: 'date', direction: 'desc', limit: 4 });

  const article = articles[0];
  const relatedNews = related.filter((a) => a.slug !== slug).slice(0, 3);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{article ? lf(article, 'title') : t('pages.news.title')} | {SCHOOL_INFO.nameShortRu}</title>
      </Helmet>

      {/* Обложка */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: 'var(--navbar-h)', background: 'var(--color-bg-dark)' }}>
        <LazyImage src={article?.photo_url || ''} alt={article ? lf(article, 'title') : ''} aspectRatio="21/9" priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,50,77,0.55), transparent 55%)' }} />
      </div>

      {/* Article content */}
      <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <FadeInView>
            <Link to="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> {t('pages.news.title')}
            </Link>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {article?.category && (
                <span style={{ padding: '3px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {article.category}
                </span>
              )}
              {article?.date && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  <Calendar size={14} />
                  {new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                    .format(article.date?.toDate?.() || new Date(article.date))}
                </span>
              )}
              {article?.views && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}><Eye size={14} />{article.views} {t('pages.news.views')}</span>}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 800, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text)', lineHeight: 1.15, marginBottom: '2rem' }}>
              {article ? lf(article, 'title') : '...'}
            </h1>

            {/* Article body */}
            <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
              <ReactMarkdown>
                {article ? lf(article, 'content') : 'Загрузка...'}
              </ReactMarkdown>
            </div>

            {/* Share */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Share2 size={16} /> {t('pages.news_detail.share')}:</span>
              <button
                onClick={copyLink}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.8rem', transition: 'background 200ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-raised)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <LinkIcon size={14} /> {t('pages.news_detail.copy_link')}
              </button>
            </div>
          </FadeInView>
        </div>

        {/* Related news */}
        {relatedNews.length > 0 && (
          <div style={{ maxWidth: 'var(--max-width)', margin: '4rem auto 0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
              {t('pages.news_detail.related')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {relatedNews.map((a) => <NewsCard key={a.id} article={a} variant="compact" />)}
            </div>
          </div>
        )}
      </section>
    </motion.div>
  );
}
