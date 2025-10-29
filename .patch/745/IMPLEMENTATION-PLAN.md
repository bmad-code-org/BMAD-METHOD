# PR #745 Implementation Plan

**PR**: Feat/claude code marketplace plugin
**Issue**: N/A (Feature request)
**Status**: Planning phase
**Branch**: `feature/claude-code-marketplace-plugin-745`
**Author**: amdmax

---

## 📋 Issue Summary

### Feature Request

Add BMAD as a Claude Code marketplace plugin to enable users to install BMAD directly from Claude Code's marketplace. This allows easier access to BMAD agents and workflows for Claude Code users.

### Key Requirements

- Claude Code marketplace plugin configuration
- Support for BMAD core framework
- Support for all 5 expansion packs:
  - Godot Game Dev
  - 2D Phaser Game Dev
  - 2D Unity Game Dev
  - Creative Writing
  - Infrastructure DevOps
- Proper metadata and categorization
- Agent and operation (task) definitions

---

## 🎯 Solution Overview

### File to Create

1. **`.claude-plugin/marketplace.json`** (307 lines)
   - Claude Code marketplace plugin manifest
   - Contains plugin metadata, owner info, agents, operations for each plugin
   - Includes BMAD core + 5 expansion packs

### File Structure

The marketplace.json file contains:

**Top-level Structure**:

- `name`: "bmad-method"
- `metadata`: Plugin description
- `owner`: Organization info
- `plugins`: Array of 6 plugins (core + 5 expansions)

**Each Plugin Contains**:

- `name`: Plugin identifier
- `source`: Path to plugin files
- `description`: User-friendly description
- `version`: Plugin version
- `author`: Creator info
- `homepage`, `repository`, `license`: Reference URLs
- `agents`: Array of agent file paths
- `operations`: Array of operation/task file paths
- `keywords`: Search keywords
- `category`: Plugin category
- `tags`: Classification tags
- `requires`: Dependency list (for expansion packs)

---

## 📊 Plugins Included

### 1. bmad-core

**Path**: `./bmad-core`
**Version**: 4.44.0
**Agents** (10):

- analyst.md
- architect.md
- bmad-master.md
- bmad-orchestrator.md
- dev.md
- pm.md
- po.md
- qa.md
- sm.md
- ux-expert.md

**Operations** (21 tasks):

- advanced-elicitation.md
- apply-qa-fixes.md
- brownfield-create-epic.md
- brownfield-create-story.md
- correct-course.md
- create-brownfield-story.md
- create-deep-research-prompt.md
- create-next-story.md
- document-project.md
- facilitate-brainstorming-session.md
- generate-ai-frontend-prompt.md
- index-docs.md
- kb-mode-interaction.md
- nfr-assess.md
- qa-gate.md
- review-story.md
- risk-profile.md
- shard-doc.md
- test-design.md
- trace-requirements.md
- validate-next-story.md

### 2. bmad-godot-game-dev

**Path**: `./expansion-packs/bmad-godot-game-dev`
**Version**: 1.0.0
**Requires**: bmad-core
**Agents** (10 game development specialists)
**Operations** (21 game-specific tasks)

### 3. bmad-2d-phaser-game-dev

**Path**: `./expansion-packs/bmad-2d-phaser-game-dev`
**Version**: 1.0.0
**Requires**: bmad-core
**Agents** (3: game-designer, game-developer, game-sm)
**Operations** (3 tasks)

### 4. bmad-2d-unity-game-dev

**Path**: `./expansion-packs/bmad-2d-unity-game-dev`
**Version**: 1.0.0
**Requires**: bmad-core
**Agents** (4: game-architect, game-designer, game-developer, game-sm)
**Operations** (5 tasks)

### 5. bmad-creative-writing

**Path**: `./expansion-packs/bmad-creative-writing`
**Version**: 1.1.1
**Requires**: bmad-core
**Agents** (10 writing specialists)
**Operations** (25 writing workflow tasks)

### 6. bmad-infrastructure-devops

**Path**: `./expansion-packs/bmad-infrastructure-devops`
**Version**: 1.12.0
**Requires**: bmad-core
**Agents** (1: infra-devops-platform.md)
**Operations** (2: review-infrastructure, validate-infrastructure)

---

## 📝 Implementation Phases

### Phase 1: Code Analysis ✅

- [x] Retrieve PR #745 details from GitHub
- [x] Get the marketplace.json file content
- [x] Understand structure and requirements
- [x] Identify all plugins and their definitions

### Phase 2: File Creation 🔄

- [ ] Create `.claude-plugin/` directory
- [ ] Create `marketplace.json` file with complete content
- [ ] Verify JSON syntax is valid
- [ ] Verify all paths are correct

### Phase 3: Validation

- [ ] Run npm validate
- [ ] Validate JSON structure
- [ ] Check file paths exist
- [ ] Verify no syntax errors

### Phase 4: Testing

- [ ] Run npm lint
- [ ] Check for linting errors
- [ ] Verify backward compatibility
- [ ] No regressions

### Phase 5: Documentation

- [ ] Create TEST-RESULTS.md
- [ ] Create patch files
- [ ] Create comprehensive documentation
- [ ] Final status report

### Phase 6: Commit & GitHub

- [ ] Commit with proper message
- [ ] Post GitHub comment with results

---

## ✅ Validation Checklist

### Pre-Commit Validation

- [ ] `.claude-plugin/marketplace.json` created
- [ ] JSON is valid and parseable
- [ ] 307 lines total
- [ ] All 6 plugins defined
- [ ] All agent paths correct
- [ ] All operation/task paths correct
- [ ] npm validate: Pass
- [ ] npm lint: No errors
- [ ] No new warnings

### Functionality Validation

- [ ] BMAD core plugin properly defined
- [ ] All 5 expansion packs included
- [ ] Plugin dependencies correct
- [ ] Agent file references valid
- [ ] Operation/task file references valid
- [ ] Metadata complete
- [ ] Keywords and tags present

### Post-Commit Validation

- [ ] Commits with proper message
- [ ] Branch ready for merge
- [ ] Documentation comprehensive
- [ ] All tests passing

---

## 🎓 Key Points

1. **File Type**: JSON configuration file
2. **Purpose**: Claude Code marketplace plugin manifest
3. **Scope**: Single file, 307 lines
4. **Complexity**: Low (configuration file, not code)
5. **Impact**: Enables marketplace distribution
6. **Backward Compatible**: Yes - only additions
7. **Risk Level**: Very low - configuration only

---

## 📚 Reference Files

- PR #745: https://github.com/bmad-code-org/BMAD-METHOD/pull/745
- Claude Code Marketplace: https://marketplace.claude.ai/
- Plugin Format: Claude Code plugin specification

---

## 🔍 Related Information from Previous PRs

From `.patch` folders:

- PR #714 (Kiro IDE): IDE integration pattern
- PR #667 (Status terminology): Minor fixes pattern
- PR #648 (Cursor rules): Configuration pattern

---

**Next Steps**: Create `.claude-plugin/marketplace.json` file and validate
