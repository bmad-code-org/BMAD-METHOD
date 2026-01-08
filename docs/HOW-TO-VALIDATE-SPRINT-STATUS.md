# How to Validate Sprint Status - Complete Guide

**Created:** 2026-01-02
**Updated:** 2026-01-07 (v1.3.0 - Continuous Progress Tracking)
**Purpose:** Ensure sprint-status.yaml and story files reflect REALITY, not fiction

---

## 🆕 Progress Tracking (v1.3.0)

**NEW:** sprint-status.yaml is now updated **after EVERY task completion**, not just at story start/end.

### Progress Format

```yaml
development_status:
  1-2-login: in-progress  # 3/10 tasks (30%)
  1-3-auth: in-progress  # 7/8 tasks (88%)
  1-4-api: review  # 10/10 tasks (100%) - awaiting review
  1-5-ui: done  # ✅ COMPLETED: Dashboard + widgets + tests
```

### Update Frequency

| Event | Status Update | Progress Update |
|-------|---------------|-----------------|
| Story starts | `ready-for-dev` → `in-progress` | `# 0/10 tasks (0%)` |
| Task 1 completes | (no change) | `# 1/10 tasks (10%)` ✅ |
| Task 2 completes | (no change) | `# 2/10 tasks (20%)` ✅ |
| ... | ... | ... |
| Task 10 completes | `in-progress` → `review` | `# 10/10 tasks (100%) - awaiting review` |
| Review passes | `review` → `done` | `# ✅ COMPLETED: Summary` |

**Enforcement:** dev-story Step 8 now includes CRITICAL enforcement that HALTs if sprint-status.yaml update fails.

---

## Three Levels of Validation

### Level 1: Status Field Validation (FAST - Free)
Compare Status field in story files vs sprint-status.yaml
**Cost:** Free | **Time:** 5 seconds

```bash
python3 scripts/lib/sprint-status-updater.py --mode validate
```

### Level 2: Deep Story Validation (MEDIUM - $0.15/story)
Haiku agent reads actual code and verifies all tasks
**Cost:** ~$0.15/story | **Time:** 2-5 min/story

```bash
/validate-story-deep docs/sprint-artifacts/16e-6-ecs-task-definitions-tier3.md
```

### Level 3: Comprehensive Platform Audit (DEEP - $76 total)
Validates ALL 511 stories using batched Haiku agents
**Cost:** ~$76 total | **Time:** 4-6 hours

```bash
/validate-all-stories-deep
/validate-all-stories-deep --epic 16e  # Or filter to specific epic
```

---

## Why Haiku Not Sonnet

**Per story cost:**
- Haiku: $0.15
- Sonnet: $1.80
- **Savings: 92%**

**Full platform:**
- Haiku: $76
- Sonnet: $920
- **Savings: $844**

**Agent startup overhead (why ONE agent per story):**
- Bad: 50 tasks × 50 agents = 2.5M tokens overhead
- Good: 1 agent reads all files, verifies all 50 tasks = 25K overhead
- **Savings: 99% less overhead**

---

## Semaphore Pattern (Continuous Concurrency)

**NEW v1.3.0:** Worker pool pattern replaces batch-and-wait for maximum efficiency.

**How it works:**
- Maintain N concurrent workers (user chooses N)
- As soon as a worker finishes → immediately start next story
- No idle time waiting for batch completion
- Constant concurrency until queue empty

**Example (5 concurrent workers, 12 stories):**
```
Initial: Workers 1-5 start stories 1-5
Worker 3 finishes story 3 → immediately starts story 6
Worker 1 finishes story 1 → immediately starts story 7
Worker 5 finishes story 5 → immediately starts story 8
Worker 2 finishes story 2 → immediately starts story 9
...continues until all 12 stories processed
```

**Old Batch Pattern (INEFFICIENT):**
```
Batch 1: Start stories 1-5
Wait for ALL 5 to finish (if story 5 is slow, stories 1-4 sit idle after completion)
Batch 2: Start stories 6-10
Wait for ALL 5 to finish
Batch 3: Start stories 11-12
```

**Efficiency Gain:** 20-40% faster completion (eliminates idle time)

---

## What Gets Verified

For each task, Haiku agent:
1. Finds files with Glob/Grep
2. Reads code with Read tool
3. Checks for stubs/TODOs
4. Verifies tests exist
5. Checks multi-tenant isolation
6. Reports: actually_complete, evidence, issues

---

## Commands Reference

```bash
# Weekly validation (free, 5 sec)
python3 scripts/lib/sprint-status-updater.py --mode validate

# Fix discrepancies
python3 scripts/lib/sprint-status-updater.py --mode fix

# Deep validate one story ($0.15, 2-5 min)
/validate-story-deep docs/sprint-artifacts/STORY.md

# Comprehensive audit ($76, 4-6h)
/validate-all-stories-deep
```

---

**Files:** `_bmad/bmm/workflows/4-implementation/validate-*-deep/`
