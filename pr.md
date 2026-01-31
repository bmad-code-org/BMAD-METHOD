## Summary

This PR fixes bugs affecting task/tool installation across IDEs:

1. **CRLF Line Ending Bug** - Frontmatter parsing failed on Windows due to CRLF (`\r\n`) line endings
2. **Gemini CLI TOML Support** - Tasks/tools were generated as `.md` files instead of `.toml` for Gemini CLI
3. **File Extension Preservation** - `.xml` task/tool files had incorrect paths (hardcoded `.md`)

## Problem

### Issue 1: Tasks not installed on Windows
The manifest generator's regex `^---\n` expected LF-only line endings, but Windows files have CRLF. This caused:
- YAML frontmatter parsing to silently fail
- All `.md` tasks defaulting to `standalone: false`
- Tasks like `bmad-help` not being installed despite having `standalone: true` in their frontmatter

### Issue 2: Gemini CLI incompatibility
The `TaskToolCommandGenerator` hardcoded markdown format for all IDEs, but Gemini CLI requires TOML format. Agents and workflows already used the template system correctly, but tasks/tools did not.

### Issue 3: Incorrect file extensions in paths
The `relativePath` property was hardcoded to `.md`, so tasks/tools with `.xml` extension got incorrect paths like `bmm/tasks/foo.md` instead of `bmm/tasks/foo.xml`.

## Solution

### Fix 1: CRLF-aware regex (4 files)
Changed frontmatter regex from `^---\n` to `^---\r?\n` to handle both Windows (CRLF) and Unix (LF) line endings.

**Files modified:**
- `tools/cli/installers/lib/core/manifest-generator.js` (3 occurrences)
- `tools/cli/installers/lib/core/dependency-resolver.js` (1 occurrence)

### Fix 2: Template-based task/tool generation
Extended the existing template system (used by agents/workflows) to also handle tasks/tools.

**New files:**
- `tools/cli/installers/lib/ide/templates/combined/gemini-task.toml`
- `tools/cli/installers/lib/ide/templates/combined/gemini-tool.toml`
- `tools/cli/installers/lib/ide/templates/combined/default-task.md`
- `tools/cli/installers/lib/ide/templates/combined/default-tool.md`

**Modified files:**
- `tools/cli/installers/lib/ide/shared/task-tool-command-generator.js`
  - Added `collectTaskToolArtifacts()` method
  - Added constructor with `bmadFolderName` parameter
- `tools/cli/installers/lib/ide/_config-driven.js`
  - Added `writeTaskToolArtifacts()` method with `artifact_types` filtering
  - Updated `installToTarget()` to use template system
  - Updated `renderTemplate()` to handle task/tool paths

### Fix 3: File extension preservation (4d7ca00)
The `relativePath` property was hardcoded to `.md` extension, causing incorrect paths for `.xml` task/tool files.

**Modified files:**
- `tools/cli/installers/lib/ide/shared/task-tool-command-generator.js`
  - Extract actual extension from source path with `.md` fallback
  - Fixed misleading comments ("underscore format" → "dash format")
- `tools/cli/installers/lib/ide/templates/combined/gemini-task.toml`
  - Fixed branding: "BMad" → "BMAD"
- `tools/cli/installers/lib/ide/templates/combined/gemini-tool.toml`
  - Fixed branding: "BMad" → "BMAD"

## Test Plan

- [x] Windows install (CMD) - tasks installed with correct frontmatter parsing
- [x] WSL/Linux install - tasks installed correctly
- [x] Gemini CLI generates `.toml` files for tasks/tools
- [x] Claude Code generates `.md` files for tasks/tools
- [x] All other IDEs (Cursor, Windsurf, Trae, etc.) generate `.md` files
- [x] `bmad-help` task now correctly has `standalone: true` in manifest
- [x] Existing agent/workflow installation unaffected
- [x] `.xml` tasks/tools get correct extension in `relativePath`

## Breaking Changes

None - this is purely a bug fix. Existing installations will work correctly after reinstall.

---

Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
