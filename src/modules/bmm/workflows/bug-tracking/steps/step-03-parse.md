# Step 3: Parse and Identify New Bugs

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative triage between peers
- 📋 YOU ARE A FACILITATOR, not an automatic processor
- 🔍 This step PARSES input only - triage happens in next step
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Parse manual input section thoroughly
- 💾 Compare against existing bugs.yaml entries
- 📖 Extract all available information from informal reports
- 🚫 FORBIDDEN to start triage in this step - parsing only

## CONTEXT BOUNDARIES:

- Variables from workflow.md are available in memory
- bugs.yaml contains existing triaged bugs
- Only parse "# manual input" section of bugs.md
- Do NOT read entire bugs.md file

## YOUR TASK:

Parse the "# manual input" section of bugs.md, extract bug information, and identify which items need triage.

## PARSE SEQUENCE:

### 1. Read Manual Input Section

Section-based reading of bugs.md:
- Grep for "# manual input" to find starting line number
- Grep for next section header ("# Tracked Bugs", "# Tracked Feature Requests", "# Fixed Bugs") to find ending line
- Read just that range using offset/limit (do NOT read entire file)
- If no closing section found within initial window, expand read range and retry

### 2. Search Existing IDs in bugs.yaml

Do NOT read entire bugs.yaml file:
- Grep for `id: bug-[0-9]+` pattern to find all existing bug IDs
- Grep for `id: feature-[0-9]+` pattern to find all existing feature IDs
- This enables duplicate detection and next-ID generation

### 3. Parse Bug Reports

Expected formats in manual input (informal, user-written):

**Format A: Markdown Headers**
```markdown
## Bug: Title Here

Description text, possibly multi-paragraph.

Reported by: Name
Date: YYYY-MM-DD
Related: Story 2.7
Platform: iOS
```

**Format B: Bullet Lists**
```markdown
- **Title (Platform)**: Description text. CRITICAL if urgent.
```

**Format C: Numbered Lists**
```markdown
1. Title - Description text
2. Another bug - More description
```

### 4. Extract Information

For each bug report, extract:

| Field | Required | Notes |
|-------|----------|-------|
| Title | Yes | First line or header |
| Description | Yes | May be multi-paragraph |
| Reported by | No | Extract if mentioned |
| Date | No | Extract if mentioned |
| Related story | No | e.g., "2-7", "Story 2.7" |
| Platform | No | iOS, Android, web, all |
| Reproduction steps | No | If provided |
| Severity hints | No | "CRITICAL", "urgent", etc. |

### 5. Categorize Items

Compare extracted bugs with existing bugs.yaml:

- **New bugs**: Not in bugs.yaml yet (need full triage)
- **Updated bugs**: In bugs.yaml but description changed (need re-triage)
- **Feature requests**: Items that are enhancements, not bugs
- **Unchanged**: Already triaged, skip

### 6. Handle No New Bugs

If NO new bugs found:

"No new bugs found in the manual input section.

All items have already been triaged and are tracked in bugs.yaml.

**Options:**
1. Add new bugs to docs/bugs.md (informal format)
2. View bugs.yaml to see structured bug tracking
3. Route existing triaged bugs to workflows

[Q] Quit - nothing to triage"

**HALT** - Do not proceed.

### 7. Present Parsed Items

"**Parsed {total_count} item(s) from manual input:**

**New Bugs ({new_count}):**
{for each new bug:}
- {extracted_title}
  - Description: {first 100 chars}...
  - Platform: {platform or "not specified"}
  - Related: {story or "not specified"}
{end for}

**Feature Requests ({feature_count}):**
{for each feature:}
- {title}
{end for}

**Already Triaged ({unchanged_count}):**
{list titles of skipped items}

Ready to triage {new_count} new bug(s) and {feature_count} feature request(s).

[C] Continue to triage
[E] Edit - re-parse with corrections
[Q] Quit"

## SUCCESS METRICS:

✅ Manual input section read efficiently (not entire file)
✅ All formats parsed correctly (headers, bullets, numbered)
✅ Existing bugs detected to prevent duplicates
✅ New vs updated vs unchanged correctly categorized
✅ User shown summary and can proceed

## FAILURE MODES:

❌ Reading entire bugs.md instead of section
❌ Missing bugs due to format not recognized
❌ Not detecting duplicates against bugs.yaml
❌ Starting triage in this step (should only parse)

❌ **CRITICAL**: Reading only partial step file
❌ **CRITICAL**: Proceeding without user selection

## NEXT STEP:

After user selects [C], load `./step-04-triage.md` to perform triage analysis on each new bug.

Remember: Do NOT proceed until user explicitly selects [C] from the menu!
