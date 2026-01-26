# Step 12: Extract Learnings & Update Playbooks (Agent Self-Reflection)

**Goal:** Agent reflects on what was learned during implementation and updates playbooks for future stories

---

## Process

### 1. Verify Story Quality (Skip if Low Quality)

**Only extract from successful, clean implementations:**

```bash
story_file="{story_file}"

# Check task completion
checked_tasks=$(grep -c "^- \[x\]" "$story_file" || echo "0")
total_tasks=$(grep -c "^- \[[x ]\]" "$story_file" || echo "0")

if [ "$total_tasks" -eq 0 ]; then
  echo "⏭️  No tasks in story - skipping learning extraction"
  exit 0
fi

completion_pct=$((checked_tasks * 100 / total_tasks))

if [ "$completion_pct" -lt 80 ]; then
  echo "⏭️  Story only $completion_pct% complete - skipping extraction"
  echo "    (Only extract learnings from successful implementations)"
  exit 0
fi

echo "✅ Story completion: $completion_pct% - proceeding with extraction"
```

### 2. Gather Implementation Context

**Collect facts about what was built:**

```bash
story_key="{story_key}"

# Get commit for this story
commit_hash=$(git log --oneline --all --grep="$story_key" -i | head -1 | awk '{print $1}')

if [ -z "$commit_hash" ]; then
  echo "⚠️ No commit found for $story_key - skipping"
  exit 0
fi

# Extract implementation details
files_changed=$(git diff-tree --no-commit-id --name-only -r "$commit_hash")
file_count=$(echo "$files_changed" | wc -l | tr -d ' ')
commit_message=$(git show --no-patch --format="%s" "$commit_hash")

# Check for code review
review_file="{sprint_artifacts}/review-${story_key}.md"
has_review=false
critical_issues=0
high_issues=0

if [ -f "$review_file" ]; then
  has_review=true
  critical_issues=$(grep -c "CRITICAL" "$review_file" || echo "0")
  high_issues=$(grep -c "HIGH" "$review_file" || echo "0")
fi

echo "📊 Implementation Context:"
echo "  Commit: $commit_hash"
echo "  Files: $file_count"
echo "  Code Review: $has_review ($critical_issues critical, $high_issues high)"
```

### 3. Agent Self-Reflection

**Present context and ask agent to reflect:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤔 STORY COMPLETION SELF-REFLECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You just completed Story {story_key} ({completion_pct}% complete).

Implementation Summary:
- Files created/modified: {file_count} files
- Commit: {commit_hash}
- Commit message: {commit_message}
- Code review: {critical_issues} critical, {high_issues} high issues (all fixed)

Files Changed:
{files_changed}

---

SELF-REFLECTION QUESTIONS:

1. **What Patterns Emerged?**
   - Did you create any reusable functions/utilities?
   - Are there code patterns worth documenting for future stories?
   - What file structures or naming conventions worked well?

2. **What Mistakes Were Made?**
   - What errors did you encounter during implementation?
   - What did code review catch?
   - What would have prevented these issues?

3. **What Was Learned?**
   - What surprised you about this implementation?
   - What assumptions were wrong?
   - What would you do differently next time?

4. **Technology/Domain Insights?**
   - What technologies were used? (database ORM, payment API, queue, etc.)
   - What business domain? (billing, auth, notification, etc.)
   - What architectural patterns? (state machine, cron, idempotency, etc.)

---

RESPOND WITH STRUCTURED LEARNINGS:

Format your response as:

**PATTERNS TO SAVE:**
```
Pattern: {Name}
Technology: {tech}
Code Example: {10-20 lines from your implementation}
When to Use: {specific scenario}
File: {source file path}
```

**PITFALLS TO DOCUMENT:**
```
Mistake: {What went wrong}
Error: {Exact error message if applicable}
Fix: {How you resolved it}
Prevention: {Code/check to avoid in future}
Technology: {tech where this applies}
```

**BEST PRACTICES:**
```
Practice: {Specific action}
Reason: {Why it works}
Example: {Command or code snippet}
Technology: {tech where this applies}
```

**PLAYBOOKS TO UPDATE:**
- {playbook-name}: {what to add}
- {playbook-name}: {what to update}

Be specific. Include actual code from your implementation, not made-up examples.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Parse Agent Response

**Extract structured learnings from agent's self-reflection:**

```bash
# Agent response will contain sections:
# - PATTERNS TO SAVE
# - PITFALLS TO DOCUMENT
# - BEST PRACTICES
# - PLAYBOOKS TO UPDATE

# Parse each section
patterns=$(extract_section "PATTERNS TO SAVE" from agent response)
pitfalls=$(extract_section "PITFALLS TO DOCUMENT" from agent response)
practices=$(extract_section "BEST PRACTICES" from agent response)
playbooks_to_update=$(extract_section "PLAYBOOKS TO UPDATE" from agent response)
```

### 5. Update or Create Playbooks

**For each playbook the agent identified:**

```bash
playbook_dir="{project-root}/docs/playbooks"
mkdir -p "$playbook_dir"

for playbook_update in $playbooks_to_update; do
  # Parse: "billing-playbook.md: Add idempotency pattern"
  playbook_name=$(echo "$playbook_update" | cut -d: -f1 | tr -d ' ')
  update_description=$(echo "$playbook_update" | cut -d: -f2-)

  playbook_path="${playbook_dir}/${playbook_name}"

  if [ ! -f "$playbook_path" ]; then
    # Create new playbook from template
    create_playbook_from_template "$playbook_name" "$story_key"
  fi

  # Append learnings to appropriate sections
  update_playbook_section "$playbook_path" "Best Practices" "$practices"
  update_playbook_section "$playbook_path" "Common Pitfalls" "$pitfalls"
  update_playbook_section "$playbook_path" "Code Patterns" "$patterns"

  # Update frontmatter
  update_frontmatter "$playbook_path" "$story_key"

  echo "✅ Updated: $playbook_name"
done
```

