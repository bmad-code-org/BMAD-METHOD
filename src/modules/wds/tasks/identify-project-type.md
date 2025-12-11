# Task: Identify Project Structure

**Purpose**: Determine if project uses WDS v6, WPS2C v4, or is new/unknown

**Agent**: Freyja (WDS Designer)  
**Workflow**: project-analysis  
**Phase**: identify

---

## Execution Steps

### Step 1: Check for docs/ folder

```javascript
const docsExists = await checkFolder('docs/');
```

**If FALSE**:

- Return: `project_structure: "empty"`
- Message: "No docs/ folder found"
- Recommendation: "Suggest project setup with Saga (Analyst)"

---

### Step 2: Check for WDS v6 structure (numbered workflows)

**Look for numbered workflow folders in docs/:**

```javascript
const v6Indicators = [
  'docs/1-project-brief/',
  'docs/2-trigger-mapping/',
  'docs/3-prd-platform/',
  'docs/4-ux-design/',
  'docs/5-design-system/',
];
```

**If 3+ folders found**:

- Return: `project_structure: "wds_v6"`
- Continue to: v6 phase analysis

---

### Step 3: Check for WPS2C v4 structure (letter phases)

**Look for letter-based folders:**

```javascript
const v4Indicators = [
  'docs/A-Product-Brief/',
  'docs/B-Trigger-Map/',
  'docs/C-Scenarios/',
  'docs/D-Design-System/',
  'docs/E-Backlog/' || 'docs/D-PRD/',
];
```

**If 3+ folders found**:

- Return: `project_structure: "wps2c_v4"`
- Action: Fetch WPS2C v4 agent instructions from GitHub
- GitHub: `whiteport-sketch-to-code-bmad-expansion` repo

---

### Step 4: Unknown or Mixed Structure

**If neither pattern matches**:

- Return: `project_structure: "unknown"`
- Ask user: "Which structure would you like?"

---

## Output Format

```yaml
project_structure: "wds_v6" | "wps2c_v4" | "empty" | "unknown"
version_detected: "WDS v6" | "WPS2C v4" | "None"
folders_found: [list]
folders_missing: [list]
total_documents: number
```

---

## Response Templates

### Empty Project

```
📋 Project ready for setup

This appears to be a new project. To use WDS methodology:

💡 Recommendation: Start with Product Brief

**Saga WDS Analyst Agent** specializes in creating Product Briefs through
stakeholder interviews and requirement gathering.

Would you like me to hand over to Saga?
```

### WDS v6 Project Found

```
✅ WDS v6 Project Detected

Workflows: 1-project-brief, 2-trigger-mapping, 4-ux-design...
Documents: [count] files

Proceeding to detailed analysis...
```

### WPS2C v4 Project Found

```
✅ WPS2C v4 Project Detected

Phases: A-Product-Brief, B-Trigger-Map, C-Scenarios...
Documents: [count] files

Fetching v4 agent instructions from WPS2C repo...
Proceeding to v4 analysis...
```

### Unknown Structure

```
❓ Non-Standard Project Structure

I found a docs/ folder but it doesn't match WDS v6 or WPS2C v4.

Would you like me to:
1. Analyze it anyway (I'll adapt)
2. Set up WDS v6 structure (recommended)
3. Set up WPS2C v4 structure (legacy)
4. Tell me what you need
```

---

## Next Steps

After identification:

- If `wds_v6`: Run v6 phase analysis tasks (1-8)
- If `wps2c_v4`: Fetch GitHub instructions and run v4 analysis (A-E)
- If `empty`: Stop and recommend Saga handoff
- If `unknown`: Wait for user direction

---

## Performance Target

**Execution time**: <2 seconds  
**File operations**: Folder checks only (no file reads)  
**Output**: 3-5 lines maximum

---

## GitHub Fallback for v4

**If WPS2C v4 detected:**

```yaml
github_repo: 'whiteport-sketch-to-code-bmad-expansion'
github_file: 'docs/agents/freyja-ux.md'
fallback_action: 'Use v4 analysis pattern from legacy documentation'
```

This allows Freyja to work with older projects without requiring updates.
