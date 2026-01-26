# Step 12: Extract Learnings & Update Playbooks (Automated Feedback Loop)

**Goal:** Extract patterns from completed implementation and save to playbooks for future stories

---

## What This Step Does

After successful implementation, analyze what was built and extract:
- Patterns that worked well
- Mistakes that were made and fixed
- Code examples worth reusing
- Best practices discovered

Save these to playbooks so future stories benefit from this learning.

---

## Execution

### 1. Analyze Implementation

**Review what was built:**

```bash
story_key="{story_key}"

# Get commit for this story
commit_hash=$(git log --oneline --grep="$story_key" -i | head -1 | cut -d' ' -f1)

if [ -z "$commit_hash" ]; then
  echo "⚠️ No commit found for $story_key - skipping learning extraction"
  exit 0
fi

# Get files changed
files_changed=$(git diff-tree --no-commit-id --name-only -r "$commit_hash")

echo "📊 Analyzing implementation:"
echo "  Story: $story_key"
echo "  Commit: $commit_hash"
echo "  Files: $(echo "$files_changed" | wc -l | tr -d ' ')"
```

### 2. Extract Applicable Keywords

**From story file and code:**

```bash
# Extract from story title, tasks, and file paths
keywords=$(cat "{story_file}" | \
  grep -oiE "(prisma|stripe|auth|cron|queue|state.machine|billing|payment|migration|api|database|email|notification|terraform|sqs)" | \
  sort -u)

# Also extract from file paths
tech_keywords=$(echo "$files_changed" | \
  grep -oiE "(billing|payment|auth|email|queue|cron|migration)" | \
  sort -u)

all_keywords=$(echo -e "$keywords\n$tech_keywords" | sort -u | tr '\n' ',' | sed 's/,$//')

echo "🔑 Keywords for playbook matching: $all_keywords"
```

### 3. Check Code Review Findings

**If code review was executed, extract learnings:**

```bash
review_file="docs/sprint-artifacts/review-${story_key}.md"

if [ -f "$review_file" ]; then
  echo "📝 Code review exists - extracting learnings"

  # Extract issues that were fixed
  critical_issues=$(grep -A 3 "CRITICAL" "$review_file" || echo "none")
  high_issues=$(grep -A 3 "HIGH" "$review_file" || echo "none")

  # These become "Common Pitfalls" in playbooks
fi
```

### 4. Identify Reusable Patterns

**Parse code for patterns worth saving:**

```bash
# Look for:
# - Well-structured functions (with JSDoc, error handling, tests)
# - Reusable utilities
# - Configuration patterns
# - Test fixtures

# Example patterns to extract:
patterns_found=()

# State machine pattern
if echo "$files_changed" | grep -q "state.*machine"; then
  patterns_found+=("state-machine")
fi

# Cron pattern
if echo "$files_changed" | grep -q "cron"; then
  patterns_found+=("cron-job")
fi

# Migration pattern
if echo "$files_changed" | grep -q "migration"; then
  patterns_found+=("database-migration")
fi

echo "🎯 Patterns identified: ${patterns_found[@]}"
```

### 5. Update or Create Playbooks

**For each keyword/pattern:**

```bash
playbook_dir="{project-root}/docs/playbooks"
mkdir -p "$playbook_dir"

for keyword in $(echo "$all_keywords" | tr ',' ' '); do
  playbook_file="${playbook_dir}/${keyword}-playbook.md"

  if [ -f "$playbook_file" ]; then
    echo "📖 Updating existing playbook: ${keyword}-playbook.md"
    action="update"
  else
    echo "📝 Creating new playbook: ${keyword}-playbook.md"
    action="create"
  fi

  # Extract learnings specific to this keyword
  # Append to playbook
done
```

### 6. Extract Specific Learnings

**What to extract:**

#### A. Best Practices (from successful implementation)

```
IF story completed with:
  - All tests passing
  - Code review found zero critical issues
  - Clean implementation (no major refactors needed)

THEN extract:
  - Code patterns used
  - File structure choices
  - Testing approaches
  - Configuration patterns
```

**Example extraction:**

```markdown
## Best Practices

**Story {story-key} ({story-title}):**
✅ {Successful pattern used}
✅ {Approach that worked well}
✅ {Quality standard met}
✅ {Test coverage achieved}

**Lesson:** {Key insight from implementation}
**Pattern:** See {file-path}:{function-name}()
```

#### B. Common Pitfalls (from mistakes/fixes)

```
IF code review found issues, OR
   Implementation required fixes, OR
   Tests failed initially

THEN extract:
  - What went wrong
  - How it was fixed
  - How to avoid next time
```

**Example extraction:**

