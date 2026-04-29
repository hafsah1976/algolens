import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildJudge0FailureResult,
  buildJudge0Source,
} from '../server/src/services/judge0Service.js';

test('Judge0 source builder wraps JavaScript functions with stdin and JSON output', () => {
  const source = buildJudge0Source({
    code: 'function findMax(nums) { return Math.max(...nums); }',
    language: 'javascript',
    problemSlug: 'find-maximum-value',
  });

  assert.ok(source.includes("JSON.parse(fs.readFileSync(0, 'utf8'))"));
  assert.ok(source.includes('const result = findMax(input);'));
  assert.ok(source.includes('process.stdout.write(JSON.stringify(result));'));
});

test('Judge0 source builder wraps Python functions with stdin and JSON output', () => {
  const source = buildJudge0Source({
    code: 'def climb_stairs(n):\n    return n',
    language: 'python',
    problemSlug: 'climb-small-stairs',
  });

  assert.ok(source.includes('data = json.loads(sys.stdin.read())'));
  assert.ok(source.includes('result = climb_stairs(data)'));
  assert.ok(source.includes('sys.stdout.write(json.dumps(result))'));
});

test('Judge0 failure result is safe to save and return without hidden case data', () => {
  const result = buildJudge0FailureResult(new Error('Judge0 timed out'), 3);

  assert.equal(result.status, 'judge0_error');
  assert.equal(result.passed, 0);
  assert.equal(result.failed, 3);
  assert.equal(result.totalTests, 3);
  assert.equal(result.error, 'Judge0 timed out');
  assert.deepEqual(result.testResults, []);
});
