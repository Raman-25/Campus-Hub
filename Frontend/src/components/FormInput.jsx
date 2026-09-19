import { useId, useState } from 'react';

/**
 * FormInput
 * A labeled input with an inline icon, inline validation message,
 * and an optional show/hide toggle for password fields.
 *
 * Props:
 * - label: string
 * - type: html input type ('text' | 'email' | 'password' | ...)
 * - icon: JSX element rendered at the left of the field
 * - value, onChange, onBlur: standard controlled-input props
 * - error: string | null — shown below the field, sets aria-invalid
 * - required: boolean — shows a required indicator next to the label
 * - autoComplete: string
 */
export default function FormInput({
  label,
  type = 'text',
  icon,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  autoComplete,
  placeholder,
  name,
}) {
  const [revealed, setRevealed] = useState(false);
  const inputId = useId();
  const errorId = useId();
  const isPassword = type === 'password';
  const resolvedType = isPassword && revealed ? 'text' : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink dark:text-slate-200">
        {label}
        {required && (
          <span className="text-danger ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div
        className={`flex items-center gap-2.5 rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 transition-colors
          ${error ? 'border-danger' : 'border-slate-200 dark:border-slate-700 focus-within:border-primary'}`}
      >
        {icon && <span className="text-ink-faint shrink-0" aria-hidden="true">{icon}</span>}
        <input
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="w-full min-w-0 bg-transparent text-sm text-ink dark:text-slate-100 placeholder:text-ink-faint focus:outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="shrink-0 text-xs font-medium text-primary hover:text-primary-dark"
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
