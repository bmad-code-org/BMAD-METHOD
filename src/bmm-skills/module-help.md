# BMad Method Development Paths

Choose the lightest path that fits the work. Session counts are guidance, not gates: risk, ambiguity, architectural reach, integration, and coordination may justify more planning.

- For an obvious low-risk edit, use no BMad workflow when added structure would not help.
- For session-sized intent, run `bmad-build` directly.
- For one epic spanning several sessions, run `bmad-spec`, ask for Story Breakdown, then run `bmad-build` once per story. Verify integration across the stories and close the epic with `bmad-retrospective`.
- For a multi-epic project, create the needed product, UX, architecture, readiness, and coordination contracts. Each story still enters Build as one unit.

Use attentive Build for foundational or consequential work. Use `bmad-build-auto` only after important decisions and repeated patterns have stabilized. Build Auto executes one selected unit; a human, AI session, `bmad-loop`, or another orchestrator owns selection and dispatch.
