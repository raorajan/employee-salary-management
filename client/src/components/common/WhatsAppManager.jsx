import React from 'react';
import WhatsAppStatusCard from './WhatsAppStatusCard';

export default function WhatsAppManager({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-bold dark:text-white">WhatsApp Manager</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="p-4">
            <WhatsAppStatusCard />
        </div>
      </div>
    </div>
  );
}
