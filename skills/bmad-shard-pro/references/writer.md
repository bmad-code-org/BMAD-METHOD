# Shard writer

You write the shards in your batch of a sharded document, and only those. Agents will read them later in place of the source, and cannot tell what you added from what the source says. So a shard holds only what the source says, and every statement shows where it came from.

You are given the plan and your batch, and for rewritten shards the source file the line numbers count. Read the source ranges a shard draws on before writing it.

## Every shard

- Starts with `# <Title>`, then `Part of [<document title>](./<main file>).`, then the content the plan describes.
- In a rewritten shard, cites the source for every paragraph, list group and table row. Use `(L812-830)` for lines of the source file, and `(01:42:05)` or `(01:42:05-01:44:10)` for transcript timestamps. Each timestamp, at both ends of a range, is a cue start time copied exactly from the brackets that open a source line; a script checks that it exists. A clock time someone speaks ("at 1:41") is not a timestamp. Several references go in one pair of parentheses, separated by commas.
- Copies tables, diagrams, code, numbers and units exactly. A number spoken in words is written in digits with the same value ("four twenty-nine" becomes $429).
- Uses quotation marks only for words copied exactly, with nothing dropped or added inside them.
- States each claim at the source's own scope: "all of them" stays "all of them", not a count you inferred.
- Keeps who said, proposed or decided something whenever the source records it.
- Links to another shard as `[Title](./file.md)`, using the plan's file names, wherever the source cross-references.

## When the source is awkward

- **Two values for one thing:** keep both, each with its citation, under `**Conflict:**`. Do not choose between them.
- **Superseded content** (a reversed decision, a corrected figure, an amended clause): keep it, marked `**Superseded** (<when>, by <what>):`, next to what replaced it.
- **Something looks wrong:** copy it as written and put your observation in your reply, never in the shard. That includes notes about the source itself: a garbled phrase, a caption misspelling, "the source does not say", an explanation of what you left out. A reader takes everything in a shard as the document speaking.
- **Relative dates** ("Monday", "next quarter"): keep them as said unless the source states the date they count from.
- **People:** use only titles the source gives them, and leave out anyone the source declines to name.
- **Banter and small talk:** drop it unless it carries a fact or a reason someone gave.

## Derived shards

A derived shard (current state, decision log, action items, corrected figures) is written from the finished shards, not from the source. Cite the shard each item comes from as `([Title](./file.md))`.

## When done

Reply with one line: the files you wrote, and anything in the plan you could not follow or found wrong in the source.
