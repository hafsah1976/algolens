# AlgoLens Commercial Launch Checklist

Use this before publishing AlgoLens beyond a contest/demo audience.

## Required before public launch

- Netlify production deploy succeeds from the `main` branch.
- `/api/health` reports `database.state` as `connected` and `progressStorage.mode` as `mongo`.
- `MONGODB_URI` points to MongoDB Atlas or another hosted production database.
- `AUTH_SECRET` is at least 32 random characters and has not been committed.
- `CLIENT_ORIGIN` matches the production site URL.
- `APP_BASE_URL` matches the production site URL used in email links.
- `PROGRESS_STORAGE_MODE=mongo`.
- `ADMIN_EMAILS` contains only trusted maintainer emails.
- `RESEND_API_KEY` and `EMAIL_FROM` are set for password reset and verification emails.
- RapidAPI Judge0 uses `JUDGE0_API_KEY_HEADER=X-RapidAPI-Key`.
- `server/.env` is ignored by Git and no secret values appear in committed files.

## Trust and policy checks

- Public Privacy Policy page works at `/privacy`.
- Public Terms page works at `/terms`.
- Public Support page works at `/support`.
- Legal/policy text is reviewed before paid or broad commercial launch.
- Password reset and email verification are implemented and tested with a real inbox.

## Product QA

- New user signup starts with empty dashboard progress.
- Existing user login preserves saved progress.
- Logged-out users are redirected from `/app/dashboard` to `/auth`.
- Non-admin users are redirected away from `/admin/*`.
- Admin users can create and publish content.
- Step-by-step examples support next, previous, restart, challenge mode, and completion.
- Quizzes hide answers before submission and show explanations after submission.
- Practice submissions create a safe result panel whether Judge0 succeeds or fails.
- Calm mode and focus mode remain readable on desktop and mobile.

## Security checks

- `npm.cmd run check` passes.
- `npm.cmd audit --omit=dev` reports no production vulnerabilities.
- Secret scan reports no committed secret-like values.
- Netlify response headers include CSP, frame protection, referrer policy, permissions policy, and HSTS.
- Backend rejects state-changing requests from untrusted origins.
- Admin endpoints require authentication, configured admin email membership, and verified email status.
- Graph dependencies are covered by `docs/THIRD_PARTY_NOTICES.md`.

## Operational checks

- MongoDB Atlas backups are enabled.
- Netlify deploy rollback is understood and available.
- Judge0 quota, pricing, and failure behavior are understood.
- A maintainer knows where to check Netlify function logs.
- A support path exists for login, content, or coding-practice issues.
