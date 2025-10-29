# Quick Reference - Issue #477 Fix

## 📋 Document Overview

| Document                   | Size   | Purpose                                       |
| -------------------------- | ------ | --------------------------------------------- |
| **README.md**              | 11.4KB | Start here - complete overview and navigation |
| **IMPLEMENTATION-PLAN.md** | 7.5KB  | Detailed 7-phase implementation roadmap       |
| **TODO.md**                | 12.8KB | Actionable task checklist with priorities     |
| **TEST-SPECIFICATIONS.md** | 27.4KB | Comprehensive test strategy and scenarios     |
| **issue-desc-477.md**      | 5.0KB  | Original GitHub issue context                 |
| **PLAN.md**                | 5.9KB  | Original outline (reference)                  |

**Total**: 70KB of detailed documentation

---

## 🚀 Quick Start

### Step 1: Understand the Problem (5 min)

Read the **Quick Summary** section in README.md:

- What's wrong
- Example of the bug
- Root cause
- Expected behavior

### Step 2: Review the Solution (10 min)

Review **Solution Overview** in README.md:

- 5-component architecture
- How it fixes the problem
- Key files to modify

### Step 3: Start Phase 1 (2 hours)

Open TODO.md and begin Phase 1: Code Analysis

- Task 1.1: Examine Install Command Entry Point
- Task 1.2: Map All Configuration Questions
- Task 1.3: Understand Current Manifest Usage

---

## 🎯 Success Criteria

The fix is complete when ALL of these are true:

1. ✅ No configuration questions asked during update
2. ✅ Existing settings preserved from `install-manifest.yaml`
3. ✅ Version detection still works (shows update available)
4. ✅ Files properly updated without re-asking
5. ✅ All IDE configurations preserved
6. ✅ All expansion packs preserved
7. ✅ Backward compatible with old installations
8. ✅ Graceful fallback on corrupted manifest
9. ✅ Comprehensive test coverage
10. ✅ Documentation updated

---

## 📦 What Gets Changed

### Files to Modify (5)

- `tools/cli/commands/install.js` - Add update detection, config loading
- `tools/cli/lib/config.js` - Add manifest loading methods
- `tools/cli/installers/lib/core/installer.js` - Add mode detection
- `tools/cli/installers/lib/core/manifest.js` - Add validation
- All prompt functions in `tools/cli/installers/lib/` - Add skipping logic

### Files to Create (1-2)

- `tools/cli/lib/config-loader.js` - New configuration loader
- `test/` - New test files (10+ test files)

### No Breaking Changes

- Backward compatible with old manifest formats
- Graceful handling of missing fields
- Safe fallback to fresh install if needed

---

## 📊 Effort Breakdown

```
Phase 1: Code Analysis          2 hours (understand current code)
Phase 2: Configuration Loading  3 hours (build config loader)
Phase 3: Update Detection       3 hours (add version detection)
Phase 4: Question Skipping      4 hours (skip questions on update)
Phase 5: Validation             2 hours (error handling)
Phase 6: Integration & Testing  4 hours (test and validate)
Phase 7: Documentation & Release 2 hours (docs and PR)
────────────────────────────────────
TOTAL:                          20 hours
```

**Recommended**: 2-4 hour work sessions, one phase per session

---

## 🧪 Testing Strategy

| Category             | Count  | Time           |
| -------------------- | ------ | -------------- |
| Unit Tests           | 12     | ~30 min        |
| Integration Tests    | 8      | ~45 min        |
| End-to-End Scenarios | 6      | ~60 min        |
| Manual Tests         | 8      | ~90 min        |
| **TOTAL**            | **34** | **~3.5 hours** |

All tests run automatically - just follow the test plan in TEST-SPECIFICATIONS.md

---

## 🎓 Key Concepts

### Update Detection

```
No manifest file → FRESH INSTALL (ask all questions)
Manifest exists:
  - Version changed → UPDATE (skip questions)
  - Version same → REINSTALL (skip questions)
  - Invalid manifest → treat as FRESH (ask all questions)
```

### Configuration Flow

```
1. User runs: npx bmad-method install
2. System checks for existing manifest
3. If update/reinstall detected:
   - Load previous configuration
   - Skip all configuration questions
   - Use cached values
4. If fresh install:
   - Ask all questions
   - Store answers in manifest
5. Proceed with installation
```

