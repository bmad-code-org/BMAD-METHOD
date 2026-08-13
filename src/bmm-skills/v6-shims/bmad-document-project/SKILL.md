---
name: bmad-document-project
description: 'Deprecated — forwards to bmad-project-context. Use when the user says "document this project" or "generate project docs"'
metadata:
  lifecycle: shim
---

# DEPRECATED — forwards to bmad-project-context

Tell the user two things.

First: this skill is deprecated. Generating documentation volume about a codebase made agents worse, not better — agents read code more accurately than prose describing code, and the generated set was stale on arrival. `bmad-project-context` owns what remains useful: a small verified block in the repo's `AGENTS.md` carrying what the code cannot say — required policy, conventions that differ from defaults, what running the project takes that no config file states, and known pitfalls.

Second, so they are not surprised by what they get: the deeper "explain this system, its rationale and its history" material is a different altitude and is not part of that block. It is coming as its own capability. If that is what they were after, say so plainly rather than producing a thin substitute.

Then invoke `bmad-project-context` with **setup** intent, forwarding the user's original request and any paths or documents they supplied, verbatim. It takes the workflow from here.
