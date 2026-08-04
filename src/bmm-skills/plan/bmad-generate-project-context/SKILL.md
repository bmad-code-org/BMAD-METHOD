---
name: bmad-generate-project-context
description: 'Deprecated — forwards to bmad-project-context. Use when the user says "generate project context" or "create project context"'
---

# DEPRECATED — forwards to bmad-project-context

Tell the user: this skill is deprecated — `bmad-project-context` now owns this job. Instead of one generated `project-context.md`, it curates a small verified context system (an always-loaded kernel plus a knowledge bundle); any existing `project-context.md` keeps loading and becomes a mining source. Invoke `bmad-project-context` next time.

Then invoke `bmad-project-context` with **ingest** intent, forwarding the user's original request and any inputs they supplied (architecture doc, spec, preferences), verbatim. It takes the workflow from here.
