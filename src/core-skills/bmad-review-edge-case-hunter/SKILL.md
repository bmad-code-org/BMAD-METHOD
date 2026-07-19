---
name: bmad-review-edge-case-hunter
description: 'Deprecated — forwards to bmad-review.'
---

Merged into `bmad-review`. Invoke the `bmad-review` skill on the same content with only the `edge-case-hunter` lens, passing through any `also_consider` areas. Output ONLY the raw findings JSON array in the legacy shape: the four standard fields (plus `kind`/`confidence` on deletion findings), no `lens` field, no markdown wrapping, no extra text. `[]` is valid when nothing is found.
