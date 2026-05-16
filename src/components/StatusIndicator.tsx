export function StatusIndicator({
  status,
  size = "md",
}: {
  status: "online" | "offline" | "busy" | "away";
  size?: "sm" | "md" | "lg";
}) {
  const colors = {
    online: "bg-accent",
    offline: "bg-muted-foreground",
    busy: "bg-destructive",
    away: "bg-pagci",
  };

  const sizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-3.5 w-3.5",
  };

  return (
    <span className="relative flex">
      <span className={`${sizes[size]} rounded-full ${colors[status]}`} />
      {status === "online" && (
        <span
          className={`absolute inset-0 ${sizes[size]} rounded-full ${colors[status]} animate-status-pulse`}
        />
      )}
    </span>
  );
}
