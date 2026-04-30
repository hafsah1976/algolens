import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SectionHeading } from '../components/SectionHeading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchProblem, submitProblem } from '../lib/practiceApi.js';

const languageOptions = ['javascript', 'python'];

function getStarterCode(problem, language) {
  return problem?.starterCode?.find((entry) => entry.language === language)?.code ?? '';
}

function ExampleBlock({ example }) {
  return (
    <div className="rounded-[1.1rem] border border-line/80 bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Example</p>
      <div className="mt-3 space-y-2 text-sm leading-6">
        <p>
          <span className="font-semibold text-ink">Input:</span>{' '}
          <span className="font-mono text-muted">{example.input}</span>
        </p>
        <p>
          <span className="font-semibold text-ink">Output:</span>{' '}
          <span className="font-mono text-muted">{example.output}</span>
        </p>
        {example.explanation ? <p className="text-muted">{example.explanation}</p> : null}
      </div>
    </div>
  );
}

function PublicTestCase({ testCase, index }) {
  return (
    <div className="rounded-[1rem] border border-line/70 bg-white/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Public check {index + 1}
      </p>
      <p className="mt-2 break-words text-sm leading-6 text-muted">
        Input: <span className="font-mono text-ink">{JSON.stringify(testCase.input)}</span>
      </p>
      <p className="mt-1 break-words text-sm leading-6 text-muted">
        Expected: <span className="font-mono text-ink">{JSON.stringify(testCase.expectedOutput)}</span>
      </p>
    </div>
  );
}

