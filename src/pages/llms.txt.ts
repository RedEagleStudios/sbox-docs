import type { APIRoute } from "astro";
import { getNamespaces } from "../lib/api-data";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const namespaces = getNamespaces();
  const totalTypes = namespaces.reduce((sum, ns) => sum + ns.types.length, 0);
  const guides = await getCollection("guides");
  const docs = guides.filter((g) => g.data.slug !== "index");

  const lines: string[] = [
    "# s&box Community Docs",
    "",
    "> Community documentation for the s&box game engine by Facepunch.",
    "> This site includes API reference for all public types and development guides.",
    "",
    `API types: ${totalTypes}`,
    `Namespaces: ${namespaces.length}`,
    `Documentation pages: ${docs.length}`,
    "",
    "## Site structure",
    "",
    "- Homepage: https://sbox.redeaglestudios.org/",
    "- API Reference: https://sbox.redeaglestudios.org/api/",
    "- Documentation: https://sbox.redeaglestudios.org/doc/",
    "- Type pages: https://sbox.redeaglestudios.org/api/{TypeFullName}",
    "- Namespace pages: https://sbox.redeaglestudios.org/api/ns/{Namespace}",
    "- Doc pages: https://sbox.redeaglestudios.org/doc/{slug}",
    "",
    "## Documentation pages",
    "",
  ];

  // Group docs by category
  const byCategory = new Map<string, typeof docs>();
  for (const doc of docs) {
    const cat = doc.data.category;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(doc);
  }

  for (const [cat, catDocs] of byCategory) {
    lines.push(`### ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
    lines.push("");
    for (const doc of catDocs.sort((a, b) => a.data.order - b.data.order)) {
      lines.push(`- [${doc.data.title}](https://sbox.redeaglestudios.org/doc/${doc.data.slug})`);
    }
    lines.push("");
  }

  lines.push("## API Namespaces");
  lines.push("");

  for (const ns of namespaces) {
    lines.push(`- ${ns.namespace} (${ns.types.length} types)`);
  }

  lines.push("");
  lines.push("## Additional resources");
  lines.push("");
  lines.push("- Full type dump: https://sbox.redeaglestudios.org/llms-full.txt");
  lines.push("- Sitemap: https://sbox.redeaglestudios.org/sitemap-index.xml");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
