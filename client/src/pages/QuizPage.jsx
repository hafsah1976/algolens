import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SectionHeading } from '../components/SectionHeading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchQuiz, submitQuiz } from '../lib/quizApi.js';

const typeLabels = {
  code_output: 'Code output',
  complexity: 'Complexity',
  fill_blank: 'Fill blank',
  mcq: 'Multiple choice',
  true_false: 'True / false',
};

function getAnswerValue(answers, questionId) {
  return answers[questionId] ?? '';
}

function ResultPill({ result }) {
  if (!result) {
    return null;
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        result.isCorrect ? 'bg-accent/10 text-accent' : 'bg-amber-100 text-amber-800'
      }`}
    >
      {result.isCorrect ? 'Correct' : 'Review'}
    </span>
  );
}

function QuestionCard({ answer, index, onAnswer, question, result }) {
  const hasOptions = question.options?.length > 0;

  return (
    <article className="app-panel p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Question {index + 1}
            </span>
            <span className="rounded-full bg-warm px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {typeLabels[question.type] ?? question.type}
            </span>
            <ResultPill result={result} />
          </div>
          <h3 className="mt-4 text-lg font-semibold leading-7 tracking-[-0.02em] text-ink">
            {question.prompt}
          </h3>
        </div>
      </div>

      {hasOptions ? (
        <div className="mt-5 grid gap-3">
          {question.options.map((option) => {
            const selected = answer === option;

            return (
              <button
                className={`rounded-[1.15rem] border px-4 py-3 text-left text-sm leading-6 transition ${
                  selected
                    ? 'border-accent/50 bg-accent/10 text-ink'
                    : 'border-line/80 bg-white/70 text-muted hover:border-accent/35 hover:text-ink'
                }`}
                disabled={Boolean(result)}
                key={option}
                onClick={() => onAnswer(question.id, option)}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <label className="mt-5 block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Your answer
          </span>
          <input
            className="mt-2 w-full rounded-[1.1rem] border border-line/80 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50"
            disabled={Boolean(result)}
            onChange={(event) => onAnswer(question.id, event.target.value)}
            placeholder="Type a short answer"
            type="text"
            value={answer}
          />
        </label>
      )}

      {result ? (
        <div className="mt-5 rounded-[1.15rem] border border-line/70 bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Explanation</p>
          <p className="mt-2 text-sm leading-6 text-ink">{result.explanation}</p>
          {!result.isCorrect ? (
            <p className="mt-3 text-sm leading-6 text-muted">
              Correct answer: <span className="font-semibold text-ink">{String(result.correctAnswer)}</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function QuizPage() {
  const { quizId } = useParams();
  const { token } = useAuth();
  const [quizState, setQuizState] = useState({
    error: null,
    isLoading: true,
    quiz: null,
  });
  const [answers, setAnswers] = useState({});
  const [submitState, setSubmitState] = useState({
    error: null,
    isSubmitting: false,
    result: null,
  });

  useEffect(() => {
    let ignore = false;

    setQuizState({
      error: null,
      isLoading: true,
      quiz: null,
    });
    setAnswers({});
    setSubmitState({
      error: null,
      isSubmitting: false,
      result: null,
    });

    fetchQuiz(quizId)
      .then((payload) => {
        if (ignore) {
          return;
        }

        setQuizState({
          error: null,
          isLoading: false,
          quiz: payload.quiz,
        });
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setQuizState({
          error: error.message || 'Could not load this quiz.',
          isLoading: false,
          quiz: null,
        });
      });

    return () => {
      ignore = true;
    };
  }, [quizId]);

  function handleAnswer(questionId, answer) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: answer,
    }));
  }

  async function handleSubmit() {
    const payloadAnswers = quizState.quiz.questions.map((question) => ({
      answer: getAnswerValue(answers, question.id),
      questionId: question.id,
    }));

    setSubmitState({
      error: null,
      isSubmitting: true,
      result: null,
    });

    try {
      const result = await submitQuiz(quizId, payloadAnswers, token);

      setSubmitState({
        error: null,
        isSubmitting: false,
        result,
      });
    } catch (error) {
      setSubmitState({
        error: error.message || 'Could not submit quiz.',
        isSubmitting: false,
        result: null,
      });
    }
  }

  if (quizState.isLoading) {
    return (
      <div className="app-panel p-6">
        <p className="text-sm text-muted">Loading quiz…</p>
      </div>
    );
  }

  if (quizState.error || !quizState.quiz) {
    return (
      <div className="app-panel p-6">
        <p className="text-sm text-muted">{quizState.error ?? 'This quiz could not be found.'}</p>
      </div>
    );
  }

  const quiz = quizState.quiz;
  const resultsByQuestionId = Object.fromEntries(
    (submitState.result?.results ?? []).map((result) => [result.questionId, result]),
  );
  const answeredCount = quiz.questions.filter((question) =>
    String(getAnswerValue(answers, question.id)).trim(),
  ).length;
  const canSubmit =
    answeredCount === quiz.questions.length && !submitState.isSubmitting && !submitState.result;

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <Link
            className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
            to="/app/topics"
          >
            Back to topics
          </Link>
        }
        description="A short concept check. Answers and explanations appear only after the server grades your submission."
        eyebrow="Quiz"
        title={quiz.title}
      />

      <section className="app-panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {answeredCount} / {quiz.questions.length} answered
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              These questions reinforce the same beginner mental models used by Trace Mode.
            </p>
          </div>

          {submitState.result ? (
            <div className="rounded-[1.2rem] border border-line/80 bg-white/70 px-5 py-4">
              <p className="text-3xl font-semibold tracking-[-0.04em] text-ink">
                {submitState.result.score} / {submitState.result.totalQuestions}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Saved attempt
              </p>
            </div>
          ) : (
            <button
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
              disabled={!canSubmit}
              onClick={handleSubmit}
              type="button"
            >
              {submitState.isSubmitting ? 'Submitting…' : 'Submit quiz'}
            </button>
          )}
        </div>

        {submitState.error ? (
          <p className="mt-4 text-sm leading-6 text-rose-700">{submitState.error}</p>
        ) : null}
      </section>

      <section className="space-y-4">
        {quiz.questions.map((question, index) => (
          <QuestionCard
            answer={getAnswerValue(answers, question.id)}
            index={index}
            key={question.id}
            onAnswer={handleAnswer}
            question={question}
            result={resultsByQuestionId[question.id]}
          />
        ))}
      </section>
    </div>
  );
}
