# TODO: Workflow Tests

**Status:** No tests exist for workflow execution
**Priority:** HIGH
**Blocking:** No (pre-existing issue)

---

## Missing Test Coverage

### Workflows Without Tests:
1. **batch-super-dev** - Interactive story selector
2. **super-dev-pipeline** - Story implementation pipeline
3. **super-dev-pipeline** - Multi-agent pipeline
4. **create-story** - Lightweight story creation
5. **create-story-with-gap-analysis** - Story with codebase scan

### What Should Be Tested:

**batch-super-dev:**
- [ ] Step order (sprint-status → display → select → validate → create → execute)
- [ ] Backlog story handling (marks for creation)
- [ ] Ready-for-dev story handling
- [ ] Story selection parsing (ranges, commas, "all")
- [ ] Complexity scoring logic
- [ ] Execution mode selection
- [ ] Batch story creation (Step 2.7)

**super-dev-pipeline:**
- [ ] Step execution order
- [ ] Gap analysis detection (greenfield vs brownfield)
- [ ] Quality gate enforcement (type-check, lint, build, tests)
- [ ] Story checkbox updates
- [ ] Sprint-status updates
- [ ] Commit creation

**super-dev-pipeline:**
- [ ] Multi-agent spawning (builder, inspector, reviewer, fixer)
- [ ] Fresh context per agent
- [ ] Independent validation
- [ ] Final verification checks

---

## Test Strategy

### Unit Tests
Test individual step logic:
- Story file parsing
- Complexity scoring algorithm
- Checkbox counting
- Sprint-status parsing

### Integration Tests
Test workflow execution:
- Mock file system
- Verify step order
- Check output files created
- Verify git commits

### End-to-End Tests
Test full workflow:
- Real story files
- Actual codebase
- Verify implementation quality

---

## Implementation Plan

**Phase 1: Unit Tests** (1 week)
- Test complexity scoring
- Test story validation
- Test file parsing

**Phase 2: Integration Tests** (1 week)
- Mock workflow execution
- Verify step order
- Check outputs

**Phase 3: E2E Tests** (1 week)
- Full workflow execution
- Real story implementation
- Quality verification

---

**Note:** Current test failures (56 failing tests) are in `dependency-resolver` tests, unrelated to workflow changes. Those should be fixed separately.
