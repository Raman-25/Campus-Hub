import React, { useState, useEffect } from 'react';
import { adminApi, extractErrorMessage } from '../../services/api';

export default function AssignProfessorModal({
  isOpen,
  subject,
  departmentCode,
  departmentName,
  onClose,
  onAssignSuccess,
  onToast,
}) {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProfessorId, setSelectedProfessorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Fetch professors belonging to the SAME department
  useEffect(() => {
    if (!isOpen || !departmentCode) return;

    setSelectedProfessorId(null);
    setSearchQuery('');
    setError('');
    setLoading(true);

    adminApi
      .getProfessors(departmentCode)
      .then((data) => {
        setProfessors(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(extractErrorMessage(err, 'Failed to load professors for this department.'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, departmentCode]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen || !subject) return null;

  const filteredProfessors = professors.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (p.displayName || p.name || '').toLowerCase();
    return (
      name.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
    );
  });

  async function handleAssignSubmit(e) {
    e.preventDefault();
    if (!selectedProfessorId) return;

    setSubmitting(true);
    setError('');

    try {
      const updatedSubject = await adminApi.assignProfessor(subject.id, selectedProfessorId);
      const chosenProf = professors.find((p) => p.id === selectedProfessorId);
      const assignedName = chosenProf?.displayName || chosenProf?.name || 'Assigned';
      onAssignSuccess(
        updatedSubject || {
          id: subject.id,
          title: subject.title,
          professorName: assignedName,
        }
      );
      onClose();
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to assign professor to subject.');
      setError(msg);
      onToast?.({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => !submitting && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-riseIn">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-accent">
              Faculty Assignment
            </span>
            <h2 id="assign-modal-title" className="font-display text-lg font-semibold text-ink dark:text-white mt-0.5">
              Assign Professor
            </h2>
            <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
              Subject: <span className="font-medium text-ink dark:text-slate-200">{subject.title}</span> • Department: <span className="font-medium text-ink dark:text-slate-200">{departmentName}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
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

        {/* Search */}
        {!loading && professors.length > 4 && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search faculty by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2 text-xs text-ink dark:text-slate-100 placeholder:text-ink-faint focus:outline-none focus:border-primary"
            />
          </div>
        )}

        {/* Professor list */}
        <div className="my-4 max-h-64 overflow-y-auto pr-1 flex flex-col gap-2">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <svg className="h-6 w-6 animate-spin text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="mt-2 text-xs text-ink-muted dark:text-slate-400">Loading department professors...</p>
            </div>
          ) : professors.length === 0 ? (
            <div className="py-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
              <p className="text-sm font-medium text-ink dark:text-slate-200">No professors found in {departmentName}</p>
              <p className="mt-1 text-xs text-ink-muted dark:text-slate-400">
                Please register a professor in this department first to assign them.
              </p>
            </div>
          ) : filteredProfessors.length === 0 ? (
            <div className="py-6 text-center text-xs text-ink-muted dark:text-slate-400">
              No faculty match &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredProfessors.map((prof) => {
              const isSelected = selectedProfessorId === prof.id;
              const isCurrentlyAssigned =
                subject.professorName === prof.displayName ||
                subject.professorName === prof.name;

              return (
                <label
                  key={prof.id}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all duration-150
                    ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="professor_select"
                      value={prof.id}
                      checked={isSelected}
                      onChange={() => setSelectedProfessorId(prof.id)}
                      className="h-4 w-4 border-slate-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink dark:text-white">
                          {prof.displayName || prof.name || 'Professor'}
                        </span>
                        {isCurrentlyAssigned && (
                          <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-ink-muted dark:text-slate-300 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-ink-muted dark:text-slate-400">
                        {prof.email}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-ink-faint dark:text-slate-500 font-mono">
                    ID #{prof.id}
                  </span>
                </label>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-medium text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedProfessorId || submitting || loading}
            onClick={handleAssignSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[130px]"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span>Assigning...</span>
              </>
            ) : (
              'Assign Professor'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
