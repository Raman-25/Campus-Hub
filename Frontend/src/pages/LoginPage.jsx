import { useState } from 'react';
import FormInput from '../components/FormInput';
import RoleSelector from '../components/RoleSelector';
import AuthSidePanel from '../components/AuthSidePanel';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maps a role to the endpoint the backend team defined for it.
const LOGIN_ENDPOINTS = {
  student: '/auth/login/student',
  professor: '/auth/login/professor',
  admin: '/auth/login/admin',
};

/**
 * LoginPage
 * Props:
 * - onLogin(role, credentials): async callback that performs the real
 *   API call. Should throw (or reject) with an Error whose `message`
 *   is shown to the user on failure, and resolve on success.
 * - onNavigateToRegister(): switches to the register page.
 */
export default function LoginPage({ onLogin, onNavigateToRegister }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      // The parent supplies the real fetch to LOGIN_ENDPOINTS[role];
      // this page only owns the form state and UX around it.
      await onLogin?.(role, { email, password, rememberMe, endpoint: LOGIN_ENDPOINTS[role] });
    } catch (err) {
      setFormError(err?.message || 'We couldn\u2019t sign you in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-canvas dark:bg-slate-950">
      <AuthSidePanel role={role} />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-riseIn">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" aria-hidden="true" />
            <span className="font-display text-lg font-semibold text-ink dark:text-white">CampusHub</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink dark:text-white mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-ink-muted mb-7">Sign in to continue to your dashboard.</p>

          {formError && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <RoleSelector value={role} onChange={setRole} variant="dropdown" />

            <FormInput
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              icon={<MailIcon />}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
              icon={<LockIcon />}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-muted">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                Remember me
              </label>
              <button
                type="button"
                className="font-medium text-primary hover:text-primary-dark"
                onClick={() => {
                  /* Wired up once the reset-password flow exists on the backend */
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading && <Spinner />}
              {loading ? 'Signing in\u2026' : 'Sign in'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-ink-muted">
            New to CampusHub?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-medium text-primary hover:text-primary-dark"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}
