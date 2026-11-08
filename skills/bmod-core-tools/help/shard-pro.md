# Long documents with shard pro

Open this when the user asks whether to shard a document, how a sharded document works, how to change one, or how to hand one to another skill.

## When to suggest it

- A document agents work from is past about 50 KB (roughly 8,000 words).
- The user is about to start a PRD, brief or architecture from a large existing document, such as an old spec or a vendor manual.
- Agents miss things in a long document, read only its first part, or run slowly or expensively because of it.

A document under about 50 KB needs nothing, including one a planning skill just wrote: an agent reads it whole for little.

It works on markdown and plain text. A `.docx`, PDF or HTML file is converted to markdown first, by a tool the user has or by asking the agent. A transcript, chat export or email thread is not a document to shard: suggest `bmad-ingest`, which turns it into a note.

## What it does

It measures the document, asks the user whether it will be kept and edited and whether it has to stay one file, and recommends one of three outcomes.

| Outcome | Fits when |
|---|---|
| Leave it | It is under about 50 KB, or it has to stay one file and already has a good contents list near the top. |
| Split | It is long and will be kept and edited. This is the default for long project documents: small, well-named files let an agent load only the part it needs, keep edits small, and map onto Confluence or wiki pages. It is cut word for word into shards with a map. |
| Contents list | It is long but one file is better. The file stays one file and gains a detailed contents list near the top. |

One file is better when:

| Reason | Example |
|---|---|
| Something outside the agent needs one file | Export to Word or PDF, upload to another AI tool, an email attachment, a tool that takes one path. |
| People read or review it straight through | A contract or proposal read from start to end, or reviewed in one diff. |
| It is usually read whole | A document checked end to end for consistency, where a missed shard goes unnoticed. |
| It is a fixed reference | A vendor manual, a standard or a signed contract that nobody will edit. |
| Its sections depend on each other | Steps that run across sections, or frequent "as described above"; cut word for word, the pieces would not read on their own. |

Nothing is rewritten. A script does the cutting and checks that the shards join back into the original exactly.

## A sharded document

- The folder always has one main file, named after the folder, such as `prd-billing/prd-billing.md`. It opens with a short note saying the document is sharded, then a map linking to every shard with a one-line summary. A very long map moves into a few map pages linked from the main file.
- The shards are now the document. They are what gets read and kept up to date. Each shard's frontmatter names the main file and holds the shard's title, one-line summary, map group and related shards, so an agent that lands on a shard knows where the map is.
- `.source/` holds the original as it was before the split. It is frozen and out of date: never load it and never edit it. Keep it, because the checks compare against it.
- When a skill asks for inputs, such as a PRD, an architecture or Sofia's tickets, give it the main file. The agent reads the map and opens only the shards it needs. Do not hand over every shard or `.source/`.

## Changing it

Any agent can change a sharded document without `bmad-shard-pro`: the note at the top of the main file says how. New content goes in the shard a reader would look in first; when a shard's coverage changes, its summary changes in its frontmatter and in its map line; a new shard is a new file with the same frontmatter and a line in the map. Running `bmad-shard-pro` afterwards is optional: it rebuilds the map from the shards' frontmatter, keeping its order and any shard added by hand, and reruns the checks. A contents list is edited the same way, with a line added to the list for a new section; the skill refreshes the line ranges and keeps lines added by hand.

Nothing checks a document between runs of the skill, so a map can drift from its shards unnoticed. A project that wants it caught can run the skill's script as `shard_tool.py check <folder> --all` in a pre-commit hook or CI: it checks every sharded folder and contents list under the folder and fails when the map or the identifier lookup no longer matches the shards, or a shard's frontmatter does not parse.

After a split, links in the source that pointed at nearby files or at headings now in another shard may no longer resolve. Shard pro reports them and leaves them for the user, since it keeps the source's words exactly.
