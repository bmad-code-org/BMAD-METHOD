---
name: 'step-01-clarify-and-route'
description: 'Capture intent, route to execution path'

wipFile: '{implementation_artifacts}/tech-spec-wip.md'
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
spec_file: '' # set at runtime before leaving this step
---

# Step 1: Clarify and Route

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- The prompt that triggered this workflow IS the intent — not a hint.
- Do NOT assume you start from zero.

## ARTIFACT SCAN

- `{wipFile}` exists? → Offer resume or archive.
- Active specs (`ready-for-dev`, `in-progress`, `in-review`) in `{implementation_artifacts}`? → List them and HALT. Ask user which to resume (or `[N]` for new).
  - If `ready-for-dev` or `in-progress` selected: Set `spec_file`, set `execution_mode = "plan-code-review"`, skip to step 3.
  - If `in-review` selected: Set `spec_file`, set `execution_mode = "plan-code-review"`, skip to step 4.
- Unformatted spec or intent file lacking `status` frontmatter in `{implementation_artifacts}`? → Suggest to the user to treat its contents as the starting intent for this workflow. DO NOT attempt to infer a state and resume it.

## INSTRUCTIONS

1. Load context.
   - List files in `{planning_artifacts}` and `{implementation_artifacts}`.
   - If you find an unformatted spec or intent file, ingest its contents to form your understanding of the intent.
2. Clarify intent. Do not fantasize, do not leave open questions. If you must ask questions, ask them as a numbered list. When the human replies, verify that every single numbered question was answered. If any were ignored, HALT and re-ask only the missing questions before proceeding. Keep looping until intent is clear enough to implement.
3. Version control sanity check. Is the working tree clean? Does the current branch make sense for this intent — considering its name and recent history? If the tree is dirty or the branch is an obvious mismatch, HALT and ask the human before proceeding. If version control is unavailable, skip this check.
4. Multi-goal check (see SCOPE STANDARD). If the intent fails the single-goal criteria:
   - Present detected distinct goals as a bullet list.
   - HALT and ask human: `[S] Split — pick first goal, defer the rest` | `[K] Keep as-is`
   - On **S**: Append deferred goals to `{deferred_work_file}`. Narrow scope to the first-mentioned goal. Continue routing.
   - On **K**: Proceed as-is.
5. Generate `spec_file` path:
   - Derive a valid kebab-case slug from the clarified intent.
   - If `{implementation_artifacts}/tech-spec-{slug}.md` already exists, append `-2`, `-3`, etc.
   - Set `spec_file` = `{implementation_artifacts}/tech-spec-{slug}.md`.
6. Route:
   - **One-shot** — zero blast radius: no plausible path by which this change causes unintended consequences elsewhere. Clear intent, no architectural decisions. `execution_mode = "one-shot"`. → Step 3.
   - **Plan-code-review** — everything else. `execution_mode = "plan-code-review"`. → Step 2.
   - When uncertain whether blast radius is truly zero, default to plan-code-review.


## NEXT

- One-shot / ready-for-dev: Read fully and follow `{installed_path}/steps/step-03-implement.md`
- Plan-code-review: Read fully and follow `{installed_path}/steps/step-02-plan.md`
