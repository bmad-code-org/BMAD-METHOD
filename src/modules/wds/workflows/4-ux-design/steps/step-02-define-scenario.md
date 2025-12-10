# Step 2: Define Scenario and Pages

**Progress: Step 2 of 5** - Next: Page Design

## YOUR TASK

Work with the user to define the scenario (user journey) and identify all pages within it.

---

## GOAL

Create clear scenario structure with numbered pages ready for design.

---

## EXECUTION

<output>**Let's define your scenario.**

A scenario is a cohesive user journey containing multiple related pages.</output>

<ask>**What scenario are we designing?**

Examples:

- "User Onboarding" (sign up through profile setup)
- "Booking Flow" (search through confirmation)
- "Dashboard Experience" (home screen with navigation)

Scenario name:</ask>

<action>Store scenario_name</action>
<action>Determine scenario number (count existing scenarios, add 1)</action>
<action>Generate scenario folder: {output_folder}/C-Scenarios/{nn}-{scenario-name}/</action>

<ask>**What pages are in this scenario?**

List the main screens/pages in order.

Example:

1. Start Page
2. Sign Up
3. Profile Setup
4. Welcome Dashboard</ask>

<action>Store pages list</action>
<action>Create folder structure for each page:

- {nn}.1-{page-name}/
- {nn}.2-{page-name}/
- etc.
  </action>

<output>✅ **Scenario structure created:**

`C-Scenarios/{nn}-{scenario-name}/`
{{#each page}}

- `{nn}.{n}-{page-name}/`
  {{/each}}

We'll design each page using the 4A-4E process:

- **4A: Exploration** (optional - think through concept)
- **4B: Sketch Analysis** (analyze your sketches)
- **4C: Specification** (document everything systematically)
- **4D: Prototype** (create interactive HTML)
- **4E: PRD Update** (extract functional requirements)

Ready to design the first page? 🎨</output>

---

## MENU

<ask>[C] Continue to Step 3 (Page Design)</ask>

---

## STATE MANAGEMENT

Before proceeding:

- Save scenario structure to `C-Scenarios/{nn}-{scenario-name}/scenario-info.yaml`
- Include: scenario_name, scenario_number, pages_list, current_page_index (0)

---

## NEXT STEP

When user selects [C], load `steps/step-03-design-page.md` to begin designing the first page.
