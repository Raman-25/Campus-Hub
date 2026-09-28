import React from 'react';
import { YEARS } from '../../constants/academic';

export default function YearPills({ selectedYear, onSelectYear, disabled = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
          Academic Year:
        </span>
        <div
          role="radiogroup"
          aria-label="Filter by academic year"
          className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1"
        >
          {YEARS.map((year) => {
            const isSelected = selectedYear === year.value;
            return (
              <button
                key={year.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={disabled}
                onClick={() => onSelectYear(year.value)}
                className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 outline-none
                  ${
                    disabled
                      ? 'opacity-40 cursor-not-allowed text-ink-muted dark:text-slate-500'
                      : isSelected
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-ink-muted dark:text-slate-300 hover:text-ink dark:hover:text-white'
                  }`}
              >
                {year.label}
              </button>
            );
          })}
        </div>
      </div>

      {disabled && (
        <span className="text-xs text-ink-faint dark:text-slate-500 italic">
          (Year filter does not apply to professors)
        </span>
      )}
    </div>
  );
}
