# Step 1b: Load Applicable Playbooks (Agent Reasoning)

**Goal:** Agent reads playbook index, understands story requirements, decides which playbooks to load

---

## Process

### 1. Read Playbook Index

**Load the playbook manifest:**

```bash
playbook_index="{project-root}/docs/playbooks/index.md"

if [ ! -f "$playbook_index" ]; then
  echo "📚 No playbook index found - skipping (will create after first story)"
  exit 0
fi
```

**Index format:**

```markdown
# Playbook Index

## Available Playbooks

### billing-playbook.md
**Topics:** Charge creation, payment processing, idempotency, Stripe integration
**Stories:** 18-1, 18-3, 19-4
**Patterns:** 8 code patterns, 5 pitfalls documented
**Last Updated:** 2026-01-26

### state-machine-playbook.md
**Topics:** State transitions, validation rules, invalid state handling
**Stories:** 18-1, 17-8, 6-1
**Patterns:** 4 code patterns, 3 pitfalls documented
**Last Updated:** 2026-01-25

### database-migration-playbook.md
**Topics:** Prisma migrations, enum handling, transaction splitting, year validation
**Stories:** 18-1, 17-5, 17-1
**Patterns:** 6 code patterns, 8 pitfalls documented
**Last Updated:** 2026-01-26
```

### 2. Read Story Requirements

**Understand what this story is about:**

```bash
# Read from story file:
# - Story description (user story)
# - Acceptance criteria (what to build)
# - Tasks section (how to build it)
# - Technical Requirements (constraints)

story_description=$(sed -n '/^## Story/,/^##/p' "$story_file" | head -20)
tasks=$(sed -n '/^## Tasks/,/^##/p' "$story_file" | head -50)
technical_reqs=$(sed -n '/^## Technical Requirements/,/^##/p' "$story_file" | head -30)
```

### 3. Agent Decides Which Playbooks to Load

**Reasoning prompt to agent:**

```
You are about to implement Story {story_key}.

Story Description:
{story_description}

Tasks Overview:
{first 10 tasks from story}

Technical Requirements:
{technical_requirements}

---

Available Playbooks:

1. billing-playbook.md
   Topics: Charge creation, payment processing, idempotency, Stripe integration
   Patterns: 8 | Pitfalls: 5

2. state-machine-playbook.md
   Topics: State transitions, validation rules, invalid state handling
   Patterns: 4 | Pitfalls: 3

3. database-migration-playbook.md
   Topics: Prisma migrations, enum handling, transaction splitting
   Patterns: 6 | Pitfalls: 8

4. queue-playbook.md
   Topics: SQS integration, message processing, retry logic
   Patterns: 5 | Pitfalls: 4

---

QUESTION: Which playbooks (if any) are relevant to this story's implementation?

Consider:
- What technologies will you use? (database, payment, queue, etc.)
- What patterns are needed? (state machine, cron, idempotency, etc.)
- What challenges might you face? (migrations, async processing, etc.)

Respond with:
- Playbook filenames to load (0-3 playbooks maximum)
- Brief reason why each is relevant

Example response:
"Load: billing-playbook.md (story involves charge creation), state-machine-playbook.md (implementing status transitions)"
```

### 4. Load Selected Playbooks

**Based on agent's decision:**

```bash
# Agent responded: "Load billing-playbook.md, state-machine-playbook.md"

for playbook in $selected_playbooks; do
  playbook_path="${playbook_dir}/${playbook}"

  echo "📖 Loading: $playbook"

  # Read playbook file
  # Extract and present:
  # - Top 5 Best Practices
  # - Top 3 Common Pitfalls
  # - Most recent Code Pattern
  # (Not entire file - keep it focused)

  echo "✅ Loaded: $playbook"
done
```

### 5. Present to Agent

