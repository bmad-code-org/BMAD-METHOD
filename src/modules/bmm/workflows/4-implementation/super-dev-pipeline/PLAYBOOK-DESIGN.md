# Playbook System Design - Automated Learning Feedback Loop

**Version:** 1.6.0
**Purpose:** Build cumulative project intelligence that prevents repeated mistakes

---

## Core Principle

**Playbooks are NOT general advice. They are SPECIFIC, ACTIONABLE learnings extracted from YOUR codebase.**

**Bad Playbook Entry:**
```markdown
✅ Follow best practices for database migrations
```

**Good Playbook Entry:**
```markdown
✅ Use `date +%Y` before creating migrations (2026, not 2025)
   Reason: Migration 20250125_init sorts BEFORE 20260122_add_users (alphabetical)
   Story: 18-1 (made this mistake, fixed with new migration)
   Prevention: grep "^20[0-9]\{6\}" migrations/ | sort | tail -1 # Check newest
```

---

## Playbook Structure

### Required Sections

**1. Metadata (Frontmatter)**
```yaml
---
technology: prisma  # or domain: billing
keywords: [migration, schema, enum, postgres]
source_stories: [18-1, 18-4, 17-5]  # Stories that contributed
last_updated: 2026-01-26
pattern_count: 12
pitfall_count: 8
---
```

**2. Best Practices** (What Worked)
- Specific actions with bash commands
- Why it works (brief explanation)
- Source story reference
- When to apply

**3. Common Pitfalls** (Mistakes Made & Fixed)
- Exact error message
- Root cause
- Fix applied
- Prevention code/check

**4. Code Patterns** (Reusable Snippets)
- Actual code from implementation (not made-up examples)
- Source file path
- When to use / when NOT to use
- Test coverage example

**5. Lessons Learned** (Insights)
- What we thought would work
- What actually worked
- Why the difference matters
- How approach changed

---

## Keyword System

### Keyword Types

**Technology Keywords** (tools/frameworks):
- Database ORM name (prisma, sequelize, typeorm)
- Payment processor (stripe, paypal)
- Cache (redis, memcached)
- Queue (sqs, rabbitmq, bull)
- Auth provider (cognito, auth0, clerk)

**Domain Keywords** (business areas):
- Extracted from YOUR epics (billing, rental, submission, jury, etc.)
- Not generic (not just "crud" or "api")
- Specific to your product

**Pattern Keywords** (architecture):
- state-machine
- cron
- webhook
- idempotency
- soft-delete
- multi-tenant

### Keyword Extraction Rules

**From Story Title:**
```bash
# Extract nouns that are likely technologies or domains
story_title=$(grep "^# Story" "$story_file" | head -1)
# Example: "Story 18.1: Charge Model & State Machine"
# Keywords: charge, model, state-machine
```

**From Task Descriptions:**
```bash
# Look for mentions of:
# - File paths (lib/billing → billing)
# - Function names (createCharge → charge, create)
# - Technology names (Prisma, Stripe, SQS)
```

**From Files Changed:**
```bash
git diff --name-only HEAD~1 HEAD | \
  grep -oE "[a-z-]+/" | \
  tr -d '/' | \
  sort -u
# Example: lib/billing/file.ts → billing
```

---

## Step 1b: Load Playbooks (Refined)

### Precision Loading

**Don't load everything. Load only what's relevant.**

```bash
# 1. Extract 3-5 primary keywords from story
primary_keywords=$(analyze_story_for_keywords "$story_file" | head -5)

# 2. For each primary keyword
for keyword in $primary_keywords; do
  playbook="${playbook_dir}/${keyword}-playbook.md"

  if [ -f "$playbook" ]; then
    # 3. Read playbook frontmatter
    pattern_count=$(grep "^pattern_count:" "$playbook" | cut -d: -f2)
    source_stories=$(grep "^source_stories:" "$playbook" | cut -d: -f2)

    echo "📚 Loading: ${keyword}-playbook.md"
    echo "   Patterns: $pattern_count | Source: $source_stories"

    # 4. Extract ONLY relevant sections (not entire file)
    # - Best Practices (top 5)
    # - Common Pitfalls (top 3)
    # - Most recent Code Pattern

    # 5. Present concisely to agent
  else
    echo "ℹ️  No playbook for: $keyword (will create if patterns emerge)"
  fi
done
```

