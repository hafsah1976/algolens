import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { SectionHeading } from '../components/SectionHeading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  createAdminLesson,
  createAdminProblem,
  createAdminQuiz,
  createAdminTopic,
  getAdminContentAudit,
  listAdminLessons,
  listAdminProblems,
  listAdminQuizzes,
  listAdminTopics,
  updateAdminLesson,
  updateAdminTopic,
} from '../lib/adminApi.js';

const difficultyOptions = ['beginner', 'intermediate', 'advanced'];
const visualizationOptions = ['none', 'binary_search', 'stack', 'queue', 'bfs', 'dfs', 'bubble_sort'];

const initialTopicForm = {
  description: '',
  difficulty: 'beginner',
  isPublished: false,
  order: '0',
  slug: '',
  title: '',
};

const initialLessonForm = {
  content: '',
  estimatedMinutes: '10',
  isPublished: false,
  order: '0',
  slug: '',
  summary: '',
  title: '',
  topicId: '',
  visualizationType: 'none',
};

const initialQuizForm = {
  isPublished: false,
  lessonId: '',
  questionsJson: JSON.stringify(
    [
      {
        correctAnswer: 'O(n)',
        difficulty: 'beginner',
        explanation: 'One pass over n items grows linearly.',
        options: ['O(1)', 'O(n)', 'O(n^2)'],
        prompt: 'What is the time complexity of scanning an array once?',
        type: 'complexity',
      },
    ],
    null,
    2,
  ),
  title: '',
  topicId: '',
};

const initialProblemForm = {
  constraintsText: 'Input size stays beginner-friendly.',
  difficulty: 'beginner',
  examplesJson: JSON.stringify(
    [
      {
        explanation: 'The maximum value is 7.',
        input: '[3, 7, 2]',
        output: '7',
      },
    ],
    null,
    2,
  ),
  isPublished: false,
  slug: '',
  starterCodeJson: JSON.stringify(
    [
      {
        code: 'function solve(input) {\n  return input;\n}',
        language: 'javascript',
      },
    ],
    null,
    2,
  ),
  statement: '',
  testCasesJson: JSON.stringify(
    [
      {
        expectedOutput: '7',
        input: '[3, 7, 2]',
        isHidden: false,
      },
    ],
    null,
    2,
  ),
  title: '',
  topicId: '',
};

function useAdminLoader(loader, token, refreshKey) {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let ignore = false;

    setState({
      data: null,
      error: null,
      isLoading: true,
    });

    loader(token)
      .then((payload) => {
        if (ignore) {
          return;
        }

        setState({
          data: payload,
          error: null,
          isLoading: false,
        });
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setState({
          data: null,
          error: error.message || 'Could not load admin content.',
          isLoading: false,
        });
      });

    return () => {
      ignore = true;
    };
  }, [loader, refreshKey, token]);

  return state;
}

async function loadLessonAdminData(token) {
  const [topicsPayload, lessonsPayload] = await Promise.all([
    listAdminTopics(token),
    listAdminLessons(token),
  ]);

  return {
    lessons: lessonsPayload.lessons ?? [],
    topics: topicsPayload.topics ?? [],
  };
}

async function loadQuizAdminData(token) {
  const [topicsPayload, lessonsPayload, quizzesPayload] = await Promise.all([
    listAdminTopics(token),
    listAdminLessons(token),
    listAdminQuizzes(token),
  ]);

  return {
    lessons: lessonsPayload.lessons ?? [],
    quizzes: quizzesPayload.quizzes ?? [],
    topics: topicsPayload.topics ?? [],
  };
}

async function loadProblemAdminData(token) {
  const [topicsPayload, problemsPayload] = await Promise.all([
    listAdminTopics(token),
    listAdminProblems(token),
  ]);

  return {
    problems: problemsPayload.problems ?? [],
    topics: topicsPayload.topics ?? [],
  };
}

function parseJsonArray(value, label) {
  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return { error: `${label} must be a JSON array.` };
    }

    return { value: parsed };
  } catch (_error) {
    return { error: `${label} contains invalid JSON.` };
  }
}

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function StatusMessage({ error, message }) {
  if (!error && !message) {
    return null;
  }

  return (
    <div
      className={`app-panel-soft p-4 text-sm leading-6 ${
        error ? 'border-rose-300/50 bg-rose-50/70 text-rose-700' : 'text-muted'
      }`}
    >
      {error ?? message}
    </div>
  );
}

