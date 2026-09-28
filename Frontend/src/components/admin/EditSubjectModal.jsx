import React, { useState, useEffect } from 'react';
import { DEPARTMENTS, YEARS, getDepartmentName } from '../../constants/academic';
import { adminApi, extractErrorMessage } from '../../services/api';

export default function EditSubjectModal({
  isOpen,
  subject,
  currentDepartmentCode,
  currentYear,
  onClose,
  onUpdateSuccess,
}) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && subject) {
      setTitle(subject.title || '');
      setDepartment(getDepartmentName(currentDepartmentCode) || DEPARTMENTS[0].name);
      setYear(currentYear || 1);
      setError('');
    }
  }, [isOpen, subject, currentDepartmentCode, currentYear]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !subject) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Subject title cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updated = await adminApi.updateSubject(subject.id, {
        title: title.trim(),
        department,
        year: Number(year),
      });

      onUpdateSuccess({
        id: subject.id,
        title: title.trim(),
        professorName: subject.professorName || 'Unassigned',
        department,
        year: Number(year),
      });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to update subject.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-subject-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => !loading && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-riseIn">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-accent">
              Curriculum Management
            </span>
            <h2 id="edit-subject-title" className="font-display text-lg font-semibold text-ink dark:text-white mt-0.5">
              Update Subject
            </h2>
            <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
              Edit course title, department, or academic year.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-ink-muted hover:text-ink dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div role="alert" className="my-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-3.5 py-2.5 text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-subject-title-input" className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-300">
              Subject Title <span className="text-danger">*</span>
            </label>
            <input
              id="edit-subject-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-ink dark:text-slate-100 placeholder:text-ink-faint focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-subject-dept" className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-300">
              Department <span className="text-danger">*</span>
            </label>
            <select
              id="edit-subject-dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-ink dark:text-slate-100 focus:outline-none focus:border-primary"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.name} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-subject-year" className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-300">
              Target Year <span className="text-danger">*</span>
            </label>
            <select
              id="edit-subject-year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-ink dark:text-slate-100 focus:outline-none focus:border-primary"
            >
              {YEARS.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-medium text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
