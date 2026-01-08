# Step 02 Substeps: Reusable Workshops

This folder contains reusable workshop micro-instructions for scenario and page initialization.

---

## Structure

### scenario-init/
**Reusable scenario definition workshop** (7 micro-steps)

Used to define a scenario (user flow context):
- Core feature/experience
- User entry point
- Mental state at entry
- Mutual success goals (business + user)
- Shortest path (page sequence)
- Scenario name
- Create scenario folder structure

**Usage:**
- **Single page projects:** NOT USED (no scenarios)
- **Single scenario projects:** Used ONCE (defines the one scenario)
- **Multiple scenarios projects:** Used MULTIPLE TIMES (scenario 1, 2, 3...)

After completion, automatically routes to `page-init/`.

---

### page-init/
**Reusable page definition workshop** (8 micro-steps)

Used to define an individual page:
- Page context (determine scenario, page number)
- Page name
- Page purpose/goal
- Entry point(s)
- User mental state at entry
- Desired outcome (business + user goals)
- Page variants (if any)
- Create page folder and initial specification document

**Usage:**
- **Single page projects:** Used MULTIPLE TIMES (separate pages or variants)
- **Single scenario projects:** Used MULTIPLE TIMES (page 1.1, 1.2, 1.3...)
- **Multiple scenarios projects:** Used MULTIPLE TIMES (page 1.1, 1.2, 2.1, 2.2...)

The page-init workshop is the fundamental reusable building block for ALL page definitions.

---

## Flow

### Single Page Projects
```
step-02-setup-scenario-structure.md
    ↓
page-init/ (page 1)
    ↓
[User can add more pages]
    ↓
page-init/ (page 2)
```

### Single Scenario Projects
```
step-02-setup-scenario-structure.md
    ↓
scenario-init/ (define scenario)
    ↓
page-init/ (page 1.1)
    ↓
[User can add more pages]
    ↓
page-init/ (page 1.2)
```

### Multiple Scenarios Projects
```
step-02-setup-scenario-structure.md
    ↓
scenario-init/ (scenario 1)
    ↓
page-init/ (page 1.1)
    ↓
[User can add more pages to scenario 1]
    ↓
page-init/ (page 1.2)
    ↓
[User can add more scenarios]
    ↓
scenario-init/ (scenario 2)
    ↓
page-init/ (page 2.1)
```

---

## Key Design Principles

1. **One question per file** - Prevents agent from skipping steps
2. **Strict sequential flow** - Each step explicitly loads the next
3. **Reusable workshops** - Can be called multiple times as project grows
4. **Clear separation** - Scenario definition vs. page definition
5. **Context-aware** - Workshops adapt based on project structure

---

**Last Updated:** 2025-12-27

