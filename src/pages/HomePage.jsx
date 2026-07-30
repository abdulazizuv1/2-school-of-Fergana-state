import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, Phone, MapPin, Calendar, GraduationCap, Users, Award,
  Facebook, CalendarDays, BookOpen, Dumbbell, Presentation,
  FlaskConical, Library, ExternalLink, FileText, Building2, Sparkles,
  Monitor, UtensilsCrossed,
} from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticButton from '@/components/ui/MagneticButton';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import FadeInView from '@/components/ui/FadeInView';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import ClubCard from '@/components/ui/ClubCard';
import NewsCard from '@/components/ui/NewsCard';
import PersonCard from '@/components/ui/PersonCard';
import Marquee from '@/components/ui/Marquee';
import LazyImage from '@/components/ui/LazyImage';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { SCHOOL_INFO } from '@/constants/schoolInfo';
import useEmblaCarousel from 'embla-carousel-react';

/* ═══ Секция 1: Hero «Афиша» ═══════════════════════════════════
   Крупная типографика на всю ширину, вертикальная подпись слева
   и стат-лента, прижатая к низу экрана.                          */
function HeroSection() {
  const { t } = useTranslation();

  const stats = [
    { key: 'students', value: SCHOOL_INFO.students },
    { key: 'staff',    value: SCHOOL_INFO.staff },
    { key: 'classes',  value: SCHOOL_INFO.classes },
  ];

  return (
    <section className="hero-poster">
      {/* Фон: фото с медленным ken burns + два слоя затемнения */}
      <img
        className="hero-poster__photo"
        src="/images/school-07.jpg"
        alt=""
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, rgba(13,34,54,0.94) 0%, rgba(13,34,54,0.72) 46%, rgba(17,42,66,0.38) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(55% 45% at 88% 20%, rgba(111,176,227,0.28) 0%, transparent 65%)',
        }}
      />

      {/* Вертикальная подпись у левого края */}
      <motion.div
        className="hero-poster__vertical"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.9 }}
        aria-hidden="true"
      >
        <span style={{ width: 54, height: 1, background: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
        <span style={{
          fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap',
        }}>
          {t('hero.vertical')}
        </span>
      </motion.div>

      {/* Содержимое */}
      <div className="hero-poster__body">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'clamp(1rem, 2vw, 28px)' }}
        >
          <span style={{ width: 44, height: 2, background: 'var(--color-accent-light)', flexShrink: 0 }} />
          <span style={{
            fontSize: 'clamp(0.66rem, 0.9vw, 0.8rem)', fontWeight: 600, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--color-accent-light)',
          }}>
            {t('hero.eyebrow')}
          </span>
        </motion.div>

        <h1 className="hero-poster__title">
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block', fontWeight: 700 }}
            >
              {t('hero.title_line1')}{' '}
              <span style={{ color: 'var(--color-accent-light)' }}>{t('hero.title_accent')}</span>
            </motion.span>
          </span>

          <span style={{ display: 'block', overflow: 'hidden' }}>
            <motion.span
              className="hero-poster__outline"
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {t('hero.title_line2')}
            </motion.span>
          </span>
        </h1>

        <div className="hero-poster__lead">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{
              fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
              color: 'rgba(255,255,255,0.88)',
              maxWidth: '44ch', margin: 0, lineHeight: 1.65,
            }}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            style={{ display: 'flex', gap: '0.85rem', flexShrink: 0, flexWrap: 'wrap' }}
          >
            <MagneticButton to="/about" variant="accent" icon={ArrowRight}>
              {t('hero.cta_about')}
            </MagneticButton>
            <MagneticButton to="/contact" variant="outline-white" icon={Phone} iconPosition="left">
              {t('hero.cta_contact')}
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Стат-лента внизу */}
      <motion.div
        className="hero-poster__stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.9 }}
      >
        {stats.map(({ key, value }) => (
          <div key={key} className="hero-poster__stat">
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.6vw, 2.5rem)',
              fontWeight: 700, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
            }}>
              <AnimatedCounter target={value} />
            </div>
            <div style={{
              fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)', marginTop: 6,
            }}>
              {t(`stats.${key}`)}
            </div>
          </div>
        ))}

        <div className="hero-poster__stat hero-poster__ticker">
          <span className="hero-poster__dot" aria-hidden="true" />
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.45 }}>
            {t('hero.ticker', { p: SCHOOL_INFO.admittedPercent, year: SCHOOL_INFO.graduatesYear })}
          </span>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══ Секция 2: бесконечная лента предметов ════════════════════ */
