# Deferred Work Format

Append-only format for `{implementation_artifacts}/deferred-work.md`.

## Rules

- Do not rewrite or delete old entries.
- Before appending, scan for an equivalent open item.
- If one exists, add `seen-again:` instead of duplicating it.
- Number entries `DW-1`, `DW-2`, and so on.

## Entry

```markdown
### DW-<seq>: <title>

origin: <workflow + artifact + date>
location: <file:line | component | n/a>
severity: <critical | high | medium | low>
reason: <why it is deferred>
status: open
```

When completed, change `status:` to `done <date>` and add:

```markdown
resolution: <one line>
```

Optional:

```markdown
seen-again: <date and source>
decision: <date> <label> -- <detail>
```
