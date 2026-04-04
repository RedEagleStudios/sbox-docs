#!/usr/bin/env node
// Scrape s&box documentation and output as markdown files.
// Usage: node scripts/scrape-docs.mjs
// Output: src/content/guides/

import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";

const BASE = "https://sbox.game";
const START = "/dev/doc/";
const OUT_DIR = "src/content/guides";

// Seed with all known doc URLs (discovered via browser session)
const SEED_URLS = [
  "/dev/doc/",
  "/dev/doc/about/faq/",
  "/dev/doc/about/status/",
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
  "/dev/doc/systems/clutter/",
  "/dev/doc/systems/file-system/",
  "/dev/doc/systems/game-exporting/",
  "/dev/doc/systems/input/",
  "/dev/doc/systems/input/controller-input/",
  "/dev/doc/systems/input/glyphs/",
  "/dev/doc/systems/input/raw-input/",
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
  "/dev/doc/systems/ui/",
  "/dev/doc/systems/ui/hudpainter/",
  "/dev/doc/systems/ui/localization/",
  "/dev/doc/systems/ui/razor-panels/",
  "/dev/doc/systems/ui/styling-panels/",
  "/dev/doc/systems/ui/virtualgrid/",
  "/dev/doc/systems/vr/",
  "/dev/doc/scene/scenes/",
  "/dev/doc/scene/scenes/scene-metadata/",
  "/dev/doc/scene/scenes/tracing/",
  "/dev/doc/scene/gameobject/",
  "/dev/doc/scene/components/",
  "/dev/doc/scene/components/async/",
  "/dev/doc/scene/components/component-interfaces/",
  "/dev/doc/scene/components/component-methods/",
  "/dev/doc/scene/components/events/",
  "/dev/doc/scene/components/execution-order/",
  "/dev/doc/scene/gameobjectsystem/",
  "/dev/doc/scene/prefabs/",
  "/dev/doc/scene/prefabs/instance-overrides/",
  "/dev/doc/scene/prefabs/prefab-templates/",
  "/dev/doc/editor/editor-project/",
  "/dev/doc/editor/editor-widgets/",
  "/dev/doc/editor/editor-apps/",
  "/dev/doc/editor/property-attributes/",
  "/dev/doc/editor/custom-editors/",
  "/dev/doc/editor/asset-previews/",
  "/dev/doc/editor/editor-shortcuts/",
  "/dev/doc/editor/editor-events/",
  "/dev/doc/editor/texture-generators/",
  "/dev/doc/editor/editor-tools/",
  "/dev/doc/editor/editor-tools/component-editor-tools/",
  "/dev/doc/editor/undo-system/",
  "/dev/doc/editor/model-editor/",
  "/dev/doc/assets/ready-to-use-assets/",
  "/dev/doc/assets/ready-to-use-assets/citizen-characters/",
  "/dev/doc/assets/ready-to-use-assets/first-person-weapons/",
];

// Convert HTML to markdown-ish text
function htmlToMarkdown(html) {
  return html
    // Code blocks
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => {
      const lang = _.match(/language-(\w+)/)?.[1] || "csharp";
      const decoded = decodeHtml(code.trim());
      return `\n\`\`\`${lang}\n${decoded}\n\`\`\`\n`;
    })
    // Inline code
    .replace(/<code[^>]*>(.*?)<\/code>/gi, (_, code) => `\`${decodeHtml(code)}\``)
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, (_, t) => `\n# ${strip(t)}\n`)
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, (_, t) => `\n## ${strip(t)}\n`)
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, (_, t) => `\n### ${strip(t)}\n`)
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, (_, t) => `\n#### ${strip(t)}\n`)
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (_, href, text) => {
      const t = strip(text);
      if (href.startsWith("/dev/doc/")) {
        // Convert to local guide link
        const localPath = href.replace("/dev/doc/", "/guides/").replace(/\/$/, "");
        return `[${t}](${localPath})`;
      }
      return `[${t}](${href})`;
    })
    // Images
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, (_, src, alt) => `![${alt}](${src})`)
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, (_, src) => `![](${src})`)
    // Lists
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${strip(t).trim()}\n`)
    .replace(/<\/?[uo]l[^>]*>/gi, "\n")
    // Bold/italic
    .replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, (_, __, t) => `**${t}**`)
    .replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, (_, __, t) => `*${t}*`)
    // Paragraphs and breaks
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n${t.trim()}\n`)
    .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, (_, t) => `\n${t.trim()}\n`)
    // Tables (basic)
    .replace(/<table[\s\S]*?<\/table>/gi, (table) => {
      const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      if (rows.length === 0) return "";
      const result = rows.map((row) => {
        const cells = [...row[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)];
        return "| " + cells.map((c) => strip(c[1]).trim()).join(" | ") + " |";
      });
      if (result.length > 1) {
        const headerCells = [...rows[0][1].matchAll(/<t[hd][^>]*>/gi)].length;
        result.splice(1, 0, "| " + Array(headerCells).fill("---").join(" | ") + " |");
      }
      return "\n" + result.join("\n") + "\n";
    })
    // Strip remaining HTML
    .replace(/<[^>]+>/g, "")
    // Decode entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // Clean up whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function strip(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}

