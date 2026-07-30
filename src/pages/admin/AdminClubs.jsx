import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, ExternalLink, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { db } from '@/firebase/config';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminFormField from '@/components/admin/AdminFormField';
import AdminImageUpload from '@/components/admin/AdminImageUpload';
import { CLUB_TYPES, slugify, clubSlug, isMainClub } from '@/utils/clubs';

function IconPreview({ name }) {
  const Icon = LucideIcons[name];
  if (!Icon) return <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>—</span>;
  return <Icon size={22} color="var(--color-primary)" />;
}

const TYPE_OPTIONS = [
  { value: CLUB_TYPES.CIRCLE, label: 'Кружок' },
  { value: CLUB_TYPES.CLUB,   label: 'Клуб (только Start Up Club)' },
];

const columns = [
  {
    key: 'icon_name',
    label: 'Иконка',
    render: (row) => <IconPreview name={row.icon_name} />,
  },
  { key: 'name_ru', label: 'Название (RU)' },
  {
    key: 'type',
    label: 'Тип',
    render: (row) => (
      <span style={{
        display: 'inline-block', padding: '2px 10px', borderRadius: 'var(--radius-pill)',
        fontSize: '0.72rem', fontWeight: 600,
        background: isMainClub(row) ? 'var(--color-primary-soft)' : 'var(--color-accent-soft)',
        color: isMainClub(row) ? 'var(--color-primary)' : '#5E9134',
      }}>
        {isMainClub(row) ? 'Клуб' : 'Кружок'}
      </span>
    ),
  },
  {
    key: 'slug',
    label: 'Ссылка',
    render: (row) => (
      <a
        href={`/clubs/${clubSlug(row)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-primary)', fontSize: '0.8rem', textDecoration: 'none' }}
      >
        /clubs/{clubSlug(row)} <ExternalLink size={12} />
      </a>
    ),
  },
  { key: 'teacher_lead', label: 'Руководитель' },
];

export default function AdminClubs() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [gallery, setGallery] = useState([]);

  const { data = [], isLoading } = useFirestoreCollection('clubs', {
    orderByField: 'order',
    queryOptions: { staleTime: 0 },
  });

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { type: CLUB_TYPES.CIRCLE },
  });

  const iconName = watch('icon_name', '');
  const nameRu = watch('name_ru', '');
  const nameEn = watch('name_en', '');
  const slug = watch('slug', '');

  // Пока адрес страницы не задан вручную — подставляем его из названия
  useEffect(() => {
    if (!modalOpen || editItem) return;
    setValue('slug', slugify(nameEn || nameRu));
  }, [nameRu, nameEn, modalOpen, editItem, setValue]);

  const openAdd = () => {
    setEditItem(null);
    setPhotoUrl('');
    setGallery([]);
    reset({ type: CLUB_TYPES.CIRCLE, order: data.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setPhotoUrl(item.photo_url || '');
    setGallery(Array.isArray(item.gallery) ? item.gallery : []);
    reset({
      ...item,
      type: item.type || (isMainClub(item) ? CLUB_TYPES.CLUB : CLUB_TYPES.CIRCLE),
      slug: clubSlug(item),
    });
    setModalOpen(true);
  };

  const onSave = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        photo_url: photoUrl,
        gallery,
        type: values.type || CLUB_TYPES.CIRCLE,
        slug: slugify(values.slug || values.name_en || values.name_ru),
        members_count: Number(values.members_count || 0),
        order: Number(values.order || 0),
      };
      delete payload.id;

      if (editItem) {
        await updateDoc(doc(db, 'clubs', editItem.id), payload);
        toast.success('Сохранено');
      } else {
        await addDoc(collection(db, 'clubs'), payload);
        toast.success('Добавлено');
      }
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  });

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'clubs', id));
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('Удалено');
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          Клубы и кружки
        </h2>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--color-primary)',
            color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Добавить кружок
        </button>
      </div>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '70ch' }}>
        У школы один клуб — <strong>Start Up Club</strong>. Всё остальное добавляйте как «кружок».
        Каждая запись получает свою страницу по адресу <code>/clubs/адрес-страницы</code> — заполните
        разделы «О кружке», «Чему учимся» и «Достижения», чтобы страница выглядела полной.
      </p>

      <AdminTable columns={columns} data={data} loading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Редактировать кружок' : 'Добавить кружок'}
        onSave={onSave}
        saving={saving}
      >
        {/* Основное */}
        <AdminImageUpload label="Обложка" storageFolder="clubs" currentUrl={photoUrl} onUpload={setPhotoUrl} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <AdminFormField label="Тип" name="type" type="select" options={TYPE_OPTIONS} register={register} />
          <AdminFormField label="Порядок вывода" name="order" type="number" register={register} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <AdminFormField label="Название RU" name="name_ru" register={register} />
          <AdminFormField label="Название EN" name="name_en" register={register} />
          <AdminFormField label="Название UZ" name="name_uz" register={register} />
        </div>

        <AdminFormField
          label="Адрес страницы (латиницей)"
          name="slug"
          register={register}
          placeholder="start-up-club"
        />
        {slug && (
          <p style={{ marginTop: '-0.9rem', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            Страница будет доступна по адресу <code>/clubs/{slugify(slug)}</code>
          </p>
        )}

        {/* Короткое описание — показывается на карточке */}
        <AdminFormField label="Краткое описание RU (на карточке)" name="description_ru" type="textarea" rows={3} register={register} />
        <AdminFormField label="Краткое описание EN" name="description_en" type="textarea" rows={2} register={register} />
        <AdminFormField label="Краткое описание UZ" name="description_uz" type="textarea" rows={2} register={register} />

        {/* Развёрнутый текст — только на странице кружка */}
        <div style={{ borderTop: '1px solid var(--color-border)', margin: '0.5rem 0 1.25rem', paddingTop: '1.25rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.35rem' }}>
            Отдельная страница кружка
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 1.25rem' }}>
            Эти поля показываются только на странице кружка. Абзацы разделяйте переносом строки.
          </p>

          <AdminFormField label="О кружке — RU" name="about_ru" type="textarea" rows={5} register={register} />
          <AdminFormField label="О кружке — EN" name="about_en" type="textarea" rows={3} register={register} />
          <AdminFormField label="О кружке — UZ" name="about_uz" type="textarea" rows={3} register={register} />

          <AdminFormField label="Чему учимся — RU" name="goals_ru" type="textarea" rows={4} register={register} />
          <AdminFormField label="Чему учимся — EN" name="goals_en" type="textarea" rows={3} register={register} />
          <AdminFormField label="Чему учимся — UZ" name="goals_uz" type="textarea" rows={3} register={register} />

          <AdminFormField label="Достижения — RU" name="achievements_ru" type="textarea" rows={4} register={register} />
          <AdminFormField label="Достижения — EN" name="achievements_en" type="textarea" rows={3} register={register} />
          <AdminFormField label="Достижения — UZ" name="achievements_uz" type="textarea" rows={3} register={register} />

          {/* Фотогалерея кружка */}
          <AdminImageUpload
            label="Фотографии кружка (можно выбрать несколько)"
            storageFolder="clubs"
            multiple
            onUpload={() => {}}
            onMultiUpload={(urls) => setGallery((prev) => [...prev, ...urls])}
          />
          {gallery.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {gallery.map((url) => (
                <div key={url} style={{ position: 'relative' }}>
                  <img src={url} alt="" style={{ width: 78, height: 78, objectFit: 'cover', borderRadius: '0.7rem', border: '1px solid var(--color-border)' }} />
                  <button
                    type="button"
                    onClick={() => setGallery((prev) => prev.filter((u) => u !== url))}
                    aria-label="Удалить фото"
                    style={{
                      position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%',
                      border: 'none', background: 'var(--color-vivid)', color: '#fff', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Практическая информация */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <AdminFormField label="Расписание RU" name="schedule_ru" register={register} placeholder="Пн, Ср — 15:00" />
          <AdminFormField label="Расписание EN" name="schedule_en" register={register} />
          <AdminFormField label="Расписание UZ" name="schedule_uz" register={register} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <AdminFormField label="Участников" name="members_count" type="number" register={register} />
          <AdminFormField label="Руководитель" name="teacher_lead" register={register} />
          <AdminFormField label="Кабинет" name="room" register={register} placeholder="каб. 24" />
        </div>

        <div>
          <AdminFormField
            label="Иконка Lucide (напр. Rocket, Atom, Music)"
            name="icon_name"
            register={register}
            placeholder="Rocket"
          />
          {iconName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '-0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Предпросмотр: <IconPreview name={iconName} />
            </div>
          )}
        </div>
      </AdminModal>
    </div>
  );
}
