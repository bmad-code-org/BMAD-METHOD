# Issue #477: Installer asks configuration questions during update instead of using existing settings

**Created**: August 18, 2025  
**Author**: [@bdmorin](https://github.com/bdmorin)  
**Status**: Open  
**Related Comments**: See discussion from Aug 18-23, 2025

## Description

As a BMAD beginner, I'm experiencing an issue where running `npx bmad-method install` to update an existing BMAD installation asks all the configuration questions again (PRD sharding, Architecture sharding, etc.) instead of reading the existing configuration from `install-manifest.yaml`.

**Note**: I'm new to BMAD and might be doing something wrong, but my understanding is that the same install command should handle updates intelligently.

## Steps to Reproduce

1. Have an existing BMAD installation (v4.36.2) with `.bmad-core` directory and `install-manifest.yaml`
2. Run `npx bmad-method install -i claude-code` to update
3. Installer correctly detects the update available (v4.36.2 → v4.39.2)
4. But then asks configuration questions as if it's a fresh install:
   - "Will the PRD be sharded into multiple files?"
   - "Will the Architecture be sharded into multiple files?"
   - Other bootstrap questions

## Expected Behavior

The installer should:

1. Detect the existing `install-manifest.yaml`
2. Read the previous configuration settings
3. Simply update files while preserving customizations
4. NOT ask configuration questions that were already answered during initial install

## Current Workaround

Have to answer all the configuration questions again with the same values, which feels wrong for an update operation.

## Environment

- **BMAD Method version**: v4.36.2 (installed) → v4.39.2 (available)
- **Installation method**: `npx bmad-method install -i claude-code`
- **OS**: macOS
- **Node version**: v22.16.0
- **Project location**: `/Users/bdmorin/src/piam-cia`

## Existing install-manifest.yaml

```yaml
version: 4.36.2
installed_at: '2025-08-12T23:51:04.439Z'
install_type: full
ides_setup:
  - claude-code
expansion_packs:
  - bmad-infrastructure-devops
```

## Additional Context

- The project has an existing `.bmad-core` directory with all files
- The `install-manifest.yaml` exists and contains previous configuration
- This seems like the update detection logic isn't properly reading/using the existing configuration
- As a beginner, I expected `npx bmad-method install` to be idempotent for updates

## Documentation Reference

The README.md explicitly states that the installer should be idempotent for updates (lines 50-89):

> **Important: Keep Your BMad Installation Updated**
>
> Stay up-to-date effortlessly! If you already have BMAD-Method installed in your project, simply run:
>
> ```bash
> npx bmad-method install
> ```
>
> This will:
>
> - ✅ Automatically detect your existing v4 installation
> - ✅ Update only the files that have changed and add new files
> - ✅ Create `.bak` backup files for any custom modifications you've made
> - ✅ Preserve your project-specific configurations

And further:

> This single command handles:
>
> - New installations - Sets up BMAD in your project
> - Upgrades - Updates existing installations automatically

The documentation clearly indicates that running `npx bmad-method install` on an existing installation should preserve configurations and handle updates automatically without re-asking configuration questions.

## Community Discussion

### @manjaroblack (Aug 19)

> This is normal as users may want to change things when updating. Besides asking for configuration settings are you having any issues?

### @bdmorin Response (Aug 19)

> I had to fiddle around a lot because I didn't know the effect of running bmad again, nor did it work like docs said. So I guess the issue is there's no way to reliably update BMAD agents without a reinstall? That seems.. off.

### @ewgdg Suggestion (Sep 23)

> It would be convenient if it had a new subcommand specifically for upgrading, e.g., `npx bmad-method upgrade`.

## Screenshot

The installer shows it detects the update but still asks configuration questions:

- Shows: "Update BMAD Agile Core System (v4.36.2 → v4.39.2)"
- But then asks: "Document Organization Settings - Configure how your project documentation should be organized"

## Root Issue

The installer's update detection logic doesn't properly:

1. Load existing configuration from `install-manifest.yaml`
2. Use that configuration to skip questions
3. Distinguish between fresh install, update, and reinstall scenarios

## Expected Resolution

The installer should intelligently detect update mode and:

1. Skip all configuration questions during updates
2. Preserve existing settings from manifest
3. Only ask questions for new configuration options (if any)
4. Provide option to reconfigure (if user explicitly requests)

---

**Note**: This issue contradicts the documented behavior and causes confusion for users. The fix is needed to align implementation with documentation.
