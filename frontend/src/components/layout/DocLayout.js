import React from "react";

export function DocHeader({ eyebrow, title, description, updated }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto max-w-4xl px-6 py-14 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-text-secondary">
            {description}
          </p>
        )}
        {updated && (
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
            Last updated · {updated}
          </p>
        )}
      </div>
    </header>
  );
}

export function DocSection({ id, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  );
}

export function DocH2({ children, id }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 pt-2 text-xl font-bold tracking-[-0.01em] text-foreground sm:text-2xl"
    >
      {children}
    </h2>
  );
}

export function DocH3({ children }) {
  return (
    <h3 className="mt-6 text-base font-semibold text-foreground">{children}</h3>
  );
}

export function DocP({ children }) {
  return (
    <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">{children}</p>
  );
}

export function DocList({ items }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.7] text-text-secondary">
          <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DocTable({ headers, rows }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-overlay">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-[15px] text-text-secondary">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocCode({ children }) {
  return (
    <code className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[13px] text-accent-light">
      {children}
    </code>
  );
}

export function DocBlock({ children }) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-surface p-4 font-mono text-[13px] leading-[1.7] text-text-secondary">
      {children}
    </div>
  );
}

export function DocCallout({ title, children }) {
  return (
    <div className="mt-6 rounded-xl border border-accent/25 bg-accent/5 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
        {title}
      </p>
      <div className="mt-2 text-[15px] leading-[1.7] text-text-secondary">{children}</div>
    </div>
  );
}

export function Toc({ items }) {
  return (
    <nav className="hidden w-56 shrink-0 lg:block">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        On this page
      </p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="rounded-sm text-sm text-text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
