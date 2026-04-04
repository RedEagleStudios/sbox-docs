import { useState, useMemo } from "react";
import type { GuideTreeNode } from "../lib/guides-data";

interface Props {
  tree: GuideTreeNode[];
  currentSlug?: string;
  base?: string;
}

function TreeNode({
  node,
  currentSlug,
  base,
  depth,
  expandedSet,
  toggleExpanded,
}: {
  node: GuideTreeNode;
  currentSlug?: string;
  base: string;
  depth: number;
  expandedSet: Set<string>;
  toggleExpanded: (path: string) => void;
}) {
  const open = expandedSet.has(node.path);
  const hasChildren = node.children.length > 0;
  const hasGuide = !!node.guide;
  const isActive = currentSlug === node.slug;

  return (
    <div>
      <div
        className={`flex items-center gap-0.5 py-1 text-xs rounded transition-colors ${
          isActive
            ? "text-accent bg-accent/20 font-medium"
            : "text-text-muted hover:text-text"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); toggleExpanded(node.path); }}
            className="p-0.5 rounded hover:bg-surface-hover transition-colors shrink-0"
          >
            <svg
              className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        {hasGuide ? (
          <a
            href={`${base}/guides/${node.slug}`}
            className="truncate flex-1 px-1 rounded hover:bg-surface-hover transition-colors"
          >
            {node.name}
          </a>
        ) : (
          <button
            onClick={() => toggleExpanded(node.path)}
            className="truncate flex-1 px-1 text-left font-semibold"
          >
            {node.name}
          </button>
        )}
      </div>
      {open && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              currentSlug={currentSlug}
              base={base}
              depth={depth + 1}
              expandedSet={expandedSet}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function findAncestors(nodes: GuideTreeNode[], slug: string): string[] {
  for (const node of nodes) {
    if (node.slug === slug) return [node.path];
    const childResult = findAncestors(node.children, slug);
    if (childResult.length > 0) return [node.path, ...childResult];
  }
  return [];
}

export function GuidesSidebar({ tree, currentSlug, base = "" }: Props) {
  const [filter, setFilter] = useState("");

  const ancestors = useMemo(() => {
    if (!currentSlug) return new Set<string>();
    return new Set(findAncestors(tree, currentSlug));
  }, [tree, currentSlug]);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(ancestors));

  const toggleExpanded = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const expandedSet = useMemo(() => new Set([...expanded, ...ancestors]), [expanded, ancestors]);

  // Simple filter
  const filtered = useMemo(() => {
    if (!filter) return tree;
    const q = filter.toLowerCase();
    function filterNode(node: GuideTreeNode): GuideTreeNode | null {
      const nameMatch = node.name.toLowerCase().includes(q);
      const filteredChildren = node.children.map(filterNode).filter(Boolean) as GuideTreeNode[];
      if (nameMatch || filteredChildren.length > 0) {
        return { ...node, children: nameMatch ? node.children : filteredChildren };
      }
      return null;
    }
    return tree.map(filterNode).filter(Boolean) as GuideTreeNode[];
  }, [tree, filter]);

  return (
    <nav className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <input
          type="text"
          placeholder="Filter guides..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            currentSlug={currentSlug}
            base={base}
            depth={0}
            expandedSet={filter ? new Set(tree.flatMap(n => getAllPaths(n))) : expandedSet}
            toggleExpanded={toggleExpanded}
          />
        ))}
      </div>
    </nav>
  );
}

function getAllPaths(node: GuideTreeNode): string[] {
  return [node.path, ...node.children.flatMap(getAllPaths)];
}
