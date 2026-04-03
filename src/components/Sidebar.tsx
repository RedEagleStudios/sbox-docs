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
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    if (!q) return namespaces;
    return namespaces
      .map((ns) => ({
        ...ns,
        types: ns.types.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.fullName.toLowerCase().includes(q)
        ),
      }))
      .filter((ns) => ns.types.length > 0);
  }, [namespaces, filter]);

  const toggle = (ns: string) => {
    setCollapsed((c) => ({ ...c, [ns]: !c[ns] }));
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
        {filtered.map((ns) => (
          <div key={ns.namespace} className="mb-1">
            <button
              onClick={() => toggle(ns.namespace)}
              className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-text-muted hover:text-text rounded transition-colors"
            >
              <span className="truncate">{ns.namespace}</span>
              <span className="text-[10px] ml-1 opacity-60">{ns.types.length}</span>
            </button>
            {!collapsed[ns.namespace] && (
              <div className="ml-1">
                {ns.types.map((t) => (
                  <a
                    key={t.fullName}
                    href={`${base}/api/${t.slug}`}
                    className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
                      currentSlug === t.slug
                        ? "bg-accent/20 text-accent"
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
        ))}
      </div>
    </nav>
  );
}
