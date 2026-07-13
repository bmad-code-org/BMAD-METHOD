---
id: astro-content
label: Astro content site
stack: Astro, content collections, official blog starter, zero-JS by default
best_for: Marketing sites, blogs, docs, and other content-first sites
requires: [node, npm, git]
scaffold: npm create astro@latest {target} -- --template blog --install --no-git --yes
verify_build: npm run build
verify_dev: npm run dev
verify_url: http://localhost:4321
---

# Astro Content Site

## Environment

No credentials needed. If a CMS or analytics service arrives later, Astro reads env through `import.meta.env` with `PUBLIC_` prefix for client-visible values.

## Bootstrap

1. Nothing required — the blog starter builds and serves as-is.
2. Note for the user: the sample posts under `src/content/` are placeholders to replace once planning lands.

## Agent Notes

- Content lives in content collections (`src/content/` with schemas in the content config) — new content types get a schema first, then entries; do not scatter loose markdown.
- The starter is zero-JS by default; interactive islands must be a deliberate choice (`client:*` directives), not a habit. Flag any SPA-shaped requirement to `bmad-architecture` — it may mean this template was the wrong pick.
- Routing is file-based under `src/pages/`; RSS and sitemap come from the official integrations already configured.
