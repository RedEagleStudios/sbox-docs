import type { APIRoute } from "astro";
import { getAllTypes, stripXml } from "../lib/api-data";

export const GET: APIRoute = () => {
  const types = getAllTypes();

  const lines: string[] = [
    "# s&box API Reference - Full Type Listing",
    "",
    "# Format: FullName | Group | Namespace | Summary",
    "",
  ];

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
