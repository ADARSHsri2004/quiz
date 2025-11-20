import React from 'react';
export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg mx-2 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}
