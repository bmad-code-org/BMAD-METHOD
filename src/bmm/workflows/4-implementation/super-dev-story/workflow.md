# Super Dev Story v3.0 - Development with Quality Gates

<purpose>
Complete story development pipeline: dev-story → validation → code review → push.
Automatically re-invokes dev-story if gaps or review issues found.
Ensures production-ready code before pushing.
</purpose>

<philosophy>
**Quality Over Speed**

Don't just implement—verify, review, fix.
- Run dev-story for implementation
- Validate with gap analysis
- Code review for quality
- Fix issues before pushing
- Only push when truly ready
</philosophy>

<config>
name: super-dev-story
version: 3.0.0

stages:
  - dev-story: "Implement the story"
  - validate: "Run gap analysis"
  - review: "Code review"
  - push: "Safe commit and push"

defaults:
  max_rework_loops: 3
  auto_push: false
  review_depth: "standard"  # quick | standard | deep
  validation_depth: "quick"

quality_gates:
  validation_threshold: 90  # % tasks must be verified
  review_threshold: "pass"  # pass | pass_with_warnings
</config>

<execution_context>
@patterns/verification.md
@patterns/hospital-grade.md
</execution_context>

<process>

<step name="initialize" priority="first">
**Load story and prepare pipeline**

```bash
STORY_FILE="{{story_file}}"
[ -f "$STORY_FILE" ] || { echo "❌ story_file required"; exit 1; }
```

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 SUPER DEV STORY PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Story: {{story_key}}
Stages: dev-story → validate → review → push

Quality Gates:
- Validation: ≥{{validation_threshold}}% verified
- Review: {{review_threshold}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Initialize:
- rework_count = 0
- stage = "dev-story"
</step>

<step name="stage_dev_story">
**Stage 1: Implement the story**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 STAGE 1: DEV-STORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Invoke dev-story workflow:
```
/dev-story story_file={{story_file}}
```

Wait for completion. Capture:
- files_created
- files_modified
- tasks_completed

```
✅ Dev-story complete
Files: {{file_count}} created/modified
Tasks: {{tasks_completed}}/{{total_tasks}}
```
</step>

<step name="stage_validate">
**Stage 2: Validate implementation**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 STAGE 2: VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Invoke validation:
```
/validate scope=story target={{story_file}} depth={{validation_depth}}
```

Capture results:
- verified_pct
- false_positives
- category

**Check quality gate:**
```
if verified_pct < validation_threshold:
  REWORK_NEEDED = true
  reason = "Validation below {{validation_threshold}}%"

if false_positives > 0:
  REWORK_NEEDED = true
  reason = "{{false_positives}} tasks marked done but missing"
```

```
{{#if REWORK_NEEDED}}
⚠️ Validation failed: {{reason}}
{{else}}
✅ Validation passed: {{verified_pct}}% verified
{{/if}}
```
</step>

<step name="stage_review">
**Stage 3: Code review**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STAGE 3: CODE REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Invoke code review:
```
/multi-agent-review files={{files_modified}} depth={{review_depth}}
```

Capture results:
- verdict (PASS, PASS_WITH_WARNINGS, NEEDS_REWORK)
- issues

**Check quality gate:**
```
if verdict == "NEEDS_REWORK":
  REWORK_NEEDED = true
  reason = "Code review found blocking issues"

if review_threshold == "pass" AND verdict == "PASS_WITH_WARNINGS":
  REWORK_NEEDED = true
  reason = "Warnings not allowed in strict mode"
```

```
{{#if REWORK_NEEDED}}
⚠️ Review failed: {{reason}}
Issues: {{issues}}
{{else}}
✅ Review passed: {{verdict}}
{{/if}}
```
</step>

<step name="handle_rework" if="REWORK_NEEDED">
**Handle rework loop**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 REWORK REQUIRED (Loop {{rework_count + 1}}/{{max_rework_loops}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reason: {{reason}}

{{#if validation_issues}}
Validation Issues:
{{#each validation_issues}}
- {{this}}
{{/each}}
{{/if}}

{{#if review_issues}}
Review Issues:
{{#each review_issues}}
- {{this}}
{{/each}}
{{/if}}
```

**Check loop limit:**
```
rework_count++
if rework_count > max_rework_loops:
  echo "❌ Max rework loops exceeded"
  echo "Manual intervention required"
  HALT
```

**Re-invoke dev-story with issues:**
```
/dev-story story_file={{story_file}} fix_issues={{issues}}
```

After dev-story completes, return to validation stage.
</step>

<step name="stage_push" if="NOT REWORK_NEEDED">
**Stage 4: Push changes**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 STAGE 4: PUSH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Generate commit message from story:**
```
feat({{epic}}): {{story_title}}

- Implemented {{task_count}} tasks
- Verified: {{verified_pct}}%
- Review: {{verdict}}

Story: {{story_key}}
```

**If auto_push:**
```
/push-all commit_message="{{message}}" auto_push=true
```

**Otherwise, ask:**
```
Ready to push?

[Y] Yes, push now
[N] No, keep local (can push later)
[R] Review changes first
```
</step>

<step name="final_summary">
**Display pipeline results**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SUPER DEV STORY COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Story: {{story_key}}

Pipeline Results:
- Dev-Story: ✅ Complete
- Validation: ✅ {{verified_pct}}% verified
- Review: ✅ {{verdict}}
- Push: {{pushed ? "✅ Pushed" : "⏸️ Local only"}}

Rework Loops: {{rework_count}}
Files Changed: {{file_count}}
Commit: {{commit_hash}}

{{#if pushed}}
Branch: {{branch}}
Ready for PR: gh pr create
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

</process>

<examples>
```bash
# Standard pipeline
/super-dev-story story_file=docs/sprint-artifacts/2-5-auth.md

# With auto-push
/super-dev-story story_file=docs/sprint-artifacts/2-5-auth.md auto_push=true

# Strict review mode
/super-dev-story story_file=docs/sprint-artifacts/2-5-auth.md review_threshold=pass
```
</examples>

<failure_handling>
**Dev-story fails:** Report error, halt pipeline.
**Validation below threshold:** Enter rework loop.
**Review finds blocking issues:** Enter rework loop.
**Max rework loops exceeded:** Halt, require manual intervention.
**Push fails:** Report error, commit preserved locally.
</failure_handling>

<success_criteria>
- [ ] Dev-story completed
- [ ] Validation ≥ threshold
- [ ] Review passed
- [ ] Changes committed
- [ ] Pushed (if requested)
- [ ] Story status updated
</success_criteria>
