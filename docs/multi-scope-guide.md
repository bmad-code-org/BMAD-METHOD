---
title: 'Multi-Scope Parallel Artifacts Guide'
description: 'Run multiple workflows in parallel across different terminal sessions with isolated artifacts'
---

# Multi-Scope Parallel Artifacts Guide

> Run multiple workflows in parallel across different terminal sessions with isolated artifacts.

## Overview

The multi-scope system enables parallel development by isolating artifacts into separate "scopes". Each scope is an independent workspace with its own:

- Planning artifacts (PRDs, architecture, epics)
- Implementation artifacts (sprint status, stories)
- Test directories
- Optional scope-specific project context

## Quick Start

### Initialize Scope System

```bash
npx bmad-fh scope init
```

This creates:

- `_bmad/_config/scopes.yaml` - Scope registry
- `_bmad-output/_shared/` - Shared knowledge layer
- `_bmad/_events/` - Event system

### Create Your First Scope

```bash
npx bmad-fh scope create auth --name "Authentication Service"
```

**Important:** After creation, you'll be prompted to activate the scope:

```
✓ Scope 'auth' created successfully!
? Set 'auth' as your active scope for this session? (Y/n)
```

Accept this prompt (or run `npx bmad-fh scope set auth` later) to ensure workflows use the scoped directories.

### List Scopes

```bash
npx bmad-fh scope list
```

### Activate a Scope

```bash
# Set the active scope for your terminal session
npx bmad-fh scope set auth

# Or use environment variable (useful for CI/CD)
export BMAD_SCOPE=auth
```

Workflows automatically detect the active scope from:

1. `.bmad-scope` file (set by `scope set` command)
2. `BMAD_SCOPE` environment variable

> **Warning:** If no scope is active, artifacts go to root `_bmad-output/` directory (legacy mode).

## Directory Structure

```
project-root/
├── _bmad/
│   ├── _config/
│   │   └── scopes.yaml              # Scope registry
│   └── _events/
│       ├── event-log.yaml           # Event tracking
│       └── subscriptions.yaml       # Event subscriptions
│
└── _bmad-output/
    ├── _shared/                     # Shared knowledge layer
    │   ├── project-context.md       # Global "bible"
    │   ├── contracts/               # Integration contracts
    │   └── principles/              # Architecture principles
    │
    ├── auth/                        # Auth scope
    │   ├── planning-artifacts/
    │   ├── implementation-artifacts/
    │   ├── tests/
    │   └── project-context.md       # Scope-specific context
    │
    └── payments/                    # Payments scope
        └── ...
```

## CLI Commands

### Scope Management

| Command                           | Description                            |
| --------------------------------- | -------------------------------------- |
| `npx bmad-fh scope init`          | Initialize scope system                |
| `npx bmad-fh scope create <id>`   | Create new scope (prompts to activate) |
| `npx bmad-fh scope set <id>`      | **Set active scope (required!)**       |
| `npx bmad-fh scope list`          | List all scopes                        |
| `npx bmad-fh scope info <id>`     | Show scope details                     |
| `npx bmad-fh scope remove <id>`   | Remove a scope                         |
| `npx bmad-fh scope archive <id>`  | Archive a scope                        |
| `npx bmad-fh scope activate <id>` | Activate archived scope                |

### Create Options

```bash
npx bmad-fh scope create auth \
  --name "Authentication" \
  --description "User auth and SSO" \
  --deps payments,users \
  --context  # Create scope-specific project-context.md
```

> **Note:** After creation, you'll be prompted to set this as your active scope.
> Accept the prompt to ensure workflows use the scoped directories.

### Remove with Backup

```bash
# Creates backup in _bmad-output/_backup_auth_<timestamp>
bmad scope remove auth

# Force remove without backup
bmad scope remove auth --force --no-backup
```

## Syncing Between Scopes

### Promote to Shared Layer

```bash
# Promote artifacts to shared
bmad scope sync-up auth
```

Promotes:

- `architecture/*.md`
- `contracts/*.md`
- `principles/*.md`
- `project-context.md`

### Pull from Shared Layer

```bash
# Pull shared updates to scope
bmad scope sync-down payments
```

## Access Model

| Operation | Scope: auth | Scope: payments | \_shared    |
| --------- | ----------- | --------------- | ----------- |
| **Read**  | Any scope   | Any scope       | Yes         |
| **Write** | auth only   | payments only   | Use sync-up |

### Isolation Modes

Configure in `_bmad/_config/scopes.yaml`:

```yaml
settings:
  isolation_mode: strict # strict | warn | permissive
```

- **strict**: Block cross-scope writes (default)
- **warn**: Allow with warnings
- **permissive**: Allow all (not recommended)

## Workflow Integration

### Scope Variable

Workflows use `{scope}` variable:

```yaml
# workflow.yaml
variables:
  test_dir: '{scope_tests}' # Resolves to _bmad-output/auth/tests
```

### Scope-Aware Paths

