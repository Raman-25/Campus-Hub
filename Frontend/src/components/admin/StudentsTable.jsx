import React, { useState } from 'react';

export default function StudentsTable({
  students,
  loading,
  error,
  departmentName,
  yearLabel,
  onDeleteRequest,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = (students || []).filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col">
      {/* Table controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div>
          <h3 className="font-display text-base font-semibold text-ink dark:text-white">
            Enrolled Students
          </h3>
          <p className="text-xs text-ink-muted dark:text-slate-400">
            {departmentName} • {yearLabel} ({students?.length || 0} total)
          </p>
        </div>

        {students && students.length > 3 && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-ink dark:text-slate-100 placeholder:text-ink-faint focus:outline-none focus:border-primary"
            />
          </div>
        )}
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
              <th scope="col" className="px-5 py-3.5">Student Name</th>
              <th scope="col" className="px-5 py-3.5">Roll Number</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4 w-12"><div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="px-5 py-4 text-right"><div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                </tr>
              ))
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-ink-muted dark:text-slate-400 mb-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-ink dark:text-white">
                      {searchTerm ? 'No matching students found' : 'No students found'}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted dark:text-slate-400">
                      {searchTerm
                        ? `No student records match "${searchTerm}".`
                        : `No students are registered for ${departmentName} in ${yearLabel}.`}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr
                  key={student.id || index}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs text-ink-faint dark:text-slate-500 font-mono">
                    {index + 1}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent font-semibold text-xs">
                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <span className="font-medium text-ink dark:text-white">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-mono font-medium text-ink-muted dark:text-slate-300">
                      {student.rollNumber || 'N/A'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteRequest(student)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-danger hover:bg-red-50 dark:hover:bg-red-950/30 dark:text-red-400 transition-colors"
                      title="Delete student record"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
