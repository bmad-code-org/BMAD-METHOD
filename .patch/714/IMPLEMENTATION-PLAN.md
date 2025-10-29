# PR #714 Implementation Plan

**PR**: feat: add Kiro IDE support
**Issue**: #682 - Add Kiro IDE integration
**Status**: Implementation in progress
**Branch**: `feature/kiro-ide-714`
**Author**: mrsaifullah52

---

## 📋 Issue Summary

### Feature Request

Add support for Kiro IDE as a new IDE option in the BMAD installer. This includes:

1. Adding Kiro to the list of supported IDEs
2. Implementing Kiro IDE setup functionality
3. Adding Kiro configuration to the installer
4. Integrating Kiro into the interactive installer menu

### Kiro IDE Details

- **IDE Name**: Kiro IDE
- **Rule Directory**: `.kiro/steering/`
- **Format**: multi-file
- **Command Suffix**: `.md`
- **Integration Method**: Steering files with agent links

### Supported IDEs (Updated)

Before: cursor, claude-code, windsurf, trae, roo, kilo, cline, gemini, qwen-code, github-copilot, codex, codex-web, auggie-cli, iflow-cli, opencode, other
After: + **kiro** (in correct position alphabetically)

---

## 🎯 Solution Overview

### Files to Modify

1. **tools/installer/bin/bmad.js** (3 changes)
   - Update IDE list in command help text (add kiro)
   - Add 'Kiro IDE' option to interactive menu
   - Keep 'kilo' separate (Kilo Code)

2. **tools/installer/config/install.config.yaml** (10 additions)
   - Add kiro IDE configuration block
   - Define steering directory, format, command suffix
   - Add Kiro-specific instructions

3. **tools/installer/lib/ide-setup.js** (33 additions)
   - Implement `setupKiro()` function
   - Create steering files in `.kiro/steering/`
   - Create bmad.md with inclusion header
   - Generate agent links

---

## 🔧 Technical Details

### Change 1: bmad.js - Command Help Text (Line 52)

**Before**:

```text
'Configure for specific IDE(s) - can specify multiple (cursor, claude-code, windsurf, trae, roo, kilo, cline, gemini, ...)'
```

**After**:

```text
'Configure for specific IDE(s) - can specify multiple (cursor, claude-code, windsurf, trae, roo, kilo, kiro, cline, gemini, ...)'
```

### Change 2: bmad.js - Interactive Menu (Line 405)

**Add**: `{ name: 'Kiro IDE', value: 'kiro' },`
**Position**: After Kilo Code, before Cline

### Change 3: install.config.yaml - Kiro Configuration (Lines 11-20)

**New Section**:

```yaml
kiro:
  name: Kiro IDE
  rule-dir: .kiro/steering/
  format: multi-file
  command-suffix: .md
  instructions: |
    # To use BMad agents in Kiro IDE:
    # 1. The installer creates agent files in `.kiro/steering/`.
    # 2. The steering file `bmad.md` is always included.
    # 3. Type *agent-name (e.g., "*agent-dev", "*agent-pm") to activate the agent.
```

### Change 4: ide-setup.js - New setupKiro() Function (Lines 1394-1426)

**Functionality**:

1. Create `.kiro/steering/` directory
2. Get all agent IDs (or selected agent)
3. For each agent:
   - Find agent file path
   - Read agent content
   - Write to `.kiro/steering/{agentId}.md`
   - Create agent link for bmad.md
4. Create bmad.md with:
   - Inclusion header: `---\ninclusion: always\n---\n`
   - Introduction text about opening files
   - Links to all agent files

**Key Pattern**:

- Uses `fileManager` for I/O operations
- Uses `chalk` for console output (green checkmarks)
- Follows existing IDE setup patterns (see setupCline, setupKilocode)

---

## 📊 Implementation Phases

### Phase 1: Code Analysis ✅

- [x] Retrieve PR #714 details from GitHub
- [x] Get all modified files and patches
- [x] Understand Kiro IDE requirements
- [x] Identify all code changes needed

### Phase 2: Apply Changes 🔄

- [ ] Update tools/installer/bin/bmad.js (2 changes)
- [ ] Update tools/installer/config/install.config.yaml (1 block)
- [ ] Update tools/installer/lib/ide-setup.js (1 new function + 1 case statement)

### Phase 3: Validation

- [ ] Run npm validate
- [ ] Run npm lint
- [ ] Check for syntax errors
- [ ] Verify no regressions

### Phase 4: Documentation

- [ ] Create comprehensive diffs
- [ ] Create patch summary
- [ ] Document test results
- [ ] Create final status report

### Phase 5: Commit & GitHub

- [ ] Commit with proper message
- [ ] Post GitHub comment
- [ ] Mark ready for review

---

## ✅ Validation Checklist

### Pre-Commit Validation

- [ ] All 3 files modified correctly
- [ ] 45 lines added, 1 line deleted (as per PR)
- [ ] setupKiro() function complete
- [ ] npm validate: All configs pass
- [ ] npm lint: No new errors
- [ ] No syntax errors
- [ ] Changes match PR spec exactly

### Functionality Validation

- [ ] Kiro IDE added to help text
- [ ] Kiro in interactive menu
- [ ] Kiro config in install.config.yaml
- [ ] setupKiro() handles agent setup
- [ ] Steering directory structure correct
- [ ] bmad.md created with correct headers

### Post-Commit Validation

- [ ] Commits with proper message
- [ ] Branch ready for merge
- [ ] Documentation comprehensive
- [ ] All tests passing

---

## 🎓 Key Points

1. **Feature Type**: IDE Integration
2. **Scope**: Medium - 3 files, 45 additions
3. **Complexity**: Moderate - new setupKiro() function
4. **Impact**: Extends IDE support list
5. **Backward Compatible**: Yes - only additions
6. **Risk Level**: Low - follows existing patterns

### Related IDE Implementations

- **Cursor**: WebStorm-style rule files
- **Claude Code**: Similar to Cursor
- **Cline**: MCP server integration
- **Kilo Code**: Multi-file setup
- **Kiro**: Multi-file steering (similar to Kilo, but with inclusion header)

---

## 📝 Related Files

- `tools/installer/bin/bmad.js` - CLI interface
- `tools/installer/config/install.config.yaml` - Configuration
- `tools/installer/lib/ide-setup.js` - IDE setup logic
- `tools/installer/lib/file-manager.js` - File I/O utilities
- `tools/installer/lib/base-ide-setup.js` - Base class reference

---

## 🔍 Pattern References

### File Structure

- Similar to: `setupKilocode()` and `setupCline()`
- Pattern: Create directory → Get agents → Write files → Create index
- Console output: Use chalk for colored output

### Configuration Pattern

From install.config.yaml:

```yaml
ide-name:
  name: Display Name
  rule-dir: .ide/path/
  format: single-file|multi-file
  command-suffix: .md|.txt
  instructions: |
    Instructions for users
```

---

**Next Steps**: Apply changes to the three files and validate