### Error Handling

```
Error in manifest loading/validation:
  1. Log warning to user
  2. Treat as fresh install
  3. Ask all questions
  4. Create new manifest
  5. Never corrupt existing manifest
```

---

## 🔗 File Dependencies

```
Phase 1: Analysis (standalone)
  ↓
Phase 2: Config Loading (depends on Phase 1)
  ↓
Phase 3: Update Detection (depends on Phase 2)
  ↓
Phase 4: Question Skipping (depends on Phase 3)
  ↓
Phase 5: Validation (depends on Phase 2)
  ↓
Phase 6: Testing (depends on Phase 4 & 5)
  ↓
Phase 7: Documentation (depends on Phase 6)
```

**Critical Path**: 1→2→3→4→6→7

---

## 💡 Pro Tips

### Before Starting

1. Read README.md completely (15 minutes)
2. Skim IMPLEMENTATION-PLAN.md (10 minutes)
3. Skim TEST-SPECIFICATIONS.md (5 minutes)
4. Understand the 5-component solution

### During Implementation

1. Follow TODO.md checklist strictly
2. Check off items as completed
3. Create tests BEFORE implementing (TDD)
4. Commit after each phase
5. Run tests frequently

### After Each Phase

1. Run unit tests: `npm test -- test/unit/ --verbose`
2. Review code for clarity
3. Add comments explaining logic
4. Commit with phase number: `git commit -m "feat(#477): Phase X - Name"`

### Before PR

1. All tests pass locally
2. No console logs or debug code
3. Documentation updated
4. Backward compatibility verified
5. Manual testing completed

---

## 🛠 Useful Commands

```bash
# Check current branch
git branch --show-current

# View status
git status

# View specific file changes
git diff tools/cli/commands/install.js

# Run all tests
npm test

# Run unit tests only
npm test -- test/unit/ --verbose

# Run integration tests only
npm test -- test/integration/ --verbose

# Create a commit for current phase
git commit -m "feat(#477): Phase X - [phase-name]"

# Push to remote
git push origin fix/477-installer-update-config

# View TODO checklist
cat ".patch/477/TODO.md" | grep "^\- \[ \]" | wc -l
```

---

## 📍 Current Status

✅ **Planning Complete**

- All documentation created
- Solution architected
- Test strategy defined
- Task list ready

⏳ **Next: Phase 1 - Code Analysis**

- Open TODO.md
- Start at Task 1.1
- Estimate: 2 hours

⏭ **After Phase 1**: Phase 2 - Configuration Loading (3 hours)

---

## ⚠️ Important Notes

1. **Stay in Branch**: All work must be in `fix/477-installer-update-config`
2. **Test First**: Create tests before implementing (TDD approach)
3. **No Breaking Changes**: Must be backward compatible
4. **Graceful Fallback**: Never fail silently, always provide options
5. **Comprehensive Testing**: 34 test scenarios - don't skip any
6. **Documentation**: Update README and add code comments

---

## 🎯 Definition of Done

A phase is "done" when:

- [ ] All tasks marked complete in TODO.md
- [ ] Code written and committed
- [ ] All tests passing (unit, integration, or e2e as applicable)
- [ ] No console errors or warnings
- [ ] Code reviewed for quality
- [ ] Documentation updated
- [ ] Next phase ready to start

---

## 📞 Troubleshooting

### Can't find manifest file?

See: TEST-SPECIFICATIONS.md → Test Fixtures Setup

### Not sure what to test?

See: TEST-SPECIFICATIONS.md → Specific Test Suite

### Need implementation details?

See: IMPLEMENTATION-PLAN.md → Specific Phase

### Need context on the issue?

See: issue-desc-477.md or README.md → Problem Statement

### Unsure about architecture?

See: README.md → Solution Overview

---

## 🚀 Ready to Start?

1. Open **TODO.md**
2. Go to **Phase 1, Task 1.1**
3. Follow the checklist
4. Mark items ✓ as completed
5. Commit frequently
6. Refer back to these docs as needed

**Estimated Completion: 20 hours**
**Start Time: Now**
**Good Luck! 🎉**
