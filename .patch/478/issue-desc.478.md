# Issue #478: No BMad installation found in current directory tree

**Status**: Bug (fix-in-progress)
**Assignee**: manjaroblack
**Opened by**: moyger on Aug 19

## Description

After installing BMAD Method, running `npx bmad-method status` from the repository prints:

```
No BMad installation found in current directory tree.
```

However, BMAD is installed in the project (created a `.bmad-core/` folder), but status does not detect it.

## Steps to Reproduce

1. In a project folder, install BMAD Method (e.g., via the README instructions).
2. Confirm the installer created a hidden folder (in my case `.bmad-core/`) in the project root.
3. From the same project root, run: `npx bmad-method status`.
4. Observe the message: `No BMad installation found in current directory tree`.

## Issue Analysis

**Confirmed by**: dracic

- "I can confirm that status doesn't work"

**Root Cause Identified**:
The issue is related to the `findInstallation()` function not properly handling the original working directory (originalCwd). The function needs to be updated to honor the original working directory when searching for BMAD installations.

**Related PR**: #480 (fix: honor original working directory when running npx installer and searching for task files)

**Note from dracic**:

> "It wont if you don't edit findInstallation(), but since this is similar stuff perhaps you can just push to your PR. It's all about originalCwd."

## Labels

- bug: Something isn't working
- fix-in-progress

## Type

Bug

## Participants

- @moyger (Reporter)
- @dracic (Contributor, Confirmer)
- @manjaroblack (Assignee)

## Resolution Approach

The fix requires modifications to the `findInstallation()` function to:

1. Properly capture and use the original working directory (originalCwd)
2. Search for BMAD installations relative to where the command was originally executed
3. Ensure the status command correctly detects existing `.bmad-*` folders in the project directory tree

---

**Issue Reference**: https://github.com/bmad-code-org/BMAD-METHOD/issues/478