function SubjectsMarqueeSection() {
  const { t } = useTranslation();

  const subjects = [
    'Математика', 'Физика', 'Химия', 'Биология', 'Информатика', 'Английский язык',
    'Русский язык', 'Литература', 'История', 'География', 'Родной язык', 'Физкультура',
  ];

  return (
    <section
      style={{
        background: 'var(--gradient-primary)',
        padding: '1.6rem 0',
        overflow: 'hidden',
        position: 'relative',
      }}
      aria-label={t('marquee.aria')}
    >
      <Marquee items={subjects} duration={42} />
      <Marquee items={[...subjects].reverse()} duration={52} reverse style={{ marginTop: '0.7rem', opacity: 0.55 }} />
    </section>
  );
}

/* ═══ Секция 3: О школе + фотомозаика ══════════════════════════ */
function AboutSection() {
  const { t } = useTranslation();

  return (
    <section style={{ background: 'var(--color-surface)', padding: 'var(--section-py) var(--section-px)' }}>
      <div className="home-split" style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        {/* Текст */}
        <div>
          <SectionHeading
            label={t('about_section.badge')}
            title={t('about_section.title')}
            subtitle={t('about_section.body1')}
            align="left"
          />
          <FadeInView delay={0.2}>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, margin: '0 0 1.75rem' }}>
              {t('about_section.body2')}
            </p>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {[
                { icon: MapPin,       text: t('about_section.city') },
                { icon: CalendarDays, text: t('about_section.year') },
                { icon: Award,        text: t('about_section.type') },
                { icon: BookOpen,     text: t('about_section.language') },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                    border: '1px solid var(--color-border)', background: 'var(--color-bg-soft)',
                    borderRadius: 'var(--radius-pill)', padding: '7px 16px',
                    fontSize: '0.84rem', color: 'var(--color-text-muted)',
                  }}
                >
                  <Icon size={14} color="var(--color-primary)" /> {text}
                </span>
              ))}
            </div>

            <MagneticButton to="/about" variant="outline" icon={ArrowRight}>
              {t('about_section.more')}
            </MagneticButton>
          </FadeInView>
        </div>

        {/* Фотомозаика */}
        <FadeInView direction="right">
          <div style={{ position: 'relative', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                fontFamily: 'var(--font-display)', fontSize: 'clamp(9rem, 18vw, 15rem)', fontWeight: 800,
                color: 'rgba(44,107,168,0.05)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', zIndex: 0,
              }}
            >
              2
            </div>

            <div
              style={{
                position: 'relative', zIndex: 1,
                display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.8rem',
              }}
            >
              {/* Высокое фото тянется на всю высоту колонки — иначе снизу остаётся пустая рамка */}
              <div style={{ borderRadius: 'var(--card-radius)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', display: 'flex' }}>
                <LazyImage src="/images/school-09.jpg" alt={t('alt.facade')} aspectRatio="4/5" style={{ height: '100%' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.8rem' }}>
                <div style={{ borderRadius: 'var(--card-radius)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                  <LazyImage src="/images/school-08.jpg" alt={t('alt.building')} aspectRatio="4/3" />
                </div>
                <div style={{ borderRadius: 'var(--card-radius)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                  <LazyImage src="/images/school-10.jpg" alt={t('alt.assembly')} aspectRatio="4/3" />
                </div>
              </div>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

/* ═══ Секция 4: цифры школы ════════════════════════════════════ */
function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    // Год не «крутим» счётчиком — 0…1968 читается как ошибка
    { icon: Calendar,      key: 'founded',  value: SCHOOL_INFO.founded,  suffix: '', tint: 'var(--color-primary)', animate: false },
    { icon: GraduationCap, key: 'students', value: SCHOOL_INFO.students, suffix: '', tint: 'var(--color-accent)' },
    { icon: Users,         key: 'staff',    value: SCHOOL_INFO.staff,    suffix: '', tint: 'var(--color-warm)' },
    { icon: Award,         key: 'admitted', value: SCHOOL_INFO.admittedPercent, suffix: '%', tint: 'var(--color-live)' },
  ];

  return (
    <section style={{ background: 'var(--color-bg-soft)', padding: 'var(--section-py) var(--section-px)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <SectionHeading label={t('stats_section.badge')} title={t('stats_section.title')} align="center" />

        <StaggerContainer
          className="stats-grid"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem', marginTop: 'var(--section-gap)',
          }}
        >
          {stats.map(({ icon: Icon, key, value, suffix, tint, animate = true }) => (
            <StaggerItem key={key}>
              <div
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--card-radius)',
                  padding: '1.9rem 1.6rem',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--color-border)',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'transform 350ms cubic-bezier(0.22,1,0.36,1), box-shadow 350ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute', top: -34, right: -34, width: 116, height: 116,
                    borderRadius: '50%', background: tint, opacity: 0.09,
                  }}
                />
                <div style={{
                  width: 46, height: 46, borderRadius: '0.95rem',
                  background: tint, opacity: 0.14, position: 'absolute', top: '1.9rem', left: '1.6rem',
                }} />
                <Icon size={22} color={tint} strokeWidth={1.9} style={{ position: 'relative', margin: '0.75rem 0 1.5rem 0.75rem' }} />

                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800,
                  color: 'var(--color-text)', lineHeight: 1, marginBottom: '0.4rem', position: 'relative',
                }}>
                  {animate ? <AnimatedCounter target={value} suffix={suffix} /> : `${value}${suffix}`}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.78rem', letterSpacing: 'var(--tracking-caps)',
                  textTransform: 'uppercase', color: 'var(--color-text-muted)', position: 'relative',
                }}>
                  {t(`stats.${key}`)}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ═══ Секция 5: инфраструктура (карточки с фото) ═══════════════ */
function FacilitiesSection() {
  const { t } = useTranslation();

  // Каждая карточка привязана к реальной фотографии этого помещения
  const facilities = [
    { img: '/images/school-06.jpg', icon: Dumbbell,     key: 'gym',       meta: SCHOOL_INFO.gymSize },
    { img: '/images/school-10.jpg', icon: Presentation, key: 'assembly',  meta: `${SCHOOL_INFO.assemblySeats} ${t('facilities.seats')}` },
    { img: '/images/school-08.jpg', icon: Building2,    key: 'buildings', meta: t('facilities.buildings_meta', { total: SCHOOL_INFO.capacityTotal }) },
    { img: '/images/school-04.jpg', icon: Sparkles,     key: 'halls',     meta: t('facilities.halls_meta') },
  ];

  // Строчки без фото — данные из паспорта школы
  const extras = [
    { icon: FlaskConical, text: t('facilities.extras.labs', { list: SCHOOL_INFO.subjectRooms.slice(0, 3).join(', ') }) },
    { icon: Monitor,      text: t('facilities.extras.it', { rooms: SCHOOL_INFO.computerRooms, computers: SCHOOL_INFO.computers }) },
    { icon: Library,      text: t('facilities.extras.library') },
    { icon: UtensilsCrossed, text: t('facilities.extras.canteen', { seats: SCHOOL_INFO.canteenSeats }) },
  ];

  return (
    <section style={{ background: 'var(--color-surface)', padding: 'var(--section-py) var(--section-px)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <SectionHeading
          label={t('facilities.badge')}
          title={t('facilities.title')}
          subtitle={t('facilities.subtitle')}
          align="center"
        />

        <StaggerContainer
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(258px, 1fr))',
            gap: '1.25rem', marginTop: 'var(--section-gap)',
          }}
        >
          {facilities.map(({ img, icon: Icon, key, meta }) => (
            <StaggerItem key={key}>
              <article
                style={{
                  position: 'relative', borderRadius: 'var(--card-radius)', overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)', height: '100%', minHeight: 320,
                  transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1), box-shadow 400ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  const im = e.currentTarget.querySelector('img');
                  if (im) im.style.transform = 'scale(1.07)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                  const im = e.currentTarget.querySelector('img');
                  if (im) im.style.transform = 'scale(1)';
                }}
              >
                <img
                  src={img}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover', transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(20,50,77,0.08) 0%, rgba(20,50,77,0.55) 55%, rgba(20,50,77,0.88) 100%)',
                }} />

                <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.6rem' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '0.85rem',
                    background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.9rem',
                  }}>
                    <Icon size={20} color="#fff" strokeWidth={1.8} />
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.18rem', fontWeight: 700,
                    color: '#fff', margin: '0 0 0.35rem',
                  }}>
                    {t(`facilities.items.${key}`)}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.82)', margin: 0, lineHeight: 1.5 }}>
                    {meta}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Дополнительно — из паспорта школы */}
        <FadeInView delay={0.15}>
          <div
            style={{
              marginTop: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {extras.map(({ icon: Icon, text }) => (
              <div
                key={text}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  background: 'var(--color-bg-soft)', border: '1px solid var(--color-border)',
                  borderRadius: '1rem', padding: '0.9rem 1.1rem',
                  fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.45,
                }}
              >
                <Icon size={17} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

/* ═══ Секция 6: клубы и кружки — только если что-то добавлено ══ */
function ClubsSection() {
  const { t } = useTranslation();
  const { data: clubs = [] } = useFirestoreCollection('clubs', { orderByField: 'order' });
  const [emblaRef] = useEmblaCarousel({ dragFree: true, loop: false, align: 'start' });

  if (clubs.length === 0) return null;

  return (
    <section style={{ background: 'var(--color-bg-soft)', padding: 'var(--section-py) 0' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--section-px)', marginBottom: 'var(--section-gap)' }}>
        <div className="section-head">
          <SectionHeading label={t('clubs_section.badge')} title={t('clubs_section.title')} align="left" />
          <MagneticButton to="/clubs" variant="ghost" icon={ArrowRight}>
            {t('clubs_section.all')}
          </MagneticButton>
        </div>
      </div>

      <div ref={emblaRef} style={{ overflow: 'hidden', padding: '0.5rem var(--section-px) 1rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {clubs.map((club, i) => (
            <ClubCard key={club.id} club={club} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ Секция 7: новости — только если что-то добавлено ═════════ */
function NewsSection() {
  const { t } = useTranslation();
  const { data: news = [] } = useFirestoreCollection('news', {
    orderByField: 'date',
    direction: 'desc',
    limit: 4,
  });

  if (news.length === 0) return null;

  return (
    <section style={{ background: 'var(--color-surface)', padding: 'var(--section-py) var(--section-px)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div className="section-head" style={{ marginBottom: 'var(--section-gap)' }}>
          <SectionHeading label={t('news_section.badge')} title={t('news_section.title')} align="left" />
          <MagneticButton to="/news" variant="ghost" icon={ArrowRight}>
            {t('news_section.all')}
          </MagneticButton>
        </div>

        <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: news.length > 1 ? '58fr 42fr' : '1fr', gap: '1.25rem', alignItems: 'stretch' }}>
          <NewsCard article={news[0]} variant="featured" />
          {news.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {news.slice(1, 4).map((article) => (
                <NewsCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══ Секция 8: гордость школы — только если что-то добавлено ══ */
function AchieversSection() {
  const { t } = useTranslation();
  const { data: achievers = [] } = useFirestoreCollection('achievers', {
    orderByField: 'year', direction: 'desc', limit: 8,
  });
  const [emblaRef] = useEmblaCarousel({ dragFree: true, align: 'start' });

  if (achievers.length === 0) return null;

  return (
    <section className="with-grain" style={{ background: 'var(--gradient-dark)', padding: 'var(--section-py) 0' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--section-px)', marginBottom: 'var(--section-gap)', textAlign: 'center' }}>
        <SectionHeading
          label={t('achievers_section.badge')}
          title={t('achievers_section.title')}
          accentWord={t('achievers_section.highlight')}
          align="center"
          light
        />
      </div>

      <div ref={emblaRef} style={{ overflow: 'hidden', padding: '0 var(--section-px)' }}>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {achievers.map((person) => (
            <div key={person.id} style={{ minWidth: 236, flexShrink: 0 }}>
              <PersonCard person={person} variant="achiever" />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--section-gap)' }}>
        <MagneticButton to="/achievers" variant="outline-white" icon={ArrowRight}>
          {t('achievers_section.all')}
        </MagneticButton>
      </div>
    </section>
  );
}

/* ═══ Секция 9: документы школы ════════════════════════════════ */
function DocumentsTeaserSection() {
  const { t } = useTranslation();

  return (
    <section style={{ background: 'var(--color-bg-soft)', padding: 'var(--section-py) var(--section-px)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <FadeInView>
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)',
              padding: 'clamp(2rem, 4vw, 3.25rem)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '2rem', flexWrap: 'wrap',
              position: 'relative', overflow: 'hidden',
              boxShadow: 'var(--shadow-hover)',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', right: -60, top: -60, width: 260, height: 260,
                borderRadius: '50%', background: 'rgba(255,255,255,0.09)',
              }}
            />
            <div style={{ position: 'relative', maxWidth: '46ch' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem',
                background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)',
                borderRadius: 'var(--radius-pill)', padding: '5px 14px', color: '#fff', fontSize: '0.75rem',
                letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase',
              }}>
                <FileText size={13} /> {t('documents_section.badge')}
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 700,
                color: '#fff', margin: '0 0 0.7rem', lineHeight: 1.15,
              }}>
                {t('documents_section.title')}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.65 }}>
                {t('documents_section.body')}
              </p>
            </div>
            <div style={{ position: 'relative' }}>
              <MagneticButton to="/documents" variant="accent" icon={ArrowRight}>
                {t('documents_section.cta')}
              </MagneticButton>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

/* ═══ Секция 10: контакты + карта ══════════════════════════════ */
function ContactTeaserSection() {
  const { t } = useTranslation();

  const contactRows = [
    { icon: MapPin,    text: SCHOOL_INFO.addressRu },
    { icon: Phone,     text: SCHOOL_INFO.phone,       href: `tel:${SCHOOL_INFO.phone.replace(/[^+\d]/g, '')}` },
    { icon: Phone,     text: SCHOOL_INFO.phoneMobile, href: `tel:${SCHOOL_INFO.phoneMobile.replace(/[^+\d]/g, '')}` },
    { icon: Facebook,  text: 'school2fergana',        href: SCHOOL_INFO.facebook,  external: true },
  ];

  return (
    <section style={{ background: 'var(--color-surface)', padding: 'var(--section-py) var(--section-px)' }}>
      <div className="home-split" style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <FadeInView direction="left">
          <SectionHeading label={t('contact_section.badge')} title={t('contact_section.title')} align="left" />

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
            {contactRows.map(({ icon: Icon, text, href, external }) => {
              const content = (
                <>
                  <span style={{
                    width: 36, height: 36, borderRadius: '0.7rem', background: 'var(--color-primary-soft)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} color="var(--color-primary)" />
                  </span>
                  <span>{text}</span>
                  {external && <ExternalLink size={13} style={{ opacity: 0.5 }} />}
                </>
              );

              const rowStyle = {
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                color: 'var(--color-text-muted)', fontSize: '0.92rem',
                textDecoration: 'none', transition: 'color 200ms',
              };

              return href ? (
                <a
                  key={text}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  style={rowStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  {content}
                </a>
              ) : (
                <div key={text} style={rowStyle}>{content}</div>
              );
            })}
          </div>

          <MagneticButton to="/contact" variant="primary" icon={ArrowRight}>
            {t('contact_section.full_page')}
          </MagneticButton>
        </FadeInView>

        <FadeInView direction="right">
          <div style={{
            borderRadius: 'var(--card-radius)', overflow: 'hidden', height: 400,
            boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)',
          }}>
            <iframe
              src={SCHOOL_INFO.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title={t('contact_section.map_title')}
            />
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

/* ═══ Страница ═════════════════════════════════════════════════ */
export default function HomePage() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.home.title')}</title>
        <meta name="description" content={t('pages.home.description')} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'School',
          name: SCHOOL_INFO.nameRu,
          alternateName: [SCHOOL_INFO.nameEn, SCHOOL_INFO.nameUz],
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Мураббийлар, 37',
            addressLocality: 'Фергана',
            addressRegion: 'Ферганская область',
            addressCountry: 'UZ',
          },
          telephone: SCHOOL_INFO.phone,
          foundingDate: String(SCHOOL_INFO.founded),
          numberOfStudents: SCHOOL_INFO.students,
          sameAs: [SCHOOL_INFO.facebook],
        })}</script>
      </Helmet>

      <HeroSection />
      <SubjectsMarqueeSection />
      <AboutSection />
      <StatsSection />
      <FacilitiesSection />
      <ClubsSection />
      <NewsSection />
      <AchieversSection />
      <DocumentsTeaserSection />
      <ContactTeaserSection />
    </motion.div>
  );
}
