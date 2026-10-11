import React from 'react';

/**
 * SubjectCard — mirrors the visual language of DepartmentCard:
 * white card, primary accent on selection, subtle border/shadow.
 *
 * Props:
 *   subject  { id, title, year, studentCount, lastMarkedDate }
 *   onClick  () => void
 */
export default function SubjectCard({ subject, onClick }) {
  const neverMarked = subject.lastMarkedDate == null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 outline-none bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/40 hover:shadow-sm w-full"
    >
      {/* Top row: icon + year badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent group-hover:bg-primary group-hover:text-white transition-colors">
          <BookIcon />
        </div>
        <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-ink-muted dark:text-slate-400">
          Year {subject.year}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-sm sm:text-base font-semibold text-ink dark:text-white leading-snug mb-1">
        {subject.title}
      </h3>

      {/* Meta */}
      <div className="mt-2 flex flex-col gap-1">
        <p className="text-xs text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
          <UsersIcon />
          {subject.studentCount} student{subject.studentCount !== 1 ? 's' : ''}
        </p>
        <p
          className={`text-xs flex items-center gap-1.5 ${
            neverMarked
              ? 'text-warning dark:text-amber-400'
              : 'text-ink-muted dark:text-slate-400'
          }`}
        >
          <CalendarIcon />
          {neverMarked ? 'Never marked' : `Last marked: ${subject.lastMarkedDate}`}
        </p>
      </div>

      {/* Hover chevron */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary dark:text-accent">
        <ChevronRightIcon />
      </div>
    </button>
  );
}

function BookIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
