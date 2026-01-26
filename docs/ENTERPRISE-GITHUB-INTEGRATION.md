---
title: Enterprise BMAD - GitHub Issues Integration Plan
description: Complete plan for transforming BMAD into an enterprise-scale team collaboration system with GitHub Issues integration
---

# Enterprise BMAD: Complete GitHub Issues Integration Plan

**Vision**: Transform BMAD into "the killer feature for using BMAD across an Enterprise team at scale effectively and without constantly stepping on each other's toes"

**Team Size**: 5-15 developers working in parallel
**Source of Truth**: GitHub Issues (with local cache for LLM performance)
**Network**: Required (AI coding needs internet anyway - simplified architecture)

---

## Problem Statement

**Current State**: BMAD optimized for single developer

- File-based state (sprint-status.yaml on each machine)
- No coordination between developers
- Multiple devs can work on same story → duplicate work, merge conflicts
- No real-time progress visibility for Product Owners
- sprint-status.yaml merge conflicts when multiple devs push

**Target State**: Enterprise team coordination platform

- GitHub Issues = centralized source of truth
- Story-level locking prevents duplicate work
- Real-time progress visibility for all roles
- Product Owners manage backlog via GitHub UI + Claude Desktop
- Zero merge conflicts through atomic operations

---

## Architecture: Three-Tier System

```
┌─────────────────────────────────────────────────────────────┐
│ TIER 1: GitHub Issues (Source of Truth)                     │
│                                                              │
│ Stores: Status, Locks (assignee), Labels, Progress          │
│ Purpose: Multi-developer coordination, PO workspace          │
│ API: GitHub MCP (mcp__github__*)                            │
│ Latency: 100-300ms per call                                 │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓ Smart Sync (incremental, timestamp-based)
             │
┌────────────┴────────────────────────────────────────────────┐
│ TIER 2: Local Cache (Performance)                           │
│                                                              │
│ Stores: Full 12-section BMAD story content                  │
│ Purpose: Fast LLM Read tool access                          │
│ Access: Instant (<100ms vs 2-3s API)                       │
│ Sync: Every 5 min OR on-demand (checkout, commit)          │
│ Location: {output}/cache/stories/*.md                       │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓ Committed after story completion
             │
┌────────────┴────────────────────────────────────────────────┐
│ TIER 3: Git Repository (Audit Trail)                        │
│                                                              │
│ Stores: Historical story files, implementation code          │
│ Purpose: Version control, audit compliance                   │
│ Access: Git history                                          │
└─────────────────────────────────────────────────────────────┘
```

**Key Principle**: GitHub coordinates (who, when, status), Cache optimizes (fast reads), Git archives (history).

---

## Core Components (Priority Order)

### 🔴 CRITICAL - Phase 1 (Weeks 1-2): Foundation

#### 1.1 Smart Cache System

**Purpose**: Fast LLM access while GitHub is source of truth

**What**: Timestamp-based incremental sync that only fetches changed stories

**Implementation**:

**Files to Create**:

1. `src/modules/bmm/lib/cache/cache-manager.js` (300 lines)
   - readStoryFromCache() - With staleness check
   - writeStoryToCache() - Atomic writes
   - invalidateCache() - Force refresh
   - getCacheAge() - Staleness calculation

2. `src/modules/bmm/lib/cache/sync-engine.js` (400 lines)
   - incrementalSync() - Fetch only changed stories
   - fullSync() - Initial cache population
   - preFetchEpic() - Batch fetch for context
   - syncStory() - Individual story sync

3. `{output}/cache/.bmad-cache-meta.json` (auto-generated)

   ```json
   {
     "last_sync": "2026-01-08T15:30:00Z",
     "stories": {
       "2-5-auth": {
         "github_issue": 105,
         "github_updated_at": "2026-01-08T15:29:00Z",
         "cache_timestamp": "2026-01-08T15:30:00Z",
         "local_hash": "sha256:abc...",
         "locked_by": "jonahschulte",
         "locked_until": "2026-01-08T23:30:00Z"
       }
     }
   }
   ```

**Sync Algorithm**:

```javascript
// Called every 5 minutes OR on-demand
async function incrementalSync() {
  const lastSync = loadCacheMeta().last_sync;

  // Single API call for all changed stories
  const updated = await github.search({
    query: `repo:${owner}/${repo} label:type:story updated:>${lastSync}`
  });

  console.log(`Found ${updated.length} changed stories`); // Typically 1-3

  // Fetch only changed stories
  for (const issue of updated) {
    const storyKey = extractStoryKey(issue);
    const content = await convertIssueToStoryFile(issue);
    await writeCacheFile(storyKey, content);
    updateCacheMeta(storyKey, issue.updated_at);
  }
}
```

**Performance**: 97% API call reduction (500/hour → 15/hour)

**Critical Feature**: Pre-fetch epic on checkout

