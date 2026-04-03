import type { APIRoute } from "astro";
import { getNamespaces } from "../lib/api-data";

export const GET: APIRoute = () => {
  const namespaces = getNamespaces();
  const totalTypes = namespaces.reduce((sum, ns) => sum + ns.types.length, 0);

  const lines: string[] = [
    "# s&box API Reference",
    "",
    "> Comprehensive API documentation for the s&box game engine by Facepunch.",
    "> This site documents all public types, classes, structs, enums, and interfaces",
    "> available to s&box game developers.",
    "",
    `Total types documented: ${totalTypes}`,
    `Total namespaces: ${namespaces.length}`,
    "",
    "## Site structure",
    "",
    "- Homepage: https://sbox.redeaglestudios.org/",
    "- API index: https://sbox.redeaglestudios.org/api/",
    "- Type pages: https://sbox.redeaglestudios.org/api/{TypeFullName}",
    "- Namespace pages: https://sbox.redeaglestudios.org/api/ns/{Namespace}",
    "",
    "## How to navigate",
    "",
    "Each type page includes the type's properties, methods, fields, constructors,",
    "and documentation summaries. Namespace pages list all types in that namespace.",
    "Use the namespace list below to find relevant types by domain area.",
    "",
    "## Namespaces",
    "",
  ];

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
