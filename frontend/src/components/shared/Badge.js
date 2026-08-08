const VARIANTS = {
  neutral: "border border-border bg-overlay text-text-secondary",
  accent: "bg-accent/10 text-accent",
  warm: "bg-accent-warm/10 text-accent-warm",
  muted: "bg-overlay text-text-muted",
  danger: "bg-red-500/10 text-red-400",
};

export default function Badge({
  variant = "neutral",
  className = "",
  children,
  ...props
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
