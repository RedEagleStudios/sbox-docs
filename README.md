# s&box Community Docs

A fast, searchable, and statically generated API reference for the [s&box](https://sbox.game) game engine.

**Live site:** https://sbox.redeaglestudios.org

## Features

- 1,827 pre-rendered type pages (classes, structs, enums, interfaces)
- Pagefind-powered full-text search with Ctrl+K
- Nested namespace tree sidebar with filtering
- Syntax-highlighted type signatures
- Dark theme matching the s&box aesthetic
- Daily automated rebuilds via GitHub Actions

## Tech Stack

- [Astro](https://astro.build) — static site generation
- [React](https://react.dev) — interactive islands (search, sidebar)
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Pagefind](https://pagefind.app) — search indexing
- [Bun](https://bun.sh) — package manager & runtime

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
bun run preview
```

Note: `api-data.json` is not in the repo — it's fetched from `cdn.sbox.game` during CI. For local dev, download it manually:

```bash
curl -sL "https://cdn.sbox.game/releases/2026-04-02-21-06-53.zip.json" -o api-data.json
```

## Deployment

Deploys automatically to GitHub Pages on push to `main`. Also runs daily at 6am UTC to pick up API changes.

You can manually trigger a build with a custom API URL via Actions > "Deploy to GitHub Pages" > "Run workflow".
