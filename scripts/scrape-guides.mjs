#!/usr/bin/env node
// Scrape s&box documentation guides from sbox.game/dev/doc
//
// The site uses Blazor Server (SignalR), which requires a real browser
// with an active WebSocket connection. Headless Puppeteer cannot render it.
//
// This script connects to an already-running Chrome instance via CDP.
//
// Usage:
//   1. Open Chrome with remote debugging:
//      google-chrome --remote-debugging-port=9222
//   2. Navigate to https://sbox.game/dev/doc in that Chrome
//   3. Run this script:
//      node scripts/scrape-guides.mjs
//
// Output: src/content/doc/**/*.md

import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync, existsSync, rmSync } from "fs";
import { dirname, join } from "path";

const OUT_DIR = "src/content/doc";
const CDP_URL = "http://127.0.0.1:9222";

// All known doc page URLs
const DOC_URLS = [
  "/dev/doc/",
  "/dev/doc/about/faq/", "/dev/doc/about/status/",
  "/dev/doc/about/getting-started/",
  "/dev/doc/about/getting-started/first-steps/",
  "/dev/doc/about/getting-started/development/",
  "/dev/doc/about/getting-started/monetization/",
  "/dev/doc/about/getting-started/project-types/",
  "/dev/doc/about/getting-started/project-types/addon-project/",
  "/dev/doc/about/getting-started/project-types/game-project/",
  "/dev/doc/about/getting-started/reporting-errors/",
  "/dev/doc/code/libraries/",
  "/dev/doc/systems/actiongraph/",
  "/dev/doc/systems/actiongraph/component-actions/",
  "/dev/doc/systems/actiongraph/custom-nodes/",
  "/dev/doc/systems/actiongraph/examples/",
  "/dev/doc/systems/actiongraph/intro-to-actiongraphs/",
  "/dev/doc/systems/actiongraph/using-with-c/",
  "/dev/doc/systems/actiongraph/variables/",
  "/dev/doc/systems/clutter/", "/dev/doc/systems/file-system/",
  "/dev/doc/systems/game-exporting/",
  "/dev/doc/systems/input/", "/dev/doc/systems/input/controller-input/",
  "/dev/doc/systems/input/glyphs/", "/dev/doc/systems/input/raw-input/",
  "/dev/doc/systems/movie-maker/",
  "/dev/doc/systems/movie-maker/editor-map/",
  "/dev/doc/systems/movie-maker/exporting-video/",
  "/dev/doc/systems/movie-maker/getting-started/",
  "/dev/doc/systems/movie-maker/keyframe-editing/",
  "/dev/doc/systems/movie-maker/motion-editing/",
  "/dev/doc/systems/movie-maker/playback-api/",
  "/dev/doc/systems/movie-maker/recording-api/",
  "/dev/doc/systems/movie-maker/recording/",
  "/dev/doc/systems/movie-maker/sequences/",
  "/dev/doc/systems/movie-maker/skeletal-animation/",
  "/dev/doc/systems/navigation/",
  "/dev/doc/systems/navigation/navmesh-agent/",
  "/dev/doc/systems/navigation/navmesh-areas/",
  "/dev/doc/systems/navigation/navmesh-links/",
  "/dev/doc/systems/networking-multiplayer/",
  "/dev/doc/systems/networking-multiplayer/connection-permissions/",
  "/dev/doc/systems/networking-multiplayer/custom-snapshot-data/",
  "/dev/doc/systems/networking-multiplayer/dedicated-servers/",
  "/dev/doc/systems/networking-multiplayer/http-requests/",
  "/dev/doc/systems/networking-multiplayer/network-events/",
  "/dev/doc/systems/networking-multiplayer/network-helper/",
  "/dev/doc/systems/networking-multiplayer/network-visibility/",
  "/dev/doc/systems/networking-multiplayer/networked-objects/",
  "/dev/doc/systems/networking-multiplayer/ownership/",
  "/dev/doc/systems/networking-multiplayer/rpc-messages/",
  "/dev/doc/systems/networking-multiplayer/sync-properties/",
  "/dev/doc/systems/networking-multiplayer/testing-multiplayer/",
  "/dev/doc/systems/networking-multiplayer/websockets/",
  "/dev/doc/systems/post-processing/",
  "/dev/doc/systems/post-processing/creating-postprocesses/",
  "/dev/doc/systems/post-processing/effects/",
  "/dev/doc/systems/post-processing/postprocessvolume/",
  "/dev/doc/systems/storage-ugc/",
  "/dev/doc/systems/terrain/",
  "/dev/doc/systems/terrain/creating-terrain/",
  "/dev/doc/systems/terrain/terrain-materials/",
  "/dev/doc/systems/ui/", "/dev/doc/systems/ui/hudpainter/",
  "/dev/doc/systems/ui/localization/", "/dev/doc/systems/ui/razor-panels/",
  "/dev/doc/systems/ui/styling-panels/", "/dev/doc/systems/ui/virtualgrid/",
  "/dev/doc/systems/vr/",
  "/dev/doc/scene/scenes/", "/dev/doc/scene/scenes/scene-metadata/",
  "/dev/doc/scene/scenes/tracing/",
  "/dev/doc/scene/gameobject/",
  "/dev/doc/scene/components/", "/dev/doc/scene/components/async/",
  "/dev/doc/scene/components/component-interfaces/",
  "/dev/doc/scene/components/component-methods/",
  "/dev/doc/scene/components/events/",
  "/dev/doc/scene/components/execution-order/",
  "/dev/doc/scene/gameobjectsystem/",
  "/dev/doc/scene/prefabs/", "/dev/doc/scene/prefabs/instance-overrides/",
  "/dev/doc/scene/prefabs/prefab-templates/",
  "/dev/doc/editor/editor-project/", "/dev/doc/editor/editor-widgets/",
  "/dev/doc/editor/editor-apps/", "/dev/doc/editor/property-attributes/",
  "/dev/doc/editor/custom-editors/", "/dev/doc/editor/asset-previews/",
  "/dev/doc/editor/editor-shortcuts/", "/dev/doc/editor/editor-events/",
  "/dev/doc/editor/texture-generators/", "/dev/doc/editor/editor-tools/",
  "/dev/doc/editor/editor-tools/component-editor-tools/",
  "/dev/doc/editor/undo-system/", "/dev/doc/editor/model-editor/",
  "/dev/doc/assets/ready-to-use-assets/",
  "/dev/doc/assets/ready-to-use-assets/citizen-characters/",
  "/dev/doc/assets/ready-to-use-assets/first-person-weapons/",
];

