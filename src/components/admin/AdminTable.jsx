import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import AdminConfirmDialog from './AdminConfirmDialog';

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <td key={i} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{
            height: 14,
            borderRadius: 7,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            width: i === 0 ? '40%' : '70%',
          }} />
        </td>
      ))}
    </tr>
  );
}

export default function AdminTable({ columns, data = [], onEdit, onDelete, loading }) {
  const [confirmId, setConfirmId] = useState(null);

  return (
    <>
      <style>{`@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>

      <div style={{ overflowX: 'auto', borderRadius: '1rem', border: '1px solid var(--color-border)', background: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-raised)' }}>
              {columns.map((col) => (
                <th key={col.key} style={{
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-muted)',
                  borderBottom: '2px solid var(--color-border)',
                  whiteSpace: 'nowrap',
                }}>
                  {col.label}
                </th>
              ))}
              <th style={{
                textAlign: 'right',
                padding: '0.75rem 1rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-text-muted)',
                borderBottom: '2px solid var(--color-border)',
              }}>
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)
              : data.map((row) => (
                <tr key={row.id} style={{ transition: 'background 150ms' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-raised)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                      {col.render ? col.render(row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => onEdit(row)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', borderRadius: '0.5rem', color: 'var(--color-primary-light)', transition: 'background 150ms' }}
                      title="Редактировать"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmId(row.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', borderRadius: '0.5rem', color: 'var(--color-vivid)', transition: 'background 150ms', marginLeft: '0.25rem' }}
                      title="Удалить"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <AdminConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => onDelete(confirmId)}
        description="Запись будет удалена без возможности восстановления."
      />
    </>
  );
}