```javascript
async function checkoutStory(storyKey) {
  // Get epic number from story key
  const epicNum = storyKey.split('-')[0]; // "2-5-auth" → "2"

  // Batch fetch ALL stories in epic (single API call)
  const epicStories = await github.search({
    query: `repo:${owner}/${repo} label:epic:${epicNum}`
  });

  // Cache all stories (gives LLM full epic context)
  for (const story of epicStories) {
    await cacheStory(story);
  }

  // Now developer has instant access to all related stories via Read tool
}
```

---

#### 1.2 Story Locking System

**Purpose**: Prevent 2+ developers from working on same story (duplicate work prevention)

**What**: Dual-lock strategy (GitHub assignment + local lock file)

**Files to Create**:

1. `src/modules/bmm/workflows/4-implementation/checkout-story/workflow.yaml`
2. `src/modules/bmm/workflows/4-implementation/checkout-story/instructions.md`
3. `src/modules/bmm/workflows/4-implementation/unlock-story/workflow.yaml`
4. `src/modules/bmm/workflows/4-implementation/unlock-story/instructions.md`
5. `src/modules/bmm/workflows/4-implementation/available-stories/workflow.yaml`
6. `src/modules/bmm/workflows/4-implementation/lock-status/workflow.yaml`
7. `.bmad/lock-registry.yaml`

**Lock Mechanism**:

```javascript
// /checkout-story story_key=2-5-auth

async function checkoutStory(storyKey) {
  // 1. Check GitHub lock (distributed coordination)
  const issue = await github.getIssue(storyKey);
  if (issue.assignee && issue.assignee !== currentUser) {
    throw new Error(
      `🔒 Story locked by @${issue.assignee.login}\n` +
      `Since: ${issue.updated_at}\n` +
      `Try: /available-stories to see unlocked stories`
    );
  }

  // 2. Atomic local lock (race condition safe)
  const lockFile = `.bmad/locks/${storyKey}.lock`;
  await atomicCreateLockFile(lockFile, {
    locked_by: currentUser,
    locked_at: now(),
    timeout_at: now() + (8 * 3600000), // 8 hours
    last_heartbeat: now(),
    github_issue: issue.number
  });

  // 3. Assign GitHub issue (write-through)
  await retryWithBackoff(async () => {
    await github.assign(issue.number, currentUser);
    await github.addLabel(issue.number, 'status:in-progress');

    // Verify assignment succeeded
    const verify = await github.getIssue(issue.number);
    if (!verify.assignees.includes(currentUser)) {
      throw new Error('Assignment verification failed');
    }
  });

  // 4. Pre-fetch epic context
  await preFetchEpic(extractEpic(storyKey));

  console.log(`✅ Story checked out: ${storyKey}`);
  console.log(`Lock expires: ${formatTime(8hours from now)}`);
}
```

**Lock Verification** (before each task in super-dev-pipeline):

```javascript
// Integrated into step-03-implement.md
async function verifyLockBeforeTask(storyKey) {
  // Check local lock
  const lock = readLockFile(storyKey);
  if (lock.timeout_at < now()) {
    throw new Error('Lock expired - run /checkout-story again');
  }

  // Check GitHub assignment (paranoid verification)
  const issue = await github.getIssue(storyKey);
  if (issue.assignee?.login !== currentUser) {
    throw new Error(`Lock stolen - now assigned to ${issue.assignee.login}`);
  }

  // Refresh heartbeat
  lock.last_heartbeat = now();
  await updateLockFile(storyKey, lock);

  console.log('✅ Lock verified');
}
```

**Lock Timeout**: 8 hours (full workday), heartbeat every 30 min during implementation, stale after 15 min no heartbeat

**Scrum Master Override**:

```bash
# SM can force-unlock stale locks
/unlock-story story_key=2-5-auth --force --reason="Developer offline, story blocking sprint"
```

---

#### 1.3 Progress Sync Integration

**Purpose**: Real-time visibility into who's working on what

**Files to Modify**:

1. `src/modules/bmm/workflows/4-implementation/dev-story/instructions.xml` (Step 8, lines 502-533)
2. `src/modules/bmm/workflows/4-implementation/super-dev-pipeline/steps/step-03-implement.md`
3. `src/modules/bmm/workflows/4-implementation/batch-super-dev/step-4.5-reconcile-story-status.md`

**Add After Task Completion**:

