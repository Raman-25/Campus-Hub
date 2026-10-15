import React, { useState, useEffect, useCallback } from 'react';
import StudentHeader from '../components/student/StudentHeader';
import StudentSubjectCard from '../components/student/StudentSubjectCard';
import StudentSubjectDetail from '../components/student/StudentSubjectDetail';
import { GradeBadge, AttendanceBar } from '../components/student/StudentUI';
import { studentApi, extractErrorMessage } from '../services/api';

/* ─── Grade helpers ─────────────────────────────────────────────── */
const GRADE_POINTS = { A: 10, B: 8, C: 6, D: 4, F: 0 };

function pointsToGrade(avg) {
  if (avg >= 9) return 'A';
  if (avg >= 7) return 'B';
  if (avg >= 5) return 'C';
  if (avg >= 3) return 'D';
  return 'F';
}

function computeAverageGrade(subjects) {
  const graded = subjects.filter((s) => s.grade != null && GRADE_POINTS[s.grade] !== undefined);
  if (graded.length === 0) return null;
  const sum = graded.reduce((acc, s) => acc + GRADE_POINTS[s.grade], 0);
  return pointsToGrade(sum / graded.length);
}

function computeAverageAttendance(subjects) {
  const withData = subjects.filter((s) => s.attendance != null);
  if (withData.length === 0) return null;
  return Math.round(withData.reduce((acc, s) => acc + s.attendance, 0) / withData.length);
}

/* ─── Skeleton loaders ──────────────────────────────────────────── */
function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 h-36" />
  );
}

function SubjectCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 h-28" />
  );
}

/* ─── Welcome banner ────────────────────────────────────────────── */
function WelcomeBanner({ name }) {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 border border-blue-200/70 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 via-indigo-50/80 to-purple-50 dark:from-blue-950/70 dark:via-indigo-950/70 dark:to-purple-950/70 shadow-sm transition-colors">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative flex items-center justify-between px-6 sm:px-8 py-7 sm:py-9">
        {/* Text */}
        <div className="max-w-md">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-white leading-tight mb-2 tracking-tight">
            Welcome back, {name ?? 'Student'}!
          </h1>
          <p className="text-ink-muted dark:text-blue-200 text-sm sm:text-base">
            Always stay updated in your student portal
          </p>
        </div>

        {/* Illustration — decorative geometric student figure */}
        <div className="hidden sm:block select-none shrink-0 ml-4 text-primary dark:text-white" aria-hidden="true">
          <StudentIllustration />
        </div>
      </div>
    </div>
  );
}

/* SVG student illustration (geometric / abstract) */
function StudentIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body glow */}
      <ellipse cx="60" cy="100" rx="38" ry="10" fill="currentColor" fillOpacity="0.08" />
      {/* Mortarboard cap */}
      <rect x="30" y="28" width="60" height="6" rx="3" fill="currentColor" fillOpacity="0.9" />
      <polygon points="60,14 85,30 60,34 35,30" fill="currentColor" fillOpacity="0.85" />
      <line x1="85" y1="29" x2="90" y2="46" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="90" cy="48" r="3" fill="currentColor" fillOpacity="0.7" />
      {/* Head */}
      <circle cx="60" cy="52" r="16" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
      {/* Body */}
      <rect x="42" y="70" width="36" height="32" rx="10" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
      {/* Book */}
      <rect x="46" y="76" width="22" height="16" rx="3" fill="currentColor" fillOpacity="0.25" />
      <line x1="57" y1="76" x2="57" y2="92" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      {/* Stars */}
      <circle cx="30" cy="22" r="2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="92" cy="18" r="1.5" fill="currentColor" fillOpacity="0.4" />
      <circle cx="18" cy="55" r="1.5" fill="currentColor" fillOpacity="0.35" />
      <circle cx="104" cy="65" r="2" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

