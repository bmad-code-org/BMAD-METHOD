---
task_id: ''
run_id: ''
run_dir: ''
spec_file: ''
review_file: ''
result_file: ''
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
mode: ''
---

# Step 1: Resolve Invocation

## Rules

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`.
- The triggering prompt is the orchestrator invocation.
- Do not ask for missing information.
- Do not infer broad product intent from weak hints.
- Do not modify product code in this step.

## Instructions

1. Parse the invocation.
   - Prefer explicit fields: `task_id`, `run_id`, `intent`, `source_refs`, `resume_from`, `constraints`, `acceptance`, and `verification`.
   - If the invocation points to a file, load it and treat its contents as the invocation payload.
   - If `resume_from` is present, resolve it to either an existing run directory or an existing `spec.md`.
   - If no `task_id` is supplied, derive a stable kebab-case value from the intent. If the intent is absent, use `unresolved`.
   - If no `run_id` is supplied, derive one from `{date}` and current HEAD when version control is available.

2. Establish artifact paths.
   - If resuming from a run directory, set `{run_dir}` to that directory.
   - If resuming from a spec file, set `{run_dir}` to that file's parent directory.
   - Otherwise, set `{run_dir}` to `{implementation_artifacts}/auto/{task_id}`. If it already exists and this is not a resume, append a deterministic numeric suffix.
   - Set `{spec_file}` to `{run_dir}/spec.md`.
   - Set `{review_file}` to `{run_dir}/review.md`.
   - Set `{result_file}` to `{run_dir}/result.json`.
   - Create `{run_dir}` if it does not exist.

3. Validate minimal input.
   - If neither a precise intent nor a readable resume spec exists, write `{result_file}` using the result schema from `../result-schema.md` with `status` = `blocked`, `blocked_reason` = `missing_intent`, and the resolved artifact paths.
   - End cleanly after writing the blocked result. Do not continue to Step 2.

4. Perform a version-control sanity check.
   - Record current branch, HEAD, and working tree state in memory for the result.
   - Compute the dirty file list before product-code work, excluding `{implementation_artifacts}`, `{planning_artifacts}`, `{project-root}/_bmad`, and `{project-root}/.bmad-auto` paths.
   - If the remaining product-code dirty file list is non-empty and the invocation does not explicitly allow dirty resume, do not modify product code. Write `{result_file}` using the result schema from `../result-schema.md` with `status` = `blocked`, `blocked_reason` = `dirty_worktree`, and the dirty file list.
   - End cleanly after writing the blocked result.

5. Load source references.
   - Load every readable file in `source_refs`.
   - If a reference is missing, record it as an input warning. Missing optional references do not block unless the intent depends on them.

6. Set `{mode}`.
   - `resume` when `{spec_file}` already exists and is readable.
   - `plan` otherwise.

## Next

Read fully and follow `./step-02-plan-or-resume.md`.
