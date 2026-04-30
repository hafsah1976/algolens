# AlgoLens

AlgoLens is a contest-ready visual DSA learning app focused on calm, beginner-friendly algorithm understanding.

## Current Status

This repository now contains the foundation for the MVP:

- `client/` - React + Vite + Tailwind frontend with the AlgoLens learning platform UI
- `server/` - Express API with MongoDB-backed auth and progress routes, deployable through Netlify Functions
- `tests/` - Node test coverage for product content, progress logic, step-by-step behavior, sandbox walkthroughs, and session safety

Current standout learning features include authenticated progress, step-by-step lessons, Challenge Mode, shareable walkthrough steps, mental model milestones, Focus Mode, printable study sheets, and Algo-Sandbox.
Seeded reading lessons can also render lightweight custom visualizations for binary search, stacks, queues, BFS, DFS, and bubble sort. Step by step mode remains the primary visualization experience.

## Run Locally

1. Install dependencies:

```bash
npm.cmd install
```

2. Optional but recommended for Step 4+:

Create `server/.env` from `server/.env.example` and point `MONGODB_URI` to your local MongoDB instance.
If MongoDB is not running yet, the API now falls back to a local file store in `server/data/dev-progress.json`.
Set `AUTH_SECRET` before deploying or running with `NODE_ENV=production`.
Production startup also requires a hosted `MONGODB_URI`, a configured `CLIENT_ORIGIN` or
`CLIENT_ORIGINS`, and non-file progress storage.
Set `ADMIN_EMAILS` to a comma-separated list of trusted account emails if you want those users
to access the content admin panel after signup/login, for example `ADMIN_EMAILS=you@example.com`.
For coding execution, set `JUDGE0_API_URL` on the backend. If your Judge0 instance requires a key, set
`JUDGE0_API_KEY`; by default the backend sends it as `X-Auth-Token`, matching Judge0 CE. For RapidAPI,
set `JUDGE0_API_KEY_HEADER=X-RapidAPI-Key` and `JUDGE0_RAPIDAPI_HOST` if your provider requires it.
For local demo execution, the public Judge0 CE endpoint can be used with
`JUDGE0_API_URL=https://ce.judge0.com`, `JUDGE0_LANGUAGE_JAVASCRIPT_ID=63`, and
`JUDGE0_LANGUAGE_PYTHON_ID=71`. Use a private key or hosted plan for production reliability.
For RapidAPI Judge0 CE, use `JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com`,
`JUDGE0_API_KEY_HEADER=X-RapidAPI-Key`, and
`JUDGE0_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com`.

3. Start the backend:

```bash
npm.cmd run dev:server
```

4. Start the frontend in a second terminal:

```bash
npm.cmd run dev:client
```

5. Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The backend health endpoint runs at `http://localhost:3001/api/health`.

Create an account or log in at `http://localhost:5173/auth` before opening dashboard routes under `/app`.

## Netlify Deployment

AlgoLens is configured for one Netlify site that serves both the Vite frontend and
the Express backend. The frontend is published from `client/dist`; the backend is
wrapped by `netlify/functions/api.js`; `/api/*` requests are rewritten to that
function by `netlify.toml`.

When Netlify detects the npm workspace monorepo, use these settings:

```text
Base directory: leave blank
Package directory: client
Build command: npm run build:client
Publish directory: client/dist
Functions directory: netlify/functions
```

Keep `VITE_API_BASE_URL` blank on Netlify so the browser calls same-site `/api/...`
routes. Netlify will route those requests to the backend function.

To validate the Netlify build locally without linking a site:

```bash
npx netlify-cli build --offline --filter client
```

## Environment Variables

Use `server/.env.example` as the source of truth and create a local `server/.env` for private values.
Do not commit `server/.env`.

- `MONGODB_URI` - MongoDB database URL. Required for auth, progress, quizzes, submissions, and admin content management.
- `AUTH_SECRET` - session signing secret. Required when `NODE_ENV=production`; use at least 32 random characters.
- `ADMIN_EMAILS` - comma-separated list of trusted emails that should receive the `admin` role on signup/login.
- `CLIENT_ORIGIN` - deployed frontend origin allowed to call the backend, for example a Netlify URL. Use `CLIENT_ORIGINS` for a comma-separated allowlist.
- `DEMO_USER_EMAIL` and `DEMO_USER_NAME` - legacy file-fallback identity values for older progress testing.
- `PROGRESS_STORAGE_MODE` - `auto`, `mongo`, or `file`; production should use MongoDB.
- `JUDGE0_API_URL` - optional Judge0 endpoint. If empty, submissions save a safe `judge0_error` result instead of executing code.
- `JUDGE0_API_KEY`, `JUDGE0_API_KEY_HEADER`, and `JUDGE0_RAPIDAPI_HOST` - optional Judge0 provider credentials and headers.
- `JUDGE0_LANGUAGE_JAVASCRIPT_ID` and `JUDGE0_LANGUAGE_PYTHON_ID` - Judge0 language ids for the supported starter languages.

Student sessions use an HttpOnly session cookie in normal browser flows. The backend
still accepts bearer tokens as a backward-compatible fallback for older local sessions
and API testing.

## Seed DSA Content

