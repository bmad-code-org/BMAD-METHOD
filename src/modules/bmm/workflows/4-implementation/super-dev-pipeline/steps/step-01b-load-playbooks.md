# Step 1b: Load Applicable Playbooks (Automated Learning)

**Goal:** Automatically load relevant playbooks and learnings before implementation starts

---

## What This Step Does

Before writing any code, check if previous work has created playbooks/patterns that apply to this story. This creates a **positive feedback loop** where agents get smarter with each story.

---

## Execution

### 1. Analyze Story for Keywords

**Extract topics from story:**

```bash
story_file="{story_file}"

# Extract keywords from:
# - Story title
# - Task descriptions
# - Technical Requirements section
# - Architecture Compliance section

keywords=$(grep -E "^### Task|^## Technical|^## Architecture" "$story_file" | \
  grep -oiE "(prisma|stripe|auth|cron|queue|state machine|billing|payment|migration|api|database|email|notification|cache|redis|s3)" | \
  sort -u | tr '\n' ',' | sed 's/,$//')

echo "📚 Story keywords: $keywords"
```

**Common keyword categories:**
- **Technology:** Database ORM, payment processor, cache, storage, infrastructure
- **Domain:** Business logic areas (determined by your project)
- **Pattern:** Architecture patterns (state machine, cron, queue, api, etc.)

### 2. Check for Existing Playbooks

**Search playbook directory:**

```bash
playbook_dir="{project-root}/docs/playbooks"

if [ ! -d "$playbook_dir" ]; then
  echo "📚 No playbooks directory found - will create after implementation"
  playbooks_loaded=0
  skip_to_step_2=true
fi

# For each keyword, check if playbook exists
applicable_playbooks=()

for keyword in $(echo "$keywords" | tr ',' ' '); do
  playbook_file="${playbook_dir}/${keyword}-playbook.md"

  if [ -f "$playbook_file" ]; then
    echo "✅ Found playbook: ${keyword}-playbook.md"
    applicable_playbooks+=("$playbook_file")
  fi
done

echo "📚 Applicable playbooks: ${#applicable_playbooks[@]}"
```

### 3. Load Playbooks (If Found)

**For each applicable playbook:**

```
Read playbook file

Extract sections:
  - ## Best Practices
  - ## Common Pitfalls
  - ## Code Patterns
  - ## Lessons Learned
  - ## Do's and Don'ts

Store in context for use during implementation
```

**Example:**

```markdown
📚 Loaded: {technology}-playbook.md

Best Practices:
- {Practice learned from previous implementations}
- {Pattern that worked successfully}
- {Standard established across stories}

Common Pitfalls:
- {Mistake that was made and fixed}
- {Issue encountered and resolved}
- {Edge case discovered}

Code Patterns:
- {Reusable pattern with code example}
- {Configuration approach}
- {Testing strategy}
```

### 4. Request Additional Context (If Needed)

**If no playbooks found but keywords detected:**

```
🔍 No existing playbooks for: {keywords}

Checking for project-level guidance...
```

**Use /get-playbook to request specific guidance:**

```bash
# For each keyword without playbook
for keyword in $keywords_without_playbooks; do
  echo "📖 Requesting playbook: $keyword"

  # Invoke /get-playbook with keyword
  # This searches docs/, pulls from project context, creates on-demand playbook

  # If guidance found, cache for future use
done
```

### 5. Display Loaded Context

**Output to agent:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 APPLICABLE LEARNINGS LOADED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story: {story_key}
Keywords: {keywords}

Playbooks Loaded: {count}
1. prisma-playbook.md - Database schema best practices
2. state-machine-playbook.md - State transition patterns
3. billing-playbook.md - Payment processing learnings

Key Guidance:
✅ Use 2026 in migration names (not 2025)
✅ Split enum add + use into 2 migrations
✅ Test state transitions exhaustively
✅ Idempotency keys for all charges
✅ Never hardcode payment amounts

These learnings come from previous story implementations.
Use them to avoid repeating past mistakes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Integration Points

**This step runs:**
- After Step 1 (Init) - story file loaded
- Before Step 2 (Gap Analysis) - context ready
- Before Step 3 (Write Tests) - patterns available
- Before Step 4 (Implement) - guidance active

**Feeds into:**
- Step 2: Gap analysis sees playbook patterns
- Step 3: Test patterns from playbooks
- Step 4: Implementation follows playbook best practices
- Step 7: Code review compares against playbook standards

---

## File Structure

```
docs/
  playbooks/
    prisma-playbook.md        # Prisma best practices
    stripe-playbook.md        # Stripe integration patterns
    auth-playbook.md          # Authentication learnings
    state-machine-playbook.md # State machine patterns
    cron-playbook.md          # Cron job patterns
    billing-playbook.md       # Billing/payment learnings
    migration-playbook.md     # Database migration rules
```

---

## Playbook Template

```markdown
# {Technology/Domain} Playbook

**Last Updated:** {date}
**Source Stories:** {story-keys that contributed learnings}

## Best Practices

1. {Practice from successful implementations}
2. {Pattern that worked well}
3. {Standard we always follow}

## Common Pitfalls

❌ {Mistake that was made}
✅ {How to avoid it}

❌ {Another mistake}
✅ {Correct approach}

## Code Patterns

**Pattern: {Name}**
```typescript
// Code example from actual implementation
// Story: {story-key}
```

**When to use:** {Context}
**When NOT to use:** {Anti-pattern}

## Lessons Learned

**Story {story-key}:**
- Learned: {Insight}
- Applied: {How we changed approach}
- Result: {Outcome}

## Do's and Don'ts

**DO:**
- {Positive practice}
- {What works}

**DON'T:**
- {What to avoid}
- {Anti-pattern}

## References

- Story implementations: {list of story-keys}
- Architecture docs: {relevant docs}
- External resources: {links}
```

---

## Benefits

**Positive Feedback Loop:**
1. Story 18-1 implements Prisma migration → Learns "use 2026 in names"
2. Story 18-1 complete → Extracts pattern → Saves to prisma-playbook.md
3. Story 18-2 starts → Loads prisma-playbook.md → Applies learning
4. Story 18-2 implements correctly first time (no year mistake)

**Cumulative Intelligence:**
- Epic 1: Creates foundational playbooks
- Epic 2: Builds on Epic 1 playbooks, adds new learnings
- Epic 18: Has 17 epics worth of learnings available
- Gets smarter with every story

**Prevents Repeated Mistakes:**
- Migration year mistakes (happened multiple times)
- Enum transaction limitations (PostgreSQL gotcha)
- Story file naming inconsistencies (just experienced!)
- Missing checkbox updates (just fixed!)

---

## Auto-Load Triggers

**Automatic playbook loading based on story content:**

| Story Contains | Auto-Load Playbooks |
|----------------|---------------------|
| Database ORM keywords | database-orm-playbook.md, migration-playbook.md |
| Payment keywords | payment-playbook.md, billing-playbook.md |
| Auth keywords | auth-playbook.md, security-playbook.md |
| Scheduling keywords | cron-playbook.md, scheduling-playbook.md |
| Queue/async keywords | queue-playbook.md, async-playbook.md |
| State machine keywords | state-machine-playbook.md |
| Email/notification keywords | email-playbook.md, notification-playbook.md |

**Note:** Playbook names are derived from keywords found in your story files.
The system adapts to your project's technology stack.

---

## Next Step

When complete, continue to Step 2 (Pre-Gap Analysis) with loaded playbooks in context.

**Next:** `{workflow_path}/steps/step-02-pre-gap-analysis.md`
