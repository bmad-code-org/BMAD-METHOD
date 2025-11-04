# Update Memory Bank

This workflow helps maintain and update the Kilocode Memory Bank documentation to keep the AI context current with project changes.

## When to Run This Workflow

Update the Memory Bank after:

- Significant architectural changes
- New features or modules added
- Major refactoring or restructuring
- Technology stack changes
- Development process updates
- Completion of major milestones

**Frequency**: After every significant change or weekly for active projects

## Memory Bank Files

The Memory Bank consists of 5 core files in `.kilocode/rules/memory-bank/`:

1. **brief.md** - High-level project overview (changes rarely)
2. **product.md** - Problem statements and user goals (changes occasionally)
3. **context.md** - Current work focus and recent changes (changes frequently)
4. **architecture.md** - System design and technical decisions (changes with architecture)
5. **tech.md** - Technologies and setup (changes with tech stack)

## Update Workflow

### Step 1: Review Current Context

First, review what has changed since the last update:

```bash
git log --oneline --since="1 week ago"
```

Note the key changes:
- New features added
- Bug fixes
- Refactoring
- Architecture changes
- Dependency updates

### Step 2: Identify Affected Files

Determine which Memory Bank files need updates:

| Changed Area | Files to Update |
|--------------|----------------|
| New features/capabilities | `brief.md`, `context.md` |
| Architecture changes | `architecture.md`, `context.md` |
| Tech stack changes | `tech.md`, `context.md` |
| Process changes | `context.md`, `product.md` |
| Documentation | `context.md` |

### Step 3: Update context.md (Most Frequent)

**Current Development Context** - Always update this section:

```markdown
## Active Development Focus

**Branch**: [current branch name]
**Status**: [current status]

## Recent Major Changes

### [Date or Version]
- [Change 1]
- [Change 2]
- [Change 3]

## Current Work Areas

1. **[Area 1]**: [Description]
2. **[Area 2]**: [Description]

## Next Priorities

1. [Priority 1]
2. [Priority 2]
```

Use `read_file()` to load current `context.md`, then `edit()` to update specific sections.

### Step 4: Update architecture.md (As Needed)

Update when:
- New components or modules added
- Integration points change
- Data flow modifications
- Performance optimizations
- Security changes

**Sections to Review**:
- System Design diagrams
- Core Components descriptions
- Technical Decisions rationale
- Integration Points
- Data Flow

### Step 5: Update tech.md (Tech Stack Changes)

Update when:
- New dependencies added
- Version upgrades (major)
- New tools introduced
- Build process changes
- Deployment process changes

**Sections to Review**:
- Dependencies list
- Technology versions
- Development setup
- Build & deployment

### Step 6: Update product.md (Product Evolution)

Update when:
- Problem statement evolves
- New target users identified
- User experience goals change
- Key features added
- Product strategy shifts

### Step 7: Update brief.md (Major Changes Only)

Update when:
- Project mission changes
- Core philosophy evolves
- Major restructuring
- New modules added
- Rebranding or renaming

### Step 8: Validate Updates

After updating, verify:

1. **Consistency**: All files align with each other
2. **Accuracy**: Information reflects current state
3. **Completeness**: All major changes documented
4. **Clarity**: Explanations are clear and concise

### Step 9: Test with AI

Start a new AI session and check:

```
[Memory Bank: Active]
```

Message should appear with accurate context summary.

Ask the AI to explain:
- Current project status
- Recent changes
- Architecture overview
- Technology stack

Verify responses align with your updates.

### Step 10: Commit Changes

Commit the Memory Bank updates:

```bash
git add .kilocode/rules/memory-bank/
git commit -m "docs: update Memory Bank with [brief description]"
```

## Quick Update Template

For rapid updates to `context.md`:

```markdown
## Recent Major Changes

### [YYYY-MM-DD]
**Summary**: [One-line summary]

**Changes**:
- [Change 1]: [Brief description]
- [Change 2]: [Brief description]
- [Change 3]: [Brief description]

**Impact**: [How this affects development]

**Next Steps**: [What comes next]
```

## Detailed Update Process

### For context.md

1. **Read current file**: `read_file(".kilocode/rules/memory-bank/context.md")`
2. **Update sections**:
   - Move "Current Work Areas" to "Recent Major Changes" if complete
   - Add new current work to "Current Work Areas"
   - Update "Known Constraints" if relevant
   - Update "Next Priorities"
3. **Add timestamp**: Include date for time context
4. **Save changes**: Use `edit()` tool

### For architecture.md

1. **Review architecture changes**: Check code structure
2. **Update diagrams**: If visual representations changed
3. **Document decisions**: Add new ADRs (Architecture Decision Records)
4. **Update integration points**: If APIs or interfaces changed
5. **Revise data flow**: If data handling changed

### For tech.md

1. **Check package.json**: For dependency changes
2. **Review build config**: For tooling changes
3. **Update versions**: Document version upgrades
4. **Add new tools**: Document new development tools
5. **Update setup**: If setup process changed

## Automation Opportunities

Consider automating updates for:

- **Git hooks**: Prompt for Memory Bank update after major commits
- **CI/CD**: Generate change summaries automatically
- **Version tags**: Update Memory Bank as part of release process
- **Weekly reminder**: Calendar reminder to review Memory Bank

## Best Practices

1. **Update frequently**: Don't let it get stale
2. **Be concise**: Focus on what's important for AI context
3. **Stay current**: Remove outdated information
4. **Be specific**: Vague descriptions don't help
5. **Think ahead**: What will future you or AI need to know?
6. **Version awareness**: Note which version/branch info applies to
7. **Consistency**: Use similar formatting across files

## Common Mistakes to Avoid

1. **Too much detail**: Memory Bank is context, not full documentation
2. **Outdated info**: Leaving old information creates confusion
3. **Inconsistency**: Contradictions between files
4. **No dates**: Hard to know when something changed
5. **Missing rationale**: Document why, not just what
6. **Forgetting context.md**: Most frequently needs updates

## Example Update Scenarios

### Scenario 1: New Feature Added

Files to update:
- `context.md` - Add to "Current Work Areas" or "Recent Major Changes"
- `brief.md` - If major feature, add to overview
- `architecture.md` - If architectural impact

### Scenario 2: Technology Change

Files to update:
- `tech.md` - Update dependencies and versions
- `context.md` - Note the change and impact
- `architecture.md` - If affects architecture

### Scenario 3: Process Improvement

Files to update:
- `context.md` - Document new process
- `product.md` - If affects user experience
- `architecture.md` - If affects technical flow

## Verification Checklist

After updating Memory Bank:

- [ ] All changed areas documented
- [ ] Dates/versions included
- [ ] Files internally consistent
- [ ] Outdated info removed or updated
- [ ] Clear and concise language
- [ ] Tested with new AI session
- [ ] Changes committed to git

## Resources

- [Kilocode Memory Bank Docs](https://kilocode.ai/docs/advanced-usage/memory-bank)
- [Memory Bank Files](./.kilocode/rules/memory-bank/)
- [Project README](./README.md)
- [CHANGELOG](./CHANGELOG.md)

## Next Steps

- Set calendar reminder for next Memory Bank review
- Consider automating parts of this process
- Share updated context with team
- Monitor AI's understanding in next sessions
