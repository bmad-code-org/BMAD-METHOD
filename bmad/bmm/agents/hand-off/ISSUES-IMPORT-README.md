Sprint Issues Importer
======================

This folder contains a JSON file `sprint-issues.json` with the planned sprint tasks and a small script `create_issues.sh` to create GitHub issues using the `gh` CLI.

Pre-reqs
- Install `gh` (GitHub CLI) and authenticate: https://cli.github.com/
- Ensure `jq` is installed for JSON parsing.
- You must have push/create-issue permissions on the repository.

Usage

```bash
cd bmad/bmm/agents/hand-off
chmod +x create_issues.sh
./create_issues.sh
```

Notes
- The script is idempotent and checks for existing issue titles before creating new ones (it searches the last 100 issues).
- Labels are created on issue creation if they do not exist.
- After import, manually assign issues to epics or milestones using GitHub Projects or the Issues UI.

Mapping to epics
- The JSON includes an `epic` field in each item; the script doesn't automatically link to epic issues. You can manually link the created issues to the epic issues (for example, comment the child issue URL in the epic or use GitHub Projects).
