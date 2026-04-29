import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const failures = [];
const warnings = [];

async function fileExists(path) {
  try {
    await access(new URL(path, root));
    return true;
  } catch {
    return false;
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, root), 'utf8'));
}

function requireCondition(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function warnIf(condition, message) {
  if (condition) {
    warnings.push(message);
  }
}

const requiredFiles = [
  'AGENTS.md',
  'README.md',
  'client/package.json',
  'client/src/Root.jsx',
  'server/package.json',
  'server/src/app.js',
  'server/src/index.js',
  'tests/product.test.js',
];

for (const path of requiredFiles) {
  requireCondition(await fileExists(path), `Missing expected project file: ${path}`);
}

const rootPackage = await readJson('package.json');
const requiredScripts = [
  'build',
  'build:client',
  'check',
  'dev:client',
  'dev:server',
  'lint',
  'start:server',
  'test',
];

for (const scriptName of requiredScripts) {
  requireCondition(
    Boolean(rootPackage.scripts?.[scriptName]),
    `Missing root package script: ${scriptName}`,
  );
}

const gitignore = await readFile(new URL('.gitignore', root), 'utf8');

requireCondition(gitignore.includes('.env'), '.gitignore should ignore .env files.');
requireCondition(gitignore.includes('!.env.example'), '.gitignore should allow .env.example files.');
requireCondition(gitignore.includes('server/data/*.json'), '.gitignore should ignore local file fallback progress.');

const envExample = await readFile(new URL('server/.env.example', root), 'utf8');
const clientEnvExample = await readFile(new URL('client/.env.example', root), 'utf8');

requireCondition(
  envExample.includes('AUTH_SECRET='),
  'server/.env.example should document AUTH_SECRET.',
);
requireCondition(
  envExample.includes('ADMIN_EMAILS='),
  'server/.env.example should document ADMIN_EMAILS.',
);
requireCondition(
  envExample.includes('CLIENT_ORIGIN='),
  'server/.env.example should document CLIENT_ORIGIN.',
);
requireCondition(
  envExample.includes('JUDGE0_API_URL='),
  'server/.env.example should document JUDGE0_API_URL.',
);
requireCondition(
  clientEnvExample.includes('VITE_API_BASE_URL='),
  'client/.env.example should document VITE_API_BASE_URL.',
);

const legacyFiles = ['src/game.js', 'src/main.js', 'server.js', 'index.html', 'styles.css'];
const presentLegacyFiles = [];

for (const path of legacyFiles) {
  if (await fileExists(path)) {
    presentLegacyFiles.push(path);
  }
}

warnIf(
  presentLegacyFiles.length > 0,
  `Legacy workspace note files still present: ${presentLegacyFiles.join(', ')}`,
);

if (warnings.length) {
  console.warn('Repo health warnings:');
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (failures.length) {
  console.error('Repo health check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Repo health check passed.');
