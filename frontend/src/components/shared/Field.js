export const inputClass =
  "w-full rounded-lg border border-border bg-overlay px-3.5 py-2.5 text-sm text-foreground placeholder-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40";

export default function Field({ label, className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-medium tracking-wide text-text-secondary">
        {label}
      </span>
      <input {...props} className={`${inputClass} ${className}`} />
    </label>
  );
}
