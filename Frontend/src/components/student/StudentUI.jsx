import React from 'react';

/**
 * GradeBadge — colour-coded pill for A/B/C/D/F.
 * Uses theme-aware background/text styles matching the professor/admin dashboards.
 */
export function GradeBadge({ grade, size = 'sm' }) {
  if (!grade)
    return <span className="text-ink-faint dark:text-slate-500 text-xs">—</span>;

  const colorMap = {
    A: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-500/20 dark:ring-emerald-500/30',
    B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-500/20 dark:ring-blue-500/30',
    C: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-500/20 dark:ring-amber-500/30',
    D: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 ring-1 ring-orange-500/20 dark:ring-orange-500/30',
    F: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-500/20 dark:ring-red-500/30',
  };
  const sizeMap = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-bold ${colorMap[grade] ?? 'bg-slate-100 text-ink-muted dark:bg-slate-800 dark:text-slate-300'} ${sizeMap[size]}`}
    >
      {grade}
    </span>
  );
}

/**
 * AttendanceBar — compact progress bar + percentage label.
 * Theme-aware track and label colors.
 */
export function AttendanceBar({ value, showLabel = true }) {
  if (value == null)
    return <span className="text-ink-faint dark:text-slate-500 text-xs">—</span>;

  const pct = Math.min(100, Math.max(0, value));
  const barColor =
    pct >= 75
      ? 'bg-emerald-500'
      : pct >= 50
      ? 'bg-amber-500'
      : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs tabular-nums text-ink dark:text-slate-200 w-8 shrink-0 text-right">
          {pct}%
        </span>
      )}
    </div>
  );
}

/**
 * StatusBadge — Present (green) / Absent (red) / No record.
 * Theme-aware light & dark mode styles.
 */
export function StatusBadge({ present }) {
  if (present === true)
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-500/20 dark:ring-emerald-500/30">
        Present
      </span>
    );
  if (present === false)
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-500/20 dark:ring-red-500/30">
        Absent
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-slate-100 text-ink-muted dark:bg-slate-800 dark:text-slate-400">
      No record
    </span>
  );
}

/**
 * MiniSpinner — inline loading indicator.
 */
export function MiniSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
