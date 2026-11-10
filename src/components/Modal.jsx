import { useEffect, useRef } from 'react';
import Icon from './Icon';

export function Modal({ title, onClose, children, wide = false }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    panelRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        className={`modal__panel${wide ? ' modal__panel--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <h2 className="modal__title">{title}</h2>
      <p className="modal__text">{message}</p>
      <div className="modal__actions">
        <button type="button" className="btn btn--danger" onClick={onConfirm}>
          <Icon name="trash" size={16} />
          {confirmLabel}
        </button>
        <button type="button" className="btn btn--outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
