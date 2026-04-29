function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normalizeBooleanText(value) {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return normalizeText(value);
}

function getAcceptedAnswers(correctAnswer) {
  return Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
}

export function sanitizeQuizPayload(quiz) {
  return {
    id: quiz.id,
    topicId: quiz.topicId.toString(),
    lessonId: quiz.lessonId?.toString() ?? null,
    title: quiz.title,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      options: question.options,
      difficulty: question.difficulty,
    })),
  };
}

export function isQuizAnswerCorrect(question, submittedAnswer) {
  const acceptedAnswers = getAcceptedAnswers(question.correctAnswer);

  if (question.type === 'true_false') {
    const normalizedSubmission = normalizeBooleanText(submittedAnswer);

    return acceptedAnswers.some(
      (answer) => normalizeBooleanText(answer) === normalizedSubmission,
    );
  }

  const normalizedSubmission = normalizeText(submittedAnswer);

  return acceptedAnswers.some((answer) => normalizeText(answer) === normalizedSubmission);
}

export function gradeQuizSubmission(quiz, submittedAnswers = []) {
  const submittedAnswerByQuestionId = new Map(
    submittedAnswers.map((entry) => [String(entry.questionId), entry.answer]),
  );

  const results = quiz.questions.map((question) => {
    const questionId = question.id;
    const submittedAnswer = submittedAnswerByQuestionId.get(questionId) ?? null;
    const isCorrect = isQuizAnswerCorrect(question, submittedAnswer);

    return {
      answer: submittedAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isCorrect,
      prompt: question.prompt,
      questionId,
      type: question.type,
    };
  });
  const score = results.filter((result) => result.isCorrect).length;

  return {
    attemptAnswers: results.map((result) => ({
      answer: result.answer,
      awardedPoints: result.isCorrect ? 1 : 0,
      isCorrect: result.isCorrect,
      questionId: result.questionId,
    })),
    results,
    score,
    totalQuestions: quiz.questions.length,
  };
}
