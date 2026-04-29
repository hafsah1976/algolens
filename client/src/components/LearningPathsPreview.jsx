function PathRow({ index, title, description, patterns }) {
  return (
    <li className="grid gap-4 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line/80 bg-white/80 text-sm font-semibold text-ink">
          {String(index).padStart(2, '0')}
        </span>
        <p className="text-base font-semibold text-ink sm:hidden">{title}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-[minmax(180px,220px)_minmax(0,1fr)] sm:gap-4">
        <p className="hidden text-base font-semibold text-ink sm:block">{title}</p>
        <div className="space-y-2">
          <p className="text-sm leading-6 text-muted sm:text-base">{description}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Linked patterns: {patterns.join(' · ')}
          </p>
        </div>
      </div>
    </li>
  );
}

export function LearningPathsPreview({ paths }) {
  return (
    <ol className="mt-10 divide-y divide-line/80">
      {paths.map((path, index) => (
        <PathRow
          key={path.slug}
          index={index + 1}
          title={path.title}
          description={path.description}
          patterns={path.patterns}
        />
      ))}
    </ol>
  );
}
