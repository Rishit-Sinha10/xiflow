function initials(name) {
  return name.split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
export default function PlayerSlot({ slot, player, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(slot.id)}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center focus:outline-none"
      style={{ top: `${slot.top}%`, left: `${slot.left}%` }}
      aria-label={
        player ? `${player.name} - ${slot.label}` : `Add player - ${slot.label}`
      }
    >
      <span
        className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent/60 bg-accent/25 shadow-md backdrop-blur-sm transition-transform duration-150 group-hover:scale-105 group-hover:border-accent"
      >
        {player?.photoUrl ? (
          <img
            src={player.photoUrl}
            alt={player.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : player ? (
          <span className="text-sm font-semibold text-white">
            {initials(player.name)}
          </span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-white/70"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.5 0-10.5 1.8-10.5 5.3v2h21v-2c0-3.5-7-5.3-10.5-5.3z" />
          </svg>
        )}
        <span
          className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-accent shadow ring-2 ring-accent/40"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
      </span>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-white/80">
        {player ? player.name.split(" ").slice(-1)[0] : slot.label}
      </span>
    </button>
  );
}
