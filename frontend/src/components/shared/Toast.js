"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = { ok: CheckCircle2, err: AlertCircle, info: Info };
const COLORS = { ok: "text-emerald-400", err: "text-red-400", info: "text-sky-400" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "ok") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[70] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || ICONS.ok;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-auto flex w-72 items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-xl"
              >
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${COLORS[t.type] || COLORS.ok}`}
                  strokeWidth={2}
                />
                <p className="flex-1 text-sm leading-relaxed text-foreground">{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="rounded-sm text-text-muted transition-colors hover:text-foreground"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
