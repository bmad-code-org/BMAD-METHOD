---
title: 'Migration Guide: Multi-Scope Parallel Artifacts'
description: 'Guide for migrating existing BMAD installations to the multi-scope system'
---

# Migration Guide: Multi-Scope Parallel Artifacts

> Guide for migrating existing BMAD installations to the multi-scope system.

## Overview

The multi-scope system introduces isolated artifact workspaces while maintaining full backward compatibility. Existing installations can:

1. Continue working without any changes (legacy mode)
2. Migrate existing artifacts to a `default` scope
3. Create new scopes for parallel development

## Prerequisites

- BMAD v6+ installed
- Node.js 20+
- Backup of your `_bmad-output/` directory (recommended)

## Migration Paths

### Path 1: Continue Without Migration (Recommended for Simple Projects)

If you have a single-team, single-product workflow, you can continue using BMAD without migration. The scope system is entirely opt-in.

**When to choose this path:**

- Small to medium projects
- Single developer or tightly coordinated team
- No need for parallel feature development

**What happens:**

- Workflows continue to use `_bmad-output/` directly
- No scope variable in paths
- All existing commands work unchanged

### Path 2: Migrate to Default Scope (Recommended for Growing Projects)

Migrate existing artifacts to a `default` scope, enabling future parallel development.

```bash
# 1. Analyze current state
bmad scope migrate --analyze

# 2. Run migration (creates backup automatically)
bmad scope migrate

# 3. Verify migration
bmad scope list
bmad scope info default
```

**What happens:**

- Creates backup at `_bmad-output/_backup_migration_<timestamp>/`
- Initializes scope system
- Creates `default` scope
- Moves artifacts from `_bmad-output/` to `_bmad-output/default/`
- Updates references in state files
- Creates shared layer at `_bmad-output/_shared/`

### Path 3: Fresh Start with Scopes

For new projects or major rewrites, start fresh with the scope system.

```bash
# Initialize scope system
bmad scope init

# Create your first scope
bmad scope create main --name "Main Product"

# Run workflows with scope
bmad workflow create-prd --scope main
```

## Step-by-Step Migration

### Step 1: Backup (Automatic but Verify)

The migration creates an automatic backup, but we recommend creating your own:

```bash
# Manual backup
cp -r _bmad-output/ _bmad-output-backup-$(date +%Y%m%d)/
```

### Step 2: Analyze Current State

```bash
bmad scope migrate --analyze
```

**Example output:**

```
Migration Analysis
==================

Current Structure:
  _bmad-output/
  ├── planning-artifacts/
  │   ├── prd.md
  │   ├── architecture.md
  │   └── epics-stories.md
  ├── implementation-artifacts/
  │   ├── sprint-status.yaml
  │   └── stories/
  └── tests/
      └── ...

Detected Artifacts:
  Planning: 3 files
  Implementation: 15 files
  Tests: 8 files

Migration Plan:
  1. Create backup
  2. Initialize scope system
  3. Create 'default' scope
  4. Move all artifacts to default/
  5. Create shared layer
  6. Update state references

Estimated time: < 30 seconds
```

### Step 3: Run Migration

```bash
bmad scope migrate
```

**Interactive prompts:**

```
? Ready to migrate existing artifacts to 'default' scope? (Y/n)
? Create scope-specific project-context.md? (y/N)
```

### Step 4: Verify Migration

```bash
# Check scope list
bmad scope list

# Verify directory structure
ls -la _bmad-output/

# Check default scope
bmad scope info default
```

**Expected structure after migration:**

```
_bmad-output/
├── _shared/
│   ├── project-context.md
│   ├── contracts/
│   └── principles/
├── default/
│   ├── planning-artifacts/
│   │   ├── prd.md
│   │   ├── architecture.md
│   │   └── epics-stories.md
│   ├── implementation-artifacts/
│   │   ├── sprint-status.yaml
│   │   └── stories/
│   ├── tests/
│   └── .scope-meta.yaml
└── _backup_migration_<timestamp>/
    └── (original files)
```

### Step 5: Update Workflows (Optional)

If you have custom workflow configurations, update paths:

**Before:**

```yaml
output_dir: '{output_folder}/planning-artifacts'
```

**After:**

