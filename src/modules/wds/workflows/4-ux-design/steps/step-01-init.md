# Step 1: Workflow Initialization

**Progress: Step 1 of 5** - Next: Scenario Definition

## YOUR TASK

Initialize the UX Design workflow by:
1. Loading project structure metadata from project config
2. Understanding folder organization requirements
3. Welcoming the user and determining what to design

---

## CRITICAL: LOAD PROJECT STRUCTURE

**Before greeting the user**, read the project config to understand project structure:

<action>
Read `{project_root}/config.yaml` (or `{project_root}/wds-workflow-status.yaml`) and extract:

- `project.structure.type` (landing_page | simple_website | web_application)
- `project.structure.scenarios` (single | multiple)
- `project.structure.pages` (single | multiple)

Store this in memory for the entire session.
</action>

**Folder Structure Rules Based on Project Type:**

- **Landing Page** (`scenarios: single`, `pages: single`):
  - Place pages directly in `4-scenarios/`
  - Use page variants if needed: `1.1-start-page/`, `1.1-variant-a/`, `1.1-variant-b/`
  
- **Simple Website** (`scenarios: single`, `pages: multiple`):
  - Place pages directly in `4-scenarios/`
  - Number pages sequentially: `1.1-home/`, `1.2-about/`, `1.3-contact/`
  
- **Web Application** (`scenarios: multiple`, `pages: multiple`):
  - Create scenario subfolders: `4-scenarios/1-onboarding/`, `4-scenarios/2-dashboard/`
  - Number pages within each scenario: `1.1-signup/`, `1.2-verify-email/`, `2.1-dashboard/`

<reminder>
This structure was defined during workflow-init. Follow it exactly. Do not create unnecessary subfolders.
</reminder>

---

## GOAL

Set up the design session and determine what scenario or page the user wants to work on.

---

## EXECUTION

<output>Hi {user_name}! I'm Freya, and I'll help you design and specify your user experience.

**UX Design** transforms ideas into detailed visual specifications. We'll work through each scenario, page by page, creating specifications so complete they eliminate guesswork during development.

**The Design Journey:**

**Step 2: Scenario Definition** - Define the user journey and pages
**Step 3: Page Design** - Design each page using substeps 4A-4E:

- 4A: Exploration (think through concept)
- 4B: Sketch Analysis (analyze your sketches)
- 4C: Specification (document everything)
- 4D: Prototype (create interactive HTML)
- 4E: PRD Update (extract requirements)
  **Step 4: Complete Scenario** - Finalize and celebrate
  **Step 5: Continue or Exit** - Next steps

**Key principle:** Designs that can be logically explained without gaps are easy to develop. The specification process reveals gaps early - when they're easy to address.

Ready to begin? 🎨</output>

<ask>What would you like to work on?

1. **New scenario** - Start exploring a new user journey
2. **Continue existing scenario** - Work on a page you've already started
3. **Review scenario structure** - See what scenarios exist

Choice [1/2/3]:</ask>

---

## MENU HANDLING

### Choice 1: New Scenario

- Proceed to Step 2 (Scenario Structure Setup)
- Load `steps/step-02-setup-scenario-structure.md`

### Choice 2: Continue Existing

- Ask which scenario/page to continue
- Determine current status (which substep they're on)
- Load appropriate step file based on status
- Skip Step 2 if scenario already defined

### Choice 3: Review Structure

- List scenarios in `{output_folder}/C-Scenarios/`
- Show completion status for each
- Return to this menu
- Do NOT proceed to next step

---

## NEXT STEP

After user selects [1] for new scenario, load `steps/step-02-setup-scenario-structure.md` to begin scenario structure setup.

If user selects [2], determine current state and load appropriate step.

If user selects [3], show structure and return to this step.
