import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>
      <div 
        className="relative bg-surface border border-border w-full max-w-md p-8 rounded-[4px] shadow-2xl"
        style={{ animation: 'fadeIn 200ms ease-out' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-[24px]">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl leading-none">&times;</button>
        </div>
        <hr className="border-t border-border mb-6" />
        {children}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
