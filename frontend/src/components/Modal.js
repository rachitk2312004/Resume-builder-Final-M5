import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer, size = 'md', fullscreen = false }) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  
  useEffect(() => {
    let timeoutId;
    if (open) {
      setMounted(true);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      // next tick to enable transition
      timeoutId = setTimeout(() => setShown(true), 10);
    } else {
      // Re-enable background scrolling
      document.body.style.overflow = 'unset';
      // start hide animation then unmount after duration
      setShown(false);
      timeoutId = setTimeout(() => setMounted(false), 200);
    }
    return () => {
      clearTimeout(timeoutId);
      // Cleanup: ensure scrolling is re-enabled
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const sizeClasses = fullscreen
    ? 'w-full h-full'
    : size === 'lg' ? 'w-full max-w-3xl' : size === 'xl' ? 'w-full max-w-5xl' : 'w-full max-w-md';

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  if (!mounted) return null;

  return (
    <div
      className={`modal-overlay transition-opacity duration-150 ${shown ? 'opacity-100' : 'opacity-0'} p-4`}
      onMouseDown={handleBackdrop}
    >
      <div
        className={`modal-container ${shown ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${sizeClasses} ${fullscreen ? 'h-full' : 'max-h-[80vh]'}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="modal-header">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="modal-body">
          {children}
        </div>
        
        {/* Fixed Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}


