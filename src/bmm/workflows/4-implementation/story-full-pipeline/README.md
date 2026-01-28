# Super-Dev Pipeline - GSDMAD Architecture

**Multi-agent pipeline with independent validation and adversarial code review**

---

## Quick Start

```bash
# Run super-dev pipeline for a story
/story-full-pipeline story_key=17-10
```

---

## Architecture

### Multi-Agent Validation
- **4 independent agents** working sequentially
- Builder → Inspector → Reviewer → Fixer
- Each agent has fresh context
- No conflict of interest

### Honest Reporting
- Inspector verifies Builder's work (doesn't trust claims)
- Reviewer is adversarial (wants to find issues)
- Main orchestrator does final verification
- Can't fake completion

### Wave-Based Execution
- Independent stories run in parallel
- Dependencies respected via waves
- 57% faster than sequential execution

---

## Workflow Phases

**Phase 1: Builder (Steps 1-4)**
- Load story, analyze gaps
- Write tests (TDD)
- Implement code
- Report what was built (NO VALIDATION)

**Phase 2: Inspector (Steps 5-6)**
- Fresh context, no Builder knowledge
- Verify files exist
- Run tests independently
- Run quality checks
- PASS or FAIL verdict

**Phase 3: Reviewer (Step 7)**
- Fresh context, adversarial stance
- Find security vulnerabilities
- Find performance problems
- Find logic bugs
- Report issues with severity

**Phase 4: Fixer (Steps 8-9)**
- Fix CRITICAL issues (all)
- Fix HIGH issues (all)
- Fix MEDIUM issues (time permitting)
- Verify fixes independently

**Phase 5: Final Verification**
- Main orchestrator verifies all phases
- Updates story checkboxes
- Creates commit
- Marks story complete

---

## Key Features

**Separation of Concerns:**
- Builder focuses only on implementation
- Inspector focuses only on validation
- Reviewer focuses only on finding issues
- Fixer focuses only on resolving issues

**Independent Validation:**
- Each agent validates the previous agent's work
- No agent validates its own work
- Fresh context prevents confirmation bias

**Quality Enforcement:**
- Multiple quality gates throughout pipeline
- Can't proceed without passing validation
- 95% honesty rate (agents can't fake completion)

---

## Files

See `workflow.md` for complete architecture details.

**Agent Prompts:**
- `agents/builder.md` - Implementation agent
- `agents/inspector.md` - Validation agent
- `agents/reviewer.md` - Adversarial review agent
- `agents/fixer.md` - Issue resolution agent

**Workflow Config:**
- `workflow.yaml` - Main configuration
- `workflow.md` - Complete documentation

**Directory Structure:**
```
story-full-pipeline/
├── README.md (this file)
├── workflow.yaml (configuration)
├── workflow.md (complete documentation)
├── agents/
│   ├── builder.md (implementation agent prompt)
│   ├── inspector.md (validation agent prompt)
│   ├── reviewer.md (review agent prompt)
│   └── fixer.md (fix agent prompt)
└── steps/
    └── (step files for each phase)
```

---

**Philosophy:** Trust but verify. Every agent's work is independently validated by a fresh agent with no conflict of interest.
