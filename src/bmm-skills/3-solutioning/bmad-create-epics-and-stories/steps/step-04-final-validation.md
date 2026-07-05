# Step 4: Final Validation

## STEP GOAL:

To independently audit requirements coverage and delivery-plan readiness without changing the outward-facing workflow or persona.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate product content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Process validation sequentially without skipping
- 📋 YOU ARE THE OUTWARD-FACING FACILITATOR, not the internal auditor
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Focus ONLY on requirements coverage and delivery-plan readiness
- 🔒 Separate the audit from the Step 1-3 authoring context
- 📄 Give the auditor only `epics.md`, its declared `inputDocuments`, and the audit contract
- ✍️ The auditor MUST NOT modify `epics.md`
- 🚫 Do not complete while unresolved critical findings remain
- 🚫 Do not present the auditor as another named agent the user must manage

## CONTEXT BOUNDARY:

The authoring and audit responsibilities share declared artifacts, not unrestricted conversation.

**Auditor inputs:**

- `{planning_artifacts}/epics.md`
- Every source path listed in its `inputDocuments` frontmatter
- `{skill-root}/references/delivery-plan-auditor.md`

**Auditor exclusions:**

- The Step 1-3 authoring conversation
- The author's private reasoning or confidence assessments
- Project documents not declared in `inputDocuments`
- Instructions to rewrite or repair `epics.md`

## VALIDATION PROCESS:

### 1. Verify Inputs

Confirm that `epics.md` and the audit contract exist. Read the `inputDocuments` frontmatter and resolve every declared source.

Do not hide unavailable sources. The auditor must record them as input limitations and reduce the confidence of its verdict.

### 2. Run the Audit

**Preferred path — isolated subagent:**

Dispatch a fresh subagent with this task:

> Read fully and follow `{skill-root}/references/delivery-plan-auditor.md`.
> Audit `{planning_artifacts}/epics.md` using only that artifact and its
> declared `inputDocuments`. Record the audit mode as `isolated subagent`.
> Write the complete report to
> `{planning_artifacts}/reviews/delivery-plan-audit.md`. Do not modify
> `epics.md`. Return only the compact result required by the audit contract.

Do not pass the authoring conversation to the subagent.

**Fallback path — reduced-isolation sequential audit:**

If subagents are unavailable:

1. Load `{skill-root}/references/delivery-plan-auditor.md`.
2. Restrict evidence to `epics.md` and its declared `inputDocuments`.
3. Record the audit mode as `sequential fallback`.
4. Write the complete report before continuing.
5. Flush the detailed review from working context as far as the platform permits.
6. Continue using only the compact result required by the audit contract.

The fallback preserves the file and role contract, but it is not equivalent independence. Do not silently revert to ordinary in-context self-validation.

### 3. Present and Triage Findings

The compact result must include:

- verdict: `PASS`, `PASS WITH FINDINGS`, or `BLOCKED`
- finding counts by severity
- no more than five critical or high findings
- the full report path

If the report was not written, the audit is incomplete.

Present the verdict and finding counts. Walk critical and high findings one at a time. Let the user apply the recommendation, discuss it, defer it with explicit risk acceptance, or dismiss it with a reason. Summarize medium and low findings in one line with the report path.

The parent workflow owns accepted edits to `epics.md`; the auditor remains read-only.

Critical findings demonstrating missing required coverage, impossible dependency order, or an unimplementable plan block completion. High findings may remain only with explicit user risk acceptance.

### 4. Confirm Material Corrections Once

Material corrections change epic or story boundaries, ordering, requirements coverage, acceptance criteria, or architecture/NFR/UX alignment.

If material corrections were applied, run the same audit contract once more with the same bounded inputs. Write the result to:

`{planning_artifacts}/reviews/delivery-plan-audit-confirmation.md`

Do not start an automatic author-auditor loop. If the confirmation audit still reports critical findings, stop and ask the user how to proceed.

### 5. Complete and Save

Completion requires:

- the audit report exists
- no unresolved critical findings remain
- remaining high findings have explicit user risk acceptance
- accepted corrections are saved in `{planning_artifacts}/epics.md`
- all placeholders are resolved and formatting is valid

**Present Final Menu:**

**Final validation complete.** [C] Complete Workflow

HALT — wait for user input before proceeding.

When C is selected, the workflow is complete and `epics.md` is ready for development.

Epics and Stories complete. Invoke the `bmad-help` skill.

Upon completion of task output, offer to answer questions about the Epics and Stories.

## On Complete

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete`

If the resolved `workflow.on_complete` is non-empty, follow it as the final terminal instruction before exiting.
