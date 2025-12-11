# Task: Check Phase A - Product Brief

**Purpose**: Analyze Product Brief completion status

**Agent**: Freyja (WDS Designer)  
**Workflow**: project-analysis  
**Phase**: analyze

---

## What to Check

### Folder Structure

```
docs/A-Product-Brief/
├── 00-* or 01-* Main Product Brief (required)
├── Additional documents (optional)
└── Assets/images (optional)
```

---

## Execution Steps

### Step 1: Check folder exists

```javascript
const folder = 'docs/A-Product-Brief/';
const exists = await checkFolder(folder);
```

**If FALSE**:

- Status: `📋 Ready to start`
- Message: "Product Brief folder not found"
- Recommendation: "Saga WDS Analyst Agent can help create Product Brief"
- **STOP**: This is a foundational phase, other phases build on this

---

### Step 2: Count documents

**Look for**:

- `.md` files in root folder
- Main brief usually: `00-*.md` or `01-*.md`

**Count**:

- Total markdown files
- Images/assets (if any)

---

### Step 3: Assess completeness

**Complete if**:

- At least 1 `.md` file exists
- Main file has >100 lines (substantial content)

**In Progress if**:

- Folder exists with <100 lines of content
- Or only placeholder files

**Missing if**:

- Folder doesn't exist
- OR folder exists but completely empty

---

## Key Content to Note

**If reading main brief**, look for these sections:

- Executive Summary / Vision
- Problem Statement
- Target Users / Market
- Goals & Success Metrics
- Constraints & Assumptions

**Don't need to verify all sections** - just note if major sections present

---

## Output Format

```yaml
phase: A
name: "Product Brief"
status: "complete" | "in_progress" | "not_started"
folder_exists: boolean
files_found: number
main_brief: "filename" | null
estimated_completion: "0%" | "50%" | "100%"
notes: "Brief observations"
```

---

## Response Templates

### Complete

```
✅ Phase A: Product Brief
   └─ Complete: [filename] ([line_count] lines)
```

### In Progress

```
🔄 Phase A: Product Brief
   └─ Started: [filename] (draft stage)
```

### Not Started Yet

```
📋 Phase A: Product Brief
   └─ Ready to start: Foundation phase

💡 **Foundation Phase**: Other phases build on Product Brief

Recommendation: Activate **Saga WDS Analyst Agent** to create Product Brief through:
- Stakeholder interviews
- Requirement gathering
- Vision definition
```

---

## Agent Handoff Logic

**If Phase A is not started**:

- Suggest: Saga WDS Analyst Agent
- Reason: "Saga specializes in creating Product Briefs through systematic stakeholder interviews and requirement elicitation"
- Action: "Would you like me to hand over to Saga to begin?"

**If Phase A is in progress**:

- Suggest: Continue with Saga WDS Analyst Agent OR review with user
- Action: "Would you like to complete the Product Brief or proceed with what exists?"

**If Phase A is complete**:

- Continue to Phase B analysis
- No handoff needed

---

## Performance Target

**Execution time**: <3 seconds  
**File operations**: Folder check + file list + optional line count  
**Output**: 2-4 lines

---

## Next Task

Proceed to: `check-phase-b-trigger-map`
