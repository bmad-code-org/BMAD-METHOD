# Script-backed utility

Read this when the user asks for a skill whose work is mostly mechanical, or how scripts in a skill are written.

A thin `SKILL.md` names the outcome and when to run which script; tested scripts do the work. It fits when most of the job has one right answer per input: transforming files, counting, checking structure, generating from fixed rules, resolving paths. Prose would do that worse and differently every run.

Every script follows the same rules as a script in any skill (`help/craft-scripts.md`): a PEP 723 header so `uv run` picks its dependencies, `--help`, JSON on stdout when the agent reads the result, a non-zero exit with a reason rather than an error left for the agent to notice, a `unittest` test beside it, no hardcoded model ids. The skill's prose stays for the part that turns on meaning: what to do with the result.
