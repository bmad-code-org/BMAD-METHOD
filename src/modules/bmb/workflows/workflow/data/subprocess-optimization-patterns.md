# Subprocess Optimization Patterns

**Purpose:** Context-saving and performance patterns for subprocess/subagent usage in BMAD workflows.

---

## Golden Rules

1. **Subprocess when operations benefit from parallelization or context isolation**
2. **Return ONLY findings to parent, not full file contents** (massive context savings)
3. **Always provide graceful fallback** for LLMs without subprocess capability
4. **Match pattern to operation type** - grep/regex, deep analysis, or data operations

---

## The Three Patterns

### Pattern 1: Single Subprocess for Grep/Regex Across Many Files

**Use when:** You can run one command across many files and just need matches/failures

**Context savings:** Massive - returns only matching lines, not full file contents

**Template:**
```markdown
**Launch a subprocess that:**

1. Runs grep/regex across all target files
2. Extracts only matching lines or failures
3. Returns structured findings to parent

```bash
# Example: Find hardcoded paths across all files
for file in steps-c/*.md; do
  grep -n "{project-root}/" "$file" || echo "No matches in: $file"
done
```

**Subprocess returns to parent:**
```json
{
  "violations": [
    {"file": "step-02.md", "line": 45, "match": "{project-root}/_bmad/bmb/..."}
  ],
  "summary": {"total_files_checked": 10, "violations_found": 3}
}
```

**❌ BAD - Loads all files into parent:**
```markdown
"For EACH file, load the file and search for {project-root}/"
# Parent context gets 10 full files × 200 lines = 2000 lines loaded
```

**✅ GOOD - Single subprocess returns only matches:**
```markdown
"Launch a subprocess to grep all files for {project-root}/, return only matches"
# Parent context gets only matching lines = ~50 lines returned
```

---

### Pattern 2: Separate Subprocess Per File for Deep Analysis

**Use when:** You need to read and understand each file's prose, logic, quality, or flow

**Context savings:** High - each subprocess returns analysis, not full content

**Template:**
```markdown
**DO NOT BE LAZY - For EACH file, launch a subprocess that:**

1. Loads that file
2. Reads and analyzes content deeply (prose, logic, flow, quality)
3. Returns structured analysis findings to parent for aggregation

**Subprocess returns to parent:**
```json
{
  "file": "step-03-inquiry.md",
  "analysis": {
    "instruction_style": "Intent-based ✅",
    "collaborative_quality": "Good - asks 1-2 questions at a time",
    "issues": ["Line 67: Laundry list of 7 questions detected"]
  },
  "optimization_opportunities": ["Could use Pattern 1 for menu validation checks"]
}
```

**Example use cases:**
- Instruction style validation (read prose, classify intent vs prescriptive)
- Collaborative quality assessment (analyze question patterns)
- Frontmatter compliance (check each variable is used)
- Step type validation (verify step follows its type pattern)

**❌ BAD - Parent loads all files:**
```markdown
"Load every step file and analyze its instruction style"
# Parent context: 10 files × 200 lines = 2000 lines
```

**✅ GOOD - Per-file subprocess returns analysis:**
```markdown
"DO NOT BE LAZY - For EACH step file, launch a subprocess to analyze instruction style, return findings"
# Parent context: 10 structured analysis objects = ~200 lines
```

---

### Pattern 3: Subprocess for Data File Operations

**Use when:** Loading reference data, finding fuzzy/best matches, summarizing key findings from large datasets

**Context savings:** Massive - returns only matching rows or summaries, not entire data file

**Template:**
```markdown
**Launch a subprocess that:**

1. Loads the data file (reference docs, CSV, knowledge base)
2. Performs lookup, matching, or summarization
3. Returns ONLY relevant rows or key findings to parent

**Subprocess returns to parent:**
```json
{
  "matches": [
    {"row": 42, "rule": "Frontmatter variables must be used in body", "applies": true},
    {"row": 87, "rule": "Relative paths for same-folder refs", "applies": true}
  ],
  "summary": {"total_rules": 150, "applicable_rules": 2}
}
```

**Example use cases:**
- **Reference rules lookup**: Load 500-line standards file, return only applicable rules
- **CSV fuzzy matching**: Load product database, find best matching category
- **Document summarization**: Review 10 documents, extract only key requirements
- **Knowledge base search**: Search large knowledge base, return only top matches

**❌ BAD - Parent loads entire data file:**
```markdown
"Load {dataFile} with 500 rules and find applicable ones"
# Parent context: All 500 rules loaded (5000+ lines)
```

**✅ GOOD - Subprocess returns only matches:**
```markdown
"Launch subprocess to load {dataFile}, find applicable rules, return only those"
# Parent context: Only 2 applicable rules returned (~50 lines)
```

**Advanced example - Document review:**
```markdown
**Review 10 requirement documents to extract key details:**

"DO NOT BE LAZY - For EACH document, launch a subprocess that:
1. Loads that document
2. Extracts key requirements, decisions, constraints
3. Returns structured summary to parent

**Subprocess returns:**
```json
{
  "document": "prd-requirements.md",
  "key_findings": {
    "requirements": ["User auth", "Data export", "API integration"],
    "decisions": ["Use JWT", "PostgreSQL", "REST API"],
    "constraints": ["HIPAA compliant", "Max 100ms response"]
  }
}
```

# Parent gets summaries, not 10 full documents
```

---

## Pattern 4: Parallel Execution Opportunities

**Use when:** Multiple independent operations could run simultaneously

**Performance gain:** Reduced total execution time via parallelization

**Template:**
```markdown
**Launch subprocesses in parallel that:**

1. Each subprocess handles one independent operation
2. All subprocesses run simultaneously
3. Parent aggregates results when all complete

**Example:**
```markdown
# Instead of sequential (3× time):
"Check frontmatter, then check menu, then check step types"

# Use parallel (1× time):
"Launch 3 subprocesses in parallel:
- Subprocess 1: Check frontmatter compliance
- Subprocess 2: Check menu compliance
- Subprocess 3: Check step type compliance
Aggregate all findings"
```

---

## Graceful Fallback Pattern

**CRITICAL:** Always ensure LLMs without subprocess capability can still execute

**Universal Rule:**
```markdown
- ⚙️ If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
```

**Implementation:**
```markdown
### Step-Specific Rules:
- 🎯 Use subprocess optimization when available - [pattern description]
- 💬 If subprocess unavailable, perform operations in main thread

### Execution:
- LLMs with subprocess: Launch subprocess, aggregate findings
- LLMs without subprocess: Perform same operations sequentially in main context
```

---

## Return Pattern for Subprocesses

**Subprocesses must either:**

**Option A: Update report directly**
```markdown
"Subprocess loads validation report, appends findings, saves"
# Parent doesn't need to aggregate
```

**Option B: Return structured findings to parent**
```markdown
"Subprocess returns JSON findings to parent for aggregation"
# Parent compiles all subprocess results into report
```

**✅ GOOD - Structured return:**
```json
{
  "file": "step-02.md",
  "violations": ["..."],
  "opportunities": ["..."],
  "priority": "HIGH"
}
```

**❌ BAD - Returns full content:**
```markdown
"Subprocess loads file and returns full content to parent"
# Defeats purpose - parent gets full context anyway
```

---

## When to Use Each Pattern

| Pattern | Use When | Context Savings | Example |
| -------- | -------- | --------------- | ------- |
| **Pattern 1: Single subprocess for grep/regex** | Finding patterns across many files | Massive (1000:1 ratio) | Validate frontmatter across all steps |
| **Pattern 2: Per-file subprocess for deep analysis** | Understanding prose, logic, quality | High (10:1 ratio) | Instruction style validation |
| **Pattern 3: Data file operations** | Loading reference data, matching, summarizing | Massive (100:1 ratio) | Find applicable rules from standards |
| **Pattern 4: Parallel execution** | Independent operations that can run simultaneously | Performance gain | Frontmatter + Menu + Step type checks |

---

## Step File Integration

**How to add subprocess patterns to step files:**

### 1. Universal Rule (add to all steps)
```markdown
### Universal Rules:
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
```

### 2. Step-Specific Rules (pattern-specific)
```markdown
### Step-Specific Rules:
- 🎯 [Brief: which pattern applies]
- 💬 Subprocess must either update report OR return findings to parent
- 🚫 DO NOT BE LAZY - [specific "do not be lazy" guidance if applicable]
```

### 3. Command Sequence (detailed pattern)
```markdown
### 1. [Operation Name]

**[Appropriate subprocess directive]:**

For [Pattern 1 - grep/regex]:
"Launch a subprocess that runs [command] across all files, returns [results]"

For [Pattern 2 - per-file analysis]:
"DO NOT BE LAZY - For EACH file, launch a subprocess that [analyzes], returns [findings]"

For [Pattern 3 - data ops]:
"Launch a subprocess that loads [data file], performs [operation], returns [results]"
```

---

## Subprocess Loading Reference Data (Meta-Pattern!)

**Context-saving optimization:**

When a step needs to understand subprocess patterns with examples, load this reference file in a subprocess:

```markdown
### Step-Specific Rules:
- 🎯 Analyze subprocess optimization opportunities - use subprocess to load reference patterns for detailed examples
- 💬 Subprocess loads {subprocessPatterns} to understand patterns deeply, returns specific opportunities
- 🚫 If subprocess unavailable: Load {subprocessPatterns} in main context

**Execution:**
- With subprocess: Launch subprocess to load this file, understand patterns, identify opportunities
- Without subprocess: Load this file in main context (larger context but still functional)
```

**This step file (step-08b) demonstrates this pattern!**

---

## Validation Checklist

For subprocess optimization in step files:

- [ ] Universal fallback rule present
- [ ] Step-specific rules mention which pattern applies
- [ ] Command sequence uses appropriate subprocess directive
- [ ] "DO NOT BE LAZY" language included for Pattern 2
- [ ] Return pattern specified (update report OR return to parent)
- [ ] Graceful fallback addressed
- [ ] Context savings estimated (if applicable)
- [ ] Pattern matches operation type (grep/regex, deep analysis, or data ops)

---

## Anti-Patterns to Avoid

### ❌ Loading full files into parent
```markdown
"For EACH file, load the file, analyze it, and add to report"
# Defeats purpose - parent gets full context
```

### ❌ Subprocess returns raw content
```markdown
"Subprocess loads file and returns content to parent"
# Parent gets full content anyway
```

### ❌ No graceful fallback
```markdown
"Use subprocess to [operation]"
# LLMs without subprocess cannot proceed
```

### ❌ Wrong pattern for operation
```markdown
"Launch a subprocess per file to grep for pattern"
# Should use Pattern 1 (single subprocess for all files)
```

### ❌ Missing return specification
```markdown
"Launch a subprocess to analyze files"
# Unclear what subprocess returns to parent
```

---

## See Also

- `step-file-rules.md` - When to extract content to data files
- `step-08b-subprocess-optimization.md` - Validation step that identifies optimization opportunities
- `../steps-v/step-02b-path-violations.md` - Example of Pattern 1 (grep across files)
- `../steps-v/step-08b-subprocess-optimization.md` - Example of Pattern 2 (per-file analysis)
