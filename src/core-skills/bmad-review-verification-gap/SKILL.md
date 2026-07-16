---
name: bmad-review-verification-gap
description: 'Deprecated — forwards to bmad-review.'
---

Merged into `bmad-review`. Invoke the `bmad-review` skill on the same content with only the `verification-gap` lens. Present the markdown rendering only (no JSON block), listing any `gap_shape: "other"` findings under an `## Other findings` heading. When there are no findings at all, output exactly this single line: `No verification gaps found.`
