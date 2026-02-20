# audit-file-refs

Audit new-format BMAD source files for file-reference convention violations using parallel Haiku subagents.

## Convention

In new-format BMAD workflow and task files (`src/bmm/`, `src/core/`, `src/utility/`), every file path reference must use one of these **valid** forms:

- `{project-root}/_bmad/path/to/file.ext` — canonical form, always correct
- `{installed_path}/relative/path` — valid in new-format step files (always defined by workflow.md before any step is reached)
- Template/runtime variables: `{nextStepFile}`, `{workflowFile}`, `{{mustache}}`, `{output_folder}`, `{communication_language}`, etc. — skip these, they are substituted at runtime

**Flag any reference that uses:**

- `./step-NN.md` or `../something.md` — relative paths
- `step-NN.md` — bare filename with no path prefix
- `steps/step-NN.md` — bare steps-relative path (missing `{project-root}/_bmad/...` prefix)
- `` `_bmad/core/tasks/help.md` `` — bare `_bmad/` path (missing `{project-root}/`)
- `/Users/...`, `/home/...`, `C:\...` — absolute system paths

References inside fenced code blocks (``` ``` ```) are examples — skip them.

Old-format files in `src/bmm/workflows/4-implementation/` use `{installed_path}` by design within the XML calling chain — exclude that directory entirely.

## Steps

1. Run this command to get the file list:
   ```
   find src/bmm src/core src/utility -type f \( -name "*.md" -o -name "*.yaml" \) | grep -v "4-implementation" | sort
   ```

2. Divide the resulting file paths into batches of roughly 20 files each.

3. For each batch, spawn a subagent (`subagent_type: "Explore"`, `model: "haiku"`) with this prompt (fill in the actual file paths):

   > Read each of these files (use the Read tool on each):
   > [list the file paths from this batch]
   >
   > For each file, identify every line that contains a file path reference that violates the convention described below. Skip references inside fenced code blocks. Skip template variables (anything containing `{` that isn't `{project-root}` or `{installed_path}`).
   >
   > **Valid references:** `{project-root}/_bmad/...`, `{installed_path}/...`, template variables.
   > **Flag:** bare filenames (`step-NN.md`), `./` or `../` relative paths, bare `steps/` paths, bare `_bmad/` paths (without `{project-root}/`), absolute system paths.
   >
   > Return findings as a list:
   > `path/to/file.md:LINE_NUMBER | VIOLATION_TYPE | offending text`
   >
   > If a file has no violations, include it as: `path/to/file.md | clean`
   >
   > End your response with a single line: `FILES CHECKED: N` where N is the exact number of files you read.

4. Collect all findings from all subagents.

5. **Self-check before reporting:** Count the total number of files returned by the `find` command. Sum the `FILES CHECKED: N` values across all subagent responses. If the totals do not match, identify which files are missing and re-run subagents for those files before proceeding. Do not produce the final report until all files are accounted for.

6. Output a final report:
   - Group findings by violation type
   - List each finding as `file:line — offending text`
   - Show total count of violations and number of affected files
   - If nothing found, say "All files conform to the convention."
