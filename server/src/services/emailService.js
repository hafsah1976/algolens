import { Resend } from 'resend';

function getAppBaseUrl(env = process.env) {
  return (env.APP_BASE_URL || env.CLIENT_ORIGIN || 'http://localhost:5173').replace(/\/+$/, '');
}

function getEmailFrom(env = process.env) {
  return env.EMAIL_FROM || '';
}

function getResendClient(env = process.env) {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(env.RESEND_API_KEY);
}

function getUrlHost(value) {
  try {
    return new URL(value).host;
  } catch (_error) {
    return null;
  }
}

function getSenderDomain(value) {
  const trimmed = String(value || '').trim();
  const bracketMatch = trimmed.match(/<[^@<>]+@([^<>]+)>/);
  const plainMatch = trimmed.match(/^[^@\s<>]+@([^@\s<>]+)$/);
  const domain = bracketMatch?.[1] || plainMatch?.[1] || null;

  return domain ? domain.toLowerCase() : null;
}

export function getEmailReadiness(env = process.env) {
  const appBaseUrl = getAppBaseUrl(env);
  const from = getEmailFrom(env);
  const appBaseUrlHost = getUrlHost(appBaseUrl);
  const fromDomain = getSenderDomain(from);
  const missing = [];
  const invalid = [];

  if (!env.RESEND_API_KEY) {
    missing.push('RESEND_API_KEY');
  }

  if (!env.EMAIL_FROM) {
    missing.push('EMAIL_FROM');
  }

  if (!env.APP_BASE_URL) {
    missing.push('APP_BASE_URL');
  }

  if (env.EMAIL_FROM && !fromDomain) {
    invalid.push('EMAIL_FROM');
  }

  if ((env.APP_BASE_URL || env.CLIENT_ORIGIN) && !appBaseUrlHost) {
    invalid.push('APP_BASE_URL');
  }

  const configured = missing.length === 0 && invalid.length === 0;

  return {
    appBaseUrlHost,
    configured,
    fromDomain,
    invalid,
    missing,
    provider: 'resend',
    state: configured ? 'configured' : 'missing_configuration',
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function accountEmailTemplate({ body, buttonLabel, link, title }) {
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body);
  const safeButtonLabel = escapeHtml(buttonLabel);
  const safeLink = escapeHtml(link);

  return `
    <div style="background:#f7f8f1;padding:32px;font-family:Arial,sans-serif;color:#152019;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e1e5dc;border-radius:24px;padding:32px;">
        <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#5f6e63;">AlgoLens</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.1;">${safeTitle}</h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#536358;">${safeBody}</p>
        <a href="${safeLink}" style="display:inline-block;background:#2f7350;color:#ffffff;text-decoration:none;border-radius:999px;padding:13px 20px;font-weight:700;">${safeButtonLabel}</a>
        <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6f7c72;">If the button does not work, paste this link into your browser:<br>${safeLink}</p>
      </div>
    </div>
  `;
}

async function sendAccountEmail({ body, buttonLabel, link, subject, to }) {
  const resend = getResendClient();
  const from = getEmailFrom();

  if (!resend || !from) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[email disabled] ${subject}: ${link}`);
    }

    return { sent: false, reason: 'email_not_configured' };
  }

  let result;

  try {
    result = await resend.emails.send({
      from,
      html: accountEmailTemplate({ body, buttonLabel, link, title: subject }),
      subject,
      to,
    });
  } catch (error) {
    console.error('Resend email request failed:', error);
    return { sent: false, reason: 'provider_error' };
  }

  const { data, error } = result;

  if (error) {
    console.error('Resend email failed:', error);
    return { sent: false, reason: 'provider_error' };
  }

  return { id: data?.id, sent: true };
}

export function buildPasswordResetUrl(token) {
  return `${getAppBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;
}

export function buildVerificationUrl(token) {
  return `${getAppBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;
}

export function sendPasswordResetEmail({ email, token }) {
  const link = buildPasswordResetUrl(token);

  return sendAccountEmail({
    body: 'Use this secure link to choose a new password. The link expires in one hour.',
    buttonLabel: 'Reset password',
    link,
    subject: 'Reset your AlgoLens password',
    to: email,
  });
}

export function sendVerificationEmail({ email, token }) {
  const link = buildVerificationUrl(token);

  return sendAccountEmail({
    body: 'Confirm your email address so your learning account and admin permissions stay protected.',
    buttonLabel: 'Verify email',
    link,
    subject: 'Verify your AlgoLens email',
    to: email,
  });
}
