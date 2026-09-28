import React, { useState } from 'react';

export default function ProfessorsTable({
  professors,
  loading,
  error,
  departmentName,
  onDeleteRequest,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfessors = (professors || []).filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const name = (p.displayName || p.name || '').toLowerCase();
    return (
      name.includes(term) ||
      (p.email && p.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col">
      {/* Table controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div>
          <h3 className="font-display text-base font-semibold text-ink dark:text-white">
            Department Faculty
          </h3>
          <p className="text-xs text-ink-muted dark:text-slate-400">
            {departmentName} ({professors?.length || 0} professors)
          </p>
        </div>

        {professors && professors.length > 3 && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search faculty by name or email..."
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
              <th scope="col" className="px-5 py-3.5">Faculty Member</th>
              <th scope="col" className="px-5 py-3.5">Email Address</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4 w-12"><div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="px-5 py-4"><div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                  <td className="px-5 py-4 text-right"><div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                </tr>
              ))
            ) : filteredProfessors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-ink-muted dark:text-slate-400 mb-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-ink dark:text-white">
                      {searchTerm ? 'No matching professors found' : 'No professors registered'}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted dark:text-slate-400">
                      {searchTerm
                        ? `No professors match "${searchTerm}".`
                        : `No faculty members are currently registered under ${departmentName}.`}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProfessors.map((professor, index) => (
                <tr
                  key={professor.id || index}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs text-ink-faint dark:text-slate-500 font-mono">
                    {index + 1}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-primary dark:text-accent font-semibold text-xs">
                        {(professor.displayName || professor.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-ink dark:text-white">
                        {professor.displayName || professor.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <a
                      href={`mailto:${professor.email}`}
                      className="text-xs text-ink-muted dark:text-slate-300 hover:text-primary dark:hover:text-accent inline-flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 text-ink-faint dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M3 7l9 6 9-6" />
                      </svg>
                      <span>{professor.email}</span>
                    </a>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteRequest(professor)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-danger hover:bg-red-50 dark:hover:bg-red-950/30 dark:text-red-400 transition-colors"
                      title="Delete professor record"
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
