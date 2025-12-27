# Step 02: Format Business Goals Nodes

**Goal:** Create properly formatted business goals nodes with emojis and padding

---

## Node Structure Template

```
BGX["<br/>EMOJI TITLE<br/><br/>Point 1<br/>Point 2<br/>Point 3<br/><br/>"]
```

---

## Instructions

### 1. For Each Business Goal

**Required elements:**
1. Start with `<br/>` (top padding)
2. Emoji + Title in ALL CAPS
3. Blank line (`<br/><br/>`)
4. 3-5 key points (each on separate line with `<br/>`)
5. End with `<br/><br/>` (bottom padding)

---

### 2. Choose Appropriate Emoji

**Common business goal emojis:**
- 🌟 Vision
- 📊 Objectives/Metrics
- 🚀 Growth/Expansion
- 💰 Revenue/Business
- 🤝 Partnerships/Community
- 🎯 Goals/Targets

---

### 3. Example Implementation

```mermaid
BG0["<br/>🌟 WDS VISION<br/><br/>Guiding light for designers worldwide<br/>Empowering designers in AI era<br/>Delivering exceptional value<br/>Making designers indispensable<br/><br/>"]

BG1["<br/>📊 CORE OBJECTIVES<br/><br/>1,000 designers using WDS<br/>50 hardcore evangelists ⭐<br/>100 entrepreneurs embracing<br/>100 developers benefiting<br/><br/>"]

BG2["<br/>🚀 COMMUNITY GROWTH<br/><br/>250 active community members<br/>10 speaking engagements<br/>20 case studies<br/>50 testimonials<br/><br/>"]
```

---

## Rules Checklist

- [ ] Node ID follows pattern `BG0`, `BG1`, `BG2`
- [ ] Starts with `<br/>`
- [ ] Emoji at beginning of title
- [ ] Title in ALL CAPS
- [ ] Blank line after title (`<br/><br/>`)
- [ ] 3-5 key points
- [ ] Each point ends with `<br/>`
- [ ] Ends with `<br/><br/>`
- [ ] No HTML tags (bold, italic)
- [ ] Proper quote and bracket closure `"]`

---

## Output

Store:
- `business_goals_nodes`: Array of formatted BG nodes
- `business_goals_count`: Number of goals (for connections later)

---

## Next Step

→ **[Step 03: Format Platform Node](step-03-format-platform.md)**

Create the central platform node with transformation statement.

