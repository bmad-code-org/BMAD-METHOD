# How to Validate Sprint Status - Complete Guide

**Created:** 2026-01-02
**Purpose:** Ensure sprint-status.yaml and story files reflect REALITY, not fiction

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

## Batching (Max 5 Stories Concurrent)

**Why batch_size = 5:**
- Prevents spawning 511 agents at once
- Allows progress saving/resuming
- Rate limiting friendly

**Execution:**
- Batch 1: Stories 1-5 (5 agents)
- Wait for completion
- Batch 2: Stories 6-10 (5 agents)
- ...continues until done

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
