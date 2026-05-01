import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const rootDir = path.resolve(import.meta.dirname, '..');

async function readSource(relativePath) {
  return readFile(path.join(rootDir, relativePath), 'utf8');
}

test('landing page keeps the primary commercial CTA focused on account creation', async () => {
  const source = await readSource('client/src/pages/LandingPage.jsx');

  assert.match(source, /Create account/);
  assert.match(source, /\/auth\?mode=signup/);
  assert.doesNotMatch(source, /Open step-by-step examples/);
});

test('learner-facing practice pages avoid judge-language copy', async () => {
  const listPage = await readSource('client/src/pages/PracticeListPage.jsx');
  const detailPage = await readSource('client/src/pages/PracticeProblemPage.jsx');

  assert.doesNotMatch(listPage, /public checks/i);
  assert.doesNotMatch(detailPage, /public checks/i);
  assert.match(listPage, /sample tests/i);
  assert.match(detailPage, /Sample test/i);
});

test('authenticated app shell exposes accessibility and analytics guardrails', async () => {
  const layout = await readSource('client/src/layouts/AppLayout.jsx');

  assert.match(layout, /Skip to main content/);
  assert.match(layout, /id="main-content"/);
  assert.match(layout, /LearnerAnalytics/);
});

test('admin and student route inventory includes current commercial surfaces', async () => {
  const root = await readSource('client/src/Root.jsx');

  assert.match(root, /path="overview"/);
  assert.match(root, /AdminOverviewPage/);
  assert.match(root, /path="graphs"/);
  assert.match(root, /path="practice\/:problemSlug"/);
});

test('topic lesson cards present one clear walkthrough action', async () => {
  const topicPage = await readSource('client/src/pages/TopicPage.jsx');
  const lessonMeta = await readSource('client/src/lib/lessonMeta.js');

  assert.doesNotMatch(topicPage, /Start fresh/);
  assert.match(lessonMeta, /Run walkthrough/);
});
