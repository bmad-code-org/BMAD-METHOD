# BMAD Linked Projects Strategy

## Overview

This BMAD installation serves as the **primary BMAD hub** for all your projects. Instead of installing BMAD v6 separately into each project, external projects can be **symbolically linked** to this central installation.

## Benefits

✅ **Single Source of Truth** - One BMAD installation to maintain
✅ **Instant Updates** - Update BMAD once, all linked projects benefit
✅ **Disk Space Savings** - No duplicate BMAD installations
✅ **Consistent Tooling** - Same agents and workflows across all projects
✅ **Easy Management** - Centralized configuration and updates

## Architecture

```
/Users/hbl/Documents/BMAD-METHOD/          ← Primary BMAD Installation
├── bmad/                                   ← BMAD Core
├── .claude/                                ← Claude Code agents
├── src/                                    ← BMAD source code
└── link-project.sh                         ← Project linker script

/Users/hbl/Documents/hbl-documents/         ← Linked Project #1
├── bmad -> /Users/.../BMAD-METHOD/bmad     ← Symlink
├── .claude -> /Users/.../BMAD-METHOD/.claude
└── .bmad-linked                            ← Marker file

/Users/hbl/Documents/other-project/         ← Linked Project #2
├── bmad -> /Users/.../BMAD-METHOD/bmad     ← Symlink
├── .claude -> /Users/.../BMAD-METHOD/.claude
└── .bmad-linked                            ← Marker file
```

## How to Link a New Project

### Method 1: Using the Link Script (Recommended)

From the BMAD-METHOD directory:

```bash
cd /Users/hbl/Documents/BMAD-METHOD
./link-project.sh /path/to/your/project
```

### Method 2: Manual Linking

```bash
cd /path/to/your/project

# Create symlinks
ln -s /Users/hbl/Documents/BMAD-METHOD/bmad bmad
ln -s /Users/hbl/Documents/BMAD-METHOD/.claude .claude

# Add to .gitignore
echo "bmad" >> .gitignore
echo ".claude" >> .gitignore
echo ".bmad-linked" >> .gitignore
```

## How to Unlink a Project

```bash
cd /path/to/your/project
rm bmad .claude .bmad-linked
```

To restore a standalone BMAD installation after unlinking, run the BMAD installer from that project's directory.

## Updating BMAD for All Linked Projects

Since all projects reference the same BMAD installation, you only need to update once:

```bash
cd /Users/hbl/Documents/BMAD-METHOD
npm run update:bmad
```

This will immediately update BMAD for **all linked projects**.

## Currently Linked Projects (31 total)

| Project | Status |
|---------|--------|
| ahmci | ✅ |
| aip-connect | ✅ |
| aja-app-2026 | ✅ |
| bailey-legal-bloom | ✅ |
| banking-app-2026 | ✅ |
| black-dashboard-ui | ✅ |
| caffeinate | ✅ |
| call-app | ✅ |
| council-ledger | ✅ |
| cyrvra | ✅ |
| dpc-bank | ✅ |
| e-sign-nextjs16 | ✅ |
| exportwhatsapp | ✅ |
| hbl-documents | ✅ |
| hbl-documents/signright-au | ✅ |
| hbl-lawyer/lexicon | ✅ |
| hbl-nextjs16 | ✅ |
| JurisMark | ✅ |
| LexFocus-Rust | ✅ |
| lexmail | ✅ |
| loco-app-early-july | ✅ |
| loco-nextjs16 | ✅ |
| original-chadcn-ui | ✅ |
| pages-health-nextjs16 | ✅ |
| press | ✅ |
| veenability | ✅ |
| VerityDocs | ✅ |
| visa-ai | ✅ |
| wyszynski-qcat | ✅ |

*Last updated: 2025-12-28*

## Git Considerations

The linker script automatically adds these entries to `.gitignore`:

```gitignore
# BMAD symlinks (linked to /Users/hbl/Documents/BMAD-METHOD)
bmad
.claude
.bmad-linked
```

This ensures:

- Symlinks are not committed to version control
- Each developer can maintain their own BMAD setup
- Project repository stays clean and portable

## Troubleshooting

### Symlink appears broken

Check if the BMAD-METHOD installation still exists:

```bash
ls -la /Users/hbl/Documents/BMAD-METHOD/bmad
```

### Want to switch from linked to standalone

1. Unlink: `rm bmad .claude .bmad-linked`
2. Install: `node /Users/hbl/Documents/BMAD-METHOD/tools/cli/bmad-cli.js install`

### Accidentally deleted BMAD-METHOD

If you delete the primary installation, all linked projects will have broken symlinks. To recover:

1. Restore BMAD-METHOD from git or backups
2. Or unlink all projects and reinstall BMAD independently in each

## Best Practices

1. **Keep BMAD-METHOD as a git repository** - Allows version control and easy restoration
2. **Don't modify files in linked directories** - Changes affect all linked projects
3. **Use project-specific configs** - Store project-specific settings outside `bmad/` and `.claude/`
4. **Backup before updates** - Run `git commit` in BMAD-METHOD before major updates
5. **Document linked projects** - Keep the "Currently Linked Projects" section updated

## Advanced: Project-Specific Overrides

If a linked project needs custom agents or configurations:

```bash
cd /path/to/your/project

# Create project-specific agent directory
mkdir -p .claude-local/agents

# Add to your project's documentation
# that .claude-local/ contains project-specific configs
```

Then configure Claude Code to read from both directories (check Claude Code docs for multi-path configuration).

## Support

For issues with:

- **Linking/unlinking**: Check this document or run `./link-project.sh` without arguments
- **BMAD updates**: See BMAD-METHOD documentation
- **Claude Code integration**: See `.claude/agents/` documentation

---

**Last Updated**: 2025-10-19
**BMAD Version**: 6.0.0-alpha.0
**Primary Installation**: `/Users/hbl/Documents/BMAD-METHOD`
