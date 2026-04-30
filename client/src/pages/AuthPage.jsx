import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthLoadingScreen } from '../components/RequireAuth.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getAuthReturnPath } from '../lib/authRouting.js';

const emptyForm = {
  email: '',
  name: '',
  password: '',
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateAuthForm(form, isSignup) {
  const nextErrors = {};

  if (isSignup && form.name.trim().length < 2) {
    nextErrors.name = 'Enter at least 2 characters for your name.';
  }

  if (!validateEmail(form.email)) {
    nextErrors.email = 'Enter a valid email address.';
  }

  if (isSignup) {
    if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    } else if (!/[a-z]/i.test(form.password) || !/\d/.test(form.password)) {
      nextErrors.password = 'Password must include at least one letter and one number.';
    }
  } else if (!form.password) {
    nextErrors.password = 'Enter your password.';
  }

  return nextErrors;
}

function VisibilityIcon({ visible }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      {visible ? null : <path d="m4 4 16 16" />}
    </svg>
  );
}

function AuthField({
  autoComplete,
  error,
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</span>
      <input
        autoComplete={autoComplete}
        className={`mt-2 w-full rounded-[1rem] border bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10 ${
          error ? 'border-rose-300' : 'border-line/80'
        }`}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error ? <span className="mt-2 block text-sm leading-5 text-rose-700">{error}</span> : null}
    </label>
  );
}

function PasswordField({ autoComplete, error, onChange, showPassword, value, onToggle }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Password</span>
      <div className="relative mt-2">
        <input
          autoComplete={autoComplete}
          className={`w-full rounded-[1rem] border bg-white/80 px-4 py-3 pr-12 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10 ${
            error ? 'border-rose-300' : 'border-line/80'
          }`}
          onChange={(event) => onChange(event.target.value)}
          placeholder="At least 8 characters"
          type={showPassword ? 'text' : 'password'}
          value={value}
        />
        <button
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition hover:bg-accent/10 hover:text-accent"
          onClick={onToggle}
          type="button"
        >
          <VisibilityIcon visible={showPassword} />
        </button>
      </div>
      {error ? <span className="mt-2 block text-sm leading-5 text-rose-700">{error}</span> : null}
    </label>
  );
}

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { error: sessionError, isAuthenticated, isLoading, login, logout, signup, user } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === 'signup';
  const returnTo = getAuthReturnPath(location.state?.from);

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setError(null);
    setFieldErrors({});
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [field]: null,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const nextFieldErrors = validateAuthForm(form, isSignup);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignup) {
        await signup(form);
      } else {
        await login(form);
      }

      navigate(returnTo, { replace: true });
    } catch (authError) {
      setError(authError.message || 'Could not complete authentication.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return (
      <main className="relative isolate min-h-screen overflow-hidden px-6 py-8 sm:px-8">
        <div className="orb orb--left" aria-hidden="true" />
        <div className="mx-auto max-w-3xl">
          <Link className="text-sm font-semibold text-accent" to="/">
            Back to landing
          </Link>

          <section className="app-panel mt-8 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Account</p>
            <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">
              You are signed in.
            </h1>
            <p className="mt-4 text-base leading-7 text-muted">
              AlgoLens is saving progress for {user.name} at {user.email}.
            </p>
            {sessionError ? (
              <div className="mt-5 rounded-[1rem] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
                {sessionError}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
                to="/app/dashboard"
              >
                Open dashboard
              </Link>
              <button
                className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
                onClick={logout}
                type="button"
              >
                Sign out
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-8 sm:px-8">
      <div className="orb orb--left" aria-hidden="true" />
      <div className="orb orb--right" aria-hidden="true" />

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(360px,0.65fr)] lg:items-center">
        <section>
          <Link className="text-sm font-semibold text-accent" to="/">
            Back to landing
          </Link>
          <p className="mt-16 text-xs font-semibold uppercase tracking-[0.24em] text-muted">AlgoLens accounts</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[0.98] tracking-[-0.04em] text-ink sm:text-6xl">
            Keep your step-by-step progress attached to you.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            Sign in before a lesson and AlgoLens will load your saved frames, completed lessons,
            and topic progress across sessions.
          </p>
          {sessionError ? (
            <div className="mt-6 max-w-xl rounded-[1rem] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
              {sessionError}
            </div>
          ) : null}
        </section>

        <section className="app-panel p-6 sm:p-8">
          <div className="flex rounded-full border border-line/80 bg-white/60 p-1 text-sm font-semibold">
            <button
              className={`flex-1 rounded-full px-4 py-2 transition ${!isSignup ? 'bg-accent text-white' : 'text-muted'}`}
              onClick={() => handleModeChange('login')}
              type="button"
            >
              Log in
            </button>
            <button
              className={`flex-1 rounded-full px-4 py-2 transition ${isSignup ? 'bg-accent text-white' : 'text-muted'}`}
              onClick={() => handleModeChange('signup')}
              type="button"
            >
              Sign up
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <AuthField
                autoComplete="name"
                error={fieldErrors.name}
                label="Name"
                onChange={(value) => updateField('name', value)}
                placeholder="Maya"
                value={form.name}
              />
            ) : null}

            <AuthField
              autoComplete="email"
              error={fieldErrors.email}
              label="Email"
              onChange={(value) => updateField('email', value)}
              placeholder="you@example.com"
              type="email"
              value={form.email}
            />

            <PasswordField
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              error={fieldErrors.password}
              onChange={(value) => updateField('password', value)}
              onToggle={() => setShowPassword((current) => !current)}
              showPassword={showPassword}
              value={form.password}
            />

            {isSignup ? (
              <p className="text-sm leading-6 text-muted">
                Use at least 8 characters, including one letter and one number.
              </p>
            ) : null}

            {error ? (
              <div className="rounded-[1rem] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Working…' : isSignup ? 'Create account' : 'Log in'}
            </button>
          </form>

          <p className="mt-5 text-sm leading-6 text-muted">
            Your account keeps lesson progress, step-by-step checkpoints, quiz attempts, and coding
            practice activity connected to your learning profile.
          </p>
        </section>
      </div>
    </main>
  );
}
