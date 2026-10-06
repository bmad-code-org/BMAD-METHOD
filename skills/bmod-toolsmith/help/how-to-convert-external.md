# How to: bring an outside skill, rule or prompt to BMad

Read this when the user has something from another tool: a Claude Code or Codex skill, a Cursor rule, a GPT, a slash command, a system prompt they keep pasting.

1. **Point Smithy at it**: the file, folder or pasted text. He reads it whole and extracts the outcome, who consumes it, the triggers the author meant, the know-how a model would not have, and any scripts.
2. **He drops the host's mechanics**: frontmatter keys another tool owns (`globs`, `alwaysApply`, `argument-hint`, `model`), slash-command syntax and `$ARGUMENTS`, GPT conversation starters, and the instructions every model follows unasked (be helpful, think step by step, format as markdown). What prevents a failure stays.
3. **Discovery fills the gaps** the source never said, usually the consumer, the near misses, and the name, since outside skills are named for their host. Registration is asked like any build.
4. **Two paths.** Rebuilt beside the source: a new BMad skill in the right shape, with what did not carry over listed; the source is left as it was. Or in place, when the user says "make this skill work with bmad": the same folder, the description rewritten to the canon, paths and config reads brought to BMad's conventions, and a `bmod.toml` when they want it registered.
5. **Ship as usual**: lenses, validation, an offered trigger eval.

What an outside skill most often gains: a description that triggers reliably, paths that travel between machines, configuration read from the project rather than hardcoded, and registration so `bmad` can recommend and update it. A skill in the agentskills.io format already has the right frontmatter; BMad uses `name` and `description` and treats `allowed-tools` as the host's concern (`help/references.md`).