```javascript
// After marking task [x] in story file
async function syncTaskToGitHub(storyKey, taskData) {
  // 1. Update local cache
  updateCacheFile(storyKey, taskData);

  // 2. Write-through to GitHub
  await retryWithBackoff(async () => {
    await github.addComment(issue,
      `Task ${taskData.num} complete: ${taskData.description}\n\n` +
      `Progress: ${taskData.checked}/${taskData.total} tasks (${taskData.pct}%)`
    );
  });

  // 3. Update sprint-status.yaml
  updateSprintStatus(storyKey, {
    status: 'in-progress',
    progress: `${taskData.checked}/${taskData.total} tasks (${taskData.pct}%)`
  });

  console.log(`✅ Progress synced to GitHub Issue #${issue}`);
}
```

**Result**: POs see progress updates in GitHub within seconds of task completion

---

### 🟠 HIGH PRIORITY - Phase 2 (Weeks 3-4): Product Owner Enablement

#### 2.1 PO Agent & Workflows

**Purpose**: Enable POs to manage backlog via Claude Desktop + GitHub

**Files to Create**:

1. `src/modules/bmm/agents/po.agent.yaml` - PO agent definition
2. `src/modules/bmm/workflows/po/new-story/workflow.yaml` - Create story in GitHub
3. `src/modules/bmm/workflows/po/update-story/workflow.yaml` - Modify ACs
4. `src/modules/bmm/workflows/po/dashboard/workflow.yaml` - Sprint metrics
5. `src/modules/bmm/workflows/po/approve-story/workflow.yaml` - Sign-off completed work
6. `src/modules/bmm/workflows/po/sync-from-github/workflow.yaml` - Pull GitHub changes to cache
7. `.github/ISSUE_TEMPLATE/bmad-story.md` - Issue template

**PO Agent Menu**:

```yaml
menu:
  - trigger: NS
    workflow: new-story
    description: "[NS] Create new story in GitHub Issues"

  - trigger: US
    workflow: update-story
    description: "[US] Update story ACs or details"

  - trigger: DS
    workflow: dashboard
    description: "[DS] View sprint progress dashboard"

  - trigger: AP
    workflow: approve-story
    description: "[AP] Approve completed story"

  - trigger: SY
    workflow: sync-from-github
    description: "[SY] Sync changes from GitHub to local"
```

**Story Creation Flow** (PO via Claude Desktop):

```
PO: "Create story for password reset"

Claude (PO Agent):
1. Interactive prompts for user story components
2. Guides through BDD acceptance criteria
3. Creates GitHub Issue with proper labels/template
4. Syncs to local cache: {cache}/stories/2-6-password-reset.md
5. Updates sprint-status.yaml: "2-6-password-reset: backlog"

Result:
- GitHub Issue #156 created
- Local file synced
- Developers see it in /available-stories
```

**AC Update with Developer Alert**:

```
PO: "Update AC3 in Story 2-5 - change timeout to 30 min"

Claude (PO Agent):
1. Detects story status: in-progress (assigned to @developerA)
2. Warns: "Story is being worked on - changes may impact current work"
3. Updates GitHub Issue #105 AC
4. Adds comment: "@developerA - AC updated by PO (timeout 15m → 30m)"
5. Syncs to cache within 5 minutes
6. Developer gets notification

Result:
- PO can update requirements anytime
- Developer notified immediately via GitHub
- Changes validated against BMAD format before sync
```

---

### 🟡 MEDIUM PRIORITY - Phase 3 (Weeks 5-6): Advanced Integration

#### 3.1 PR Linking & Completion Flow

**Purpose**: Close the loop from issue → implementation → PR → approval

**Files to Modify**:

1. `super-dev-pipeline/steps/step-06-complete.md` - Add PR creation
2. Add new: `super-dev-pipeline/steps/step-07-sync-github.md`

**PR Creation** (after git commit):

```javascript
// In step-06-complete after commit succeeds
async function createPRForStory(storyKey, commitSha) {
  const story = getCachedStory(storyKey);
  const issue = await github.getIssue(story.github_issue);

  // Create PR via GitHub MCP
  const pr = await github.createPR({
    title: `Story ${storyKey}: ${story.title}`,
    body:
      `Implements Story ${storyKey}\n\n` +
      `## Acceptance Criteria\n${formatACs(story.acs)}\n\n` +
      `## Implementation Summary\n${story.devAgentRecord.summary}\n\n` +
      `Closes #${issue.number}`,
    head: currentBranch,
    base: 'main',
    labels: ['type:story', `story:${storyKey}`]
  });

  // Link PR to issue
  await github.addComment(issue.number,
    `✅ Implementation complete\n\nPR: #${pr.number}\nCommit: ${commitSha}`
  );

  // Update issue label
  await github.addLabel(issue.number, 'status:in-review');
}
```

#### 3.2 Epic Dashboard

**File to Create**: `src/modules/bmm/workflows/po/epic-dashboard/workflow.yaml`

**Purpose**: Real-time epic health for POs/stakeholders

**Metrics Displayed**:

- Story completion: 5/8 done (62%)
- Developer assignments: @alice (2 stories), @bob (1 story)
- Blockers: 1 story waiting on design
- Velocity: 1.5 stories/week
- Projected completion: Jan 15, 2026

**Data Sources**:

- GitHub Issues API (status, assignees, labels)
- Cache metadata (progress percentages)
- Git commit history (activity metrics)

---

### 🟢 NICE TO HAVE - Phase 4 (Weeks 7-8): Polish

#### 4.1 Ghost Feature → GitHub Integration

**File to Modify**: `detect-ghost-features/instructions.md`

**Enhancement**: Auto-create GitHub Issues for orphaned code

```markdown
When orphan detected:
1. Generate backfill story (already implemented)
2. Create GitHub Issue with label: "type:backfill"
3. Add to sprint-status.yaml
4. Link to orphaned files in codebase
```

#### 4.2 Revalidation → GitHub Reporting

**Files to Modify**:

- `revalidate-story/instructions.md`
- `revalidate-epic/instructions.md`

**Enhancement**: Post verification results to GitHub

```javascript
async function revalidateStory(storyKey) {
  // ... existing revalidation logic ...

  // NEW: Post results to GitHub
  await github.addComment(issue,
    `📊 Revalidation Complete\n\n` +
    `Verified: ${verified}/25 items (${pct}%)\n` +
    `Gaps: ${gaps.length}\n\n` +
    `Details: ${reportURL}`
  );
}
```

---

## Implementation Details

### Mandatory Pre-Workflow Sync (Reliability Guarantee)

**Enforced in workflow engine** - Cannot be bypassed:

```xml
<!-- In core/tasks/workflow.xml - runs BEFORE any workflow Step 1 -->
<before-workflow>
  <check if="github_integration.enabled == true">
    <critical>MANDATORY GITHUB SYNC - Required for team coordination</critical>

    <action>Call: incrementalSync()</action>

    <check if="sync failed">
      <retry count="3" backoff="[1s, 3s, 9s]">
        <action>Retry incrementalSync()</action>
      </retry>

      <check if="still failing">
        <output>
