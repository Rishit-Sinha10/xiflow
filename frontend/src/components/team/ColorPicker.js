export const TEAM_COLORS = [
  "#059669",
  "#F59E0B",
  "#3B82F6",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#E11D48",
];

export default function ColorPicker({
  value,
  onChange,
  label = "Team color",
  ringOffset = "ring-offset-surface",
}) {
  return (
    <div>
      <span className="block text-xs font-medium tracking-wide text-text-secondary">
        {label}
      </span>
      <div className="mt-2 flex flex-wrap gap-2.5">
        {TEAM_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`h-8 w-8 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
              value === c
                ? `ring-2 ring-foreground ring-offset-2 ${ringOffset}`
                : "hover:scale-110"
            }`}
            style={{ backgroundColor: c }}
            aria-label={`Select color ${c}`}
            aria-pressed={value === c}
          />
        ))}
      </div>
    </div>
  );
}
