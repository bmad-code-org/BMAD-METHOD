# Step 1: Initialize Dialog

## CONTEXT

This is the first step of the Agent Dialog Workflow. Before creating a new dialog, we first check for any existing pending dialogs.

---

## CHECK FOR EXISTING DIALOGS

⚠️ **IMPORTANT: Always check for pending dialogs before creating a new one.**

<action>
**Scan for existing dialogs:**

1. Check if `{output_folder}/_progress/agent-dialogs/` exists
2. If it exists, scan all subdirectories for dialog files (*-dialog.md)
3. Read the Meta section of each dialog file
4. Identify dialogs where:
   - Status = "Not Started" OR "In Progress"
   - Agent matches the current agent (if known)
</action>

<conditional>
**If pending dialogs found:**

Present them to the user:

```
📋 **Found {N} pending dialog(s):**

| # | Date | Agent | Feature | Status |
|---|------|-------|---------|--------|
| 1 | {date} | {agent} | {feature} | {status} |

**Options:**
[A] Continue existing dialog #{N}
[B] Create a new dialog (existing ones remain pending)

Choice:
```

If user chooses an existing dialog:
- Load that dialog file
- Check the Steps Overview table for next incomplete step
- Continue from there

If user chooses to create new:
- Continue to SELECT DIALOG TYPE below
</conditional>

<conditional>
**If no pending dialogs found OR {output_folder}/_progress/agent-dialogs/ doesn't exist:**

Continue to SELECT DIALOG TYPE below.
</conditional>

---

## SELECT DIALOG TYPE

<ask>**What type of work is this?**

| Type | Icon | Use When |
|------|------|----------|
| **[A] Prototype Implementation** | 🔧 | Building UI from specifications |
| **[B] Bug Fix** | 🐛 | Fixing issues and defects |
| **[C] Design Exploration** | 🎨 | Exploring visual/UX directions |
| **[D] Capture** | 💾 | Saving ideas for later |
| **[E] Generic** | 📋 | Anything else |

Type:</ask>

<action>
Store dialog_type and select appropriate template:
- A → templates/dialog-types/prototype-implementation.template.md
- B → templates/dialog-types/bug-fix.template.md
- C → templates/dialog-types/design-exploration.template.md
- D → templates/dialog-capture.template.md
- E → templates/dialog.template.md
</action>

---

## GATHER INFORMATION

<ask>**What feature or implementation are we working on?**

Examples:
- "Booking details drawer"
- "User authentication refactor"
- "Calendar scroll fix"

Feature name:</ask>

<action>Store feature_name and generate feature_slug (lowercase, hyphenated)</action>

<ask>**Which specification(s) are relevant?**

Provide the path to the specification file(s) this implementation is based on.

Specification path:</ask>

<action>Store spec_path</action>

<ask>**What agent persona should execute this work?**

Examples:
- "Freya (UX Designer)" — For UI implementation
- "Dev Agent" — For backend work
- "Full Stack" — For end-to-end features

Agent:</ask>

<action>Store agent_name</action>

---

## CREATE FOLDER STRUCTURE

<action>
**Create dialog folder:**

Path: `{output_folder}/_progress/agent-dialogs/{date}-{agent_slug}-{feature_slug}/`

Where:
- `{date}` = Today's date in YYYY-MM-DD format
- `{agent_slug}` = Agent name, lowercase (e.g., "freya", "saga", "dev")
- `{feature_slug}` = Feature name, lowercase, hyphenated

**Examples:**
- `2026-01-23-freya-booking-details-overlay/`
- `2026-01-23-saga-course-workflow-integration/`
- `2026-01-23-dev-calendar-scroll-fix/`

**Create subfolders:**
- `steps/` — For step instruction files
</action>

---

## CREATE DIALOG FILE

<action>
**Create main dialog file:**

File: `{output_folder}/_progress/agent-dialogs/{date}-{agent_slug}-{feature_slug}/{date}-{agent_slug}-{feature_slug}-dialog.md`

**Use template from:** Selected dialog type template (see SELECT DIALOG TYPE step above)

**Fill in:**
- Date: Today's date
- Agent: {agent_name}
- Feature: {feature_name}
- Specification: Link to {spec_path}
- Status: "In Progress"
</action>

---

## GATHER SETUP CONTEXT

<action>
**Read the specification file(s)** to understand:
- What needs to be implemented
- What already exists
- Technical requirements
</action>

<ask>**What's the tech stack for this project?**

Example: "React 19, Next.js 15, TypeScript, Tailwind CSS, Supabase"

Tech stack:</ask>

<action>Store tech_stack</action>

<ask>**What files are relevant to this implementation?**

List the key files that will be modified or referenced.

Relevant files:</ask>

<action>Store relevant_files</action>

<ask>**Are there any existing patterns to follow?**

Describe component structure, styling approach, state management, etc.

Patterns:</ask>

<action>Store patterns</action>

---

## UPDATE DIALOG FILE

<action>
**Fill in Setup Context section:**

- Project Context (tech stack)
- Relevant Files (table)
- Existing Patterns
- Current State (what exists)

**Fill in Purpose:**
- 1-3 sentences describing what this dialog accomplishes
</action>

---

## COMPLETION

<output>
✅ **Dialog initialized!**

**Created:**
- Folder: `{output_folder}/_progress/agent-dialogs/{date}-{agent_slug}-{feature_slug}/`
- Dialog file: `{date}-{agent_slug}-{feature_slug}-dialog.md`
- Steps folder: `steps/`

**Next:** Proceed to Step 2 to analyze scope and create step breakdown.

[A] Continue to Step 2: Analyze Scope
[B] Review the dialog file first
[C] Add more setup context

Choice:
</output>

---

## ROUTING

<action>
Based on user choice:
- [A] → Load and execute step-02-analyze-scope.md
- [B] → Show the dialog file contents
- [C] → Ask for additional context to add
</action>

---

_Agent Dialog Workflow — Step 1: Initialize Dialog_
