# super-dev-pipeline

**Token-efficient step-file workflow that prevents vibe coding and works for both greenfield AND brownfield development.**

## 🎯 Purpose

Combines the best of both worlds:
- **super-dev-story's flexibility** - works for greenfield and brownfield
- **story-pipeline's discipline** - step-file architecture prevents vibe coding

## 🔑 Key Features

### 1. **Smart Batching** ⚡ NEW!
- **Pattern detection**: Automatically identifies similar tasks
- **Intelligent grouping**: Batches low-risk, repetitive tasks
- **50-70% faster** for stories with repetitive work (e.g., package migrations)
- **Safety preserved**: Validation gates still enforced, fallback on failure
- **NOT vibe coding**: Systematic detection + batch validation

### 2. **Adaptive Implementation**
- Greenfield tasks: TDD approach (test-first)
- Brownfield tasks: Refactor approach (understand-first)
- Hybrid stories: Mix both as appropriate

### 3. **Anti-Vibe-Coding Architecture**
- **Step-file design**: One step at a time, no looking ahead
- **Mandatory sequences**: Can't skip or optimize steps
- **Quality gates**: Must pass before proceeding
- **State tracking**: Progress recorded and verified

### 4. **Brownfield Support**
- Pre-gap analysis scans existing code
- Validates tasks against current implementation
- Refines vague tasks to specific actions
- Detects already-completed work

### 5. **Complete Quality Gates**
- ✅ Pre-gap analysis (validates + detects batchable patterns)
- ✅ Smart batching (groups similar tasks, validates batches)
- ✅ Adaptive implementation (TDD or refactor)
- ✅ Post-validation (catches false positives)
- ✅ Code review (finds 3-10 issues)
- ✅ Commit + push (targeted files only)

## 📁 Workflow Steps

| Step | File | Purpose |
|------|------|---------|
| 1 | step-01-init.md | Load story, detect greenfield vs brownfield |
| 2 | step-02-pre-gap-analysis.md | Validate tasks against codebase |
| 3 | step-03-implement.md | Adaptive implementation (no vibe coding!) |
| 4 | step-04-post-validation.md | Verify completion vs reality |
| 5 | step-05-code-review.md | Adversarial review (3-10 issues) |
| 6 | step-06-complete.md | Commit and push changes |
| 7 | step-07-summary.md | Audit trail generation |

## 🚀 Usage

### Standalone
```bash
bmad super-dev-pipeline
```

### From autonomous-epic
```bash
bmad autonomous-epic
# Automatically uses super-dev-pipeline for each story
```

## 📊 Efficiency Metrics

| Metric | super-dev-story | super-dev-pipeline | super-dev-pipeline + batching |
|--------|----------------|-------------------|-------------------------------|
| Tokens/story | 100-150K | 40-60K | 40-60K (same) |
| Time/100 tasks | 200 min | 200 min | **100 min** (50% faster!) |
| Architecture | Orchestration | Step-files | Step-files + batching |
| Vibe coding | Possible | Prevented | Prevented |
| Repetitive work | Slow | Slow | **Fast** |

## 🛡️ Why This Prevents Vibe Coding

**The Problem:**
When token counts get high (>100K), Claude tends to:
- Skip verification steps
- Batch multiple tasks
- "Trust me, I got this" syndrome
- Deviate from intended workflow

**The Solution:**
Step-file architecture enforces:
- ✅ ONE step loaded at a time
- ✅ MUST read entire step file first
- ✅ MUST follow numbered sequence
- ✅ MUST complete quality gate
- ✅ MUST update state before proceeding

**Result:** Disciplined execution even at 200K+ tokens!

## 🔄 Comparison with Other Workflows

### vs super-dev-story (Original)
- ✅ Same quality gates
- ✅ Same brownfield support
- ✅ 50% more token efficient
- ✅ **Prevents vibe coding** (new!)

### vs story-pipeline
- ✅ Same step-file discipline
- ✅ **Works for brownfield** (story-pipeline doesn't!)
- ✅ No mandatory ATDD (more flexible)
- ✅ **Smart batching** (50-70% faster for repetitive work!)
- ❌ Slightly less token efficient (40-60K vs 25-30K)

## 🎓 When to Use

**Use super-dev-pipeline when:**
- Working with existing codebase (brownfield)
- Need vibe-coding prevention
- Running autonomous-epic
- Token counts will be high
- Want disciplined execution

**Use story-pipeline when:**
- Creating entirely new features (pure greenfield)
- Story doesn't exist yet (needs creation)
- Maximum token efficiency needed
- TDD/ATDD is appropriate

**Use super-dev-story when:**
- Need quick one-off development
- Interactive development preferred
- Traditional orchestration is fine

## 📝 Requirements

- Story file must exist (does NOT create stories)
- Project context must exist
- Works with both `_bmad` and `.bmad` conventions

## 🏗️ Architecture Notes

### Development Mode Detection

Auto-detects based on File List:
- **Greenfield**: All files are new
- **Brownfield**: All files exist
- **Hybrid**: Mix of new and existing

### Adaptive Implementation

Step 3 adapts methodology:
- New files → TDD approach
- Existing files → Refactor approach
- Tests → Add/update as needed
- Migrations → Apply and verify

### State Management

Uses `super-dev-state-{story_id}.yaml` for:
- Progress tracking
- Quality gate results
- File lists
- Metrics collection

Cleaned up after completion (audit trail is permanent record).

---

**super-dev-pipeline: Disciplined development for the real world!** 🚀
