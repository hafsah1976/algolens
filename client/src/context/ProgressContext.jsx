import { createContext, useContext, useEffect, useRef, useState } from 'react';

import {
  fetchProgressSnapshot,
  saveLessonProgress,
  saveTopicProgress,
} from '../lib/progressApi.js';
import { buildTopicProgressPayload, upsertProgressRecord } from '../lib/progressSummary.js';
import { useAuth } from './AuthContext.jsx';

const ProgressContext = createContext(null);

const initialProgressState = {
  database: null,
  error: null,
  fileStore: null,
  isLoading: true,
  lessonProgress: [],
  storageMode: 'loading',
  topicProgress: [],
  user: null,
};

const signedOutProgressState = {
  ...initialProgressState,
  isLoading: false,
  storageMode: 'signed-out',
};

function mergeSnapshot(current, payload) {
  return {
    ...current,
    database: payload.database ?? current.database,
    error: null,
    fileStore: payload.fileStore ?? current.fileStore,
    isLoading: false,
    lessonProgress: payload.lessonProgress ?? current.lessonProgress,
    storageMode: payload.storageMode ?? current.storageMode,
    topicProgress: payload.topicProgress ?? current.topicProgress,
    user: payload.user ?? current.user,
  };
}

function mergeLessonProgress(current, payload) {
  return {
    ...current,
    error: null,
    fileStore: payload.fileStore ?? current.fileStore,
    lessonProgress: upsertProgressRecord(
      current.lessonProgress,
      payload.lessonProgress,
      'lessonId',
    ),
    storageMode: payload.storageMode ?? current.storageMode,
    user: payload.user ?? current.user,
  };
}

function mergeTopicProgress(current, payload) {
  return {
    ...current,
    error: null,
    fileStore: payload.fileStore ?? current.fileStore,
    storageMode: payload.storageMode ?? current.storageMode,
    topicProgress: upsertProgressRecord(current.topicProgress, payload.topicProgress, 'topicSlug'),
    user: payload.user ?? current.user,
  };
}

export function ProgressProvider({ children }) {
  const { isLoading: authIsLoading, token: authToken } = useAuth();
  const [progressState, setProgressState] = useState(initialProgressState);
  const [pendingWrites, setPendingWrites] = useState(0);
  const progressStateRef = useRef(initialProgressState);
  const authTokenRef = useRef(authToken);
  const writeQueueRef = useRef(Promise.resolve());

  function updateProgressState(updater) {
    setProgressState((current) => {
      const nextState = typeof updater === 'function' ? updater(current) : updater;
      progressStateRef.current = nextState;
      return nextState;
    });
  }

  async function refreshProgress() {
    if (authIsLoading || !authTokenRef.current) {
      updateProgressState(signedOutProgressState);
      return null;
    }

    updateProgressState((current) => ({
      ...current,
      error: null,
      isLoading: true,
    }));

    try {
      const payload = await fetchProgressSnapshot(authTokenRef.current);
      updateProgressState((current) => mergeSnapshot(current, payload));
      return payload;
    } catch (error) {
      updateProgressState((current) => ({
        ...current,
        error: error.message || 'Could not load saved progress.',
        isLoading: false,
      }));
      return null;
    }
  }

  useEffect(() => {
    authTokenRef.current = authToken;
  }, [authToken]);

  useEffect(() => {
    if (authIsLoading) {
      return undefined;
    }

    let ignore = false;

    if (!authToken) {
      updateProgressState(signedOutProgressState);
      return () => {
        ignore = true;
      };
    }

    updateProgressState({
      ...initialProgressState,
      isLoading: true,
    });

    fetchProgressSnapshot(authToken)
      .then((payload) => {
        if (ignore) {
          return;
        }

        updateProgressState((current) => mergeSnapshot(current, payload));
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        updateProgressState((current) => ({
          ...current,
          error: error.message || 'Could not load saved progress.',
          isLoading: false,
        }));
      });

    return () => {
      ignore = true;
    };
  }, [authIsLoading, authToken]);

  function queueWrite(task) {
    const operation = writeQueueRef.current.then(task);
    writeQueueRef.current = operation.catch(() => {});
    return operation;
  }

  async function syncLessonProgress({ currentFrame, lessonId, status, track }) {
    return queueWrite(async () => {
      if (!authTokenRef.current) {
        const error = new Error('Please sign in to save progress.');
        updateProgressState((current) => ({
          ...current,
          error: error.message,
        }));
        throw error;
      }

      setPendingWrites((count) => count + 1);

      try {
        const lessonPayload = await saveLessonProgress(
          {
            currentFrame,
            lessonId,
            status,
            topicSlug: track.slug,
          },
          authTokenRef.current,
        );

        const nextLessonProgress = upsertProgressRecord(
          progressStateRef.current.lessonProgress,
          lessonPayload.lessonProgress,
          'lessonId',
        );

        updateProgressState((current) => mergeLessonProgress(current, lessonPayload));

        const topicPayload = buildTopicProgressPayload(track, nextLessonProgress, lessonId);
        const topicResult = await saveTopicProgress(topicPayload, authTokenRef.current);

        updateProgressState((current) => mergeTopicProgress(current, topicResult));

        return {
          lessonProgress: lessonPayload.lessonProgress,
          topicProgress: topicResult.topicProgress,
        };
      } catch (error) {
        updateProgressState((current) => ({
          ...current,
          error: error.message || 'Could not save progress.',
        }));
        throw error;
      } finally {
        setPendingWrites((count) => Math.max(0, count - 1));
      }
    });
  }

  const lessonProgressById = Object.fromEntries(
    progressState.lessonProgress.map((entry) => [entry.lessonId, entry]),
  );
  const topicProgressBySlug = Object.fromEntries(
    progressState.topicProgress.map((entry) => [entry.topicSlug, entry]),
  );

  return (
    <ProgressContext.Provider
      value={{
        ...progressState,
        isSaving: pendingWrites > 0,
        lessonProgressById,
        refreshProgress,
        syncLessonProgress,
        topicProgressBySlug,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);

  if (!value) {
    throw new Error('useProgress must be used inside ProgressProvider.');
  }

  return value;
}
