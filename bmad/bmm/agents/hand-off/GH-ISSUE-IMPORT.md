# GitHub Issue Import Instructions

This file explains how to import `SPRINT-TICKETS-ISSUES.json` into GitHub as issues. Use one of the following approaches depending on your permissions.

Option A — Use GitHub Issues Importer (web):
1. Go to https://github.com/<org>/<repo>/issues/import (you must have admin permissions).  
2. Upload `SPRINT-TICKETS-ISSUES.json`.  
3. Map fields as needed and start import.

Option B — Use GitHub CLI (scripted):
1. Install GitHub CLI and authenticate: `gh auth login`  
2. Run a small script to create issues. Example (bash):

```bash
cat SPRINT-TICKETS-ISSUES.json | jq -c '.[]' | while read item; do
  title=$(echo "$item" | jq -r '.title')
  body=$(echo "$item" | jq -r '.body')
  labels=$(echo "$item" | jq -r '.labels | join(",")')
  gh issue create --title "$title" --body "$body" --labels "$labels"
done
```

Option C — Use API (programmatic):
- Use the REST API `POST /repos/{owner}/{repo}/issues` for each item in the JSON. Requires a token with `repo` scope.

Notes
- After import, assign owners and milestones per sprint.  
- If you want, I can run the import for you (requires an authenticated session/permissions). Ask "create GH issues" to proceed and I’ll outline next steps for authentication.
