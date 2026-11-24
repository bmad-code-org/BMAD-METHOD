---
title: ""
template: website-design
version: 1.0.0
category: ux-website
description: "Marketing site, landing page, docs, or portfolio UX: narrative flow, pages, conversion, and responsive system."
not_for: "Multi-epic stateful SaaS applications (`ux-system`, `ux-epic`); corporate logo and brand kit (`brand-identity`); existing site UX critique (`ux-audit`)."
agents: [bmad-agent-ux-designer]
companions: [DESIGN.md, EXPERIENCE.md]
facilitation_order: [site-goal-and-audience-awareness, narrative-and-golden-circle, sitemap-and-page-choreography, copy-voice-and-conversion, findability-and-page-metadata, visual-system-and-responsive-rules, mockups-and-visual-references, open-questions]
guidance: guidance-method.md
rubric: rubric-ux.md
lint: uv run "{project-root}/_bmad/method/scripts/lint_ux.py" --project-root "{project-root}" "{doc}"
view: offer
status: draft
created: ""
updated: ""
---

<!-- purpose: Design a public website, marketing landing page, documentation hub, or portfolio end-to-end so `bmad-build` can build it directly without heavy app-PRD ceremony — uniting audience psychology, persuasive storytelling, conversion flow, UX findability, responsive layout, and visual craft. -->

<!-- stance: Websites are persuasion, clarity, and editorial rhythm — not app dashboards. Coach non-UX users with concrete structural options and real draft headlines/CTAs rather than abstract wireframes. Keep technical web engineering (SSR/SSG rendering architecture, CDN caching, Core Web Vitals budgets, sitemap.xml/JSON-LD implementation) out of scope here — hand those to Winston (`bmad-agent-architect`) or `bmad-build` if non-trivial. -->

<!-- opening: Read any `trigger-map`, `brand-identity` (`branding/DESIGN.md`), `design-direction`, or existing site URLs first. Ask what the site must convince visitors to do, who arrives and how aware they already are, and whether brand tokens or favorite reference sites exist. -->

<!-- inputs: Trigger map / positioning (if any), existing `DESIGN.md` / `BRAND.md`, reference sites (`imports/`), real offer/proof details, and target conversion actions. -->

<!-- companions: Write `{run}/DESIGN.md` (or inherit existing brand tokens with responsive editorial additions) and `{run}/EXPERIENCE.md` covering page section sequences, responsive stacking, interactive states (nav drawer, forms, pricing toggles, modals), accessibility, and microcopy. -->

<!-- writing:
  - Order key pages using Golden Circle (`WHY -> HOW -> WHAT`): lead with the visitor outcome/emotional hook, show how it works clearly, prove credibility, then ask for the concrete CTA matched to their awareness stage.
  - Cover UX findability cleanly per page (`URL slug`, `Primary search/visitor intent`, `H1`, key `H2` structure, `Title & meta description copy`, social preview) while noting that technical SEO, schema markup, and hosting setup belong to Winston / `bmad-build`.
  - Keep tokens backticked in prose (`{colors.primary}`); render interactive responsive hero/landing-page HTML prototypes via `{workflow.creative_tools}` or `{workflow.design_handoffs}` and promote keepers to `{run}/mockups/`.
  - Keep `{doc}` concise as the website UX blueprint index; set companion `status: final` and `updated` at Close.
-->

<!-- done when: Primary visitor awareness stages and CTAs are locked; every page's section rhythm (`WHY -> HOW -> WHAT`), proof blocks, and conversion flow are concrete; interactive nav/form/error states and responsive rules live in `EXPERIENCE.md`; UX findability metadata covers every page; and `DESIGN.md` + promoted mockups pass `lint_ux.py`. -->

# {title}

## Table of Contents

## Site goal and audience awareness
<!-- Primary conversion goal, inherited `branding/DESIGN.md` or `trigger-map` links, visitor segments, and awareness stages (`Unaware` through `Most Aware`) shaping how much context each entry page needs. -->

## Narrative and Golden Circle
<!-- Core `WHY -> HOW -> WHAT` arc, above-the-fold value proposition, trust proof pillars, objection handlers, and primary vs. secondary CTAs. -->

## Sitemap and page choreography
<!-- Page inventory table (`| Page | Purpose | Entry point | CTA |`), plus section-by-section choreography for every key page recorded cleanly in `EXPERIENCE.md`. -->

## Copy voice and conversion
<!-- Headline/CTA Do and Don't rules, form friction/validation copy, empty/submission states, and lead/signup feedback documented in `EXPERIENCE.md`. -->

## Findability and page metadata
<!-- Per-page clean URL slugs, visitor intent, semantic `H1 -> H2 -> H3` hierarchy, title/meta description/OG card copy; note any technical SEO, structured data, or SSR/SSG needs handed to Winston (`bmad-agent-architect`) or `bmad-build`. -->

## Visual system and responsive rules
<!-- Token decisions in `{run}/DESIGN.md` (type contrast across desktop/mobile hero scales, surface cadence, editorial spacing), breakpoint stacking, nav drawer behavior, motion restraint, and keyboard/screen-reader accessibility floor. -->

## Mockups and visual references
<!-- Interactive responsive HTML page prototypes or wireframes promoted to `{run}/mockups/` or `{run}/wireframes/` and `{workflow.design_handoffs}` imports linked inline in `EXPERIENCE.md`. -->

## Open questions
<!-- optional. Missing brand photography, copy assets, legal footer text, or analytics events with owners. -->
