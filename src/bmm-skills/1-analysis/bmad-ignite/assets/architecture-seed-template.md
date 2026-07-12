# Architecture Seed Template

The stack record ignition hands to planning and architecture agents. Its Decided section is settled — the scaffolded repo already implements those choices, so downstream agents build on them instead of relitigating them. Changing a Decided entry later is a `bmad-correct-course` conversation, not a silent swap.

## Default Structure

```markdown
---
generated_by: bmad-ignite
status: seed
date: {date}
---

# Architecture Seed: {Project Name}

> Written by bmad-ignite after scaffolding. `## Decided` is implemented in the
> repo at {app_root} — architecture work starts from here, not from zero.

## Decided

| Decision | Choice | Source |
| --- | --- | --- |
| Starter template | {template id — label} | ignition |
| Language | [from template stack] | template |
| Framework | [from template stack] | template |
| Database / backend | [from template stack] | template |
| Auth approach | [from template stack, or "none yet"] | template |
| Styling / UI | [from template stack, if applicable] | template |

## Environment Variables

Names and purpose only — values live in the local env file, never here.

| Variable | Purpose | Where it comes from |
| --- | --- | --- |
| [NAME] | [purpose from the template's env example] | [template env guidance] |

## Pending Bootstrap

[Setup the user still owes — accounts to create, credentials to fill, bootstrap notes skipped in step 3. Empty if none.]

## Verification Record

| Check | Command | Outcome |
| --- | --- | --- |
| Build | [verify_build] | [passed / failed (reason) / skipped (reason)] |
| Boot | [verify_dev against verify_url] | [passed / failed (reason) / skipped (reason)] |

## Open Architecture Questions

[What the template deliberately does not decide — deployment target, background jobs, integrations. These go to `bmad-architecture`.]
```
