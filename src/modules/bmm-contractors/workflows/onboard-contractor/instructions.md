# Onboard New Contractor Workflow

## Overview

This workflow guides the onboarding of a new contractor to the project. It covers profile creation, access provisioning, documentation, and optionally assigning a first story.

## Prerequisites

- Contractor has been selected/hired
- Contract/agreement in place
- Contractor email address confirmed

---

## Workflow Stages

### Stage 1: Collect Information

**Objective:** Gather all contractor details needed for profile.

**Required Information:**

```yaml
contractor:
  # Identity
  name: ""              # Display name
  email: ""             # Primary email for communication

  # Role
  role: ""              # backend-dev, frontend-dev, mobile-dev, qa-engineer, researcher

  # Technical
  tech_stack: []        # Primary technologies/skills
  specialties: []       # Areas of expertise

  # Availability
  availability: ""      # full-time, part-time, on-call
  timezone: ""          # e.g., "UTC+5:30"
  working_hours: ""     # e.g., "09:00-17:00"

  # Capacity
  capacity_story_points_per_sprint: 0
  max_concurrent_stories: 3

  # Communication
  response_sla_hours: 24
  preferred_contact: "email"  # SMTP email only
```

**Questions to Ask:**

1. **What is your primary role?**
   - Backend Developer (Java/Spring)
   - Frontend Developer (React/TypeScript)
   - Mobile Developer (Android/Kotlin)
   - QA Engineer (Test Automation)
   - Technical Researcher

2. **What technologies are you most experienced with?**
   (List relevant to role)

3. **What is your availability?**
   - Full-time (40 hrs/week)
   - Part-time (20 hrs/week)
   - On-call (as needed)

4. **What timezone are you in?**

5. **What are your typical working hours?**

6. **How many story points can you handle per sprint?**

**Output:** Complete contractor information

---

### Stage 2: Create Profile

**Objective:** Create contractor profile in configuration.

**Generate Contractor ID:**
Format: `{role}-{number}`
Example: `backend-002`, `frontend-001`

**Create Profile Entry:**

Add to `config.yaml` contractors section:

```yaml
contractors:
  # ... existing contractors ...

  - id: "backend-002"
    name: "New Backend Developer"
    email: "newdev@contractor.example"
    role: "backend-dev"
    tech_stack:
      - "Java 21"
      - "Spring Boot"
      - "PostgreSQL"
    specialties:
      - "REST APIs"
      - "Microservices"
    availability: "full-time"
    timezone: "UTC+5:30"
    working_hours: "09:00-17:00"
    response_sla_hours: 24
    capacity_story_points_per_sprint: 18
    active: true
    onboarded_at: "2025-11-28T10:00:00Z"
```

**Load Role Profile:**

Based on role, load the profile template:
- `backend-dev.profile.yaml` → Technical context, standards, checklist
- `frontend-dev.profile.yaml` → UI standards, component patterns
- etc.

**Output:** Profile created and saved

---

### Stage 3: Provision Access

**Objective:** Set up necessary access for the contractor.

**Git Access:**

```yaml
git_access:
  provider: "github"
  organization: "your-org"
  repository: "your-repo"

  permissions:
    - read: true
    - write: true  # To their branches only
    - admin: false

  branch_rules:
    - can_push_to: "story/*"
    - cannot_push_to: ["main", "develop"]
```

**Actions:**
1. [ ] Add contractor to GitHub organization (or invite as collaborator)
2. [ ] Set up branch protection rules
3. [ ] Create SSH key or personal access token instructions

**Communication Access:**

```yaml
communication:
  email:
    - Verify email deliverability
    - Add to allowed senders list
    - Test email round-trip

  optional:
    - Documentation access (shared via email)
    - Issue tracker access (notifications via email)
```

**Verification:**
- [ ] Contractor can clone repository
- [ ] Contractor can push to feature branches
- [ ] Contractor can create pull requests
- [ ] Email delivery confirmed

**Output:** Access provisioned and verified

---

### Stage 4: Prepare Documentation

**Objective:** Gather all onboarding materials.

**Documentation Package:**

1. **Project Overview**
   - Product description
   - Architecture overview
   - Team structure

2. **Technical Documentation**
   - Development setup guide
   - Coding standards
   - API documentation
   - Database schema

3. **Process Documentation**
   - Git workflow
   - PR process
   - Review process
   - Communication protocol

4. **Role-Specific Guides**
   - From contractor profile template
   - Tech stack specifics
   - Quality requirements

**Compile Links:**

```yaml
onboarding_docs:
  project:
    - name: "Project README"
      url: "https://github.com/org/repo/README.md"
    - name: "Architecture Overview"
      url: "docs/architecture.md"

  development:
    - name: "Development Setup"
      url: "docs/setup.md"
    - name: "Coding Standards"
      url: "docs/standards.md"

  process:
    - name: "Git Workflow"
      url: "docs/git-workflow.md"
    - name: "Communication Guide"
      url: "docs/communication.md"

  role_specific:
    - name: "Backend Standards"
      url: "docs/backend-guide.md"
```

