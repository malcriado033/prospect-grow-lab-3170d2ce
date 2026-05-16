import { type ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl glass ${glow ? "glow-card" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
