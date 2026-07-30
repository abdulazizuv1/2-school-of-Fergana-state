import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { db } from '@/firebase/config';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminFormField from '@/components/admin/AdminFormField';
import AdminImageUpload from '@/components/admin/AdminImageUpload';

const CATEGORIES = [
  { value: 'announcements', label: 'Объявления' },
  { value: 'sport',        label: 'Спорт' },
  { value: 'academic',     label: 'Академическое' },
  { value: 'events',       label: 'Мероприятия' },
];

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 80);
}

const columns = [
  {
    key: 'photo_url',
    label: 'Фото',
    render: (row) => row.photo_url
      ? <img src={row.photo_url} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '0.5rem' }} />
      : <div style={{ width: 44, height: 44, borderRadius: '0.5rem', background: 'var(--color-border)' }} />,
  },
  { key: 'title_ru', label: 'Заголовок (RU)' },
  { key: 'category', label: 'Категория' },
  { key: 'date', label: 'Дата', render: (row) => row.date ? new Date(row.date).toLocaleDateString('ru-RU') : '—' },
  { key: 'views', label: 'Просмотры' },
];

export default function AdminNews() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  const { data = [], isLoading } = useFirestoreCollection('news', {
    orderByField: 'date', direction: 'desc',
    queryOptions: { staleTime: 0 },
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const titleRu = watch('title_ru', '');

  useEffect(() => {
    if (!editItem && titleRu) {
      setValue('slug', slugify(titleRu));
    }
  }, [titleRu, editItem, setValue]);

  const openAdd = () => {
    setEditItem(null);
    setPhotoUrl('');
    reset({ category: 'announcements' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setPhotoUrl(item.photo_url || '');
    reset(item);
    setModalOpen(true);
  };

  const onSave = handleSubmit(async (data) => {
    setSaving(true);
    try {
      const payload = { ...data, photo_url: photoUrl };
      if (editItem) {
        await updateDoc(doc(db, 'news', editItem.id), payload);
        toast.success('Новость обновлена');
      } else {
        await addDoc(collection(db, 'news'), { ...payload, date: new Date().toISOString(), views: 0 });
        toast.success('Новость добавлена');
      }
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setModalOpen(false);
    } catch (err) {
      toast.error('Ошибка сохранения');
      console.error(err);
    } finally {
      setSaving(false);
    }
  });

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'news', id));
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Новость удалена');
    } catch (err) {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Новости</h2>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-pill)',
            border: 'none', background: 'var(--color-primary)', color: 'white',
            fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Добавить новость
        </button>
      </div>

      <AdminTable columns={columns} data={data} loading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Редактировать новость' : 'Добавить новость'} onSave={onSave} saving={saving}>
        <AdminImageUpload label="Фото" storageFolder="news" currentUrl={photoUrl} onUpload={setPhotoUrl} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <AdminFormField label="Заголовок RU" name="title_ru" register={register} error={errors.title_ru?.message} />
          <AdminFormField label="Заголовок EN" name="title_en" register={register} />
          <AdminFormField label="Заголовок UZ" name="title_uz" register={register} />
        </div>
        <AdminFormField label="Slug" name="slug" register={register} placeholder="avto-zagolovok" />
        <AdminFormField label="Категория" name="category" type="select" register={register} options={CATEGORIES} />
        <AdminFormField label="Содержание RU" name="content_ru" type="textarea" rows={5} register={register} />
        <AdminFormField label="Содержание EN" name="content_en" type="textarea" rows={3} register={register} />
        <AdminFormField label="Содержание UZ" name="content_uz" type="textarea" rows={3} register={register} />
      </AdminModal>
    </div>
  );
}
