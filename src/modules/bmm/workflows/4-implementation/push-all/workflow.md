# Push All v3.0 - Safe Git Staging, Commit, and Push

<purpose>
Safely stage, commit, and push changes with comprehensive validation.
Detects secrets, large files, build artifacts. Handles push failures gracefully.
Supports targeted mode for specific files (parallel agent coordination).
</purpose>

<philosophy>
**Safe by Default, No Surprises**

- Validate BEFORE committing (secrets, size, artifacts)
- Show exactly what will be committed
- Handle push failures with recovery options
- Never force push without explicit confirmation
</philosophy>

<config>
name: push-all
version: 3.0.0

modes:
  full: "Stage all changes (default)"
  targeted: "Only stage specified files"

defaults:
  max_file_size_kb: 500
  check_secrets: true
  check_build_artifacts: true
  auto_push: false
  allow_force_push: false

secret_patterns:
  - "AKIA[0-9A-Z]{16}"          # AWS Access Key
  - "sk-[a-zA-Z0-9]{48}"        # OpenAI Key
  - "ghp_[a-zA-Z0-9]{36}"       # GitHub Personal Token
  - "xox[baprs]-[a-zA-Z0-9-]+"  # Slack Token
  - "-----BEGIN.*PRIVATE KEY"   # Private Keys
  - "password\\s*=\\s*['\"][^'\"]{8,}" # Hardcoded passwords

build_artifacts:
  - "node_modules/"
  - "dist/"
  - "build/"
  - ".next/"
  - "*.min.js"
  - "*.bundle.js"
</config>

<execution_context>
@patterns/hospital-grade.md
</execution_context>

<process>

<step name="check_git_state" priority="first">
**Verify git repository state**

```bash
# Check we're in a git repo
git rev-parse --is-inside-work-tree || { echo "❌ Not a git repository"; exit 1; }

# Get current branch
git branch --show-current

# Check for uncommitted changes
git status --porcelain
```

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 PUSH-ALL: {{mode}} mode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Branch: {{branch}}
Mode: {{mode}}
{{#if targeted}}Files: {{file_list}}{{/if}}
```

**If no changes:**
```
✅ Working directory clean - nothing to commit
```
Exit successfully.
</step>

<step name="scan_changes">
**Identify files to be staged**

**Full mode:**
```bash
git status --porcelain | awk '{print $2}'
```

**Targeted mode:**
Only include files specified in `target_files` parameter.

**Categorize changes:**
- New files (A)
- Modified files (M)
- Deleted files (D)
- Renamed files (R)
</step>

<step name="secret_scan" if="check_secrets">
**Scan for secrets in staged content**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 SECRET SCAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

For each file to be staged:
```bash
# Check for secret patterns
Grep: "{{pattern}}" {{file}}
```

**If secrets found:**
```
❌ POTENTIAL SECRETS DETECTED

{{#each secrets}}
File: {{file}}
Line {{line}}: {{preview}} (pattern: {{pattern_name}})
{{/each}}

⚠️ BLOCKING COMMIT
Remove secrets before proceeding.

Options:
[I] Ignore (I know what I'm doing)
[E] Exclude these files
[H] Halt
```

**If [I] selected:** Require explicit confirmation text.
</step>

<step name="size_scan">
**Check for oversized files**

```bash
# Find files larger than max_file_size_kb
find . -type f -size +{{max_file_size}}k -not -path "./.git/*"
```

**If large files found:**
```
⚠️ LARGE FILES DETECTED

{{#each large_files}}
- {{file}} ({{size_kb}}KB)
{{/each}}

Options:
[I] Include anyway
[E] Exclude large files
[H] Halt
```
</step>

<step name="artifact_scan" if="check_build_artifacts">
**Check for build artifacts**

```bash
# Check if any staged files match artifact patterns
git status --porcelain | grep -E "{{artifact_pattern}}"
```

**If artifacts found:**
```
⚠️ BUILD ARTIFACTS DETECTED

{{#each artifacts}}
- {{file}}
{{/each}}

These should typically be in .gitignore.

Options:
[E] Exclude artifacts (recommended)
[I] Include anyway
[H] Halt
```
</step>

<step name="preview_commit">
**Show what will be committed**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 COMMIT PREVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files to commit: {{count}}

Added ({{added_count}}):
{{#each added}}
  + {{file}}
{{/each}}

Modified ({{modified_count}}):
{{#each modified}}
  M {{file}}
{{/each}}

Deleted ({{deleted_count}}):
{{#each deleted}}
  - {{file}}
{{/each}}

{{#if excluded}}
Excluded: {{excluded_count}} files
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

<step name="get_commit_message">
**Generate or request commit message**

**If commit_message provided:** Use it.

**Otherwise, generate from changes:**
```
Analyzing changes to generate commit message...

Changes detected:
- {{summary_of_changes}}

Suggested message:
"{{generated_message}}"

[Y] Use this message
[E] Edit message
[C] Custom message
```

If user selects [C] or [E], prompt for message.
</step>

<step name="execute_commit">
**Stage and commit changes**

```bash
# Stage files (targeted or full)
{{#if targeted}}
git add {{#each target_files}}{{this}} {{/each}}
{{else}}
git add -A
{{/if}}

# Commit with message
git commit -m "{{commit_message}}"
```

**Verify commit:**
```bash
# Check commit was created
git log -1 --oneline
```

```
✅ Commit created: {{commit_hash}}
```
</step>

<step name="push_to_remote" if="auto_push OR user_confirms_push">
**Push to remote with error handling**

```bash
git push origin {{branch}}
```

**If push fails:**

**Case: Behind remote**
```
⚠️ Push rejected - branch is behind remote

Options:
[P] Pull and retry (git pull --rebase)
[F] Force push (DESTRUCTIVE - overwrites remote)
[H] Halt (commit preserved locally)
```

**Case: No upstream**
```
⚠️ No upstream branch

Setting upstream and pushing:
git push -u origin {{branch}}
```

**Case: Auth failure**
```
❌ Authentication failed

Check:
1. SSH key configured?
2. Token valid?
3. Repository access?
```

**Case: Protected branch**
```
❌ Cannot push to protected branch

Use pull request workflow instead:
gh pr create --title "{{commit_message}}"
```
</step>

<step name="final_summary">
**Display completion status**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PUSH-ALL COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Branch: {{branch}}
Commit: {{commit_hash}}
Files: {{file_count}}
{{#if pushed}}
Remote: ✅ Pushed to origin/{{branch}}
{{else}}
Remote: ⏸️ Not pushed (commit preserved locally)
{{/if}}

{{#if excluded_count > 0}}
Excluded: {{excluded_count}} files (secrets/artifacts/size)
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

</process>

<examples>
```bash
# Stage all, commit, and push
/push-all commit_message="feat: add user authentication" auto_push=true

# Targeted mode - only specific files
/push-all mode=targeted target_files="src/auth.ts,src/auth.test.ts" commit_message="fix: auth bug"

# Dry run - see what would be committed
/push-all auto_push=false
```
</examples>

<failure_handling>
**Secrets detected:** BLOCK commit, require explicit override.
**Large files:** Warn, allow exclude or include.
**Build artifacts:** Warn, recommend exclude.
**Push rejected:** Offer pull/rebase, force push (with confirmation), or halt.
**Auth failure:** Report, suggest troubleshooting.
</failure_handling>

<success_criteria>
- [ ] Changes validated (secrets, size, artifacts)
- [ ] Files staged correctly
- [ ] Commit created with message
- [ ] Push successful (if requested)
- [ ] No unintended files included
</success_criteria>
