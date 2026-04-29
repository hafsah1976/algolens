export function getFrameIndexFromStepParam(stepParam, totalFrames) {
  if (!stepParam || totalFrames <= 0) {
    return null;
  }

  const stepNumber = Number(stepParam);

  if (!Number.isInteger(stepNumber)) {
    return null;
  }

  const safeStep = Math.min(Math.max(stepNumber, 1), totalFrames);

  return safeStep - 1;
}

export function getInitialTraceFrameIndex({
  savedFrame = 0,
  startFresh = false,
  stepParam = null,
  totalFrames,
}) {
  const sharedFrameIndex = getFrameIndexFromStepParam(stepParam, totalFrames);

  if (sharedFrameIndex !== null) {
    return sharedFrameIndex;
  }

  if (startFresh) {
    return 0;
  }

  return Math.min(Math.max(savedFrame ?? 0, 0), Math.max(totalFrames - 1, 0));
}

export function buildTraceStepSearch(searchParams, frameIndex) {
  const nextSearch = new URLSearchParams(searchParams);

  nextSearch.delete('fresh');
  nextSearch.set('step', String(frameIndex + 1));

  return nextSearch;
}
