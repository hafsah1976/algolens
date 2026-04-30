import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { requestPasswordReset, resetPassword, verifyEmailToken } from '../lib/authApi.js';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePassword(password) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (!/[a-z]/i.test(password) || !/\d/.test(password)) {
    return 'Password must include at least one letter and one number.';
  }

  return null;
}

function AccountShell({ children, eyebrow, title, description }) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-8 sm:px-8">
      <div className="orb orb--left" aria-hidden="true" />
      <div className="orb orb--right" aria-hidden="true" />

      <div className="mx-auto max-w-2xl">
        <Link className="text-sm font-semibold text-accent" to="/auth">
          Back to sign in
        </Link>
        <section className="app-panel mt-8 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">{title}</h1>
          <p className="mt-4 text-base leading-7 text-muted">{description}</p>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

function StatusMessage({ children, tone = 'neutral' }) {
  const toneClass =
    tone === 'error'
      ? 'border-rose-200 bg-rose-50/90 text-rose-700'
      : 'border-accent/20 bg-accent/10 text-accent';

  return (
    <div className={`rounded-[1rem] border px-4 py-3 text-sm leading-6 ${toneClass}`}>
      {children}
    </div>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Enter the email address for your AlgoLens account.');
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (resetError) {
      setError(resetError.message || 'Could not request a reset link.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AccountShell
      description="Enter your account email. If it exists, we will send a secure reset link without revealing account details."
      eyebrow="Account recovery"
      title="Reset your password"
    >
      {sent ? (
        <div className="space-y-5">
          <StatusMessage>
            If an AlgoLens account exists for that email, a reset link has been sent.
          </StatusMessage>
          <Link
            className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink"
            to="/auth"
          >
            Return to sign in
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Email</span>
            <input
              autoComplete="email"
              className="mt-2 w-full rounded-[1rem] border border-line/80 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
          </label>
          {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
          <button
            className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}
    </AccountShell>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const passwordError = validatePassword(password);

    if (!token) {
      setError('This reset link is missing its secure token.');
      return;
    }

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Both password fields must match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({ password, token });
      setSuccess(true);
    } catch (resetError) {
      setError(resetError.message || 'Could not reset your password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AccountShell
      description="Choose a new password. For safety, you will sign in again after the reset is complete."
      eyebrow="Secure reset"
      title="Create a new password"
    >
      {success ? (
        <div className="space-y-5">
          <StatusMessage>Your password was updated. Sign in with the new password.</StatusMessage>
          <Link
            className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink"
            to="/auth"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">New password</span>
            <input
              autoComplete="new-password"
              className="mt-2 w-full rounded-[1rem] border border-line/80 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              type="password"
              value={password}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Confirm password</span>
            <input
              autoComplete="new-password"
              className="mt-2 w-full rounded-[1rem] border border-line/80 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat new password"
              type="password"
              value={confirmPassword}
            />
          </label>
          {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
          <button
            className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Updating...' : 'Update password'}
          </button>
        </form>
      )}
    </AccountShell>
  );
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { refreshCurrentUser } = useAuth();
  const token = searchParams.get('token') ?? '';
  const [state, setState] = useState({
    error: null,
    isLoading: Boolean(token),
    success: false,
  });

  useEffect(() => {
    let ignore = false;

    if (!token) {
      setState({
        error: 'This verification link is missing its secure token.',
        isLoading: false,
        success: false,
      });
      return () => {
        ignore = true;
      };
    }

    verifyEmailToken(token)
      .then(() => refreshCurrentUser().catch(() => null))
      .then(() => {
        if (!ignore) {
          setState({ error: null, isLoading: false, success: true });
        }
      })
      .catch((verifyError) => {
        if (!ignore) {
          setState({
            error: verifyError.message || 'Could not verify this email link.',
            isLoading: false,
            success: false,
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  return (
    <AccountShell
      description="We are checking the secure link from your email."
      eyebrow="Email verification"
      title="Verify your email"
    >
      {state.isLoading ? <p className="text-sm leading-6 text-muted">Verifying email...</p> : null}
      {state.error ? <StatusMessage tone="error">{state.error}</StatusMessage> : null}
      {state.success ? (
        <div className="space-y-5">
          <StatusMessage>Your email is verified. Your account protections are up to date.</StatusMessage>
          <Link
            className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink"
            to="/app/dashboard"
          >
            Open dashboard
          </Link>
        </div>
      ) : null}
    </AccountShell>
  );
}
