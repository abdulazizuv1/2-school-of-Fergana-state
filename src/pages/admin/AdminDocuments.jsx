import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, FileText, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { db } from '@/firebase/config';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminFormField from '@/components/admin/AdminFormField';
import AdminImageUpload from '@/components/admin/AdminImageUpload';

const DOC_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';

const columns = [
  { key: 'order', label: '№', render: (row) => row.order ?? '—' },
  { key: 'title_ru', label: 'Название (RU)' },
  {
    key: 'file_url',
    label: 'Файл',
    render: (row) => row.file_url
      ? <a href={row.file_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-primary-light)', fontSize: '0.8rem' }}><FileText size={14} /> Открыть <ExternalLink size={11} /></a>
      : <span style={{ color: 'var(--color-vivid)', fontSize: '0.8rem' }}>нет файла</span>,
  },
];

export default function AdminDocuments() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const { data = [], isLoading } = useFirestoreCollection('documents', {
    orderByField: 'order', direction: 'asc',
    queryOptions: { staleTime: 0 },
  });

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => {
    setEditItem(null);
    setFileUrl('');
    reset({ order: data.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setFileUrl(item.file_url || '');
    reset(item);
    setModalOpen(true);
  };

  const onSave = handleSubmit(async (formData) => {
    if (!fileUrl) {
      toast.error('Загрузите файл документа');
      return;
    }
    setSaving(true);
    try {
      // order пишем всегда: список читается через orderBy('order'),
      // а Firestore пропускает записи без этого поля.
      const payload = {
        ...formData,
        file_url: fileUrl,
        order: Number(formData.order || 0),
      };
      delete payload.id;

      if (editItem) {
        await updateDoc(doc(db, 'documents', editItem.id), payload);
        toast.success('Документ обновлён');
      } else {
        await addDoc(collection(db, 'documents'), payload);
        toast.success('Документ добавлен');
      }
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(`Ошибка сохранения: ${err.code || err.message}`);
    } finally {
      setSaving(false);
    }
  });

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'documents', id));
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Документ удалён');
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Документы</h2>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--color-primary)', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Добавить документ
        </button>
      </div>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '70ch' }}>
        Документы выводятся на странице «Документы» в порядке, указанном в поле «Порядок».
        Поддерживаются файлы PDF, Word и Excel — их можно скачать напрямую.
      </p>

      <AdminTable columns={columns} data={data} loading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Редактировать документ' : 'Добавить документ'}
        onSave={onSave}
        saving={saving}
      >
        <AdminImageUpload
          label="Файл документа (PDF / Word / Excel)"
          storageFolder="documents"
          accept={DOC_ACCEPT}
          currentUrl={fileUrl}
          onUpload={setFileUrl}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <AdminFormField label="Название RU" name="title_ru" register={register} />
          <AdminFormField label="Название EN" name="title_en" register={register} />
          <AdminFormField label="Название UZ" name="title_uz" register={register} />
        </div>

        <AdminFormField label="Описание RU" name="desc_ru" type="textarea" rows={3} register={register} />
        <AdminFormField label="Описание EN" name="desc_en" type="textarea" rows={2} register={register} />
        <AdminFormField label="Описание UZ" name="desc_uz" type="textarea" rows={2} register={register} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <AdminFormField label="Формат RU" name="meta_ru" register={register} placeholder="DOCX · Word · 2025" />
          <AdminFormField label="Формат EN" name="meta_en" register={register} />
          <AdminFormField label="Формат UZ" name="meta_uz" register={register} />
        </div>

        <AdminFormField label="Порядок" name="order" type="number" register={register} />
      </AdminModal>
    </div>
  );
}