// HTML to Markdown converter
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
        return `[${t}](/doc/${href.replace("/dev/doc/", "").replace(/\/$/, "")})`;
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
  return html.replace(/<[^>]+>/g, "").trim();
}

function decode(html) {
  return html
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

// Extract proper title from HTML
function extractTitle(html, fallbackTitle) {
  const titleDiv = html.match(/<div[^>]*class="title"[^>]*>([\s\S]*?)<\/div>/i);
  if (titleDiv) return stripTags(titleDiv[1]).trim();
  if (fallbackTitle) return fallbackTitle;
  return "";
}

async function main() {
  console.log("Connecting to Chrome via CDP...");

  let browser;
  try {
    browser = await puppeteer.connect({ browserURL: CDP_URL });
  } catch (e) {
    console.error(`
Failed to connect to Chrome at ${CDP_URL}

Please start Chrome with remote debugging:
  google-chrome --remote-debugging-port=9222

Then navigate to https://sbox.game/dev/doc in that Chrome instance.
`);
    process.exit(1);
  }

  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes("sbox.game")) || pages[0];

  if (!page.url().includes("sbox.game")) {
    console.log("Navigating to sbox.game/dev/doc...");
    await page.goto("https://sbox.game/dev/doc", { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));
  }

  console.log(`Connected! Current page: ${page.url()}`);
  console.log(`Scraping ${DOC_URLS.length} pages...\n`);

  // Clean output directory
  if (existsSync(OUT_DIR)) {
    rmSync(OUT_DIR, { recursive: true });
  }

  // Scrape each page using Blazor.navigateTo
  let scraped = 0;
  let skipped = 0;

  for (let i = 0; i < DOC_URLS.length; i++) {
    const url = DOC_URLS[i];

    try {
      await page.evaluate(u => Blazor.navigateTo(u), url);
      await new Promise(r => setTimeout(r, 2000));

      const data = await page.evaluate(() => {
        const el = document.querySelector(".document-content") ||
          document.querySelector(".body-content") ||
          document.querySelector(".content-layout");
        return {
          title: document.querySelector("h1")?.textContent?.trim() || "",
          html: el?.innerHTML || "",
          textLen: el?.innerText?.trim()?.length || 0,
        };
      });

      if (data.textLen < 20) {
        console.log(`  [${i + 1}/${DOC_URLS.length}] SKIP ${url} (empty)`);
        skipped++;
        continue;
      }

      const slug = url.replace("/dev/doc/", "").replace(/\/$/, "") || "index";
      const category = slug.split("/")[0] || "about";
      const title = extractTitle(data.html, data.title) || slug.split("/").pop().replace(/-/g, " ");
      const markdown = htmlToMd(data.html);

      const frontmatter = [
        "---",
        `title: "${title.replace(/"/g, '\\"')}"`,
        `slug: "${slug}"`,
        `order: ${i}`,
        `category: "${category}"`,
        `source: "https://sbox.game${url}"`,
        "---",
      ].join("\n");

      const filePath = join(OUT_DIR, slug + ".md");
      const dir = dirname(filePath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(filePath, frontmatter + "\n\n" + markdown);

      scraped++;
      console.log(`  [${i + 1}/${DOC_URLS.length}] ${slug}.md — "${title}" (${data.textLen} chars)`);
    } catch (e) {
      console.error(`  [${i + 1}/${DOC_URLS.length}] ERROR ${url}: ${e.message}`);
    }
  }

  console.log(`\nDone! Scraped: ${scraped}, Skipped: ${skipped}`);
  console.log(`Markdown files written to ${OUT_DIR}/`);

  // Don't close — it's the user's browser
  browser.disconnect();
}

main().catch(console.error);
