# Design Space Capture Guide — Freya

## Auto-Capture (Default)

Capture insights **automatically during conversations** — don't wait for the user to ask. When you make a design decision, discover a component quirk, or learn something from a failed experiment, capture it via HTTP to the edge functions. Multiple agents share the Space — your insight today helps another agent tomorrow.

## When to Capture

Capture knowledge to Design Space at these moments:

1. **After completing a UX flow** — Layout decisions, interaction patterns, responsive strategies
2. **After writing a specification** — Content decisions, functionality choices, edge cases found
3. **After a failed experiment** — Component that didn't work, layout that broke, pattern that confused users
4. **After a successful pattern** — Validated solution worth reusing across projects
5. **After design system work** — Token changes, component API decisions, deprecation rationale
6. **After client design reviews** — Reactions, preferences, surprises
7. **After asset generation** — Prompt patterns that worked, image generation learnings

## How to Capture

POST to `{DESIGN_SPACE_URL}/functions/v1/capture-design-space` with:

```json
{
  "content": "Your insight here — be specific",
  "category": "successful_pattern",
  "project": "{project_tag}",
  "designer": "marten",
  "topics": ["domain-tag"],
  "components": ["component-name"],
  "source": "agent-dialog"
}
```

Headers: `Content-Type: application/json`, `Authorization: Bearer {SUPABASE_ANON_KEY}`

See protocol.md for the full API key and all available edge functions.

## How to Search

Before designing, search for relevant prior knowledge by POSTing to `search-design-space`:

```json
{"query": "{component_name} experiences", "project": "...", "limit": 10}
{"query": "mobile layout for {page_type}"}
{"query": "failed experiments with {approach}"}
{"query": "{domain} design patterns"}
```

## Quality Bar

**Good:** "Bottom sheet navigation works better than hamburger menu for mobile service sites with 4-6 primary actions. Tested on Kalla — task completion felt faster, reduced confusion about available actions. Key insight: services (not content) need actions visible, not hidden."

**Bad:** "Bottom sheets are good for mobile."

Include: what, where tested, why it works/fails, transferable insight.

## Minimum Per Deliverable

Capture **2-5 insights** after each major deliverable (UX flow, specification, design system update).

## What NOT to Capture

- Pixel-level details without strategic context
- Personal aesthetic preferences without user/business justification
- Incomplete experiments (wait for a conclusion)
- Information already in the specification document
- Debugging steps (capture the solution, not the struggle)

## Component Experience Format

When capturing component experiences, structure as:

```
Component: {name}
Context: {where used, what project, what constraints}
Behavior: {what happened — responsive, interactive, edge cases}
Verdict: {keep / modify / avoid}
Transferable: {what other projects can learn from this}
```

---

## Design Feedback Loop (CRITICAL)

When the designer suggests an improvement, capture the learning. This is how the Design Space accumulates solutions. See `feedback-loop-guide.md` for the full protocol.

**Philosophy:** Capture what works and how we got there. The "before" is context — the "after" is knowledge. Focus on solutions, not complaints.

### Quick Reference

1. Designer suggests improvement → capture BEFORE state
2. Ask "What would make this better?" (see feedback-loop-guide.md for phrasing)
3. Apply the improvement → capture AFTER state
4. Save via `capture-feedback-pair` edge function (pattern_type_before: "rejected", pattern_type_after: "approved")
5. Confirm: "Learned: [X approach] works better because [reasoning]"

### Proactive Improvement Check (MANDATORY)

**Before presenting ANY new design**, POST to `search-preference-patterns`:

```json
{
  "description": "[describe your proposed design]",
  "image_base64": "[screenshot if available]",
  "project": "current-project"
}
```

If matches found → apply the learned improvement before presenting. Mention it: "I applied [X] — it worked better in similar designs."

---

## Visual Capture

When working with wireframes, prototypes, or visual designs, POST to `capture-visual` instead of `capture-design-space`:

```json
{
  "content": "[detailed description of what it looks like and why]",
  "image_base64": "[base64 screenshot]",
  "category": "successful_pattern",
  "project": "...",
  "pattern_type": "approved",
  "topics": ["..."],
  "components": ["..."]
}
```

Use `search-visual-similarity` to find patterns that LOOK like what you're designing — complements `search-design-space` which finds patterns that MEAN similar things.

---

## Pattern Types

Tag every capture with its role in the design journey:

- `baseline` — the starting state before changes
- `inspiration` — external reference that influenced direction
- `delta` — what changed (modification, not full rejection)
- `rejected` — designer didn't like it (always pair with reasoning)
- `approved` — designer liked it (always pair with what was rejected)
- `conditional` — works in some contexts but not others