/* ─── Academic Snapshot section ─────────────────────────────────── */
function AcademicSnapshot({ subjects, loading }) {
  const avgAttendance = computeAverageAttendance(subjects);
  const enrolledCount = subjects.length;
  const avgGrade = computeAverageGrade(subjects);

  return (
    <section aria-label="Academic Snapshot" className="mb-7">
      <h2 className="font-display text-lg font-semibold text-ink dark:text-white mb-4">Academic Snapshot</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Attendance */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                  Overall Attendance
                </p>
                {avgAttendance != null && (
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      avgAttendance >= 75
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : avgAttendance >= 50
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-danger dark:text-red-400'
                    }`}
                  >
                    {avgAttendance}%
                  </span>
                )}
              </div>
              {avgAttendance != null ? (
                <>
                  <p
                    className={`text-3xl font-bold mt-1 mb-3 ${
                      avgAttendance >= 75
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : avgAttendance >= 50
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-danger dark:text-red-400'
                    }`}
                  >
                    {avgAttendance}%
                  </p>
                  <AttendanceBar value={avgAttendance} showLabel={false} />
                </>
              ) : (
                <p className="text-2xl font-bold text-ink-faint dark:text-slate-500 mt-2">—</p>
              )}
            </>
          )}
        </div>

        {/* Subjects Enrolled */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400 mb-1">
                Subjects Enrolled
              </p>
              <p className="text-3xl font-bold text-ink dark:text-white mt-1 mb-1">{enrolledCount}</p>
              <p className="text-xs text-ink-muted dark:text-slate-400">Active this semester</p>
            </>
          )}
        </div>

        {/* Average Grade */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400 mb-1">
                Average Grade
              </p>
              <div className="mt-2">
                {avgGrade ? (
                  <GradeBadge grade={avgGrade} size="lg" />
                ) : (
                  <p className="text-2xl font-bold text-ink-faint dark:text-slate-500">—</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────── */
export default function StudentDashboard({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onToast,
}) {
  const [studentInfo, setStudentInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(true);

  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState('');

  const [activeSubject, setActiveSubject] = useState(null);

  /* Fetch /student/me */
  useEffect(() => {
    setInfoLoading(true);
    studentApi
      .getMe()
      .then((data) => setStudentInfo(data ?? null))
      .catch(() => {})
      .finally(() => setInfoLoading(false));
  }, []);

  /* Fetch /student/subjects */
  const fetchSubjects = useCallback(async () => {
    setSubjectsLoading(true);
    setSubjectsError('');
    try {
      const data = await studentApi.getSubjects();
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

  /* ── Subject detail page ── */
  if (activeSubject) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-slate-950 font-body text-ink dark:text-slate-100 antialiased transition-colors pb-16">
        <StudentHeader
          studentInfo={studentInfo}
          onLogout={onLogout}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <StudentSubjectDetail
            subject={activeSubject}
            onBack={() => setActiveSubject(null)}
            onToast={onToast}
          />
        </main>
      </div>
    );
  }

  /* ── Main dashboard page ── */
  return (
    <div className="min-h-screen bg-canvas dark:bg-slate-950 font-body text-ink dark:text-slate-100 antialiased transition-colors pb-16">
      <StudentHeader
        studentInfo={studentInfo}
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 animate-riseIn">
        {/* Welcome banner */}
        <WelcomeBanner name={studentInfo?.name ?? user?.name} />

        {/* Academic Snapshot */}
        <AcademicSnapshot subjects={subjects} loading={subjectsLoading} />

        {/* My Subjects */}
        <section aria-label="My Subjects">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-white mb-4">My Subjects</h2>

          {subjectsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <SubjectCardSkeleton key={i} />
              ))}
            </div>
          ) : subjectsError ? (
            <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-8 text-center">
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
              <p className="text-base font-semibold text-ink dark:text-white">No subjects enrolled yet</p>
              <p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
                Contact your admin if you think this is an error.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {subjects.map((subject) => (
                <StudentSubjectCard
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
