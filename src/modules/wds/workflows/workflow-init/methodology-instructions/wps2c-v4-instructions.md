# WPS2C v4 Methodology Instructions

# Letter-based phases from Whiteport Sketch-to-Code v4

## Phase Structure

WPS2C v4 uses **letter-based phases** (alphabetical ordering):

```
A-Product-Brief/         → Phase A: Product Brief
B-Trigger-Map/           → Phase B: Trigger Map
C-Scenarios/             → Phase C: Scenarios (UX Design)
D-Design-System/         → Phase D: Design System
D-PRD/ or E-PRD/         → Phase E: PRD (optional)
F-Testing/               → Phase F: Testing (if exists)
G-Product-Development/   → Phase G: Ongoing Development (if exists)
```

**Note**: Original WPS2C v4 had some projects with `D-PRD/` and others with `E-PRD/`. This is a known variation in v4 structure.

---

## Phase Details

### Phase A: Product Brief (Required)

**Agent**: Saga WDS Analyst Agent  
**Folder**: `docs/A-Product-Brief/`  
**Deliverables**:

- `00-Product-Brief.md` or `01-Product-Brief.md`
- Product vision and positioning
- Goals and success criteria

**Note**: v4 typically uses simpler brief structure than v6

---

### Phase B: Trigger Map (Optional)

**Agent**: Saga WDS Analyst Agent  
**Folder**: `docs/B-Trigger-Map/`  
**Deliverables**:

- Target groups
- User personas (alliterative names)
- Trigger map with business goals
- Feature impact analysis

**Skip if**: Internal tools

---

### Phase C: Scenarios (Required)

**Agent**: Freya WDS Designer Agent  
**Folder**: `docs/C-Scenarios/`  
**Deliverables**:

- Scenario folders (01-_, 02-_, etc.)
- Page specifications with object IDs
- Sketches (Excalidraw or paper)
- Interactive prototypes

**Structure** (same as WDS v6):

```
C-Scenarios/
├── 01-scenario-name/
│   ├── 00-scenario-overview.md
│   ├── 1.1-page-name.md
│   └── Sketches/
│       └── 1.1-page-name.excalidraw
```

**Key Difference from v6**: Folder is `C-Scenarios/` instead of `4-ux-design/`

---

### Phase D: Design System (Optional)

**Agent**: Freya WDS Designer Agent  
**Folder**: `docs/D-Design-System/`  
**Deliverables**:

- Design tokens
- Component library
- HTML showcases

**Skip if**: Using component library

---

### Phase E: PRD (Optional)

**Agent**: Idunn WDS PM Agent  
**Folder**: `docs/E-PRD/` or `docs/D-PRD/` (varies by project)  
**Deliverables**:

- Complete PRD document
- Epic and story breakdowns
- Implementation roadmap

**Note**: Some v4 projects use `D-PRD/`, others `E-PRD/`. Check existing structure.

---

### Phase F: Testing (Optional)

**Agent**: Freya WDS Designer Agent  
**Folder**: `docs/F-Testing/` (if exists)  
**Deliverables**:

- Test scenarios
- Implementation validation

---

### Phase G: Product Development (Optional)

**Agent**: Idunn WDS PM Agent  
**Folder**: `docs/G-Product-Development/` (if exists)  
**Deliverables**:

- Ongoing enhancement tracking

---

## Platform Requirements

**WPS2C v4** often includes:

- `C-Platform-Requirements/` - Technical foundation separate from scenarios

In some projects, this exists alongside `C-Scenarios/`. Agents should check for both.

---

## Folder Naming Convention

WPS2C v4 uses **letter prefixes**:

- `A-Product-Brief/`
- `B-Trigger-Map/`
- `C-Scenarios/`
- `D-Design-System/`

Benefits:

- Clear alphabetical progression
- Established pattern (many existing projects)
- Compatible with legacy WPS2C workflows

Limitations:

- Less flexible (A-Z limit)
- Some confusion with D-PRD vs E-PRD

---

## Project Outline Fields

For WPS2C v4 projects, use these folder names:

```yaml
methodology:
  type: 'wps2c-v4'

phases:
  phase_1_product_brief:
    folder: 'A-Product-Brief'
  phase_2_trigger_mapping:
    folder: 'B-Trigger-Map'
  phase_3_prd_platform:
    folder: 'C-Platform-Requirements' # If exists
  phase_4_ux_design:
    folder: 'C-Scenarios'
  phase_5_design_system:
    folder: 'D-Design-System'
  phase_6_design_deliveries:
    folder: 'E-PRD' # or "D-PRD" - check existing structure
  phase_7_testing:
    folder: 'F-Testing' # if exists
  phase_8_ongoing_development:
    folder: 'G-Product-Development' # if exists
```

---

## Agent Behavior

When agents detect `methodology.type: "wps2c-v4"`:

- Use letter-based folder names
- Look for both `C-Platform-Requirements/` and `C-Scenarios/`
- Check for `D-PRD/` vs `E-PRD/` variation
- Follow WPS2C v4 workflows
- Fetch additional instructions from WPS2C GitHub if needed

---

## Migration to WDS v6

To migrate a WPS2C v4 project to WDS v6:

1. Update project outline: `methodology.type: "wds-v6"`
2. Rename folders (A→1, B→2, C-Scenarios→4-ux-design)
3. Consolidate `C-Platform-Requirements/` into `3-prd-platform/`
4. Standardize PRD folder naming

Agents can work with v4 structure without migration.

---

## Legacy Support

WDS v6 agents fully support WPS2C v4 projects:

- ✅ Read v4 folder structure
- ✅ Apply v4 naming conventions
- ✅ Fetch v4-specific instructions when needed
- ✅ No migration required

Users can continue using v4 methodology indefinitely.

---

**Version**: 1.0  
**Last Updated**: 2024-12-10  
**Based on**: Whiteport Sketch-to-Code BMAD v4  
**Part of**: WDS v6 backward compatibility
