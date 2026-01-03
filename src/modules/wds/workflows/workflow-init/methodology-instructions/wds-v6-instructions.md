# WDS v6 Methodology Instructions

# Numbered workflow phases with modern structure

## Phase Structure

WDS v6 uses **numbered phases** for clarity and flexibility:

```
1-project-brief/       → Phase 1: Product Brief
2-trigger-mapping/     → Phase 2: Trigger Mapping
3-prd-platform/        → Phase 3: PRD Platform
4-ux-design/           → Phase 4: UX Design (Scenarios)
5-design-system/       → Phase 5: Design System
6-design-deliveries/   → Phase 6: Design Deliveries
7-testing/             → Phase 7: Testing
8-ongoing-development/ → Phase 8: Ongoing Development
```

---

## Phase Details

### Phase 1: Project Brief (Required)

**Agent**: Saga WDS Analyst Agent  
**Folder**: `docs/1-project-brief/`  
**Deliverables**:

- Product vision and positioning
- Goals and success criteria
- Project constraints and assumptions
- Project outline (`.wds-project-outline.yaml`)

**Brief Levels**:

- `complete`: Full brief with stakeholder interviews
- `simplified`: 5-10 minute brief for simple projects

---

### Phase 2: Trigger Mapping (Optional)

**Agent**: Saga WDS Analyst Agent  
**Folder**: `docs/2-trigger-mapping/`  
**Deliverables**:

- Target groups
- User personas
- Business goals
- Trigger map
- Feature impact analysis

**Skip if**: Internal tools, technical products with no end users

---

### Phase 3: PRD Platform (Required)

**Agent**: Idunn WDS PM Agent  
**Folder**: `docs/3-prd-platform/`  
**Deliverables**:

- Technical architecture
- Data model
- Platform requirements
- Integration specifications
- Infrastructure needs

---

### Phase 4: UX Design (Required)

**Agent**: Freya WDS Designer Agent  
**Folder**: `docs/4-ux-design/`  
**Deliverables**:

- Scenario overview documents
- Page specifications with object IDs
- Interactive prototypes (Excalidraw/HTML)
- User flow diagrams
- Content in multiple languages

**Structure**:

```
4-ux-design/
├── 01-scenario-name/
│   ├── 00-scenario-overview.md
│   ├── 1.1-page-name.md
│   ├── 1.2-page-name.md
│   └── sketches/
│       ├── 1.1-page-name.excalidraw
│       └── 1.1-page-name-prototype.html
```

**Scenario Tracking**: Each scenario tracked in project outline with status

---

### Phase 5: Design System (Optional)

**Agent**: Freya WDS Designer Agent  
**Folder**: `docs/5-design-system/`  
**Deliverables**:

- Design tokens (colors, typography, spacing)
- Component documentation (atoms, molecules, organisms)
- HTML showcases
- Figma integration (if applicable)

**Skip if**:

- Using existing library (shadcn/ui, MUI, Radix)
- Single-product MVP
- One-off pages/simple projects

---

### Phase 6: Design Deliveries (Optional)

**Agent**: Idunn WDS PM Agent  
**Folder**: `docs/6-design-deliveries/`  
**Deliverables**:

- Complete PRD
- Implementation roadmap
- Handoff package for development
- Epic and story breakdowns

**Skip if**: Direct implementation from specs (no handoff needed)

---

### Phase 7: Testing (Optional)

**Agent**: Freya WDS Designer Agent  
**Folder**: `docs/7-testing/`  
**Deliverables**:

- Test scenarios
- Visual regression tests
- Implementation validation reports
- Comparison: specs vs. built product

---

### Phase 8: Ongoing Development (Optional)

**Agent**: Idunn WDS PM Agent  
**Folder**: `docs/8-ongoing-development/`  
**Deliverables**:

- Feature enhancement requests
- Optimization recommendations
- Evolution roadmap

**Active only for**: Existing products in maintenance phase

---

## Folder Naming Convention

WDS v6 uses **numbered prefixes** for phases:

- `1-project-brief/`
- `2-trigger-mapping/`
- `4-ux-design/` (scenarios go here)

Benefits:

- Clear ordering
- Flexible (can add phases)
- Modern structure
- Aligns with workflow numbering

---

## Project Outline Fields

For WDS v6 projects, use these folder names in the outline:

```yaml
methodology:
  type: 'wds-v6'

phases:
  phase_1_project_brief:
    folder: '1-project-brief'
  phase_2_trigger_mapping:
    folder: '2-trigger-mapping'
  phase_3_prd_platform:
    folder: '3-prd-platform'
  phase_4_ux_design:
    folder: '4-ux-design'
  phase_5_design_system:
    folder: '5-design-system'
  phase_6_design_deliveries:
    folder: '6-design-deliveries'
  phase_7_testing:
    folder: '7-testing'
  phase_8_ongoing_development:
    folder: '8-ongoing-development'
```

---

## Agent Behavior

When agents detect `methodology.type: "wds-v6"`:

- Use numbered folder names
- Follow 8-phase structure
- Apply modern WDS v6 workflows
- Use scenario-based UX design in Phase 4

---

**Version**: 1.0  
**Last Updated**: 2024-12-10  
**Part of**: WDS v6 (Whiteport Design Studio)
