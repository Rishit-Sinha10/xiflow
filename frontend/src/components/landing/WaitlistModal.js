"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import Field from "@/components/shared/Field";
import { waitlistService } from "@/lib/waitlistService";

export default function WaitlistModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);

  function reset() {
    setEmail("");
    setName("");
    setError("");
    setBusy(false);
    setJoined(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await waitlistService.join(email, name);
      setJoined(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} className="max-w-sm">
      <div className="relative">
        {joined ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              You&apos;re on the list
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              We&apos;ll email <span className="font-medium text-foreground">{email}</span>{" "}
              when Pro opens up for early access.
            </p>
            <Button className="mt-6 w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-foreground">
              Join the Pro waitlist
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Early access to Pro — advanced analytics, squad workspaces, and
              player data — before it ships.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoFocus
              />
              <Field
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {error}
                </p>
              )}
              <Button type="submit" loading={busy} className="w-full py-3">
                Join the waitlist
              </Button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
