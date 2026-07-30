import { useState } from 'react';
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

const columns = [
  {
    key: 'photo_url',
    label: 'Фото',
    render: (row) => row.photo_url
      ? <img src={row.photo_url} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '50%' }} />
      : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-border)' }} />,
  },
  { key: 'name_ru',        label: 'Имя (RU)' },
  { key: 'achievement_ru', label: 'Достижение' },
  { key: 'year',           label: 'Год' },
  { key: 'category',       label: 'Категория' },
];

export default function AdminAchievers() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  const { data = [], isLoading } = useFirestoreCollection('achievers', {
    orderByField: 'year', direction: 'desc',
    queryOptions: { staleTime: 0 },
  });

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => {
    setEditItem(null); setPhotoUrl(''); reset({ year: new Date().getFullYear() }); setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item); setPhotoUrl(item.photo_url || ''); reset(item); setModalOpen(true);
  };

  const onSave = handleSubmit(async (data) => {
    setSaving(true);
    try {
      const payload = { ...data, photo_url: photoUrl, year: Number(data.year || 0) };
      if (editItem) {
        await updateDoc(doc(db, 'achievers', editItem.id), payload);
        toast.success('Запись обновлена');
      } else {
        await addDoc(collection(db, 'achievers'), payload);
        toast.success('Запись добавлена');
      }
      queryClient.invalidateQueries({ queryKey: ['achievers'] });
      setModalOpen(false);
    } catch { toast.error('Ошибка сохранения'); }
    finally { setSaving(false); }
  });

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'achievers', id));
      queryClient.invalidateQueries({ queryKey: ['achievers'] });
      toast.success('Запись удалена');
    } catch { toast.error('Ошибка удаления'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Гордость школы</h2>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--color-primary)', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Добавить
        </button>
      </div>

      <AdminTable columns={columns} data={data} loading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Редактировать' : 'Добавить достижение'} onSave={onSave} saving={saving}>
        <AdminImageUpload label="Фото" storageFolder="achievers" currentUrl={photoUrl} onUpload={setPhotoUrl} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <AdminFormField label="Имя RU" name="name_ru" register={register} />
          <AdminFormField label="Имя EN" name="name_en" register={register} />
          <AdminFormField label="Имя UZ" name="name_uz" register={register} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <AdminFormField label="Достижение RU" name="achievement_ru" register={register} />
          <AdminFormField label="Достижение EN" name="achievement_en" register={register} />
          <AdminFormField label="Достижение UZ" name="achievement_uz" register={register} />
        </div>
        <AdminFormField label="Описание RU" name="description_ru" type="textarea" rows={3} register={register} />
        <AdminFormField label="Описание EN" name="description_en" type="textarea" rows={2} register={register} />
        <AdminFormField label="Описание UZ" name="description_uz" type="textarea" rows={2} register={register} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <AdminFormField label="Год" name="year" type="number" register={register} />
          <AdminFormField label="Категория" name="category" register={register} placeholder="Олимпиада, Спорт..." />
        </div>
      </AdminModal>
    </div>
  );
}
