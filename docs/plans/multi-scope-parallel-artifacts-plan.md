---
title: 'Multi-Scope Parallel Artifacts System - Implementation Plan'
description: 'Implementation plan for the multi-scope parallel artifact system'
---

# Multi-Scope Parallel Artifacts System - Implementation Plan

> **Status:** Planning Complete  
> **Created:** 2026-01-21  
> **Last Updated:** 2026-01-21  
> **Estimated Effort:** 17-22 days

## Executive Summary

This plan outlines the implementation of a **multi-scope parallel artifact system** for BMAD that enables:

- Running multiple workflows in parallel across different terminal sessions
- Each session works on a different sub-product (scope) with isolated artifacts
- Shared knowledge layer with bidirectional synchronization
- Event-based updates when dependencies change
- Strict write isolation with liberal read access

---

## Table of Contents

1. [Key Design Decisions](#key-design-decisions)
2. [Architecture Overview](#architecture-overview)
3. [Phase 0: Git Hooks (This Repo)](#phase-0-git-hooks-this-repo)
4. [Phase 1: Scope Foundation](#phase-1-scope-foundation)
5. [Phase 2: Variable Resolution](#phase-2-variable-resolution)
6. [Phase 3: Isolation & Locking](#phase-3-isolation--locking)
7. [Phase 4: Sync System](#phase-4-sync-system)
8. [Phase 5: Event System](#phase-5-event-system)
9. [Phase 6: IDE Integration & Documentation](#phase-6-ide-integration--documentation)
10. [Risk Mitigation](#risk-mitigation)
11. [Success Criteria](#success-criteria)

---

## Key Design Decisions

| Decision                     | Choice                    | Rationale                                                                         |
| ---------------------------- | ------------------------- | --------------------------------------------------------------------------------- |
| **Sprint-status handling**   | Per-scope                 | Each scope has independent sprint planning, no parallel conflicts                 |
| **Project-context location** | Both (global + per-scope) | Global "bible" in `_shared/`, optional scope-specific that extends                |
| **Scope vs Module**          | Different concepts        | Module = code organization (bmm/core), Scope = artifact isolation (auth/payments) |
| **Cross-scope access**       | Read any, write own       | Liberal reads for dependency awareness, strict writes for isolation               |
| **Test directories**         | Scoped                    | `{output_folder}/{scope}/tests` for full isolation                                |
| **Workflow updates**         | Automated script          | Handle 22+ workflow.yaml files programmatically                                   |
| **File locking**             | proper-lockfile npm       | Battle-tested, cross-platform locking                                             |
| **Git hooks**                | This repo only            | For contributor workflow, NOT installed with bmad                                 |
| **Migration strategy**       | Auto-migrate to 'default' | Existing artifacts move to default scope automatically                            |
| **Scope ID format**          | Strict                    | Lowercase alphanumeric + hyphens only                                             |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        BMAD MULTI-SCOPE ARCHITECTURE                          │
│                                                                               │
│  MODULE (code organization)          SCOPE (artifact isolation)               │
│  ─────────────────────────           ────────────────────────                │
│  src/core/                           _bmad-output/auth/                       │
│  src/bmm/                            _bmad-output/payments/                   │
│  (installed to _bmad/)               _bmad-output/catalog/                    │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  DIRECTORY STRUCTURE (After Implementation):                                  │
│                                                                               │
│  project-root/                                                                │
│  ├── _bmad/                           # BMAD installation                     │
│  │   ├── _config/                                                            │
│  │   │   ├── scopes.yaml              # NEW: Scope registry                  │
│  │   │   ├── manifest.yaml                                                   │
│  │   │   └── ides/                                                           │
│  │   ├── _events/                     # NEW: Event system                    │
│  │   │   ├── event-log.yaml                                                  │
│  │   │   └── subscriptions.yaml                                              │
│  │   ├── core/                                                               │
│  │   │   └── scope/                   # NEW: Scope management                │
│  │   │       ├── scope-manager.js                                            │
│  │   │       ├── scope-context.js                                            │
│  │   │       ├── artifact-resolver.js                                        │
│  │   │       └── state-lock.js                                               │
│  │   └── bmm/                                                                │
│  │                                                                            │
│  └── _bmad-output/                    # Scoped artifacts                     │
│      ├── _shared/                     # Shared knowledge layer               │
│      │   ├── project-context.md       # Global "bible"                       │
│      │   ├── contracts/               # Integration contracts                │
│      │   └── principles/              # Architecture principles              │
│      ├── auth/                        # Auth scope                           │
│      │   ├── planning-artifacts/                                             │
│      │   ├── implementation-artifacts/                                       │
│      │   │   └── sprint-status.yaml   # PER-SCOPE sprint status             │
│      │   ├── tests/                   # Scoped tests                         │
│      │   └── project-context.md       # Optional: extends global             │
│      ├── payments/                    # Payments scope                       │
│      │   └── ...                                                             │
│      └── default/                     # Migrated existing artifacts          │
│          └── ...                                                             │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  CROSS-SCOPE ACCESS MODEL:                                                    │
│                                                                               │
│  Scope: payments                                                              │
│  ├── CAN READ:  auth/*, catalog/*, _shared/*, default/*                      │
│  ├── CAN WRITE: payments/* ONLY                                              │
│  └── TO SHARE:  bmad scope sync-up payments                                  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Git Hooks (This Repo)

> **Estimate:** 0.5 day  
> **Purpose:** Contributor workflow for BMAD-METHOD repository only

### Objectives

- Ensure main branch always synced with upstream (bmad-code-org)
- Enforce single-commit-per-branch workflow
- Require rebase on main before push
- Use amend + force-with-lease pattern

### Files to Create

```
BMAD-METHOD/
├── .githooks/
│   ├── pre-push           # Main enforcement hook
│   ├── pre-commit         # Block main commits, amend warnings
│   └── post-checkout      # Sync reminders
└── docs/
    └── CONTRIBUTING.md    # Git workflow documentation
```

### Pre-Push Hook Logic

```bash
#!/bin/bash
# .githooks/pre-push

1. Ensure upstream remote exists (git@github.com:bmad-code-org/BMAD-METHOD.git)
2. Fetch upstream
3. Block direct push to main
4. Sync local main with upstream (if needed)
5. Check branch is rebased on main
6. Enforce single commit rule (max 1 commit ahead of main)
```

### Setup Instructions

```bash
# One-time setup for contributors
git config core.hooksPath .githooks
git remote add upstream git@github.com:bmad-code-org/BMAD-METHOD.git
```

---

## Phase 1: Scope Foundation

> **Estimate:** 3-4 days

### 1.1 Scopes.yaml Schema

**File:** `_bmad/_config/scopes.yaml`

```yaml
version: 1

settings:
  allow_adhoc_scopes: true # Allow on-demand scope creation
  isolation_mode: strict # strict | warn | permissive
  default_output_base: '_bmad-output'
  default_shared_path: '_bmad-output/_shared'

scopes:
  auth:
    id: 'auth'
    name: 'Authentication Service'
    description: 'User authentication, SSO, authorization'
    status: active # active | archived
    dependencies: [] # Scopes this depends on
    created: '2026-01-21T10:00:00Z'
    _meta:
      last_activity: '2026-01-21T15:30:00Z'
      artifact_count: 12
```

**Validation Rules:**

- Scope ID: `^[a-z][a-z0-9-]*[a-z0-9]$` (2-50 chars)
- Reserved IDs: `_shared`, `_events`, `_config`, `global`
- Circular dependency detection required

### 1.2 ScopeManager Class

**File:** `src/core/scope/scope-manager.js`

```javascript
class ScopeManager {
  // CRUD Operations
  async listScopes(filters)
  async getScope(scopeId)
  async createScope(scopeId, options)
  async updateScope(scopeId, updates)
  async removeScope(scopeId, options)

  // Path Resolution
  async getScopePaths(scopeId)
  resolvePath(template, scopeId)

  // Validation
  validateScopeId(scopeId)
  validateDependencies(scopeId, dependencies, allScopes)

  // Dependencies
  async getDependencyTree(scopeId)
  findDependentScopes(scopeId, allScopes)
}
```

### 1.3 CLI Commands

**File:** `tools/cli/commands/scope.js`

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| `bmad scope list`        | List all scopes                      |
| `bmad scope create <id>` | Create new scope interactively       |
| `bmad scope info <id>`   | Show scope details                   |
| `bmad scope remove <id>` | Remove scope                         |
| `bmad scope migrate`     | Migrate existing to scoped structure |

### 1.4 Directory Structure Generator

**File:** `src/core/scope/scope-initializer.js`

Creates on scope creation:

```
_bmad-output/{scope}/
├── planning-artifacts/
├── implementation-artifacts/
├── tests/
└── .scope-meta.yaml
```

Creates on first scope (one-time):

```
_bmad-output/_shared/
├── project-context.md      # Global project context template
├── contracts/
└── principles/

_bmad/_events/
├── event-log.yaml
└── subscriptions.yaml
```

### 1.5 Migration Logic

**File:** `src/core/scope/scope-migrator.js`

Steps:

1. Create backup of `_bmad-output/`
2. Initialize scope system
3. Create `default` scope
4. Move existing artifacts to `_bmad-output/default/`
5. Update references in state files
6. Mark migration complete

---

## Phase 2: Variable Resolution

> **Estimate:** 4-5 days

### 2.1 workflow.xml Scope Initialization

**File:** `src/core/tasks/workflow.xml` (modify)

Add Step 0 before existing Step 1:

```xml
<step n="0" title="Initialize Scope Context" critical="true">
  <substep n="0a" title="Check for Scope Requirement">
    <action>Scan workflow.yaml for {scope} variable</action>
    <action>If found → workflow requires scope</action>
  </substep>

  <substep n="0b" title="Resolve Scope">
    <!-- Priority order: -->
    <!-- 1. --scope argument from command -->
    <!-- 2. Session context (if set) -->
    <!-- 3. Prompt user to select/create -->
  </substep>

  <substep n="0c" title="Load Scope Context">
    <action>Load scope config from scopes.yaml</action>
    <action>Resolve scope paths</action>
    <action>Load global project-context.md</action>
    <action>Load scope project-context.md (if exists, merge)</action>
    <action>Check for dependency updates (notify if pending)</action>
  </substep>
</step>
```

### 2.2 Module.yaml Updates

**File:** `src/bmm/module.yaml` (modify)

```yaml
# BEFORE
planning_artifacts:
  default: "{output_folder}/planning-artifacts"
  result: "{project-root}/{value}"

# AFTER
planning_artifacts:
  default: "{output_folder}/{scope}/planning-artifacts"
  result: "{project-root}/{value}"

implementation_artifacts:
  default: "{output_folder}/{scope}/implementation-artifacts"
  result: "{project-root}/{value}"
```

### 2.3 Workflow.yaml Update Script

**File:** `tools/cli/scripts/migrate-workflows.js`

Updates for 22+ workflow files:

1. Update `test_dir` variables to use `{output_folder}/{scope}/tests`
2. Handle variations in path definitions
3. Preserve `{config_source}:` references (they'll work via updated module.yaml)

### 2.4 Agent Activation Updates

**File:** `src/utility/agent-components/activation-steps.txt` (modify)

```xml
<step n="2">🚨 IMMEDIATE ACTION REQUIRED:
    - Load {project-root}/_bmad/{{module}}/config.yaml
    - Store: {user_name}, {communication_language}, {output_folder}
    - NEW: Check if scope is set for session
    - NEW: Load global project-context: {output_folder}/_shared/project-context.md
    - NEW: Load scope project-context (if exists): {output_folder}/{scope}/project-context.md
    - NEW: Merge contexts (scope extends global)
</step>
```

### 2.5 invoke-workflow Scope Propagation

**Modification to workflow.xml:**

When `<invoke-workflow>` is encountered:

1. Pass current `{scope}` as implicit parameter
2. Child workflow inherits scope from parent
3. Can be overridden with explicit `<param>scope: other</param>`

---

## Phase 3: Isolation & Locking

> **Estimate:** 2-3 days

### 3.1 ArtifactResolver

**File:** `src/core/scope/artifact-resolver.js`

```javascript
class ArtifactResolver {
  constructor(currentScope, basePath) {
    this.currentScope = currentScope;
    this.basePath = basePath;
  }

  // Read-any: Allow reading from any scope
  canRead(path) {
    return true; // All reads allowed
  }

  // Write-own: Only allow writing to current scope
  canWrite(path) {
    const targetScope = this.extractScopeFromPath(path);

    if (targetScope === '_shared') {
      throw new Error('Cannot write directly to _shared. Use: bmad scope sync-up');
    }

    if (targetScope !== this.currentScope) {
      throw new Error(`Cannot write to scope '${targetScope}' while in scope '${this.currentScope}'`);
    }

    return true;
  }

  extractScopeFromPath(path) {
    // Extract scope from path like _bmad-output/auth/...
  }
}
```

### 3.2 File Locking

**File:** `src/core/scope/state-lock.js`

```javascript
const lockfile = require('proper-lockfile');

class StateLock {
  async withLock(filePath, operation) {
    const release = await lockfile.lock(filePath, {
      stale: 30000, // 30s stale timeout
      retries: { retries: 10, minTimeout: 100, maxTimeout: 1000 },
    });

    try {
      return await operation();
    } finally {
      await release();
    }
  }

  // Optimistic locking with version field
  async updateYamlWithVersion(filePath, modifier) {
    return this.withLock(filePath, async () => {
      const data = await this.readYaml(filePath);
      const currentVersion = data._version || 0;

      const modified = await modifier(data);
      modified._version = currentVersion + 1;
      modified._lastModified = new Date().toISOString();

      await this.writeYaml(filePath, modified);
      return modified;
    });
  }
}
```

**Files requiring locking:**

- `{scope}/implementation-artifacts/sprint-status.yaml`
- `{scope}/planning-artifacts/bmm-workflow-status.yaml`
- `_shared/` files during sync operations
- `scopes.yaml` during scope CRUD

### 3.3 Package.json Update

Add dependency:

```json
{
  "dependencies": {
    "proper-lockfile": "^4.1.2"
  }
}
```

---

## Phase 4: Sync System

> **Estimate:** 3-4 days

### 4.1 Sync-Up (Promote to Shared)

**Command:** `bmad scope sync-up <scope>`

**Logic:**

1. Identify promotable artifacts (configurable patterns)
2. Check for conflicts with existing shared files
3. Copy to `_shared/` with attribution metadata
4. Log event for dependent scope notification

**Metadata added to promoted files:**

```yaml
# _shared/architecture/auth-api.md.meta
source_scope: auth
promoted_at: '2026-01-21T10:00:00Z'
original_hash: abc123
version: 1
```

### 4.2 Sync-Down (Pull from Shared)

**Command:** `bmad scope sync-down <scope>`

**Logic:**

1. Find shared updates since last sync
2. Compare with local copies (if any)
3. Handle conflicts (prompt user for resolution)
4. Copy to scope directory
5. Update last-sync timestamp

### 4.3 Conflict Resolution

**Options when conflict detected:**

1. Keep local (overwrite shared)
2. Keep shared (discard local)
3. Merge (3-way diff if possible)
4. Skip this file

---

## Phase 5: Event System

> **Estimate:** 2 days

### 5.1 Event Log Structure

**File:** `_bmad/_events/event-log.yaml`

```yaml
version: 1
events:
  - id: evt_001
    type: artifact_created
    scope: auth
    artifact: planning-artifacts/prd.md
    timestamp: '2026-01-21T10:30:00Z'

  - id: evt_002
    type: artifact_promoted
    scope: auth
    artifact: architecture.md
    shared_path: _shared/auth/architecture.md
    timestamp: '2026-01-21T11:00:00Z'
```

### 5.2 Subscriptions

**File:** `_bmad/_events/subscriptions.yaml`

```yaml
subscriptions:
  payments:
    watch:
      - scope: auth
        patterns: ['contracts/*', 'architecture.md']
    notify: true
```

### 5.3 Notification on Activation

When agent/workflow activates with scope:

1. Check subscriptions for this scope
2. Find events since last activity
3. Display pending updates (if any)
4. Suggest `bmad scope sync-down` if updates available

---

## Phase 6: IDE Integration & Documentation

> **Estimate:** 2-3 days

### 6.1 IDE Command Generators

**File:** `tools/cli/installers/lib/ide/shared/scope-aware-command.js`

Updates to workflow-command-template.md:

```markdown
### Scope Resolution

This workflow requires a scope. Before proceeding:

1. Check for --scope argument (e.g., `/create-story --scope auth`)
2. Check session context for active scope
3. If none, prompt user to select/create scope

Store selected scope for session.
```

### 6.2 Session-Sticky Scope

**Mechanism:** File-based `.bmad-scope` in project root

```yaml
# .bmad-scope (gitignored)
active_scope: auth
set_at: '2026-01-21T10:00:00Z'
```

### 6.3 Agent Menu Updates

Add `scope_required` attribute:

```yaml
menu:
  - trigger: 'prd'
    workflow: '...'
    scope_required: true # Enforce scope for this menu item
```

### 6.4 Documentation

Files to create:

1. `docs/multi-scope-guide.md` - User guide
2. `docs/migration-guide.md` - Upgrading existing installations
3. Update README with multi-scope overview

---

## Risk Mitigation

| Risk                            | Mitigation                                       |
| ------------------------------- | ------------------------------------------------ |
| Breaking existing installations | Auto-migration with backup, rollback capability  |
| Parallel write conflicts        | File locking + optimistic versioning             |
| Cross-scope data corruption     | Write isolation enforcement in ArtifactResolver  |
| Complex merge conflicts         | Clear conflict resolution UI + skip option       |
| IDE compatibility               | Test with all supported IDEs, graceful fallbacks |
| Performance with many scopes    | Lazy loading, scope caching                      |

---

## Success Criteria

### Functional Requirements

- [ ] Can create/list/remove scopes via CLI
- [ ] Workflows produce artifacts in correct scope directory
- [ ] Parallel workflows in different scopes don't conflict
- [ ] Cross-scope reads work (for dependencies)
- [ ] Cross-scope writes are blocked with clear error
- [ ] Sync-up promotes artifacts to shared
- [ ] Sync-down pulls shared updates
- [ ] Events logged and notifications shown
- [ ] Migration works for existing installations
- [ ] All IDEs support --scope flag

### Non-Functional Requirements

- [ ] No noticeable performance degradation
- [ ] Clear error messages for all failure modes
- [ ] Documentation complete
- [ ] Git hooks working for this repo

---

## Implementation Order

```
Phase 0 ─────► Phase 1 ─────► Phase 2 ─────► Phase 3 ─────► Phase 4 ─────► Phase 5 ─────► Phase 6
(Git hooks)   (Foundation)   (Variables)   (Isolation)   (Sync)        (Events)      (IDE/Docs)
   │              │              │              │            │              │             │
   │              │              │              │            │              │             │
0.5 day       3-4 days       4-5 days       2-3 days     3-4 days       2 days       2-3 days
```

**Critical Path:** Phase 0 → Phase 1 → Phase 2.1 → Phase 2.2 → Phase 3.1

MVP can be achieved with Phases 0-3 (isolation working, no sync/events yet).

---

## Appendix: Files to Create/Modify

### New Files

| Path                                                | Purpose                             |
| --------------------------------------------------- | ----------------------------------- |
| `.githooks/pre-push`                                | Git hook for single-commit workflow |
| `.githooks/pre-commit`                              | Git hook to block main commits      |
| `.githooks/post-checkout`                           | Git hook for sync reminders         |
| `src/core/scope/scope-manager.js`                   | Scope CRUD operations               |
| `src/core/scope/scope-initializer.js`               | Directory creation                  |
| `src/core/scope/scope-migrator.js`                  | Migration logic                     |
| `src/core/scope/scope-context.js`                   | Session context                     |
| `src/core/scope/artifact-resolver.js`               | Read/write enforcement              |
| `src/core/scope/state-lock.js`                      | File locking utilities              |
| `src/core/scope/scope-sync.js`                      | Sync-up/down logic                  |
| `src/core/scope/event-logger.js`                    | Event logging                       |
| `tools/cli/commands/scope.js`                       | CLI scope commands                  |
| `tools/cli/scripts/migrate-workflows.js`            | Workflow update script              |
| `docs/plans/multi-scope-parallel-artifacts-plan.md` | This file                           |

### Modified Files

| Path                                                | Changes                            |
| --------------------------------------------------- | ---------------------------------- |
| `src/core/tasks/workflow.xml`                       | Add Step 0 for scope init          |
| `src/core/module.yaml`                              | Add scope settings                 |
| `src/bmm/module.yaml`                               | Add {scope} to paths               |
| `src/utility/agent-components/activation-steps.txt` | Add scope loading                  |
| `tools/cli/bmad-cli.js`                             | Register scope command             |
| `tools/cli/installers/lib/ide/templates/*`          | Scope-aware templates              |
| `package.json`                                      | Add proper-lockfile dependency     |
| `22+ workflow.yaml files`                           | Update test_dir paths (via script) |

---

_End of Plan_
