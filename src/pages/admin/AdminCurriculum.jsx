import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { db } from '@/firebase/config';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminFormField from '@/components/admin/AdminFormField';
import AdminImageUpload from '@/components/admin/AdminImageUpload';

const columns = [
  { key: 'grade',       label: 'Класс', render: (row) => `${row.grade}-й класс` },
  { key: 'subjects_ru', label: 'Предметов', render: (row) => Array.isArray(row.subjects_ru) ? `${row.subjects_ru.length} пред.` : '—' },
  {
    key: 'pdf_url',
    label: 'PDF',
    render: (row) => row.pdf_url
      ? <a href={row.pdf_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-primary-light)', fontSize: '0.8rem' }}><FileText size={14} /> Открыть</a>
      : '—',
  },
];

export default function AdminCurriculum() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const { data = [], isLoading } = useFirestoreCollection('curriculum', {
    orderByField: 'grade', direction: 'asc',
    queryOptions: { staleTime: 0 },
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const openAdd = () => {
    setEditItem(null); setPdfUrl(''); reset(); setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item); setPdfUrl(item.pdf_url || '');
    reset({
      ...item,
      subjects_ru: Array.isArray(item.subjects_ru) ? item.subjects_ru.join('\n') : '',
      subjects_en: Array.isArray(item.subjects_en) ? item.subjects_en.join('\n') : '',
      subjects_uz: Array.isArray(item.subjects_uz) ? item.subjects_uz.join('\n') : '',
    });
    setModalOpen(true);
  };

  const onSave = handleSubmit(async (data) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        grade: Number(data.grade || 0),
        pdf_url: pdfUrl,
        subjects_ru: (data.subjects_ru || '').split('\n').map(s => s.trim()).filter(Boolean),
        subjects_en: (data.subjects_en || '').split('\n').map(s => s.trim()).filter(Boolean),
        subjects_uz: (data.subjects_uz || '').split('\n').map(s => s.trim()).filter(Boolean),
      };
      if (editItem) {
        await updateDoc(doc(db, 'curriculum', editItem.id), payload);
        toast.success('Обновлено');
      } else {
        await addDoc(collection(db, 'curriculum'), payload);
        toast.success('Добавлено');
      }
      queryClient.invalidateQueries({ queryKey: ['curriculum'] });
      setModalOpen(false);
    } catch { toast.error('Ошибка сохранения'); }
    finally { setSaving(false); }
  });

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'curriculum', id));
      queryClient.invalidateQueries({ queryKey: ['curriculum'] });
      toast.success('Удалено');
    } catch { toast.error('Ошибка удаления'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Учебный план</h2>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--color-primary)', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Добавить класс
        </button>
      </div>

      <AdminTable columns={columns} data={data} loading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Редактировать класс' : 'Добавить класс'} onSave={onSave} saving={saving}>
        <AdminFormField label="Класс (1–11)" name="grade" type="number" register={register} placeholder="7" />
        <AdminFormField label="Предметы RU (по одному на строку)" name="subjects_ru" type="textarea" rows={5} register={register} placeholder={"Математика\nФизика\nХимия"} />
        <AdminFormField label="Предметы EN" name="subjects_en" type="textarea" rows={3} register={register} />
        <AdminFormField label="Предметы UZ" name="subjects_uz" type="textarea" rows={3} register={register} />
        <AdminImageUpload label="PDF учебного плана" storageFolder="curriculum" accept=".pdf" currentUrl={pdfUrl} onUpload={setPdfUrl} />
      </AdminModal>
    </div>
  );
}
