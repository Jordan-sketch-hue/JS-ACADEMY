/**
 * Button — uses CSS custom properties from the active token file.
 * HOW TO TEST: render <Button>Click me</Button> → background must be var(--accent)
 */
"use client";
import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-[var(--radius)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

  const variants: Record<Variant, string> = {
    primary: "bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90",
    outline: "border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-light)]",
    ghost:   "text-[var(--text-secondary)] hover:bg-[var(--accent-light)]",
  };

  const sizes = { sm: "text-sm px-3 py-1.5", md: "text-base px-5 py-2.5", lg: "text-lg px-7 py-3.5" };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
