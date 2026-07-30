import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, Trash2, FileText } from 'lucide-react';
import { storage } from '@/firebase/config';

export default function AdminImageUpload({
  onUpload,
  currentUrl = '',
  label = 'Фото',
  accept = 'image/*',
  storageFolder = 'uploads',
  multiple = false,
  onMultiUpload,
}) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadFile = (file) =>
    new Promise((resolve, reject) => {
      const storageRef = ref(storage, `${storageFolder}/${Date.now()}_${file.name}`);
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        'state_changed',
        (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        }
      );
    });

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    setProgress(0);
    try {
      if (multiple && onMultiUpload) {
        const urls = [];
        for (const file of Array.from(files)) {
          const url = await uploadFile(file);
          urls.push(url);
        }
        onMultiUpload(urls);
      } else {
        const url = await uploadFile(files[0]);
        onUpload(url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // Картинку показываем миниатюрой, любой другой файл (pdf, docx, xlsx…) — карточкой
  const isImage = accept.startsWith('image');

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>

      {/* Current preview */}
      {currentUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          {isImage ? (
            <img src={currentUrl} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '0.75rem', border: '1px solid var(--color-border)' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <FileText size={16} />
              <span>Файл загружен</span>
              <a href={currentUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-light)', marginLeft: '0.25rem' }}>Открыть</a>
            </div>
          )}
          <button
            type="button"
            onClick={() => onUpload('')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', border: '1px solid var(--color-vivid)', borderRadius: '0.5rem', background: 'transparent', color: 'var(--color-vivid)', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            <Trash2 size={13} /> Удалить
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragOver ? 'var(--color-primary-light)' : 'var(--color-border)'}`,
          borderRadius: '0.75rem',
          padding: '1.25rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? 'rgba(61,90,254,0.04)' : 'transparent',
          transition: 'all 200ms',
        }}
      >
        <Upload size={22} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem' }} />
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {uploading ? `Загрузка... ${progress}%` : 'Перетащите файл или нажмите для выбора'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Progress bar */}
      {uploading && (
        <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, marginTop: '0.5rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-primary-light)', transition: 'width 150ms', borderRadius: 2 }} />
        </div>
      )}
    </div>
  );
}
