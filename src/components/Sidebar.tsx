import { useState, useMemo } from "react";
import { TypeBadge } from "./TypeBadge";
import type { NamespaceGroup } from "../lib/types";

interface Props {
  namespaces: NamespaceGroup[];
  currentSlug?: string;
  base?: string;
}

export function Sidebar({ namespaces, currentSlug, base = "" }: Props) {
  const [filter, setFilter] = useState("");

  // Find which namespace the current type belongs to
  const currentNamespace = useMemo(() => {
    if (!currentSlug) return null;
    for (const ns of namespaces) {
      if (ns.types.some((t) => t.slug === currentSlug)) {
        return ns.namespace;
      }
    }
    return null;
  }, [namespaces, currentSlug]);

  // Start all collapsed except the current namespace
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (currentNamespace) {
      init[currentNamespace] = true;
    }
    return init;
  });

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    if (!q) return namespaces;
    return namespaces
      .map((ns) => ({
        ...ns,
        types: ns.types.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.fullName.toLowerCase().includes(q) ||
            ns.namespace.toLowerCase().includes(q)
        ),
      }))
      .filter((ns) => ns.types.length > 0);
  }, [namespaces, filter]);

  const toggle = (ns: string) => {
    setExpanded((e) => ({ ...e, [ns]: !e[ns] }));
  };

  const isExpanded = (ns: string) => {
    // When filtering, expand all matching namespaces
    if (filter) return true;
    return !!expanded[ns];
  };

  return (
    <nav className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <input
          type="text"
          placeholder="Filter types..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.map((ns) => {
          const open = isExpanded(ns.namespace);
          const isCurrentNs = ns.namespace === currentNamespace;
          return (
            <div key={ns.namespace} className="mb-0.5">
              <button
                onClick={() => toggle(ns.namespace)}
                className={`flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-semibold rounded transition-colors ${
                  isCurrentNs
                    ? "text-accent bg-accent/5"
                    : "text-text-muted hover:text-text hover:bg-surface-hover"
                }`}
              >
                <svg
                  className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="truncate flex-1 text-left">{ns.namespace}</span>
                <span className="text-[10px] opacity-50 tabular-nums">{ns.types.length}</span>
              </button>
              {open && (
                <div className="ml-3 pl-2 border-l border-border/50">
                  {ns.types.map((t) => (
                    <a
                      key={t.fullName}
                      href={`${base}/api/${t.slug}`}
                      className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
                        currentSlug === t.slug
                          ? "bg-accent/20 text-accent font-medium"
                          : "text-text-muted hover:text-text hover:bg-surface-hover"
                      }`}
                    >
                      <TypeBadge group={t.group} className="text-[9px] px-1 py-0" />
                      <span className="truncate">{t.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
