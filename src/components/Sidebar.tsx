import { useState, useMemo } from "react";
import { TypeBadge } from "./TypeBadge";
import type { NamespaceTreeNode } from "../lib/types";

export interface SidebarCategory {
  id: string;
  label: string;
  count: number;
}

interface Props {
  tree: NamespaceTreeNode[];
  categories?: SidebarCategory[];
  currentSlug?: string;
  currentNamespace?: string;
  base?: string;
}

function TreeNode({
  node,
  currentSlug,
  currentNamespace,
  base,
  depth,
  filter,
  expandedSet,
  toggleExpanded,
}: {
  node: NamespaceTreeNode;
  currentSlug?: string;
  currentNamespace?: string;
  base: string;
  depth: number;
  filter: string;
  expandedSet: Set<string>;
  toggleExpanded: (path: string) => void;
}) {
  const open = filter ? true : expandedSet.has(node.fullPath);
  const hasChildren = node.children.length > 0;
  const hasTypes = node.types.length > 0;
  const isActiveNs = currentNamespace === node.fullPath;

  return (
    <div>
      <div
        className={`flex items-center gap-0.5 py-1 text-xs font-semibold rounded transition-colors ${
          isActiveNs
            ? "text-accent bg-accent/20"
            : expandedSet.has(node.fullPath) && !filter
              ? "text-accent bg-accent/5"
              : "text-text-muted hover:text-text"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {/* Chevron toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleExpanded(node.fullPath); }}
          className="p-0.5 rounded hover:bg-surface-hover transition-colors shrink-0"
        >
          {(hasChildren || hasTypes) ? (
            <svg
              className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <span className="w-3 h-3 block" />
          )}
        </button>
        {/* Namespace link */}
        <a
          href={`${base}/api/ns/${node.fullPath}`}
          className="truncate flex-1 px-1 rounded hover:bg-surface-hover transition-colors"
        >
          {node.name}
        </a>
        <span className="text-[10px] opacity-50 tabular-nums pr-2">{node.totalTypes}</span>
      </div>
      {open && (
        <div>
          {/* Child namespaces */}
          {node.children.map((child) => (
            <TreeNode
              key={child.fullPath}
              node={child}
              currentSlug={currentSlug}
              currentNamespace={currentNamespace}
              base={base}
              depth={depth + 1}
              filter={filter}
              expandedSet={expandedSet}
              toggleExpanded={toggleExpanded}
            />
          ))}
          {/* Types in this namespace */}
          {hasTypes && (
            <div style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}>
              {node.types.map((t) => (
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
      )}
    </div>
  );
}

// Find all ancestor paths for a given slug or namespace in the tree
function findAncestors(nodes: NamespaceTreeNode[], slug?: string, namespace?: string): string[] {
  for (const node of nodes) {
    // Match by namespace path
    if (namespace && (node.fullPath === namespace || namespace.startsWith(node.fullPath + "."))) {
      if (node.fullPath === namespace) return [node.fullPath];
      const childResult = findAncestors(node.children, slug, namespace);
      if (childResult.length > 0) return [node.fullPath, ...childResult];
    }
    // Match by type slug
    if (slug && node.types.some((t) => t.slug === slug)) {
      return [node.fullPath];
    }
    if (slug) {
      const childResult = findAncestors(node.children, slug, namespace);
      if (childResult.length > 0) return [node.fullPath, ...childResult];
    }
  }
  return [];
}

// Filter tree recursively
function filterTree(nodes: NamespaceTreeNode[], q: string): NamespaceTreeNode[] {
  return nodes
    .map((node) => {
      const filteredChildren = filterTree(node.children, q);
      const filteredTypes = node.types.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.fullName.toLowerCase().includes(q)
      );
      const nameMatches = node.name.toLowerCase().includes(q) || node.fullPath.toLowerCase().includes(q);

      if (nameMatches) return node; // show everything if namespace matches
      if (filteredTypes.length > 0 || filteredChildren.length > 0) {
        return { ...node, types: filteredTypes.length > 0 ? filteredTypes : node.types, children: filteredChildren };
      }
      return null;
    })
    .filter((n): n is NamespaceTreeNode => n !== null);
}

export function Sidebar({ tree, categories, currentSlug, currentNamespace, base = "" }: Props) {
  const [filter, setFilter] = useState("");

  const ancestors = useMemo(() => {
    if (!currentSlug && !currentNamespace) return new Set<string>();
    return new Set(findAncestors(tree, currentSlug, currentNamespace));
  }, [tree, currentSlug, currentNamespace]);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(ancestors));

  const toggleExpanded = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    if (!q) return tree;
    return filterTree(tree, q);
  }, [tree, filter]);

  // Merge ancestors into expanded set
  const expandedSet = useMemo(() => new Set([...expanded, ...ancestors]), [expanded, ancestors]);

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
        {/* Category quick links */}
        {!filter && categories && categories.length > 0 && (
          <div className="mb-3 pb-3 border-b border-border/50">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Categories
            </div>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`${base}/api/category/${cat.id}`}
                className="flex items-center justify-between px-2 py-1 text-xs text-text-muted hover:text-text hover:bg-surface-hover rounded transition-colors"
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-50">{cat.count}</span>
              </a>
            ))}
            <div className="px-2 py-1 mt-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Namespaces
            </div>
          </div>
        )}
        {filtered.map((node) => (
          <TreeNode
            key={node.fullPath}
            node={node}
            currentSlug={currentSlug}
            currentNamespace={currentNamespace}
            base={base}
            depth={0}
            filter={filter}
            expandedSet={expandedSet}
            toggleExpanded={toggleExpanded}
          />
        ))}
      </div>
    </nav>
  );
}
