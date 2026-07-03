import { useEffect, useCallback } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ImageLightbox
 * @param {string|null}   src        - URL of the image to show. Pass null/undefined to hide.
 * @param {string[]}      [gallery]  - Optional array of URLs for arrow navigation.
 * @param {number}        [index]    - Current index in the gallery.
 * @param {function}      onClose    - Called when the lightbox should close.
 * @param {function}      [onPrev]   - Called to navigate to the previous image.
 * @param {function}      [onNext]   - Called to navigate to the next image.
 */
export function ImageLightbox({ src, gallery = [], index = 0, onClose, onPrev, onNext }) {
  const hasMultiple = gallery.length > 1;

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape')     onClose();
    if (e.key === 'ArrowLeft'  && onPrev) onPrev();
    if (e.key === 'ArrowRight' && onNext) onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (!src) return;
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [src, handleKey]);

  if (!src) return null;

  const filename = src.split('/').pop().split('?')[0] || 'attachment';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {/* Stop propagation on the content so clicking the image doesn't close */}
      <div
        className="relative flex flex-col items-center max-w-[90vw] max-h-[90vh]"
        style={{ animation: 'lb-in 0.18s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-between px-1">
          <span className="text-white/60 text-xs truncate max-w-[60vw]">{filename}</span>
          <div className="flex items-center gap-2">
            {hasMultiple && (
              <span className="text-white/50 text-xs">{index + 1} / {gallery.length}</span>
            )}
            <a
              href={src}
              download={filename}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              title="Download"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={16} />
            </a>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Image */}
        <img
          src={src}
          alt="Attachment preview"
          className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl select-none"
          draggable={false}
        />

        {/* Prev / Next arrows */}
        {hasMultiple && onPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-[-52px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {hasMultiple && onNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-[-52px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes lb-in {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