❌ CRITICAL: Cannot sync with GitHub

Network check: {{network_status}}
GitHub API: {{github_api_status}}
Last successful sync: {{last_sync_time}}

Cannot proceed without current data - risk of duplicate work.

Options:
[R] Retry sync
[H] Halt workflow

This is a HARD REQUIREMENT for team coordination.
        </output>
        <action>HALT</action>
      </check>
    </check>

    <output>✅ Synced from GitHub: {{stories_updated}} stories updated</output>
  </check>
</before-workflow>
```

**This guarantees**: Every workflow starts with fresh GitHub data (no stale cache issues)

---

### Story Lifecycle with GitHub Integration

```
┌─────────────────────────────────────────────────────────────┐
│ 1. STORY CREATION (PO via Claude Desktop)                   │
├─────────────────────────────────────────────────────────────┤
│ PO: /new-story                                              │
│  ↓                                                           │
│ Create GitHub Issue #156                                    │
│  ├─ Labels: type:story, status:backlog, epic:2             │
│  ├─ Body: User story + BDD ACs                             │
│  └─ Assignee: none (unlocked)                              │
│  ↓                                                           │
│ Sync to cache: 2-6-password-reset.md                       │
│  ↓                                                           │
│ Update sprint-status.yaml: "2-6-password-reset: backlog"   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. STORY CHECKOUT (Developer)                               │
├─────────────────────────────────────────────────────────────┤
│ Dev: /checkout-story story_key=2-6-password-reset          │
│  ↓                                                           │
│ Check GitHub: Issue #156 assignee = null ✓                 │
│  ↓                                                           │
│ Assign issue to @developerA                                │
│  ├─ Assignee: @developerA                                  │
│  ├─ Label: status:in-progress                              │
│  └─ Comment: "🔒 Locked by @developerA (expires 8h)"      │
│  ↓                                                           │
│ Create local lock: .bmad/locks/2-6-password-reset.lock     │
│  ↓                                                           │
│ Pre-fetch Epic 2 stories (8 stories, 1 API call)           │
│  ↓                                                           │
│ Cache all Epic 2 stories locally                           │
│  ↓                                                           │
│ Return: cache/stories/2-6-password-reset.md                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. IMPLEMENTATION (Developer via super-dev-pipeline)         │
├─────────────────────────────────────────────────────────────┤
│ Step 1: Init                                                │
│  └─ Verify lock held (HALT if lost)                        │
│                                                             │
│ Step 2: Pre-Gap Analysis                                   │
│  └─ Comment to GitHub: "Step 2/7: Pre-Gap Analysis"       │
│                                                             │
│ Step 3: Implement (for each task)                          │
│  ├─ BEFORE task: Verify lock still held                   │
│  ├─ AFTER task: Sync progress to GitHub                   │
│  │   └─ Comment: "Task 3/10 complete (30%)"              │
│  └─ Refresh heartbeat every 30 min                        │
│                                                             │
│ Step 4: Post-Validation                                    │
│  └─ Comment to GitHub: "Step 4/7: Post-Validation"        │
│                                                             │
│ Step 5: Code Review                                        │
│  └─ Comment to GitHub: "Step 5/7: Code Review"            │
│                                                             │
│ Step 6: Complete                                           │
│  ├─ Commit: "feat(story-2-6): implement password reset"   │
│  ├─ Create GitHub PR #789                                 │
│  │   └─ Body: "Closes #156"                               │
│  ├─ Update Issue #156:                                    │
│  │   ├─ Comment: "✅ Implementation complete - PR #789"   │
│  │   ├─ Label: status:in-review                           │
│  │   └─ Keep assignee (dev owns until approved)           │
│  └─ Update cache & sprint-status                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. APPROVAL (PO via GitHub or Claude Desktop)               │
├─────────────────────────────────────────────────────────────┤
│ PO reviews PR #789 on GitHub                                │
│  ↓                                                           │
│ PO: /approve-story story_key=2-6-password-reset            │
│  ├─ Reviews ACs in GitHub Issue                            │
│  ├─ Tests implementation                                   │
│  └─ Approves or requests changes                           │
│  ↓                                                           │
│ If approved:                                                │
│  ├─ Merge PR #789                                          │
│  ├─ Close Issue #156                                       │
│  ├─ Label: status:done                                     │
│  ├─ Unassign developer                                     │
│  └─ Comment: "✅ Approved by @productOwner"               │
│  ↓                                                           │
│ Sync to cache & sprint-status:                             │
│  ├─ cache/stories/2-6-password-reset.md updated            │
│  └─ sprint-status: "2-6-password-reset: done"             │
└─────────────────────────────────────────────────────────────┘
```

---

## Reliability Guarantees (Building on migrate-to-github)

### 1. Idempotent Operations

**Pattern**: Check before create/update

```javascript
// Can run multiple times safely
async function createOrUpdateStory(storyKey, data) {
  const existing = await github.searchIssue(`label:story:${storyKey}`);

  if (existing) {
    await github.updateIssue(existing.number, data);
  } else {
    await github.createIssue(data);
  }
}
```

### 2. Atomic Per-Story Operations

**Pattern**: Transaction with rollback

```javascript
async function migrateStory(storyKey) {
  const transaction = { operations: [], rollback: [] };

  try {
    const issue = await github.createIssue(...);
    transaction.rollback.push(() => github.closeIssue(issue.number));

    await github.addLabels(issue.number, labels);
    await github.setMilestone(issue.number, epic);

    // Verify all succeeded
    await verifyIssue(issue.number);

  } catch (error) {
    // Rollback all operations
    for (const rollback of transaction.rollback.reverse()) {
      await rollback();
    }
    throw error;
  }
}
```

### 3. Write Verification

**Pattern**: Read-back after write

```javascript
async function createIssueVerified(data) {
  const created = await github.createIssue(data);

  await sleep(1000); // GitHub eventual consistency

  const verify = await github.getIssue(created.number);
  assert(verify.title === data.title);
  assert(verify.labels.includes('type:story'));

  return created;
}
```

### 4. Retry with Backoff

**Pattern**: 3 retries, exponential backoff [1s, 3s, 9s]

```javascript
async function retryWithBackoff(operation) {
  const backoffs = [1000, 3000, 9000];

  for (let i = 0; i < backoffs.length; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i < backoffs.length - 1) {
        await sleep(backoffs[i]);
      } else {
        throw error; // All retries exhausted
      }
    }
  }
}
```

### 5. Network Required (Simplified from Original Plan)

**Key Insight**: AI coding requires internet, so no complex offline queue needed

**Network Failure Handling**:

```javascript
// Simple retry + halt (not queue for later)
try {
  await syncToGitHub(data);
} catch (networkError) {
  console.error('❌ GitHub sync failed - check network');
  console.error('Retrying in 3s...');

  await retryWithBackoff(() => syncToGitHub(data));

  // If still failing after retries:
  throw new Error(
    'HALT: Cannot proceed without GitHub sync.\n' +
    'Network is required for team coordination.\n' +
    'Resume when network restored.'
  );
}
```

**No Offline Queue**: Since network is required for AI coding, network failures = halt and fix, not queue for later sync. Simpler architecture, fewer edge cases.

---

## Critical Integration Points

### Point 1: batch-super-dev Story Selection

**File**: `batch-super-dev/instructions.md` (Step 2)
**Change**: Filter locked stories BEFORE user selection

```xml
<step n="2" goal="Display available stories">
  <!-- NEW: Sync from GitHub first -->
  <action>Call: incrementalSync()</action>

  <action>Load sprint-status.yaml</action>
  <action>Filter: status = ready-for-dev</action>

  <!-- NEW: Exclude locked stories -->
  <action>Load cache metadata</action>
  <action>For each story, check: assignee == null (unlocked)</action>
  <action>Split into: available_stories, locked_stories</action>

  <output>
