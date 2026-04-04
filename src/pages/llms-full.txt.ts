import type { APIRoute } from "astro";
import { getAllTypes, stripXml } from "../lib/api-data";
import { getCollection, render } from "astro:content";

export const GET: APIRoute = async () => {
  const types = getAllTypes();
  const guides = await getCollection("guides");
  const docs = guides.filter((g) => g.data.slug !== "index").sort((a, b) => a.data.order - b.data.order);

  const lines: string[] = [
    "# s&box Community Docs - Full Content",
    "",
    "## Documentation Pages",
    "",
  ];

  // Render each doc page as plain text
  for (const doc of docs) {
    const { remarkPluginFrontmatter } = await render(doc);
    lines.push(`### ${doc.data.title}`);
    lines.push(`URL: https://sbox.redeaglestudios.org/doc/${doc.data.slug}`);
    lines.push(`Category: ${doc.data.category}`);
    lines.push("");
    // Include the raw markdown body
    lines.push(doc.body || "");
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  lines.push("## API Types");
  lines.push("");
  lines.push("Format: FullName | Group | Namespace | Summary");
  lines.push("");

  for (const t of types) {
    const summary = t.Documentation?.Summary ? stripXml(t.Documentation.Summary) : "";
    const oneLine = summary.replace(/\r?\n/g, " ").trim();
    lines.push(`${t.FullName} | ${t.Group} | ${t.Namespace || "(global)"} | ${oneLine}`);
  }

  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
