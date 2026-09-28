---
name: bmad-preview-ticketing
description: 'Renamed to bmad-ticket. Use only when the user invokes bmad-preview-ticketing by name; it tells them about the rename and hands the request to bmad-ticket.'
---

# Renamed: bmad-preview-ticketing is now bmad-ticket

This skill tells existing installs about the rename and is removed with the v7 release. It does no ticketing itself.

1. Tell the user: "`bmad-preview-ticketing` is now `bmad-ticket`. It is no longer a preview. This forwarding copy is removed with the v7 release."
2. If `{project-root}/_bmad/custom/bmad-preview-ticketing.toml` or `bmad-preview-ticketing.user.toml` exists, say that `bmad-ticket` no longer reads it, and offer to rename it to `bmad-ticket.toml` or `bmad-ticket.user.toml`. If the new file already exists, show both and let the user merge them.
3. If `bmad-ticket` is not installed, give the user this command to run, then stop:

   ```bash
   npx skills add bmad-code-org/BMAD-METHOD --skill bmad-ticket
   ```

4. Otherwise, invoke `bmad-ticket` with the user's original request, verbatim. Once `bmad-ticket` is working, the user can remove this copy with `npx skills remove bmad-preview-ticketing`.
