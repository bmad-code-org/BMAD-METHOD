# Agent Limitations in Batch Mode

**CRITICAL:** Agents running in batch-stories have specific limitations. Understanding these prevents wasted time and sets correct expectations.

---

## Core Limitations

### ❌ Agents CANNOT Invoke Other Workflows

**What this means:**
- Agents cannot run `/create-story-with-gap-analysis`
- Agents cannot execute `/` slash commands (those are for user CLI)
- Agents cannot call other BMAD workflows mid-execution

**Why:**
- Slash commands require user terminal context
- Workflow invocation requires special tool access
- Batch agents are isolated execution contexts

**Implication:**
- Story creation MUST happen before batch execution
- If stories are incomplete, batch will skip them
- No way to "fix" stories during batch

---

### ❌ Agents CANNOT Prompt User Interactively

**What this means:**
- Batch runs autonomously, no user interaction
- `<ask>` tags are auto-answered with defaults
- No way to clarify ambiguous requirements mid-batch

**Why:**
- Batch is designed for unattended execution
- User may not be present during execution
- Prompts would break parallel execution

**Implication:**
- All requirements must be clear in story file
- Optional steps are skipped
- Ambiguous stories will halt or skip

---

### ❌ Agents CANNOT Generate Missing BMAD Sections

**What this means:**
- If story has <12 sections, agent halts
- If story has 0 tasks, agent halts
- Agent will NOT try to "fix" the story format

**Why:**
- Story format is structural, not implementation
- Generating sections requires context agent doesn't have
- Gap analysis requires codebase scanning beyond agent scope

**Implication:**
- All stories must be properly formatted BEFORE batch
- Run validation: `./scripts/validate-bmad-format.sh`
- Regenerate incomplete stories manually

---

## What Agents CAN Do

### ✅ Execute Clear, Well-Defined Tasks

**Works well:**
- Stories with 10-30 specific tasks
- Clear acceptance criteria
- Existing code to modify
- Well-defined scope

### ✅ Make Implementation Decisions

**Works well:**
- Choose between valid approaches
- Apply patterns from codebase
- Fix bugs based on error messages
- Optimize existing code

### ✅ Run Tests and Verify

**Works well:**
- Execute test suites
- Measure coverage
- Fix failing tests
- Validate implementations

---

## Pre-Batch Validation Checklist

**Before running /batch-stories, verify ALL selected stories:**

```bash
# 1. Check story files exist
for story in $(grep "ready-for-dev" docs/sprint-artifacts/sprint-status.yaml | awk '{print $1}' | sed 's/://'); do
  [ -f "docs/sprint-artifacts/story-$story.md" ] || echo "❌ Missing: $story"
done

# 2. Check all have 12 BMAD sections
for file in docs/sprint-artifacts/story-*.md; do
  sections=$(grep -c "^## " "$file")
  if [ "$sections" -lt 12 ]; then
    echo "❌ Incomplete: $file ($sections/12 sections)"
  fi
done

# 3. Check all have tasks
for file in docs/sprint-artifacts/story-*.md; do
  tasks=$(grep -c "^- \[ \]" "$file")
  if [ "$tasks" -eq 0 ]; then
    echo "❌ No tasks: $file"
  fi
done
```

**If any checks fail:**
1. Regenerate those stories: `/create-story-with-gap-analysis`
2. Validate again
3. THEN run batch-stories

---

## Error Messages Explained

### "EARLY BAILOUT: No Tasks Found"

**What it means:** Story file has 0 unchecked tasks
**Is this a bug?** ❌ NO - This is correct validation
**What to do:**
- If story is skeleton: Regenerate with /create-story-with-gap-analysis
- If story is complete: Mark as "done" in sprint-status.yaml
- If story needs work: Add tasks to story file

### "EARLY BAILOUT: Invalid Story Format"

**What it means:** Story missing required sections (Tasks, AC, etc.)
**Is this a bug?** ❌ NO - This is correct validation
**What to do:**
- Regenerate with /create-story-with-gap-analysis
- Do NOT try to manually add sections (skip gap analysis)
- Do NOT launch batch with incomplete stories

### "Story Creation Failed" or "Skipped"

**What it means:** Agent tried to create story but couldn't
**Is this a bug?** ❌ NO - Agents can't create stories
**What to do:**
- Exit batch-stories
- Manually run /create-story-with-gap-analysis
- Re-run batch after story created

---

## Best Practices

### ✅ DO: Generate All Stories Before Batch

**Workflow:**
```
1. Plan epic → Identify stories → Create list
2. Generate stories: /create-story-with-gap-analysis (1-2 days)
3. Validate stories: ./scripts/validate-all-stories.sh
4. Execute stories: /batch-stories (parallel, fast)
```

### ✅ DO: Use Small Batches for Mixed Complexity

**Workflow:**
```
1. Group by complexity (micro, standard, complex)
2. Batch micro stories (quick wins)
3. Batch standard stories
4. Execute complex stories individually
```

### ❌ DON'T: Try to Batch Regenerate

**Why it fails:**
```
1. Create 20 skeleton files with just widget lists
2. Run /batch-stories
3. Expect agents to regenerate them
   → FAILS: Agents can't invoke /create-story workflow
```

### ❌ DON'T: Mix Skeletons with Proper Stories

**Why it fails:**
```
1. 10 proper BMAD stories + 10 skeletons
2. Run /batch-stories
3. Expect batch to handle both
   → RESULT: 10 execute, 10 skipped (confusing)
```

### ❌ DON'T: Assume Agents Will "Figure It Out"

**Why it fails:**
```
1. Launch batch with unclear stories
2. Hope agents will regenerate/fix/create
   → RESULT: Agents halt correctly, nothing happens
```

---

## Summary

**The Golden Rule:**
> **Batch-super-dev is for EXECUTION, not CREATION.**
>
> Story creation is interactive and requires user input.
> Always create/regenerate stories BEFORE batch execution.

**Remember:**
- Agents have limitations (documented above)
- These are features, not bugs
- Workflows correctly validate and halt
- User must prepare stories properly first

**Success Formula:**
```
Proper Story Generation (1-2 days manual work)
  ↓
Validation (5 minutes automated)
  ↓
Batch Execution (4-8 hours parallel autonomous)
  ↓
Review & Merge (1-2 hours)
```

Don't skip the preparation steps!