function AdminNav() {
  const links = [
    { label: 'Audit', to: '/admin/overview' },
    { label: 'Topics', to: '/admin/topics' },
    { label: 'Lessons', to: '/admin/lessons' },
    { label: 'Quizzes', to: '/admin/quizzes' },
    { label: 'Problems', to: '/admin/problems' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          className="rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
          key={link.to}
          to={link.to}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function AuditMetric({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-line/70 bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">{value}</p>
    </div>
  );
}

function Field({ children, label }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ label, onChange, placeholder, type = 'text', value }) {
  return (
    <Field label={label}>
      <input
        className="mt-2 w-full rounded-[1.1rem] border border-line/80 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </Field>
  );
}

function TextArea({ label, minHeight = 'min-h-32', onChange, placeholder, value }) {
  return (
    <Field label={label}>
      <textarea
        className={`mt-2 w-full resize-y rounded-[1.1rem] border border-line/80 bg-white/80 px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-accent/50 ${minHeight}`}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </Field>
  );
}

function SelectInput({ label, onChange, options, value }) {
  return (
    <Field label={label}>
      <select
        className="mt-2 w-full rounded-[1.1rem] border border-line/80 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function PublishCheckbox({ checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-[1.1rem] border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      Publish to students
    </label>
  );
}

function SubmitButton({ children, disabled }) {
  return (
    <button
      className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  );
}

function PublishPill({ isPublished }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        isPublished ? 'bg-accent/10 text-accent' : 'bg-amber-100 text-amber-800'
      }`}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}

function AdminListItem({ actions, children, isPublished, title }) {
  return (
    <article className="rounded-[1.25rem] border border-line/70 bg-white/70 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <PublishPill isPublished={isPublished} />
            {children}
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-ink">{title}</h3>
        </div>
        {actions ? <div className="flex flex-wrap gap-2 lg:justify-end">{actions}</div> : null}
      </div>
    </article>
  );
}

function AdminPageFrame({ children, description, title }) {
  return (
    <div className="space-y-6">
      <SectionHeading
        actions={<AdminNav />}
        description={description}
        eyebrow="Admin"
        title={title}
      />
      {children}
    </div>
  );
}

export function AdminOverviewPage() {
  const { token } = useAuth();
  const state = useAdminLoader(getAdminContentAudit, token, 0);
  const summary = state.data?.summary;
  const topics = state.data?.topics ?? [];
  const readyCount = topics.filter((topic) => topic.status === 'ready').length;

  return (
    <AdminPageFrame
      description="Check publication readiness before students see new curriculum."
      title="Content audit"
    >
      <StatusMessage error={state.error} />

      {state.isLoading ? <p className="text-sm text-muted">Loading content audit...</p> : null}

      {summary ? (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <AuditMetric label="Ready topics" value={`${readyCount} / ${topics.length}`} />
          <AuditMetric label="Published topics" value={`${summary.topics.published} / ${summary.topics.total}`} />
          <AuditMetric label="Published lessons" value={`${summary.lessons.published} / ${summary.lessons.total}`} />
          <AuditMetric label="Published quizzes" value={`${summary.quizzes.published} / ${summary.quizzes.total}`} />
          <AuditMetric label="Published problems" value={`${summary.problems.published} / ${summary.problems.total}`} />
        </section>
      ) : null}

      <section className="app-panel p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Path readiness</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-ink">
              Publish with a complete loop.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            A ready path has a published topic, lesson, quiz, and practice problem.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {topics.map((topic) => (
            <article className="rounded-[1.25rem] border border-line/70 bg-white/70 p-4" key={topic.slug}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                      topic.status === 'ready'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {topic.status === 'ready' ? 'Ready' : 'Needs review'}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-ink">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {topic.publishedLessonCount} lessons, {topic.publishedQuizCount} quizzes,{' '}
                    {topic.publishedProblemCount} problems published.
                  </p>
                </div>
                {topic.checks.length ? (
                  <ul className="max-w-lg space-y-2 text-sm leading-6 text-muted">
                    {topic.checks.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="max-w-lg text-sm leading-6 text-muted">
                    This path has the minimum learning loop ready for students.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminPageFrame>
  );
}

export function AdminTopicsPage() {
  const { token } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState(initialTopicForm);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [submitState, setSubmitState] = useState({ error: null, isSubmitting: false, message: null });
  const state = useAdminLoader(listAdminTopics, token, refreshKey);
  const topics = state.data?.topics ?? [];

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState({ error: null, isSubmitting: true, message: null });

    try {
      const payload = {
        ...form,
        order: toNumber(form.order),
      };

      if (editingTopicId) {
        await updateAdminTopic(editingTopicId, payload, token);
      } else {
        await createAdminTopic(payload, token);
      }

      setForm(initialTopicForm);
      setEditingTopicId(null);
      setSubmitState({
        error: null,
        isSubmitting: false,
        message: editingTopicId ? 'Topic updated.' : 'Topic created.',
      });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setSubmitState({
        error: error.message || 'Could not save topic.',
        isSubmitting: false,
        message: null,
      });
    }
  }

  async function handleTogglePublish(topic) {
    setSubmitState({ error: null, isSubmitting: true, message: null });

    try {
      await updateAdminTopic(topic.id, { isPublished: !topic.isPublished }, token);
      setSubmitState({ error: null, isSubmitting: false, message: 'Topic visibility updated.' });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setSubmitState({
        error: error.message || 'Could not update topic visibility.',
        isSubmitting: false,
        message: null,
      });
    }
  }

  function handleEdit(topic) {
    setEditingTopicId(topic.id);
    setForm({
      description: topic.description ?? '',
      difficulty: topic.difficulty ?? 'beginner',
      isPublished: Boolean(topic.isPublished),
      order: String(topic.order ?? 0),
      slug: topic.slug ?? '',
      title: topic.title ?? '',
    });
  }

  return (
    <AdminPageFrame
      description="Create, edit, and publish the DSA paths students see in the topic catalog."
      title="Manage topics"
    >
      <StatusMessage error={state.error || submitState.error} message={submitState.message} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.88fr)_minmax(360px,1.12fr)]">
        <form className="app-panel space-y-4 p-6" onSubmit={handleSubmit}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {editingTopicId ? 'Edit topic' : 'New topic'}
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-ink">
              Keep paths focused.
            </h2>
          </div>
          <TextInput
            label="Title"
            onChange={(title) => setForm((current) => ({ ...current, title }))}
            placeholder="Arrays"
            value={form.title}
          />
          <TextInput
            label="Slug"
            onChange={(slug) => setForm((current) => ({ ...current, slug }))}
            placeholder="arrays"
            value={form.slug}
          />
          <TextArea
            label="Description"
            onChange={(description) => setForm((current) => ({ ...current, description }))}
            placeholder="A beginner path for indexed data."
            value={form.description}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Order"
              onChange={(order) => setForm((current) => ({ ...current, order }))}
              type="number"
              value={form.order}
            />
            <SelectInput
              label="Difficulty"
              onChange={(difficulty) => setForm((current) => ({ ...current, difficulty }))}
              options={difficultyOptions.map((value) => ({ label: value, value }))}
              value={form.difficulty}
            />
          </div>
          <PublishCheckbox
            checked={form.isPublished}
            onChange={(isPublished) => setForm((current) => ({ ...current, isPublished }))}
          />
          <div className="flex flex-wrap gap-3">
            <SubmitButton disabled={submitState.isSubmitting}>
              {submitState.isSubmitting ? 'Saving…' : editingTopicId ? 'Update topic' : 'Create topic'}
            </SubmitButton>
            {editingTopicId ? (
              <button
                className="rounded-full border border-line/80 bg-white/70 px-5 py-3 text-sm font-medium text-ink transition hover:border-accent/40"
                onClick={() => {
                  setEditingTopicId(null);
                  setForm(initialTopicForm);
                }}
                type="button"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">All topics</p>
          <div className="mt-4 space-y-3">
            {state.isLoading ? <p className="text-sm text-muted">Loading topics…</p> : null}
            {topics.map((topic) => (
              <AdminListItem
                actions={
                  <>
                    <button
                      className="rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
                      onClick={() => handleEdit(topic)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
                      onClick={() => handleTogglePublish(topic)}
                      type="button"
                    >
                      {topic.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                  </>
                }
                isPublished={topic.isPublished}
                key={topic.id}
                title={topic.title}
              >
                <span className="rounded-full border border-line/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {topic.slug}
                </span>
              </AdminListItem>
            ))}
          </div>
        </div>
      </section>
    </AdminPageFrame>
  );
}

export function AdminLessonsPage() {
  const { token } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState(initialLessonForm);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [submitState, setSubmitState] = useState({ error: null, isSubmitting: false, message: null });
  const state = useAdminLoader(loadLessonAdminData, token, refreshKey);
  const lessons = state.data?.lessons ?? [];
  const topics = state.data?.topics ?? [];

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState({ error: null, isSubmitting: true, message: null });

    try {
      const payload = {
        ...form,
        estimatedMinutes: toNumber(form.estimatedMinutes),
        order: toNumber(form.order),
      };

      if (editingLessonId) {
        await updateAdminLesson(editingLessonId, payload, token);
      } else {
        await createAdminLesson(payload, token);
      }

      setForm(initialLessonForm);
      setEditingLessonId(null);
      setSubmitState({
        error: null,
        isSubmitting: false,
        message: editingLessonId ? 'Lesson updated.' : 'Lesson created.',
      });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setSubmitState({
        error: error.message || 'Could not save lesson.',
        isSubmitting: false,
        message: null,
      });
    }
  }

  async function handleTogglePublish(lesson) {
    setSubmitState({ error: null, isSubmitting: true, message: null });

    try {
      await updateAdminLesson(lesson.id, { isPublished: !lesson.isPublished }, token);
      setSubmitState({ error: null, isSubmitting: false, message: 'Lesson visibility updated.' });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setSubmitState({
        error: error.message || 'Could not update lesson visibility.',
        isSubmitting: false,
        message: null,
      });
    }
  }

  function handleEdit(lesson) {
    setEditingLessonId(lesson.id);
    setForm({
      content: lesson.content ?? '',
      estimatedMinutes: String(lesson.estimatedMinutes ?? 10),
      isPublished: Boolean(lesson.isPublished),
      order: String(lesson.order ?? 0),
      slug: lesson.slug ?? '',
      summary: lesson.summary ?? '',
      title: lesson.title ?? '',
      topicId: lesson.topicId ?? '',
      visualizationType: lesson.visualizationType ?? 'none',
    });
  }

  const topicOptions = [
    { label: 'Select topic', value: '' },
    ...topics.map((topic) => ({ label: topic.title, value: topic.id })),
  ];

  return (
    <AdminPageFrame
      description="Create lessons, connect them to a topic, and control whether they appear in the student path."
      title="Manage lessons"
    >
      <StatusMessage error={state.error || submitState.error} message={submitState.message} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
        <form className="app-panel space-y-4 p-6" onSubmit={handleSubmit}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {editingLessonId ? 'Edit lesson' : 'New lesson'}
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-ink">
              Write one clear concept.
            </h2>
          </div>
          <SelectInput
            label="Topic"
            onChange={(topicId) => setForm((current) => ({ ...current, topicId }))}
            options={topicOptions}
            value={form.topicId}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Title"
              onChange={(title) => setForm((current) => ({ ...current, title }))}
              value={form.title}
            />
            <TextInput
              label="Slug"
              onChange={(slug) => setForm((current) => ({ ...current, slug }))}
              value={form.slug}
            />
          </div>
          <TextArea
            label="Summary"
            onChange={(summary) => setForm((current) => ({ ...current, summary }))}
            value={form.summary}
          />
          <TextArea
            label="Content"
            minHeight="min-h-52"
            onChange={(content) => setForm((current) => ({ ...current, content }))}
            placeholder="Short lesson content. Keep it beginner-friendly."
            value={form.content}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextInput
              label="Order"
              onChange={(order) => setForm((current) => ({ ...current, order }))}
              type="number"
              value={form.order}
            />
            <TextInput
              label="Minutes"
              onChange={(estimatedMinutes) => setForm((current) => ({ ...current, estimatedMinutes }))}
              type="number"
              value={form.estimatedMinutes}
            />
            <SelectInput
              label="Visualization"
              onChange={(visualizationType) => setForm((current) => ({ ...current, visualizationType }))}
              options={visualizationOptions.map((value) => ({ label: value, value }))}
              value={form.visualizationType}
            />
          </div>
          <PublishCheckbox
            checked={form.isPublished}
            onChange={(isPublished) => setForm((current) => ({ ...current, isPublished }))}
          />
          <div className="flex flex-wrap gap-3">
            <SubmitButton disabled={submitState.isSubmitting}>
              {submitState.isSubmitting ? 'Saving…' : editingLessonId ? 'Update lesson' : 'Create lesson'}
            </SubmitButton>
            {editingLessonId ? (
              <button
                className="rounded-full border border-line/80 bg-white/70 px-5 py-3 text-sm font-medium text-ink transition hover:border-accent/40"
                onClick={() => {
                  setEditingLessonId(null);
                  setForm(initialLessonForm);
                }}
                type="button"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">All lessons</p>
          <div className="mt-4 space-y-3">
            {state.isLoading ? <p className="text-sm text-muted">Loading lessons…</p> : null}
            {lessons.map((lesson) => (
              <AdminListItem
                actions={
                  <>
                    <button
                      className="rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
                      onClick={() => handleEdit(lesson)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
                      onClick={() => handleTogglePublish(lesson)}
                      type="button"
                    >
                      {lesson.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                  </>
                }
                isPublished={lesson.isPublished}
                key={lesson.id}
                title={lesson.title}
              >
                <span className="rounded-full border border-line/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {lesson.topicTitle ?? 'No topic'}
                </span>
              </AdminListItem>
            ))}
          </div>
        </div>
      </section>
    </AdminPageFrame>
  );
}

export function AdminQuizzesPage() {
  const { token } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState(initialQuizForm);
  const [submitState, setSubmitState] = useState({ error: null, isSubmitting: false, message: null });
  const state = useAdminLoader(loadQuizAdminData, token, refreshKey);
  const lessons = state.data?.lessons ?? [];
  const quizzes = state.data?.quizzes ?? [];
  const topics = state.data?.topics ?? [];
  const topicOptions = [
    { label: 'Select topic', value: '' },
    ...topics.map((topic) => ({ label: topic.title, value: topic.id })),
  ];
  const lessonOptions = [
    { label: 'No specific lesson', value: '' },
    ...lessons.map((lesson) => ({
      label: `${lesson.title}${lesson.topicTitle ? ` (${lesson.topicTitle})` : ''}`,
      value: lesson.id,
    })),
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState({ error: null, isSubmitting: true, message: null });

    const questions = parseJsonArray(form.questionsJson, 'Questions');

    if (questions.error) {
      setSubmitState({ error: questions.error, isSubmitting: false, message: null });
      return;
    }

    try {
      await createAdminQuiz(
        {
          isPublished: form.isPublished,
          lessonId: form.lessonId || null,
          questions: questions.value,
          title: form.title,
          topicId: form.topicId,
        },
        token,
      );
      setForm(initialQuizForm);
      setSubmitState({ error: null, isSubmitting: false, message: 'Quiz created.' });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setSubmitState({
        error: error.message || 'Could not create quiz.',
        isSubmitting: false,
        message: null,
      });
    }
  }

  return (
    <AdminPageFrame
      description="Create automatically graded concept checks. Correct answers stay hidden until students submit."
      title="Manage quizzes"
    >
      <StatusMessage error={state.error || submitState.error} message={submitState.message} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)]">
        <form className="app-panel space-y-4 p-6" onSubmit={handleSubmit}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">New quiz</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-ink">
              Add a focused check.
            </h2>
          </div>
          <SelectInput
            label="Topic"
            onChange={(topicId) => setForm((current) => ({ ...current, topicId }))}
            options={topicOptions}
            value={form.topicId}
          />
          <SelectInput
            label="Optional lesson"
            onChange={(lessonId) => setForm((current) => ({ ...current, lessonId }))}
            options={lessonOptions}
            value={form.lessonId}
          />
          <TextInput
            label="Title"
            onChange={(title) => setForm((current) => ({ ...current, title }))}
            value={form.title}
          />
          <TextArea
            label="Questions JSON"
            minHeight="min-h-[24rem]"
            onChange={(questionsJson) => setForm((current) => ({ ...current, questionsJson }))}
            value={form.questionsJson}
          />
          <PublishCheckbox
            checked={form.isPublished}
            onChange={(isPublished) => setForm((current) => ({ ...current, isPublished }))}
          />
          <SubmitButton disabled={submitState.isSubmitting}>
            {submitState.isSubmitting ? 'Saving…' : 'Create quiz'}
          </SubmitButton>
        </form>

        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">All quizzes</p>
          <div className="mt-4 space-y-3">
            {state.isLoading ? <p className="text-sm text-muted">Loading quizzes…</p> : null}
            {quizzes.map((quiz) => (
              <AdminListItem isPublished={quiz.isPublished} key={quiz.id} title={quiz.title}>
                <span className="rounded-full border border-line/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {quiz.questionCount} questions
                </span>
                <span className="rounded-full border border-line/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {quiz.topicTitle ?? 'No topic'}
                </span>
              </AdminListItem>
            ))}
          </div>
        </div>
      </section>
    </AdminPageFrame>
  );
}

export function AdminProblemsPage() {
  const { token } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState(initialProblemForm);
  const [submitState, setSubmitState] = useState({ error: null, isSubmitting: false, message: null });
  const state = useAdminLoader(loadProblemAdminData, token, refreshKey);
  const problems = state.data?.problems ?? [];
  const topics = state.data?.topics ?? [];
  const topicOptions = [
    { label: 'Select topic', value: '' },
    ...topics.map((topic) => ({ label: topic.title, value: topic.id })),
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState({ error: null, isSubmitting: true, message: null });

    const examples = parseJsonArray(form.examplesJson, 'Examples');
    const starterCode = parseJsonArray(form.starterCodeJson, 'Starter code');
    const testCases = parseJsonArray(form.testCasesJson, 'Test cases');
    const parseError = examples.error || starterCode.error || testCases.error;

    if (parseError) {
      setSubmitState({ error: parseError, isSubmitting: false, message: null });
      return;
    }

    try {
      await createAdminProblem(
        {
          constraints: form.constraintsText
            .split('\n')
            .map((constraint) => constraint.trim())
            .filter(Boolean),
          difficulty: form.difficulty,
          examples: examples.value,
          isPublished: form.isPublished,
          slug: form.slug,
          starterCode: starterCode.value,
          statement: form.statement,
          testCases: testCases.value,
          title: form.title,
          topicId: form.topicId,
        },
        token,
      );
      setForm(initialProblemForm);
      setSubmitState({ error: null, isSubmitting: false, message: 'Coding problem created.' });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setSubmitState({
        error: error.message || 'Could not create coding problem.',
        isSubmitting: false,
        message: null,
      });
    }
  }

  return (
    <AdminPageFrame
      description="Create practice problems with public and hidden checks. Hidden cases stay private from students."
      title="Manage problems"
    >
      <StatusMessage error={state.error || submitState.error} message={submitState.message} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
        <form className="app-panel space-y-4 p-6" onSubmit={handleSubmit}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">New problem</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-ink">
              Add coding practice.
            </h2>
          </div>
          <SelectInput
            label="Topic"
            onChange={(topicId) => setForm((current) => ({ ...current, topicId }))}
            options={topicOptions}
            value={form.topicId}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Title"
              onChange={(title) => setForm((current) => ({ ...current, title }))}
              value={form.title}
            />
            <TextInput
              label="Slug"
              onChange={(slug) => setForm((current) => ({ ...current, slug }))}
              value={form.slug}
            />
          </div>
          <SelectInput
            label="Difficulty"
            onChange={(difficulty) => setForm((current) => ({ ...current, difficulty }))}
            options={difficultyOptions.map((value) => ({ label: value, value }))}
            value={form.difficulty}
          />
          <TextArea
            label="Statement"
            minHeight="min-h-40"
            onChange={(statement) => setForm((current) => ({ ...current, statement }))}
            value={form.statement}
          />
          <TextArea
            label="Constraints, one per line"
            onChange={(constraintsText) => setForm((current) => ({ ...current, constraintsText }))}
            value={form.constraintsText}
          />
          <TextArea
            label="Examples JSON"
            minHeight="min-h-40"
            onChange={(examplesJson) => setForm((current) => ({ ...current, examplesJson }))}
            value={form.examplesJson}
          />
          <TextArea
            label="Starter code JSON"
            minHeight="min-h-40"
            onChange={(starterCodeJson) => setForm((current) => ({ ...current, starterCodeJson }))}
            value={form.starterCodeJson}
          />
          <TextArea
            label="Test cases JSON"
            minHeight="min-h-44"
            onChange={(testCasesJson) => setForm((current) => ({ ...current, testCasesJson }))}
            value={form.testCasesJson}
          />
          <PublishCheckbox
            checked={form.isPublished}
            onChange={(isPublished) => setForm((current) => ({ ...current, isPublished }))}
          />
          <SubmitButton disabled={submitState.isSubmitting}>
            {submitState.isSubmitting ? 'Saving…' : 'Create problem'}
          </SubmitButton>
        </form>

        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">All problems</p>
          <div className="mt-4 space-y-3">
            {state.isLoading ? <p className="text-sm text-muted">Loading problems…</p> : null}
            {problems.map((problem) => (
              <AdminListItem isPublished={problem.isPublished} key={problem.id} title={problem.title}>
                <span className="rounded-full border border-line/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {problem.difficulty}
                </span>
                <span className="rounded-full border border-line/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {problem.publicTestCaseCount} public / {problem.hiddenTestCaseCount} hidden
                </span>
              </AdminListItem>
            ))}
          </div>
        </div>
      </section>
    </AdminPageFrame>
  );
}
