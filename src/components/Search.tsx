import { useState, useEffect, useRef, useCallback } from "react";
import { TypeBadge } from "./TypeBadge";

interface SearchEntry {
  n: string; // name
  f: string; // fullName
  s: string; // slug
  g: string; // group
  d: string; // description
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search index on first open
  useEffect(() => {
    if (open && !index) {
      fetch("/search-index.json")
        .then((r) => r.json())
        .then((data: SearchEntry[]) => setIndex(data));
    }
  }, [open, index]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setSelected(0);
    }
  }, [open]);

  // Search
  useEffect(() => {
    if (!index || !query) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = index
      .filter(
        (e) =>
          e.n.toLowerCase().includes(q) ||
          e.f.toLowerCase().includes(q)
      )
      .slice(0, 20);
    setResults(matches);
    setSelected(0);
  }, [query, index]);

  const navigate = useCallback(
    (slug: string) => {
      setOpen(false);
      window.location.href = `/api/${slug}`;
    },
    []
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].s);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted hover:border-accent transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search types...</span>
        <kbd className="hidden sm:inline-flex items-center rounded border border-border px-1.5 text-[10px] font-mono text-text-muted">
          Ctrl+K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center border-b border-border px-4">
          <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search types..."
            className="flex-1 bg-transparent px-3 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
          <kbd
            className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-text-muted cursor-pointer"
            onClick={() => setOpen(false)}
          >
            ESC
          </kbd>
        </div>
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.map((r, i) => (
              <button
                key={r.f}
                onClick={() => navigate(r.s)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  i === selected ? "bg-accent/20 text-accent" : "text-text hover:bg-surface-hover"
                }`}
              >
                <TypeBadge group={r.g} className="text-[9px] px-1 py-0 shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.n}</div>
                  <div className="text-xs text-text-muted truncate">{r.f}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        {query && results.length === 0 && index && (
          <div className="p-8 text-center text-sm text-text-muted">No results found.</div>
        )}
        {query && !index && (
          <div className="p-8 text-center text-sm text-text-muted">Loading search index...</div>
        )}
      </div>
    </div>
  );
}
