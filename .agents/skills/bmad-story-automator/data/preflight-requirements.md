# Preflight Requirements (v1.10.0)

> **🚨 CRITICAL:** Load and internalize these requirements BEFORE executing any preflight steps.

---

## MANDATORY Sequence (NO EXCEPTIONS)

Steps 1-3 MUST be completed IN ORDER using the Python helper BEFORE proceeding to steps 4-7:

1. **Step 1-2:** Request and parse epic(s) → `scripts/story-automator parse-epic`
2. **Step 3:** Parse ALL stories with complexity scoring → `scripts/story-automator parse-story --rules`
3. **GATE:** Verify `stories_json` is populated with programmatic complexity data
4. **Step 4:** Display Complexity Matrix (from step 3 data)
5. **Steps 5-7:** Custom instructions, agent config, execution settings

---

## 🛑 FORBIDDEN PATTERNS

- ❌ **NEVER** skip step 3 (complexity scoring)
- ❌ **NEVER** manually assess complexity by reading epic/story content
- ❌ **NEVER** proceed to agent configuration without displaying the Complexity Matrix
- ❌ **NEVER** guess complexity levels - they MUST come from `parse-story --rules`
- ❌ **NEVER** create state document without `stories_json` containing complexity data

---

## ✅ REQUIRED Verification

Before step 5 (Configure Agent), you MUST have:
- [ ] `stories_json` variable populated with complexity data from Python helper
- [ ] Complexity Matrix displayed to user showing all stories with levels/scores
- [ ] User has seen the complexity breakdown before being asked about agents

---

## Why This Matters

Without programmatic complexity scoring:
- Agent configuration cannot be informed by actual story difficulty
- User cannot make informed decisions about which agents to use
- The orchestration may fail or produce suboptimal results

The Python helper (`scripts/story-automator parse-story --rules`) applies consistent, deterministic rules from `data/complexity-rules.json` to score each story. This data MUST be gathered before agent configuration.

---

## Complexity Matrix Display Template

After gathering complexity data, you MUST display:

```
**Story Complexity Matrix**

| Story | Title | Score | Level | Reasons |
|-------|-------|-------|-------|---------|
| {storyId} | {title} | {score} | {level} | {reasons or "-"} |
...

**Summary:**
- Low: {count} stories
- Medium: {count} stories
- High: {count} stories
```

---

## Verification Gate (Step 3d)

Before proceeding to step 4 (Custom Instructions), verify:
- `stories_json` contains complexity data for ALL selected stories
- Complexity Matrix has been displayed to user
- If either is missing, DO NOT PROCEED - re-run step 3
