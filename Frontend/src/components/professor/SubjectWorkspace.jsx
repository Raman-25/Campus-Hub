import React, { useState, useEffect, useCallback } from 'react';
import { professorApi, extractErrorMessage } from '../../services/api';

const TABS = [
  { id: 'records', label: 'View Records' },
  { id: 'attendance', label: 'Mark Attendance' },
  { id: 'grades', label: 'Enter Grades' },
];

const GRADE_OPTIONS = ['A', 'B', 'C', 'D', 'F'];

function todayString() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function AttendanceBar({ value }) {
  if (value == null) return <span className="text-ink-faint dark:text-slate-500">—</span>;
  const pct = Math.min(100, Math.max(0, value));
  const color =
    pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-warning' : 'bg-danger';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-ink dark:text-slate-200 w-8 text-right">
        {pct}%
      </span>
    </div>
  );
}

function GradeBadge({ grade }) {
  if (!grade) return <span className="text-ink-faint dark:text-slate-500">—</span>;
  const colors = {
    A: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    C: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    D: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    F: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${colors[grade] || 'bg-slate-100 text-ink-muted'}`}>
      {grade}
    </span>
  );
}

function StatusBadge({ present }) {
  if (present === true)
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
        Present
      </span>
    );
  if (present === false)
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        Absent
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-slate-100 text-ink-muted dark:bg-slate-800 dark:text-slate-400">
      Not marked
    </span>
  );
}

function SkeletonRow({ cols }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function EmptyState({ message }) {
  return (
    <tr>
      <td colSpan={99} className="px-5 py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-ink-muted dark:text-slate-400 mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <p className="text-sm font-medium text-ink dark:text-white">{message}</p>
        </div>
      </td>
    </tr>
  );
}

export default function SubjectWorkspace({ subject, onBack, onToast }) {
  const [activeTab, setActiveTab] = useState('records');
  const [selectedDate, setSelectedDate] = useState(todayString());

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');

  const [recordsView, setRecordsView] = useState('overall');
  const [recordsDate, setRecordsDate] = useState(todayString());
  const [dateRecords, setDateRecords] = useState([]);
  const [dateRecordsLoading, setDateRecordsLoading] = useState(false);
  const [dateRecordsError, setDateRecordsError] = useState('');

  const [presentMap, setPresentMap] = useState({});
  const [attendanceSaving, setAttendanceSaving] = useState(false);
  const [attendanceDateLoading, setAttendanceDateLoading] = useState(false);

  const [gradeMap, setGradeMap] = useState({});
  const [gradesSaving, setGradesSaving] = useState(false);

  // Stable ref so fetchStudents' useCallback dep stays [subject.id] only,
  // avoiding a re-fetch loop when the parent re-renders after a toast.
  const onToastRef = React.useRef(onToast);
  React.useEffect(() => { onToastRef.current = onToast; }, [onToast]);

  const fetchStudents = useCallback(async () => {
    setStudentsLoading(true);
    setStudentsError('');
    try {
      const data = await professorApi.getStudents(subject.id);
      const list = Array.isArray(data) ? data : [];
      setStudents(list);
      const pm = {};
      const gm = {};
      list.forEach((s) => {
        pm[s.studentId] = true;
        gm[s.studentId] = s.grade ?? '';
      });
      setPresentMap(pm);
      setGradeMap(gm);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to load students.');
      setStudentsError(msg);
      onToastRef.current?.({ type: 'error', message: msg });
    } finally {
      setStudentsLoading(false);
    }
  }, [subject.id]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const fetchDateRecords = useCallback(async (date) => {
    setDateRecordsLoading(true);
    setDateRecordsError('');
    try {
      const data = await professorApi.getAttendanceByDate(subject.id, date);
      setDateRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to load attendance for this date.');
      setDateRecordsError(msg);
      setDateRecords([]);
    } finally {
      setDateRecordsLoading(false);
    }
  }, [subject.id]);

  useEffect(() => {
    if (recordsView === 'bydate') {
      fetchDateRecords(recordsDate);
    }
  }, [recordsView, recordsDate, fetchDateRecords]);

  const prefillAttendanceForDate = useCallback(async (date) => {
    setAttendanceDateLoading(true);
    try {
      const data = await professorApi.getAttendanceByDate(subject.id, date);
      const list = Array.isArray(data) ? data : [];

      if (list.length === 0) {
        setPresentMap((prev) => {
          const pm = {};
          Object.keys(prev).forEach((id) => { pm[id] = true; });
          return pm;
        });
        return;
      }

      // date response uses rollNumber as key; match against students list which has studentId
      const byRoll = {};
      list.forEach((r) => { byRoll[r.rollNumber] = r.present; });

      setStudents((prevStudents) => {
        const pm = {};
        prevStudents.forEach((s) => {
          const serverPresent = byRoll[s.rollNumber];
          // null means not yet marked — default to checked
          pm[s.studentId] = serverPresent === null || serverPresent === undefined ? true : serverPresent;
        });
        setPresentMap(pm);
        return prevStudents;
      });
    } catch {
      // keep current presentMap on error
    } finally {
      setAttendanceDateLoading(false);
    }
  }, [subject.id]);

  useEffect(() => {
    if (activeTab === 'attendance') {
      prefillAttendanceForDate(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, activeTab]);

  async function handleSaveAttendance() {
    setAttendanceSaving(true);
    let postOk = false;
    try {
      const records = students.map((s) => ({
        studentId: s.studentId,
        present: !!presentMap[s.studentId],
      }));
      await professorApi.markAttendance({ subjectId: subject.id, date: selectedDate, records });
      postOk = true;
      onToast?.({ type: 'success', message: 'Attendance saved.' });
    } catch (err) {
      onToast?.({ type: 'error', message: extractErrorMessage(err, 'Failed to save attendance.') });
    } finally {
      setAttendanceSaving(false);
    }
    // Re-fetch outside try-catch so a fetch failure isn't swallowed by the POST handler
    if (postOk) {
      await fetchStudents();
    }
  }

  async function handleSaveGrades() {
    const grades = students
      .filter((s) => gradeMap[s.studentId])
      .map((s) => ({ studentId: s.studentId, grade: gradeMap[s.studentId] }));

    if (grades.length === 0) {
      onToast?.({ type: 'error', message: 'Select at least one grade before saving.' });
      return;
    }

    setGradesSaving(true);
    let postOk = false;
    try {
      await professorApi.enterGrades({ subjectId: subject.id, grades });
      postOk = true;
      onToast?.({ type: 'success', message: 'Grades saved.' });
    } catch (err) {
      onToast?.({ type: 'error', message: extractErrorMessage(err, 'Failed to save grades.') });
    } finally {
      setGradesSaving(false);
    }
    if (postOk) {
      await fetchStudents();
    }
  }

  const nonNullAttendance = students.filter((s) => s.attendance != null);
  const avgAttendance =
    nonNullAttendance.length > 0
      ? Math.round(nonNullAttendance.reduce((sum, s) => sum + s.attendance, 0) / nonNullAttendance.length)
      : null;
  const gradedCount = students.filter((s) => s.grade != null).length;

  return (
    <div className="animate-riseIn">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-muted dark:text-slate-400">
          <span>Year {subject.year}</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="font-semibold text-ink dark:text-white">{subject.title}</span>
        </nav>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {activeTab === 'attendance' && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <label htmlFor="subject-date" className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400 shrink-0">
              Date:
            </label>
            <input
              id="subject-date"
              type="date"
              value={selectedDate}
              max={todayString()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-ink dark:text-slate-100 focus:outline-none focus:border-primary dark:focus:border-accent"
            />
            {attendanceDateLoading && (
              <span className="text-xs text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
                <MiniSpinner /> Loading previous markings…
              </span>
            )}
          </div>
        )}

        <div className="px-5 pt-4 pb-0">
          <div
            role="tablist"
            aria-label="Subject management sections"
            className="inline-grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 p-1 w-full sm:w-auto"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 outline-none
                    ${isActive
                      ? 'bg-white dark:bg-slate-900 text-primary dark:text-accent shadow-sm'
                      : 'text-ink-muted dark:text-slate-400 hover:text-ink dark:hover:text-white'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          {activeTab === 'records' && (
            <div>
              {recordsView === 'overall' && !studentsLoading && students.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <StatChip label="Total Students" value={students.length} />
                  <StatChip
                    label="Avg Attendance"
                    value={avgAttendance != null ? `${avgAttendance}%` : '—'}
                  />
                  <StatChip
                    label="Graded"
                    value={`${gradedCount} / ${students.length}`}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400 shrink-0">
                  View:
                </span>
                <div
                  role="radiogroup"
                  aria-label="Records view mode"
                  className="inline-flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5"
                >
                  {[
                    { id: 'overall', label: 'Overall' },
                    { id: 'bydate', label: 'By date' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={recordsView === opt.id}
                      onClick={() => setRecordsView(opt.id)}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition-all duration-150 outline-none
                        ${recordsView === opt.id
                          ? 'bg-white dark:bg-slate-900 text-primary dark:text-accent shadow-sm'
                          : 'text-ink-muted dark:text-slate-400 hover:text-ink dark:hover:text-white'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {recordsView === 'bydate' && (
                  <input
                    type="date"
                    value={recordsDate}
                    max={todayString()}
                    onChange={(e) => setRecordsDate(e.target.value)}
                    className="ml-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-sm text-ink dark:text-slate-100 focus:outline-none focus:border-primary dark:focus:border-accent"
                    aria-label="Select date to view attendance"
                  />
                )}
              </div>

              {recordsView === 'overall' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                        <th scope="col" className="px-5 py-3.5">Roll No</th>
                        <th scope="col" className="px-5 py-3.5">Name</th>
                        <th scope="col" className="px-5 py-3.5">Attendance</th>
                        <th scope="col" className="px-5 py-3.5">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                      {studentsLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={4} />)
                      ) : studentsError ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <p className="text-sm text-danger">{studentsError}</p>
                              <button type="button" onClick={fetchStudents} className="text-xs font-medium text-primary dark:text-accent underline">Retry</button>
                            </div>
                          </td>
                        </tr>
                      ) : students.length === 0 ? (
                        <EmptyState message="No students found for this subject." />
                      ) : (
                        students.map((s) => (
                          <tr key={s.studentId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-5 py-3.5">
                              <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-mono font-medium text-ink-muted dark:text-slate-300">
                                {s.rollNumber}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent font-semibold text-xs">
                                  {s.name?.charAt(0)?.toUpperCase() ?? 'S'}
                                </div>
                                <span className="font-medium text-ink dark:text-white">{s.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <AttendanceBar value={s.attendance} />
                            </td>
                            <td className="px-5 py-3.5">
                              <GradeBadge grade={s.grade} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {recordsView === 'bydate' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                        <th scope="col" className="px-5 py-3.5">Roll No</th>
                        <th scope="col" className="px-5 py-3.5">Name</th>
                        <th scope="col" className="px-5 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                      {dateRecordsLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={3} />)
                      ) : dateRecordsError ? (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <p className="text-sm text-danger">{dateRecordsError}</p>
                              <button
                                type="button"
                                onClick={() => fetchDateRecords(recordsDate)}
                                className="text-xs font-medium text-primary dark:text-accent underline"
                              >
                                Retry
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : dateRecords.length === 0 ? (
                        <EmptyState message="No attendance data for this date." />
                      ) : (
                        dateRecords.map((r, idx) => (
                          <tr key={r.rollNumber ?? idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-5 py-3.5">
                              <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-mono font-medium text-ink-muted dark:text-slate-300">
                                {r.rollNumber}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent font-semibold text-xs">
                                  {r.name?.charAt(0)?.toUpperCase() ?? 'S'}
                                </div>
                                <span className="font-medium text-ink dark:text-white">{r.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <StatusBadge present={r.present} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                      <th scope="col" className="px-5 py-3.5">Roll No</th>
                      <th scope="col" className="px-5 py-3.5">Name</th>
                      <th scope="col" className="px-5 py-3.5">Attendance</th>
                      <th scope="col" className="px-5 py-3.5 text-center">Present</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                    {studentsLoading || attendanceDateLoading ? (
                      Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={4} />)
                    ) : studentsError ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-sm text-danger">{studentsError}</p>
                            <button
                              type="button"
                              onClick={fetchStudents}
                              className="text-xs font-medium text-primary dark:text-accent underline"
                            >
                              Retry
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : students.length === 0 ? (
                      <EmptyState message="No students found for this subject." />
                    ) : (
                      students.map((s) => (
                        <tr key={s.studentId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-mono font-medium text-ink-muted dark:text-slate-300">
                              {s.rollNumber}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent font-semibold text-xs">
                                {s.name?.charAt(0)?.toUpperCase() ?? 'S'}
                              </div>
                              <span className="font-medium text-ink dark:text-white">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <AttendanceBar value={s.attendance} />
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={!!presentMap[s.studentId]}
                              onChange={(e) =>
                                setPresentMap((prev) => ({ ...prev, [s.studentId]: e.target.checked }))
                              }
                              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                              aria-label={`Mark ${s.name} as present`}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!studentsLoading && students.length > 0 && (
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-ink-muted dark:text-slate-400">
                    {Object.values(presentMap).filter(Boolean).length} / {students.length} marked present
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveAttendance}
                    disabled={attendanceSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors min-h-[36px]"
                  >
                    {attendanceSaving && <MiniSpinner />}
                    {attendanceSaving ? 'Saving…' : 'Save Attendance'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'grades' && (
            <div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                      <th scope="col" className="px-5 py-3.5">Roll No</th>
                      <th scope="col" className="px-5 py-3.5">Name</th>
                      <th scope="col" className="px-5 py-3.5">Current Grade</th>
                      <th scope="col" className="px-5 py-3.5">Set Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                    {studentsLoading ? (
                      Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={4} />)
                    ) : studentsError ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-sm text-danger">{studentsError}</p>
                            <button type="button" onClick={fetchStudents} className="text-xs font-medium text-primary dark:text-accent underline">Retry</button>
                          </div>
                        </td>
                      </tr>
                    ) : students.length === 0 ? (
                      <EmptyState message="No students found for this subject." />
                    ) : (
                      students.map((s) => (
                        <tr key={s.studentId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-mono font-medium text-ink-muted dark:text-slate-300">
                              {s.rollNumber}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent font-semibold text-xs">
                                {s.name?.charAt(0)?.toUpperCase() ?? 'S'}
                              </div>
                              <span className="font-medium text-ink dark:text-white">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <GradeBadge grade={s.grade} />
                          </td>
                          <td className="px-5 py-3.5">
                            <select
                              value={gradeMap[s.studentId] ?? ''}
                              onChange={(e) =>
                                setGradeMap((prev) => ({ ...prev, [s.studentId]: e.target.value }))
                              }
                              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-ink dark:text-slate-100 focus:outline-none focus:border-primary dark:focus:border-accent"
                              aria-label={`Grade for ${s.name}`}
                            >
                              <option value="">— select —</option>
                              {GRADE_OPTIONS.map((g) => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!studentsLoading && students.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveGrades}
                    disabled={gradesSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors min-h-[36px]"
                  >
                    {gradesSaving && <MiniSpinner />}
                    {gradesSaving ? 'Saving…' : 'Save Grades'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-center">
      <p className="text-lg font-bold text-ink dark:text-white">{value}</p>
      <p className="text-[11px] text-ink-muted dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function MiniSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
