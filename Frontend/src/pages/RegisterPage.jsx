import { useMemo, useState } from 'react';
import FormInput from '../components/FormInput';
import RoleSelector from '../components/RoleSelector';
import PasswordStrength from '../components/PasswordStrength';
import AuthSidePanel from '../components/AuthSidePanel';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REGISTER_ENDPOINTS = {
  student: '/auth/register/student',
  professor: '/auth/register/professor',
  admin: '/auth/register/admin',
};

const DEPARTMENTS = [
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Mathematics',
];

const TITLES = ['Dr.', 'Prof.', 'Mr.', 'Mrs.', 'Ms.'];

const initialFields = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  rollNumber: '',
  department: DEPARTMENTS[0],
  semester: '1',
  title: TITLES[0],
  adminLevel: 'Regular Admin',
  agreeToTerms: false,
};

/**
 * RegisterPage
 * Props:
 * - onRegister(role, payload): async callback performing the real API call.
 * - onNavigateToLogin(): switches back to the login page.
 */
export default function RegisterPage({ onRegister, onNavigateToLogin }) {
  const [role, setRole] = useState('student');
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function setField(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  const roleFieldErrors = useMemo(() => {
    if (role === 'student') return ['rollNumber'];
    if (role === 'professor') return ['title'];
    if (role === 'admin') return ['department', 'adminLevel'];
    return [];
  }, [role]);

  function validate() {
    const next = {};
    if (!fields.fullName.trim()) next.fullName = 'Enter your full name.';
    if (!EMAIL_RE.test(fields.email)) next.email = 'Enter a valid email address.';
    if (fields.password.length < 8) next.password = 'Use at least 8 characters.';
    if (fields.confirmPassword !== fields.password) next.confirmPassword = 'Passwords don\u2019t match.';
    if (role === 'student' && !fields.rollNumber.trim()) next.rollNumber = 'Enter your roll number.';
    if (!fields.agreeToTerms) next.agreeToTerms = 'You need to accept the terms to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = buildPayload(role, fields);
      await onRegister?.(role, { ...payload, endpoint: REGISTER_ENDPOINTS[role] });
      setSuccess(true);
    } catch (err) {
      setFormError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return <SuccessScreen role={role} onContinue={onNavigateToLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-canvas dark:bg-slate-950">
      <AuthSidePanel role={role} />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-riseIn">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" aria-hidden="true" />
            <span className="font-display text-lg font-semibold text-ink dark:text-white">CampusHub</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink dark:text-white mb-1">
            Create your account
          </h1>
          <p className="text-sm text-ink-muted mb-7">It takes less than a minute.</p>

          {formError && (
            <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <RoleSelector
              value={role}
              onChange={(r) => {
                setRole(r);
                setErrors({});
              }}
              variant="tabs"
            />

            <FormInput
              label="Full name"
              value={fields.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              error={errors.fullName}
              required
              autoComplete="name"
              icon={<UserIcon />}
            />

            <FormInput
              label="Email"
              type="email"
              value={fields.email}
              onChange={(e) => setField('email', e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
              placeholder="you@college.edu"
              icon={<MailIcon />}
            />

            <div className="flex flex-col gap-2">
              <FormInput
                label="Password"
                type="password"
                value={fields.password}
                onChange={(e) => setField('password', e.target.value)}
                error={errors.password}
                required
                autoComplete="new-password"
                icon={<LockIcon />}
              />
              <PasswordStrength password={fields.password} />
            </div>

            <FormInput
              label="Confirm password"
              type="password"
              value={fields.confirmPassword}
              onChange={(e) => setField('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
              icon={<LockIcon />}
            />

            {/* Role-specific fields */}
            {role === 'student' && (
              <>
                <FormInput
                  label="Roll number"
                  value={fields.rollNumber}
                  onChange={(e) => setField('rollNumber', e.target.value)}
                  error={errors.rollNumber}
                  required
                  icon={<IdIcon />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Department"
                    value={fields.department}
                    onChange={(v) => setField('department', v)}
                    options={DEPARTMENTS}
                  />
                  <SelectField
                    label="Semester"
                    value={fields.semester}
                    onChange={(v) => setField('semester', v)}
                    options={Array.from({ length: 8 }, (_, i) => String(i + 1))}
                  />
                </div>
              </>
            )}

            {role === 'professor' && (
              <SelectField
                label="Title"
                value={fields.title}
                onChange={(v) => setField('title', v)}
                options={TITLES}
              />
            )}

            {role === 'admin' && (
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Department"
                  value={fields.department}
                  onChange={(v) => setField('department', v)}
                  options={DEPARTMENTS}
                />
                <SelectField
                  label="Admin level"
                  value={fields.adminLevel}
                  onChange={(v) => setField('adminLevel', v)}
                  options={['Regular Admin', 'Super Admin']}
                />
              </div>
            )}

            <label className="flex items-start gap-2.5 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={fields.agreeToTerms}
                onChange={(e) => setField('agreeToTerms', e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span>
                I agree to the <a href="#" className="text-primary hover:text-primary-dark">Terms of Service</a> and{' '}
                <a href="#" className="text-primary hover:text-primary-dark">Privacy Policy</a>.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p role="alert" className="-mt-3 text-xs text-danger">
                {errors.agreeToTerms}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading && <Spinner />}
              {loading ? 'Creating account\u2026' : 'Create account'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-medium text-primary hover:text-primary-dark"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function buildPayload(role, fields) {
  const base = { name: fields.fullName, email: fields.email, password: fields.password };
  if (role === 'student') {
    return { ...base, rollNumber: fields.rollNumber, department: fields.department, semester: Number(fields.semester) };
  }
  if (role === 'professor') {
    return { ...base, title: fields.title };
  }
  return { ...base, department: fields.department, level: fields.adminLevel };
}

function SuccessScreen({ role, onContinue }) {
  return (
    <div className="min-h-screen flex bg-canvas dark:bg-slate-950">
      <AuthSidePanel role={role} />
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center animate-popIn">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-white mb-2">
            You&rsquo;re all set
          </h1>
          <p className="text-sm text-ink-muted mb-8">
            Your CampusHub account has been created. Sign in to get to your dashboard.
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark min-h-[44px]"
          >
            Go to sign in
          </button>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink dark:text-slate-200">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-ink dark:text-slate-100 focus:outline-none focus:border-primary"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
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

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
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

function IdIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="11" r="1.8" />
      <path d="M13 10h6M13 14h6" />
    </svg>
  );
}
