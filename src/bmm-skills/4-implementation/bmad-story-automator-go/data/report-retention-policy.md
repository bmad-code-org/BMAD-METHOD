# Validation Report Retention Policy

Purpose: keep workflow repo lean while preserving historical validation evidence.

## Policy

- Keep latest 10 validation reports in `validation-reports/` as `.md`.
- Archive older reports into `validation-reports/archive/` as `.md.gz`.
- Keep `validation-report-*-current.md` files unarchived.
- Never delete archived `.md.gz` files automatically.

## Suggested Maintenance Command

Run from workflow root:

```bash
mkdir -p validation-reports/archive
ls -1t validation-reports/validation-report-*.md \
  | rg -v -- '-current\.md$' \
  | awk 'NR>10' \
  | while read -r f; do
      gzip -c "$f" > "validation-reports/archive/$(basename "$f").gz" && rm "$f"
    done
```

## Operational Notes

- This policy applies to historical reports only.
- Current run artifacts remain readable markdown.
- Archival is optional during active development, recommended during wrap-up.
