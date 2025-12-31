# BMad Method Brownfield Development Guide

## Working on Existing Projects

If you have completed your initial PRD on a new project and want to add new features, or if you have a legacy project you are maintaining, you will want to follow the brownfield process.

This document is intentionally brief, focusing only on what differs from the standard greenfield flow.

---

## 1. Clean Up Completed Planning Artifacts

If you have completed all PRD epics and stories through the BMad process, clean up those files. Archive them, delete them, or rely on version history if needed. Do not keep these files in:
- `docs/`
- `_bmad-output/planning-artifacts/`
- `_bmad-output/implementation-artifacts/`

## 2. Maintain Quality Project Documentation

Your `docs/` folder should contain succinct, well-organized documentation that accurately represents your project:
- Intent and business rationale
- Business rules
- Architecture
- Any other relevant project information

For complex projects, consider using the `document-project` workflow. It offers runtime variants that will scan your entire project and document its actual current state.

## 3. Initialize for Brownfield Work

Run `workflow-init`. It should recognize you are in an existing project. If not, explicitly clarify that this is brownfield development for a new feature.

### Choosing Your Approach

You have two primary options depending on the scope of changes:

| Scope                          | Recommended Approach                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Small updates or additions** | Use `quick-flow-solo-dev` to create a tech-spec and implement the change. The full four-phase BMad method is likely overkill. |
| **Major changes or additions** | Start with the BMad method, applying as much or as little rigor as needed.                                                    |

### During PRD Creation

When creating a brief or jumping directly into the PRD, ensure the agent:
- Finds and analyzes your existing project documentation
- Reads the proper context about your current system

You can guide the agent explicitly, but the goal is to ensure the new feature integrates well with your existing system.

### UX Considerations

UX work is optional. The decision depends not on whether your project has a UX, but on:
- Whether you will be working on UX changes
- Whether significant new UX designs or patterns are needed

If your changes amount to simple updates to existing screens you are happy with, a full UX process is unnecessary.

### Architecture Considerations

When doing architecture, ensure the architect:
- Uses the proper documented files
- Scans the existing codebase

Pay close attention here to prevent reinventing the wheel or making decisions that misalign with your existing architecture.

---

## 4. Ad-Hoc Changes

Not everything requires the full BMad method or even quick-flow. For bug fixes, refactorings, or small targeted changes, simply talk to the agent and have it make the changes directly. This is also a good way to learn about your codebase and understand the modifications being made.

---

## 5. Learn and Explore

Remember, LLMs are excellent at interpreting and analyzing code—whether it was AI-generated or not. Use the agent to:
- Learn about your project
- Understand how things are built
- Explore unfamiliar parts of the codebase