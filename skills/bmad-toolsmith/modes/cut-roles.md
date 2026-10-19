# Cut roles

The subagent prompts `modes/cut.md` and `ship.md` use, one role per heading. Fill each angle-bracket placeholder, an empty one as "none", and write `{target}` and `{skill-root}` as absolute paths. `<old file>` is the file's path in the copy taken before the rewrite.

## Cutter

```text
Rewrite <file>, one file of the skill at {target}, into the leanest prose that steers the model as far as the old text did. The bar is `{skill-root}/canon.md` and `{skill-root}/lenses/lens-leanness.md`; read both. Work at every scale: a sentence the model does not need, the words inside a sentence that carry nothing, a passage that a few load-bearing words can replace. There is no token target; leave a lean file as it is.

Keep, in the fewest words that fix it:
- Every convention the model cannot know: file and folder names, id formats, frontmatter keys, which step writes which section, what the scripts read, state and status words.
- Every rule and every disambiguation.
- Every Jinja expression and tag, character for character; every {skill-root} and {project-root}; every command line.
- Every heading, and every name another file of the skill refers to.
- Every cross-file reference.
- These passages, word for word: <protected>. These decisions; nothing you write may contradict them: <decisions>.

Plain declarative sentences; a Markdown paragraph is one line; a TOML comment keeps its comment form; no new terms; add nothing that is not a compression of what was there; keep the section order. Edit <file> in place, touch no other file, commit nothing.

Return JSON: { "file": path, "rewrites": [one line per passage removed or recast, beyond trimming a why-clause], "doubts": [anything you were not sure was explanation rather than rule, with your choice] }
```

## Checker

```text
<file> in the skill at {target} was just rewritten to be leaner. Read the old file at <old file>; the new file is on disk. The rewrite had to keep every rule, convention, disambiguation, Jinja construct, heading and cross-file reference, these passages word for word: <protected>, and these decisions: <decisions>. Assume it failed somewhere and find where.

Walk the old file sentence by sentence. List a sentence under "lost" only when the new file no longer states it in any wording and you can name the different action a model would take without it; write that action in "action". A why-clause, a definition of general knowledge, a restatement or an illustration is not a loss. A protected passage not kept word for word is a loss whatever the action. When "lost" has more than five entries, check each again against the action test and drop those that fail.

Separately list where the new wording changes what a rule says or contradicts a decision ("changed_meaning"), and up to five passages that fewer words would still say as well, each with its shorter wording ("remaining_fat"). Edit nothing.

Return JSON: { "file": path, "lost": [{ "old_text", "action" }], "changed_meaning": [{ "old_text", "new_text", "why" }], "remaining_fat": [{ "text", "shorter" }] }
```