### What Gets Loaded

**Format for agent consumption:**

```markdown
📚 **Playbook: {keyword}**

🎯 **Top 3 Practices:**
1. {Specific action with command}
2. {Specific pattern with example}
3. {Specific check with verification}

⚠️  **Top 2 Pitfalls:**
1. {Specific mistake with prevention}
2. {Specific error with fix}

💡 **Latest Pattern** (from Story {story-key}):
```{language}
{10-20 lines of actual code}
```
When: {specific use case}
```

**Keep it focused.** Agent doesn't need entire playbook, just highlights.

---

## Step 12: Extract Learnings (Refined)

### Precision Extraction

**Extract ONLY from successful, clean implementations.**

```bash
# Quality gate: Only extract if story meets standards
checked_tasks=$(grep -c "^- \[x\]" "$story_file")
total_tasks=$(grep -c "^- \[[x ]\]" "$story_file")
completion_pct=$((checked_tasks * 100 / total_tasks))

if [ "$completion_pct" -lt 80 ]; then
  echo "⏭️  Skipping learning extraction (only $completion_pct% complete)"
  exit 0
fi

# Check if code review found critical issues
if [ -f "docs/sprint-artifacts/review-${story_key}.md" ]; then
  critical_count=$(grep -c "CRITICAL" "docs/sprint-artifacts/review-${story_key}.md")

  if [ "$critical_count" -gt 0 ]; then
    echo "⏭️  Skipping learning extraction ($critical_count critical issues found)"
    exit 0
  fi
fi

echo "✅ Story meets quality standards - extracting learnings"
```

### What to Extract

**1. Code Patterns (from git diff)**

```bash
commit_hash=$(git log --oneline --grep="$story_key" | head -1 | awk '{print $1}')

# Get functions added in this commit
new_functions=$(git show "$commit_hash" | \
  grep "^+.*export.*function\|^+.*export const" | \
  sed 's/^+//' | head -10)

# For each function:
# - Extract function signature
# - Get 5 lines before + 20 lines after (full function)
# - Add to Code Patterns section of playbook
# - Include source file path
# - Include story reference
```

**2. Pitfalls (from code review fixes)**

```bash
review_file="docs/sprint-artifacts/review-${story_key}.md"

if [ -f "$review_file" ]; then
  # Extract HIGH and CRITICAL issues that were fixed
  issues=$(grep -A 10 "^## Issue #" "$review_file" | \
    grep -E "Severity: (HIGH|CRITICAL)" -B 5)

  # For each issue:
  # - Extract: Problem description
  # - Extract: Fix that was applied
  # - Create pitfall entry with prevention code
fi
```

**3. Best Practices (from successful implementation)**

```bash
# If story completed with:
# - All tests passing
# - Zero critical review issues
# - High task completion (>90%)

# Extract:
# - Testing approach (test count, coverage %)
# - File structure chosen
# - Naming conventions used
# - Patterns that worked well
```

### Playbook Update Algorithm

```bash
keyword="prisma"  # Example
playbook_file="${playbook_dir}/${keyword}-playbook.md"

if [ ! -f "$playbook_file" ]; then
  # Create new playbook from template
  cat > "$playbook_file" <<EOF
---
technology: ${keyword}
keywords: [${keyword}]
source_stories: [${story_key}]
last_updated: $(date +%Y-%m-%d)
pattern_count: 0
pitfall_count: 0
---

# ${keyword^} Playbook

**Generated from:** Story ${story_key}

## Best Practices

## Common Pitfalls

## Code Patterns

## Lessons Learned
EOF
else
  # Update existing playbook
  # - Append to each section
  # - Update source_stories list
  # - Increment pattern/pitfall counts
  # - Update last_updated date
fi

# Append new learning
cat >> "$playbook_file" <<EOF

**Story ${story_key}:**
${extracted_learning}
EOF
```