**Output:** Documentation links compiled

---

### Stage 5: Send Welcome Email

**Objective:** Send comprehensive welcome email.

**Welcome Email Content:**

```markdown
Subject: [PROJECT] Welcome to the Team - Getting Started Guide

Hi {contractor_name},

Welcome to the {project_name} team! We're excited to have you on board as our {role_title}.

## Your Profile

| Field | Value |
|-------|-------|
| Contractor ID | {contractor_id} |
| Role | {role_title} |
| Timezone | {timezone} |
| Response SLA | {sla} hours |

## Getting Started

### 1. Repository Access

Repository: {repository_url}

Clone the repository:
```bash
git clone {clone_url}
cd {repo_name}
```

### 2. Development Setup

Follow the setup guide: {setup_doc_url}

Key steps:
1. Install prerequisites
2. Configure environment
3. Run tests to verify setup

### 3. Communication Protocol

All work coordination happens via email. Here's how it works:

**Receiving Assignments:**
- You'll receive story assignments via email
- Each email contains full context and acceptance criteria
- Reply with `ACKNOWLEDGED` when you receive an assignment

**Reporting Progress:**
- Reply with `PROGRESS - {status}` for updates
- Reply with `QUESTION - {question}` if you need clarification
- Reply with `BLOCKED - {description}` if you're stuck

**Submitting Work:**
- Push your code to your story branch
- Create a Pull Request
- Reply with `SUBMITTED - PR #{number}` to notify us

### 4. Git Workflow

Branch naming: `story/{story_id}-{slug}`

Example:
```bash
git checkout develop
git pull origin develop
git checkout -b story/STORY-123-implement-feature
# ... work ...
git push -u origin story/STORY-123-implement-feature
```

### 5. Quality Standards

Please review the coding standards for your role:
{standards_doc_url}

Key requirements:
- {quality_req_1}
- {quality_req_2}
- {quality_req_3}

## Documentation

- Project Overview: {project_doc}
- Architecture: {architecture_doc}
- API Docs: {api_doc}
- Your Role Guide: {role_guide}

## Next Steps

1. [ ] Clone the repository
2. [ ] Set up your development environment
3. [ ] Review the documentation
4. [ ] Reply to this email confirming you're ready

{#if first_assignment}
## Your First Assignment

We have a starter story ready for you:

**{first_story_id}: {first_story_title}**

A separate assignment email will follow once you confirm you're set up.
{/if}

## Questions?

Reply to this email with any questions. We're here to help!

Best regards,
{coordinator_name}
Project Coordinator

---
Correlation ID: {correlation_id}
```

**Send Email:**
Use `send-email` task with `welcome-onboarding` template.

**Output:** Welcome email sent

---

### Stage 6: First Assignment (Optional)

**Objective:** Optionally assign a starter story.

**Starter Story Criteria:**

Good first stories are:
- Small scope (1-3 story points)
- Well-defined requirements
- Few dependencies
- Representative of typical work
- Not on critical path

**Options:**

1. **Assign Now** - If suitable story is ready
2. **Defer** - Wait for contractor to confirm setup
3. **Skip** - No immediate work available

**If Assigning:**

Trigger the `assign-story` workflow with:
- Selected story
- New contractor
- "First assignment" flag (for gentler expectations)

**Output:** First assignment decision made

---

## Onboarding Checklist

```markdown
## Contractor Onboarding: {contractor_name}

### Information Collected
- [ ] Name and email
- [ ] Role and tech stack
- [ ] Availability and timezone
- [ ] Capacity estimates

### Profile Created
- [ ] Contractor ID generated
- [ ] Profile added to config
- [ ] Profile saved to state

### Access Provisioned
- [ ] Git repository access
- [ ] Branch permissions set
- [ ] Email deliverability verified

### Documentation Prepared
- [ ] Project docs compiled
- [ ] Role-specific guides identified
- [ ] Setup instructions ready

### Welcome Sent
- [ ] Welcome email sent
- [ ] Awaiting confirmation

### First Assignment
- [ ] Starter story identified (optional)
- [ ] Assignment sent (optional)

### Verified
- [ ] Contractor confirmed receipt
- [ ] Contractor completed setup
- [ ] Test commit successful
```

---

## Events Published

**contractor.onboarded:**
```yaml
contractor_id: "backend-002"
contractor_name: "New Backend Developer"
email: "newdev@contractor.example"
role: "backend-dev"
onboarded_at: "2025-11-28T10:00:00Z"
first_assignment: "STORY-150" or null
```

---

## Post-Onboarding

After onboarding:

1. **Monitor first 48 hours** - Watch for setup issues
2. **Be responsive** - Answer questions quickly
3. **Check first PR carefully** - Provide detailed feedback
4. **Adjust estimates** - Calibrate capacity based on actual velocity

---

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| Email not received | Check spam, verify address |
| Git access denied | Re-check permissions, SSH keys |
| Setup issues | Provide additional documentation |
| No response after 48h | Follow up via alternative channel |
