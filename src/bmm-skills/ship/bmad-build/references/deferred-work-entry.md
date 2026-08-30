# Deferred Work Entry

How to record one deferred item in the project's deferred-work ledger. The write site names the ledger path and the origin; this file says what to write, and when to write nothing.

## Before Writing

Read the whole ledger. For each item to record, look for a match: an entry naming the same location and the same substance, however worded — open or closed, in whatever shape the file holds. Then:

- An open match whose `source_spec:` is this spec — write nothing; the spec's own triage row already records it.
- An open match from any other source — no new entry. Add one line directly after that entry's `status:` line (at the end of the entry when it has no `status:` line): `seen-again: <date> (<origin>)`.
- A closed match — a new entry whose `reason:` names the closed id: `recurs after DW-<n>`.
- No match — a new entry.

Never rewrite, renumber, reorder, or drop an existing line. `gate:`, `source_spec:`, `resolution:`, and `archived:` lines belong to the ledger's consumer and are load-bearing.

## Entry

Mint `<n>` as the highest `DW-<n>` already in the file plus one, scanned immediately before the write. Append every entry from this pass in one write, numbered consecutively, then re-read the file and confirm each new id appears exactly once.

```markdown
### DW-<n>: <title>
origin: <skill and step> of <spec basename>, <date>
location: <file:line or component>
source_spec: `<spec basename>`
severity: <high | medium | low>
reason: <what is wrong, then why it is deferred>
status: open
```

- `title` — one clause, at most 100 characters, whole words, no trailing period; never starts with `DW-`.
- `origin` — the string the write site supplies, then the current date as `YYYY-MM-DD`.
- `location` — never omitted; `n/a` only when there is nothing to open.
- `source_spec` — the spec's basename in backticks; omit the line only when there is no spec.
- `severity` — the entry's triage verdict; `n/a` for a deferred goal, which has none.
- `reason` — at most two sentences on one line: what is wrong, then why it is deferred. The spec's triage row holds the evidence; do not repeat it here.
- `status` — always `open`, and nothing follows it.

Every value is one line. No value starts with `#`, and no value contains `- source_spec:`. If the ledger does not exist, create it with a `# Deferred Work` title line and append below it.
