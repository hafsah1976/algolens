# AlgoLens Deploy and Submit Guide

This is the start-here guide for getting AlgoLens from your laptop to GitHub, deployed URLs, and a contest submission.

## 1. Final local check

From the project root:

```powershell
npm.cmd install
npm.cmd run check
```

The check should pass tests and build. The current legacy-file and bundle-size warnings are non-blocking.

## 2. Confirm files that should not be uploaded

Do not upload private environment files:

- `server/.env`
- `client/.env`
- any file containing passwords, MongoDB credentials, API keys, or Judge0 keys

This repo already ignores `.env` files, but still do a quick check:

```powershell
git status --short
```

If you ever see `server/.env` or `client/.env` listed, stop before pushing.

## 3. Upload to GitHub

### Option A: GitHub website plus command line

1. Go to GitHub and create a new empty repository named `algolens`.
2. Do not add a README, license, or `.gitignore` on GitHub, because this project already has them locally.
3. In PowerShell from the project root, run:

```powershell
git add .
git commit -m "Prepare AlgoLens for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/algolens.git
git push -u origin main
```

If `origin` already exists, use:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/algolens.git
git push -u origin main
```

### Option B: GitHub CLI

If you have GitHub CLI installed and authenticated:

```powershell
gh repo create algolens --public --source=. --remote=origin --push
```

Use `--private` instead of `--public` if the contest allows private repositories before submission.

## 4. Create MongoDB Atlas database

1. Create a MongoDB Atlas project and cluster.
2. Create a database user.
3. Allow network access for Netlify Functions. For a contest MVP, Atlas `0.0.0.0/0`
   is the practical serverless option; keep the database username/password strong.
4. Copy the application connection string.
5. Replace `<password>` and database name in the URI.

Example shape:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster-name.mongodb.net/algolens
```

Keep this URI private.

## 5. Deploy backend on Netlify Functions

AlgoLens is configured so Netlify can host both the Vite frontend and the Express API.
The backend runs as a Netlify Function through `netlify/functions/api.js`.

1. Create a new Netlify site from your GitHub repo.
2. Use these settings:

```text
Base directory: leave blank
Package directory: client
Build command: npm run build:client
Publish directory: client/dist
Functions directory: netlify/functions
```

3. Add environment variables in Netlify:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
AUTH_SECRET=a_long_random_secret
PROGRESS_STORAGE_MODE=mongo
ADMIN_EMAILS=your_email@example.com
CLIENT_ORIGIN=https://your-netlify-site.netlify.app
```

4. Optional Judge0 variables:

```env
JUDGE0_API_URL=https://ce.judge0.com
JUDGE0_API_KEY=
JUDGE0_API_KEY_HEADER=X-Auth-Token
JUDGE0_RAPIDAPI_HOST=
JUDGE0_LANGUAGE_JAVASCRIPT_ID=63
JUDGE0_LANGUAGE_PYTHON_ID=71
```

The public CE endpoint is useful for demos. For production reliability, switch to a hosted/private
Judge0 provider and add its API key instead of depending on the public endpoint.

If you use RapidAPI Judge0 CE, use this shape:

```env
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
JUDGE0_API_KEY_HEADER=X-RapidAPI-Key
JUDGE0_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
JUDGE0_LANGUAGE_JAVASCRIPT_ID=63
JUDGE0_LANGUAGE_PYTHON_ID=71
```

5. After deploy, verify:

```text
https://your-netlify-site.netlify.app/api/health
```

You should see JSON.

## 6. Seed production content

You can seed from your laptop after setting `MONGODB_URI` in `server/.env`, or from a backend shell if your host provides one.

Local option:

```powershell
npm.cmd run seed:dsa
```

The seed is idempotent, so running it twice will not duplicate topics, lessons, quizzes, or problems.

## 7. Frontend API setting

Because the frontend and backend are both on Netlify under the same site, keep this blank unless
you later move the backend elsewhere:

```env
VITE_API_BASE_URL=
```

Leaving it blank makes the browser call `/api/...`, which Netlify rewrites to the API function.

## 8. Final production QA

Open the deployed frontend and test:

- Landing page loads.
- Signup works.
- Login works.
- Dashboard loads.
- Topics load from MongoDB.
- Step-by-step lesson opens.
- Lesson completion saves progress.
- Quiz submits and shows explanations.
- Practice problem submits and shows a safe result.
- Non-admin users cannot open `/admin/topics`.
- Admin email can open `/admin/topics`.
- Unknown routes show the not-found screen.

Use the full QA checklist: [QA_CHECKLIST.md](QA_CHECKLIST.md).

## 9. Prepare contest submission

Use these files:

- [CONTEST_SUBMISSION.md](CONTEST_SUBMISSION.md) for the written summary.
- [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for your video or live walkthrough.
- [QA_CHECKLIST.md](QA_CHECKLIST.md) for final verification.
- [CONTENT_GUIDE.md](CONTENT_GUIDE.md) if you add more content before submitting.

Suggested submission fields:

```text
Project name: AlgoLens
Tagline: Learn smarter, not longer.
GitHub repo: https://github.com/YOUR_USERNAME/algolens
Live demo: https://your-netlify-site.netlify.app
Backend health check: https://your-netlify-site.netlify.app/api/health
```

## 10. Official references

- GitHub: adding locally hosted code to GitHub
  https://docs.github.com/articles/adding-an-existing-project-to-github-using-the-command-line
- GitHub CLI: `gh repo create`
  https://cli.github.com/manual/gh_repo_create
- Netlify Vite deployment
  https://docs.netlify.com/frameworks/vite/
- Netlify build configuration
  https://docs.netlify.com/configure-builds/get-started/
- Netlify Functions overview
  https://docs.netlify.com/build/functions/overview/
- Express on Netlify
  https://docs.netlify.com/build/frameworks/framework-setup-guides/express/
- MongoDB Atlas connection strings
  https://www.mongodb.com/docs/atlas/connect-to-cluster/
