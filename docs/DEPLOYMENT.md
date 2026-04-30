# AlgoLens Deployment Guide

AlgoLens is a MERN app with a static Vite frontend and an Express/MongoDB backend.

## Recommended deployment shape

- Frontend: Netlify static hosting
- Backend: Netlify Functions wrapping the Express app
- Database: MongoDB Atlas
- Optional code execution: Judge0 hosted API

## Netlify backend deployment

The Express backend is exposed through `netlify/functions/api.js` and the `/api/*`
rewrite in `netlify.toml`.

Netlify build command:

```bash
npm run build:client
```

Publish directory:

```text
client/dist
```

Functions directory:

```text
netlify/functions
```

If Netlify detects the npm workspace monorepo, use:

```text
Base directory: leave blank
Package directory: client
```

Required environment variables:

- `MONGODB_URI`
- `AUTH_SECRET`
- `CLIENT_ORIGIN`
- `APP_BASE_URL`

Recommended environment variables:

- `NODE_ENV=production`
- `ADMIN_EMAILS`
- `PROGRESS_STORAGE_MODE=mongo`
- `RESEND_API_KEY`
- `EMAIL_FROM`

`APP_BASE_URL` should be the public Netlify URL used in password reset and email
verification links. `EMAIL_FROM` must be a sender verified in Resend before broad launch.

Optional Judge0 variables:

- `JUDGE0_API_URL`
- `JUDGE0_API_KEY`
- `JUDGE0_API_KEY_HEADER`
- `JUDGE0_RAPIDAPI_HOST`
- `JUDGE0_LANGUAGE_JAVASCRIPT_ID`
- `JUDGE0_LANGUAGE_PYTHON_ID`

For a quick demo, use `JUDGE0_API_URL=https://ce.judge0.com`,
`JUDGE0_LANGUAGE_JAVASCRIPT_ID=63`, and `JUDGE0_LANGUAGE_PYTHON_ID=71`.
For production, use a hosted/private Judge0 provider and configure its API key.
For RapidAPI Judge0 CE, set `JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com`,
`JUDGE0_API_KEY_HEADER=X-RapidAPI-Key`, and
`JUDGE0_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com`.

Frontend API setting:

```env
VITE_API_BASE_URL=
```

Keep `VITE_API_BASE_URL` blank when frontend and backend are on the same Netlify site.
The app will call `/api/...`, and Netlify will rewrite those requests to the API function.

For the complete GitHub-to-submission walkthrough, use [DEPLOY_AND_SUBMIT.md](DEPLOY_AND_SUBMIT.md).

## Seed production content

After the backend has `MONGODB_URI` configured, run the seed once against the production database:

```bash
npm run seed:dsa
```

The seed is idempotent and does not duplicate existing records.

## Pre-submit verification

Run locally before deployment:

```bash
npm.cmd run check
npx netlify-cli build --offline --filter client
```

After deployment, verify:

- Frontend loads.
- Backend `/api/health` returns JSON.
- Signup/login works.
- Forgot password and email verification send real emails through Resend.
- Dashboard loads for a signed-in user.
- Published topics and lessons appear.
- Admin routes reject non-admins and admin-listed users whose emails are not verified.
- Judge0 failures are handled gracefully if Judge0 is not configured.
