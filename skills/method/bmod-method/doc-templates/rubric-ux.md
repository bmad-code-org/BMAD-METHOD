Rate each strong, adequate, thin, or broken, judged against the document's altitude, job, and stakes:

1. Flow and intent coverage: every driving goal, trigger, or ticket requirement resolves to a concrete flow (`Key Flows` with protagonist, steps, climax, failure path), website page sequence (`WHY -> HOW -> WHAT`), or mapped psychological trigger without inventing unrequested scope.
2. Token and contrast completeness: `DESIGN.md` frontmatter defines valid hex values (with light/dark pairs where needed) or explicit UI-system/platform inheritance notes, every `{path.to.token}` reference resolves, and declared foreground/background pairs meet WCAG 2.1 contrast targets.
3. Component, brand, and logo rigor: every named component carries visual specs in `DESIGN.md` and behavioral rules in `EXPERIENCE.md`; any corporate logo/brand package (`BRAND.md`) covers clear space, monochrome, and `32px` favicon legibility.
4. State coverage: every interactive surface covers applicable states (cold load, empty, loading, focus, error, offline, permission-denied) rather than stopping at happy-path mocks.
5. Visual reference coverage: every file in `mockups/`, `wireframes/`, `logos/`, and `imports/` is linked inline at its relevant section explaining what it shows, with spines-win-on-conflict stated once and zero orphans.
6. Anti-slop and altitude discipline: no ticket/PRD restatement, no generic unmotivated aesthetic defaults, no solutions leaking onto `trigger-map`, and no per-epic screen detail leaking into `ux-system`.
7. Inheritance and naming discipline: `sources` resolve, journey and FR names match parent specs verbatim, and `ux-epic` inherits parent `DESIGN.md` read-only rather than copying shared tokens.
8. Shape and anchor fit: `DESIGN.md` follows Google Labs canonical section order and `EXPERIENCE.md` headings form clean, stable `#<section>` anchors that tickets and `bmad-build` can cite directly.

Then check the template's `Done when` lines.

Write `review-rubric.md`: a two-sentence verdict, the three fixes that matter most, then findings by dimension with severity, location, and fix.
