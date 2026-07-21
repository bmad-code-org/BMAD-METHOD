# HTML Briefing

When `"html"` is in `{workflow.output_formats}`, generate `research-briefing.html` in `{doc_workspace}` after `research.md` is final. It is a presentation of the report, never a second source of truth — same claims, same numbers, same citations.

## Requirements

- **Self-contained single file**: inline CSS and JS, no external requests of any kind (no CDN, no fonts, no remote images). It must render from a `file://` open, offline, forever.
- **Structure**: a header (topic, type, decision, date, depth, verification level) → the executive summary as the opening card → sticky table of contents → dimension sections → contrary evidence (when present) → recommendations → collapsible source appendix → staleness map.
- **Confidence is visual**: every claim carries its badge — verified / medium / low / `unverified` / disputed — color-coded with the status text always present (never color alone). Unverified and disputed must be *more* prominent than verified, not less.
- **Sources are live**: inline `[n]` markers link to the appendix row; appendix rows link out to the source URL.
- **Charts sparingly**: only where the data genuinely benefits (market size trajectory, decision matrix scores) — simple inline SVG, labeled axes, no library.
- **Responsive and theme-aware**: readable on a phone; respect `prefers-color-scheme` for light/dark.

## Theme

`{workflow.html_theme}` governs: a `file:` path loads a theme/brand spec to follow; inline text is applied as directives; empty means the shipped default — neutral, professional, generous whitespace, system font stack, one restrained accent color. Whatever the theme, the confidence-badge semantics above are non-negotiable.
