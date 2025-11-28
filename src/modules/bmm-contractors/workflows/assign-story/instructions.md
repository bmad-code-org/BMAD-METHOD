# Assign Story to Contractor Workflow

## Overview

This workflow assigns a story to a contractor by preparing context, creating a Git branch, and sending an assignment email with all necessary information.

## Prerequisites

- Story is in "Ready" status
- Contractor profiles configured
- SMTP settings configured
- Git integration configured

---

## Workflow Stages

### Stage 1: Select Story

**Objective:** Choose which story to assign.

**Available Stories:**
Display stories that are ready for assignment:

```
Ready Stories:
| ID | Title | Type | Points | Dependencies |
|----|-------|------|--------|--------------|
| STORY-123 | Implement auth API | backend | 5 | None |
| STORY-124 | Login form UI | frontend | 3 | STORY-123 |
| STORY-125 | Add offline sync | mobile | 8 | STORY-123 |
```

**Selection Criteria:**
- Story is in "Ready" status
- No unassigned blockers
- Dependencies are resolved (or acceptable to work in parallel)

**User Input:** Select story ID to assign

---

### Stage 2: Select Contractor

**Objective:** Choose the appropriate contractor for this story.

**Matching Criteria:**

1. **Role Match** - Story type matches contractor's role
   - `backend` → backend-dev
   - `frontend` → frontend-dev
   - `mobile` → mobile-dev
   - `qa` → qa-engineer
   - `documentation` → researcher

2. **Capacity Check** - Contractor has available capacity
   ```
   Contractor: Backend Dev
   Current Load: 2 stories (10 points)
   Capacity: 3 stories (20 points)
   Status: ✅ Available
   ```

3. **Tech Stack Match** - Required skills match contractor's stack
   ```
   Story requires: Java, Spring Security, JWT
   Contractor skills: Java 21, Spring Boot, Spring Security ✅
   ```

**Available Contractors:**
```
| Contractor | Role | Load | Capacity | Match |
|------------|------|------|----------|-------|
| backend-001 | Backend Dev | 2/3 | 10/20 pts | ✅ |
| frontend-001 | Frontend Dev | 1/3 | 5/18 pts | ❌ Type |
```

**User Input:** Select contractor ID

---

### Stage 3: Prepare Context

**Objective:** Gather all information the contractor needs.

**Context Components:**

1. **Story Details**
   - Title, description, acceptance criteria
   - Story points, priority
   - Related stories/epics

2. **Technical Context**
   - Architecture/design documents
   - API specifications
   - Database schema (if relevant)
   - Code patterns to follow

3. **Dependencies**
   - Upstream dependencies (APIs, data)
   - Downstream dependencies (who's waiting)
   - External service dependencies

4. **Resources**
   - Links to relevant documentation
   - Design files (Figma, etc.)
   - Related PRs or code

**Context Template Variables:**
```yaml
story_id: "STORY-123"
story_title: "Implement user authentication API"
story_description: |
  Create REST endpoints for user authentication including
  login, logout, token refresh, and password reset.

acceptance_criteria:
  - "POST /auth/login returns JWT token"
  - "POST /auth/logout invalidates token"
  - "POST /auth/refresh extends token"
  - "95% test coverage"

technical_context: |
  ## Architecture
  - Use Spring Security with JWT
  - Store refresh tokens in Redis
  - Follow existing error handling pattern

  ## Endpoints
  - POST /api/v1/auth/login
  - POST /api/v1/auth/logout
  - POST /api/v1/auth/refresh

  ## Related Code
  - See `UserService` for user lookup
  - See `SecurityConfig` for security setup

resources:
  - name: "Auth Design Doc"
    url: "docs/auth-design.md"
  - name: "API Spec"
    url: "docs/api/auth.yaml"
```

---

### Stage 4: Create Branch

**Objective:** Create the Git branch for contractor work.

**Branch Naming:**
Using pattern from config: `story/{story_id}-{slug}`

```
Branch: story/STORY-123-implement-user-auth-api
Base: develop
```

**Git Operations:**
```bash
# Automated by workflow
git checkout develop
git pull origin develop
git checkout -b story/STORY-123-implement-user-auth-api
git push -u origin story/STORY-123-implement-user-auth-api
```

**Branch Protection:**
- Branch created from latest `develop`
- No direct pushes to `develop` or `main`
- PR required for merge

**Output:** Branch URL and name

---

### Stage 5: Compose Email

**Objective:** Generate the assignment email.

**Email Components:**

1. **Subject Line:**
   ```
   [PROJECT] [STORY-123] Implement user authentication API
   ```

2. **Body Sections:**
   - Greeting (personalized)
   - Story overview
   - Acceptance criteria (checklist)
   - Technical context
   - Branch information
   - Deadline
   - Reply instructions
   - Resources

3. **Attachments (optional):**
   - Design documents
   - API specifications
   - Related files

**Preview Email:**
Display formatted email for review before sending.

**Customization:**
- Allow editing subject/body if needed
- Add/remove attachments
- Adjust deadline

---

### Stage 6: Confirm & Send

**Objective:** Final review and send.

**Confirmation Checklist:**
- [ ] Story ID correct
- [ ] Contractor correct
- [ ] Acceptance criteria clear
- [ ] Technical context complete
- [ ] Branch created
- [ ] Deadline reasonable
- [ ] Attachments included

**Send Options:**
- **Send Now** - Send immediately
- **Schedule** - Send at specific time (respect contractor timezone)
- **Save Draft** - Save without sending

**On Send:**
1. Email sent via SMTP
2. Story status updated to "In Progress"
3. Assignment recorded in state
4. Event published: `contractor.story.assigned`

---

## Events Published

**contractor.story.assigned:**
```yaml
type: contractor.story.assigned
payload:
  story_id: "STORY-123"
  contractor_id: "backend-001"
  contractor_email: "backend@contractor.example"
  branch_name: "story/STORY-123-implement-user-auth-api"
  deadline: "2025-12-05T17:00:00Z"
  assigned_at: "2025-11-28T10:30:00Z"
  correlation_id: "uuid-xxx"
```

---

## Post-Assignment Flow

After assignment, the system:

1. **Monitors for acknowledgment** (24 hour SLA)
2. **Sends reminder** if no response after 48 hours
3. **Escalates** if no response after 72 hours

**Expected Contractor Response:**
```
ACKNOWLEDGED - I'll start working on this tomorrow.
```

---

## Reassignment

If contractor needs to be changed:

1. Run `*assign` workflow with reassignment flag
2. System sends unassignment notice to original contractor
3. Creates new assignment to new contractor
4. Updates all tracking

---

## Error Handling

| Error | Recovery |
|-------|----------|
| SMTP send fails | Retry 3x, then alert coordinator |
| Branch creation fails | Manual branch creation instructions |
| Contractor unavailable | Suggest alternative contractor |
| Story not ready | Block assignment, show blockers |
