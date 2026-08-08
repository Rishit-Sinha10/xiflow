"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import Button from "@/components/shared/Button";
import { useAuth } from "@/context/auth_context";
import { useToast } from "@/components/shared/Toast";
import { sharingService } from "@/lib/sharingService";

export default function ShareLineupForm({ lineupId, onDone }) {
  const { user } = useAuth();
  const { push } = useToast();
  const [busy, setBusy] = useState(false);
  const [share, setShare] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (busy) return;
    setBusy(true);
    try {
      const created = await sharingService.createShare(user, lineupId, {
        maxViews: null,
        expiresInDays: 7,
      });
      setShare(created);
    } catch (err) {
      push(err.message || "Could not create share link", "err");
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    const url = `${window.location.origin}/share/${share.accessCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      push("Share link copied");
    } catch {
      push("Could not copy link", "err");
    }
  }

  return (
    <div className="space-y-4">
      {!share ? (
        <>
          <p className="text-sm leading-[1.65] text-text-secondary">
            Create a shareable link so anyone can view this lineup. The link
            expires after 7 days and can be copied to share anywhere.
          </p>
          <Button
            onClick={handleCreate}
            loading={busy}
            className="w-full"
          >
            <Link2 className="h-4 w-4" />
            Create share link
          </Button>
        </>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-overlay p-4 text-center">
            <p className="font-mono text-2xl font-semibold tracking-[0.2em] text-accent">
              {share.accessCode}
            </p>
            <p className="mt-1 text-xs text-text-muted">Access code</p>
          </div>
          <p className="text-center text-xs text-text-muted">
            Link expires{" "}
            {share.expiresAt
              ? new Date(share.expiresAt).toLocaleDateString()
              : "never"}
            {" · "}
            {share.maxViews ? `${share.maxViews} max views` : "unlimited views"}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="flex-1" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <Button variant="ghost" onClick={onDone}>
              Done
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
