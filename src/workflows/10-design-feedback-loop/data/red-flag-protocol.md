# Proactive Improvement Protocol

How agents use accumulated feedback pairs to improve designs before presenting them.

## The Principle

After enough feedback pairs accumulate, agents can recognize designs that resemble known "before" states and apply the learned improvement proactively. This isn't about flagging problems — it's about applying solutions the designer has already validated.

## When to Run

**Before presenting ANY new design to the designer.**

This includes:
- Wireframes
- Visual mockups
- Component designs
- Layout proposals
- Color scheme suggestions

## How to Run

```
search_preference_patterns({
  description: "[detailed description of your proposed design]",
  image_base64: "[screenshot if available]",
  project: "[current project]",
  designer: "marten",
  semantic_threshold: 0.75,
  visual_threshold: 0.70
})
```

## Interpreting Results

### No matches
The design doesn't resemble any known "before" states. Proceed with confidence.

### Semantic match (text similarity)
The *description* of your design is similar to a known starting point. Read the improvement and check if the same principle applies.

### Visual match (image similarity)
Your design *looks like* a known starting point. The visual embedding caught a pattern the text might not describe. Take this seriously — apply the improvement.

### Both match
Strong signal. Definitely apply the learned improvement.

## Applying Improvements

1. Read the approved alternative carefully
2. Identify the specific improvement (the delta)
3. Apply it to your design
4. Present the improved version
5. Mention it naturally: "I applied [principle] — it's worked well in similar designs."

## Thresholds

| Check | Default | Meaning |
|-------|---------|---------|
| Semantic | 0.75 | Description is 75%+ similar to a known "before" |
| Visual | 0.70 | Design looks 70%+ similar to a known "before" |

Lower thresholds catch more patterns but increase false positives. Adjust per project.

## Learning Curve

| Pairs | Agent Behavior |
|-------|---------------|
| 0-10 | Manual: always ask the designer |
| 10-50 | Assisted: suggest improvements based on patterns |
| 50+ | Proactive: apply improvements before presenting |
| 100+ | Anticipatory: design choices already reflect taste |
