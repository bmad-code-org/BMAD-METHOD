---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step 2: Plan

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- No human interaction: do not ask questions or wait for approval in this step.

## INSTRUCTIONS

1. Draft resume check. If `{spec_file}` exists with `status: draft`, read it and capture the verbatim `<intent-contract>...</intent-contract>` block as `preserved_intent_contract`. Otherwise `preserved_intent_contract` is empty.
2. Investigate codebase. _Use subagents for deep exploration. To prevent context snowballing, instruct subagents to give you distilled summaries only._
3. Read `./spec-template.md` fully. Fill it out based on the intent and investigation. If `{preserved_intent_contract}` is non-empty, substitute it for the `<intent-contract>` block in your filled spec before writing. Write the result to `{spec_file}`.
4. Self-review against READY FOR DEVELOPMENT standard.
5. If intent gaps exist, do not fantasize and do not leave open questions. HALT with status `blocked`, blocking condition `intent gaps`, and include the unanswered questions and evidence gathered.
6. Warning check. If step-01 carried `multiple-goals`, add it to `{spec_file}` frontmatter `warnings`. If `{spec_file}` exceeds 1600 tokens, add `oversized` to frontmatter `warnings`. Continue either way.

### READY-FOR-DEVELOPMENT GATE

Re-read `./SKILL.md`, then re-read `{spec_file}` from disk and verify the spec meets the READY FOR DEVELOPMENT standard.

- **If the file is missing:** HALT with status `blocked` and blocking condition `planned spec file disappeared before implementation`.
- **If the spec meets the standard:** set `{spec_file}` frontmatter status to `ready-for-dev`, then continue to step 3.
- **If the spec does not meet the standard:** repair it once, then re-read it from disk and verify again. If it still does not meet the standard, HALT with status `blocked`, blocking condition `spec failed ready-for-development standard`, and include the failing criteria and evidence gathered.


## NEXT

Read fully and follow `./step-03-implement.md`