---

## Storage Format

### Playbook File Naming

```
docs/playbooks/
  {technology}-playbook.md  # Technology-specific
  {domain}-playbook.md      # Domain-specific
  {pattern}-playbook.md     # Pattern-specific
```

**Examples (generic, not project-specific):**
```
database-orm-playbook.md  # Whatever ORM you use
payment-processor-playbook.md  # Whatever payment system
auth-system-playbook.md   # Whatever auth provider
state-machine-playbook.md  # Architecture pattern
cron-jobs-playbook.md     # Architecture pattern
```

### Playbook Content

**Maximum 200 lines per playbook.** When it grows larger:
1. Archive old learnings
2. Keep only most recent/relevant
3. Prune outdated patterns

**Sections sized:**
- Best Practices: Top 10 (most recent)
- Common Pitfalls: Top 8 (most common)
- Code Patterns: Top 5 (most reused)
- Lessons Learned: Latest 3

---

## Integration with Workflow

**Updated Step Sequence:**

```
Step 1:  Init (load story, verify file)
Step 1b: Load Playbooks ← NEW (auto-detect keywords, load applicable)
Step 2:  Pre-Gap Analysis (informed by playbooks)
Step 3:  Write Tests (use test patterns from playbooks)
Step 4:  Implement (follow playbook best practices)
Step 5:  Post-Validation
Step 6:  Quality Checks
Step 7:  Code Review (compare against playbook standards)
Step 8:  Review Analysis
Step 9:  Fix Issues
Step 10: Complete
Step 11: Summary
Step 12: Extract Learnings ← NEW (save patterns to playbooks)
```

**Workflow version:** 1.6.0 (adds learning feedback loop)

---

## Success Metrics

**Measure effectiveness:**

```bash
# 1. Playbook growth over time
ls -1 docs/playbooks/*.md | wc -l  # Number of playbooks

# 2. Pattern reuse
grep "Source:" docs/playbooks/*.md | wc -l  # Patterns documented

# 3. Mistake prevention
grep "Pitfall.*Story" docs/playbooks/*.md | \
  cut -d: -f2 | sort | uniq -c | sort -rn
# Shows which mistakes were repeated (should decrease over time)

# 4. Coverage
keywords_in_stories=$(analyze all stories for keywords | sort -u | wc -l)
playbooks_created=$(ls -1 docs/playbooks/*.md | wc -l)
coverage_pct=$((playbooks_created * 100 / keywords_in_stories))
# Target: 80%+ keyword coverage
```

---

## Expected Outcomes

**After 10 stories:**
- 5-8 playbooks created
- 30-50 patterns documented
- 15-25 pitfalls catalogued
- Mistakes rarely repeated

**After 50 stories:**
- 15-20 comprehensive playbooks
- 100+ patterns documented
- Stable knowledge base (fewer new pitfalls)
- High pattern reuse

**After 100 stories:**
- Mature playbook system
- Most mistakes already documented
- New stories implement faster (less trial-and-error)
- Onboarding new developers easier

---

## Quality Standards

**Playbook entries must be:**
- ✅ Specific (exact commands, not vague advice)
- ✅ Actionable (copy-paste ready)
- ✅ Evidence-based (from actual code)
- ✅ Sourced (story reference)
- ✅ Verified (pattern actually works)

**Reject entries that are:**
- ❌ Generic advice ("write good code")
- ❌ Theoretical ("this might work")
- ❌ Unsourced (no story reference)
- ❌ Unverified (pattern never tested)

---

**This creates a self-improving system where each story makes the next one better.**
