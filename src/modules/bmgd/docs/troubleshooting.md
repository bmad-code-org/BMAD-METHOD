# BMGD Troubleshooting

Common issues and solutions when using BMGD workflows.

---

## Installation Issues

### BMGD module not appearing

**Symptom:** BMGD agents and workflows are not available after installation.

**Solutions:**

1. Verify BMGD was selected during installation
2. Check `_bmad/bmgd/` folder exists in your project
3. Re-run installer with `--add-module bmgd`

---

### Config file missing

**Symptom:** Workflows fail with "config not found" errors.

**Solution:**
Check for `_bmad/bmgd/config.yaml` in your project. If missing, create it:

```yaml
# BMGD Configuration
output_folder: '{project-root}/docs/game-design'
user_name: 'Your Name'
communication_language: 'English'
document_output_language: 'English'
game_dev_experience: 'intermediate'
```

---

## Workflow Issues

### "GDD not found" in Narrative workflow

**Symptom:** Narrative workflow can't find the GDD.

**Solutions:**

1. Ensure GDD exists in `{output_folder}`
2. Check GDD filename contains "gdd" (e.g., `game-gdd.md`, `my-gdd.md`)
3. If using sharded GDD, verify `{output_folder}/gdd/index.md` exists

---

### Workflow state not persisting

**Symptom:** Returning to a workflow starts from the beginning.

**Solutions:**

1. Check the output document's frontmatter for `stepsCompleted` array
2. Ensure document was saved before ending session
3. Use "Continue existing" option when re-entering workflow

---

### Wrong game type sections in GDD

**Symptom:** GDD includes irrelevant sections for your game type.

**Solutions:**

1. Review game type selection at Step 7 of GDD workflow
2. You can select multiple types for hybrid games
3. Irrelevant sections can be marked N/A or removed

---

## Agent Issues

### Agent not recognizing commands

**Symptom:** Typing a command like `create-gdd` doesn't trigger the workflow.

**Solutions:**

1. Ensure you're chatting with the correct agent (Game Designer for GDD)
2. Check exact command spelling (case-sensitive)
3. Try `workflow-status` to verify agent is loaded correctly

---

### Agent using wrong persona

**Symptom:** Agent responses don't match expected personality.

**Solutions:**

1. Verify correct agent file is loaded
2. Check `_bmad/bmgd/agents/` for agent definitions
3. Start a fresh chat session with the correct agent

---

## Document Issues

### Document too large for context

**Symptom:** AI can't process the entire GDD or narrative document.

**Solutions:**

1. Use sharded document structure (index.md + section files)
2. Request specific sections rather than full document
3. GDD workflow supports automatic sharding for large documents

---

### Template placeholders not replaced

**Symptom:** Output contains `{{placeholder}}` text.

**Solutions:**

1. Workflow may have been interrupted before completion
2. Re-run the specific step that generates that section
3. Manually edit the document to fill in missing values

---

### Frontmatter parsing errors

**Symptom:** YAML errors when loading documents.

**Solutions:**

1. Validate YAML syntax (proper indentation, quotes around special characters)
2. Check for tabs vs spaces (YAML requires spaces)
3. Ensure frontmatter is bounded by `---` markers

---

## Phase 4 (Production) Issues

### Sprint status not updating

**Symptom:** Story status changes don't reflect in sprint-status.yaml.

**Solutions:**

1. Run `sprint-planning` to refresh status
2. Check file permissions on sprint-status.yaml
3. Verify workflow-install files exist in `_bmad/bmgd/workflows/4-production/`

---

### Story context missing code references

**Symptom:** Generated story context doesn't include relevant code.

**Solutions:**

1. Ensure project-context.md exists and is current
2. Check that architecture document references correct file paths
3. Story may need more specific file references in acceptance criteria

---

### Code review not finding issues

**Symptom:** Code review passes but bugs exist.

**Solutions:**

1. Code review is AI-assisted, not comprehensive testing
2. Always run actual tests before marking story done
3. Consider manual review for critical code paths

---

## Performance Issues

### Workflows running slowly

**Symptom:** Long wait times between workflow steps.

**Solutions:**

1. Use IDE-based workflows (faster than web)
2. Keep documents concise (avoid unnecessary detail)
3. Use sharded documents for large projects

---

### Context limit reached mid-workflow

**Symptom:** Workflow stops or loses context partway through.

**Solutions:**

1. Save progress frequently (workflows auto-save on Continue)
2. Break complex sections into multiple sessions
3. Use step-file architecture (workflows resume from last step)

---

## Common Error Messages

### "Input file not found"

**Cause:** Workflow requires a document that doesn't exist.

**Fix:** Complete prerequisite workflow first (e.g., Game Brief before GDD).

---

### "Invalid game type"

**Cause:** Selected game type not in supported list.

**Fix:** Check `game-types.csv` for valid type IDs.

---

### "Validation failed"

**Cause:** Document doesn't meet checklist requirements.

**Fix:** Review the validation output and address flagged items.

---

## Getting Help

### Community Support

- **[Discord Community](https://discord.gg/gk8jAdXWmj)** - Real-time help from the community
- **[GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)** - Report bugs or request features

### Self-Help

1. Check `workflow-status` to understand current state
2. Review workflow markdown files for expected behavior
3. Look at completed example documents in the module

### Reporting Issues

When reporting issues, include:

1. Which workflow and step
2. Error message (if any)
3. Relevant document frontmatter
4. Steps to reproduce

---

## Next Steps

- **[Quick Start Guide](./quick-start.md)** - Getting started
- **[Workflows Guide](./workflows-guide.md)** - Workflow reference
- **[Glossary](./glossary.md)** - Terminology
