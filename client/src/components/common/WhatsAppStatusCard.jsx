import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export default function WhatsAppStatusCard({ className = "" }) {
  const [status, setStatus] = useState('INITIALIZING');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await api.get('/whatsapp/status');
      setStatus(response.status);
      setError(null);
      
      if (response.status === 'QR') {
        const qrResponse = await api.get('/whatsapp/qr');
        setQrCode(qrResponse.qr);
      } else {
        setQrCode(null);
      }
      setLoading(false);
    } catch (err) {

      console.error('WhatsApp status polling failed:', err);
      // Support both {error: ...} and {message: ...} from backend
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to connect to server';
      setError(errorMsg);
    }
  }, []);



  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleLogout = async () => {
    if (!window.confirm('Disconnect WhatsApp? You will need to scan again.')) return;
    try {
      setLoading(true);
      await api.post('/whatsapp/logout');
      setStatus('DISCONNECTED');
      setQrCode(null);
    } catch (err) {
      setError('Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'READY' || status === 'AUTHENTICATED') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/30 p-4 sm:p-5 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.341-4.444 9.814-9.885 9.815M12 2C6.41 2 2.01 6.36 2 11.83a10.03 10.03 0 001.53 5.37L2 22l4.89-1.28a9.8 9.8 0 005.11 1.43c5.526 0 9.998-4.464 10-10 .002-2.712-1.05-5.263-2.96-7.17C17.13 3.06 14.58 2 12 2z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">WhatsApp Connected</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Ready to send automated messages</div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="text-[11px] font-bold text-red-500 uppercase tracking-tight hover:underline"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="bg-indigo-600 px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp Status</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full animate-pulse ${status === 'QR' ? 'bg-amber-400' : 'bg-white/50'}`} />
          <span className="text-[10px] text-white/90 font-bold uppercase">{status}</span>
        </span>
      </div>
      
      <div className="p-5 flex flex-col items-center gap-4">
        {error && (
          <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-[11px] font-bold text-center flex flex-col gap-2">
            <span>{error}</span>
            <button onClick={fetchStatus} className="underline uppercase tracking-tighter">Try Again</button>
          </div>
        )}

        {status === 'QR' && qrCode ? (

          <>
            <div className="bg-white p-2 rounded-lg shadow-inner border border-gray-100">
              <img src={qrCode} alt="WhatsApp QR" className="w-48 h-48" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Scan this QR Code</h4>
              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-tight">Open WhatsApp on your phone to link</p>
            </div>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none">Initializing Service...</p>
          </div>
        )}
      </div>
    </div>
  );
}
