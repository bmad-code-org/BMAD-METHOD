# Alignment & Signoff Workflow

**Purpose**: Create alignment around your idea before starting the project

**When to Use**: 
- ✅ **Use Alignment & Signoff** if you need alignment with others:
  - Consultant proposing a solution to a client
  - Business hiring consultants/suppliers to build software
  - Manager/employee seeking approval for an internal project
  - Any scenario where stakeholders need to agree before starting
  
- ⏭️ **Skip Alignment & Signoff** if you're doing it yourself:
  - You have full autonomy and don't need approval
  - Go straight to the Project Brief workflow

**Why WDS Exists**: You're building systems that make the world a better place. When you need others involved, you need alignment first.

---

## Workflow Overview

**The Challenge**: When others are involved, you need alignment on:
- **The Idea** - What are we building?
- **Why** - Why should it be done?
- **What** - What does it contain?
- **How** - How will it be executed?
- **Budget** - What resources are needed?
- **Commitment** - What are we willing to commit to make it happen?

**The Solution**: The alignment & signoff workflow helps you get all your ducks in a row through 10 sections that ensure everyone understands and agrees on these critical elements.

**Key Features**:
- Makes the case for why the project matters
- Presents your idea in the best possible light
- Gets stakeholder buy-in before starting detailed work
- Can be read in 2-3 minutes
- **Allows for negotiation and iteration** - refine until everyone is on board

**Key Principle**: WDS helps with alignment - getting everyone on the same page. The alignment phase is collaborative and iterative. Once approved, the signoff document formalizes that commitment.

**The Journey**:

1. **Create the Alignment Document** - Work through 10 sections to align on Idea, Why, What, How, Budget, and Commitment
2. **Share & Negotiate** - Present to stakeholders, gather feedback, iterate until everyone is on board
3. **Get Acceptance** - Once everyone agrees, you have alignment
4. **Secure Commitment** - Generate signoff document (contract, service agreement, or internal signoff) to formalize the commitment
5. **Proceed to Project Brief** - With alignment and commitment secured, dive into detailed planning

**Different User Scenarios**:
- **Consultant proposing to client** → Alignment Document → Negotiation → Acceptance → Project Contract → Project Brief
- **Business hiring consultants/suppliers** → Alignment Document → Negotiation → Acceptance → Service Agreement → Project Brief
- **Manager/employee in company** → Alignment Document → Negotiation → Acceptance → Signoff Document → Project Brief
- **Doing it yourself** → Skip alignment & signoff, go straight to Project Brief

**WDS Has Your Back**: We help you set up everything you need - from initial alignment through formal commitment, ensuring everyone is on the same page before work begins.

**After pitch acceptance and signoff document**, you have:
- ✅ Alignment on the idea, why, what, how, budget, and commitment
- ✅ Formal commitment from all stakeholders
- ✅ Clear foundation for detailed project planning

**Project initiation is complete**. Proceed to the full Project Brief workflow to dive into the detailed strategic planning.

---

## Step-by-Step Process

**Who handles this**: **Saga WDS Analyst Agent** - She specializes in helping you articulate your vision and create compelling alignment documents that get everyone aligned.

**Getting started**: 
- **You can start with either Mimir or Saga**:
  - **Mimir WDS Orchestrator** - Great if you're new, unsure, or want emotional support and gentle guidance first. He'll help clarify your situation and can connect you with Saga.
  - **Saga WDS Analyst Agent** - Perfect if you know you need alignment & signoff or want to go directly to the expert. She's professional, direct, and efficient - she can handle everything from understanding your situation to creating the alignment document and getting signoff. She's nice but plays no games - focused on getting things done.
  
**Both can help**: Mimir provides emotional support and gentle coaching, Saga provides professional, efficient alignment & signoff creation.

**Start here**: `src/modules/wds/workflows/1-project-brief/alignment-signoff/substeps/01-start-understand/01-understand-situation.md`

