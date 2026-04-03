import { useState, useEffect, useRef, useCallback } from "react";

interface PagefindResult {
  url: string;
  meta: { title: string };
  excerpt: string;
}

interface PagefindResponse {
  results: { data: () => Promise<PagefindResult> }[];
}

let pagefind: { search: (query: string) => Promise<PagefindResponse> } | null = null;

async function getPagefind() {
  if (!pagefind) {
    // @ts-ignore - pagefind is generated at build time
    pagefind = await import(/* @vite-ignore */ "/pagefind/pagefind.js");
  }
  return pagefind!;
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Search with pagefind
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const pf = await getPagefind();
      const response = await pf.search(query);
      const data = await Promise.all(
        response.results.slice(0, 15).map((r) => r.data())
      );
      if (!cancelled) {
        setResults(data);
        setSelected(0);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [query]);

  const navigate = useCallback((url: string) => {
    setOpen(false);
    window.location.href = url;
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].url);
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
                key={r.url}
                onClick={() => navigate(r.url)}
                className={`flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  i === selected ? "bg-accent/20 text-accent" : "text-text hover:bg-surface-hover"
                }`}
              >
                <div className="font-medium truncate">{r.meta.title}</div>
                {r.excerpt && (
                  <div
                    className="text-xs text-text-muted line-clamp-2 [&_mark]:bg-accent/30 [&_mark]:text-accent [&_mark]:rounded [&_mark]:px-0.5"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
        {query && results.length === 0 && !loading && (
          <div className="p-8 text-center text-sm text-text-muted">No results found.</div>
        )}
        {loading && (
          <div className="p-8 text-center text-sm text-text-muted">Searching...</div>
        )}
      </div>
    </div>
  );
}
