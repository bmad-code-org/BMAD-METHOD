---
name: bmad-generate-project-context
description: 'Deprecated — forwards to bmad-project-context. Use when the user says "generate project context" or "create project context"'
---

# DEPRECATED — forwards to bmad-project-context

Tell the user: this skill is deprecated — `bmad-project-context` now owns this job. Instead of one generated `project-context.md`, it writes a small verified block inside the repo's `AGENTS.md`, and any existing `project-context.md` is offered up for absorption rather than left orphaned. Invoke `bmad-project-context` next time.

Then invoke `bmad-project-context` with **setup** intent, forwarding the user's original request and any inputs they supplied (architecture doc, spec, standards, preferences), verbatim. It takes the workflow from here.
