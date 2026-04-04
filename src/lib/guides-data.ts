export interface GuideEntry {
  id: string;
  slug: string;
  title: string;
  category: string;
}

export interface GuideTreeNode {
  name: string;
  slug: string;
  path: string;
  children: GuideTreeNode[];
  guide?: GuideEntry;
}

const CATEGORY_META: Record<string, { icon: string; label: string }> = {
  about: { icon: "info", label: "About" },
  code: { icon: "code", label: "Code" },
  systems: { icon: "cpu", label: "Systems" },
  scene: { icon: "box", label: "Scene" },
  editor: { icon: "wrench", label: "Editor" },
  assets: { icon: "package", label: "Assets" },
};

export function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? { icon: "file", label: category };
}

export function buildGuideTree(guides: GuideEntry[]): GuideTreeNode[] {
  const root: GuideTreeNode[] = [];
  const nodeMap = new Map<string, GuideTreeNode>();

  // Sort by slug so parents come before children
  const sorted = [...guides].sort((a, b) => a.slug.localeCompare(b.slug));

  for (const guide of sorted) {
    const parts = guide.slug.split("/");

    // Ensure all parent nodes exist
    for (let i = 0; i < parts.length; i++) {
      const path = parts.slice(0, i + 1).join("/");
      if (!nodeMap.has(path)) {
        const node: GuideTreeNode = {
          name: parts[i].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          slug: path,
          path,
          children: [],
        };
        nodeMap.set(path, node);

        // Attach to parent
        if (i > 0) {
          const parentPath = parts.slice(0, i).join("/");
          const parent = nodeMap.get(parentPath);
          if (parent) parent.children.push(node);
        } else {
          root.push(node);
        }
      }
    }

    // Attach guide to its node
    const node = nodeMap.get(guide.slug);
    if (node) {
      node.guide = guide;
      node.name = guide.title || node.name;
    }
  }

  return root;
}