| Variable                 | Non-scoped                             | Scoped (auth)                               |
| ------------------------ | -------------------------------------- | ------------------------------------------- |
| `{scope}`                | (empty)                                | auth                                        |
| `{scope_path}`           | \_bmad-output                          | \_bmad-output/auth                          |
| `{scope_planning}`       | \_bmad-output/planning-artifacts       | \_bmad-output/auth/planning-artifacts       |
| `{scope_implementation}` | \_bmad-output/implementation-artifacts | \_bmad-output/auth/implementation-artifacts |
| `{scope_tests}`          | \_bmad-output/tests                    | \_bmad-output/auth/tests                    |

## Session-Sticky Scope

The `.bmad-scope` file in project root stores active scope:

```yaml
# .bmad-scope (gitignored)
active_scope: auth
set_at: '2026-01-21T10:00:00Z'
```

Workflows automatically use this scope when no `--scope` flag provided.

## Event System

### Subscribing to Updates

Scopes can subscribe to events from other scopes:

```yaml
# _bmad/_events/subscriptions.yaml
subscriptions:
  payments:
    watch:
      - scope: auth
        patterns: ['contracts/*', 'architecture.md']
    notify: true
```

### Event Types

- `artifact_created` - New artifact created
- `artifact_updated` - Artifact modified
- `artifact_promoted` - Promoted to shared
- `sync_up` / `sync_down` - Sync operations
- `scope_created` / `scope_archived` - Scope lifecycle

## Parallel Development Example

### Terminal 1: Auth Scope

```bash
# Set scope for session
bmad scope create auth --name "Authentication"

# Run workflows - all output goes to auth scope
bmad workflow create-prd --scope auth
bmad workflow create-epic --scope auth
```

### Terminal 2: Payments Scope

```bash
# Different scope, isolated artifacts
bmad scope create payments --name "Payment Processing"

bmad workflow create-prd --scope payments
bmad workflow create-epic --scope payments
```

### Sharing Work

```bash
# Terminal 1: Promote auth architecture to shared
bmad scope sync-up auth

# Terminal 2: Pull shared updates to payments
bmad scope sync-down payments
```

## Migration from Non-Scoped

Existing projects can migrate:

```bash
# Analyze existing artifacts
bmad scope migrate --analyze

# Migrate to 'default' scope
bmad scope migrate
```

This:

1. Creates backup
2. Creates `default` scope
3. Moves artifacts to `_bmad-output/default/`
4. Updates references

## Best Practices

### Naming Scopes

Use clear, descriptive IDs:

- `auth` - Authentication service
- `payments` - Payment processing
- `user-service` - User management
- `api-gateway` - API gateway

### Scope Granularity

Choose based on:

- **Team boundaries** - One scope per team
- **Deployment units** - One scope per service
- **Feature sets** - One scope per major feature

### Shared Layer Usage

- Keep `project-context.md` as the global "bible"
- Put integration contracts in `_shared/contracts/`
- Document architecture principles in `_shared/principles/`
- Promote mature, stable artifacts only

### Dependencies

Declare dependencies explicitly:

```bash
bmad scope create payments --deps auth,users
```

This helps:

- Track relationships
- Get notifications on dependency changes
- Plan integration work

## Troubleshooting

### "No scope set" Error

```bash
# Option 1: Specify scope explicitly
bmad workflow --scope auth

# Option 2: Set session scope
bmad scope create auth
```

### Cross-Scope Write Blocked

```
Error: Cannot write to scope 'payments' while in scope 'auth'
```

Solutions:

1. Switch to correct scope
2. Use sync-up to promote to shared
3. Change isolation mode (not recommended)

### Conflict During Sync

```bash
# Keep local version
bmad scope sync-down payments --resolution keep-local

# Keep shared version
bmad scope sync-down payments --resolution keep-shared

# Backup and update
bmad scope sync-down payments --resolution backup-and-update
```

## API Reference

### ScopeManager

```javascript
const { ScopeManager } = require('./src/core/lib/scope');

const manager = new ScopeManager({ projectRoot: '/path/to/project' });
await manager.initialize();

// CRUD operations
const scope = await manager.createScope('auth', { name: 'Auth' });
const scopes = await manager.listScopes();
await manager.archiveScope('auth');
await manager.removeScope('auth', { force: true });
```

### ScopeContext

```javascript
const { ScopeContext } = require('./src/core/lib/scope');

const context = new ScopeContext({ projectRoot: '/path/to/project' });

// Session management
await context.setScope('auth');
const current = await context.getCurrentScope();

// Load merged context
const projectContext = await context.loadProjectContext('auth');
```

### ArtifactResolver

```javascript
const { ArtifactResolver } = require('./src/core/lib/scope');

const resolver = new ArtifactResolver({
  currentScope: 'auth',
  basePath: '_bmad-output',
});

// Check access
const canWrite = resolver.canWrite('/path/to/file.md');
resolver.validateWrite('/path/to/file.md'); // Throws if not allowed
```

---

For more details, see the [Implementation Plan](plans/multi-scope-parallel-artifacts-plan.md).
