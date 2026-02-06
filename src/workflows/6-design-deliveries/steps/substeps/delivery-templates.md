# Design Delivery Templates

Templates for handoff communication and tracking.

---

## Handoff Notification Template

```
WDS UX Expert → BMad Architect

Subject: Design Delivery DD-XXX Ready for Implementation

Hi Architect!

Design Delivery DD-XXX ([Flow Name]) is officially handed off
and ready for implementation.

📦 Artifacts:
- Design Delivery: deliveries/DD-XXX-name.yaml
- Test Scenario: test-scenarios/TS-XXX-name.yaml
- Scenarios: C-Scenarios/ ([number] scenarios)
- Components: D-Design-System/ ([number] components)
- Handoff Log: deliveries/DD-XXX-handoff-log.md

✅ What we agreed:
- Epic breakdown: [number] epics
- Estimated effort: [time]
- Implementation approach: [summary]

📋 Next steps:
1. You: Create architecture document
2. You: Break down into dev stories
3. You: Implement features
4. You: Notify me when ready for validation (Touch Point 3)

🔗 Touch Point 3:
When implementation is complete, notify me and I'll run the
test scenarios to validate. We'll iterate until approved.

Questions? I'm available!

Thanks,
[Your name]
WDS UX Expert
```

---

## Project Status Tracker Template

```markdown
# Project Status

## In Progress

### DD-XXX: [Flow Name]

- Status: In Development
- Assigned: BMad Architect
- Started: [Date]
- Estimated completion: [Date]
- Epics: [number]
- Designer: Available for questions

## Next Up

### DD-XXX+1: [Next Flow Name]

- Status: In Design
- Phase: 4-5 (UX Design & Design System)
- Designer: Working on scenarios
- Estimated handoff: [Date]
```

---

## Design Deliveries Tracker Template

```markdown
# Design Deliveries Tracker

## DD-001: [Flow Name]

- Status: In Development (BMad)
- Handed off: [Date]
- Expected completion: [Date]
- Next: Validation (Phase 7)

## DD-002: [Flow Name]

- Status: In Design (WDS)
- Phase: 4 (UX Design)
- Progress: X/Y scenarios complete
- Expected handoff: [Date]

## DD-003: [Flow Name]

- Status: Not Started
- Priority: [High/Medium/Low]
- Planned start: [Date]
```

---

## Weekly Update Template

```
Weekly Update to BMad Architect:

"Hey Architect!

Progress update:

DD-001 ([Flow Name]):
- You're building this
- I'm available for questions
- On track for validation [Date]?

DD-002 ([Flow Name]):
- I'm designing this now
- X/Y scenarios complete
- Expected handoff: [Date]

DD-003 ([Flow Name]):
- Next in queue
- Will start after DD-002 handoff

Questions or blockers on DD-001?"
```

---

## Parallel Work Strategy

```
Week 1: Design Flow 1
Week 2: Handoff Flow 1 → BMad builds Flow 1
        Design Flow 2
Week 3: Handoff Flow 2 → BMad builds Flow 2
        Test Flow 1 (Phase 7)
        Design Flow 3
Week 4: Handoff Flow 3 → BMad builds Flow 3
        Test Flow 2 (Phase 7)
        Design Flow 4
```

**You're never waiting! Always working!**

---

## Iteration Cadence

```
Week 1-2: Design DD-001
Week 2: Handoff DD-001
Week 2-4: BMad builds DD-001
Week 3-4: Design DD-002
Week 4: Handoff DD-002
Week 4-6: BMad builds DD-002
Week 5: Test DD-001 (Phase 7)
Week 5-6: Design DD-003
Week 6: Handoff DD-003
Week 6-8: BMad builds DD-003
Week 7: Test DD-002 (Phase 7)
Week 7-8: Design DD-004
```

**Continuous flow!**

---

## Communication Tips

### DO ✅

- Answer questions promptly
- Unblock issues quickly
- Provide clarifications
- "How can I help?"
- "Let's figure this out together"
- Be flexible - adjust design if technical constraints arise

### DON'T ❌

- Don't disappear after handoff
- Don't be rigid - be open to technical suggestions
- Don't ignore questions - respond within 24 hours
