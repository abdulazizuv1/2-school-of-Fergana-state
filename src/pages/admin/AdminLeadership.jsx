import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { Plus, GripVertical, Trash2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db } from '@/firebase/config';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import AdminModal from '@/components/admin/AdminModal';
import AdminFormField from '@/components/admin/AdminFormField';
import AdminImageUpload from '@/components/admin/AdminImageUpload';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';

function SortableRow({ item, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <tr ref={setNodeRef} style={{ ...style, transition: 'background 150ms' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-raised)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', cursor: 'grab' }}
        {...attributes} {...listeners}
      >
        <GripVertical size={16} color="var(--color-text-muted)" />
      </td>
      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
        {item.photo_url
          ? <img src={item.photo_url} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '50%' }} />
          : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-border)' }} />}
      </td>
      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem', fontWeight: 500 }}>{item.name_ru || '—'}</td>
      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{item.position_ru || '—'}</td>
      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{item.order ?? '—'}</td>
      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', textAlign: 'right', whiteSpace: 'nowrap' }}>
        <button onClick={() => onEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', color: 'var(--color-primary-light)' }} title="Редактировать">
          <Pencil size={16} />
        </button>
        <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', color: 'var(--color-vivid)', marginLeft: '0.25rem' }} title="Удалить">
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}

export default function AdminLeadership() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [localOrder, setLocalOrder] = useState(null);

  const { data = [], isLoading } = useFirestoreCollection('leadership', {
    orderByField: 'order', direction: 'asc',
    queryOptions: { staleTime: 0 },
  });

  const items = localOrder || data;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setLocalOrder(reordered);
    const batch = writeBatch(db);
    reordered.forEach((item, idx) => batch.update(doc(db, 'leadership', item.id), { order: idx + 1 }));
    await batch.commit();
    queryClient.invalidateQueries({ queryKey: ['leadership'] });
    setLocalOrder(null);
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openAdd = () => {
    setEditItem(null); setPhotoUrl('');
    reset({ order: (data.length + 1) });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item); setPhotoUrl(item.photo_url || '');
    reset(item); setModalOpen(true);
  };

  const onSave = handleSubmit(async (formData) => {
    setSaving(true);
    try {
      const payload = { ...formData, photo_url: photoUrl, order: Number(formData.order || 0) };
      if (editItem) {
        await updateDoc(doc(db, 'leadership', editItem.id), payload);
        toast.success('Запись обновлена');
      } else {
        await addDoc(collection(db, 'leadership'), payload);
        toast.success('Запись добавлена');
      }
      queryClient.invalidateQueries({ queryKey: ['leadership'] });
      setModalOpen(false);
    } catch { toast.error('Ошибка сохранения'); }
    finally { setSaving(false); }
  });

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'leadership', id));
      queryClient.invalidateQueries({ queryKey: ['leadership'] });
      toast.success('Запись удалена');
    } catch { toast.error('Ошибка удаления'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Руководство</h2>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--color-primary)', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Добавить
        </button>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '1rem', border: '1px solid var(--color-border)', background: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-raised)' }}>
              {['', 'Фото', 'Имя (RU)', 'Должность (RU)', 'Порядок', 'Действия'].map((h) => (
                <th key={h} style={{ textAlign: h === 'Действия' ? 'right' : 'left', padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', borderBottom: '2px solid var(--color-border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <tbody>
                {items.map((item) => (
                  <SortableRow key={item.id} item={item} onEdit={openEdit} onDelete={setConfirmId} />
                ))}
              </tbody>
            </SortableContext>
          </DndContext>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Редактировать' : 'Добавить'} onSave={onSave} saving={saving}>
        <AdminImageUpload label="Фото" storageFolder="leadership" currentUrl={photoUrl} onUpload={setPhotoUrl} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <AdminFormField label="Имя RU" name="name_ru" register={register} />
          <AdminFormField label="Имя EN" name="name_en" register={register} />
          <AdminFormField label="Имя UZ" name="name_uz" register={register} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <AdminFormField label="Должность RU" name="position_ru" register={register} />
          <AdminFormField label="Должность EN" name="position_en" register={register} />
          <AdminFormField label="Должность UZ" name="position_uz" register={register} />
        </div>
        <AdminFormField label="Обращение RU" name="message_ru" type="textarea" rows={3} register={register} />
        <AdminFormField label="Обращение EN" name="message_en" type="textarea" rows={2} register={register} />
        <AdminFormField label="Обращение UZ" name="message_uz" type="textarea" rows={2} register={register} />
        <AdminFormField label="Порядок" name="order" type="number" register={register} />
      </AdminModal>

      <AdminConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={() => onDelete(confirmId)} />
    </div>
  );
}