📦 Available Stories (Unlocked) - {{available_count}}
{{#each available_stories}}
{{@index}}. {{story_key}}: {{title}}
{{/each}}

🔒 Locked Stories (Skip These) - {{locked_count}}
{{#each locked_stories}}
- {{story_key}}: Locked by @{{locked_by}} ({{duration}} ago)
{{/each}}
  </output>
</step>

<step n="3" goal="User selection">
  <!-- User selects from AVAILABLE stories only -->

  <!-- NEW: Checkout selected stories -->
  <action>For each selected story:</action>
  <action>  Call: checkoutStory(story_key)</action>
  <action>  Verify lock acquired successfully</action>
  <action>  Pre-fetch epic context</action>

  <output>✅ {{count}} stories checked out and locked</output>
</step>
```

### Point 2: super-dev-pipeline Lock Verification

**File**: `super-dev-pipeline/steps/step-03-implement.md`
**Change**: Add lock check before each task

```markdown
## BEFORE EACH TASK IMPLEMENTATION

### NEW: Lock Verification

```bash
verify_lock() {
  story_key="$1"

  # Check local lock
  lock_file=".bmad/locks/${story_key}.lock"
  if [ ! -f "$lock_file" ]; then
    echo "❌ LOCK LOST: Local lock file missing"
    echo "Story may have been unlocked. HALT immediately."
    return 1
  fi

  # Check timeout
  timeout_at=$(grep "timeout_at:" "$lock_file" | cut -d' ' -f2)
  if [ $(date +%s) -gt $(date -d "$timeout_at" +%s) ]; then
    echo "❌ LOCK EXPIRED: Timeout reached"
    echo "Run: /checkout-story ${story_key} to extend lock"
    return 1
  fi

  # Check GitHub assignment (paranoid check)
  github_assignee=$(call_github_mcp_get_issue_assignee "$story_key")
  current_user=$(git config user.github)

  if [ "$github_assignee" != "$current_user" ]; then
    echo "❌ LOCK STOLEN: GitHub issue reassigned to $github_assignee"
    echo "Story was unlocked and re-assigned. HALT."
    return 1
  fi

  # Refresh heartbeat
  sed -i.bak "s/last_heartbeat: .*/last_heartbeat: $(date -u +%Y-%m-%dT%H:%M:%SZ)/" "$lock_file"
  rm -f "${lock_file}.bak"

  echo "✅ Lock verified for ${story_key}"
  return 0
}

# CRITICAL: Call before every task
if ! verify_lock "$story_key"; then
  echo "⚠️⚠️⚠️ PIPELINE HALTED - Lock verification failed"
  echo "Do NOT continue without valid lock!"
  exit 1
fi
```

Then proceed with task implementation...
```

### Point 3: dev-story Progress Sync

**File**: `dev-story/instructions.xml` (Step 8, after line 533)
**Change**: Add GitHub sync after task completion

```xml
<!-- AFTER marking task [x] -->
<check if="{{github_integration.enabled}} == true">
  <action>Sync task completion to GitHub:</action>
  <action>
    Call: mcp__github__add_issue_comment({
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{github_issue_number}},
      body: "Task {{task_num}} complete: {{task_description}}\n\n" +
            "Progress: {{checked_tasks}}/{{total_tasks}} tasks ({{progress_pct}}%)"
    })
  </action>

  <check if="GitHub sync failed">
    <retry count="3" />
    <check if="still failing">
      <output>❌ CRITICAL: Cannot sync progress to GitHub</output>
      <output>Network required for team coordination</output>
      <action>HALT</action>
    </check>
  </check>

  <output>✅ Progress synced to GitHub Issue #{{github_issue_number}}</output>
</check>
```

---

## Configuration

**Add to**: `_bmad/bmm/config.yaml`

```yaml
# GitHub Integration Settings
github_integration:
  enabled: true  # Master toggle
  source_of_truth: "github"  # github | local (always github for enterprise)
  require_network: true  # Hard requirement (AI needs internet)

  repository:
    owner: "jschulte"  # GitHub username or org
    repo: "myproject"  # Repository name

  cache:
    enabled: true
    location: "{output_folder}/cache"
    staleness_threshold_minutes: 5
    auto_refresh_on_stale: true

  locking:
    enabled: true
    default_timeout_hours: 8
    heartbeat_interval_minutes: 30
    stale_threshold_minutes: 15
    max_locks_per_user: 3

  sync:
    interval_minutes: 5  # Incremental sync frequency
    batch_epic_prefetch: true  # Pre-fetch epic on checkout
    progress_updates: true  # Sync task completion to GitHub

  permissions:
    scrum_masters:  # Can force-unlock stories
      - "jschulte"
      - "alice-sm"
```

---

## Verification Plan

### Test 1: Story Locking Prevents Duplicate Work

```bash
# Setup: 2 developers, 1 story

# Developer A (machine 1)
$ /checkout-story story_key=2-5-auth
✅ Story checked out
Lock expires: 8 hours

# Developer B (machine 2, simultaneously)
$ /checkout-story story_key=2-5-auth
❌ Story locked by @developerA until 23:30:00Z
Try: /available-stories

# Verify in GitHub
# → Issue #105: Assigned to @developerA
# → Labels: status:in-progress

# Result: ✅ Only Developer A can work on story
```

### Test 2: Real-Time Progress Visibility

```bash
# Developer implements task 3 of 10
# → Marks [x] in story file
# → Workflow syncs to GitHub

# Check GitHub Issue #105
# → New comment (30 seconds ago): "Task 3 complete: Implement OAuth (30%)"
# → Body shows: Progress bar at 30%

# PO views dashboard
# → Shows: "Story 2-5: 30% complete (3/10 tasks)"

# Result: ✅ PO sees progress in real-time
```

### Test 3: Merge Conflict Prevention

```bash
# Setup: 3 developers working on different stories

# All 3 complete simultaneously and commit

# Developer A: Story 2-5 files only
# Developer B: Story 2-7 files only
# Developer C: Story 3-2 files only

# Git commits:
# → Developer A: Only 2-5-auth.md + src/auth/*
# → Developer B: Only 2-7-cache.md + src/cache/*
# → Developer C: Only 3-2-api.md + src/api/*

# No overlap in files → No merge conflicts

# sprint-status.yaml:
# → Each story updates via GitHub sync (not direct file edit)
# → No conflicts (GitHub is source of truth)

# Result: ✅ Zero merge conflicts
```

### Test 4: Cache Performance

```bash
# Measure: Story checkout + epic context load time

# Without cache (API calls):
# - Fetch story: 2-3 seconds
# - Fetch 8 epic stories: 8 × 2s = 16 seconds
# - Total: ~18 seconds

# With cache:
# - Sync check: 200ms (1 API call for "any changes?")
# - Load story: 50ms (Read tool from cache)
# - Load 8 epic stories: 8 × 50ms = 400ms
# - Total: ~650ms

# Result: ✅ 27x faster (18s → 650ms)
```

### Test 5: Network Failure Recovery

```bash
# Developer working on task 5 of 10
# Network drops during GitHub sync

# System:
# → Retry #1 after 1s: Fails
# → Retry #2 after 3s: Fails
# → Retry #3 after 9s: Fails
# → Display: "❌ Cannot sync to GitHub - network required"
# → Save state to: .bmad/pipeline-state-2-5.yaml
# → HALT

# Developer fixes network, resumes:
$ /super-dev-pipeline story_key=2-5-auth

# System:
# → Detects saved state
# → "Resuming from task 5 (paused 10 minutes ago)"
# → Syncs pending progress to GitHub
# → Continues task 6

# Result: ✅ Graceful halt + resume
```

---

## Success Criteria

### Must Have (Phase 1-2)

- ✅ Zero duplicate work incidents (story locking prevents)
- ✅ Zero sprint-status.yaml merge conflicts (GitHub is source of truth)
- ✅ Real-time progress visibility (<30s from task completion to GitHub update)
- ✅ Cache performance: <100ms story reads (vs 2-3s API calls)
- ✅ API efficiency: <50 calls/hour (vs 500-1000 without cache)

### Should Have (Phase 3)

- ✅ PR auto-linking to issues (closes loop)
- ✅ PO can create/update stories via Claude Desktop
- ✅ Epic dashboard shows team activity
- ✅ Bi-directional sync (GitHub ↔ cache)

### Nice to Have (Phase 4)

- ✅ Ghost features auto-create backfill issues
- ✅ Stakeholder reporting
- ✅ Advanced dashboards

---

## Estimated Effort

### Phase 1: Foundation (Weeks 1-2)

- Cache system: 5 days
- Story locking: 5 days
- Progress sync: 2 days
- Testing & docs: 3 days
**Total**: 15 days (3 weeks with buffer)

### Phase 2: PO Workflows (Weeks 3-4)

- PO agent: 1 day
- Story creation: 3 days
- AC updates: 2 days
- Dashboard: 3 days
- Sync engine: 4 days
**Total**: 13 days (2.5 weeks with buffer)

### Phase 3: Advanced (Weeks 5-6)

- PR linking: 2 days
- Approval flow: 2 days
- Epic dashboard: 3 days
- Integration polish: 3 days
**Total**: 10 days (2 weeks)

### Phase 4: Polish (Weeks 7-8)

- Ghost features: 2 days
- Revalidation integration: 2 days
- Documentation: 3 days
- Training materials: 3 days
**Total**: 10 days (2 weeks)

**Grand Total**: 48 days (9.5 weeks, ~2.5 months for complete system)

**MVP** (Phases 1-2): 28 days (~6 weeks) gets you story locking + PO workflows

---

## Files Summary

### NEW Files (26 total)

**Cache System**: 3 files (~900 lines)
**Lock System**: 9 files (~1,350 lines)
**PO Workflows**: 12 files (~2,580 lines)
**Integration**: 2 files (~500 lines)

**Total NEW Code**: ~5,330 lines

### MODIFIED Files (5 total)

1. `batch-super-dev/instructions.md` (+150 lines)
2. `super-dev-pipeline/steps/step-01-init.md` (+80 lines)
3. `super-dev-pipeline/steps/step-03-implement.md` (+120 lines)
4. `super-dev-pipeline/steps/step-06-complete.md` (+100 lines)
5. `dev-story/instructions.xml` (+60 lines)

**Total MODIFIED**: ~510 lines

**Grand Total**: ~5,840 lines of production code + tests + docs

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| GitHub rate limits | Low | High | Caching (97% reduction), batch operations |
| Lock deadlocks | Medium | Medium | 8-hour timeout, heartbeat, SM override |
| Cache-GitHub desync | Low | Medium | Staleness checks, mandatory pre-sync |
| Network failures | Medium | Medium | Retry logic, graceful halt + resume |
| BMAD format violations | Medium | High | Strict validation, PO training |
| Lost locks mid-work | Low | High | Verification before each task |
| Developer onboarding | Medium | Low | Clear docs, training, gradual rollout |

**Overall Risk**: **LOW-MEDIUM** (building on proven migrate-to-github patterns)

**Risk Mitigation Strategy**:

- Start with 2-3 developers on small epic (validate locking works)
- Gradual rollout (not all 15 developers at once)
- Comprehensive testing at each phase
- Rollback capability via migrate-to-github patterns

---

## Why This Will Work

### 1. Proven Patterns

- Lock mechanism: Based on working git commit lock (step-06a-queue-commit.md)
- GitHub integration: Based on production migrate-to-github workflow
- Reliability: Same 8 mechanisms as migrate-to-github (idempotent, atomic, verified, resumable, etc.)

### 2. Simple Network Model

- Network required = simplified architecture (no offline queue complexity)
- Fail fast on network issues (retry + halt, not queue for later)
- Matches reality (AI coding needs internet anyway)

### 3. Performance Optimized

- Cache eliminates 95% of API calls
- Incremental sync (only fetch changed stories)
- Pre-fetch epic context (batch operation)
- Read tool works at <100ms (vs 2-3s API calls)

### 4. Multi-Layer Safety

- Lock verification before each task (catch stolen locks immediately)
- Write-through with retry (transient failures handled)
- Staleness detection (refuse to use old cache)
- Mandatory pre-workflow sync (everyone starts with fresh data)

### 5. Role Separation

- POs: GitHub Issues UI + Claude Desktop (no git needed)
- Developers: BMAD workflows (lock → implement → sync → unlock)
- SMs: Oversight tools (lock-status, force-unlock, dashboards)

---

## Next Steps

### Immediate

1. **Review this plan** - Validate architecture decisions
2. **Confirm priorities** - Phase 1-2 first (locking + PO workflows)?
3. **Approve approach** - GitHub as source of truth with local cache

### Week 1

1. Build cache system (cache-manager.js, sync-engine.js)
2. Create checkout-story workflow
3. Implement lock verification
4. Test with 2 developers

### Week 2-3

1. Integrate with batch-super-dev
2. Add progress sync to dev-story
3. Build PO agent + story creation workflow
4. Test with 3-5 developers

### Week 4-6

1. Complete PO workflows (update, dashboard, approve)
2. Add PR linking
3. Build epic dashboard
4. Test with full team (10-15 developers)

### Week 7-8

1. Polish and optimize
2. Advanced features
3. Comprehensive documentation
4. Team training

---

## Conclusion

This design transforms BMAD into **the killer feature for enterprise teams** by:

✅ **Preventing duplicate work** - Story locking with 8-hour timeout, heartbeat, verification
✅ **Enabling Product Owners** - GitHub Issues workspace via Claude Desktop, no git/markdown knowledge
✅ **Maintaining developer flow** - Local cache = instant LLM reads, no API latency
✅ **Scaling to 15 developers** - GitHub centralized coordination, zero merge conflicts
✅ **Building on proven patterns** - migrate-to-github reliability mechanisms (atomic, verified, resumable)
✅ **Optimizing performance** - 97% API reduction through smart caching
✅ **Simplifying architecture** - Network required = no offline queue complexity

**Implementation**: 6-8 weeks for complete system, 4-6 weeks for MVP (locking + basic PO workflows)

**Risk**: Low-Medium (incremental rollout, comprehensive testing, rollback capability)

**ROI**: Eliminates duplicate work, reduces PO-Dev friction by 40%, increases sprint predictability

Ready for enterprise adoption.
