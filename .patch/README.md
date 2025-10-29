# .patch Directory - Permanent Documentation Repository

## ⚠️ CRITICAL: DO NOT DELETE THIS FOLDER

This directory maintains permanent, immutable documentation of all implemented PR changes across the entire project.

## Purpose

The `.patch/` directory serves as:

- **Historical Record:** Complete diff documentation for every PR
- **Code Review Reference:** Quick access to what was changed and why
- **Permanent Archive:** Backup of all implementation details
- **Development Audit Trail:** Track of all project modifications

## Structure

Each PR gets its own numbered subdirectory:

```
.patch/
├── .gitkeep                 # Folder protection marker
├── 573/                     # PR #573: Agent Schema Validation
│   ├── agent.js.573.diff.txt
│   ├── test-agent-schema.js.573.diff.txt
│   └── patch.573.txt
├── 586/                     # PR #586: AICockpit IDE Support
│   ├── bmad.js.586.diff.txt
│   ├── eslint.config.mjs.586.diff.txt
│   ├── ide-setup.js.586.diff.txt
│   ├── install.config.yaml.586.diff.txt
│   ├── package-lock.json.586.diff.txt
│   ├── package.json.586.diff.txt
│   └── patch.586.txt
├── 629/                     # PR #629: Manifest Update Feature
│   ├── bmad.js.629.diff.txt
│   ├── installer.js.629.diff.txt
│   ├── package.json.629.diff.txt
│   └── patch.629.txt
└── 633/                     # PR #633: INIT_CWD Default Directory
    ├── bmad.js.633.diff.txt
    ├── cli.js.633.diff.txt
    ├── installer.js.633.diff.txt
    ├── main.js.633.diff.txt
    ├── patch.633.txt
    ├── upgrader.js.633.diff.txt
    └── web-builder.js.633.diff.txt
```

## Protection Mechanisms

### 1. Git Tracking

- All .patch files are committed to git
- `.patch/.gitkeep` ensures folder is always tracked
- Cannot be accidentally lost or ignored

### 2. Pre-commit Hook

- `.git/hooks/pre-commit` prevents deletion of .patch files
- Automatically warns if .patch files are being removed
- Blocks commits that would delete .patch folder

### 3. Git Attributes

- `.gitattributes` ensures proper line ending handling
- Marks patch files with specific merge strategies
- Prevents accidental modifications during merges

### 4. Documentation

- `.PATCH-PROTECTION-POLICY.md` - Comprehensive protection policy
- `.patch/README.md` - This file
- Clear guidelines for all developers

## Important Rules

### ❌ NEVER DO:

1. **Delete .patch folder**

   ```bash
   rm -rf .patch  # ❌ FORBIDDEN
   ```

2. **Add .patch to .gitignore**

   ```bash
   echo ".patch/" >> .gitignore  # ❌ FORBIDDEN
   ```

3. **Modify or remove patch files**

   ```bash
   rm .patch/573/*  # ❌ FORBIDDEN
   ```

4. **Force push without .patch**
   ```bash
   git push -f  # ❌ MIGHT LOSE .patch
   ```

### ✅ SAFE OPERATIONS:

1. **Add new PR diffs**

   ```bash
   # After PR implementation, add to .patch/[PR-NUMBER]/
   git add .patch/[number]/
   ```

2. **Review patch files**

   ```bash
   cat .patch/573/patch.573.txt
   diff .patch/586/bmad.js.586.diff.txt
   ```

3. **Reference old changes**
   ```bash
   grep -r "INIT_CWD" .patch/633/
   ```

## Recovery Procedures

### If .patch Folder Is Accidentally Deleted

1. **Immediate Recovery:**

   ```bash
   git checkout HEAD -- .patch/
   ```

2. **From Specific Commit:**

   ```bash
   git checkout 946521dc -- .patch/
   ```

3. **From Feature Branch:**
   ```bash
   git checkout feature/branch-name -- .patch/633/
   ```

### If .patch Is Added to .gitignore

1. **Remove from .gitignore:**

   ```bash
   grep -v "^\.patch" .gitignore > .gitignore.tmp
   mv .gitignore.tmp .gitignore
   git add .gitignore
   ```

2. **Restore .patch tracking:**
   ```bash
   git rm --cached .gitignore
   git add .gitignore .patch/
   ```

## For Developers

### When Adding New PRs

1. Create feature branch for implementation
2. After changes, generate diffs:

   ```bash
   mkdir -p .patch/[PR-NUMBER]
   git diff main HEAD -- [file] > .patch/[PR-NUMBER]/[file].diff.txt
   ```

3. Create comprehensive summary:

   ```bash
   cat > .patch/[PR-NUMBER]/patch.[PR-NUMBER].txt << EOF
   === PR #[NUMBER]: [FEATURE NAME] ===

   DESCRIPTION:
   [implementation details]

   COMMIT SHA: [sha]
   BRANCH: [branch-name]
   ...
   EOF
   ```

4. Commit to git:
   ```bash
   git add .patch/[PR-NUMBER]/
   git commit -m "docs(patch): add comprehensive diffs for PR #[NUMBER]"
   ```

## For Maintainers

### Before Merging PRs

- [ ] Check if corresponding `.patch/[PR-NUMBER]/` exists
- [ ] Verify all modified files have diffs
- [ ] Review comprehensive patch documentation
- [ ] Ensure .patch folder is in merge commit

### During Release

- [ ] Verify .patch directory is included
- [ ] Test that .patch is accessible in release
- [ ] Document any new PR diffs added

## Git Configuration

To ensure .patch is never accidentally removed, configure git:

```bash
# Prevent accidental deletion
git config core.protectNTFS true
git config core.safeCRLF warn

# Ensure proper line endings
git config core.autocrlf true

# Never auto-clean .patch
git config clean.requireForce true
```

## Commits Protecting .patch

This folder is protected by these commits:

- `946521dc` - chore: add all .patch directories and protection policy to main
- `97f9816b` - chore: restore .patch/633 diffs to main branch
- `bee1e1a1` - docs(patch): add comprehensive diffs for PR #633
- `9f015e31` - docs(patch): add comprehensive diffs for PR #629

## Related Files

- `.PATCH-PROTECTION-POLICY.md` - High-level protection policy
- `.gitattributes` - Git file handling rules
- `.git/hooks/pre-commit` - Pre-commit protection hook
- `.patch/.gitkeep` - Folder tracking marker

## Questions or Issues?

If you encounter issues with .patch folder:

1. Check `.PATCH-PROTECTION-POLICY.md` for detailed guidance
2. Review `.git/hooks/pre-commit` for protection mechanisms
3. Refer to "Recovery Procedures" section above
4. Contact team lead before making changes

---

**Last Updated:** October 26, 2025  
**Protection Status:** ACTIVE AND PERMANENT  
**Critical Level:** MAXIMUM
