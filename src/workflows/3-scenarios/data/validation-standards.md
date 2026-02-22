# WDS Scenario Validation Standards

Reference document for Phase 3 validation steps.

---

## What Makes a Valid Scenario

### Minimum Requirements (must pass)
1. All 7 components present (name, feature, entry, mental state, success, path, TM connections)
2. Path is truly linear (zero branches)
3. Mental state is specific and visceral
4. Both success goals are measurable
5. Trigger Map connections are explicit

### Quality Thresholds
- Completeness: 6/7 minimum
- Quality: 5/7 minimum
- Mistakes avoided: 6/6 (all must be avoided)
- Best practices: 2/4 minimum

---

## WDS Navigation Conventions

### Page Naming
- Use user-facing names (not technical: "Tjänster", not "services-page")
- Consistent naming across scenarios (same page = same name)
- Include page purpose in descriptions

### Flow Rules
- Entry page must be reachable from the described discovery method
- Each step transitions naturally to the next
- Final step has clear success marker (✓)
- No dead ends, no impossible jumps

### Shared Pages
- Pages appearing in 2+ scenarios must serve consistent purposes
- Shared pages should accommodate all relevant personas

---

## SEO Integration

### Phase 1 → Phase 3 Connection
- Every page should map to at least one keyword from the Phase 1 keyword map
- Page names should be compatible with planned URL slugs
- No keyword cannibalization (two pages competing for same keyword)

---

## Validation Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| ❌ Critical | Blocks Phase 4 progress | Must fix before handover |
| ⚠️ Warning | Quality concern | Should fix, can proceed |
| ✅ Pass | Meets standards | No action needed |