export function PracticeProblemPage() {
  const { problemSlug } = useParams();
  const { token } = useAuth();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [problemState, setProblemState] = useState({
    error: null,
    isLoading: true,
    problem: null,
  });
  const [submissionState, setSubmissionState] = useState({
    error: null,
    isSubmitting: false,
    submission: null,
  });

  useEffect(() => {
    let ignore = false;

    setProblemState({
      error: null,
      isLoading: true,
      problem: null,
    });
    setSubmissionState({
      error: null,
      isSubmitting: false,
      submission: null,
    });

    fetchProblem(problemSlug)
      .then((payload) => {
        if (ignore) {
          return;
        }

        const nextProblem = payload.problem;
        const nextLanguage = nextProblem.starterCode?.[0]?.language ?? 'javascript';

        setLanguage(nextLanguage);
        setCode(getStarterCode(nextProblem, nextLanguage));
        setProblemState({
          error: null,
          isLoading: false,
          problem: nextProblem,
        });
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setProblemState({
          error: error.message || 'Could not load this problem.',
          isLoading: false,
          problem: null,
        });
      });

    return () => {
      ignore = true;
    };
  }, [problemSlug]);

  function handleLanguageChange(event) {
    const nextLanguage = event.target.value;

    setLanguage(nextLanguage);
    setCode(getStarterCode(problemState.problem, nextLanguage));
    setSubmissionState({
      error: null,
      isSubmitting: false,
      submission: null,
    });
  }

  async function handleSubmit() {
    setSubmissionState({
      error: null,
      isSubmitting: true,
      submission: null,
    });

    try {
      const payload = await submitProblem(problemSlug, { code, language }, token);

      setSubmissionState({
        error: null,
        isSubmitting: false,
        submission: payload.submission,
      });
    } catch (error) {
      setSubmissionState({
        error: error.message || 'Could not submit code.',
        isSubmitting: false,
        submission: null,
      });
    }
  }

  if (problemState.isLoading) {
    return (
      <div className="app-panel p-6">
        <p className="text-sm text-muted">Loading practice problem…</p>
      </div>
    );
  }

  if (problemState.error || !problemState.problem) {
    return (
      <div className="app-panel p-6">
        <p className="text-sm text-muted">{problemState.error ?? 'This problem could not be found.'}</p>
      </div>
    );
  }

  const problem = problemState.problem;
  const canSubmit = code.trim().length > 0 && !submissionState.isSubmitting;

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <Link
            className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
            to="/app/practice"
          >
            Back to practice
          </Link>
        }
        description="Write a first attempt. AlgoLens sends it to the backend, runs Judge0 tests, and keeps hidden cases private."
        eyebrow="Coding practice"
        title={problem.title}
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)]">
        <div className="space-y-5">
          <div className="app-panel p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {problem.difficulty}
              </span>
              {problem.topicTitle ? (
                <span className="rounded-full border border-line/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {problem.topicTitle}
                </span>
              ) : null}
            </div>
            <p className="mt-5 text-sm leading-7 text-ink">{problem.statement}</p>
          </div>

          <div className="app-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Examples</p>
            <div className="mt-4 space-y-3">
              {problem.examples.map((example) => (
                <ExampleBlock example={example} key={`${example.input}-${example.output}`} />
              ))}
            </div>
          </div>

          <div className="app-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Constraints</p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
              {problem.constraints.map((constraint) => (
                <li className="rounded-[1rem] border border-line/70 bg-white/60 px-4 py-3" key={constraint}>
                  {constraint}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="app-panel overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-line/70 bg-white/70 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Code editor</p>
                <p className="mt-2 text-sm leading-6 text-muted">Simple textarea for Phase 9 intake.</p>
              </div>
              <select
                className="rounded-full border border-line/80 bg-white/80 px-4 py-2 text-sm font-semibold text-ink outline-none"
                onChange={handleLanguageChange}
                value={language}
              >
                {languageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="min-h-[420px] w-full resize-y bg-[#111812] p-5 font-mono text-sm leading-7 text-[#eef5ee] outline-none"
              onChange={(event) => setCode(event.target.value)}
              spellCheck="false"
              value={code}
            />

            <div className="border-t border-line/70 bg-white/80 p-5">
              <button
                className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
                disabled={!canSubmit}
                onClick={handleSubmit}
                type="button"
              >
                {submissionState.isSubmitting ? 'Submitting…' : 'Submit code'}
              </button>
            </div>
          </div>

          <div className="app-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Submission result</p>
            {submissionState.submission ? (
              <div
                className={`mt-4 rounded-[1.15rem] border p-4 ${
                  submissionState.submission.status === 'accepted'
                    ? 'border-accent/25 bg-accent/10'
                    : 'border-amber-300/50 bg-amber-50/70'
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    submissionState.submission.status === 'accepted' ? 'text-accent' : 'text-amber-800'
                  }`}
                >
                  Status: {submissionState.submission.status}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink">
                  Passed {submissionState.submission.passed} of {submissionState.submission.totalTests} tests.
                </p>
                <div className="mt-3 grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted sm:grid-cols-2">
                  <p>Runtime: {submissionState.submission.runtime ?? 'n/a'}s</p>
                  <p>Memory: {submissionState.submission.memory ?? 'n/a'} KB</p>
                </div>
                {submissionState.submission.error ? (
                  <pre className="mt-4 overflow-auto rounded-[0.9rem] bg-white/80 p-3 text-xs leading-5 text-rose-700">
                    {submissionState.submission.error}
                  </pre>
                ) : null}
                {submissionState.submission.result?.testResults?.length ? (
                  <div className="mt-4 space-y-2">
                    {submissionState.submission.result.testResults.map((testResult) => (
                      <div
                        className="flex items-center justify-between rounded-[0.9rem] border border-line/70 bg-white/70 px-3 py-2 text-sm"
                        key={`${testResult.testNumber}-${testResult.isHidden}`}
                      >
                        <span className="text-muted">
                          {testResult.isHidden ? 'Hidden' : 'Public'} test {testResult.testNumber}
                        </span>
                        <span className={testResult.passed ? 'font-semibold text-accent' : 'font-semibold text-amber-800'}>
                          {testResult.passed ? 'Passed' : testResult.status.description}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Saved submission id: {submissionState.submission.id}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted">
                Submit your code to run public and hidden tests through the backend Judge0 integration.
              </p>
            )}
            {submissionState.error ? (
              <p className="mt-4 text-sm leading-6 text-rose-700">{submissionState.error}</p>
            ) : null}
          </div>

          <div className="app-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Public checks</p>
            <div className="mt-4 space-y-3">
              {problem.testCases.map((testCase, index) => (
                <PublicTestCase index={index} key={JSON.stringify(testCase.input)} testCase={testCase} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