Phase 6, Phase 7, and Phase 9 add an insert-only starter curriculum with 10 topics,
2 beginner lessons per topic, 1 concept-check quiz per topic, and a small beginner
practice problem set.
Make sure MongoDB is running and `server/.env` points at the database you want to seed, then run:

```bash
npm.cmd run seed:dsa
```

The seed is idempotent. It checks topic slugs, lesson slugs, quiz titles, and problem
slugs before inserting, so running it twice skips existing records instead of duplicating
or overwriting them. If you need to change production content later, edit it intentionally
through a dedicated migration or admin workflow instead of relying on this starter seed.
For Phase 8, rerunning the seed also fills missing starter `visualizationType` values
when they are still set to `none`.

Useful student routes:

- `/app/dashboard` - authenticated student hub
- `/app/topics` - DSA topic catalog
- `/app/topics/:topicSlug` - topic detail and ordered lessons
- `/app/lessons/:lessonSlug` - working step-by-step lesson route
- `/app/quizzes/:quizId` - authenticated concept-check quiz
- `/app/practice` - coding practice list
- `/app/practice/:problemSlug` - coding problem detail and submission intake
- `/app/traces` - step-by-step examples
- `/admin/topics` - admin-only topic management
- `/admin/lessons` - admin-only lesson management
- `/admin/quizzes` - admin-only quiz creation
- `/admin/problems` - admin-only coding problem creation

The shorter routes from the phase plan (`/dashboard`, `/topics`, `/topics/:topicSlug`, and `/lessons/:lessonSlug`) redirect into the authenticated `/app/...` workspace.

## Admin Content Management

Phase 11 adds a small admin panel for content operations. To use it locally:

1. Add your account email to `ADMIN_EMAILS` in `server/.env`.
2. Restart the backend.
3. Sign up or sign in with that email.
4. Open `http://localhost:5173/admin/topics`.

Admin users can create/edit/publish topics and lessons, create quizzes, and create coding
problems. Student-facing APIs still only return published content, so drafts remain hidden
until you publish them from the admin panel.

## Backend Progress API

- `GET /api/admin/topics`
- `POST /api/admin/topics`
- `PUT /api/admin/topics/:topicId`
- `GET /api/admin/lessons`
- `POST /api/admin/lessons`
- `PUT /api/admin/lessons/:lessonId`
- `GET /api/admin/quizzes`
- `POST /api/admin/quizzes`
- `GET /api/admin/problems`
- `POST /api/admin/problems`
- `GET /api/dashboard/me`
- `GET /api/topics`
- `GET /api/topics/:slug`
- `GET /api/topics/:slug/lessons`
- `GET /api/lessons/:slug`
- `GET /api/problems`
- `GET /api/problems/:slug`
- `POST /api/problems/:slug/submit`
- `GET /api/quizzes/topic/:topicId`
- `GET /api/quizzes/:quizId`
- `POST /api/quizzes/:quizId/submit`
- `GET /api/progress/me`
- `GET /api/progress`
- `POST /api/progress/lesson`
- `PUT /api/progress/topic`

Published topics and lessons are public read APIs. Signed-in users save progress under their own account through protected progress APIs. Frontend dashboard routes require authentication. The backend still supports the legacy `GET /api/progress` demo-safe progress endpoint for fallback testing.
Quiz read APIs hide correct answers and explanations before submission. Quiz submissions
are protected, graded on the backend, and saved as `QuizAttempt` records for the signed-in user.
Practice problem detail APIs expose only public test cases. Practice submissions are
protected, sent from the backend to Judge0, run against public and hidden tests, and saved as
`Submission` records with pass/fail totals, runtime, memory, and safe error output. If Judge0
is unavailable or not configured, the backend saves a `judge0_error` result instead of crashing.
You can control storage with `PROGRESS_STORAGE_MODE=auto|mongo|file`.

## Validation

Run the full local submission check:

```bash
npm.cmd run check
```

Or run checks one at a time:

```bash
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

`npm.cmd run lint` runs a lightweight repo-health check. It may warn about legacy workspace note files, but warnings do not fail the check.
Backend and shared logic tests use Node's built-in test runner through `npm.cmd test`.
There is no separate frontend unit-test framework installed yet; the current frontend validation is the production Vite build plus shared React data/helper tests. If the project grows further, add a minimal Vitest + Testing Library setup rather than a large test stack.

## Production Readiness Notes

- Student content APIs return published topics, lessons, quizzes, and problems only.
- Admin content APIs require both authentication and the `admin` role.
- Unknown API routes return JSON errors; unknown frontend routes show a small not-found page.
- External code execution is backend-only. The frontend never calls Judge0 directly, and hidden test cases are not sent to the browser.
- Local `.env` files and file-fallback progress JSON are ignored by Git.

## Submission Materials

- [Contest submission summary](docs/CONTEST_SUBMISSION.md)
- [Deploy and submit guide](docs/DEPLOY_AND_SUBMIT.md)
- [Demo script](docs/DEMO_SCRIPT.md)
- [QA checklist](docs/QA_CHECKLIST.md)
- [Commercial launch checklist](docs/COMMERCIAL_LAUNCH_CHECKLIST.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [Content guide](docs/CONTENT_GUIDE.md)

## Repo Notes

The active application lives in `client/` and `server/`. Some root starter files may still exist as legacy workspace notes; they are not part of the production app path.
