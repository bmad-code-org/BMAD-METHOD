# BMAD Method Documentation Site

This directory contains the Astro + Starlight configuration for the BMAD Method documentation site.

## Architecture

The documentation uses a symlink architecture to keep content in `docs/` at the repo root while serving it through Astro:

```
bmad2/
├── docs/                          # Content lives here (repo root)
│   ├── index.md
│   ├── tutorials/
│   ├── how-to/
│   ├── explanation/
│   └── reference/
└── website/
    ├── astro.config.mjs           # Astro + Starlight config
    ├── src/
    │   ├── content/
    │   │   └── docs -> ../../docs # Symlink to content
    │   └── styles/
    │       └── custom.css         # Custom styling
    └── public/                    # Static assets
```

## Development

```bash
# From repo root
npm run docs:dev      # Start dev server
npm run docs:build    # Build for production
npm run docs:preview  # Preview production build
```

## Platform Notes

### Windows Symlink Support

The `website/src/content/docs` symlink may not work correctly on Windows without Developer Mode enabled or administrator privileges.

**To enable symlinks on Windows:**

1. **Enable Developer Mode** (recommended):
   - Settings → Update & Security → For developers → Developer Mode: On
   - This allows creating symlinks without admin rights

2. **Or use Git's symlink support**:
   ```bash
   git config core.symlinks true
   ```
   Then re-clone the repository.

3. **Or create a junction** (alternative):
   ```cmd
   # Run as Administrator
   mklink /J website\src\content\docs ..\..\docs
   ```

**If symlinks don't work**, you can copy the docs folder instead:
```bash
# Remove the symlink
rm website/src/content/docs

# Copy the docs folder
cp -r docs website/src/content/docs
```

Note: If copying, remember to keep the copy in sync with changes to `docs/`.

## Build Output

The build pipeline (`npm run docs:build`) produces:
- Static HTML site in `build/site/`
- LLM-friendly files: `llms.txt`, `llms-full.txt`
