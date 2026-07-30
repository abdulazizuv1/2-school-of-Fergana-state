import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as LucideIcons from 'lucide-react';
import {
  ArrowLeft, Users, Clock, User, MapPin, Target, Trophy, Sparkles, Phone,
} from 'lucide-react';
import PageSkeleton from '@/components/ui/PageSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import MagneticButton from '@/components/ui/MagneticButton';
import FadeInView from '@/components/ui/FadeInView';
import ClubCard from '@/components/ui/ClubCard';
import LazyImage from '@/components/ui/LazyImage';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { lf } from '@/utils/localeField';
import { findClubBySlug, isMainClub, clubSlug } from '@/utils/clubs';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

function InfoTile({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--card-radius)', padding: '1.15rem 1.25rem',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <span style={{
        width: 40, height: 40, borderRadius: '0.75rem', background: 'var(--color-primary-soft)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color="var(--color-primary)" />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{
          fontSize: '0.68rem', fontWeight: 600, letterSpacing: 'var(--tracking-caps)',
          textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 0.25rem',
        }}>
          {label}
        </p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', margin: 0, lineHeight: 1.4 }}>
          {value}
        </p>
      </div>
    </div>
  );
}

/** Многострочный текст из Firestore → абзацы */
function RichText({ text }) {
  if (!text) return null;
  return (
    <>
      {String(text).split(/\n{1,}/).filter(Boolean).map((p, i) => (
        <p key={i} style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, margin: '0 0 1rem' }}>
          {p}
        </p>
      ))}
    </>
  );
}

export default function ClubDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: clubs = [], isLoading } = useFirestoreCollection('clubs', { orderByField: 'order' });

  const club = findClubBySlug(clubs, slug);
  const others = clubs.filter((c) => c.id !== club?.id).slice(0, 3);

  if (isLoading) return <PageSkeleton />;

  if (!club) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Helmet><title>{t('pages.club_detail.not_found_title')} | {SCHOOL_INFO.nameShortRu}</title></Helmet>
        <section style={{ background: 'var(--color-bg)', padding: 'calc(var(--navbar-h) + var(--section-py)) var(--section-px) var(--section-py)' }}>
          <div className="container-site">
            <EmptyState
              icon={Sparkles}
              title={t('pages.club_detail.not_found_title')}
              body={t('pages.club_detail.not_found_body')}
              actionLabel={t('pages.club_detail.back_to_all')}
              actionTo="/clubs"
            />
          </div>
        </section>
      </motion.div>
    );
  }

  const Icon = club.icon_name ? (LucideIcons[club.icon_name] || LucideIcons.Sparkles) : LucideIcons.Sparkles;
  const main = isMainClub(club);
  const name = lf(club, 'name');
  const gallery = Array.isArray(club.gallery) ? club.gallery.filter(Boolean) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{name} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={lf(club, 'description')?.slice(0, 160)} />
      </Helmet>

      {/* Шапка */}
      <header
        className="with-grain"
        style={{
          position: 'relative',
          background: 'var(--gradient-dark)',
          padding: 'calc(var(--navbar-h) + clamp(3rem, 7vw, 5.5rem)) var(--section-px) clamp(2.5rem, 5vw, 4rem)',
          overflow: 'hidden',
        }}
      >
        {club.photo_url && (
          <>
            <img
              src={club.photo_url}
              alt=""
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,50,77,0.72), rgba(20,50,77,0.92))' }} />
          </>
        )}

        <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>
          <Link
            to="/clubs"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              color: 'rgba(244,249,253,0.7)', fontSize: '0.85rem', marginBottom: '1.75rem',
              textDecoration: 'none', transition: 'color 200ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(244,249,253,0.7)'; }}
          >
            <ArrowLeft size={15} /> {t('pages.club_detail.back_to_all')}
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '1.25rem',
              background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={34} color="#fff" strokeWidth={1.6} />
            </div>

            <div>
              <span style={{
                display: 'inline-block', marginBottom: '0.55rem',
                background: 'var(--gradient-accent)', color: '#14324D',
                borderRadius: 'var(--radius-pill)', padding: '4px 14px',
                fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase',
              }}>
                {main ? t('clubs_page.type_club') : t('clubs_page.type_circle')}
              </span>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 700,
                letterSpacing: 'var(--tracking-tight)', color: '#fff', margin: 0, lineHeight: 1.1,
              }}>
                {name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Основное содержимое */}
      <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          <div className="club-detail-grid">
            <div>
              <FadeInView>
                <p style={{
                  fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75,
                  margin: '0 0 2rem', fontWeight: 500,
                }}>
                  {lf(club, 'description')}
                </p>

                {lf(club, 'about') && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 0.9rem' }}>
                      {t('pages.club_detail.about')}
                    </h2>
                    <RichText text={lf(club, 'about')} />
                  </div>
                )}

                {lf(club, 'goals') && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 0.9rem' }}>
                      <Target size={20} /> {t('pages.club_detail.goals')}
                    </h2>
                    <RichText text={lf(club, 'goals')} />
                  </div>
                )}

                {lf(club, 'achievements') && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 0.9rem' }}>
                      <Trophy size={20} /> {t('pages.club_detail.achievements')}
                    </h2>
                    <RichText text={lf(club, 'achievements')} />
                  </div>
                )}

                {gallery.length > 0 && (
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 1.1rem' }}>
                      {t('pages.club_detail.gallery')}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
                      {gallery.map((url, i) => (
                        <div key={i} style={{ borderRadius: 'var(--card-radius)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                          <LazyImage src={url} alt={`${name} — ${i + 1}`} aspectRatio="4/3" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FadeInView>
            </div>

            {/* Боковая колонка */}
            <aside>
              <FadeInView direction="right">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'sticky', top: 'calc(var(--navbar-h) + 1.5rem)' }}>
                  <InfoTile icon={User}   label={t('pages.clubs.teacher')}  value={club.teacher_lead} />
                  <InfoTile icon={Users}  label={t('pages.clubs.members')}  value={club.members_count ?? club.members} />
                  <InfoTile icon={Clock}  label={t('pages.clubs.schedule')} value={lf(club, 'schedule')} />
                  <InfoTile icon={MapPin} label={t('pages.club_detail.room')} value={club.room} />

                  <div style={{ marginTop: '0.5rem' }}>
                    <MagneticButton to="/contact" variant="primary" icon={Phone} iconPosition="left">
                      {t('pages.clubs.join')}
                    </MagneticButton>
                  </div>
                </div>
              </FadeInView>
            </aside>
          </div>
        </div>
      </section>

      {/* Другие кружки */}
      {others.length > 0 && (
        <section style={{ background: 'var(--color-bg-soft)', padding: 'var(--section-py) var(--section-px)' }}>
          <div className="container-site">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 var(--section-gap)' }}>
              {t('pages.club_detail.other')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', justifyItems: 'center' }}>
              {others.map((c, i) => (
                <ClubCard key={clubSlug(c)} club={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
