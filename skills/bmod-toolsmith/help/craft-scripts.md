# Scripts in a skill

Read this when the user asks whether something should be a script, why Smithy wrote one, or how scripts in a skill are run.

A script does work that has one right answer per input: parsing, counting, resolving paths, validating structure, rendering a template, diffing, generating random values. Prose does work that turns on meaning: judgment, tone, what to do with a result. A line on the wrong side is a defect the review catches: prose counting tokens or checking structure is paid on every run and done differently each time; a script deciding what a sentence means breaks when the phrasing shifts.

How a script is written: Python with a PEP 723 header (`requires-python = ">=3.11"`, dependencies listed), `--help`, JSON on stdout when the agent reads the result, a non-zero exit with a reason rather than an error left for the agent to notice, standard library first. A `unittest` test sits beside it at `scripts/tests/test_<name>.py`. No model ids anywhere; users run any model. No network unless the docstring says why.

How a script is run: always `uv run <path>`, with the skill's own scripts as `uv run {skill-root}/scripts/<name>.py` and the project's runtime scripts as `uv run {project-root}/_bmad/scripts/<name>.py`. Never `python`, `python3` or `pip`; `uv run` reads the header and provides the dependencies, so the user installs nothing. Never a bare `scripts/x.py`, which resolves from wherever the agent happens to be.

Tests assert what a script produced, never what a model wrote or what a prompt file says.
