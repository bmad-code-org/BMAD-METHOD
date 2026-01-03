# Step 2: Sync Bug Reports from API

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative triage between peers
- 📋 YOU ARE A FACILITATOR, not an automatic processor
- 🌐 This step handles OPTIONAL API integration for in-app bug reporting
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Attempt API sync only if configured
- 💾 Preserve existing manual input entries
- 📖 Format synced reports as markdown entries
- 🚫 FORBIDDEN to lose manually entered bugs

## CONTEXT BOUNDARIES:

- Variables from workflow.md are available in memory
- `project_url` may or may not be configured
- API endpoints are optional - gracefully handle if unavailable
- This step can be skipped if no API integration

## YOUR TASK:

Sync pending bug reports from the application's PostgreSQL database via API, formatting them as markdown entries in bugs.md.

## SYNC SEQUENCE:

### 1. Check API Configuration

Verify `{project_url}` is configured:
- If not configured or user skipped this step, proceed to step-03
- If configured, attempt API connection

### 2. Fetch Pending Reports

**API Call:**
```
GET {project_url}/api/bug-reports/pending
```

**Expected Response:**
```json
{
  "data": {
    "reports": [...],
    "count": number
  }
}
```

**Report Fields:**
- `id` - Database ID
- `title` - Bug title
- `description` - Bug description
- `reporterType` - Type of reporter (user, staff, admin)
- `reporterName` - Name of reporter
- `platform` - Platform (iOS, Android, web)
- `browser` - Browser if web
- `pageUrl` - URL where bug occurred
- `screenshotUrl` - Optional screenshot
- `createdAt` - Timestamp

### 3. Handle No Reports

If count == 0:

"No new bug reports from the application API.

[C] Continue to triage existing manual input
[Q] Quit - nothing to process"

### 4. Format Reports as Markdown

For each report, create markdown entry:

```markdown
## Bug: {title}

{description}

Reported by: {reporterName} ({reporterType})
Date: {createdAt formatted as YYYY-MM-DD}
Platform: {platform} / {browser}
Page: {pageUrl}
{if screenshotUrl: Screenshot: {screenshotUrl}}
```

### 5. Insert into bugs.md

- Read the "# manual input" section location from bugs.md
- Insert new markdown entries after the "# manual input" header
- Preserve any existing manual input entries
- Write updated bugs.md

### 6. Mark Reports as Synced

**API Call:**
```
POST {project_url}/api/bug-reports/mark-synced
Body: { "ids": [array of synced report IDs] }
```

This updates status to 'synced' so reports won't be fetched again.

### 7. Report Sync Results

"**Synced {count} bug report(s) from application:**

{for each report:}
- {title} (from {reporterName})
{end for}

These have been added to the manual input section of bugs.md.

[C] Continue to parse and triage all bugs
[Q] Quit"

## SUCCESS METRICS:

✅ API availability checked gracefully
✅ Pending reports fetched and formatted
✅ Existing manual entries preserved
✅ Reports marked as synced in database
✅ User informed of sync results

## FAILURE MODES:

❌ Crashing if API unavailable (should gracefully skip)
❌ Overwriting existing manual input entries
❌ Not marking reports as synced (causes duplicates)
❌ Proceeding without user confirmation

❌ **CRITICAL**: Reading only partial step file
❌ **CRITICAL**: Proceeding without explicit user selection

## NEXT STEP:

After user selects [C], load `./step-03-parse.md` to parse and identify all bugs needing triage.

Remember: Do NOT proceed until user explicitly selects [C] from the menu!