```markdown
## Common Pitfalls

❌ **Story {story-key}: {Mistake description}**
- Problem: {What went wrong}
- Error: {Error message if applicable}
- Root cause: {Why it happened}
- Fix: {How it was resolved}
- Prevention: {How to avoid in future}

❌ **Story {story-key}: {Another mistake}**
- Problem: {Issue encountered}
- Fix: {Solution applied}
- Prevention: {Best practice going forward}
```

#### C. Code Patterns (reusable snippets)

```
IF implementation created reusable code:
  - Helper functions
  - Type definitions
  - Test utilities
  - Configuration patterns

THEN extract code snippets with documentation
```

**Example extraction:**

```markdown
## Code Patterns

### Pattern: Idempotency Key Generation

```typescript
// Source: Story 18-1, lib/billing/billing-service.ts
export function generateIdempotencyKey(
  agreementId: string,
  billingPeriod: string,
  chargeType: ChargeType
): string {
  return `charge-${agreementId}-${billingPeriod}-${chargeType}`;
}
```

**When to use:** Preventing duplicate charge creation
**Why it works:** Deterministic key based on unique identifiers
**Tests:** See __tests__/lib/billing/billing-service.test.ts:47
```

### 7. Commit Playbook Updates

**If playbooks were created/updated:**

```bash
git add docs/playbooks/*.md

git commit -m "docs: update playbooks from Story ${story_key} learnings

Added/updated:
$(git diff --cached --name-only docs/playbooks/ | sed 's/^/- /')

Learnings from successful implementation of ${story_key}."
```

---

## Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ LEARNINGS EXTRACTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Playbooks Updated: {count}
- prisma-playbook.md (added migration year validation)
- state-machine-playbook.md (added transition validation pattern)
- billing-playbook.md (added idempotency key pattern)

Patterns Extracted: {count}
- Idempotency key generation
- State machine validation
- Decimal field serialization

Common Pitfalls Documented: {count}
- Migration year sorting issue
- Enum transaction limitation

These learnings will benefit future stories!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Feedback Loop

```
Story N Implementation
  ↓
Extract Learnings (Step 12)
  ↓
Update Playbooks
  ↓
Commit Playbooks
  ↓
Story N+1 Starts
  ↓
Load Playbooks (Step 1b) ← Gets Story N's learnings!
  ↓
Implement with Knowledge
  ↓
Repeat
```

**Result:** Each story is smarter than the last.

---

## Skill Integration

**Use existing /extract-patterns skill:**

```bash
# After implementation completes
/extract-patterns story-key={story_key} output-dir=docs/playbooks/

# This extracts:
# - Code patterns
# - Test patterns
# - Configuration patterns
# Saves to playbooks directory
```

**Use /get-playbook for on-demand guidance:**

```bash
# During Step 1b if no playbook exists
/get-playbook topic=prisma-migrations

# Searches project docs for guidance
# Creates playbook if patterns found
```

**Use /get-more-context for comprehensive dives:**

```bash
# For complex stories (COMPLEX complexity level)
/get-more-context topic=stripe-integration

# Loads comprehensive documentation
# More detailed than playbook
# Used for high-stakes implementations
```

---

## Configuration

**In super-dev-pipeline/workflow.yaml:**

```yaml
learning_feedback:
  enabled: true  # Enable automatic playbook loading/saving
  playbook_dir: "{project-root}/docs/playbooks"

  # When to extract learnings
  extract_triggers:
    - on_success: true  # Extract after successful completion
    - on_code_review: true  # Extract from review findings
    - on_complex: true  # Always extract from COMPLEX stories

  # When to load playbooks
  load_triggers:
    - on_init: true  # Load at Step 1b
    - keywords_required: 1  # Minimum keywords to trigger
```

---

## Step Sequence Update

**Before (without learning loop):**
1. Init
2. Gap Analysis
3. Write Tests
4. Implement
...
11. Summary

**After (with learning loop):**
1. Init
**1b. Load Playbooks** ← NEW (loads previous learnings)
2. Gap Analysis (informed by playbooks)
3. Write Tests (uses test patterns from playbooks)
4. Implement (follows playbook best practices)
...
11. Summary
**12. Extract Learnings** ← NEW (saves for next story)

---

## Success Criteria

**Step 1b succeeds when:**
- [x] Keywords extracted from story
- [x] Existing playbooks checked
- [x] Applicable playbooks loaded (or noted as missing)
- [x] Context ready for implementation

**Step 12 succeeds when:**
- [x] Learnings extracted from implementation
- [x] Playbooks updated or created
- [x] Patterns documented with code examples
- [x] Playbooks committed to git

---

**Next:** Continue to Step 2 (Pre-Gap Analysis) with loaded playbook context.
