import { buildApiUrl } from './apiBase.js';

async function requestJson(path) {
  let response;

  try {
    response = await fetch(buildApiUrl(path));
  } catch (_error) {
    throw new Error('Could not refresh the learning catalog. Please try again.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Content request failed with status ${response.status}.`);
  }

  return payload;
}

export async function fetchTopics() {
  return requestJson('/api/topics');
}

export async function fetchTopic(topicSlug) {
  return requestJson(`/api/topics/${encodeURIComponent(topicSlug)}`);
}

export async function fetchTopicLessons(topicSlug) {
  return requestJson(`/api/topics/${encodeURIComponent(topicSlug)}/lessons`);
}

export async function fetchLesson(lessonSlug) {
  return requestJson(`/api/lessons/${encodeURIComponent(lessonSlug)}`);
}
