# Step 4E: PRD Update

<goal>Extract functional requirements discovered during design and add them to the PRD</goal>

## Why This Step Matters

<output>**Time to capture what we learned!**

Every page reveals concrete requirements:

- "This form needs email validation"
- "We need a GET endpoint for availability"
- "Users need to upload images here"

Capturing these while the page is fresh ensures nothing is forgotten. The PRD becomes a complete feature inventory with traceability to the pages that need each feature. 📋</output>

## Requirement Extraction

<ask>**Let's identify the functional requirements this page revealed.**

Think about:

- API endpoints needed
- Data validation rules
- File upload/storage
- Authentication/authorization
- External integrations
- Business logic
- Performance requirements

What functionality does this page require from the backend/platform?</ask>

<action>For each requirement:
<ask>**Requirement: {{requirement_name}}**

- What does it do?
- Why is it needed?
- Any specific constraints or rules?</ask>

<action>Document requirement details</action>
</action>

## PRD Integration

<output>**I'll add these requirements to your PRD.**

Each requirement will include:

- Clear description
- Reference to this page (e.g., "Required by: 2.1-Dog-Calendar")
- Any technical notes discovered during design</output>

<action>Read existing PRD from {output_folder}/D-PRD/PRD.md</action>

<action>Generate PRD update:

```markdown
## Functional Requirements

### {{requirement_name}}

**Required by:** {{page_reference}}

- {{requirement_description}}
- {{constraints}}
- {{technical_notes}}

[Add to appropriate section of PRD]
```

</action>

<action>Update PRD file with new requirements</action>
<action>Maintain traceability: page → requirement</action>

<output>✅ **PRD updated!**

**Added {{requirement_count}} requirements:**
{{#each requirement}}

- {{requirement_name}} (required by {{page_reference}})
  {{/each}}

**PRD Location:** `D-PRD/PRD.md`

Your PRD is growing incrementally with every page you design. This creates complete traceability from design to requirements. 🎯</output>

## Page Complete

<output>**Page "{page_name}" is complete!** 🎉

**Created:**

- ✅ Specification: `C-Scenarios/{scenario}/{page}/{page}.md`
- ✅ Prototype: `C-Scenarios/{scenario}/{page}/Prototype/`
- ✅ PRD Requirements: Added to `D-PRD/PRD.md`

**Your page is development-ready with:**

- Complete Object ID mapping
- All states and interactions documented
- Multilingual content specified
- Interactive prototype for validation
- Functional requirements captured

Time to celebrate! ✨</output>

<ask>What's next?

1. **Design next page** - Continue with the next page in this scenario
2. **New scenario** - Start a different user journey
3. **Review progress** - See what's been designed
4. **Take a break** - Save and continue later

Choice [1/2/3/4]:</ask>

<check if="choice == 1">
  <action>Move to next page in scenario</action>
  <action>Return to Step 3 (design pages iteratively)</action>
</check>

<check if="choice == 2">
  <action>Return to Step 2 (define new scenario)</action>
</check>

<check if="choice == 3">
  <action>List all completed scenarios and pages</action>
  <action>Show PRD requirement count</action>
  <action>Return to this menu</action>
</check>

<check if="choice == 4">
  <output>Great design session, {user_name}! All your work is saved. Resume anytime with "continue scenario". 🎨</output>
  <action>Save progress</action>
</check>

---

**Step 4E Complete** - Page fully designed and specified!
