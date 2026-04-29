# AGENTS.md

## Project summary

This is a MERN-based DSA learning platform. The app already has authentication, login/signup, a dashboard, and several user-facing pages. The goal is to salvage the existing codebase and gradually add DSA learning features: topics, lessons, quizzes, progress tracking, visualizations, and coding practice.

## Tech stack

- MongoDB
- Express.js
- React
- Node.js
- JavaScript or TypeScript depending on existing repo
- Use existing project style and folder structure where possible

## Main rules

- Do not rebuild the project from scratch.
- Preserve existing authentication, dashboard, routing, and user flows unless broken.
- Prefer small, reviewable pull requests.
- Avoid large rewrites unless absolutely necessary.
- Add tests where practical.
- Keep backward compatibility with existing user data where possible.
- Use environment variables for secrets and external services.
- Do not commit `.env` files.
- Document any new setup steps in `README.md`.

## Before coding

1. Inspect the repo structure.
2. Identify frontend and backend folders.
3. Identify existing auth flow.
4. Identify current route structure.
5. Identify current database models.
6. Identify package manager and scripts.
7. Run install, lint, build, and tests if available.

## Validation commands

Use the actual commands from `package.json`. If available, run:

```bash
npm install
npm run lint
npm run test
npm run build
```

If the repo has separate client/server folders, run validation in both.

## Coding style

- Follow existing naming conventions.
- Reuse existing components and layout.
- Keep API responses consistent.
- Add loading and error states in the UI.
- Prefer clear, simple code over clever abstractions.

## Pull request expectations

Each task should include:

- Summary of changes
- Files changed
- How to test
- Any migrations or environment variables needed
