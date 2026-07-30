import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Download, CalendarDays, ClipboardList, Users, Award, Languages, Clock,
} from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import FadeInView from '@/components/ui/FadeInView';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { lf } from '@/utils/localeField';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

const GRADES = Array.from({ length: 11 }, (_, i) => i + 1);
const TABS = ['plan', 'info'];

/** Учебный год «2025–2026» — считается от текущей даты (сентябрь — рубеж). */
function academicYear() {
  const now = new Date();
  const start = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  return `${start}–${start + 1}`;
}

export default function CurriculumPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [grade, setGrade] = useState(1);

  // Вкладка живёт в адресе (?tab=info) — ссылка из меню открывает нужный раздел
  const activeTab = searchParams.get('tab') === 'info' ? 'info' : 'plan';
  const setActiveTab = (tab) => {
    setSearchParams(tab === 'info' ? { tab: 'info' } : {}, { replace: true });
  };

  const { data: curriculum = [] } = useFirestoreCollection('curriculum', { where: ['grade', '==', grade] });
  const gradeData = curriculum[0];

  const infoCards = [
    { icon: CalendarDays,  title: t('pages.education.info.year'),           value: academicYear() },
    { icon: ClipboardList, title: t('pages.education.info.grading'),        value: t('pages.education.info.grading_value') },
    { icon: Users,         title: t('pages.education.info.grades'),         value: t('pages.education.info.grades_value') },
    { icon: Languages,     title: t('pages.education.info.language'),       value: SCHOOL_INFO.languageRu },
    { icon: Clock,         title: t('pages.education.info.shifts'),         value: t('pages.education.info.shifts_value') },
    { icon: Award,         title: t('pages.education.info.accreditation'),  value: t('pages.education.info.accreditation_value') },
  ];

  const subjects = (lf(gradeData || {}, 'subjects') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.education.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.education.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.education.title')}
        subtitle={t('pages.education.banner_subtitle')}
        breadcrumb={t('pages.education.title')}
        image="/images/school-01.jpg"
      />

      <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          {/* Вкладки */}
          <div style={{
            display: 'inline-flex', background: 'var(--color-surface)', borderRadius: 'var(--radius-pill)',
            padding: 4, border: '1px solid var(--color-border)', marginBottom: 'var(--section-gap)',
            boxShadow: 'var(--shadow-card)',
          }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  position: 'relative', padding: '9px 26px', border: 'none', background: 'transparent',
                  borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 500,
                  color: activeTab === tab ? '#fff' : 'var(--color-text-muted)',
                  transition: 'color 200ms', zIndex: 1,
                }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="edu-tab-pill"
                    style={{ position: 'absolute', inset: 0, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-pill)', zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                {tab === 'plan' ? t('pages.education.tab_plan') : t('pages.education.tab_info')}
              </button>
            ))}
          </div>

          {/* Учебный план */}
          {activeTab === 'plan' && (
            <FadeInView>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Классы */}
                <div style={{ flexShrink: 0 }}>
                  <p style={{
                    fontSize: '0.72rem', fontWeight: 600, letterSpacing: 'var(--tracking-caps)',
                    textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem',
                  }}>
                    {t('pages.education.grade_label')}
                  </p>
                  <div className="grade-picker">
                    {GRADES.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        aria-pressed={grade === g}
                        style={{
                          width: 48, height: 46,
                          border: `1px solid ${grade === g ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          background: grade === g ? 'var(--gradient-primary)' : 'var(--color-surface)',
                          color: grade === g ? '#fff' : 'var(--color-text)',
                          borderRadius: '0.8rem', cursor: 'pointer',
                          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
                          transition: 'all 200ms',
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Предметы */}
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                      {grade}-й класс — {t('pages.education.subjects')}
                    </h2>
                    {gradeData?.schedule_pdf_url && (
                      <a
                        href={gradeData.schedule_pdf_url}
                        download
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                          padding: '9px 18px', borderRadius: 'var(--radius-pill)',
                          border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                          color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'none',
                          transition: 'background 200ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-soft)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-surface)'; }}
                      >
                        <Download size={15} /> {t('pages.education.download_pdf')}
                      </a>
                    )}
                  </div>

                  {subjects.length > 0 ? (
                    <div style={{
                      borderRadius: 'var(--card-radius)', overflow: 'hidden',
                      border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)',
                    }}>
                      {subjects.map((subject, i) => (
                        <div
                          key={`${subject}-${i}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.85rem',
                            padding: '0.85rem 1.35rem',
                            background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-raised)',
                            fontSize: '0.92rem', color: 'var(--color-text)',
                          }}
                        >
                          <span style={{
                            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                            background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 700,
                          }}>
                            {i + 1}
                          </span>
                          {subject}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '3rem 1.5rem', textAlign: 'center', background: 'var(--color-surface)',
                      borderRadius: 'var(--card-radius)', border: '1px dashed var(--color-border-strong)',
                      color: 'var(--color-text-muted)',
                    }}>
                      {t('pages.education.empty_grade', { grade })}
                    </div>
                  )}
                </div>
              </div>
            </FadeInView>
          )}

          {/* Сведения об обучении */}
          {activeTab === 'info' && (
            <FadeInView>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {infoCards.map(({ icon: Icon, title, value }) => (
                  <div
                    key={title}
                    style={{
                      background: 'var(--color-surface)', borderRadius: 'var(--card-radius)',
                      padding: '1.6rem', boxShadow: 'var(--shadow-card)',
                      border: '1px solid var(--color-border)',
                      display: 'flex', gap: '1rem', alignItems: 'flex-start', height: '100%',
                    }}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: '0.8rem', background: 'var(--color-primary-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={21} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
                        letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase',
                        color: 'var(--color-text-muted)', marginBottom: '0.35rem',
                      }}>
                        {title}
                      </p>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.45 }}>
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInView>
          )}
        </div>
      </section>
    </motion.div>
  );
}
