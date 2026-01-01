# Step 4: Complete Scenario

**Progress: Step 4 of 5** - Scenario Complete!

## YOUR TASK

Celebrate completion and provide scenario summary.

---

## GOAL

Acknowledge completion and transition to next steps.

---

## EXECUTION

<action>Load scenario-info.yaml to get final statistics</action>

<output>✅ **Scenario "{scenario_name}" complete!**

**Created:**

- Scenario folder: `C-Scenarios/{nn}-{scenario-name}/`
- Page specifications: {{page_count}} pages
  {{#if prototype_count > 0}}
- HTML prototypes: {{prototype_count}} prototypes
  {{/if}}
- PRD updates: {{requirements_count}} requirements added

**Each page includes:**

- Complete specification with Object IDs
- Component definitions
- Interaction behaviors
- State definitions
- Multilingual content
  {{#if prototype_count > 0}}
- Interactive prototype
  {{/if}}

**Your specifications are development-ready!** 🎨</output>

---

## MENU

<ask>What's next?

[C] Continue to Step 5 (Next Steps)

Choice [C]:</ask>

---

## NEXT STEP

When user selects [C], load `steps/step-05-next-steps.md` for workflow completion.
