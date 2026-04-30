import { startTransition, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getCanonicalTopicPath } from '../lib/contentCatalog.js';
import {
  canAdvanceTraceFrame,
  isPredictionAnswerCorrect,
} from '../lib/traceInteraction.js';

const CHALLENGE_MODE_KEY = 'algolens.challengeMode';

const traceTutorSteps = [
  {
    title: 'Read the frame',
    detail: 'Start with the highlighted data and current variables before looking for the next move.',
  },
  {
    title: 'Predict first',
    detail: 'Choose what should happen next so the lesson checks your mental model, not just your clicks.',
  },
  {
    title: 'Step and explain',
    detail: 'Move forward only after the visual state, code line, and beginner note agree with each other.',
  },
];

function readStoredChallengeMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(CHALLENGE_MODE_KEY) === 'on';
}

function TraceStep({ index, label, detail, active }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 transition ${
        active ? 'border-accent/35 bg-accent/10' : 'border-line/70 bg-white/65'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
            active ? 'bg-accent text-white' : 'border border-line/80 text-muted'
          }`}
        >
          {index}
        </span>
        <p className="text-sm font-semibold text-ink">{label}</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </div>
  );
}

function VariablePill({ label, value }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-white/75 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold tracking-[-0.01em] text-ink">{value}</p>
    </div>
  );
}

function TeachingNote({ body, label }) {
  if (!body) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-line/70 bg-white/70 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 text-sm leading-7 text-ink">{body}</p>
    </div>
  );
}

function TraceTutorPanel({ challengeMode }) {
  return (
    <details className="group rounded-[1.35rem] border border-accent/20 bg-accent/8 p-4">
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">How Trace Mode works</p>
          <p className="mt-2 text-sm leading-6 text-ink">
            Read, predict, then step. Open this if you want the full rhythm.
          </p>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {challengeMode ? 'Challenge locked' : 'Guided mode'}
        </span>
      </summary>

      <div className="mt-4 grid gap-3">
        {traceTutorSteps.map((step, index) => (
          <div className="grid grid-cols-[2rem_1fr] gap-3 rounded-2xl bg-white/70 px-3 py-3" key={step.title}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{step.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

function TraceToolsPanel({ onCopyStepLink, shareStatus }) {
  return (
    <details className="rounded-[1.35rem] border border-line/80 bg-white/65 p-4">
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Lesson tools</p>
          <p className="mt-2 text-sm leading-6 text-muted">Secondary actions for sharing or changing traces.</p>
        </div>
        <span className="rounded-full border border-line/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Tools
        </span>
      </summary>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-full border border-line/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted transition hover:border-accent/40 hover:text-ink"
          onClick={onCopyStepLink}
          type="button"
        >
          Share step
        </button>
        <Link
          className="rounded-full border border-line/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted transition hover:border-accent/40 hover:text-ink"
          to="/app/traces"
        >
          Trace library
        </Link>
      </div>

      {shareStatus !== 'idle' ? (
        <p className="mt-3 text-xs font-medium text-muted">
          {shareStatus === 'copied'
            ? 'Step link copied.'
            : shareStatus === 'manual'
              ? 'Copy unavailable. Use the address bar link.'
              : 'Step link unavailable.'}
        </p>
      ) : null}
    </details>
  );
}

function PredictionPanel({ challengeMode, onSelect, prediction, selectedOptionId }) {
  if (!prediction) {
    return null;
  }

  const selectedOption = prediction.options.find((option) => option.id === selectedOptionId);
  const isCorrect = selectedOption?.id === prediction.correctOptionId;
  const helperCopy = challengeMode
    ? 'Challenge Mode is on: choose the correct answer to unlock the next frame.'
    : 'Choose one answer to unlock the next frame. This keeps the trace active instead of passive.';

  return (
    <div className="rounded-[1.4rem] border border-accent/25 bg-white/80 p-4 shadow-[0_18px_50px_rgba(20,34,23,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Predict before moving</p>
          <p className="mt-2 text-sm leading-7 text-ink">{prediction.prompt}</p>
        </div>
        <span className="rounded-full bg-warm px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {challengeMode ? 'Challenge on' : 'Try first'}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {prediction.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const optionIsCorrect = option.id === prediction.correctOptionId;
          const selectedClass = optionIsCorrect
            ? 'border-accent bg-accent/10 text-accent'
            : 'border-ink/25 bg-ink/5 text-ink';

          return (
            <button
              aria-pressed={isSelected}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold leading-6 transition hover:border-accent/45 ${
                isSelected ? selectedClass : 'border-line/80 bg-surface-strong text-ink'
              }`}
              key={option.id}
              onClick={() => onSelect(option.id)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {selectedOption ? (
        <div
          className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-6 ${
            isCorrect ? 'bg-accent/10 text-accent' : 'bg-warm text-ink'
          }`}
        >
          <span className="font-semibold">
            {isCorrect ? 'Nice read.' : challengeMode ? 'Try once more.' : 'Good attempt.'}
          </span>{' '}
          {selectedOption.feedback}
          {challengeMode && !isCorrect ? (
            <span className="mt-2 block font-medium text-ink">
              Challenge Mode keeps the next frame locked until the correct prediction is selected.
            </span>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted">{helperCopy}</p>
      )}
    </div>
  );
}

function MistakeLens({ mistake }) {
  if (!mistake) {
    return null;
  }

  return (
    <div className="rounded-[1.4rem] border border-amber-200/80 bg-[#fff7e8] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Mistake Lens</p>
          <p className="mt-2 text-sm font-semibold tracking-[-0.01em] text-ink">{mistake.title}</p>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
          Common trap
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-ink">{mistake.body}</p>
      <p className="mt-3 rounded-2xl bg-white/75 px-4 py-3 text-sm leading-6 text-muted">
        <span className="font-semibold text-ink">Reset the idea:</span> {mistake.fix}
      </p>
    </div>
  );
}

function getActiveCodeLineIds(frame) {
  if (Array.isArray(frame.activeCodeLineIds)) {
    return frame.activeCodeLineIds;
  }

  if (frame.activeCodeLineId) {
    return [frame.activeCodeLineId];
  }

  return [frame.activeStepId];
}

function CodeSyncPanel({ activeLineIds, code }) {
  if (!code?.lines?.length) {
    return null;
  }

  const activeLineSet = new Set(activeLineIds);

  return (
    <div className="rounded-[1.35rem] border border-line/80 bg-warm/45 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Code + visual sync</p>
          <p className="mt-2 text-sm font-semibold tracking-[-0.01em] text-ink">{code.title}</p>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {code.language ?? 'pseudocode'}
        </span>
      </div>

      <div className="mt-4 space-y-1">
        {code.lines.map((line, index) => {
          const isActive = activeLineSet.has(line.id);

          return (
            <div
              aria-current={isActive ? 'step' : undefined}
              className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-xl px-3 py-2 transition ${
                isActive ? 'bg-accent text-white' : 'text-muted'
              }`}
              key={line.id}
            >
              <span className="select-none text-right text-xs leading-6 opacity-65">{index + 1}</span>
              <code className="whitespace-pre-wrap font-mono text-[13px] leading-6">{line.text}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getLegacyMarkers(frame) {
  if (!frame.pointers) {
    return [];
  }

  return [
    { index: frame.pointers.left, label: 'left', tone: 'accent' },
    { index: frame.pointers.right, label: 'right', tone: 'ink' },
  ].filter((marker) => Number.isInteger(marker.index));
}

function getFrameMarkers(frame) {
  return frame.markers ?? getLegacyMarkers(frame);
}

function getMarkersForIndex(markers, index) {
  return markers.filter((marker) => marker.index === index);
}

function getMarkerTone(markers, isMatch) {
  if (isMatch) {
    return 'success';
  }

  if (markers.length > 1) {
    return 'ink';
  }

  return markers[0]?.tone ?? 'default';
}

function getMarkerClass(markers, isMatch) {
  const tone = getMarkerTone(markers, isMatch);

  if (tone === 'success') {
    return 'border-accent bg-accent text-white shadow-[0_18px_40px_rgba(46,106,74,0.18)]';
  }

  if (tone === 'ink') {
    return 'border-ink bg-[#edf0ea] text-ink shadow-[0_18px_40px_rgba(21,32,25,0.08)]';
  }

  if (tone === 'muted') {
    return 'border-line bg-warm/70 text-muted';
  }

  if (tone === 'accent') {
    return 'border-accent bg-accent/10 text-accent shadow-[0_18px_40px_rgba(46,106,74,0.1)]';
  }

  return 'border-line/80 bg-white text-ink';
}

function getMarkerLabel(markers, isMatch) {
  if (isMatch && markers.length === 0) {
    return 'match';
  }

  if (markers.length === 0) {
    return '';
  }

  return markers.map((marker) => marker.label).join(' / ');
}

function ArrayCell({ index, isMatch, markers, maxValue, value, visualMode }) {
  const numericValue = typeof value === 'number' ? value : Number(value);
  const barHeight =
    visualMode === 'bars' && Number.isFinite(numericValue) && maxValue
      ? `${Math.max(18, Math.round((numericValue / maxValue) * 100))}%`
      : null;
  const markerLabel = getMarkerLabel(markers, isMatch);
  const cellClass = getMarkerClass(markers, isMatch);

  if (visualMode === 'bars') {
    return (
      <div className="relative flex min-w-[4.75rem] flex-col items-center pb-7 pt-9">
        <div className="absolute top-0 flex min-h-7 items-end justify-center">
          {markerLabel ? (
            <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted shadow-sm">
              {markerLabel}
            </span>
          ) : null}
        </div>

        <div
          className={`flex h-36 w-16 flex-col justify-end rounded-2xl border px-2 py-2 text-center transition ${cellClass}`}
        >
          <div className="flex h-full items-end justify-center rounded-xl bg-white/45 px-2 py-2">
            <div
              className="w-full max-w-8 rounded-t-full bg-current opacity-80 transition-all duration-300"
              style={{ height: barHeight ?? '20%' }}
            />
          </div>
          <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">{value}</p>
        </div>

        <p className="absolute bottom-0 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          index {index}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-w-[4.75rem] flex-col items-center pb-7 pt-9">
      <div className="absolute top-0 flex min-h-7 items-end justify-center">
        {markerLabel ? (
          <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted shadow-sm">
            {markerLabel}
          </span>
        ) : null}
      </div>

      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-semibold transition ${cellClass}`}>
        {value}
      </div>

      <p className="absolute bottom-0 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">index {index}</p>
    </div>
  );
}

function MemoryPanel({ memory }) {
  if (!memory) {
    return null;
  }

  return (
    <div className="rounded-[1.4rem] border border-line/80 bg-white/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{memory.label}</p>
          <p className="mt-2 text-sm leading-6 text-ink">{memory.description}</p>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          {memory.entries.length} {memory.countLabel ?? 'saved'}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {memory.entries.length > 0 ? (
          memory.entries.map((entry) => (
            <div key={`${entry.key}-${entry.value}`} className="rounded-2xl border border-line/70 bg-surface-strong px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                {entry.keyLabel ?? 'Key'} {entry.key}
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">{entry.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{entry.note}</p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-line/70 bg-surface-strong px-4 py-3 text-sm leading-6 text-muted">
            {memory.emptyText}
          </p>
        )}
      </div>
    </div>
  );
}

function ProgressStepper({ currentStep, totalSteps }) {
  return (
    <div
      aria-label={`Trace progress: step ${currentStep + 1} of ${totalSteps}`}
      className="flex w-full max-w-xs items-center gap-2"
      role="progressbar"
      aria-valuemax={totalSteps}
      aria-valuemin={1}
      aria-valuenow={currentStep + 1}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          className={`h-1.5 flex-1 rounded-full transition ${
            index <= currentStep ? 'bg-accent' : 'bg-line'
          }`}
          key={index}
        />
      ))}
    </div>
  );
}

export function TraceModePlayer({
  getShareUrl,
  initialFrameIndex = 0,
  isSaving = false,
  lesson,
  onComplete,
  onFrameChange,
  saveError = null,
  savedStatus = 'not-started',
  storageMode = 'mongo',
  traceLesson,
  track,
}) {
  const [frameIndex, setFrameIndex] = useState(initialFrameIndex);
  const [predictionAnswers, setPredictionAnswers] = useState({});
  const [challengeMode, setChallengeMode] = useState(() => readStoredChallengeMode());
  const [shareStatus, setShareStatus] = useState('idle');

  const frame = traceLesson.frames[frameIndex];
  const isFirstFrame = frameIndex === 0;
  const isLastFrame = frameIndex === traceLesson.frames.length - 1;
  const frameMarkers = getFrameMarkers(frame);
  const activeCodeLineIds = getActiveCodeLineIds(frame);
  const selectedPredictionId = predictionAnswers[frame.id];
  const selectedPredictionIsCorrect = isPredictionAnswerCorrect(frame.prediction, selectedPredictionId);
  const canAdvance = canAdvanceTraceFrame({
    challengeMode,
    isLastFrame,
    prediction: frame.prediction,
    selectedOptionId: selectedPredictionId,
  });
  const visualMode = traceLesson.setup.visualMode ?? 'cells';
  const targetLabel = traceLesson.setup.targetLabel ?? 'Target';
  const hasTarget = traceLesson.setup.target !== undefined && traceLesson.setup.target !== null;
  const activeStep = traceLesson.algorithmSteps.find((step) => step.id === frame.activeStepId);
  const visualArray = frame.array ?? traceLesson.setup.array;
  const maxArrayValue = visualArray.reduce((max, value) => {
    const numericValue = typeof value === 'number' ? value : Number(value);

    return Number.isFinite(numericValue) ? Math.max(max, numericValue) : max;
  }, 0);
  const primaryLabel = !canAdvance
    ? challengeMode && selectedPredictionId && !selectedPredictionIsCorrect
      ? 'Correct answer needed'
      : 'Answer to continue'
    : isFirstFrame
      ? 'Start trace mode'
      : 'Next step';
  const saveStatusCopy = saveError
    ? saveError
    : storageMode === 'sandbox'
      ? 'Sandbox practice stays on this page and does not change saved progress.'
      : isSaving
        ? 'Saving your place...'
        : savedStatus === 'completed'
          ? `Lesson complete and saved ${storageMode === 'mongo' ? 'to MongoDB.' : 'locally.'}`
          : `Your current step is saved ${storageMode === 'mongo' ? 'to MongoDB.' : 'locally.'}`;

  useEffect(() => {
    startTransition(() => {
      setFrameIndex(initialFrameIndex);
    });
  }, [initialFrameIndex]);

  useEffect(() => {
    setPredictionAnswers({});
  }, [traceLesson.lessonId]);

  useEffect(() => {
    setShareStatus('idle');
  }, [frameIndex, traceLesson.lessonId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CHALLENGE_MODE_KEY, challengeMode ? 'on' : 'off');
    }
  }, [challengeMode]);

  function goToFrame(nextIndex) {
    startTransition(() => {
      setFrameIndex(nextIndex);
    });

    onFrameChange?.(nextIndex);
  }

  function handlePrevious() {
    if (isFirstFrame) {
      return;
    }

    goToFrame(frameIndex - 1);
  }

  function handleNext() {
    if (isLastFrame || !canAdvance) {
      return;
    }

    goToFrame(frameIndex + 1);
  }

  function handleRestart() {
    if (isFirstFrame) {
      return;
    }

    setPredictionAnswers({});
    goToFrame(0);
  }

  function handleComplete() {
    onComplete?.(frameIndex);
  }

  function handlePrimaryAction() {
    if (isLastFrame) {
      handleComplete();
      return;
    }

    handleNext();
  }

  function handlePredictionSelect(optionId) {
    setPredictionAnswers((currentAnswers) => ({
      ...currentAnswers,
      [frame.id]: optionId,
    }));
  }

  async function handleCopyStepLink() {
    const shareUrl = getShareUrl?.(frameIndex) ?? (typeof window !== 'undefined' ? window.location.href : '');

    if (!shareUrl) {
      setShareStatus('unavailable');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('copied');
    } catch (_error) {
      setShareStatus('manual');
    }
  }

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-line/80 bg-surface-strong/95 shadow-[0_24px_80px_rgba(20,34,23,0.08)]">
      <header className="grid gap-4 border-b border-line/70 bg-white/70 px-5 py-4 backdrop-blur-xl lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            className="inline-flex items-center rounded-full border border-line/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:border-accent/40 hover:text-ink"
            to={getCanonicalTopicPath(track.slug)}
          >
            Topic
          </Link>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-muted sm:inline">
            {track.title}
          </span>
        </div>

        <div className="flex flex-col items-start gap-2 lg:items-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Pattern: {track.navLabel ?? track.title}
          </p>
          <ProgressStepper currentStep={frameIndex} totalSteps={traceLesson.frames.length} />
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Step {frameIndex + 1} of {traceLesson.frames.length}
          </span>
          <button
            aria-pressed={challengeMode}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
              challengeMode
                ? 'bg-ink text-white hover:bg-accent'
                : 'border border-line/80 bg-white/80 text-muted hover:border-accent/40 hover:text-ink'
            }`}
            onClick={() => setChallengeMode((currentMode) => !currentMode)}
            type="button"
          >
            Challenge {challengeMode ? 'on' : 'off'}
          </button>
        </div>
      </header>

      <div className="grid min-h-[680px] lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.25fr)]">
        <aside className="flex flex-col border-b border-line/70 bg-white/70 lg:border-b-0 lg:border-r">
          <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-6">
            <div>
              <span className="inline-flex rounded-full border border-line/80 bg-warm/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Concept introduction
              </span>
              <h1 className="mt-5 font-display text-4xl leading-[0.98] tracking-[-0.05em] text-ink sm:text-5xl">
                {lesson.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-muted">{traceLesson.summary}</p>
            </div>

            <TraceTutorPanel challengeMode={challengeMode} />

            <TraceToolsPanel onCopyStepLink={handleCopyStepLink} shareStatus={shareStatus} />

            <div className="rounded-[1.35rem] border border-line/80 bg-warm/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Current focus</p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-ink">{frame.title}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{frame.explanation}</p>
              <p className="mt-3 rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-accent">
                {frame.decision}
              </p>
            </div>

            <CodeSyncPanel activeLineIds={activeCodeLineIds} code={traceLesson.code} />

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Algorithm path</p>
              {traceLesson.algorithmSteps.map((step, index) => (
                <TraceStep
                  key={step.id}
                  active={step.id === frame.activeStepId}
                  detail={step.detail}
                  index={index + 1}
                  label={step.label}
                />
              ))}
            </div>

            <div className="rounded-[1.35rem] border border-line/80 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Learning goals</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
                {lesson.goals.map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-line/70 bg-white/80 p-5 backdrop-blur-xl lg:p-6">
            <div className="mb-4">
              <p className="text-sm leading-6 text-muted">{frame.status}</p>
              <p className={`mt-2 text-sm ${saveError ? 'text-rose-600' : 'text-muted'}`}>{saveStatusCopy}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
              <button
                className="rounded-full border border-line/80 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-accent/45 disabled:cursor-not-allowed disabled:text-muted"
                disabled={isFirstFrame}
                onClick={handlePrevious}
                type="button"
              >
                Previous
              </button>
              <button
                className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
                disabled={isLastFrame ? isSaving : !canAdvance}
                onClick={handlePrimaryAction}
                type="button"
              >
                {isLastFrame ? (isSaving ? 'Saving...' : 'Finish lesson') : primaryLabel}
              </button>
            </div>

            <div className="mt-3 flex justify-center">
              <button
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:bg-white/75 hover:text-ink disabled:cursor-not-allowed disabled:text-muted/50"
                disabled={isFirstFrame}
                onClick={handleRestart}
                type="button"
              >
                Restart
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col bg-surface p-5 lg:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Canvas state: {activeStep?.label ?? frame.activeStepId}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">Watch data change before reading the next line.</p>
            </div>
            {hasTarget ? (
              <div className="rounded-full border border-line/80 bg-white/80 px-4 py-2 font-mono text-sm text-muted">
                {targetLabel}: <span className="font-semibold text-accent">{traceLesson.setup.target}</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col justify-center rounded-[1.6rem] border border-line/80 bg-white/70 p-4 shadow-[inset_0_0_45px_rgba(20,34,23,0.035)] sm:p-6">
            <div className="relative isolate flex min-h-[310px] flex-col items-center justify-center overflow-hidden rounded-[1.35rem] bg-surface-strong px-3 py-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(46,106,74,0.08),transparent_45%)]"
              />

              <div className="mb-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{frame.title}</p>
                <p className="mt-2 text-sm font-medium text-accent">{frame.comparisonText}</p>
              </div>

              <div className="flex w-full max-w-5xl flex-wrap items-end justify-center gap-3 sm:gap-4">
                {visualArray.map((value, index) => (
                  <ArrayCell
                    key={`${index}-${value}`}
                    index={index}
                    isMatch={frame.matchedIndices?.includes(index) ?? false}
                    markers={getMarkersForIndex(frameMarkers, index)}
                    maxValue={maxArrayValue}
                    value={value}
                    visualMode={visualMode}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {frame.variables.map((variable) => (
                <VariablePill key={variable.label} label={variable.label} value={variable.value} />
              ))}
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
              <div className="rounded-[1.4rem] border border-line/80 bg-white/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Why this step matters</p>
                <p className="mt-3 text-sm leading-7 text-ink">{frame.decision}</p>
                <p className="mt-3 rounded-2xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
                  {frame.comparisonText}
                </p>
              </div>

              <TeachingNote body={frame.teaching?.beginnerNote} label="Beginner note" />
            </div>

            <div className="mt-5 space-y-4">
              <PredictionPanel
                challengeMode={challengeMode}
                onSelect={handlePredictionSelect}
                prediction={frame.prediction}
                selectedOptionId={selectedPredictionId}
              />
              <MistakeLens mistake={frame.mistake} />
              <MemoryPanel memory={frame.memory} />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <TeachingNote body={frame.teaching?.whyAllowed} label="Why this is allowed" />
              <TeachingNote body={frame.teaching?.watchFor} label="Watch for" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
