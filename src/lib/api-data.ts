import type { ApiData, ApiType, NamespaceGroup, NavItem } from "./types";
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
  if (slug) return `/api/${slug}`;
  return undefined;
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
  // Strip common System prefixes for display
  const display = typeStr
    .replace(/^System\.Collections\.Generic\./, "")
    .replace(/^System\./, "")
    .replace(/^Sandbox\./, "");

  const href = typeLink(typeStr);
  return { display, href };
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
