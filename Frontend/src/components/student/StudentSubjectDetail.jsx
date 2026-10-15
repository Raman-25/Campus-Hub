import React, { useState, useEffect, useCallback } from 'react';
import { studentApi, extractErrorMessage } from '../../services/api';
import { GradeBadge, AttendanceBar, StatusBadge, MiniSpinner } from './StudentUI';

function todayString() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function formatDateWithDay(dateStr) {
  if (!dateStr) return '—';
  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Back
    </button>
  );
}

/**
 * StudentSubjectDetail — full-page detail view for a single subject.
 * Theme-aware design system matching professor/admin dashboards.
 */
export default function StudentSubjectDetail({ subject, onBack, onToast }) {
  const { id, title, professorName, attendance, grade } = subject;
  const today = todayString();

  // Recent attendance (last 3)
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState('');

  // Date-check widget
  const [checkDate, setCheckDate] = useState(today);
  const [checkResult, setCheckResult] = useState(null); // null | 'not_found' | { date, present }
  const [checkLoading, setCheckLoading] = useState(false);

  // Clear result badge whenever the picked date changes
  useEffect(() => {
    setCheckResult(null);
  }, [checkDate]);

  const fetchRecent = useCallback(async () => {
    setRecentLoading(true);
    setRecentError('');
    try {
      const data = await studentApi.getAttendance(id);
      setRecentAttendance(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to load recent attendance.');
      setRecentError(msg);
    } finally {
      setRecentLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  async function handleCheckDate() {
    if (!checkDate || checkDate > today) return;
    setCheckLoading(true);
    setCheckResult(null);
    try {
      const data = await studentApi.getAttendanceByDate(id, checkDate);
      const list = Array.isArray(data) ? data : [];
      if (list.length === 0) {
        setCheckResult('not_found');
      } else {
        setCheckResult(list[0]);
      }
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to check attendance.');
      onToast?.({ type: 'error', message: msg });
      setCheckResult('not_found');
    } finally {
      setCheckLoading(false);
    }
  }

  return (
    <div className="animate-riseIn space-y-6 sm:space-y-8">
      {/* Top nav */}
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-muted dark:text-slate-400">
          <span>My Subjects</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="font-semibold text-ink dark:text-white">{title}</span>
        </nav>
      </div>

      {/* Subject header card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink dark:text-white mb-1">{title}</h2>
        <p className="text-sm text-ink-muted dark:text-slate-400">{professorName ?? 'Unassigned'}</p>
      </div>

      {/* Two stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Attendance tile */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400 mb-3">
            Attendance
          </p>
          {attendance != null ? (
            <>
              <p className={`text-3xl font-bold mb-3 ${attendance >= 75 ? 'text-emerald-600 dark:text-emerald-400' : attendance >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-danger dark:text-red-400'}`}>
                {attendance}%
              </p>
              <AttendanceBar value={attendance} />
            </>
          ) : (
            <p className="text-2xl font-bold text-ink-faint dark:text-slate-500">—</p>
          )}
        </div>

        {/* Grade tile */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400 mb-3">
            Grade
          </p>
          {grade ? (
            <GradeBadge grade={grade} size="lg" />
          ) : (
            <p className="text-2xl font-bold text-ink-faint dark:text-slate-500">—</p>
          )}
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-ink dark:text-white mb-4">Recent Attendance</h3>

        {recentLoading ? (
          <div className="flex items-center gap-2 text-sm text-ink-muted dark:text-slate-400">
            <MiniSpinner />
            Loading…
          </div>
        ) : recentError ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-danger dark:text-red-400">{recentError}</p>
            <button type="button" onClick={fetchRecent} className="text-xs text-primary dark:text-accent underline self-start">Retry</button>
          </div>
        ) : recentAttendance.length === 0 ? (
          <p className="text-sm text-ink-muted dark:text-slate-400">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                  <th scope="col" className="w-3/5 px-4 py-2.5">Date</th>
                  <th scope="col" className="w-2/5 px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {recentAttendance.map((row, idx) => (
                  <tr key={row.date ?? idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="w-3/5 px-4 py-2.5 text-ink dark:text-slate-200">{formatDateWithDay(row.date)}</td>
                    <td className="w-2/5 px-4 py-2.5">
                      <StatusBadge present={row.present} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Check a specific date */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-ink dark:text-white mb-4">Check a Specific Date</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <input
            type="date"
            value={checkDate}
            max={today}
            onChange={(e) => {
              setCheckDate(e.target.value);
              setCheckResult(null);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-ink dark:text-slate-100 focus:outline-none focus:border-primary dark:focus:border-accent transition-colors"
            aria-label="Select date to check attendance"
          />
          <button
            type="button"
            onClick={handleCheckDate}
            disabled={checkLoading || !checkDate || checkDate > today}
            className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-white transition-colors shadow-sm"
          >
            {checkLoading && <MiniSpinner />}
            {checkLoading ? 'Checking…' : 'Check'}
          </button>

          {/* Result */}
          {checkResult && !checkLoading && (
            <div className="flex items-center gap-2">
              {checkResult === 'not_found' ? (
                <span className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold bg-slate-100 text-ink-muted dark:bg-slate-800 dark:text-slate-400">
                  No record
                </span>
              ) : (
                <StatusBadge present={checkResult.present} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
