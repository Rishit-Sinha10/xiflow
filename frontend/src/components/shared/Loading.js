export default function Loading({ label = "Loading", size = 32, full = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <span
        className="animate-spin rounded-full border-2 border-accent border-t-transparent"
        style={{ width: size, height: size }}
      />
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
        {label}
      </span>
    </div>
  );

  if (full) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        {content}
      </main>
    );
  }

  return <div className="flex justify-center py-16">{content}</div>;
}
