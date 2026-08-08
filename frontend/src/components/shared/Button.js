"use client";

import { forwardRef } from "react";

const VARIANTS = {
  solid: "bg-accent-warm text-background hover:bg-accent-warm/90",
  primary: "bg-accent text-white hover:bg-accent/90",
  ghost: "border border-border text-text-secondary hover:border-border-hover hover:text-foreground",
  danger: "border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

const Button = forwardRef(function Button(
  { children, variant = "solid", size = "md", loading = false, disabled = false, className = "", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
});

export default Button;
