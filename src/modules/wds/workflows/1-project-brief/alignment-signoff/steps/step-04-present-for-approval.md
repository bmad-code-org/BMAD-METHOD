# Step 4: Present Alignment Document for Approval

## Purpose

Present the completed alignment document and guide user on next steps.

---

## Instruction

**Present the alignment document for review and approval**:

"I've created your alignment document at `docs/1-project-brief/pitch.md`. 

This alignment document (pitch) is ready to share with your stakeholders. It's designed to be clear, brief, and compelling - readable in just 2-3 minutes.

**Next steps**:
1. Share the alignment document with stakeholders for review
2. Gather their feedback - we can negotiate and make changes
3. Update the alignment document until everyone is on board
4. Once the alignment document is accepted and everyone is aligned on the idea, why, what, how, budget, and commitment
5. **After acceptance**, I'll generate the signoff document (contract/service agreement/signoff) to secure the commitment
6. Then we'll proceed to create the full Project Brief

**Remember**: The alignment phase is collaborative - we can negotiate and iterate until everyone is on the same page. The signoff document comes after acceptance to formalize the commitment. WDS has your back - we'll help you get alignment and secure commitment before starting the work!

Would you like to:
- Review the alignment document together and make any adjustments before sharing?
- Proceed to share it with stakeholders for feedback?
- Make changes based on stakeholder feedback?
- Or something else?"

---

## After Approval

**Once the alignment document is accepted**, proceed to generate the signoff document:

**Next Step**: Generate Signoff Document
→ `step-03.5-generate-contract.md` (Generate contract, service agreement, or signoff)

**Why after acceptance**: 
- The alignment phase allows for negotiation and iteration
- Stakeholders can review, provide feedback, and request modifications
- Once accepted, everyone is aligned on the project
- Then the signoff document formalizes the commitment

**After signoff document is finalized**:
- Project initiation is complete ✅
- Proceed to full Project Brief workflow:
→ `src/modules/wds/workflows/1-project-brief/project-brief/complete/workflow.md` (Full Project Brief)

The alignment document provides the foundation and context for the detailed Project Brief work. With stakeholder acceptance secured and commitment formalized, you're ready to dive into the comprehensive strategic planning.

---

## State Update

Update frontmatter of output file:

```yaml
stepsCompleted: 
  - 'step-01-start.md'
  - 'step-01.5-extract-communications.md' (if used)
  - 'step-02-explore-sections.md'
  - 'step-03-synthesize.md'
  - 'step-03.5-generate-contract.md' (if used)
  - 'step-04-present-for-approval.md'
status: 'complete'
pitch:
  realization: '[captured realization]'
  why_it_matters: '[why it matters and who we help]'
  how_we_see_it_working: '[solution approach]'
  paths_we_explored: '[options explored]'
  recommended_solution: '[preferred approach]'
  path_forward: '[WDS phases and practical workflow]'
  value_we_create: '[benefits of building, ambition, success metrics]'
  cost_of_inaction: '[consequences of not building]'
  our_commitment: '[resources needed and potential risks]'
  summary: '[summary of key points]'
  pitch_statement: '[synthesized pitch narrative]'
```

---

**Alignment & Signoff workflow complete** - Ready for stakeholder approval!

**After approval**: Project initiation is complete. Proceed to full Project Brief.

