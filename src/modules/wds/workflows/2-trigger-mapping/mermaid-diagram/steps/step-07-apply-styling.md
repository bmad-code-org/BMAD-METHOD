# Step 07: Apply Styling

**Goal:** Apply professional light gray styling with dark text to all nodes

---

## Styling System

**Four style classes:**
1. `businessGoal` - Business goals (lightest gray)
2. `platform` - Platform (medium gray, thick border)
3. `targetGroup` - Target groups (near white)
4. `drivingForces` - Driving forces (light gray)

---

## Instructions

### 1. Define Style Classes

**Add these exact class definitions:**

```css
classDef primaryGoal fill:#fef3c7,color:#78350f,stroke:#fbbf24,stroke-width:3px
classDef businessGoal fill:#f3f4f6,color:#1f2937,stroke:#d1d5db,stroke-width:2px
classDef platform fill:#e5e7eb,color:#111827,stroke:#9ca3af,stroke-width:3px
classDef targetGroup fill:#f9fafb,color:#1f2937,stroke:#d1d5db,stroke-width:2px
classDef drivingForces fill:#f3f4f6,color:#1f2937,stroke:#d1d5db,stroke-width:2px
```

**Rules:**
- Use these EXACT colors - do not modify
- PRIMARY GOAL (BG0) gets gold highlighting (#fef3c7) - THE ENGINE stands out
- Business goals & driving forces use same light gray (#f3f4f6)
- Platform uses medium gray (#e5e7eb) with 3px border
- Target groups use near white (#f9fafb)
- All text is dark gray (#1f2937, #111827, or #78350f for primary)
- All borders are light gray (#d1d5db, #9ca3af, or #fbbf24 for primary)

---

### 2. Color Specifications

**Background fills:**
- `#fef3c7` - Light gold/yellow (PRIMARY GOAL only - BG0)
- `#f3f4f6` - Light gray (other business goals, driving forces)
- `#e5e7eb` - Medium gray (platform only)
- `#f9fafb` - Near white (target groups)

**Text colors:**
- `#78350f` - Dark brown/gold (PRIMARY GOAL only)
- `#1f2937` - Dark gray (most nodes)
- `#111827` - Darker gray (platform only)

**Border colors:**
- `#fbbf24` - Gold border (PRIMARY GOAL only)
- `#d1d5db` - Light gray border (most nodes)
- `#9ca3af` - Medium gray border (platform only)

**Border widths:**
- `2px` - Standard (business goals, target groups, driving forces)
- `3px` - Thick (platform AND primary goal - makes them stand out)

---

### 3. Apply Classes to Nodes

**Format:**
```
class NodeID1,NodeID2,NodeID3 className
```

**Implementation:**
```
class BG0 primaryGoal
class BG1,BG2 businessGoal
class PLATFORM platform
class TG0,TG1,TG2 targetGroup
class DF0,DF1,DF2 drivingForces
```

**Note:** BG0 gets special `primaryGoal` class for gold highlighting - THE ENGINE!

**Rules:**
- List all node IDs of same type on one line
- Separate IDs with commas (no spaces)
- One class assignment per line
- Match node count to actual diagram

---

### 4. Complete Example

```mermaid
%% Light Gray Styling with Dark Text
classDef businessGoal fill:#f3f4f6,color:#1f2937,stroke:#d1d5db,stroke-width:2px
classDef platform fill:#e5e7eb,color:#111827,stroke:#9ca3af,stroke-width:3px
classDef targetGroup fill:#f9fafb,color:#1f2937,stroke:#d1d5db,stroke-width:2px
classDef drivingForces fill:#f3f4f6,color:#1f2937,stroke:#d1d5db,stroke-width:2px

class BG0,BG1,BG2 businessGoal
class PLATFORM platform
class TG0,TG1,TG2 targetGroup
class DF0,DF1,DF2 drivingForces
```

---

### 5. Variable Node Counts

**Adjust class application based on actual count:**

**2 personas:**
```
class BG0,BG1 businessGoal
class PLATFORM platform
class TG0,TG1 targetGroup
class DF0,DF1 drivingForces
```

**4 personas:**
```
class BG0,BG1,BG2,BG3 businessGoal
class PLATFORM platform
class TG0,TG1,TG2,TG3 targetGroup
class DF0,DF1,DF2,DF3 drivingForces
```

---

## Rules Checklist

- [ ] All four classDef statements included
- [ ] Colors EXACTLY match specification (no variations)
- [ ] Platform has 3px border (thicker than others)
- [ ] All BG nodes assigned to businessGoal class
- [ ] PLATFORM assigned to platform class
- [ ] All TG nodes assigned to targetGroup class
- [ ] All DF nodes assigned to drivingForces class
- [ ] Node counts match actual diagram
- [ ] Comment header included

---

## Visual Result

**When properly styled, the diagram should have:**
- Subtle, professional gray tones
- Easy-to-read dark text
- Platform visually emphasized (thicker border)
- Consistent, clean appearance
- No harsh colors or gradients
- Print-friendly design

---

## Output

Store:
- `styling_definitions`: The classDef statements
- `styling_applications`: The class assignments
- `complete_diagram`: Full diagram with styling

---

## Next Step

→ **[Step 08: Quality Check](step-08-quality-check.md)**

Verify diagram meets all quality standards.

