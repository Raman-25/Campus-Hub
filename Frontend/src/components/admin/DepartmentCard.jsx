import React from 'react';

function DepartmentIcon({ code, className = 'w-6 h-6' }) {
  switch (code) {
    case 'COMPUTER_SCIENCE':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <polyline points="7 8 10 11 7 14" />
          <line x1="13" y1="14" x2="17" y2="14" />
        </svg>
      );
    case 'ELECTRONICS':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="2" />
          <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
        </svg>
      );
    case 'MECHANICAL':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'CIVIL':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
        </svg>
      );
    case 'ELECTRICAL':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}

export default function DepartmentCard({ department, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(department.code)}
      aria-pressed={isSelected}
      className={`group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 outline-none
        ${
          isSelected
            ? 'bg-white dark:bg-slate-900 border-2 border-primary shadow-sm ring-2 ring-primary/20 dark:ring-primary/40'
            : 'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
        }`}
    >
      <div className="flex items-center justify-between w-full mb-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors
            ${
              isSelected
                ? 'bg-primary text-white shadow-sm'
                : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent group-hover:bg-primary group-hover:text-white'
            }`}
        >
          <DepartmentIcon code={department.code} className="w-5 h-5" />
        </div>
        <span
          className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full
            ${
              isSelected
                ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-accent font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-ink-muted dark:text-slate-400'
            }`}
        >
          {department.shortCode}
        </span>
      </div>

      <div>
        <h3 className="font-display text-sm sm:text-base font-semibold text-ink dark:text-white leading-snug">
          {department.name}
        </h3>
        <p className="mt-1 text-xs text-ink-muted dark:text-slate-400 line-clamp-2 leading-relaxed">
          {department.description}
        </p>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
      )}
    </button>
  );
}
