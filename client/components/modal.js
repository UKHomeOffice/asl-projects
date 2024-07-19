import React, {createRef, useEffect} from 'react';

export default function Modal({ onClose, children, className }) {
  useEffect(() => {
    const keydownHandler = e => {
      const listener = keyListeners.get(e.key);
      return listener && listener(e);
    };
    document.getElementsByTagName('html')[0].classList.add('modal-open');
    document.addEventListener('keydown', keydownHandler);

    return () => {
      document.getElementsByTagName('html')[0].classList.remove('modal-open');
      document.removeEventListener('keydown', keydownHandler);
    };
  });

  const modalRef = createRef();
  const handleTabKey = e => {
    const focusableElements = modalRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      return e.preventDefault();
    }

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      return e.preventDefault();
    }
  };

  const keyListeners = new Map([
    ['Escape', onClose],
    ['Tab', handleTabKey]
  ]);

  const close = e => {
    if (e.target.className === 'modal') {
      onClose(e);
    }
  };

  return (
    <div className={className ?? 'modal'} onClick={close}>
      <div className="modal-content" ref={modalRef}>
        {children}
      </div>
    </div>
  );
}
