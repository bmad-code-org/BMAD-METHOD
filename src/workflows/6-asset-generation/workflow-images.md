---
name: images
description: Generate photos, illustrations, and backgrounds from specifications
---

# Images

**Goal:** Generate production-quality images (hero shots, product photos, illustrations, backgrounds) consistent with the visual direction.

---

## INITIALIZATION

### Agent Dialog Gate

1. Check for pending activity dialogs
2. If none, suggest creating one
3. Load dialog context


## Steps

Execute steps in `./steps-m/`:

| Step | File | Purpose |
|------|------|---------|
| 01 | step-01-load-context.md | Load page specs, visual direction, brand assets |
| 02 | step-02-inventory.md | Identify all images needed (single or batch) |
| 03 | step-03-select-style.md | Choose content style (photorealistic, illustration, etc.) |
| 04 | step-04-references.md | Attach reference images for consistency |
| 05 | step-05-generate.md | Craft prompts and generate, using earlier results as reference |
| 06 | step-06-review.md | Review as set, flag outliers for regeneration |

Content to be defined.

---

## AFTER COMPLETION

1. Update design log
2. Suggest next action
3. Return to activity menu