**Concise, actionable format:**

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 APPLICABLE PLAYBOOKS LOADED (2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. billing-playbook.md**

🎯 Top Practices:
- Generate idempotency keys: `charge-{agreementId}-{period}-{type}`
- Use Decimal for money: `amount Decimal @db.Decimal(10, 2)`
- Validate before creating: Check agreement exists, amount > 0

⚠️ Pitfalls to Avoid:
- Don't create duplicate charges (use idempotency key unique constraint)
- Don't hardcode amounts (pull from agreement.monthlyRent)

💡 Recent Pattern (Story 18-1):
```typescript
export async function createCharge(input: CreateChargeInput) {
  const idempotencyKey = generateIdempotencyKey(...)

  // Check for existing charge first
  const existing = await prisma.charge.findUnique({
    where: { idempotencyKey }
  })
  if (existing) return existing

  // Create new charge
  return prisma.charge.create({...})
}
```

**2. state-machine-playbook.md**

🎯 Top Practices:
- Define STATE_TRANSITIONS map with all valid paths
- Validate before transition: `if (!isValidTransition()) throw error`
- Log all state changes for audit trail

⚠️ Pitfalls to Avoid:
- Don't allow arbitrary transitions (use validation map)
- Don't forget to update related entities (e.g., space status)

💡 Recent Pattern (Story 17-8):
```typescript
const STATE_TRANSITIONS = {
  ACTIVE: ['TERMINATING', 'TERMINATED'],
  TERMINATING: ['TERMINATED'],
  // ...
}

function isValidTransition(from, to) {
  return STATE_TRANSITIONS[from]?.includes(to) ?? false
}
```

Apply these learnings to Story {story_key}.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Why This is Better Than Keyword Matching

**Keyword Matching (Dumb):**
```
Story mentions "billing" → Load billing-playbook.md
Story mentions "payment" → Load payment-playbook.md
```
- Doesn't understand context
- Might load irrelevant playbooks
- Might miss relevant playbooks (different words, same concept)

**Agent Reasoning (Smart):**
```
Agent reads: "Create charge model with state machine"
Agent sees playbooks: billing, state-machine, queue, auth
Agent decides: "This is about billing + state transitions"
Agent loads: billing-playbook.md, state-machine-playbook.md
Agent skips: queue-playbook.md (not relevant), auth-playbook.md (not needed)
```
- Understands what the story is actually about
- Makes intelligent decisions
- Loads only relevant playbooks
- Can connect concepts (charge creation = billing)

---

## Step 12: Extract Learnings (Self-Reflection)

### Agent Self-Reflection Prompt

**After implementation completes, ask agent:**

```
You just completed Story {story_key}.

Implementation Summary:
- Files created: {file_list}
- Tests written: {test_count}
- Code review findings: {issue_count} issues (all fixed)
- Commit: {commit_hash}

---

SELF-REFLECTION:

1. What went well during this implementation?
   - What patterns or approaches worked effectively?
   - What code is worth reusing in future stories?

2. What problems did you encounter?
   - What mistakes did you make?
   - What errors occurred?
   - How did you fix them?

3. What would you do differently next time?
   - What prevention checks would catch these issues earlier?
   - What validation would help?

4. Which playbooks should be updated?
   - Look at the technologies/patterns you used
   - Which playbooks (if any) helped you?
   - Which playbooks should exist but don't?

Respond with:
- Patterns to add/update (with code examples)
- Pitfalls to document (with prevention)
- Playbooks to create/update (by name)
```

### Based on Agent Response, Update Playbooks

**Agent responds:**

```
Went well:
- Idempotency key pattern prevented duplicate charges
- State machine validation caught invalid transitions

Problems:
- Initially forgot to update space status on agreement termination
- Enum transaction error (tried to add + use in one migration)

Do differently:
- Add checklist: "After state change, check related entities"
- Always split enum additions into separate migrations

Playbooks to update:
- billing-playbook.md: Add idempotency pattern
- state-machine-playbook.md: Add "check related entities" reminder
- database-migration-playbook.md: Add enum transaction pitfall
```

**Then execute updates:**

```bash
# For each playbook to update
# 1. Read current playbook
# 2. Append new entry to appropriate section
# 3. Update frontmatter (source_stories, pattern_count, last_updated)
# 4. Write updated playbook
# 5. Commit with message: "docs: update {playbook} from Story {story_key} learnings"
```

---

## Playbook Index Maintenance

**Auto-update index when playbooks change:**

```bash
# After Step 12 updates playbooks, regenerate index

cat > docs/playbooks/index.md <<EOF
# Playbook Index

Last Updated: $(date +%Y-%m-%d)
Total Playbooks: $(ls -1 docs/playbooks/*-playbook.md | wc -l | tr -d ' ')

## Available Playbooks

EOF

# For each playbook
for playbook in docs/playbooks/*-playbook.md; do
  basename=$(basename "$playbook")

  # Extract frontmatter
  topics=$(grep "^keywords:" "$playbook" | cut -d: -f2)
  stories=$(grep "^source_stories:" "$playbook" | cut -d: -f2)
  pattern_count=$(grep "^pattern_count:" "$playbook" | cut -d: -f2)
  last_updated=$(grep "^last_updated:" "$playbook" | cut -d: -f2)

  # Generate index entry
  cat >> docs/playbooks/index.md <<ENTRY

### $basename
**Topics:** $topics
**Stories:** $stories
**Patterns:** $pattern_count patterns documented
**Last Updated:** $last_updated
ENTRY
done

git add docs/playbooks/index.md
git commit -m "docs: update playbook index (${playbook_count} playbooks)"
```

---

**Key Difference:** Agent READS index, UNDERSTANDS story, DECIDES which playbooks are relevant. Not dumb keyword matching.
