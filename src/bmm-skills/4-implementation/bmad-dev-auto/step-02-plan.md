---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step 2: Plan

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- No intermediate approvals.
- Never ask questions or wait for approval.

## INSTRUCTIONS

1. Draft resume check. If `{spec_file}` exists with `status: draft`, read it and capture the verbatim `<frozen-after-approval>...</frozen-after-approval>` block as `preserved_intent`. Otherwise `preserved_intent` is empty.
2. Investigate codebase. _Isolate deep exploration in sub-agents/tasks where available. To prevent context snowballing, instruct subagents to give you distilled summaries only._
3. Read `./spec-template.md` fully. Fill it out based on the intent and investigation. If `{preserved_intent}` is non-empty, substitute it for the `<frozen-after-approval>` block in your filled spec before writing. Write the result to `{spec_file}`.
4. Self-review against READY FOR DEVELOPMENT standard.
5. If intent gaps exist, do not fantasize and do not leave open questions. Set `{spec_file}` frontmatter status to `blocked`, append `## Auto Run Result` with `Status: blocked`, the unanswered questions, and evidence gathered, then terminate cleanly.
6. Warning check. If step-01 carried `multiple-goals`, add it to `{spec_file}` frontmatter `warnings`. If `{spec_file}` exceeds 1600 tokens, add `oversized` to frontmatter `warnings`. Continue either way.

### APPROVAL BLOCK

Do not present a conversational checkpoint.

Re-read `{spec_file}` from disk.
- **If the file is missing:** write a best-effort result artifact in `{implementation_artifacts}` with `Status: blocked`, `Blocking condition: planned spec file disappeared before implementation`, and terminate cleanly.
- **If the file exists:** compare the content to what you wrote. If it has changed since you wrote it, note the external edits in `## Auto Run Result`. Set `{spec_file}` frontmatter status to `blocked`, append `## Auto Run Result` with `Status: blocked`, `Blocking condition: missing spec approval/edit decision`, and terminate cleanly.


## NEXT

Read fully and follow `./step-03-implement.md`
