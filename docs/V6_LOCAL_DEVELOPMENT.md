# V6 Local Development Guide

## Running Local Development Version

When developing on the V6 fork, **DO NOT use** `npx bmad-method` - this downloads the published npm package which does not include fork-specific features like OpenCode integration.

### Direct Node Execution (Recommended)

```bash
# Install BMAD to a project
node tools/cli/bmad-cli.js install

# Check installation status
node tools/cli/bmad-cli.js status

# List available modules
node tools/cli/bmad-cli.js list

# Uninstall BMAD from a project
node tools/cli/bmad-cli.js uninstall
```

### Using npm Scripts

The following npm scripts are available for convenience:

```bash
# Development scripts (uses local version)
npm run dev:install      # Run installer
npm run dev:status       # Check status
npm run dev:list         # List modules
npm run dev:uninstall    # Uninstall

# Legacy aliases (also use local version)
npm run bmad:install     # Same as dev:install
npm run bmad:status      # Same as dev:status
npm run install:bmad     # Same as dev:install
```

### Using npm link (Optional)

For extended testing where you want the `bmad` command available system-wide:

```bash
# From the BMAD-METHOD directory
npm link

# Now you can use 'bmad' anywhere
bmad install
bmad status

# Unlink when done
npm unlink -g bmad-method
```

**Note:** You must re-run `npm link` after:

- Installing/updating dependencies
- Checking out different branches
- Major code changes to the CLI

## Why This Matters

### Problem: npx Downloads Published Version

```bash
# ❌ WRONG - Downloads published version from npm
npx bmad-method install

# What actually happens:
# 1. npx checks npm registry
# 2. Downloads bmad-method@6.0.0-alpha.0 (published version)
# 3. Published version does NOT include fork changes like OpenCode
# 4. Your local OpenCode integration gets overwritten/broken
```

### Solution: Direct Execution

```bash
# ✅ CORRECT - Uses your local version
node tools/cli/bmad-cli.js install

# What actually happens:
# 1. Node runs your local CLI file directly
# 2. Uses your local code with all fork features
# 3. OpenCode integration works correctly
```

## Fork-Specific Features

The following features exist ONLY in the fork and will NOT work with the published npm package:

- **OpenCode Integration** (`tools/cli/installers/lib/ide/opencode.js`)
  - File reference-based configuration
  - Agent and command merging
  - AGENTS.md generation
  - Prefix customization

- **Installer Skip Block** (modify install flow)
  - Custom pre-installation logic
  - Modified dependency resolution

## Testing Your Changes

### Before Testing

```bash
# Ensure dependencies are installed
npm install

# Verify your changes are present
test -f tools/cli/installers/lib/ide/opencode.js && echo "✅ OpenCode present" || echo "❌ Missing"
```

### Testing Installation

```bash
# Create a test directory
mkdir -p ~/test-bmad-install
cd ~/test-bmad-install

# Run local installer
node ~/dev/tools/BMAD-METHOD/tools/cli/bmad-cli.js install

# Select OpenCode as IDE
# Verify opencode.json/opencode.jsonc is created with file references
```

### Testing After Changes

```bash
# Make your code changes...

# Test immediately (no rebuild needed for most changes)
node tools/cli/bmad-cli.js install
```

## Published vs Fork Versions

| Feature               | Published npm | Fork (Local) |
| --------------------- | ------------- | ------------ |
| Base V6 installer     | ✅            | ✅           |
| Standard IDEs (15)    | ✅            | ✅           |
| OpenCode integration  | ❌            | ✅           |
| Installer skip block  | ❌            | ✅           |
| Latest upstream fixes | ✅            | Needs merge  |
| Fork improvements     | ❌            | ✅           |

## Quick Reference Card

```bash
# ✅ CORRECT - Local development
node tools/cli/bmad-cli.js install
npm run dev:install
bmad install  # (after npm link)

# ❌ WRONG - Downloads published version
npx bmad-method install
npx bmad install
```

## Troubleshooting

### "Command not found: bmad"

- You haven't run `npm link`
- Use direct node execution instead: `node tools/cli/bmad-cli.js install`

### "OpenCode not appearing in IDE list"

- You're using `npx bmad-method` instead of local version
- Solution: Use `node tools/cli/bmad-cli.js install`

### "Changes not reflected when running installer"

- You're using `npx` or a globally installed version
- Solution: Use direct node execution
- Verify: `which bmad` should show your linked local version, not a global install

### "Cannot find module 'comment-json'"

- Dependencies not installed
- Solution: `npm install` from BMAD-METHOD directory
