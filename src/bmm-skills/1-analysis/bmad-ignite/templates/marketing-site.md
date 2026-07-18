---
id: marketing-site
label: Marketing site (SEO + blog + analytics)
stack: Astro, Tailwind CSS, MDX blog, JSON-LD structured data, RSS, sitemap, GA4/Plausible/Umami analytics
best_for: Marketing websites, landing pages, startup/product sites, and blogs that must rank and load fast — richer starting point than the plain astro-content starter
requires: [node, npm, git]
scaffold: git clone --depth 1 https://github.com/Yash-1511/bmad-template-marketing-astro.git {target}
verify_build: npm run build
verify_dev: npm run dev
verify_url: http://localhost:4321
---

# Marketing site (SEO + blog + analytics)

A community template repository based on AstroWind: SEO metadata, JSON-LD,
blog with content collections, config-toggled analytics (GA4, or cookieless
Plausible/Umami), and zero-config Vercel deployment are pre-wired. The
authoritative playbook ships inside the repo as `bmad-template.md` — step 3
adopts it after cloning, so this entry stays a thin pointer.
