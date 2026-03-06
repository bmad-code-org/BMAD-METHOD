---
name: 'step-02-capture'
description: 'Structured capture with quality checks'
nextStepFile: './step-03-review.md'
---

# Step 2: Capture

## STEP GOAL
Capture the knowledge with high quality — specific, contextual, tagged, and findable.

## QUALITY CHECKLIST

Before each capture, verify:

- [ ] **Specific:** Includes concrete details (values, names, measurements)
- [ ] **Contextual:** Explains where this was tested/discovered
- [ ] **Actionable:** Another agent could use this without asking for more info
- [ ] **Tagged:** Topics and components set for searchability
- [ ] **Not a duplicate:** Doesn't repeat existing entries

## CAPTURE FORMATS

### Text Knowledge
```
capture_knowledge({
  content: "[specific, contextual insight — 50-200 words]",
  category: "[chosen category]",
  project: "[project]",
  designer: "marten",
  topics: ["tag1", "tag2"],
  components: ["component1"],
  source: "agent-dialog"
})
```

### Visual Knowledge
```
capture_visual({
  content: "[200-400 word description of what it looks like and why it works]",
  image_base64: "[base64 screenshot]",
  category: "[chosen category]",
  project: "[project]",
  pattern_type: "approved",
  topics: ["tag1", "tag2"],
  components: ["component1"]
})
```

## QUALITY EXAMPLES

### Good
"Bottom sheet navigation works better than hamburger menu for mobile service sites with 4-6 primary actions. Tested on Kalla — task completion felt faster, reduced confusion about available actions. Key insight: services (not content) need actions visible, not hidden."

### Bad
"Bottom sheets are good for mobile."

### Good (component experience)
"Component: Radix Dialog. Context: Used in Kalla booking flow, 3 nested states. Behavior: Focus trap works perfectly, but z-index conflicts with sticky header at z-50. Solution: portal the dialog to body. Transferable: always portal modals when sticky elements exist."

### Bad
"Radix Dialog has z-index issues."

## BATCH CAPTURE

If capturing multiple insights:
1. Capture each as a separate entry (not one giant entry)
2. Use consistent project/topic tags across the batch
3. Wait 25s between visual captures
4. Number them for tracking: "Capturing 1/5..."

## SUCCESS
- All insights captured with quality checklist met
- Tags consistent across batch
- Visual captures have dual embeddings
- Each entry is independently findable

→ Load next: `./step-03-review.md`
