import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Heart } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import FadeInView from '@/components/ui/FadeInView';
import LazyImage from '@/components/ui/LazyImage';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { lf } from '@/utils/localeField';
import { SCHOOL_INFO } from '@/constants/schoolInfo';
import { getAboutDefaults } from '@/constants/aboutContent';

gsap.registerPlugin(ScrollTrigger);

const GALLERY = [
  { src: '/images/school-07.jpg', ratio: '4/3' },
  { src: '/images/school-08.jpg', ratio: '1/1'  },
  { src: '/images/school-06.jpg', ratio: '1/1'  },
  { src: '/images/school-10.jpg', ratio: '4/3'  },
  { src: '/images/school-01.jpg', ratio: '1/1'  },
  { src: '/images/school-12.jpg', ratio: '1/1'  },
];

export default function AboutPage() {
  const { t } = useTranslation();
  const timelineRef = useRef(null);

  // Редактируемый контент из админки (siteContent/about). Пока его нет —
  // берём значения по умолчанию из общего модуля.
  const { data: aboutDoc } = useFirestoreDoc('siteContent', 'about');
  const defaults = getAboutDefaults();

  const historySource = Array.isArray(aboutDoc?.history) && aboutDoc.history.length > 0
    ? aboutDoc.history
    : defaults.history;
  const timelineItems = historySource.map((h) => ({
    year: h.year,
    title: lf(h, 'title'),
    desc: lf(h, 'desc'),
  }));

  const factsSource = Array.isArray(aboutDoc?.facts) && aboutDoc.facts.length > 0
    ? aboutDoc.facts
    : defaults.facts;
  const facts = factsSource.map((f) => [lf(f, 'label'), lf(f, 'value')]);

  const missionCards = [
    { icon: Target, color: 'var(--color-primary)', title: t('about_page.mission_title'), body: t('about_page.mission_body') },
    { icon: Eye,    color: 'var(--color-accent)',  title: t('about_page.vision_title'),  body: t('about_page.vision_body') },
    { icon: Heart,  color: 'var(--color-warm)',    title: t('about_page.values_title'),  body: t('about_page.values_body') },
  ];

  useEffect(() => {
    const entries = timelineRef.current?.querySelectorAll('.timeline-entry');
    if (!entries?.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      entries.forEach((el) => {
        gsap.fromTo(el,
          { y: 32, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [timelineItems.length]);

  const categories = [
    { label: t('about_page.categories.highest'),    value: SCHOOL_INFO.catHighest },
    { label: t('about_page.categories.first'),      value: SCHOOL_INFO.catFirst },
    { label: t('about_page.categories.second'),     value: SCHOOL_INFO.catSecond },
    { label: t('about_page.categories.specialist'), value: SCHOOL_INFO.catSpecialist },
    { label: t('about_page.categories.certified'),  value: SCHOOL_INFO.certified },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.about.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.about.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.about.title')}
        subtitle={t('pages.about.banner_subtitle')}
        breadcrumb={t('pages.about.title')}
        image="/images/school-08.jpg"
      />

      {/* История */}
      <section style={{ background: 'var(--color-surface)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          <SectionHeading
            label={t('about_page.history_label')}
            title={t('about_page.history_title')}
            subtitle={t('about_page.history_subtitle')}
            align="center"
          />

          <div ref={timelineRef} className="timeline" style={{ marginTop: 'var(--section-gap)' }}>
            {/* Вертикальная линия */}
            <div className="timeline__line" aria-hidden="true" />

            {timelineItems.map((item, i) => (
              <div key={`${item.year}-${i}`} className={`timeline-entry${i % 2 === 0 ? ' is-left' : ' is-right'}`}>
                <div className="timeline-entry__dot" aria-hidden="true" />
                <div className="timeline-entry__card">
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800,
                    color: 'var(--color-accent)', lineHeight: 1, marginBottom: '0.4rem',
                  }}>
                    {item.year}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.08rem', fontWeight: 700,
                    color: 'var(--color-text)', marginBottom: '0.35rem',
                  }}>
                    {item.title}
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Миссия / Видение / Ценности */}
      <section style={{ background: 'var(--color-bg-soft)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
            {missionCards.map(({ icon: Icon, color, title, body }) => (
              <FadeInView key={title}>
                <div style={{
                  background: 'var(--color-surface)', borderRadius: 'var(--card-radius)',
                  padding: '2rem 1.9rem', boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--color-border)', height: '100%',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color, opacity: 0.9 }} />
                  <div style={{
                    width: 50, height: 50, borderRadius: '0.95rem', background: color, opacity: 0.12,
                    position: 'absolute', top: '2rem', left: '1.9rem',
                  }} />
                  <Icon size={24} color={color} strokeWidth={1.7} style={{ position: 'relative', margin: '0.8rem 0 1.5rem 0.8rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.28rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.6rem' }}>
                    {title}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, margin: 0 }}>{body}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Фотогалерея */}
      <section style={{ background: 'var(--color-surface)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          <SectionHeading label={t('about_page.gallery_label')} title={t('about_page.gallery_title')} align="center" />
          <div style={{
            marginTop: 'var(--section-gap)',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem',
          }}>
            {GALLERY.map(({ src, ratio }, i) => (
              <FadeInView key={src} delay={i * 0.06}>
                <div style={{ borderRadius: 'var(--card-radius)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                  <LazyImage src={src} alt={t('alt.school_photo', { n: i + 1 })} aspectRatio={ratio} />
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Сведения о школе */}
      <section style={{ background: 'var(--color-bg-soft)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="container-site">
          <SectionHeading label={t('about_page.facts_label')} title={t('about_page.facts_title')} align="left" />

          <div className="facts-layout" style={{ marginTop: 'var(--section-gap)' }}>
            {/* Таблица фактов */}
            <div style={{
              borderRadius: 'var(--card-radius)', overflow: 'hidden',
              border: '1px solid var(--color-border)', background: 'var(--color-surface)',
              boxShadow: 'var(--shadow-card)',
            }}>
              {facts.map(([label, value], i) => (
                <div
                  key={label}
                  className="fact-row"
                  style={{ background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-raised)' }}
                >
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>{label}</span>
                  <span style={{ color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Категории педагогов + результаты */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--card-radius)', padding: '1.75rem', boxShadow: 'var(--shadow-card)',
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 1.25rem' }}>
                  {t('about_page.categories_title')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {categories.map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                        <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{value}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-soft)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.round((value / SCHOOL_INFO.staff) * 100)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: '100%', borderRadius: 3, background: 'var(--gradient-accent)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'var(--gradient-primary)', borderRadius: 'var(--card-radius)',
                padding: '1.75rem', color: '#fff', boxShadow: 'var(--shadow-card)',
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.15rem' }}>
                  {t('about_page.results_title', { year: SCHOOL_INFO.graduatesYear })}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: '1rem' }}>
                  {[
                    { v: SCHOOL_INFO.graduates,       l: t('about_page.results.graduates') },
                    { v: SCHOOL_INFO.admissionScore,  l: t('about_page.results.score') },
                    { v: `${SCHOOL_INFO.admittedPercent}%`, l: t('about_page.results.admitted') },
                  ].map(({ v, l }) => (
                    <div key={l}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 800, lineHeight: 1 }}>{v}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.35rem', lineHeight: 1.4 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