### 6. Update Playbook Index

**Regenerate index.md:**

```bash
generate_playbook_index() {
  index_file="${playbook_dir}/index.md"

  cat > "$index_file" <<EOF
# Playbook Index

**Last Updated:** $(date +%Y-%m-%d)
**Total Playbooks:** $(ls -1 ${playbook_dir}/*-playbook.md 2>/dev/null | wc -l | tr -d ' ')

## Available Playbooks

EOF

  # For each playbook, extract summary
  for playbook in ${playbook_dir}/*-playbook.md; do
    if [ ! -f "$playbook" ]; then continue; fi

    basename=$(basename "$playbook")

    # Extract from frontmatter
    topics=$(sed -n '/^---$/,/^---$/p' "$playbook" | grep "^keywords:" | cut -d: -f2- | tr -d '[]')
    stories=$(sed -n '/^---$/,/^---$/p' "$playbook" | grep "^source_stories:" | cut -d: -f2- | tr -d '[]')
    pattern_count=$(sed -n '/^---$/,/^---$/p' "$playbook" | grep "^pattern_count:" | cut -d: -f2 | tr -d ' ')
    last_updated=$(sed -n '/^---$/,/^---$/p' "$playbook" | grep "^last_updated:" | cut -d: -f2 | tr -d ' ')

    # Append to index
    cat >> "$index_file" <<ENTRY

### $basename
**Topics:** $topics
**Stories:** $stories
**Patterns:** $pattern_count patterns documented
**Last Updated:** $last_updated
ENTRY
  done

  echo "✅ Index updated: $(ls -1 ${playbook_dir}/*-playbook.md 2>/dev/null | wc -l | tr -d ' ') playbooks"
}
```

### 7. Commit Playbook Updates

**Commit all changes:**

```bash
playbooks_updated=$(git diff --name-only docs/playbooks/ | wc -l | tr -d ' ')

if [ "$playbooks_updated" -gt 0 ]; then
  git add docs/playbooks/*.md

  git commit -m "docs: update playbooks from Story ${story_key} learnings

Updated/created:
$(git diff --cached --name-only docs/playbooks/ | sed 's/^/- /')

Learnings from successful implementation of ${story_key}."

  echo "✅ Committed: $playbooks_updated playbook updates"
else
  echo "ℹ️  No playbook changes to commit"
fi
```

---

## Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ LEARNINGS EXTRACTED FROM STORY {story_key}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Playbooks Updated: {count}
- billing-playbook.md (added idempotency pattern)
- state-machine-playbook.md (added entity update reminder)
- database-migration-playbook.md (added enum pitfall)

Patterns Documented: {count}
- Idempotency key generation
- State transition validation
- Related entity updates

Pitfalls Documented: {count}
- Enum transaction limitation (PostgreSQL)
- Forgotten entity updates on state changes

Index Updated: docs/playbooks/index.md
- Now tracks {total_playbooks} playbooks
- {total_patterns} patterns documented
- Ready for next story to benefit

Future stories about billing, state machines, or migrations will
automatically load these learnings in Step 1b.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Helper Functions

### create_playbook_from_template

```bash
create_playbook_from_template() {
  playbook_name="$1"
  story_key="$2"

  # Extract technology/domain from filename
  # Example: billing-playbook.md → technology: billing
  tech_or_domain=$(echo "$playbook_name" | sed 's/-playbook\.md$//')

  cat > "${playbook_dir}/${playbook_name}" <<EOF
---
technology: ${tech_or_domain}
keywords: [${tech_or_domain}]
source_stories: [${story_key}]
last_updated: $(date +%Y-%m-%d)
pattern_count: 0
pitfall_count: 0
practice_count: 0
---

# ${tech_or_domain^} Playbook

**Created from:** Story ${story_key}

## Best Practices

## Common Pitfalls

## Code Patterns

## Lessons Learned
EOF

  echo "📝 Created new playbook: $playbook_name"
}
```

### update_playbook_section

```bash
update_playbook_section() {
  playbook_file="$1"
  section_name="$2"  # "Best Practices", "Common Pitfalls", "Code Patterns"
  new_content="$3"

  if [ -z "$new_content" ]; then
    return 0  # Nothing to add
  fi

  # Find section in file
  # Append new content
  # Use Edit tool for surgical update

  echo "✏️  Updated section: $section_name in $(basename "$playbook_file")"
}
```

### update_frontmatter

```bash
update_frontmatter() {
  playbook_file="$1"
  story_key="$2"

  # Update source_stories list (append if not already present)
  # Increment pattern_count / pitfall_count / practice_count
  # Update last_updated to today

  # Use Edit tool to update frontmatter

  echo "✏️  Updated frontmatter in $(basename "$playbook_file")"
}
```

---

## Success Criteria

**Step 12 succeeds when:**
- [x] Agent provided self-reflection
- [x] Learnings extracted and categorized
- [x] Playbooks updated or created
- [x] Index regenerated
- [x] Changes committed to git

**Step 12 can be skipped when:**
- Story completion < 80%
- No commit found
- Agent reflection yields no learnings

---

**Next:** Workflow complete. Story finished with learnings extracted for future benefit.
