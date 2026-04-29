const DEFAULT_LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
};

const JUDGE0_FIELDS = [
  'stdout',
  'stderr',
  'compile_output',
  'message',
  'status',
  'time',
  'memory',
  'token',
].join(',');

const problemHarnesses = {
  'climb-small-stairs': {
    javascript: 'const result = climbStairs(input);',
    python: 'result = climb_stairs(data)',
  },
  'count-a-character': {
    javascript: 'const result = countChar(input.text, input.target);',
    python: 'result = count_char(data["text"], data["target"])',
  },
  'find-maximum-value': {
    javascript: 'const result = findMax(input);',
    python: 'result = find_max(data)',
  },
  'is-sorted-ascending': {
    javascript: 'const result = isSortedAscending(input);',
    python: 'result = is_sorted_ascending(data)',
  },
  'serve-the-queue': {
    javascript: 'const result = serveQueue(input.names, input.k);',
    python: 'result = serve_queue(data["names"], data["k"])',
  },
  'valid-parentheses-lite': {
    javascript: 'const result = isValidParentheses(input);',
    python: 'result = is_valid_parentheses(data)',
  },
};

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function getJudge0ApiUrl() {
  return process.env.JUDGE0_API_URL ? trimTrailingSlash(process.env.JUDGE0_API_URL) : null;
}

function getLanguageId(language) {
  const normalizedLanguage = String(language ?? '').toLowerCase();
  const envKey = `JUDGE0_LANGUAGE_${normalizedLanguage.toUpperCase()}_ID`;
  const configuredId = Number(process.env[envKey]);

  if (Number.isInteger(configuredId) && configuredId > 0) {
    return configuredId;
  }

  return DEFAULT_LANGUAGE_IDS[normalizedLanguage] ?? null;
}

function getJudge0Headers() {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (process.env.JUDGE0_API_KEY) {
    headers[process.env.JUDGE0_API_KEY_HEADER || 'X-Auth-Token'] = process.env.JUDGE0_API_KEY;
  }

  if (process.env.JUDGE0_RAPIDAPI_HOST) {
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_RAPIDAPI_HOST;
  }

  return headers;
}

function toExpectedOutput(value) {
  return JSON.stringify(value);
}

function buildJavaScriptSource({ code, problemSlug }) {
  const harness = problemHarnesses[problemSlug]?.javascript;

  if (!harness) {
    throw new Error(`No JavaScript harness is configured for ${problemSlug}.`);
  }

  return `${code}

const fs = require('fs');
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
${harness}
process.stdout.write(JSON.stringify(result));`;
}

function buildPythonSource({ code, problemSlug }) {
  const harness = problemHarnesses[problemSlug]?.python;

  if (!harness) {
    throw new Error(`No Python harness is configured for ${problemSlug}.`);
  }

  return `${code}

import sys
import json

data = json.loads(sys.stdin.read())
${harness}
sys.stdout.write(json.dumps(result))`;
}

export function buildJudge0Source({ code, language, problemSlug }) {
  if (language === 'javascript') {
    return buildJavaScriptSource({ code, problemSlug });
  }

  if (language === 'python') {
    return buildPythonSource({ code, problemSlug });
  }

  throw new Error(`Unsupported language: ${language}.`);
}

function createJudge0Payload({ code, language, problemSlug, testCase }) {
  const languageId = getLanguageId(language);

  if (!languageId) {
    throw new Error(`No Judge0 language id is configured for ${language}.`);
  }

  return {
    cpu_time_limit: 2,
    expected_output: toExpectedOutput(testCase.expectedOutput),
    language_id: languageId,
    memory_limit: 128000,
    source_code: buildJudge0Source({ code, language, problemSlug }),
    stdin: JSON.stringify(testCase.input),
    wall_time_limit: 5,
  };
}

async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

async function submitWithWait({ apiUrl, payload }) {
  const url = `${apiUrl}/submissions?base64_encoded=false&wait=true&fields=${encodeURIComponent(
    JUDGE0_FIELDS,
  )}`;
  const response = await fetch(url, {
    body: JSON.stringify(payload),
    headers: getJudge0Headers(),
    method: 'POST',
  });
  const body = await readJsonResponse(response);

  if (response.ok) {
    return body;
  }

  if (response.status === 400 && body?.error?.toLowerCase?.().includes('wait')) {
    return null;
  }

  throw new Error(body?.error || `Judge0 submission failed with status ${response.status}.`);
}

