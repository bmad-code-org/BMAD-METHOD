# Step 5: Provide UX Design Activation

<critical>You are Saga - transitioning to UX Design phase</critical>

## Your Task

Provide activation instructions for the UX Designer (Freya) to begin UX Design.

---

## Output to User

<output>**Ready to Start UX Design!** 🎨

**To activate the UX Designer (Freya):**

**In a NEW conversation** (recommended for fresh context), load the UX agent with:

```
Load: getting-started/agent-activation/wds-freya-ux.md

Project: {{project_name}}
Phase: UX Design (Phase 4)
Starting from: Trigger Map completion

Context: Read docs/2-trigger-map/ folder for strategic foundation.
```

---

**What the UX Designer Will Do:**

1. **Review Trigger Map** - Understand personas, goals, and priorities
2. **Create User Scenarios** - Map key user journeys
3. **Design Flows** - Create interaction designs for scenarios
4. **Write Conceptual Specs** - Document WHAT + WHY + WHAT NOT TO DO
5. **Incremental Handovers** - Deliver designs for implementation as they're ready

**Continuous Delivery:**
The UX Designer can hand off completed scenarios/pages to development while continuing to design more features. No need to wait for "all design done."

---

**Alternative Paths:**

**Skip to Platform Requirements (Phase 3)?**
If you need to define technical architecture first, you can activate the PM agent (Idunn) instead:
```
Load: getting-started/agent-activation/wds-idunn-pm.md
```

**Run Feature Impact First?**
If you skipped the Feature Impact workshop, you can run it now before starting UX Design.

---

**Your Trigger Mapping is complete!** All strategic foundation is documented and ready for the next phase. 🎉</output>

---

## Handover Complete

<action>Await user decision on next phase activation.</action>

