# release-module

Automates the complete release process for npm modules.

## Usage

Run from project root or pass project path:
```
bmad-utility-skills:release-module
```

## Prerequisite

First run `draft-changelog` to analyze changes and create a draft changelog.

## What It Does

1. Gets and confirms changelog entry
2. Confirms version bump type (patch/minor/major)
3. Updates CHANGELOG.md
4. Bumps version with `npm version`
5. Pushes git tag
6. Publishes to npm
7. Creates GitHub release
