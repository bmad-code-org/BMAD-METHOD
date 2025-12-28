# Autonomous Epic Processing

## Concept

**Full-auto epic completion** - Create and develop all stories in an epic with zero human intervention.

```
/auto-epic epic-2

→ Creates story 2.1 → Super-dev → Done
→ Creates story 2.2 → Super-dev → Done
→ Creates story 2.3 → Super-dev → Done
...
→ Entire epic complete! ✅
```

## Workflow

```
┌──────────────────────────────────────┐
│  Auto-Epic Processor                  │
│                                       │
│  1. Read epic definition              │
│  2. For each story in epic:           │
│     ├─ create-story                   │
│     ├─ super-dev-story                │
│     │  ├─ Pre gap analysis            │
│     │  ├─ Development                 │
│     │  ├─ Post gap analysis           │
│     │  ├─ Code review                 │
│     │  └─ Fix issues                  │
│     └─ Mark done                      │
│  3. Epic retrospective                │
│  4. Report completion                 │
└──────────────────────────────────────┘
```

## Use Cases

### 1. Overnight Processing
```bash
# Start before leaving office
/auto-epic epic-3

# Come back next morning
# → Epic 100% complete
```

### 2. CI/CD Integration
```bash
# In GitHub Actions
bmad auto-epic epic-2 --config production.yaml
```

### 3. Batch Sprints
```bash
# Process multiple epics
/auto-epic epic-1,epic-2,epic-3
```

## Configuration

```yaml
# _bmad/bmm/config.yaml

autonomous_mode:
  enabled: true

  # Fail behavior
  halt_on_error: false        # Continue even if story fails
  max_retry_per_story: 3      # Retry failed stories

  # Quality gates
  require_super_dev: true     # Use super-dev for all stories
  require_100_percent: false  # Require 100% test coverage

  # Notification
  notify_on_complete: true    # Send notification when done
  notify_webhook: ""          # Slack/Discord webhook
```

## Safety

### Validation Before Start

```
Autonomous processing will:
- Create 15 stories
- Develop all automatically
- Take approximately 8 hours
- Commit all changes to: feature/epic-2-auto

Confirm? [Y/n]:
```

### Checkpoints

- Creates git branch for the epic
- Commits after each story
- Saves progress if interrupted
- Can resume from last completed story

### Rollback

```bash
# If something goes wrong
/auto-epic rollback epic-2

# Restores to pre-processing state
```

## Example Output

```
🤖 AUTONOMOUS EPIC PROCESSING: Epic 2 - User Management

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Story 2.1: User Registration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ create-story complete
✅ Pre-gap analysis: 0 changes needed
✅ Development: 8 tasks completed
✅ Post-gap analysis: All verified
✅ Code review: 2 minor issues found
✅ Fixes applied
✅ Story 2.1 DONE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Story 2.2: User Login
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ create-story complete
✅ Pre-gap analysis: Reuse registration code
✅ Development: 6 tasks completed
✅ Post-gap analysis: All verified
✅ Code review: No issues
✅ Story 2.2 DONE

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EPIC 2 COMPLETE! 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stories completed: 15/15
Total time: 7h 23m
Test coverage: 94%
Code review issues: 12 (all fixed)

Branch: feature/epic-2-auto
Ready to merge!
```

## Implementation Status

- ✅ **IMPLEMENTED** in BMAD v6.0.0-alpha.22+
- Available as: `/autonomous-epic` workflow
- Requires: Gap analysis and super-dev-story workflows
- Status: Ready for testing and feedback

## Usage

```bash
# Load any BMAD agent (PM, Dev, SM)
/autonomous-epic

# Or specify epic number directly:
/autonomous-epic 2
```

See [autonomous-epic workflow README](../src/modules/bmm/workflows/4-implementation/autonomous-epic/README.md) for complete documentation.

## Real-World Usage

**This is production-ready but experimental.** We recommend:
1. Test with small epics first (3-5 stories)
2. Monitor token usage and quality
3. Review completion reports thoroughly
4. Provide feedback to improve the feature

## Contributing

Found issues or have improvements?

See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**The future is NOW: Tell BMAD "Do Epic 4" and come back when it's done** ✨
