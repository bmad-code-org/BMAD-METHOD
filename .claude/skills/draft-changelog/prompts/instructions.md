# Draft Changelog Execution

## Input
Project path (or run from project root)

## Step 1: Identify Current State
- Get the latest released tag
- Get current version
- Verify there are commits since the last release

## Step 2: Launch Explore Agent

Use `thoroughness: "very thorough"` to analyze all changes since the last release tag.

**Key: For each merge commit, look up the merged PR/issue that was closed.**
- Use `gh pr view` or git commit body to find the PR number
- Read the PR description and comments to understand full context
- Don't rely solely on commit merge messages - they lack context

**Analyze:**

1. **All merges/commits** since the last tag
2. **For each merge, read the original PR/issue** that was closed
3. **Files changed** with statistics
4. **Categorize changes:**
   - 🎁 **Features** - New functionality, new agents, new workflows
   - 🐛 **Bug Fixes** - Fixed bugs, corrected issues
   - ♻️ **Refactoring** - Code improvements, reorganization
   - 📚 **Documentation** - Docs updates, README changes
   - 🔧 **Maintenance** - Dependency updates, tooling, infrastructure
   - 💥 **Breaking Changes** - Changes that may affect users

**Provide:**
- Comprehensive summary of ALL changes with PR context
- Categorization of each change
- Identification of breaking changes
- Significance assessment (major/minor/trivial)

## Step 3: Generate Draft Changelog

Format:
```markdown
## v0.X.X - [Date]

* [Change 1 - categorized by type]
* [Change 2]
```

Guidelines:
- Present tense ("Fix bug" not "Fixed bug")
- Most significant changes first
- Group related changes
- Clear, concise language
- For breaking changes, clearly indicate impact

## Step 4: Present Draft

Show the draft with current version, last tag, commit count, and options to edit/retry.
