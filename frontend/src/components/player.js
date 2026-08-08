"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/shared/Modal";
import { inputClass } from "@/components/shared/Field";
import { playerService } from "@/lib/playerService";

export default function PlayerPicker({ open, usedPlayerIds, onPick, onClose }) {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPlayers = useCallback(async (q) => {
    setLoading(true);
    setError(null);
    try {
      const result = q
        ? await playerService.search(q)
        : await playerService.getPlayers({ sort: "rating", limit: 50 });
      setPlayers(result?.players || []);
    } catch (err) {
      setError(err.message || "Failed to load players");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    const timer = setTimeout(
      () => loadPlayers(q),
      q.length >= 3 ? 300 : 0,
    );
    return () => clearTimeout(timer);
  }, [query, open, loadPlayers]);

  const filtered = useMemo(
    () => players.filter((p) => !usedPlayerIds?.has(p.id)),
    [players, usedPlayerIds],
  );

  return (
    <Modal open={open} onClose={onClose} title="Add player" className="max-w-sm">
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search players..."
        className={`mb-3 ${inputClass}`}
      />
      {loading && (
        <p className="py-4 text-center text-sm text-text-muted">Loading players...</p>
      )}
      {!loading && error && (
        <p className="py-4 text-center text-sm text-red-400">{error}</p>
      )}
      <ul className="max-h-64 overflow-y-auto">
        {!loading && !error && filtered.length === 0 && (
          <li className="py-6 text-center text-sm text-text-muted">
            No players found
          </li>
        )}
        {!loading &&
          filtered.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => {
                  onPick(p);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-overlay-hover"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-accent/15">
                  {p.photoUrl ? (
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-accent">
                      {p.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                </span>
                <span className="text-sm text-foreground">{p.name}</span>
              </button>
            </li>
          ))}
      </ul>
    </Modal>
  );
}
