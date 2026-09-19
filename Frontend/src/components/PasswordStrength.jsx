/**
 * PasswordStrength
 * Scores a password on a 0–4 scale and renders a small meter + label.
 * Purely visual guidance — the real validation still happens on submit / server-side.
 */
function scorePassword(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const LEVELS = [
  { label: 'Too short', color: 'bg-slate-300' },
  { label: 'Weak', color: 'bg-danger' },
  { label: 'Fair', color: 'bg-warning' },
  { label: 'Good', color: 'bg-accent' },
  { label: 'Strong', color: 'bg-success' },
];

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = scorePassword(password);
  const level = LEVELS[score];

  return (
    <div className="flex items-center gap-2 -mt-1" aria-live="polite">
      <div className="flex gap-1 flex-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < score ? level.color : 'bg-slate-150 bg-slate-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-ink-muted w-16 text-right">{level.label}</span>
    </div>
  );
}
