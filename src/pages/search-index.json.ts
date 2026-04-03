import type { APIRoute } from "astro";
import { getAllTypes, fullNameToSlug, stripXml } from "../lib/api-data";

export const GET: APIRoute = () => {
  const types = getAllTypes();
  const index = types.map((t) => ({
    n: t.Name,
    f: t.FullName,
    s: fullNameToSlug(t.FullName),
    g: t.Group,
    d: t.Documentation?.Summary ? stripXml(t.Documentation.Summary).slice(0, 100) : "",
  }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
