Rate each strong, adequate, thin, or broken, judged against the existing product's stakes and user flows:

1. Evidence grounding: every finding cites a real UI file, route, screen, or screenshot rather than generic UX advice.
2. User impact and state rigor: missing empty, loading, error, offline, or permission states that leave users stuck are surfaced with severity matched to task failure risk.
3. Accessibility and craft precision: keyboard traps, missing labels, contrast failures, and layout/hierarchy noise include concrete fixes instead of vague "polish UI" notes.
4. Consistency and scope fit: token/pattern drift against `DESIGN.md`/`EXPERIENCE.md` is caught without forcing unnecessary full rewrites.
5. Actionable remediation slices: cleanup items are grouped into right-sized, testable slices ready for `bmad-build` or Sofia (`bmad-agent-po`).

Then check the template's `Done when` lines.

Write `review-rubric.md`: a two-sentence verdict, the three fixes that matter most, then findings by dimension with severity, location, and fix.
