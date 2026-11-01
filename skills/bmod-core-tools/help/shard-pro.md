# Long documents with shard pro

Open this when the user asks whether to shard a document, how a sharded document works, how to change one, or how to hand one to another skill.

## When to suggest it

- A planning skill just wrote a large document (a PRD, an architecture, a long spec), and agents will work from it in later sessions.
- Agents miss things in a long document, read only its first part, or run slowly or expensively because of it.
- The user is about to start a process, such as a PRD, from a large existing document, like an old spec or a vendor manual. Preparing it first means every later read is cheaper.

It works on markdown and plain text. A `.docx`, PDF or HTML file is converted to markdown first, by a tool the user has or by asking the agent. A transcript, chat export or email thread is not a document to shard: suggest `bmad-ingest`, which turns it into a note.

## What it does

It assesses the document and recommends one of three outcomes. Leaving it alone is a good result, not a failure.

| Outcome | Fits when |
|---|---|
| Leave it | It is short enough to read whole, or already well signposted. |
| Contents list | Readers search or follow line ranges, or tools and skills expect one file. The file stays one file and gains a detailed contents list near the top. |
| Split | Readers load whole files, or the document is maintained piece by piece. It is cut word for word into shards with a map. |

Nothing is rewritten. A script does the cutting and checks that the shards join back into the original exactly.

## A sharded document

- The folder always has one main file, named after the folder, such as `prd-billing/prd-billing.md`. It opens with a short note saying the document is sharded, then a map linking to every shard with a one-line summary. A very long map moves into a few map pages linked from the main file.
- The shards are now the document. They are what gets read and kept up to date.
- `.source/` holds the original as it was before the split. It is frozen and out of date: never load it and never edit it. Keep it, because the checks compare against it.
- When a skill asks for inputs, such as a PRD, an architecture or Sofia's tickets, give it the main file. The agent reads the map and opens only the shards it needs. Do not hand over every shard or `.source/`.

## Changing it

Changes go through `bmad-shard-pro` again: it adds content to the right shard, splits one that grows too big, rewrites the map and reruns the checks. Edits made by hand to a shard are kept, but the map does not learn about new sections until the skill runs. A contents list is refreshed the same way.

After a split, links in the source that pointed at nearby files or at headings now in another shard may no longer resolve. Shard pro reports them and leaves them for the user, since it keeps the source's words exactly.
