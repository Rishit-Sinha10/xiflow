"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuth } from "@/context/auth_context";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import Field from "@/components/shared/Field";

export default function AuthModal({ open, onClose, initialMode = "signin" }) {
  const { signUp, signIn, signInWithGoogle, resetPassword } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);

  function reset() {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setBusy(false);
    setForgot(false);
    setSent(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function switchMode(m) {
    setMode(m);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      handleClose();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, ""));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
      handleClose();
      router.push("/dashboard");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, ""));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, ""));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} className="max-w-sm">
      <div className="relative">
        <button
          onClick={handleClose}
          className="absolute right-0 top-0 rounded-sm text-text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex gap-4 border-b border-border pb-4">
          <button
            onClick={() => switchMode("signin")}
            className={`pb-1 text-sm font-medium transition-colors ${
              mode === "signin"
                ? "text-foreground"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`pb-1 text-sm font-medium transition-colors ${
              mode === "signup"
                ? "text-foreground"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Create Account
          </button>
        </div>

        {forgot ? (
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoFocus
            />
            {sent ? (
              <p className="rounded-lg bg-accent/10 px-3 py-2 text-xs text-accent">
                Reset link sent. Check your inbox.
              </p>
            ) : (
              <>
                {error && (
                  <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {error}
                  </p>
                )}
                <Button type="submit" loading={busy} className="w-full py-3">
                  Send reset link
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setForgot(false);
                    setError("");
                  }}
                  className="w-full text-center text-sm text-text-secondary transition-colors hover:text-foreground"
                >
                  Back to sign in
                </button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field
                label="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
              />
            )}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoFocus={mode === "signin"}
            />
            <div>
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => {
                    setForgot(true);
                    setError("");
                  }}
                  className="mt-1.5 text-xs text-text-muted transition-colors hover:text-foreground"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" loading={busy} className="w-full py-3">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs text-text-muted">
            <span className="bg-background px-3">or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-overlay px-5 py-3 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:bg-overlay-hover active:scale-[0.98] disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
      </div>
    </Modal>
  );
}
