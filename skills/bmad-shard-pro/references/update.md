# Updating a prepared document

The user changes the document through its main file. The outcome is the document changed as they asked, still passing `check`, with every change in the memlog. The shards are the document now, and `.source/` stays frozen, so never edit or read from it.

The script is `uv run {skill-root}/scripts/shard_tool.py <command>`; the memlog script is `uv run {project-root}/_bmad/scripts/memlog.py`. `{doc_folder}` is the folder holding the main file, or the file with the contents list.

Before applying a change, find where the document already speaks to it, using the map, the identifier lookup and search. When the change contradicts what is there, show the user both and let them decide. When it touches several shards, change all of them.

## A sharded folder

- **New content with a home:** add it to the shard where a reader would look first.
- **New content with no home, or a shard grown past about 14 KB:** split it or add a new shard. Name the new shard from its content, never starting with the document type's prefix.
- **Record each new, renamed or re-summarised shard in `.shards.json`:** file, title and a one-line summary, placed in its map group. Then run `map` to rewrite the main file and its sub-maps.
- **Identifiers:** when the document has an identifier lookup, run `lookup` after any change that adds, moves or removes one.

Run `check` without `--rebuild`, since the shards have moved on from the original and no longer join back into it, and fix every failure.

## A file with a contents list

- **New section:** run `toc <file> --add <line> --title <title>`, where `<line>` is the section's first line as the file reads now; add `--group` when it belongs to a different group than the section before it.
- **Otherwise:** run `toc <file>` to refresh the line ranges. When it reports a lost section (its first line was renamed or removed), re-add it with `--add`, or leave it out if the section is gone. When it reports an ambiguous one (its first line now appears in more places), plan the list again with `--plan`.

Then run `check <file>` and fix every failure.

When the document has outgrown a contents list, tell the user and offer a faithful split; remove the list with `toc <file> --remove` before planning one.

## Record

Append each change to `{doc_folder}/.memlog.md` with `memlog.py append --type change`, and each choice the user made with `--type decision`; run `memlog.py init --workspace {doc_folder}` first when none exists. Without `_bmad/`, skip memlog writes and say so once.
