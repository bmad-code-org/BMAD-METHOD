# Step 03: Format Platform Node

**Goal:** Create the central platform node with product name and transformation statement

---

## Node Structure Template

```
PLATFORM["<br/>EMOJI PRODUCT NAME<br/><br/>Category or tagline<br/><br/>Transformation statement<br/>that spans multiple lines<br/>describing the change<br/><br/>"]
```

---

## Instructions

### 1. Platform Node Format

**Required elements:**
1. Start with `<br/>` (top padding)
2. Emoji + Product name in ALL CAPS
3. Blank line (`<br/><br/>`)
4. Category or tagline
5. Blank line (`<br/><br/>`)
6. Transformation/value statement - break across multiple lines
7. End with `<br/><br/>` (bottom padding)

---

### 2. Choose Platform Emoji

**Common platform emojis:**
- 🎨 Design/Creative products
- 💻 Software/Tech products
- 📱 Mobile/App products
- 🛠️ Tools/Utilities
- 📊 Analytics/Data products
- 🤖 AI/Automation products

---

### 3. Transformation Statement

**The transformation statement should:**
- Describe the before → after change
- Be emotionally compelling
- Be specific about the transformation
- Span 3-5 lines for readability
- Connect to the strategic vision and transformation goals

**Example:**
```
Transform users from frustrated<br/>manual processors into confident<br/>automated workflow managers<br/>who scale without stress
```

---

### 4. Example Implementation

```mermaid
PLATFORM["<br/>📱 SKILLSWAP<br/><br/>Peer Learning Platform<br/><br/>Connect people who want to learn<br/>with those who want to teach<br/>Exchange skills without money<br/>Build community through sharing<br/><br/>"]
```

---

## Rules Checklist

- [ ] Node ID is exactly `PLATFORM`
- [ ] Starts with `<br/>`
- [ ] Emoji at beginning
- [ ] Product name in ALL CAPS
- [ ] Category/tagline included
- [ ] Transformation statement spans multiple lines
- [ ] Each line ends with `<br/>`
- [ ] Ends with `<br/><br/>`
- [ ] No HTML tags
- [ ] Proper quote and bracket closure `"]`

---

## Output

Store:
- `platform_node`: Formatted PLATFORM node
- `transformation_statement`: For reference in other documents

---

## Next Step

→ **[Step 04: Format Target Groups](step-04-format-target-groups.md)**

Create persona nodes with priority levels and profiles.

