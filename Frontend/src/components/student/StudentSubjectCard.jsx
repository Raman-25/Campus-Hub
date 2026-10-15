import React from 'react';
import { GradeBadge, AttendanceBar } from './StudentUI';

/**
 * StudentSubjectCard — displayed in the "My Subjects" grid (5 per row desktop).
 * Theme-aware design matching the professor/admin dashboard cards.
 *
 * Props:
 *   subject  { id, title, professorName, attendance, grade }
 *   onClick  () => void
 */
export default function StudentSubjectCard({ subject, onClick }) {
  const { title, professorName, attendance, grade } = subject;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl p-4 text-left transition-all duration-200 outline-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/40 hover:shadow-md dark:hover:shadow-blue-900/20 w-full"
    >
      {/* Title */}
      <h3 className="font-display text-sm font-bold text-ink dark:text-white leading-snug mb-0.5 pr-8">
        {title}
      </h3>

      {/* Professor */}
      <p className="text-[11px] text-ink-muted dark:text-slate-400 mb-3 leading-tight">
        {professorName ?? 'Unassigned'}
      </p>

      {/* Attendance row */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
            Attendance
          </span>
          <div className="flex items-center gap-1.5">
            {attendance != null && (
              <span
                className={`text-xs font-bold tabular-nums ${
                  attendance >= 75
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : attendance >= 50
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-danger dark:text-red-400'
                }`}
              >
                {attendance}%
              </span>
            )}
            <GradeBadge grade={grade} size="sm" />
          </div>
        </div>
        <AttendanceBar value={attendance} showLabel={false} />
      </div>

      {/* Hover chevron */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary dark:text-accent">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  );
}
