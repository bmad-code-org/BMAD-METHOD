# TODO: RMTN Developer Suite

Development roadmap for rmtn-solo-dev module.

---

## Agents to Build

- [ ] Mimir (Context Keeper)
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/mimir.spec.md`
- [ ] Thor (Implementation Lead)
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/thor.spec.md`

---

## Workflows to Build

- [ ] scan-project
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/scan-project/scan-project.spec.md`
- [ ] new-quest
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/new-quest/new-quest.spec.md`
- [ ] execute-quest
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/execute-quest/execute-quest.spec.md`
- [ ] update-saga
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/update-saga/update-saga.spec.md`
- [ ] quick-fix
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/quick-fix/quick-fix.spec.md`

---

## Installation Testing

- [ ] Test installation with `bmad install`
- [ ] Verify module.yaml prompts work correctly
- [ ] Test installer.js (if present)
- [ ] Test IDE-specific handlers (if present)

---

## Documentation

- [ ] Complete README.md with usage examples
- [ ] Enhance docs/ folder with more guides
- [ ] Add troubleshooting section
- [ ] Document configuration options

---

## Next Steps

1. Build agents using create-agent workflow
2. Build workflows using create-workflow workflow
3. Test installation and functionality
4. Iterate based on testing

---

_Last updated: 2026-01-27_