async function createSubmissionToken({ apiUrl, payload }) {
  const response = await fetch(`${apiUrl}/submissions?base64_encoded=false`, {
    body: JSON.stringify(payload),
    headers: getJudge0Headers(),
    method: 'POST',
  });
  const body = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(body?.error || `Judge0 submission failed with status ${response.status}.`);
  }

  if (!body?.token) {
    throw new Error('Judge0 did not return a submission token.');
  }

  return body.token;
}

async function pollSubmission({ apiUrl, token }) {
  const maxAttempts = Number(process.env.JUDGE0_POLL_ATTEMPTS) || 8;
  const pollDelayMs = Number(process.env.JUDGE0_POLL_DELAY_MS) || 700;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetch(
      `${apiUrl}/submissions/${token}?base64_encoded=false&fields=${encodeURIComponent(JUDGE0_FIELDS)}`,
      {
        headers: getJudge0Headers(),
      },
    );
    const body = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(body?.error || `Judge0 polling failed with status ${response.status}.`);
    }

    if (body?.status?.id >= 3) {
      return body;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, pollDelayMs);
    });
  }

  throw new Error('Judge0 timed out before returning a finished result.');
}

async function executeJudge0Submission({ apiUrl, payload }) {
  const waitResult = await submitWithWait({ apiUrl, payload });

  if (waitResult) {
    return waitResult;
  }

  const token = await createSubmissionToken({ apiUrl, payload });
  return pollSubmission({ apiUrl, token });
}

function getResultStatus(judge0Result) {
  return {
    description: judge0Result?.status?.description ?? 'Unknown',
    id: judge0Result?.status?.id ?? null,
  };
}

function toRuntimeValue(time) {
  const runtime = Number(time);
  return Number.isFinite(runtime) ? runtime : null;
}

function toMemoryValue(memory) {
  const memoryValue = Number(memory);
  return Number.isFinite(memoryValue) ? memoryValue : null;
}

function toSafeTestResult({ index, judge0Result, testCase }) {
  const status = getResultStatus(judge0Result);
  const passed = status.id === 3;
  const errorOutput =
    judge0Result?.stderr || judge0Result?.compile_output || judge0Result?.message || null;

  return {
    errorOutput: testCase.isHidden ? null : errorOutput,
    isHidden: Boolean(testCase.isHidden),
    memory: toMemoryValue(judge0Result?.memory),
    output: testCase.isHidden ? null : judge0Result?.stdout ?? null,
    passed,
    runtime: toRuntimeValue(judge0Result?.time),
    status,
    testNumber: index + 1,
  };
}

function getSubmissionStatus(summary) {
  if (summary.error) {
    return 'judge0_error';
  }

  if (summary.testResults.some((result) => result.status.id === 6)) {
    return 'compilation_error';
  }

  if (summary.testResults.some((result) => result.status.id === 5)) {
    return 'time_limit_exceeded';
  }

  if (summary.testResults.some((result) => result.status.id && result.status.id > 6)) {
    return 'runtime_error';
  }

  return summary.failed === 0 ? 'accepted' : 'wrong_answer';
}

function summarizeResults(testResults) {
  const passed = testResults.filter((result) => result.passed).length;
  const failed = testResults.length - passed;
  const runtimeValues = testResults.map((result) => result.runtime).filter((value) => value !== null);
  const memoryValues = testResults.map((result) => result.memory).filter((value) => value !== null);
  const errorResult = testResults.find((result) => result.errorOutput);

  return {
    error: errorResult?.errorOutput ?? null,
    failed,
    memory: memoryValues.length ? Math.max(...memoryValues) : null,
    passed,
    runtime: runtimeValues.length
      ? Number(runtimeValues.reduce((sum, value) => sum + value, 0).toFixed(4))
      : null,
    testResults,
    totalTests: testResults.length,
  };
}

export async function runProblemWithJudge0({ code, language, problemSlug, testCases }) {
  const apiUrl = getJudge0ApiUrl();

  if (!apiUrl) {
    throw new Error('Judge0 is not configured. Set JUDGE0_API_URL on the backend.');
  }

  const testResults = [];

  for (let index = 0; index < testCases.length; index += 1) {
    const testCase = testCases[index];
    const payload = createJudge0Payload({
      code,
      language,
      problemSlug,
      testCase,
    });
    const judge0Result = await executeJudge0Submission({
      apiUrl,
      payload,
    });

    testResults.push(toSafeTestResult({ index, judge0Result, testCase }));
  }

  const summary = summarizeResults(testResults);

  return {
    ...summary,
    status: getSubmissionStatus(summary),
  };
}

export function buildJudge0FailureResult(error, totalTests) {
  return {
    error: error.message || 'Judge0 execution failed.',
    failed: totalTests,
    memory: null,
    passed: 0,
    runtime: null,
    status: 'judge0_error',
    testResults: [],
    totalTests,
  };
}
