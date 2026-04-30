import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';

import { RequireAdmin } from './components/RequireAdmin.jsx';
import { RequireAuth } from './components/RequireAuth.jsx';
import { AppLayout } from './layouts/AppLayout.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { CompletionPage } from './pages/CompletionPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { PrivacyPage, SupportPage, TermsPage } from './pages/LegalPages.jsx';
import { LessonPage } from './pages/LessonPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { PracticeListPage } from './pages/PracticeListPage.jsx';
import { PracticeProblemPage } from './pages/PracticeProblemPage.jsx';
import { QuizPage } from './pages/QuizPage.jsx';
import { SandboxPage } from './pages/SandboxPage.jsx';
import { TraceLibraryPage } from './pages/TraceLibraryPage.jsx';
import { TopicPage } from './pages/TopicPage.jsx';
import { TopicsListPage } from './pages/TopicsListPage.jsx';

const GraphExplorerPage = lazy(() =>
  import('./pages/GraphExplorerPage.jsx').then((module) => ({ default: module.GraphExplorerPage })),
);
const AdminTopicsPage = lazy(() =>
  import('./pages/AdminContentPage.jsx').then((module) => ({ default: module.AdminTopicsPage })),
);
const AdminLessonsPage = lazy(() =>
  import('./pages/AdminContentPage.jsx').then((module) => ({ default: module.AdminLessonsPage })),
);
const AdminQuizzesPage = lazy(() =>
  import('./pages/AdminContentPage.jsx').then((module) => ({ default: module.AdminQuizzesPage })),
);
const AdminProblemsPage = lazy(() =>
  import('./pages/AdminContentPage.jsx').then((module) => ({ default: module.AdminProblemsPage })),
);

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

function TopicAliasRedirect() {
  const { topicSlug } = useParams();

  return <Navigate replace to={`/app/topics/${topicSlug}`} />;
}

function LessonAliasRedirect() {
  const { lessonSlug } = useParams();

  return <Navigate replace to={`/app/lessons/${lessonSlug}`} />;
}

function QuizAliasRedirect() {
  const { quizId } = useParams();

  return <Navigate replace to={`/app/quizzes/${quizId}`} />;
}

function PracticeAliasRedirect() {
  const { problemSlug } = useParams();

  return <Navigate replace to={problemSlug ? `/app/practice/${problemSlug}` : '/app/practice'} />;
}

function LazyPageFallback() {
  return (
    <div className="app-panel-soft p-4 text-sm leading-6 text-muted">
      Loading this learning tool...
    </div>
  );
}

function LazyPage({ children }) {
  return <Suspense fallback={<LazyPageFallback />}>{children}</Suspense>;
}

function Root() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<AuthPage />} path="/auth" />
        <Route element={<PrivacyPage />} path="/privacy" />
        <Route element={<TermsPage />} path="/terms" />
        <Route element={<SupportPage />} path="/support" />
        <Route element={<Navigate replace to="/app/dashboard" />} path="/dashboard" />
        <Route element={<Navigate replace to="/app/topics" />} path="/topics" />
        <Route element={<TopicAliasRedirect />} path="/topics/:topicSlug" />
        <Route element={<LessonAliasRedirect />} path="/lessons/:lessonSlug" />
        <Route element={<QuizAliasRedirect />} path="/quizzes/:quizId" />
        <Route element={<PracticeAliasRedirect />} path="/practice" />
        <Route element={<PracticeAliasRedirect />} path="/practice/:problemSlug" />

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
          path="/app"
        >
          <Route element={<Navigate replace to="dashboard" />} index />
          <Route element={<DashboardPage />} path="dashboard" />
          <Route element={<TopicsListPage />} path="topics" />
          <Route element={<TopicPage />} path="topics/:topicSlug" />
          <Route element={<TraceLibraryPage />} path="traces" />
          <Route element={<SandboxPage />} path="sandbox" />
          <Route
            element={
              <LazyPage>
                <GraphExplorerPage />
              </LazyPage>
            }
            path="graphs"
          />
          <Route element={<QuizPage />} path="quizzes/:quizId" />
          <Route element={<PracticeListPage />} path="practice" />
          <Route element={<PracticeProblemPage />} path="practice/:problemSlug" />
          <Route element={<TopicPage />} path="topic/:slug" />
          <Route element={<LessonPage />} path="lessons/:lessonSlug" />
          <Route element={<LessonPage />} path="lesson/:lessonId" />
          <Route element={<CompletionPage />} path="completed" />
          <Route element={<NotFoundPage />} path="*" />
        </Route>

        <Route
          element={
            <RequireAdmin>
              <AppLayout />
            </RequireAdmin>
          }
          path="/admin"
        >
          <Route element={<Navigate replace to="topics" />} index />
          <Route
            element={
              <LazyPage>
                <AdminTopicsPage />
              </LazyPage>
            }
            path="topics"
          />
          <Route
            element={
              <LazyPage>
                <AdminLessonsPage />
              </LazyPage>
            }
            path="lessons"
          />
          <Route
            element={
              <LazyPage>
                <AdminQuizzesPage />
              </LazyPage>
            }
            path="quizzes"
          />
          <Route
            element={
              <LazyPage>
                <AdminProblemsPage />
              </LazyPage>
            }
            path="problems"
          />
          <Route
            element={
              <NotFoundPage
                actionLabel="Open admin topics"
                actionTo="/admin/topics"
                message="That admin page is not available yet. Use the content-management sections that exist today."
              />
            }
            path="*"
          />
        </Route>

        <Route
          element={
            <NotFoundPage
              actionLabel="Go to landing page"
              actionTo="/"
              message="The route you entered is not part of the public AlgoLens app."
            />
          }
          path="*"
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Root;