function decodeHtml(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// Convert URL path to a slug for the markdown file
function pathToSlug(path) {
  return path
    .replace("/dev/doc/", "")
    .replace(/\/$/, "")
    || "index";
}

// Derive category from path
function getCategory(path) {
  const parts = path.replace("/dev/doc/", "").split("/").filter(Boolean);
  if (parts.length === 0) return "About";
  const cat = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  return cat;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: "shell",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36");

  // First navigate to load Blazor
  console.log("Loading Blazor app...");
  await page.goto(BASE + START, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 3000));

  // Discover any additional pages we might have missed
  const allUrls = new Set(SEED_URLS);
  const visited = new Set();

  console.log(`Starting with ${allUrls.size} seeded URLs`);
  console.log("Discovering additional pages...\n");

  // Quick discovery pass using Blazor navigation
  for (const url of [...allUrls]) {
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      await page.evaluate((u) => Blazor.navigateTo(u), url);
      await new Promise((r) => setTimeout(r, 1500));

      const links = await page.evaluate(() =>
        [...document.querySelectorAll('a[href*="/dev/doc/"]')]
          .map((a) => a.getAttribute("href"))
          .filter((h) => h?.startsWith("/dev/doc/"))
      );

      let newCount = 0;
      for (const link of links) {
        if (!allUrls.has(link)) {
          allUrls.add(link);
          newCount++;
        }
      }
      if (newCount > 0) console.log(`  ${url} → +${newCount} new`);
    } catch (e) {
      // skip
    }
  }

  console.log(`\nTotal: ${allUrls.size} pages to scrape\n`);

  // Extract content from each page
  const pages = [];
  let i = 0;

  // Filter out hash links and duplicates
  const cleanUrls = [...allUrls]
    .filter((u) => !u.includes("#"))
    .sort();

  for (const url of cleanUrls) {
    i++;
    try {
      // Full page navigation — Blazor Server needs SignalR to connect
      await page.goto(BASE + url, { waitUntil: "load", timeout: 30000 });
      // Wait for Blazor's SignalR to connect and render
      await page.waitForFunction(
        () => document.querySelector(".document-content, .body-content, h1")?.textContent?.length > 5,
        { timeout: 15000 }
      ).catch(() => {});
      // Extra wait for remaining content to stream in
      await new Promise((r) => setTimeout(r, 3000));

      const data = await page.evaluate(() => {
        const contentEl =
          document.querySelector(".document-content") ||
          document.querySelector(".body-content") ||
          document.querySelector(".content-layout") ||
          document.querySelector("main") ||
          document.body;

        const title = document.querySelector("h1")?.textContent?.trim() || "";
        const html = contentEl?.innerHTML || "";
        const text = contentEl?.innerText?.trim() || "";

        return { title, html, textLength: text.length };
      });

      if (data.textLength < 10) {
        console.log(`  [${i}/${cleanUrls.length}] SKIP ${url} (empty)`);
        continue;
      }

      const slug = pathToSlug(url);
      const category = getCategory(url);
      const markdown = htmlToMarkdown(data.html);

      // Build frontmatter
      const frontmatter = [
        "---",
        `title: "${data.title.replace(/"/g, '\\"')}"`,
        `slug: "${slug}"`,
        `category: "${category}"`,
        `source: "${BASE}${url}"`,
        "---",
      ].join("\n");

      const fullContent = frontmatter + "\n\n" + markdown;

      // Write markdown file
      const filePath = join(OUT_DIR, slug + ".md");
      const dir = dirname(filePath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(filePath, fullContent);

      pages.push({ url, slug, title: data.title, chars: data.textLength });
      console.log(`  [${i}/${cleanUrls.length}] ${slug}.md — "${data.title}" (${data.textLength} chars)`);
    } catch (e) {
      console.error(`  [${i}/${cleanUrls.length}] ERROR ${url}: ${e.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone! Wrote ${pages.length} markdown files to ${OUT_DIR}/`);
}

main().catch(console.error);
