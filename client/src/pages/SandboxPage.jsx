import { useMemo, useState } from 'react';

import { SectionHeading } from '../components/SectionHeading.jsx';
import { TraceModePlayer } from '../components/TraceModePlayer.jsx';
import {
  buildTwoPointerSandboxTrace,
  parseSandboxNumbers,
  parseSandboxTarget,
} from '../lib/sandboxTrace.js';

const sandboxTrack = {
  navLabel: 'Lab',
  slug: 'arrays-two-pointers',
  title: 'Algo-Sandbox',
};

const sandboxLesson = {
  goals: [
    'Test your own sorted input',
    'Predict pointer movement before the next frame',
    'Compare custom data with guided Trace Mode behavior',
  ],
  id: 'sandbox-two-pointers',
  title: 'Two Pointers Lab',
};

function SandboxInput({ label, onChange, value }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-line/80 bg-white/70 px-4 py-3 text-sm font-medium text-ink outline-none transition focus:border-accent/50"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

export function SandboxPage() {
  const [numberInput, setNumberInput] = useState('2, 4, 7, 11, 15');
  const [targetInput, setTargetInput] = useState('13');
  const [activeConfig, setActiveConfig] = useState({
    target: 13,
    values: [2, 4, 7, 11, 15],
  });
  const [formError, setFormError] = useState('');
  const [runCount, setRunCount] = useState(0);
  const [completionMessage, setCompletionMessage] = useState('');

  const traceLesson = useMemo(
    () => buildTwoPointerSandboxTrace(activeConfig),
    [activeConfig],
  );

  function handleRunLab(event) {
    event.preventDefault();

    const numberResult = parseSandboxNumbers(numberInput);
    const targetResult = parseSandboxTarget(targetInput);
    const nextError = numberResult.error ?? targetResult.error;

    if (nextError) {
      setFormError(nextError);
      return;
    }

    setFormError('');
    setCompletionMessage('');
    setRunCount((count) => count + 1);
    setActiveConfig({
      target: targetResult.target,
      values: numberResult.values,
    });
  }

  function handleComplete() {
    setCompletionMessage('Sandbox trace complete. Try one changed number or return to a guided lesson.');
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        description="Free-play with the two-pointer pattern. Enter your own data, run the trace, and test whether the mental model still holds."
        eyebrow="Algo-Sandbox"
        title="Experiment without leaving Trace Mode."
      />

      <section className="app-panel p-6 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">The lab</p>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">
              Change the input. Keep the reasoning.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              This first sandbox focuses on sorted pair sum. If the numbers are not sorted,
              AlgoLens sorts a copy first because two pointers need ordered data to be safe.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleRunLab}>
            <SandboxInput label="Numbers" onChange={setNumberInput} value={numberInput} />
            <SandboxInput label="Target sum" onChange={setTargetInput} value={targetInput} />
            {formError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                {formError}
              </p>
            ) : (
              <p className="rounded-2xl border border-line/80 bg-white/65 px-4 py-3 text-sm leading-6 text-muted">
                Current lab: {traceLesson.summary}
              </p>
            )}
            <button
              className="w-fit rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink"
              type="submit"
            >
              Run custom trace
            </button>
          </form>
        </div>
      </section>

      {completionMessage ? (
        <div className="rounded-[1.35rem] border border-accent/25 bg-accent/10 px-5 py-4 text-sm font-medium leading-6 text-accent">
          {completionMessage}
        </div>
      ) : null}

      <TraceModePlayer
        key={runCount}
        initialFrameIndex={0}
        lesson={sandboxLesson}
        onComplete={handleComplete}
        savedStatus="sandbox"
        storageMode="sandbox"
        traceLesson={traceLesson}
        track={sandboxTrack}
      />
    </div>
  );
}
