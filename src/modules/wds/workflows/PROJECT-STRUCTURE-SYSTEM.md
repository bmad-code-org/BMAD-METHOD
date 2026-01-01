# Project Structure System

## Overview

WDS includes a centralized project initialization system that collects project structure metadata and makes it available to all agents throughout the workflow. This ensures proper folder organization from the start and eliminates confusion.

## The Central Project Details File

All project configuration is stored in **one central file**:

📄 **`wds-workflow-status.yaml`** (in project docs root)

This file contains:
- Project metadata (name, type, creation date)
- **Project structure** (landing page, website, or application)
- **Delivery configuration** (format, target platform, PRD requirements)
- Language configuration
- Folder naming preferences
- Design system settings
- Workflow progress tracking

**All WDS agents read this file** to understand project context and structure.

---

## How It Works

### Step 1: Workflow Init (Collection)

During **initial project setup** (`workflow-init`), the system asks:

**"What are you designing?"**

1. **Separate pages** - Individual pages or page variants
2. **Single user flow** - Multiple pages, single user journey  
3. **Multiple user flows** - Multiple scenarios/journeys, interactive features

### Step 2: Storage (Central Config)

This information is written to `wds-workflow-status.yaml`:

```yaml
# Project information
project: "WDS Presentation Page"
project_type: "landing-page"

# Project structure (defines folder organization)
project_structure:
  type: "separate_pages"
  scenarios: "single"
  pages: "single"

# Delivery configuration (what gets handed off)
delivery:
  format: "wordpress"
  target_platform: "wordpress"
  requires_prd: false
  description: "WordPress page editor code with markup and content sections"
```

**Key benefit:** Since `requires_prd: false`, the system knows **not to include PRD phases** (Phase 3 Platform Requirements, Phase 6 PRD Finalization). The workflow focuses only on design specifications that translate directly to WordPress implementation.

### Step 3: Application (All Agents)

When any agent starts work, they:
1. **Read** `wds-workflow-status.yaml`
2. **Extract** `project_structure` section
3. **Apply** appropriate folder organization rules

**Example - Freya (UX Designer):**
- Reads config file before greeting user
- Understands this is "separate pages"
- Places pages directly in `4-scenarios/` (no scenario subfolders)
- Numbers pages with individual identifiers

---

## Information Flow

```
User Input → Workflow Init → wds-workflow-status.yaml → All Agents → Correct Structure
            (Step 2b)      (Central Storage)           (Read Config)  (Applied)
```

**Key Principle:** Define once, use everywhere.

---

### Separate Pages
- **Structure:** `4-scenarios/start-page/` or variants
- **Pattern:** Pages directly in `4-scenarios/`
- **Variants:** `start-page-variant-a/`, `start-page-variant-b/` (if A/B testing)
- **Use case:** Landing pages, standalone pages, page variants

```
4-scenarios/
  start-page/
    start-page.md
    sketches/
    prototypes/
  start-page-variant-a/  (optional)
    start-page-variant-a.md
    sketches/
```

### Single User Flow
- **Structure:** `4-scenarios/1.1-home/`, `4-scenarios/1.2-about/`
- **Pattern:** Pages directly in `4-scenarios/`
- **Numbering:** Sequential pages `1.1`, `1.2`, `1.3`, etc.
- **No Scenario Subfolders:** All pages at the same level
- **Use case:** Simple websites, wizard flows, single-screen apps

```
4-scenarios/
  1.1-home/
    1.1-home.md
    sketches/
    prototypes/
  1.2-about/
    1.2-about.md
    sketches/
  1.3-contact/
    1.3-contact.md
    sketches/
```

### Multiple User Flows
- **Structure:** `4-scenarios/1-onboarding/`, `4-scenarios/2-dashboard/`
- **Pattern:** Scenario subfolders, pages within scenarios
- **Numbering:** 
  - Scenarios: `1-scenario-name`, `2-scenario-name`
  - Pages within: `1.1-page`, `1.2-page`, `2.1-page`, `2.2-page`
- **Use case:** Web applications, mobile apps, admin systems

```
4-scenarios/
  1-onboarding/
    00-scenario.md
    1.1-signup/
      1.1-signup.md
      sketches/
    1.2-verify-email/
      1.2-verify-email.md
      sketches/
  2-dashboard/
    00-scenario.md
    2.1-overview/
      2.1-overview.md
      sketches/
    2.2-settings/
      2.2-settings.md
      sketches/
```

## Benefits

### For Users
- **No confusion** about folder structure
- **Consistent organization** across projects
- **Correct setup from the start** - no reorganization needed

### For Agents
- **Clear instructions** based on project type
- **No guesswork** about where to place files
- **Proper structure** enables smooth handoffs between phases

## Implementation Files

### 1. Collection Phase
- **File:** `workflows/workflow-init/instructions.md`
- **Step:** Step 2 - "Project Structure"
- **When:** During initial project setup
- **Action:** Asks user to classify project structure

### 2. Central Storage
- **File:** `wds-workflow-status.yaml` (project root)
- **Template:** `workflows/00-system/wds-workflow-status-template.yaml`
- **Section:** `project_structure:`
- **Fields:**
  - `type` - separate_pages | single_flow | multiple_flows
  - `scenarios` - single | multiple
  - `pages` - single | multiple

### 3. Application - All Phases
Every agent that needs structure information reads from `wds-workflow-status.yaml`:

**Freya (UX Designer):**
- **File:** `workflows/4-ux-design/steps/step-01-init.md`
- **When:** Before greeting user (initialization)
- **Action:** Reads config, applies folder rules

**Future agents can access the same information** by reading the central config file.

## Migration for Existing Projects

If a project was created before this system:

1. **Add structure section to config** (`config.yaml` or `wds-workflow-status.yaml`)
2. **Identify the project type** based on actual content
3. **Reorganize folders** if needed to match the standard
4. **Update all internal references** to reflect new structure

Example addition to config:

```yaml
project:
  structure:
    type: "single_flow"
    scenarios: "single"
    pages: "multiple"
```

## Future Enhancements

Potential additions to this system:

- **Multi-language variants** (e.g., `/en/`, `/sv/` folders)
- **Platform variants** (e.g., `/web/`, `/mobile/` folders)
- **Custom structure templates** for specific industries
- **Validation tools** to ensure structure compliance

---

**Created:** December 27, 2025  
**Status:** Implemented in WDS v6

