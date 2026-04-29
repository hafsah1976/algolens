export function SectionHeading({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-5 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">{description}</p>
      </div>

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
