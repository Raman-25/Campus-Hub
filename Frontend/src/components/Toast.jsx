import { useEffect } from 'react';

/**
 * Toast
 * A single dismissible/self-clearing notification.
 * `toast` shape: { type: 'success' | 'error', message: string }
 */
export default function Toast({ toast, onClear }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClear, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClear]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div
      role="status"
      aria-live="assertive"
      className={`fixed top-5 right-5 z-50 flex items-start gap-3 rounded-xl border px-4 py-3 shadow-card animate-riseIn max-w-sm
        ${
          isError
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}
    >
      <span className="text-sm font-medium leading-snug">{toast.message}</span>
      <button
        type="button"
        onClick={onClear}
        aria-label="Dismiss notification"
        className="ml-auto text-current opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
