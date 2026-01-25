# IDE Installer Standardization Plan

## Overview

Standardize IDE installers to use **flat file naming** with **underscores** (Windows-compatible) and centralize duplicated code in shared utilities.

**Key Rule: All IDEs use underscore format for Windows compatibility (colons don't work on Windows).**

## Current State Analysis

### File Structure Patterns

| IDE | Current Pattern | Path Format |
|-----|-----------------|-------------|
| **claude-code** | Hierarchical | `.claude/commands/bmad/{module}/agents/{name}.md` |
| **cursor** | Hierarchical | `.cursor/commands/bmad/{module}/agents/{name}.md` |
| **crush** | Hierarchical | `.crush/commands/bmad/{module}/agents/{name}.md` |
| **antigravity** | Flattened (underscores) | `.agent/workflows/bmad_module_agents_name.md` |
| **codex** | Flattened (underscores) | `~/.codex/prompts/bmad_module_agents_name.md` |
| **cline** | Flattened (underscores) | `.clinerules/workflows/bmad_module_type_name.md` |
| **roo** | Flattened (underscores) | `.roo/commands/bmad_module_agent_name.md` |
| **auggie** | Hybrid | `.augment/commands/bmad/agents/{module}-{name}.md` |
| **iflow** | Hybrid | `.iflow/commands/bmad/agents/{module}-{name}.md` |
| **trae** | Different (rules) | `.trae/rules/bmad-agent-{module}-{name}.md` |
| **github-copilot** | Different (agents) | `.github/agents/bmd-custom-{module}-{name}.agent.md` |

### Shared Generators (in `/shared`)

1. `agent-command-generator.js` - generates agent launchers
2. `task-tool-command-generator.js` - generates task/tool commands
3. `workflow-command-generator.js` - generates workflow commands

All currently create artifacts with **nested relative paths** like `{module}/agents/{name}.md`

### Code Duplication Issues

1. **Flattening logic** duplicated in multiple IDEs
2. **Agent launcher content creation** duplicated
3. **Path transformation** duplicated

## Target Standardization

### For All IDEs (underscore format - Windows-compatible)

**IDEs affected:** claude-code, cursor, crush, antigravity, codex, cline, roo

```
Format: bmad_{module}_{type}_{name}.md

Examples:
- Agent:      bmad_bmm_agents_pm.md
- Agent:      bmad_core_agents_dev.md
- Workflow:   bmad_bmm_workflows_correct-course.md
- Task:       bmad_bmm_tasks_bmad-help.md
- Tool:       bmad_core_tools_code-review.md
- Custom:     bmad_custom_agents_fred-commit-poet.md
```

**Note:** Type segments (agents, workflows, tasks, tools) are filtered out from names:
- `bmm/agents/pm.md` → `bmad_bmm_pm.md` (not `bmad_bmm_agents_pm.md`)

### For Hybrid IDEs (keep as-is)

**IDEs affected:** auggie, iflow

These use `{module}-{name}.md` format within subdirectories - keep as-is.

### Skip (drastically different)

**IDEs affected:** trae, github-copilot

## Implementation Plan

### Phase 1: Create Shared Utility

**File:** `shared/path-utils.js`

```javascript
/**
 * Convert hierarchical path to flat underscore-separated name (Windows-compatible)
 * @param {string} module - Module name (e.g., 'bmm', 'core')
 * @param {string} type - Artifact type ('agents', 'workflows', 'tasks', 'tools') - filtered out
 * @param {string} name - Artifact name (e.g., 'pm', 'correct-course')
 * @returns {string} Flat filename like 'bmad_bmm_pm.md'
 */
function toUnderscoreName(module, type, name) {
  return `bmad_${module}_${name}.md`;
}

/**
 * Convert relative path to flat underscore-separated name (Windows-compatible)
 * @param {string} relativePath - Path like 'bmm/agents/pm.md'
 * @returns {string} Flat filename like 'bmad_bmm_pm.md'
 */
function toUnderscorePath(relativePath) {
  const withoutExt = relativePath.replace('.md', '');
  const parts = withoutExt.split(/[\/\\]/);
  // Filter out type segments (agents, workflows, tasks, tools)
  const filtered = parts.filter((p) => !TYPE_SEGMENTS.includes(p));
  return `bmad_${filtered.join('_')}.md`;
}

/**
 * Create custom agent underscore name
 * @param {string} agentName - Custom agent name
 * @returns {string} Flat filename like 'bmad_custom_fred-commit-poet.md'
 */
function customAgentUnderscoreName(agentName) {
  return `bmad_custom_${agentName}.md`;
}

// Backward compatibility aliases
const toColonName = toUnderscoreName;
const toColonPath = toUnderscorePath;
const toDashPath = toUnderscorePath;
const customAgentColonName = customAgentUnderscoreName;
const customAgentDashName = customAgentUnderscoreName;

module.exports = {
  toUnderscoreName,
  toUnderscorePath,
  customAgentUnderscoreName,
  // Backward compatibility
  toColonName,
  toColonPath,
  toDashPath,
  customAgentColonName,
  customAgentDashName,
};
```

### Phase 2: Update Shared Generators

**Files to modify:**
- `shared/agent-command-generator.js`
- `shared/task-tool-command-generator.js`
- `shared/workflow-command-generator.js`

**Changes:**
1. Import path utilities
2. Change `relativePath` to use flat format
3. Add method `writeColonArtifacts()` for folder-based IDEs (uses underscore)
4. Add method `writeDashArtifacts()` for flat IDEs (uses underscore)

### Phase 3: Update All IDEs

**Files to modify:**
- `claude-code.js`
- `cursor.js`
- `crush.js`
- `antigravity.js`
- `codex.js`
- `cline.js`
- `roo.js`

**Changes:**
1. Import utilities from path-utils
2. Change from hierarchical to flat underscore naming
3. Update cleanup to handle flat structure (`startsWith('bmad')`)

### Phase 4: Update Base Class

**File:** `_base-ide.js`

**Changes:**
1. Mark `flattenFilename()` as `@deprecated`
2. Add comment pointing to new path-utils

## Migration Checklist

### New Files
- [x] Create `shared/path-utils.js`

### All IDEs (convert to underscore format)
- [x] Update `shared/agent-command-generator.js` - update for underscore
- [x] Update `shared/task-tool-command-generator.js` - update for underscore
- [x] Update `shared/workflow-command-generator.js` - update for underscore
- [x] Update `claude-code.js` - convert to underscore format
- [x] Update `cursor.js` - convert to underscore format
- [x] Update `crush.js` - convert to underscore format
- [ ] Update `antigravity.js` - use underscore format
- [ ] Update `codex.js` - use underscore format
- [ ] Update `cline.js` - use underscore format
- [ ] Update `roo.js` - use underscore format

### CSV Command Files
- [x] Update `src/core/module-help.csv` - change colons to underscores
- [x] Update `src/bmm/module-help.csv` - change colons to underscores

### Base Class
- [ ] Update `_base-ide.js` - add deprecation notice

### Testing
- [ ] Test claude-code installation
- [ ] Test cursor installation
- [ ] Test crush installation
- [ ] Test antigravity installation
- [ ] Test codex installation
- [ ] Test cline installation
- [ ] Test roo installation

## Notes

1. **Filter type segments**: agents, workflows, tasks, tools are filtered out from flat names
2. **Underscore format**: Universal underscore format for Windows compatibility
3. **Custom agents**: Follow the same pattern as regular agents
4. **Backward compatibility**: Old function names kept as aliases
5. **Cleanup**: Will remove old `bmad:` format files on next install
