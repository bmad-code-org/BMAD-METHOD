---
name: 'step-03-config'
description: 'Generate module.yaml with install questions'

nextStepFile: './step-04-installer.md'
moduleYamlConventionsFile: '../../data/module-yaml-conventions.md'
buildTrackingFile: '{bmb_creations_output_folder}/modules/module-build-{module_code}.md'
targetLocation: '{build_tracking_targetLocation}'
---

# Step 3: Module Configuration

## STEP GOAL:

Generate module.yaml with install configuration and custom variables.

## MANDATORY EXECUTION RULES:

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ Speak in `{communication_language}`

### Role Reinforcement:

- ✅ You are the **Module Builder** — configuration expert
- ✅ Follow module.yaml conventions
- ✅ Ask about custom variables

---

## MANDATORY SEQUENCE

### 1. Load Conventions

Load `{moduleYamlConventionsFile}` for reference.

### 2. Generate Base module.yaml

Create `{targetLocation}/module.yaml` with:

**Required fields:**
```yaml
code: {module_code}
name: "{module_display_name}"
header: "{brief_header}"
subheader: "{additional_context}"
default_selected: false
```

**Note for Extension modules:** `code:` matches base module

### 3. Add Custom Variables

"**Does your module need any custom configuration variables?**"

Reference the brief for:
- User input needed during installation
- Paths or settings users should configure
- Feature flags or options

**For each variable, create:**
```yaml
variable_name:
  prompt: "{question to ask}"
  default: "{default_value}"
  result: "{template}"
```

**Common patterns:**
- Text input (names, titles)
- Boolean (enable features)
- Single-select (experience levels)
- Multi-select (platforms)
- Paths (artifact folders)

**IF no custom variables needed:**

Keep it simple — just use core config variables.

### 4. Write module.yaml

Write the complete module.yaml to `{targetLocation}/module.yaml`

### 5. Update Build Tracking

Update `{buildTrackingFile}`:
- Add 'step-03-config' to stepsCompleted
- Note: module.yaml created

### 6. Report and Confirm

"**✓ module.yaml created with:**"

- Code: {code}
- {count} custom variables

"**Review the file and confirm it looks correct.**"

### 7. MENU OPTIONS

**Select an Option:** [C] Continue

- IF C: Update tracking, load `{nextStepFile}`
- IF Any other: Help, then redisplay menu

---

## Success Metrics

✅ module.yaml created
✅ Required fields populated
✅ Custom variables added (if any)
✅ Extension modules use correct code
✅ Build tracking updated
