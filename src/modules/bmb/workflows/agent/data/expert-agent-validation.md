# Expert Agent Validation Checklist

Validate Expert agents meet BMAD quality standards.

---

## YAML Structure

- [ ] YAML parses without errors
- [ ] `agent.metadata` includes: `id`, `name`, `title`, `icon`, `module`
- [ ] `agent.metadata.module` is `stand-alone` or module code (`bmm`, `cis`, `bmgd`, etc.)
- [ ] `agent.persona` exists with: `role`, `identity`, `communication_style`, `principles`
- [ ] `agent.critical_actions` exists (MANDATORY for Expert)
- [ ] `agent.menu` exists with at least one item
- [ ] File named: `{agent-name}.agent.yaml` (lowercase, hyphenated)

---

## Persona Validation

### Field Separation

- [ ] **role** contains ONLY knowledge/skills/capabilities (what agent does)
- [ ] **identity** contains ONLY background/experience/context (who agent is)
- [ ] **communication_style** contains ONLY verbal patterns (tone, voice, mannerisms)
- [ ] **communication_style** includes memory reference patterns ("Last time you mentioned...")
- [ ] **principles** contains operating philosophy and behavioral guidelines

### Communication Style Purity

- [ ] Does NOT contain: "ensures", "makes sure", "always", "never"
- [ ] Does NOT contain identity words: "experienced", "expert who", "senior", "seasoned"
- [ ] Does NOT contain philosophy words: "believes in", "focused on", "committed to"
- [ ] Does NOT contain behavioral descriptions: "who does X", "that does Y"
- [ ] Is 1-2 sentences describing HOW they talk
- [ ] Reading aloud: sounds like describing someone's voice/speech pattern

---

## critical_actions Validation (MANDATORY)

- [ ] `critical_actions` section exists
- [ ] Contains at minimum 3 actions
- [ ] **Loads sidecar memories:** `{project-root}/_bmad/_memory/{sidecar-folder}/memories.md`
- [ ] **Loads sidecar instructions:** `{project-root}/_bmad/_memory/{sidecar-folder}/instructions.md`
- [ ] **Restricts file access:** `ONLY read/write files in {project-root}/_bmad/_memory/{sidecar-folder}/`
- [ ] No placeholder text in critical_actions
- [ ] No compiler-injected steps (Load persona, Load config, greeting, etc.)

---

## Sidecar Path Format (CRITICAL)

- [ ] ALL sidecar paths use: `{project-root}/_bmad/_memory/{sidecar-folder}/...`
- [ ] `{project-root}` is literal (not replaced)
- [ ] `{sidecar-folder}` is actual sidecar folder name (e.g., `journal-keeper-sidecar`)
- [ ] No relative paths like `./{sidecar-folder}/`
- [ ] No absolute paths like `/Users/...`

---

## Menu Validation

### Required Fields

- [ ] All menu items have `trigger` field
- [ ] All menu items have `description` field
- [ ] All menu items have handler: `action` or `exec` (if module agent)

### Trigger Format

- [ ] Format: `XX or fuzzy match on command-name` (XX = 2-letter code)
- [ ] Codes are unique within agent
- [ ] No reserved codes used: MH, CH, PM, DA (auto-injected)

### Description Format

- [ ] Descriptions start with `[XX]` code
- [ ] Code in description matches trigger code
- [ ] Descriptions are clear and descriptive

### Action Handlers

- [ ] If `action: '#prompt-id'`, corresponding prompt exists
- [ ] If action references sidecar file, uses correct path format
- [ ] Sidecar update actions are clear and complete

---

## Prompts Validation (if present)

- [ ] Each prompt has `id` field
- [ ] Each prompt has `content` field
- [ ] Prompt IDs are unique within agent
- [ ] Prompts reference memories naturally when appropriate

---

## Sidecar Folder Validation

### Structure

- [ ] Sidecar folder exists: `{agent-name}-sidecar/`
- [ ] Folder name matches agent name
- [ ] `instructions.md` exists (recommended)
- [ ] `memories.md` exists (recommended)

### File References

- [ ] All referenced files actually exist
- [ ] No orphaned/unused files (unless intentional for future use)
- [ ] Files are valid format (YAML parses, markdown well-formed, etc.)

### Path Consistency

- [ ] All YAML references use correct path format
- [ ] References between sidecar files (if any) use relative paths
- [ ] References from agent YAML to sidecar use `{project-root}/_bmad/_memory/` format

---

## Expert Agent Specific

- [ ] Has sidecar folder with supporting files
- [ ] Sidecar content is fully customizable (not limited to templates)
- [ ] Memory patterns integrated into persona and prompts
- [ ] Domain restrictions enforced via critical_actions
- [ ] Compare with reference: `journal-keeper.agent.yaml`

---

## Quality Checks

- [ ] No broken references or missing files
- [ ] Indentation is consistent
- [ ] Agent purpose is clear from reading persona
- [ ] Agent name/title are descriptive
- [ ] Icon emoji is appropriate
- [ ] Memory reference patterns feel natural

---

## What the Compiler Adds (DO NOT validate presence)

These are auto-injected, don't validate for them:
- Frontmatter (`---name/description---`)
- XML activation block (your critical_actions become numbered steps)
- Menu items: MH (menu/help), CH (chat), PM (party-mode), DA (dismiss/exit)
- Rules section

---

## Common Issues

### Issue: Wrong Sidecar Path Format

**Wrong:** `./journal-keeper-sidecar/memories.md`

**Fix:** `{project-root}/_bmad/_memory/journal-keeper-sidecar/memories.md`

### Issue: Missing critical_actions

**Fix:** Add at minimum:
```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_bmad/_memory/{sidecar-folder}/memories.md'
  - 'Load COMPLETE file {project-root}/_bmad/_memory/{sidecar-folder}/instructions.md'
  - 'ONLY read/write files in {project-root}/_bmad/_memory/{sidecar-folder}/'
```

### Issue: Communication Style Missing Memory References

**Fix:** Add memory reference patterns: "I reference past naturally: 'Last time you mentioned...'"
