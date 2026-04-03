import type { ApiData, ApiType, NamespaceGroup, NamespaceTreeNode, NavItem } from "./types";
import rawData from "../../api-data.json";

const data = rawData as ApiData;

const typesByFullName = new Map<string, ApiType>();
const typesBySlug = new Map<string, ApiType>();
const slugByFullName = new Map<string, string>();

for (const type of data.Types) {
  if (!typesByFullName.has(type.FullName)) {
    typesByFullName.set(type.FullName, type);
  }
  const slug = fullNameToSlug(type.FullName);
  typesBySlug.set(slug, type);
  slugByFullName.set(type.FullName, slug);
}

export function fullNameToSlug(fullName: string): string {
  return fullName
    .replace(/</g, "(")
    .replace(/>/g, ")")
    .replace(/,/g, "_");
}

export function getAllTypes(): ApiType[] {
  return data.Types;
}

export function getTypeBySlug(slug: string): ApiType | undefined {
  return typesBySlug.get(slug);
}

export function getTypeByFullName(fullName: string): ApiType | undefined {
  return typesByFullName.get(fullName);
}

export function getSlugForType(fullName: string): string | undefined {
  return slugByFullName.get(fullName);
}

export function typeLink(fullName: string): string | undefined {
  const slug = slugByFullName.get(fullName);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (slug) return `${base}/api/${slug}`;
  return undefined;
}

export function namespaceLink(ns: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/api/ns/${ns}`;
}

export function getNamespaces(): NamespaceGroup[] {
  const nsMap = new Map<string, NavItem[]>();

  for (const type of data.Types) {
    const ns = type.Namespace || "(global)";
    if (!nsMap.has(ns)) nsMap.set(ns, []);
    nsMap.get(ns)!.push({
      name: type.Name,
      fullName: type.FullName,
      slug: fullNameToSlug(type.FullName),
      group: type.Group,
    });
  }

  // Sort namespaces, (global) first
  const entries = [...nsMap.entries()].sort((a, b) => {
    if (a[0] === "(global)") return -1;
    if (b[0] === "(global)") return 1;
    return a[0].localeCompare(b[0]);
  });

  return entries.map(([namespace, types]) => ({
    namespace,
    types: types.sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

export function getAllSlugs(): string[] {
  return [...typesBySlug.keys()];
}

/** Parse a type string and return display name + optional link */
export function resolveType(typeStr: string): { display: string; href?: string } {
  const display = formatTypeName(typeStr);
  const href = typeLink(typeStr);
  return { display, href };
}

/** Format a .NET type string into a readable short name */
function formatTypeName(typeStr: string): string {
  // Handle generic types like System.Nullable`1<System.Single>
  const genericMatch = typeStr.match(/^(.+)`\d+<(.+)>$/);
  if (genericMatch) {
    const outerName = shortName(genericMatch[1]);
    const innerTypes = splitGenericArgs(genericMatch[2]);
    const innerDisplay = innerTypes.map(formatTypeName).join(", ");
    // Special case: Nullable -> Type?
    if (genericMatch[1].endsWith("Nullable")) {
      return `${innerDisplay}?`;
    }
    return `${outerName}<${innerDisplay}>`;
  }

  // Handle arrays
  if (typeStr.endsWith("[]")) {
    return formatTypeName(typeStr.slice(0, -2)) + "[]";
  }

  return shortName(typeStr);
}

/** Get short name from a fully qualified name (no generics) */
function shortName(fullName: string): string {
  const parts = fullName.split(".");
  return parts[parts.length - 1] || fullName;
}

/** Split generic args handling nested generics */
function splitGenericArgs(args: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of args) {
    if (ch === "<") depth++;
    else if (ch === ">") depth--;
    if (ch === "," && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

export function getNamespaceTree(): NamespaceTreeNode[] {
  const flat = getNamespaces();
  const nsMap = new Map<string, NamespaceGroup>();
  for (const ns of flat) nsMap.set(ns.namespace, ns);

  // Build tree by grouping on dot-separated segments
  const rootNodes: NamespaceTreeNode[] = [];
  const nodeMap = new Map<string, NamespaceTreeNode>();

  // Sort so parents come before children
  const sorted = [...nsMap.keys()].sort();

  for (const fullPath of sorted) {
    const ns = nsMap.get(fullPath)!;
    const parts = fullPath.split(".");
    const name = parts[parts.length - 1];

    const node: NamespaceTreeNode = {
      name,
      fullPath,
      types: ns.types,
      children: [],
      totalTypes: ns.types.length,
    };
    nodeMap.set(fullPath, node);

    // Find parent: walk up the parts
    let placed = false;
    for (let i = parts.length - 1; i > 0; i--) {
      const parentPath = parts.slice(0, i).join(".");
      const parent = nodeMap.get(parentPath);
      if (parent) {
        parent.children.push(node);
        placed = true;
        break;
      }
    }

    if (!placed) {
      rootNodes.push(node);
    }
  }

  // Calculate totalTypes recursively
  function calcTotal(node: NamespaceTreeNode): number {
    node.totalTypes = node.types.length + node.children.reduce((sum, c) => sum + calcTotal(c), 0);
    return node.totalTypes;
  }
  for (const root of rootNodes) calcTotal(root);

  // Compact: merge nodes that have no types and exactly one child
  // e.g. Facepunch (empty) > ActionGraphs → Facepunch.ActionGraphs
  function compact(nodes: NamespaceTreeNode[]): NamespaceTreeNode[] {
    return nodes.map((node) => {
      node.children = compact(node.children);
      while (node.types.length === 0 && node.children.length === 1) {
        const child = node.children[0];
        node.name = `${node.name}.${child.name}`;
        node.fullPath = child.fullPath;
        node.types = child.types;
        node.children = child.children;
      }
      return node;
    });
  }

  return compact(rootNodes);
}

/** Strip XML tags from documentation summaries for plain text */
export function stripXml(text: string): string {
  return text
    .replace(/<see\s+cref="[^"]*"\s*\/>/g, (match) => {
      const cref = match.match(/cref="([^"]*)"/)?.[1] ?? "";
      // Extract the short name from cref like "T:Sandbox.Foo" or "M:Foo.Bar"
      const parts = cref.replace(/^[A-Z]:/, "").split(".");
      return parts[parts.length - 1] ?? cref;
    })
    .replace(/<[^>]+>/g, "")
    .trim();
}
