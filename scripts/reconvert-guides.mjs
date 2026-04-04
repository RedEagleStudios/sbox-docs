#!/usr/bin/env node
// Re-convert guides-raw.json to markdown files, preserving existing frontmatter.
// Fixes code blocks that use <pre><span class="hljs-*"> instead of <pre><code>.
// Also extracts proper titles from <div class="title"> elements.
//
// Usage: node scripts/reconvert-guides.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";

const RAW = "guides-raw.json";
const OUT = "src/content/guides";

if (!existsSync(RAW)) {
  console.error("guides-raw.json not found. Run the scraper first.");
  process.exit(1);
}

const pages = JSON.parse(readFileSync(RAW, "utf8"));

function htmlToMd(html) {
  return html
    // Code blocks: <pre> with any content (hljs spans, code tags, raw text)
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => {
      const code = stripTags(inner);
      return "\n```csharp\n" + decode(code.trim()) + "\n```\n";
    })
    // Inline code
    .replace(/<code[^>]*>(.*?)<\/code>/gi, (_, c) => "`" + decode(stripTags(c)) + "`")
    // Headers
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => "\n# " + stripTags(t).trim() + "\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => "\n## " + stripTags(t).trim() + "\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => "\n### " + stripTags(t).trim() + "\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => "\n#### " + stripTags(t).trim() + "\n")
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
      const t = stripTags(text).trim();
      if (!t) return "";
      if (href.startsWith("/dev/doc/")) {
        return `[${t}](/guides/${href.replace("/dev/doc/", "").replace(/\/$/, "")})`;
      }
      if (href.startsWith("/")) return `[${t}](https://sbox.game${href})`;
      return `[${t}](${href})`;
    })
    // Images
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, (_, s, a) => `![${a}](${s})`)
    .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, (_, s) => `![](${s})`)
    // Tables
    .replace(/<table[\s\S]*?<\/table>/gi, (table) => {
      const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      if (rows.length === 0) return "";
      const result = rows.map((row) => {
        const cells = [...row[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)];
        return "| " + cells.map((c) => stripTags(c[1]).trim().replace(/\|/g, "\\|").replace(/\n/g, " ")).join(" | ") + " |";
      });
      if (result.length > 1) {
        const headerCells = [...rows[0][1].matchAll(/<t[hd][^>]*>/gi)].length;
        result.splice(1, 0, "| " + Array(headerCells).fill("---").join(" | ") + " |");
      }
      return "\n" + result.join("\n") + "\n";
    })
    // Lists
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => "- " + stripTags(t).trim() + "\n")
    .replace(/<\/?[uo]l[^>]*>/gi, "\n")
    // Bold/italic
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${stripTags(t)}**`)
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, (_, __, t) => `*${stripTags(t)}*`)
    // Breaks/paragraphs
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => "\n" + t.trim() + "\n")
    // Strip remaining HTML
    .replace(/<[^>]+>/g, "")
    // Decode entities
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}

function decode(html) {
  return html
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

// Extract proper title from HTML — check <div class="title"> first, then <h1>
function extractTitle(html, fallbackTitle) {
  const titleDiv = html.match(/<div[^>]*class="title"[^>]*>([\s\S]*?)<\/div>/i);
  if (titleDiv) return stripTags(titleDiv[1]).trim();
  if (fallbackTitle) return fallbackTitle;
  return "";
}

let count = 0;

for (const p of pages) {
  const slug = p.url.replace("/dev/doc/", "").replace(/\/$/, "") || "index";
  const md = htmlToMd(p.html);
  if (md.length < 20) continue;

  const filePath = join(OUT, slug + ".md");

  // Read existing frontmatter to preserve order/category/fixed titles
  let fm = {};
  if (existsSync(filePath)) {
    const existing = readFileSync(filePath, "utf8");
    const fmMatch = existing.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
      for (const line of fmMatch[1].split("\n")) {
        const m = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
        if (m) fm[m[1]] = m[2];
      }
    }
  }

  // Use existing title if already fixed, otherwise extract from HTML
  const title = fm.title || extractTitle(p.html, p.title) || slug.split("/").pop().replace(/-/g, " ");
  const order = fm.order || "999";
  const category = fm.category || slug.split("/")[0] || "about";

  const frontmatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `order: ${order}`,
    `category: "${category}"`,
    `source: "https://sbox.game${p.url}"`,
    "---",
  ].join("\n");

  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, frontmatter + "\n\n" + md);
  count++;
}

console.log(`Re-converted ${count} files`);

// Verify code blocks
let withCode = 0;
for (const p of pages) {
  const slug = p.url.replace("/dev/doc/", "").replace(/\/$/, "") || "index";
  const filePath = join(OUT, slug + ".md");
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, "utf8");
    if (content.includes("```csharp")) withCode++;
  }
}
console.log(`${withCode} files have code blocks`);
