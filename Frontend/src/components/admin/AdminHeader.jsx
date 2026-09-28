import React from 'react';

function CampusMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4 L29 10 L16 16 L3 10 Z" fill="currentColor" fillOpacity="0.95" />
      <path d="M9 13.5 V22 C9 24.5 12 26.5 16 26.5 C20 26.5 23 24.5 23 22 V13.5" stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.85" fill="none" />
      <line x1="27" y1="11" x2="27" y2="19" stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.85" />
    </svg>
  );
}

export default function AdminHeader({ onLogout, darkMode, onToggleDarkMode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <CampusMark />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold tracking-tight text-ink dark:text-white">
                CampusHub
              </span>
              <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/25 px-2.5 py-0.5 text-xs font-semibold text-primary dark:text-accent">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-ink-muted dark:text-slate-400 hidden sm:block">
              Central Management Portal
            </p>
          </div>
        </div>

        {/* Right Actions: Dark Mode + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-ink dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? '\u2600\ufe0f' : '\ud83c\udf19'}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm font-medium text-ink dark:text-slate-200 hover:bg-red-50 hover:text-danger hover:border-red-200 dark:hover:bg-red-950/30 dark:hover:border-red-900/50 dark:hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
