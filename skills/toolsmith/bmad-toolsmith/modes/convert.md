# Convert

A skill or prompt from another tool becomes the smallest BMad skill that holds the same know-how, in the shape it needs.

A skill folder the user wants brought to BMad where it sits follows In place. Anything else follows Rebuild.

## Read and extract

Read the source whole. Extract its outcome, who consumes it, when the author meant it to fire, the know-how a model would not have, any scripts, and what it depends on from its host.

## Drop

The canon's core test decides; keep only what prevents a failure. That drops:

- The host tool's mechanics, slash-command syntax and `$ARGUMENTS` included.
- Instructions the model already follows unasked.

## Frontmatter

BMad uses `name` and `description` only, not the agentskills.io spec's optional `license`, `compatibility`, `metadata` or `allowed-tools`: `description` is the whole trigger and `allowed-tools` is a host concern.

## In place

Set `{target}` to the source folder and work there.

The execution plan lists what will change, and nothing is touched before approval:

- The name, kept unless the user wants their prefix on it.
- The description, rewritten to the canon.
- The shape, when it changes, chosen from the shape list in `discover.md`, with one line on why; load its shape file on approval.
- Paths and config reads, brought to `lenses/standards.md`.
- `bmod.toml` with both tables when the user wants a single-skill module, from `shapes/single-skill-module/shape.md`.
- What is dropped, by file.
- The passages the user wants kept word for word. On approval write them, blank-line separated, to `{reports_folder}/<YYYYMMDD-HHMMSS>-<skill>-protected.txt` for `cut_check.py --protect-text` at ship.

On approval, copy the source to `{reports_folder}/<YYYYMMDD-HHMMSS>-<skill>-before/` before changing it; ship compares against that copy. Skip discovery; the skill as it stands answers its questions. Then load `ship.md`.

## Rebuild

For a skill rebuilt beside the source, load `discover.md` with the extraction as its input. Discovery asks only what the source never said, usually the consumer, the near misses and the name, since a source is usually named for its host.

From the execution plan on, the approach is lean.

Leave the source untouched; the user may still run it where it lives.
