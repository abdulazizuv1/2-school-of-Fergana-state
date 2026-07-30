import { useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { ImageIcon } from 'lucide-react';

/**
 * Ленивая картинка с шиммером и жёстко заданным aspect-ratio (CLS = 0).
 *
 * Рамка НЕ меняет размер в зависимости от того, есть фото или нет:
 * контейнер всегда занимает 100% ширины родителя и заданное соотношение
 * сторон, а само изображение позиционируется абсолютно с object-fit: cover.
 */
export default function LazyImage({
  src,
  alt = '',
  className = '',
  aspectRatio = '16/9',
  priority = false,
  objectPosition = 'center',
  placeholderText = '',
  style = {},
}) {
  // Храним не «загружено да/нет», а какой именно src загрузился:
  // при смене src состояние сбрасывается само, без эффекта.
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);
  const imgRef = useRef(null);

  const loaded = Boolean(src) && loadedSrc === src;
  const failed = Boolean(src) && failedSrc === src;

  const { ref: inViewRef, inView } = useInView({ rootMargin: '200px', triggerOnce: true });
  const shouldLoad = priority || inView;

  const setRefs = (el) => {
    imgRef.current = el;
    inViewRef(el);
  };

  const hasImage = Boolean(src) && !failed;

  return (
    <div
      ref={setRefs}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        background: 'var(--color-bg-soft)',
        ...style,
      }}
    >
      {/* Шиммер — только пока реально грузится картинка */}
      {hasImage && !loaded && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #eef2f6 0%, #f8fafc 50%, #eef2f6 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.6s linear infinite',
          }}
        />
      )}

      {/* Заглушка — когда фото ещё не добавили */}
      {!hasImage && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(150deg, var(--color-primary-soft) 0%, var(--color-bg-soft) 100%)',
            color: 'var(--color-primary)',
          }}
        >
          {placeholderText ? (
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(1.4rem, 4cqw, 2.2rem)', opacity: 0.55, letterSpacing: '0.02em',
            }}>
              {placeholderText}
            </span>
          ) : (
            <ImageIcon size={26} strokeWidth={1.5} style={{ opacity: 0.4 }} />
          )}
        </div>
      )}

      {shouldLoad && hasImage && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 420ms ease',
          }}
        />
      )}
    </div>
  );
}
