import React, { useState, useEffect, useCallback } from 'react';
import ProfessorHeader from '../components/professor/ProfessorHeader';
import SubjectCard from '../components/professor/SubjectCard';
import SubjectWorkspace from '../components/professor/SubjectWorkspace';
import { professorApi, extractErrorMessage } from '../services/api';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function ProfessorDashboard({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onToast,
}) {
  const [professorDisplayName, setProfessorDisplayName] = useState(user?.name ?? 'Professor');
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);

  useEffect(() => {
    professorApi.getMe()
      .then((data) => {
        if (data?.displayName) setProfessorDisplayName(data.displayName);
      })
      .catch(() => {});
  }, []);

  const fetchSubjects = useCallback(async () => {
    setSubjectsLoading(true);
    setSubjectsError('');
    try {
      const data = await professorApi.getSubjects();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to load subjects.');
      setSubjectsError(msg);
      onToast?.({ type: 'error', message: msg });
    } finally {
      setSubjectsLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const availableYears = Array.from(new Set(subjects.map((s) => s.year))).sort((a, b) => a - b);
  const filteredSubjects = selectedYear == null ? subjects : subjects.filter((s) => s.year === selectedYear);

  function countForYear(year) {
    return subjects.filter((s) => s.year === year).length;
  }

  if (activeSubject) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-slate-950 font-body text-ink dark:text-slate-100 antialiased transition-colors pb-16">
        <ProfessorHeader
          onLogout={onLogout}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <SubjectWorkspace
            subject={activeSubject}
            onBack={() => setActiveSubject(null)}
            onToast={onToast}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas dark:bg-slate-950 font-body text-ink dark:text-slate-100 antialiased transition-colors pb-16">
      <ProfessorHeader
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 animate-riseIn">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-white">
              {getGreeting()}, {professorDisplayName}
            </h1>
            <p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
              Here's what's happening with your subjects today.
            </p>
          </div>

          {!subjectsLoading && subjects.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-medium text-ink-muted dark:text-slate-300 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {subjects.length} subject{subjects.length !== 1 ? 's' : ''} assigned
            </span>
          )}
        </div>

        {availableYears.length > 0 && (
          <section aria-labelledby="year-filter-title" className="mb-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span
                  id="year-filter-title"
                  className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400 shrink-0"
                >
                  Filter by Year:
                </span>

                <div
                  role="radiogroup"
                  aria-label="Filter subjects by academic year"
                  className="flex flex-wrap gap-2"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selectedYear == null}
                    onClick={() => setSelectedYear(null)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150 outline-none
                      ${selectedYear == null
                        ? 'bg-primary text-white shadow-sm font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-ink-muted dark:text-slate-300 hover:text-ink dark:hover:text-white'
                      }`}
                  >
                    All · {subjects.length} subjects
                  </button>

                  {availableYears.map((year) => (
                    <button
                      key={year}
                      type="button"
                      role="radio"
                      aria-checked={selectedYear === year}
                      onClick={() => setSelectedYear(year)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150 outline-none
                        ${selectedYear === year
                          ? 'bg-primary text-white shadow-sm font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-ink-muted dark:text-slate-300 hover:text-ink dark:hover:text-white'
                        }`}
                    >
                      Year {year} · {countForYear(year)} subject{countForYear(year) !== 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section aria-label="My subjects">
          {subjectsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 h-40"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800 mb-2" />
                  <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          ) : subjectsError ? (
            <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-5 py-8 text-center">
              <p className="text-sm text-danger dark:text-red-400 mb-3">{subjectsError}</p>
              <button
                type="button"
                onClick={fetchSubjects}
                className="text-xs font-medium text-primary dark:text-accent underline"
              >
                Retry
              </button>
            </div>
          ) : subjects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-ink-muted dark:text-slate-400">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-ink dark:text-white">No subjects assigned yet</p>
              <p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
                Contact your admin to get subjects assigned to you.
              </p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-10 text-center shadow-sm">
              <p className="text-sm text-ink-muted dark:text-slate-400">
                No subjects for Year {selectedYear}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onClick={() => setActiveSubject(subject)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
