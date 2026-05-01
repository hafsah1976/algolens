import { Link } from 'react-router-dom';

const updatedDate = 'April 30, 2026';

function LegalShell({ children, eyebrow, title, summary }) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-8 sm:px-8">
      <div className="orb orb--left" aria-hidden="true" />
      <div className="orb orb--right" aria-hidden="true" />

      <div className="mx-auto max-w-4xl">
        <Link className="text-sm font-semibold text-accent" to="/">
          Back to AlgoLens
        </Link>

        <section className="app-panel mt-8 p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl tracking-[-0.05em] text-ink sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{summary}</p>
          <p className="mt-4 text-sm font-medium text-muted">Last updated: {updatedDate}</p>

          <div className="mt-8 space-y-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

function LegalSection({ children, title }) {
  return (
    <section className="rounded-[1.25rem] border border-line/80 bg-white/70 p-5">
      <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-muted">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Privacy"
      summary="This page explains what AlgoLens stores to provide accounts, saved progress, quizzes, and coding practice."
      title="Privacy Policy"
    >
      <LegalSection title="Information we collect">
        <p>
          AlgoLens stores account details such as name and email, a protected password hash,
          lesson progress, quiz attempts, coding submissions, and basic activity needed to keep
          the learning experience working.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <p>
          We use this information to authenticate learners, save progress, recommend the next
          lesson, grade quizzes, show coding submission results, protect the service, and improve
          the learning experience.
        </p>
      </LegalSection>

      <LegalSection title="Service providers">
        <p>
          AlgoLens may use hosting, database, and code-execution providers to run the product.
          Coding submissions are sent through the backend to the configured code runner only when
          a learner submits code.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          Learners can sign out at any time. For account or data questions, use the support page
          so the maintainer can review the request.
        </p>
      </LegalSection>
    </LegalShell>
  );
}

export function TermsPage() {
  return (
    <LegalShell
      eyebrow="Terms"
      summary="These terms set expectations for using AlgoLens as an educational DSA learning product."
      title="Terms of Use"
    >
      <LegalSection title="Educational use">
        <p>
          AlgoLens is designed for learning data structures and algorithms. It provides guided
          explanations, step-by-step examples, quizzes, progress tracking, and practice prompts.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          You are responsible for keeping your account credentials private and for using the
          product in a respectful, lawful way. Do not attempt to access another learner&apos;s
          account or admin-only tools.
        </p>
      </LegalSection>

      <LegalSection title="Coding practice">
        <p>
          Practice submissions should be your own learning work. Do not submit harmful, abusive,
          or intentionally disruptive code. Code execution is handled outside the main app server.
        </p>
      </LegalSection>

      <LegalSection title="Availability">
        <p>
          AlgoLens is provided as a learning platform and may change as lessons, features, or
          third-party services improve. If something breaks, use the support page to report it.
        </p>
      </LegalSection>
    </LegalShell>
  );
}

export function SupportPage() {
  return (
    <LegalShell
      eyebrow="Help"
      summary="Use this page when you need account help, want to report a bug, or want to suggest a learning improvement."
      title="Get help with AlgoLens"
    >
      <LegalSection title="Account help">
        <p>
          If you lose access, use the password reset link on the sign-in page. If an email does
          not arrive during the beta, contact the maintainer through the project repository or
          submission channel.
        </p>
      </LegalSection>

      <LegalSection title="Report an issue">
        <p>
          For bugs, broken lessons, accessibility problems, or incorrect explanations, open an
          issue on the project repository:
        </p>
        <p>
          <a
            className="font-semibold text-accent underline-offset-4 hover:underline"
            href="https://github.com/hafsah1976/algolens/issues"
            rel="noreferrer"
            target="_blank"
          >
            GitHub issues for AlgoLens
          </a>
        </p>
      </LegalSection>

      <LegalSection title="What to include">
        <p>
          Include the page URL, what you expected, what happened, and whether you were using calm
          mode or focus mode. For coding practice, include the problem name and language.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
