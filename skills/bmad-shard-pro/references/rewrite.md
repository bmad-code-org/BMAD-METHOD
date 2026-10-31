# Rewrite and derived shards

Shards a model writes, rather than a script cutting, are where a sharded document can go wrong: a dropped fact, a changed figure, a remark that reads as the author's. Writers work from the source with citations, and a check confirms both.

The script is `uv run {skill-root}/scripts/shard_tool.py`.

## Planning a rewrite

- **No headings:** the proposed cut is size-based chunks with their first lines. Have subagents on a faster, cheaper model each read a few chunks and list the subjects they cover, with line ranges. Plan the subjects from their lists rather than reading everything yourself.
- **Plan by subject, not by time.** A subject that comes up more than once gets one shard covering every round, with the current state first and the history after it.

## Writing

`build` writes the main file and leaves the rewritten and derived shards to write.

1. Write the rewritten shards through subagents, one batch each, on a faster, cheaper model when the host offers one. Give each writer `references/writer.md`, the plan, its batch, and the source path in `.source/`.
2. When the writers finish, read each shard against its map summary, correct the summaries in `.shards.json`, and run `map`.
3. Write the derived shards last, from the finished shards: one more writer subagent with `references/writer.md`, the plan and the derived entries.

## Checking

Run `check` and fix every failure.

Then run one subagent with `references/checker.md`, the folder, `.shards.json` and the source. Have it reply with its findings, and fix what it finds.
