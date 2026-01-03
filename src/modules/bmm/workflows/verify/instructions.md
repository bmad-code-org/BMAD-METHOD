# Verify Workflow (Close Implemented Bugs/Features)

```xml
<critical>This workflow verifies implemented items and closes them in both bugs.yaml and bugs.md</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>Removes [IMPLEMENTED] tag and updates status to CLOSED (bugs) or COMPLETE (features)</critical>

<workflow>

  <step n="1" goal="Get item ID or list pending items">
    <check if="item_id provided in user input">
      <action>Extract item ID from user input</action>
      <action>Detect type from ID format:</action>
      <action>- "bug-NNN" -> type = "bug", final_status = "CLOSED"</action>
      <action>- "feature-NNN" -> type = "feature", final_status = "COMPLETE"</action>
      <action>Proceed to Step 2</action>
    </check>
    <check if="no item_id provided OR user says 'list'">
      <action>Search {bugs_yaml} for 'status: "fixed"' or 'status: "implemented"' using grep (do NOT read entire file)</action>
      <action>Search {bugs_md} for '[IMPLEMENTED]' entries using grep</action>
      <action>Find all items with:</action>
      <action>- status == "fixed" or "implemented" in bugs.yaml</action>
      <action>- [IMPLEMENTED] tag in bugs.md</action>
      <output>**Pending Verification:**

{for each pending item:}
- **{item_id}**: {title} [{type}, {fixed_date or implemented_date}]
{end for}

**Total:** {count} item(s) awaiting verification

To verify an item: `/verify bug-026`
To verify all: Type "verify all"
      </output>
      <ask>Which item would you like to verify?</ask>
    </check>
    <check if="user says 'verify all' or 'all'">
      <action>Set batch_mode = true</action>
      <action>Collect all pending items</action>
      <action>Proceed to Step 2 with batch processing</action>
    </check>
  </step>

  <step n="2" goal="Load item context and check sync">
    <action>Search for {item_id} in {bugs_yaml} using grep with 50+ lines of context after the match (do NOT read entire file - it exceeds token limits)</action>
    <check if="type == bug">
      <action>Entry will be in bugs section, verify status == "fixed"</action>
    </check>
    <check if="type == feature">
      <action>Entry will be in feature_requests section, verify status == "implemented"</action>
    </check>
    <check if="item not found OR status not fixed/implemented">
      <output>{item_id} is not in an implemented state. Current status: {status}

Only items with status "fixed" (bugs) or "implemented" (features) can be verified.</output>
      <action>HALT</action>
    </check>
    <action>Extract metadata: title, description, fixed_date/implemented_date, notes</action>

    <action>**Sync Check:** Also read {bugs_md} to verify sync status</action>
    <check if="bugs.yaml says fixed/implemented but bugs.md missing [IMPLEMENTED] tag">
      <output>SYNC WARNING: {item_id} status mismatch detected
- bugs.yaml: {yaml_status}
- bugs.md: Missing [IMPLEMENTED] tag (may have been implemented outside workflow)

Proceeding will update both files to CLOSED/COMPLETE.</output>
      <ask>Continue with verification? (yes/no)</ask>
      <check if="user says no">
        <output>Cancelled. Please run /implement {item_id} first to sync files.</output>
        <action>HALT</action>
      </check>
    </check>
  </step>

  <step n="3" goal="Confirm verification">
    <output>**Verify {item_id}: {title}**

**Type:** {type}
**{past_verb}:** {fixed_date or implemented_date}

**Implementation Notes:**
{notes - show the FIXED/IMPLEMENTED section}

**Files Changed:**
{extract file list from notes}
    </output>
    <ask>Has this been tested and verified working? (yes/no/skip)</ask>
    <check if="user says no">
      <ask>What issue did you find? (I'll add it to the notes)</ask>
      <action>Append verification failure note to bugs.yaml notes field</action>
      <output>Noted. {item_id} remains in implemented state for rework.</output>
      <action>HALT or continue to next item in batch</action>
    </check>
    <check if="user says skip">
      <output>Skipped. {item_id} remains in implemented state.</output>
      <action>Continue to next item in batch or HALT</action>
    </check>
  </step>

  <step n="4" goal="Update bugs.yaml">
    <action>Update entry in bugs.yaml:</action>
    <action>- status: "closed"</action>
    <action>- verified_by: {user_name}</action>
    <action>- verified_date: {date} (YYYY-MM-DD format)</action>
    <action>- Append to notes: "Verified ({date}) by {user_name}"</action>
    <action>Write updated bugs.yaml</action>
  </step>

  <step n="5" goal="Update bugs.md">
    <action>Search for {item_id} in {bugs_md} using grep with surrounding context to locate the entry</action>

    <action>**5a. Find the entry**</action>
    <check if="type == bug">
      <action>Search for "[IMPLEMENTED] {item_id}:" in "# Fixed Bugs" section</action>
      <check if="not found">
        <action>Search for "{item_id}:" in "# Tracked Bugs" section (implemented outside workflow)</action>
      </check>
    </check>
    <check if="type == feature">
      <action>Search for "[IMPLEMENTED] {item_id}:" in "# Implemented Features" section</action>
      <check if="not found">
        <action>Search for "{item_id}:" in "# Tracked Feature Requests" section (implemented outside workflow)</action>
      </check>
    </check>

    <action>**5b. Move entry if in wrong section**</action>
    <check if="entry found in Tracked section (implemented outside workflow)">
      <action>DELETE the entry from "# Tracked Bugs" or "# Tracked Feature Requests"</action>
      <action>ADD entry to correct section:</action>
      <check if="type == bug">
        <action>Add to "# Fixed Bugs" section</action>
      </check>
      <check if="type == feature">
        <action>Add to "# Implemented Features" section (at top, before other entries)</action>
      </check>
    </check>

    <action>**5c. Update the entry format**</action>
    <action>Remove "[IMPLEMENTED] " prefix if present</action>
    <action>Update the status tag in brackets:</action>
    <check if="type == bug">
      <action>Change from "[Severity: X, Fixed: DATE, Verified: pending]" or "[Severity: X, Complexity: Y, Workflow: Z]"</action>
      <action>To "[Severity: X, Platform: Y, Fixed: {date}, Verified: {date}, CLOSED]"</action>
    </check>
    <check if="type == feature">
      <action>Change from "[Implemented: DATE, Verified: pending]" or "[Priority: X, Complexity: Y, Workflow: Z]"</action>
      <action>To "[Implemented: {date}, Platform: Y, Verified: {date}, COMPLETE]"</action>
    </check>
    <action>Add implementation notes if available from bugs.yaml</action>

    <action>Write updated bugs.md</action>
  </step>

  <step n="5.5" goal="Post-update validation">
    <action>Search for {item_id} in both bugs.yaml and bugs.md using grep to validate updates</action>
    <action>Confirm bugs.yaml: status="closed", verified_by set, verified_date set</action>
    <action>Confirm bugs.md: No [IMPLEMENTED] tag, has CLOSED/COMPLETE in status tag</action>
    <check if="validation fails">
      <output>SYNC ERROR: Verification may be incomplete. Please check both files:
- bugs.yaml: Expected status "closed", verified_by/verified_date set
- bugs.md: Expected CLOSED/COMPLETE tag, no [IMPLEMENTED] prefix</output>
    </check>
  </step>

  <step n="6" goal="Present completion summary">
    <check if="batch_mode">
      <output>**Verification Complete**

**Verified {verified_count} item(s):**
{for each verified item:}
- {item_id}: {title} -> {final_status}
{end for}

**Skipped:** {skipped_count}
**Failed verification:** {failed_count}

**Updated Files:**
- bugs.yaml: status -> "closed", verified_by/verified_date set
- bugs.md: [IMPLEMENTED] tag removed, status -> {final_status}
      </output>
    </check>
    <check if="not batch_mode">
      <output>**{item_id} VERIFIED and {final_status}**

**Updated:**
- bugs.yaml: status -> "closed", verified_by -> {user_name}, verified_date -> {date}
- bugs.md: Removed [IMPLEMENTED] tag, added "Verified: {date}, {final_status}"

This item is now fully closed.
      </output>
    </check>
  </step>

</workflow>
```

## Usage

```
/verify                  # List all pending verification
/verify bug-026          # Verify specific bug
/verify feature-021      # Verify specific feature
/verify all              # Verify all pending items
```

## Status Transitions

| Type | Before | After |
|------|--------|-------|
| Bug | status: "fixed", [IMPLEMENTED] | status: "closed", CLOSED |
| Feature | status: "implemented", [IMPLEMENTED] | status: "closed", COMPLETE |

## Key Principles

1. **Verification Gate** - User must confirm item was tested and works
2. **Failure Handling** - If verification fails, add note and keep in implemented state
3. **Batch Support** - Can verify multiple items at once
4. **Dual Tracking** - ALWAYS update both bugs.yaml AND bugs.md
5. **Proper Closure** - Removes [IMPLEMENTED] tag, adds final CLOSED/COMPLETE status
