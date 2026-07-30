import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Save, RotateCcw, Loader2, History, Table2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/firebase/config';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import AdminFormField from '@/components/admin/AdminFormField';
import { getAboutDefaults } from '@/constants/aboutContent';

function buildInitial(aboutDoc) {
  const d = getAboutDefaults();
  return {
    history: Array.isArray(aboutDoc?.history) && aboutDoc.history.length > 0 ? aboutDoc.history : d.history,
    facts:   Array.isArray(aboutDoc?.facts)   && aboutDoc.facts.length   > 0 ? aboutDoc.facts   : d.facts,
  };
}

const cardStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: '1rem',
  background: 'white',
  padding: '1.25rem',
  marginBottom: '1rem',
};

function RowHeader({ title, onRemove }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>{title}</span>
      <button
        type="button"
        onClick={onRemove}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.7rem', border: '1px solid var(--color-vivid)', borderRadius: '0.5rem', background: 'transparent', color: 'var(--color-vivid)', fontSize: '0.78rem', cursor: 'pointer' }}
      >
        <Trash2 size={13} /> Удалить
      </button>
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', borderRadius: 'var(--radius-pill)', border: '1px dashed var(--color-border-strong)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
    >
      <Plus size={16} /> {label}
    </button>
  );
}

function SectionTitle({ icon: Icon, title, hint }) {
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
        <Icon size={19} color="var(--color-primary)" /> {title}
      </h3>
      {hint && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.4rem 0 0' }}>{hint}</p>}
    </div>
  );
}

export default function AdminAbout() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  const { data: aboutDoc, isLoading } = useFirestoreDoc('siteContent', 'about');

  const { register, control, handleSubmit, reset } = useForm({ defaultValues: buildInitial(null) });

  const history = useFieldArray({ control, name: 'history' });
  const facts   = useFieldArray({ control, name: 'facts' });

  // Заполняем форму один раз, когда данные из Firestore загрузились
  useEffect(() => {
    if (isLoading || ready) return;
    reset(buildInitial(aboutDoc));
    setReady(true);
  }, [isLoading, ready, aboutDoc, reset]);

  const loadDefaults = () => {
    if (!window.confirm('Заменить текущий текст стандартными данными? Несохранённые правки будут потеряны.')) return;
    reset(getAboutDefaults());
    toast('Загружены стандартные данные — не забудьте сохранить', { icon: 'ℹ️' });
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'siteContent', 'about'),
        {
          history: values.history || [],
          facts: values.facts || [],
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'about'] });
      toast.success('Сохранено');
    } catch (err) {
      console.error(err);
      toast.error(`Ошибка сохранения: ${err.code || err.message}`);
    } finally {
      setSaving(false);
    }
  });

  if (isLoading || !ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 size={24} color="var(--color-text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Шапка с кнопками */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
        marginBottom: '1.5rem', position: 'sticky', top: 0, background: 'var(--color-bg)', paddingBottom: '0.75rem', zIndex: 2,
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Страница «О школе»</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.35rem 0 0' }}>
            Редактируйте блоки «Как росла школа» и «Сведения о школе». Заполняйте поля на трёх языках.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
          <button
            type="button"
            onClick={loadDefaults}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <RotateCcw size={15} /> Стандартные данные
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.4rem', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--color-primary)', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
          >
            <Save size={16} /> {saving ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* ── Как росла школа ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <SectionTitle icon={History} title="Как росла школа (таймлайн)" hint="Каждое событие — год, заголовок и описание. Порядок сверху вниз." />

        {history.fields.map((field, i) => (
          <div key={field.id} style={cardStyle}>
            <RowHeader title={`Событие ${i + 1}`} onRemove={() => history.remove(i)} />

            <div style={{ maxWidth: 160 }}>
              <AdminFormField label="Год" name={`history.${i}.year`} register={register} placeholder="1968" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <AdminFormField label="Заголовок RU" name={`history.${i}.title_ru`} register={register} />
              <AdminFormField label="Заголовок EN" name={`history.${i}.title_en`} register={register} />
              <AdminFormField label="Заголовок UZ" name={`history.${i}.title_uz`} register={register} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <AdminFormField label="Описание RU" name={`history.${i}.desc_ru`} type="textarea" rows={3} register={register} />
              <AdminFormField label="Описание EN" name={`history.${i}.desc_en`} type="textarea" rows={3} register={register} />
              <AdminFormField label="Описание UZ" name={`history.${i}.desc_uz`} type="textarea" rows={3} register={register} />
            </div>
          </div>
        ))}

        <AddButton
          label="Добавить событие"
          onClick={() => history.append({ year: '', title_ru: '', title_en: '', title_uz: '', desc_ru: '', desc_en: '', desc_uz: '' })}
        />
      </section>

      {/* ── Сведения о школе ── */}
      <section>
        <SectionTitle icon={Table2} title="Сведения о школе (таблица)" hint="Каждая строка — название показателя и его значение." />

        {facts.fields.map((field, i) => (
          <div key={field.id} style={cardStyle}>
            <RowHeader title={`Строка ${i + 1}`} onRemove={() => facts.remove(i)} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <AdminFormField label="Название RU" name={`facts.${i}.label_ru`} register={register} />
              <AdminFormField label="Название EN" name={`facts.${i}.label_en`} register={register} />
              <AdminFormField label="Название UZ" name={`facts.${i}.label_uz`} register={register} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <AdminFormField label="Значение RU" name={`facts.${i}.value_ru`} register={register} />
              <AdminFormField label="Значение EN" name={`facts.${i}.value_en`} register={register} />
              <AdminFormField label="Значение UZ" name={`facts.${i}.value_uz`} register={register} />
            </div>
          </div>
        ))}

        <AddButton
          label="Добавить строку"
          onClick={() => facts.append({ label_ru: '', label_en: '', label_uz: '', value_ru: '', value_en: '', value_uz: '' })}
        />
      </section>

      {/* Нижняя кнопка сохранения — для удобства после длинного списка */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.6rem', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--color-primary)', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
        >
          <Save size={16} /> {saving ? 'Сохранение…' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  );
}