```yaml
output_dir: '{scope_planning}'
# Or: "{output_folder}/{scope}/planning-artifacts"
```

The migration script can update workflows automatically:

```bash
node tools/cli/scripts/migrate-workflows.js --dry-run --verbose
node tools/cli/scripts/migrate-workflows.js
```

## Rollback Procedure

If migration fails or you need to revert:

### Automatic Rollback

```bash
bmad scope migrate --rollback
```

### Manual Rollback

```bash
# Remove migrated structure
rm -rf _bmad-output/default/
rm -rf _bmad-output/_shared/
rm -rf _bmad/_config/scopes.yaml
rm -rf _bmad/_events/

# Restore from backup
cp -r _bmad-output/_backup_migration_<timestamp>/* _bmad-output/
rm -rf _bmad-output/_backup_migration_<timestamp>/
```

## Post-Migration Steps

### 1. Update .gitignore

Add scope-related files to ignore:

```gitignore
# Scope session file (user-specific)
.bmad-scope

# Lock files
*.lock

# Backup directories (optional)
_bmad-output/_backup_*/
```

### 2. Update Team Documentation

Inform your team about the new scope system:

- How to create scopes
- How to run workflows with scopes
- How to use sync-up/sync-down

### 3. Configure Scope Dependencies (Optional)

If your scopes have dependencies:

```bash
# Update scope with dependencies
bmad scope update default --deps shared-lib,core-api
```

### 4. Set Up Event Subscriptions (Optional)

For multi-scope projects:

```bash
# Edit subscriptions manually
# _bmad/_events/subscriptions.yaml
```

```yaml
subscriptions:
  frontend:
    watch:
      - scope: api
        patterns: ['contracts/*']
    notify: true
```

## Troubleshooting

### Error: "Artifacts not found after migration"

**Cause:** Migration path resolution issue.

**Solution:**

```bash
# Check backup location
ls _bmad-output/_backup_migration_*/

# Manually move if needed
mv _bmad-output/_backup_migration_*/planning-artifacts/* _bmad-output/default/planning-artifacts/
```

### Error: "Scope not found"

**Cause:** Scope system not initialized.

**Solution:**

```bash
bmad scope init
```

### Error: "Cannot write to scope 'default' while in scope 'other'"

**Cause:** Cross-scope write protection.

**Solution:**

```bash
# Either switch scope
bmad workflow --scope default

# Or use sync to share
bmad scope sync-up other
bmad scope sync-down default
```

### State Files Show Old Paths

**Cause:** References not updated during migration.

**Solution:**

```bash
# Re-run migration with force update
bmad scope migrate --force --update-refs
```

## FAQ

### Q: Will my existing workflows break?

**A:** No. The scope system is backward compatible. Workflows without `{scope}` variables continue to work. Only workflows with scope variables require an active scope.

### Q: Can I have both scoped and non-scoped artifacts?

**A:** Yes, but not recommended. The `_shared/` layer is for cross-scope artifacts. Keep everything in scopes for consistency.

### Q: How do I share artifacts between team members?

**A:** Use git as usual. The `_bmad-output/` directory structure (including scopes) can be committed. Add `.bmad-scope` to `.gitignore` (session-specific).

### Q: Can I rename scopes?

**A:** Not directly. Create new scope, copy artifacts, remove old scope:

```bash
bmad scope create new-name --name "New Name"
cp -r _bmad-output/old-name/* _bmad-output/new-name/
bmad scope remove old-name --force
```

### Q: What happens to sprint-status.yaml?

**A:** Each scope gets its own `sprint-status.yaml` at `_bmad-output/{scope}/implementation-artifacts/sprint-status.yaml`. This enables parallel sprint planning.

### Q: Do I need to update my CI/CD?

**A:** Only if your CI/CD references specific artifact paths. Update paths to include scope:

```bash
# Before
cat _bmad-output/planning-artifacts/prd.md

# After
cat _bmad-output/default/planning-artifacts/prd.md
```

## Version History

| Version | Changes                       |
| ------- | ----------------------------- |
| 6.1.0   | Multi-scope system introduced |
| 6.0.0   | Initial v6 release            |

---

For more details, see:

- [Multi-Scope Guide](multi-scope-guide.md)
- [Implementation Plan](plans/multi-scope-parallel-artifacts-plan.md)
