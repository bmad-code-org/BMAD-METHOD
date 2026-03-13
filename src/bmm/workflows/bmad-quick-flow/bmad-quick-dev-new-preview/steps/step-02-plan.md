---
name: 'step-02-plan'
description: 'Investigate, generate spec, present for approval'

templateFile: '../tech-spec-template.md'
wipFile: '{implementation_artifacts}/tech-spec-wip.md'
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step 2: Plan

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- No intermediate approvals.

## INSTRUCTIONS

1. Investigate codebase. _Isolate deep exploration in sub-agents/tasks where available. To prevent context snowballing, instruct subagents to give you distilled summaries only._
2. Read `{templateFile}` fully. Fill it out based on the intent and investigation, and write the result to `{wipFile}`.
3. Self-review against READY FOR DEVELOPMENT standard.
4. If intent gaps exist, do not fantasize, do not leave open questions, HALT and ask the human.
5. Token count check (see SCOPE STANDARD). If spec exceeds 1600 tokens:
   - Show user the token count.
   - HALT and ask human: `[S] Split — carve off secondary goals` | `[K] Keep full spec — accept the risks`
   - On **S**: Propose the split — name each secondary goal. Append deferred goals to `{deferred_work_file}`. Rewrite the current spec to cover only the main goal — do not surgically carve sections out; regenerate the spec for the narrowed scope. Continue to checkpoint.
   - On **K**: Continue to checkpoint with full spec.

### CHECKPOINT 1

Present summary. If token count exceeded 1600 and user chose [K], include the token count and explain why it may be a problem. HALT and ask human: `[A] Approve` | `[E] Edit`

- **A**: Rename `{wipFile}` to `{spec_file}`, set status `ready-for-dev`. Everything inside `<frozen-after-approval>` is now locked — only the human can change it. → Step 3.
- **E**: Apply changes, then return to CHECKPOINT 1.


## NEXT

Read fully and follow `./steps/step-03-implement.md`
