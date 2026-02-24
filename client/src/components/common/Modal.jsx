import React, { useEffect } from 'react';

export default function Modal({ title, children, onClose, onConfirm, confirmLabel = 'Confirm', confirmClass = 'bg-indigo-600 hover:bg-indigo-700' }) {
  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-5 sm:p-6 mx-3">
        {title && <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100 mb-3">{title}</h3>}
        <div className="text-gray-600 dark:text-gray-300 text-sm mb-5 sm:mb-6">{children}</div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px] sm:min-h-0 text-sm font-medium"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2.5 sm:py-2 rounded-lg text-white transition-colors min-h-[44px] sm:min-h-0 text-sm font-medium ${confirmClass}`}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
