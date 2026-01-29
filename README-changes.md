# Fork Changes: @jonahschulte/bmad-method

This document describes the customizations and enhancements in this fork compared to the [upstream BMAD-METHOD repository](https://github.com/bmad-code-org/BMAD-METHOD).

## Overview

This fork extends the official BMAD Method with **production automation workflows** focused on:

- **Quality assurance automation** - Multi-stage validation pipelines
- **Token efficiency** - 50-70% reduction through complexity-based routing
- **Autonomous processing** - Unattended epic completion
- **Anti-vibe-coding enforcement** - Mandatory gap analysis and code review
- **Smart routing** - Micro stories skip unnecessary quality gates

**Stats:** ~26,000+ lines of additions across 122 files

---

## Key Features Added

### 1. Super-Dev Pipeline (`/super-dev-pipeline`)

A comprehensive quality workflow that ensures stories are **truly complete** before marking done:

```
Pre-validation → Development → Post-validation → Code Review → Fixes → Done ✅
```

**What it solves:**
- Prevents premature task completion ("stupid-dev" syndrome)
- Catches partial implementations
- Finds missed edge cases automatically
- Runs adversarial code review before human review

**Complexity-Based Routing (v1.3.0):**
- **MICRO stories** automatically skip steps 2 (pre-gap analysis) and 5 (code review)
- **STANDARD/COMPLEX stories** use full 7-step pipeline
- Early bailout checks prevent processing already-complete or invalid stories
- Token savings: 50-70% for micro stories, 90% for early bailouts

**Location:** `src/modules/bmm/workflows/4-implementation/super-dev-pipeline/`

---

### 2. Story Pipeline v2.0 (`/story-pipeline`)

Single-session step-file architecture with **60-70% token savings**:

| Mode | Token Usage | Savings vs Legacy |
|------|-------------|-------------------|
| Interactive | ~25K | 65% |
| Batch (YOLO) | ~30K | 58% |

**How it works:**
- Replaces 6 separate Claude CLI calls with 1 session
- Just-in-time step loading
- Checkpoint/resume capability
- Role switching within session (SM → TEA → DEV → SM)

**Automated steps:**
1. Initialize & load context
2. Create story (SM role)
3. Validate story (adversarial - must find 3-10 issues)
4. ATDD test generation (TEA role)
5. Implementation (DEV role)
6. Code review (adversarial)
7. Complete & commit
8. Generate audit trail

**Location:** `src/modules/bmm/workflows/4-implementation/story-pipeline/`

---

### 3. Batch Super-Dev (`/batch-super-dev`) ⭐ Primary

Interactive batch workflow for processing multiple stories with full quality gates:

```bash
/batch-super-dev

→ Select stories: 1-3,5,7  (or "all")
→ Validates story files (creates missing, regenerates invalid)
→ Scores complexity for each story (micro/standard/complex)
→ Routes to appropriate pipeline (lightweight vs full)
→ Processes each with super-dev-pipeline
→ Reconciles story status after each
→ All stories complete! ✅
```

**Features (v1.3.0):**
- **Complexity-Based Routing** ⭐ NEW - Smart pipeline selection
  - **MICRO** (≤3 tasks, low risk): Lightweight path, skips gap analysis + code review (50-70% token savings)
  - **STANDARD** (4-15 tasks): Full pipeline with all quality gates
  - **COMPLEX** (≥16 tasks or high-risk): Enhanced validation, suggest splitting
- **Smart Story Validation** - Checks 12 required BMAD sections
- **Auto-Creation** - Creates missing story files with codebase gap analysis
- **Auto-Regeneration** - Regenerates invalid/incomplete stories
- **Sequential or Parallel** execution modes
- **Story Reconciliation** - Verifies checkboxes match implementation
- **Epic filtering** - Process only specific epic's stories

**Complexity Scoring Algorithm:**
```
complexity_score = task_count + (high_risk_keywords × 5) + (medium_risk_keywords × 2)

MICRO:    task_count ≤ 3 AND score ≤ 5 AND file_count ≤ 5 AND no HIGH risk keywords
COMPLEX:  task_count ≥ 16 OR score ≥ 20 OR has HIGH risk keywords (auth, security, payment, etc.)
STANDARD: everything else
```

**Risk Keywords:**
- **HIGH** (5 points): auth, security, payment, encryption, migration, database, schema
- **MEDIUM** (2 points): api, integration, external, third-party, cache
- **LOW** (0 points): ui, style, config, docs, test

**Location:** `src/modules/bmm/workflows/4-implementation/batch-super-dev/`

---

### 4. Gap Analysis (`/gap-analysis`)

Dev-time codebase validation that solves the **batch planning staleness problem**:

**The Problem:** Stories planned days ago become stale as the codebase evolves.

**The Solution:** Mandatory gap analysis before development:
1. Scans current codebase
2. Validates DRAFT tasks against reality
3. Proposes refinements (add/modify/remove tasks)
4. User approves with 6 options: Y/A/n/e/s/r

**Location:** `src/modules/bmm/workflows/4-implementation/gap-analysis/`

---

### 5. Push-All Workflow (`/push-all`)

Safe automated git operations with comprehensive safety checks:

- Secret detection (API keys, credentials)
- Large file warnings
- Build artifact detection
- Smart commit message generation
- Auto-push with error handling

**Location:** `src/modules/bmm/workflows/4-implementation/push-all/`

---

### 7. Story Validation System

Multi-level story validation with LLM-powered verification:

| Workflow | Purpose |
|----------|---------|
| `/validate-story` | Single story validation |
| `/validate-story-deep` | Comprehensive deep validation |
| `/validate-all-stories` | Batch validation for epic |
| `/validate-all-stories-deep` | Deep validation for all stories |
| `/validate-epic-status` | Epic status reconciliation |
| `/validate-all-epics` | Full sprint validation |

**Location:** `src/modules/bmm/workflows/4-implementation/validate-*/`

---

### 8. Sprint Status Management Scripts

Python/TypeScript utilities for sprint tracking:

| Script | Purpose |
|--------|---------|
| `sprint-status-updater.py` | Update story statuses across epics |
| `task-verification-engine.py` | LLM-powered task completion verification |
| `llm-task-verifier.py` | Haiku-based task validation |
| `validation-progress-tracker.py` | Track validation progress |
| `add-status-fields.py` | Add status fields to story files |

**Features:**
- Bedrock/Claude API clients with rate limiting
- File utilities for story parsing
- Resumable validation runs

**Location:** `scripts/lib/`

---

### 9. BMAD Guide Skill

Automatic Claude Code skill for BMAD navigation:

```bash
# Auto-installed with BMAD
# Provides workflow selection guidance
```

**What it does:**
- Phase detection (where am I?)
- Project level routing
- Workflow decision tree
- Critical rules enforcement

**Location:** `resources/skills/bmad-guide.md`

---

### 10. Claude Code Commands

Pre-configured Claude CLI commands:

| Command | Description |
|---------|-------------|
| `batch-super-dev` | Run batch super-dev pipeline |
| `story-pipeline` | Execute story pipeline |
| `super-dev-pipeline` | Run super-dev with quality gates |
| `validate-epic-status` | Validate epic status |
| `validate-all-epics` | Validate all epics |

**Location:** `.claude-commands/`

---

## Package Changes

```json
{
  "name": "@jonahschulte/bmad-method",
  "description": "...Enhanced with super-dev-pipeline and smart batching"
}
```

This fork is published to npm under the `@jonahschulte` scope for independent installation.

---

## Modules Modified

### BMM (BMAD Main Method)
- Enhanced `dev.agent.yaml` with new workflow menu items
- Enhanced `sm.agent.yaml` with new workflow menu items
- Modified `create-story` workflow for requirements-focused planning
- Enhanced `dev-story` workflow with gap analysis integration

---

## Installation

This fork can be installed via:

```bash
npm install @jonahschulte/bmad-method
```

Or used directly by cloning this repository.

---

## Documentation Added

| Document | Purpose |
|----------|---------|
| `docs/super-dev-mode.md` | Super-dev workflow guide |
| `docs/autonomous-epic-processing.md` | Auto-epic documentation |
| `docs/gap-analysis.md` | Gap analysis user guide |
| `docs/gap-analysis-migration.md` | Migration from legacy |
| `docs/workflows/SPRINT-STATUS-SYNC-GUIDE.md` | Sprint status management |
| `docs/HOW-TO-VALIDATE-SPRINT-STATUS.md` | Validation how-to |
| `FEATURE-SUMMARY.md` | Complete feature overview |
| `INTEGRATION-NOTES.md` | Integration documentation |
| `TESTING-GUIDE.md` | Testing procedures |

---

## Compatibility

- **Backwards compatible** with upstream BMAD
- **No breaking changes** to existing workflows
- Users can opt-in to new features
- All schema validation passing
- All linting/formatting passing
- All tests passing

---

## Contributing Back

These features are candidates for upstream contribution:

1. **Gap Analysis** - Solves a real problem with batch planning
2. **Story Pipeline v2.0** - Significant token savings
3. **Super-Dev Mode** - Quality enforcement

See `PR-DESCRIPTION.md` and `PR-STORY-PIPELINE.md` for prepared PR descriptions.

---

## Last Sync with Upstream

**Date:** 2026-01-07
**Upstream Commit:** `5c766577` (Add CNAME file)
**Merge Commit:** `9df79392`

**Latest Fork Changes:**
- **Date:** 2026-01-07
- **Commit:** `9bdf4894` (Critical complexity routing fixes)
- **Features:** Complexity-based routing v1.3.0, multi-agent review integration

To sync with upstream:
```bash
git fetch upstream
git merge upstream/main
```
