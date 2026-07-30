import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { db, storage } from '@/firebase/config';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import AdminImageUpload from '@/components/admin/AdminImageUpload';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';

const CATEGORIES = ['events', 'classes', 'sport', 'clubs'];
const catLabels = { events: 'Мероприятия', classes: 'Учёба', sport: 'Спорт', clubs: 'Клубы' };
const catColors = { events: '#3D5AFE', classes: '#06D6A0', sport: '#E8A020', clubs: '#E63946' };

function getStoragePathFromUrl(url) {
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/\/o\/(.+?)\?/);
    return match ? match[1] : null;
  } catch { return null; }
}

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const [uploadCategory, setUploadCategory] = useState('events');
  const [confirmItem, setConfirmItem] = useState(null);

  const { data: photos = [], isLoading } = useFirestoreCollection('gallery', {
    orderByField: 'uploadedAt', direction: 'desc',
    queryOptions: { staleTime: 0 },
  });

  const handleMultiUpload = async (urls) => {
    try {
      await Promise.all(urls.map((url) =>
        addDoc(collection(db, 'gallery'), { url, category: uploadCategory, uploadedAt: serverTimestamp() })
      ));
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success(`${urls.length} фото загружено`);
    } catch (err) {
      console.error('Firestore write error:', err);
      toast.error(`Ошибка сохранения: ${err.code || err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!confirmItem) return;
    try {
      await deleteDoc(doc(db, 'gallery', confirmItem.id));
      const storagePath = getStoragePathFromUrl(confirmItem.url);
      if (storagePath) {
        await deleteObject(ref(storage, storagePath)).catch(() => {});
      }
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Фото удалено');
    } catch { toast.error('Ошибка удаления'); }
    finally { setConfirmItem(null); }
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>Галерея</h2>

      {/* Upload panel */}
      <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: 'var(--shadow-card)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--color-text)' }}>Загрузить фото</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setUploadCategory(cat)}
              style={{
                padding: '0.4rem 1rem', borderRadius: 'var(--radius-pill)',
                border: '1px solid',
                borderColor: uploadCategory === cat ? catColors[cat] : 'var(--color-border)',
                background: uploadCategory === cat ? `${catColors[cat]}18` : 'transparent',
                color: uploadCategory === cat ? catColors[cat] : 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', cursor: 'pointer',
              }}
            >
              {catLabels[cat]}
            </button>
          ))}
        </div>
        <AdminImageUpload
          label={`Загрузить в категорию: ${catLabels[uploadCategory]}`}
          storageFolder={`gallery/${uploadCategory}`}
          multiple
          onUpload={() => {}}
          onMultiUpload={handleMultiUpload}
        />
      </div>

      {/* Photo grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: '0.75rem', background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', background: 'white', borderRadius: '1.25rem', border: '1px solid var(--color-border)' }}>
          Нет фотографий
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group"
              style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.75rem', overflow: 'hidden', cursor: 'pointer' }}
            >
              <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Category badge */}
              <div style={{
                position: 'absolute', top: '0.5rem', left: '0.5rem',
                padding: '0.2rem 0.5rem', borderRadius: '999px',
                background: `${catColors[photo.category] || '#888'}cc`,
                color: 'white', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.04em',
              }}>
                {catLabels[photo.category] || photo.category}
              </div>
              {/* Delete button */}
              <button
                onClick={() => setConfirmItem(photo)}
                style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(230,57,70,0.9)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', opacity: 0, transition: 'opacity 200ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = 0; }}
                title="Удалить"
              >
                <Trash2 size={14} color="white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AdminConfirmDialog
        open={!!confirmItem}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleDelete}
        description="Фото будет удалено из галереи и хранилища."
      />

      <style>{`@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>
    </div>
  );
}
