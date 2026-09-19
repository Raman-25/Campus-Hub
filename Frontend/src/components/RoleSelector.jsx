const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'professor', label: 'Professor' },
  { value: 'admin', label: 'Admin' },
];

/**
 * RoleSelector
 * variant="dropdown" — a native select, used on the Login page.
 * variant="tabs"     — a segmented control, used on the Register page
 *                       since it switches an entire block of fields.
 */
export default function RoleSelector({ value, onChange, variant = 'dropdown' }) {
  if (variant === 'tabs') {
    return (
      <div
        role="tablist"
        aria-label="Register as"
        className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1"
      >
        {ROLES.map((role) => (
          <button
            key={role.value}
            role="tab"
            type="button"
            aria-selected={value === role.value}
            onClick={() => onChange(role.value)}
            className={`rounded-lg py-2 text-sm font-medium transition-colors
              ${
                value === role.value
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
          >
            {role.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="role-select" className="text-sm font-medium text-ink dark:text-slate-200">
        I am logging in as
      </label>
      <select
        id="role-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-ink dark:text-slate-100 focus:outline-none focus:border-primary"
      >
        {ROLES.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { ROLES };
