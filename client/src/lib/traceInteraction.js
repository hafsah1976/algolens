export function isPredictionAnswerCorrect(prediction, selectedOptionId) {
  return Boolean(prediction && selectedOptionId && prediction.correctOptionId === selectedOptionId);
}

export function canAdvanceTraceFrame({
  challengeMode = false,
  isLastFrame = false,
  prediction = null,
  selectedOptionId = null,
}) {
  if (isLastFrame || !prediction) {
    return true;
  }

  if (challengeMode) {
    return isPredictionAnswerCorrect(prediction, selectedOptionId);
  }

  return Boolean(selectedOptionId);
}
