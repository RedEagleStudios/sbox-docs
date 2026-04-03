import { cn } from "../lib/utils";

const groupColors: Record<string, string> = {
  class: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  struct: "bg-green-500/20 text-green-400 border-green-500/30",
  enum: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  interface: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export function TypeBadge({ group, className }: { group: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        groupColors[group] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30",
        className
      )}
    >
      {group}
    </span>
  );
}
