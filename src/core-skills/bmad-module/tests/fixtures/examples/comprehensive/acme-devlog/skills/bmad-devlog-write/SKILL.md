---
name: bmad-devlog-write
description: Write today's devlog entry from the bundled template. Use when the user says "write devlog", "today's entry", or "log this".
---

# Devlog Write

Creates or appends today's devlog entry under the configured devlog path.

## EXECUTION

### Step 1: Resolve config

Read `{project-root}/_bmad/devlog/config.yaml`. Expect:

- `devlog_path` (absolute path)
- `entry_format` (`iso` | `weekly` | `monthly`)

If config is missing, invoke `/bmad-devlog-setup` first.

### Step 2: Determine the entry file

- `iso` → `<devlog_path>/<YYYY-MM-DD>.md`
- `weekly` → `<devlog_path>/<YYYY>-W<NN>.md`
- `monthly` → `<devlog_path>/<YYYY-MM>.md`

### Step 3: Initialize if absent

If the file doesn't exist, copy `./assets/template.md` to the target path. Substitute `{{date}}` and `{{author}}` (from `user_name`). For `weekly`/`monthly`, render the `{{date}}` heading from the period value (e.g. `2026-W21` or `2026-05`) instead of reusing the daily date.

### Step 4: Collect entry content

Ask the user:

1. **What did you ship today?** (bullet list)
2. **What blocked you?** (bullet list; "nothing" is valid)
3. **Open questions?** (bullet list; "none" is valid)
4. **One sentence summary.**

For `weekly`/`monthly` formats, append a dated sub-section (e.g. `## 2026-05-21`) rather than overwriting.

### Step 5: Write and confirm

Write the entry, print:

```
Wrote <devlog_path>/<filename>
```

If the file existed and you appended, print "Appended to …" instead.
