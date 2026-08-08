function initials(name) {
  return (name || "T")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamBadge({ team, size = 48 }) {
  if (team.badge) {
    return (
      <img
        src={team.badge}
        alt={`${team.name} badge`}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: team.color || "#059669",
        fontSize: Math.max(11, size * 0.3),
      }}
    >
      {initials(team.shortName || team.name)}
    </span>
  );
}
