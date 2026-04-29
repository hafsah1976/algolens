import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchTopicQuizzes } from '../lib/quizApi.js';

export function QuizLinksPanel({ topicId, topicTitle }) {
  const [quizState, setQuizState] = useState({
    error: null,
    isLoading: Boolean(topicId),
    quizzes: [],
  });

  useEffect(() => {
    let ignore = false;

    if (!topicId) {
      setQuizState({
        error: null,
        isLoading: false,
        quizzes: [],
      });
      return () => {
        ignore = true;
      };
    }

    setQuizState({
      error: null,
      isLoading: true,
      quizzes: [],
    });

    fetchTopicQuizzes(topicId)
      .then((payload) => {
        if (ignore) {
          return;
        }

        setQuizState({
          error: null,
          isLoading: false,
          quizzes: payload.quizzes ?? [],
        });
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setQuizState({
          error: error.message || 'Could not load quizzes.',
          isLoading: false,
          quizzes: [],
        });
      });

    return () => {
      ignore = true;
    };
  }, [topicId]);

  if (quizState.isLoading) {
    return (
      <div className="app-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Concept quiz</p>
        <p className="mt-3 text-sm leading-6 text-muted">Checking for saved quizzes...</p>
      </div>
    );
  }

  if (quizState.error) {
    return (
      <div className="app-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Concept quiz</p>
        <p className="mt-3 text-sm leading-6 text-amber-800">{quizState.error}</p>
      </div>
    );
  }

  if (!quizState.quizzes.length) {
    return (
      <div className="app-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Concept quiz</p>
        <p className="mt-3 text-sm leading-6 text-muted">
          No quiz is published for {topicTitle} yet. Trace Mode and reading lessons still save
          progress normally.
        </p>
      </div>
    );
  }

  return (
    <div className="app-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Concept quiz</p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink">
        Check the mental model before coding.
      </h3>
      <div className="mt-4 space-y-3">
        {quizState.quizzes.map((quiz) => (
          <Link
            className="block rounded-[1.1rem] border border-line/80 bg-white/70 p-4 transition hover:border-accent/40 hover:bg-white/90"
            key={quiz.id}
            to={`/app/quizzes/${quiz.id}`}
          >
            <p className="text-sm font-semibold text-ink">{quiz.title}</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              {quiz.questions.length} beginner checks / answers hidden until submission
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
