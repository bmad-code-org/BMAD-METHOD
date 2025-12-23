# Deploy Domain

## File Index

- @/package.json - Version (currently 6.0.0-alpha.12), dependencies, npm scripts, bin commands
- @/CHANGELOG.md - Release history, must be updated BEFORE version bump
- @/CONTRIBUTING.md - Contribution guidelines, PR process, commit conventions

## NPM Scripts for Release

```bash
npm run release:patch   # Triggers GitHub workflow for patch release
npm run release:minor   # Triggers GitHub workflow for minor release
npm run release:major   # Triggers GitHub workflow for major release
npm run release:watch   # Watch running release workflow
```

## Manual Release Workflow (if needed)

1. Update @/CHANGELOG.md with all changes since last release
2. Bump version in @/package.json
3. Run full test suite: `npm test`
4. Commit: `git commit -m "chore: bump version to X.X.X"`
5. Create git tag: `git tag vX.X.X`
6. Push with tags: `git push && git push --tags`
7. Publish to npm: `npm publish`

## GitHub Actions

- Release workflow triggered via `gh workflow run "Manual Release"`
- Uses GitHub CLI (gh) for automation
- Workflow file location: Check .github/workflows/

## Package.json Key Fields

```json
{
  "name": "bmad-method",
  "version": "6.0.0-alpha.12",
  "bin": {
    "bmad": "tools/bmad-npx-wrapper.js",
    "bmad-method": "tools/bmad-npx-wrapper.js"
  },
  "main": "tools/cli/bmad-cli.js",
  "engines": { "node": ">=20.0.0" },
  "publishConfig": { "access": "public" }
}
```

## Pre-Release Checklist

- [ ] All tests pass: `npm test`
- [ ] CHANGELOG.md updated with all changes
- [ ] Version bumped in package.json
- [ ] No console.log debugging left in code
- [ ] Documentation updated for new features
- [ ] Breaking changes documented

## Relationships

- After ANY domain changes → check if CHANGELOG needs update
- Before deploy → run tests domain to validate everything
- After deploy → update docs if features changed
- Bundle changes → may need rebundle before release

---

## Domain Memories

<!-- Vexor appends deployment-specific learnings here -->
