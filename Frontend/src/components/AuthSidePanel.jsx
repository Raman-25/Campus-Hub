const ROLE_COPY = {
  student: {
    heading: 'Your semester, in one place',
    body: 'Timetables, grades, and assignments — synced the moment your department updates them.',
  },
  professor: {
    heading: 'Run your classroom, not your inbox',
    body: 'Attendance, grading, and office hours, without chasing down spreadsheets.',
  },
  admin: {
    heading: 'The whole campus, at a glance',
    body: 'Enrollment, staffing, and facilities — one dashboard for every department.',
  },
};

/**
 * AuthSidePanel
 * The left-hand brand panel. A faint blueprint grid + a single glowing
 * "campus building" mark form the one bold gesture on the page; copy
 * changes with the selected role so the panel earns its place.
 */
export default function AuthSidePanel({ role = 'student' }) {
  const copy = ROLE_COPY[role] ?? ROLE_COPY.student;

  return (
    <div className="relative hidden lg:flex lg:w-[42%] flex-col justify-between overflow-hidden bg-primary px-12 py-12 text-white">
      {/* Blueprint grid, drifting slowly — the single deliberate motion on the page */}
      <div
        className="absolute inset-0 opacity-[0.12] animate-drift"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
        aria-hidden="true"
      />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 flex items-center gap-2.5">
        <CampusMark />
        <span className="font-display text-xl font-semibold tracking-tight">CampusHub</span>
      </div>

      <div className="relative z-10 max-w-sm">
        <p className="font-display text-3xl font-semibold leading-tight mb-4">{copy.heading}</p>
        <p className="text-white/75 leading-relaxed">{copy.body}</p>
      </div>

      <p className="relative z-10 text-sm text-white/50">Smart Campus Management System</p>
    </div>
  );
}

function CampusMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4 L29 10 L16 16 L3 10 Z" fill="white" fillOpacity="0.95" />
      <path d="M9 13.5 V22 C9 24.5 12 26.5 16 26.5 C20 26.5 23 24.5 23 22 V13.5" stroke="white" strokeWidth="1.6" strokeOpacity="0.85" fill="none" />
      <line x1="27" y1="11" x2="27" y2="19" stroke="white" strokeWidth="1.6" strokeOpacity="0.85" />
    </svg>
  );
}
