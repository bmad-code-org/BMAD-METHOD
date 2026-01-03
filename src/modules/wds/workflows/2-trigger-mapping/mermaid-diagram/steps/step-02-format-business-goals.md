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

### 2. Choose Appropriate Emoji and Highlight PRIMARY GOAL

**PRIMARY GOAL (BG0) - THE ENGINE:**
- ⭐ Use star emoji for PRIMARY GOAL
- Title format: `⭐ PRIMARY GOAL: [TITLE]`
- Include "THE ENGINE" as subtitle
- This will get gold highlighting in styling step

**Secondary & Tertiary Goals:**
- 🚀 Growth/Expansion/Adoption
- 🌟 Community/Opportunities
- 📊 Objectives/Metrics
- 💰 Revenue/Business
- 🤝 Partnerships/Community
- 🎯 Goals/Targets

---

### 3. Example Implementation

```mermaid
BG0["<br/>⭐ PRIMARY GOAL: 50 BETA CHAMPIONS<br/><br/>THE ENGINE<br/>50 power users who love the product<br/>Active in community + gave feedback<br/>Naturally recommend to others<br/>Timeline: 6 months<br/><br/>"]

BG1["<br/>🚀 USER GROWTH GOALS<br/><br/>5,000 active monthly users<br/>500 paying subscribers<br/>200 business accounts<br/>1,000 community members<br/>Timeline: 12 months<br/><br/>"]

BG2["<br/>🌟 COMMUNITY VALUE<br/><br/>25 user success stories<br/>100 testimonials published<br/>10 community meetups<br/>User-generated content<br/>Timeline: 12 months<br/><br/>"]
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

