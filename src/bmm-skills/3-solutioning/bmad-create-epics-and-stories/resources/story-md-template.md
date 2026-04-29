# {{title}}

<!-- USER_STORY_START -->
As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.
<!-- USER_STORY_END -->

## Acceptance Criteria

<Each AC stands alone. Given/When/Then form. Specific and testable. Cover happy path, key edge cases, and at least one failure mode where applicable.>

- **AC1** — Given <precondition>, When <action>, Then <expected outcome>.
- **AC2** — ...

## Technical Notes

<Implementation hints — file paths, API contracts, gotchas, references into the epic's Shared Context. Not a full design; just what saves the implementer a lookup.>

## Coverage

<AC-to-requirement mapping. One line per AC. Use the FR / NFR / UX-DR codes from the requirements inventory.>

- AC1 → <list of FR / NFR / UX-DR codes>
- AC2 → <list of FR / NFR / UX-DR codes>

---

**Stripping rules** (applied by `init_story.py` based on `--type`):

- `type: task` — the `<!-- USER_STORY_START --> ... <!-- USER_STORY_END -->` block (and its surrounding blank line) is removed.
- `type: bug` / `type: spike` — the block is left in. Remove or fill it as fits the story.
- `type: feature` — the block is left in. The user-story stanza is required.