**Substeps Available**: 
- **Full substep flow**: `src/modules/wds/workflows/1-project-brief/alignment-signoff/substeps/README.md`
- **35 substeps** organized into 6 phase folders

**Step Files** (main workflow steps):
- `src/modules/wds/workflows/1-project-brief/alignment-signoff/steps/step-01-start.md` (references substeps)

**Workflow Phases** (organized in subfolders):
1. **Start & Understand** (`01-start-understand/`) - substeps 01-05
2. **Explore Sections** (`02-explore-sections/`) - substeps 06-16 (flexible order)
3. **Synthesize & Present** (`03-synthesize-present/`) - substeps 17-19 (includes VTC creation at 18.5)
4. **Generate Signoff** (`04-generate-signoff/`) - substeps 20-21
5. **Build Contract** (`05-build-contract/`) - substeps 22-33
6. **Build Internal Signoff** (`06-build-signoff-internal/`) - substeps 34-35

**Important**: The alignment phase allows for negotiation and iteration. You can update and refine the alignment document until everyone is on board. The signoff document (contract/service agreement/signoff) is generated AFTER the alignment document is accepted, ensuring everyone is aligned before formalizing the commitment.

**After approval**: Proceed to full Project Brief workflow

---

## Alignment Document Structure

The alignment document (pitch) covers 10 sections:

1. **The Realization** - What we've realized needs attention
2. **Why It Matters** - Why this matters and who we help
3. **How We See It Working** - Brief overview of the solution approach
4. **Paths We Explored** - 2-3 solution options we considered
5. **Recommended Solution** - Preferred approach and why
6. **The Path Forward** - How the work will be done (WDS phases and practical approach)
7. **The Value We'll Create** - What happens if we DO build this
8. **Cost of Inaction** - What happens if we DON'T build this
9. **Our Commitment** - Resources needed and potential risks
10. **Summary** - Summary of key points

---

## Outputs

**Alignment Document (Pitch)**: `docs/1-project-brief/pitch.md` (Always generated)
- Clear, brief, readable in 2-3 minutes
- Makes the case for the project
- Includes Value Trigger Chain (VTC) for strategic clarity
- Share with clients/stakeholders for approval

**Value Trigger Chain**: `docs/1-project-brief/vtc-primary.yaml` (Recommended)
- Simplified strategic summary
- Business Goal → Solution → User → Driving Forces → Awareness
- Strengthens pitch with clear strategic reasoning
- Takes 20-30 minutes to create

**Signoff Document** (Generated AFTER alignment acceptance):
- **Project Contract**: `docs/1-project-brief/contract.md` - For consultant → client (after client accepts alignment document)
- **Service Agreement**: `docs/1-project-brief/service-agreement.md` - For business → suppliers (after suppliers accept alignment document)
- **Signoff Document**: `docs/1-project-brief/signoff.md` - For internal company projects (after stakeholders accept alignment document)
- Based on the accepted alignment document, includes scope, investment, timeline, deliverables, and commitment
- Formalizes the commitment - everyone has signed off on the idea, why, what, how, budget, and commitment
- Generated after alignment acceptance to secure commitment before starting work

---

## After Alignment Acceptance and Signoff Document

**Project Initiation Complete** ✅

Once the alignment document is accepted and the signoff document is finalized:
- **Alignment achieved** - Everyone agrees on the idea, why, what, how, budget, and commitment
- **Commitment secured** - Formal signoff from all stakeholders
- **Foundation established** - Clear understanding of what will be built and how
- Ready to proceed to detailed strategic planning

**Next**: Full Project Brief workflow
→ `src/modules/wds/workflows/1-project-brief/project-brief/complete/workflow.md`

**Remember**: The alignment phase allows for negotiation and iteration. You can update the alignment document until everyone is on board. The signoff document is generated AFTER acceptance to formalize the commitment, ensuring everyone is aligned before starting the actual project work.

**WDS Has Your Back**: We've helped you get alignment and secure commitment. Now you're ready to build something that makes the world a better place! 🚀

