import React, { useState } from 'react';

export default function SubjectsTable({
  subjects,
  loading,
  error,
  departmentName,
  yearLabel,
  onOpenCreateModal,
  onAssignRequest,
  onUnassignRequest,
  onUpdateRequest,
  onDeleteRequest,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = (subjects || []).filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (s.title && s.title.toLowerCase().includes(term)) ||
      (s.professorName && s.professorName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col">
      {/* Table controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold text-ink dark:text-white">
              Curriculum Subjects
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-ink-muted dark:text-slate-300">
              {subjects?.length || 0}
            </span>
          </div>
          <p className="text-xs text-ink-muted dark:text-slate-400">
            {departmentName} • {yearLabel}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {subjects && subjects.length > 3 && (
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-ink dark:text-slate-100 placeholder:text-ink-faint focus:outline-none focus:border-primary"
              />
            </div>
          )}

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-4 py-3 text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Table container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              <th scope="col" className="px-5 py-3.5">#</th>
              <th scope="col" className="px-5 py-3.5">Subject Title</th>
              <th scope="col" className="px-5 py-3.5">Assigned Professor</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4 w-12"><div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                  <td className="px-5 py-4 text-right"><div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                </tr>
              ))
            ) : filteredSubjects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-ink-muted dark:text-slate-400 mb-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-ink dark:text-white">
                      {searchTerm ? 'No matching subjects found' : 'No subjects created yet'}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted dark:text-slate-400 max-w-sm">
                      {searchTerm
                        ? `No course titles match "${searchTerm}".`
                        : `No courses have been configured for ${departmentName} in ${yearLabel}. Click "Add Subject" to create one.`}
                    </p>
                    {!searchTerm && (
                      <button
                        type="button"
                        onClick={onOpenCreateModal}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent hover:bg-primary hover:text-white px-3.5 py-2 text-xs font-semibold transition-colors"
                      >
                        + Create First Subject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubjects.map((subject, index) => {
                const isUnassigned =
                  !subject.professorName ||
                  subject.professorName.trim().toLowerCase() === 'unassigned';

                return (
                  <tr
                    key={subject.id || index}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs text-ink-faint dark:text-slate-500 font-mono">
                      {index + 1}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-ink dark:text-white">
                        {subject.title}
                      </div>
                      <span className="text-[11px] text-ink-muted dark:text-slate-400 font-mono">
                        ID #{subject.id}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      {isUnassigned ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                          Unassigned
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 px-3 py-1 text-xs font-medium text-primary dark:text-blue-300">
                          <svg className="w-3.5 h-3.5 text-primary/70 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>{subject.professorName}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* Assign / Unassign / Reassign flow */}
                        {isUnassigned ? (
                          <button
                            type="button"
                            onClick={() => onAssignRequest(subject)}
                            className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
                            title="Assign a professor to this course"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="8.5" cy="7" r="4" />
                              <line x1="20" y1="8" x2="20" y2="14" />
                              <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                            <span>Assign</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => onAssignRequest(subject)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs font-medium text-ink-muted dark:text-slate-300 hover:text-primary dark:hover:text-accent hover:border-primary/40 transition-colors"
                              title="Change professor assigned to this course"
                            >
                              <span>Change</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onUnassignRequest(subject)}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/20 px-2 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                              title="Unassign professor from this course"
                            >
                              <span>Unassign</span>
                            </button>
                          </>
                        )}

                        {/* Update button */}
                        <button
                          type="button"
                          onClick={() => onUpdateRequest(subject)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs font-medium text-ink-muted dark:text-slate-300 hover:text-ink dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                          title="Update subject details"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          <span>Update</span>
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => onDeleteRequest(subject)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-danger hover:bg-red-50 dark:hover:bg-red-950/30 dark:text-red-400 transition-colors"
                          title="Delete subject"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          <span className="sr-only sm:not-sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
