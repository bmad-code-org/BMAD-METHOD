# Release BMad Module Execution

## Input
Project path (or run from project root)

## Execution Steps

### Step 1: Get Current State
- Verify git working tree is clean
- Get latest tag and current version
- Check for unpushed commits

### Step 2: Get Changelog Entry

Ask the user for the changelog entry (from draft-changelog skill or manual).

### Step 3: Confirm Changelog

Show project name, current version, proposed next version, and changelog. Get confirmation.

### Step 4: Confirm Version Bump Type

Ask what type of bump: patch, minor, major, prerelease, or custom.

### Step 5: Update CHANGELOG.md

Insert new entry at top, commit, and push.

### Step 6: Bump Version

Run `npm version` to update package.json, create commit, and create tag.

### Step 7: Push Tag

Push the new version tag to GitHub.

### Step 8: Publish to npm

Publish the package.

### Step 9: Create GitHub Release

Create release with changelog notes using `gh release create`.

### Step 10: Create Social Announcement

Create a social media announcement file at `_bmad-output/social/{repo-name}-release.md`.

Format:
```markdown
# {name} v{version} Released

## Highlights
{2-3 bullet points of key features/changes}

## Links
- GitHub: {release-url}
- npm: {npm-url}
```

### Step 11: Confirm Completion

Show npm, GitHub, and social announcement file paths.

## Error Handling

Stop immediately on any step failure. Inform user and suggest fix.

## Important Notes

- Wait for user confirmation before destructive operations
- Push changelog commit before version bump
- Use explicit directory paths in commands
