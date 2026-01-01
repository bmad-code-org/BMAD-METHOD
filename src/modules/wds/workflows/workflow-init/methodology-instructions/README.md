# Methodology Instructions

This folder contains micro-instruction files for different WDS methodologies.

## Available Methodologies

### 1. WDS v6 (Default)

**File**: `wds-v6-instructions.md`  
**Structure**: Numbered phases (1-8)  
**Use for**: New projects, modern workflow

```yaml
methodology:
  type: 'wds-v6'
```

**Phases**:

- 1-project-brief
- 2-trigger-mapping
- 3-prd-platform
- 4-ux-design
- 5-design-system
- 6-design-deliveries
- 7-testing
- 8-ongoing-development

---

### 2. WPS2C v4 (Legacy)

**File**: `wps2c-v4-instructions.md`  
**Structure**: Letter-based phases (A-G)  
**Use for**: Existing v4 projects, backward compatibility

```yaml
methodology:
  type: 'wps2c-v4'
```

**Phases**:

- A-Product-Brief
- B-Trigger-Map
- C-Scenarios
- D-Design-System
- E-PRD (or D-PRD)
- F-Testing (optional)
- G-Product-Development (optional)

---

### 3. Custom Methodology

**File**: `custom-methodology-template.md` (copy and adapt)  
**Structure**: Your own!  
**Use for**: Specialized workflows, team preferences

```yaml
methodology:
  type: 'custom'
  instructions_file: 'docs/.custom-methodology.md'
```

**Examples**:

- Lean Startup (Build-Measure-Learn)
- Design Sprint (Mon-Fri)
- Shape Up (Pitch-Bet-Shape-Build-Cool down)
- JTBD (Jobs-to-Be-Done)

---

## How Agents Use These Files

### On Project Initiation (Saga)

1. Ask user which methodology they want
2. Set `methodology.type` in project outline
3. Link to appropriate instructions file
4. Walk through phases asking user intentions

### On Agent Activation (All Agents)

1. Read project outline
2. Check `methodology.type`
3. Load appropriate instructions
4. Follow methodology-specific behavior:
   - Folder naming conventions
   - Phase structure
   - Deliverable expectations

### Example Flow

**User starts new project:**

```
Saga: "Which methodology would you like to use?
1. WDS v6 (recommended for new projects)
2. WPS2C v4 (if you prefer the legacy structure)
3. Custom (define your own workflow)

User: "WDS v6"

Saga: ✅ Setting up WDS v6 methodology
      Creating project outline with numbered phases (1-8)...
```

---

## Creating a Custom Methodology

### Step 1: Copy Template

```bash
cp custom-methodology-template.md /path/to/your/project/docs/.custom-methodology.md
```

### Step 2: Define Your Phases

Edit `.custom-methodology.md`:

- List all phases
- Assign agents
- Define deliverables
- Specify folder names

### Step 3: Update Project Outline

```yaml
methodology:
  type: 'custom'
  instructions_file: 'docs/.custom-methodology.md'

phases:
  phase_1_product_brief:
    folder: '{{YOUR_PHASE_1_FOLDER}}'
    name: '{{YOUR_PHASE_1_NAME}}'
```

### Step 4: Agents Adapt Automatically

WDS agents will:

- Read your custom instructions
- Follow your folder naming
- Adapt their behavior
- Ask clarifying questions if needed

---

## Methodology Comparison

| Feature            | WDS v6         | WPS2C v4        | Custom          |
| ------------------ | -------------- | --------------- | --------------- |
| **Folder Naming**  | Numbered (1-8) | Letter (A-G)    | Your choice     |
| **Flexibility**    | High           | Medium          | Unlimited       |
| **Legacy Support** | N/A            | Full v4 support | Varies          |
| **Phase Count**    | 8 (flexible)   | 5-7 (fixed)     | Unlimited       |
| **Learning Curve** | Low            | Low (familiar)  | Depends         |
| **Agent Support**  | Full           | Full            | Adapt as needed |

---

## Best Practices

### For New Projects

✅ **Use WDS v6** - modern, flexible, full featured

### For Existing v4 Projects

✅ **Use WPS2C v4** - no migration needed, agents support it fully

### For Specialized Workflows

✅ **Use Custom** - if you have specific team processes or industry requirements

### Don't

❌ Switch methodologies mid-project (unless you have a good reason)  
❌ Create custom methodology without documenting thoroughly  
❌ Mix naming conventions within a single project

---

## Migration Paths

### v4 → v6

If you want to migrate an existing WPS2C v4 project to WDS v6:

1. **Update project outline**:

```yaml
methodology:
  type: 'wds-v6'
```

2. **Rename folders**:

```bash
A-Product-Brief → 1-project-brief
B-Trigger-Map → 2-trigger-mapping
C-Scenarios → 4-ux-design
D-Design-System → 5-design-system
E-PRD → 6-design-deliveries
```

3. **Consolidate** (optional):

```bash
C-Platform-Requirements → merge into 3-prd-platform
```

**Note**: Migration is optional. Agents work with v4 structure indefinitely.

---

## Files in This Folder

```
methodology-instructions/
├── README.md                      ← You are here
├── wds-v6-instructions.md         ← WDS v6 methodology
├── wps2c-v4-instructions.md       ← WPS2C v4 backward compatibility
└── custom-methodology-template.md ← Template for custom workflows
```

---

## Support

### Questions About Methodologies?

- Ask **Saga WDS Analyst Agent** during project initiation
- Reference methodology instructions file during any phase
- Agents adapt automatically based on `methodology.type`

### Custom Methodology Help?

- Start with `custom-methodology-template.md`
- Base it on WDS v6 or WPS2C v4
- Document thoroughly for your team
- Test with one project first

---

**Last Updated**: 2024-12-10  
**Part of**: WDS v6 (Whiteport Design Studio)  
**Folder**: `src/modules/wds/workflows/workflow-init/methodology-instructions/`
