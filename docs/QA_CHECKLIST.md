# AlgoLens QA Checklist

Use this before recording a demo or submitting the project.

## Local startup

- `npm.cmd install` completes.
- MongoDB is running.
- `server/.env` exists and includes `MONGODB_URI`, `AUTH_SECRET`, and optional `ADMIN_EMAILS`.
- Commercial auth email testing includes `RESEND_API_KEY`, `EMAIL_FROM`, and `APP_BASE_URL`.
- `npm.cmd run dev:server` starts the API.
- `npm.cmd run dev:client` starts Vite.
- `npm.cmd run check` passes.

## Student flow

- Landing page opens at `http://localhost:5173`.
- Signup creates a new account.
- Login works for an existing account.
- Signup shows an email verification reminder on the dashboard.
- Forgot password sends a generic success response and a reset email for known accounts.
- Reset password changes the password and requires signing in again.
- Logged-out users are redirected from `/app/dashboard` to `/auth`.
- Dashboard loads without crashing.
- Dashboard shows empty states for new users.
- `/app/topics` shows topic cards.
- A topic page opens and shows lessons.
- A step-by-step lesson opens.
- Step by step next, previous, restart, challenge mode, and share-step behavior work.
- Completing a lesson updates dashboard progress.
- Quiz page loads, submits answers, and shows explanations.
- Practice list loads.
- Practice detail loads.
- Submitting code creates a result panel, even when Judge0 is not configured.

## Admin flow

- Non-admin users cannot access `/admin/topics`.
- Admin email is listed in `ADMIN_EMAILS`.
- Admin account email is verified before testing admin pages.
- Admin user can open `/admin/topics`.
- Unverified admin-listed accounts are redirected away from `/admin/topics`.
- Admin can create a draft topic.
- Draft topic does not appear to students.
- Publishing the topic makes it visible to students.
- Admin can create/edit/publish a lesson.
- Admin can create a quiz.
- Admin can create a coding problem.

## Production readiness

- No `.env` file is committed.
- `server/.env.example` and `client/.env.example` are up to date.
- Public `/privacy`, `/terms`, and `/support` pages load.
- Unknown frontend routes show a not-found screen.
- Unknown API routes return JSON errors.
- Judge0 settings are documented and optional.
- Hidden coding test cases are not exposed to the frontend.
- Run the commercial launch checklist in `docs/COMMERCIAL_LAUNCH_CHECKLIST.md`.
