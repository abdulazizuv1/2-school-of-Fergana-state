import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import {
  Send, CheckCircle, MapPin, Phone, Mail, Facebook, ExternalLink, AlertCircle,
} from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticButton from '@/components/ui/MagneticButton';
import FadeInView from '@/components/ui/FadeInView';
import { SCHOOL_INFO } from '@/constants/schoolInfo';

const inputStyle = {
  width: '100%',
  minHeight: 48,
  padding: '0.75rem 1rem',
  border: '1px solid var(--color-border)',
  borderRadius: '0.85rem',
  background: 'var(--color-surface)',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  color: 'var(--color-text)',
  transition: 'border-color 200ms, box-shadow 200ms',
};

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: '1.15rem' }}>
      <label style={{
        display: 'block', marginBottom: '0.4rem',
        fontSize: '0.8rem', fontWeight: 500,
        color: error ? 'var(--color-vivid)' : 'var(--color-text-muted)',
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-vivid)', fontSize: '0.75rem', margin: '0.35rem 0 0' }}>
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

export default function ContactPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setSending(true);
    setSendError('');
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(serviceId, templateId, {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        }, publicKey);
      }

      setSubmitted(true);
      reset();
    } catch (err) {
      console.error(err);
      setSendError(t('form.error'));
    } finally {
      setSending(false);
    }
  };

  const contacts = [
    { icon: MapPin,    label: t('about_page.facts.address'), text: SCHOOL_INFO.addressRu },
    { icon: Phone,     label: t('form.phone'),  text: SCHOOL_INFO.phone,       href: `tel:${SCHOOL_INFO.phone.replace(/[^+\d]/g, '')}` },
    { icon: Phone,     label: t('form.phone'),  text: SCHOOL_INFO.phoneMobile, href: `tel:${SCHOOL_INFO.phoneMobile.replace(/[^+\d]/g, '')}` },
    { icon: Mail,      label: 'Email',          text: SCHOOL_INFO.email,       href: `mailto:${SCHOOL_INFO.email}` },
    { icon: Facebook,  label: 'Facebook',       text: 'school2fergana',        href: SCHOOL_INFO.facebook,  external: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
    >
      <Helmet>
        <title>{t('pages.contact.title')} | {SCHOOL_INFO.nameShortRu}</title>
        <meta name="description" content={t('pages.contact.description')} />
      </Helmet>

      <PageBanner
        title={t('pages.contact.title')}
        subtitle={t('pages.contact.banner_subtitle')}
        breadcrumb={t('pages.contact.title')}
        image="/images/school-05.jpg"
      />

      <section style={{ background: 'var(--color-bg)', padding: 'var(--section-py) var(--section-px)' }}>
        <div className="home-split" style={{ maxWidth: 'var(--max-width)', margin: '0 auto', alignItems: 'start' }}>
          {/* Форма */}
          <FadeInView direction="left">
            <SectionHeading label={t('contact_section.badge')} title={t('pages.contact.banner_subtitle')} align="left" />

            <div style={{
              marginTop: '1.75rem', background: 'var(--color-surface)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--card-radius)',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)', boxShadow: 'var(--shadow-card)',
            }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', padding: '2.5rem 1rem' }}
                  >
                    <CheckCircle size={58} color="var(--color-success)" strokeWidth={1.5} style={{ margin: '0 auto 1.25rem' }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                      {t('form.success_title')}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{t('form.success_body')}</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Field label={t('form.name')} error={errors.name?.message}>
                      <input
                        {...register('name', { required: t('form.required') })}
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-soft)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </Field>

                    <Field label={t('form.email')} error={errors.email?.message}>
                      <input
                        type="email"
                        {...register('email', {
                          required: t('form.required'),
                          pattern: { value: /\S+@\S+\.\S+/, message: t('form.invalid_email') },
                        })}
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-soft)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </Field>

                    <Field label={t('form.phone')}>
                      <input type="tel" {...register('phone')} style={inputStyle} />
                    </Field>

                    <Field label={t('form.subject')}>
                      <select {...register('subject')} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {['general', 'admission', 'partnership', 'other'].map((k) => (
                          <option key={k} value={k}>{t(`form.subjects.${k}`)}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label={t('form.message')} error={errors.message?.message}>
                      <textarea
                        rows={5}
                        {...register('message', { required: t('form.required') })}
                        style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                      />
                    </Field>

                    {sendError && (
                      <p style={{ color: 'var(--color-vivid)', fontSize: '0.85rem', marginBottom: '1rem' }}>{sendError}</p>
                    )}

                    <MagneticButton type="submit" variant="primary" icon={Send} disabled={sending}>
                      {sending ? t('form.sending') : t('form.send')}
                    </MagneticButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeInView>

          {/* Контакты + карта */}
          <FadeInView direction="right">
            <div style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--card-radius)', padding: 'clamp(1.5rem, 3vw, 2rem)',
              boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {contacts.map(({ icon: Icon, label, text, href, external }) => (
                  <div key={`${label}-${text}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <span style={{
                      width: 42, height: 42, borderRadius: '0.8rem', background: 'var(--color-primary-soft)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={18} color="var(--color-primary)" />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: '0.7rem', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase',
                        color: 'var(--color-text-muted)', margin: '0 0 0.2rem',
                      }}>
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text)', fontSize: '0.95rem', textDecoration: 'none', transition: 'color 200ms' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text)'; }}
                        >
                          {text}
                          {external && <ExternalLink size={12} style={{ opacity: 0.5 }} />}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.5 }}>{text}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Карта */}
            <div style={{
              borderRadius: 'var(--card-radius)', overflow: 'hidden', height: 380,
              border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)',
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

            <div style={{ marginTop: '1rem' }}>
              <MagneticButton href={SCHOOL_INFO.mapLink} variant="outline" icon={ExternalLink}>
                {t('contact_section.map_title')}
              </MagneticButton>
            </div>
          </FadeInView>
        </div>
      </section>
    </motion.div>
  );
}
