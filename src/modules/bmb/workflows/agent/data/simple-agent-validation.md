# Simple Agent Validation Checklist

Validate Simple agents meet BMAD quality standards.

---

## YAML Structure

- [ ] YAML parses without errors
- [ ] `agent.metadata` includes: `id`, `name`, `title`, `icon`, `module`
- [ ] `agent.metadata.module` is `stand-alone` or module code (`bmm`, `cis`, `bmgd`, etc.)
- [ ] `agent.persona` exists with: `role`, `identity`, `communication_style`, `principles`
- [ ] `agent.menu` exists with at least one item
- [ ] File named: `{agent-name}.agent.yaml` (lowercase, hyphenated)

---

## Persona Validation

### Field Separation

- [ ] **role** contains ONLY knowledge/skills/capabilities (what agent does)
- [ ] **identity** contains ONLY background/experience/context (who agent is)
- [ ] **communication_style** contains ONLY verbal patterns (tone, voice, mannerisms)
- [ ] **principles** contains operating philosophy and behavioral guidelines

### Communication Style Purity

- [ ] Does NOT contain: "ensures", "makes sure", "always", "never"
- [ ] Does NOT contain identity words: "experienced", "expert who", "senior", "seasoned"
- [ ] Does NOT contain philosophy words: "believes in", "focused on", "committed to"
- [ ] Does NOT contain behavioral descriptions: "who does X", "that does Y"
- [ ] Is 1-2 sentences describing HOW they talk
- [ ] Reading aloud: sounds like describing someone's voice/speech pattern

---

## Menu Validation

### Required Fields

- [ ] All menu items have `trigger` field
- [ ] All menu items have `description` field
- [ ] All menu items have handler: `action` (Simple agents don't use `exec`)

### Trigger Format

- [ ] Format: `XX or fuzzy match on command-name` (XX = 2-letter code)
- [ ] Codes are unique within agent
- [ ] No reserved codes used: MH, CH, PM, DA (auto-injected)

### Description Format

- [ ] Descriptions start with `[XX]` code
- [ ] Code in description matches trigger code
- [ ] Descriptions are clear and descriptive

### Action Handler

- [ ] If `action: '#prompt-id'`, corresponding prompt exists
- [ ] If `action: 'inline text'`, instruction is complete and clear

---

## Prompts Validation (if present)

- [ ] Each prompt has `id` field
- [ ] Each prompt has `content` field
- [ ] Prompt IDs are unique within agent
- [ ] Prompts use semantic XML tags: `<instructions>`, `<process>`, etc.

---

## Simple Agent Specific

- [ ] Single .agent.yaml file (no sidecar folder)
- [ ] All content contained in YAML (no external file dependencies)
- [ ] No `critical_actions` section (Expert only)
- [ ] Total size under ~250 lines (unless justified)
- [ ] Compare with reference: `commit-poet.agent.yaml`

---

## Path Variables (if used)

- [ ] Paths use `{project-root}` variable (not hardcoded relative paths)
- [ ] No sidecar paths present (Simple agents don't have sidecars)

---

## Quality Checks

- [ ] No broken references or missing files
- [ ] Indentation is consistent
- [ ] Agent purpose is clear from reading persona
- [ ] Agent name/title are descriptive
- [ ] Icon emoji is appropriate

---

## What the Compiler Adds (DO NOT validate presence)

These are auto-injected, don't validate for them:
- Frontmatter (`---name/description---`)
- XML activation block
- Menu items: MH (menu/help), CH (chat), PM (party-mode), DA (dismiss/exit)
- Rules section

---

## Common Issues

### Issue: Communication Style Has Behaviors

**Wrong:** "Experienced analyst who ensures all stakeholders are heard"

**Fix:**
- identity: "Senior analyst with 8+ years..."
- communication_style: "Speaks like a treasure hunter"
- principles: "Ensure all stakeholder voices heard"

### Issue: Wrong Trigger Format

**Wrong:** `trigger: analyze`

**Fix:** `trigger: AN or fuzzy match on analyze`

### Issue: Description Missing Code

**Wrong:** `description: 'Analyze code'`

**Fix:** `description: '[AC] Analyze code'`
