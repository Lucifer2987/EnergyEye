import { X } from 'lucide-react';
import { useEffect } from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else        document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className={`modal-box modal--${size}`} onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h2 className='modal-title'>{title}</h2>
          <button className='modal-close-btn' onClick={onClose}><X size={18} /></button>
        </div>
        <div className='modal-body'>{children}</div>
        {footer && <div className='modal-footer'>{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
