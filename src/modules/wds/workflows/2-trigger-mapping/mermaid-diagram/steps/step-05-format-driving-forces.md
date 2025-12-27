# Step 05: Format Driving Forces Nodes

**Goal:** Create driving forces nodes with wants (✅) and fears (❌) for each persona

---

## Node Structure Template

```
DFX["<br/>EMOJI PERSONA'S DRIVERS<br/><br/>WANTS<br/>✅ Positive driver 1<br/>✅ Positive driver 2<br/>✅ Positive driver 3<br/><br/>FEARS<br/>❌ Negative driver 1<br/>❌ Negative driver 2<br/>❌ Negative driver 3<br/><br/>"]
```

---

## Instructions

### 1. For Each Persona (Match TG Nodes)

**Required elements:**
1. Start with `<br/>` (top padding)
2. **Same emoji as corresponding TG node** + "PERSONA'S DRIVERS"
3. Blank line (`<br/><br/>`)
4. "WANTS" header (no emoji)
5. Exactly 3 positive drivers with ✅ emoji
6. Blank line (`<br/><br/>`)
7. "FEARS" header (no emoji)
8. Exactly 3 negative drivers with ❌ emoji
9. End with `<br/><br/>` (bottom padding)

---

### 2. Critical Emoji Rules

**Matching emoji:**
- DF node MUST use same emoji as corresponding TG node
- TG0 (🎯) → DF0 (🎯)
- TG1 (💼) → DF1 (💼)
- TG2 (💻) → DF2 (💻)

**Driver emojis:**
- ✅ (white check mark) for all positive drivers
- ❌ (red X) for all negative drivers
- NO emojis on "WANTS" and "FEARS" headers

---

### 3. Driver Formatting

**Each driver:**
- Starts with emoji (✅ or ❌)
- One space after emoji
- Concise text (keep under 40 characters if possible)
- Ends with `<br/>`

**Exactly 3 drivers per category** - no more, no less

---

### 4. Example Implementation

```mermaid
DF0["<br/>🎯 STINA'S DRIVERS<br/><br/>WANTS<br/>✅ Be strategic expert<br/>✅ Make real impact<br/>✅ Use AI confidently<br/><br/>FEARS<br/>❌ Being replaced by AI<br/>❌ Wasting time/energy<br/>❌ Being sidelined<br/><br/>"]

DF1["<br/>💼 LARS'S DRIVERS<br/><br/>WANTS<br/>✅ Happy & productive team<br/>✅ Smooth transition<br/>✅ Quality work<br/><br/>FEARS<br/>❌ Quality dropping<br/>❌ Being taken advantage<br/>❌ Team embarrassment<br/><br/>"]

DF2["<br/>💻 FELIX'S DRIVERS<br/><br/>WANTS<br/>✅ Clear specifications<br/>✅ Logical thinking<br/>✅ Enlightened day<br/><br/>FEARS<br/>❌ Illogical designs<br/>❌ Vague specs<br/>❌ Forced UI work<br/><br/>"]
```

---

## Rules Checklist

- [ ] Node ID follows pattern `DF0`, `DF1`, `DF2` (matching TG nodes)
- [ ] Starts with `<br/>`
- [ ] **Emoji matches corresponding TG node emoji**
- [ ] "PERSONA'S DRIVERS" in ALL CAPS
- [ ] Blank line after title (`<br/><br/>`)
- [ ] "WANTS" header (no emoji, ALL CAPS)
- [ ] Exactly 3 positive drivers with ✅
- [ ] Blank line between sections (`<br/><br/>`)
- [ ] "FEARS" header (no emoji, ALL CAPS)
- [ ] Exactly 3 negative drivers with ❌
- [ ] Ends with `<br/><br/>`
- [ ] No HTML tags
- [ ] Proper quote and bracket closure `"]`

---

## Common Mistakes to Avoid

❌ **Don't:**
- Use different emoji than TG node
- Add emojis to "WANTS" or "FEARS" headers
- Include more or less than 3 drivers per category
- Forget blank line between sections

✅ **Do:**
- Match emoji exactly from TG node
- Keep "WANTS" and "FEARS" plain text
- Use exactly 3 drivers per category
- Maintain consistent spacing

---

## Output

Store:
- `driving_forces_nodes`: Array of formatted DF nodes
- Verify emoji matching with TG nodes

---

## Next Step

→ **[Step 06: Create Connections](step-06-create-connections.md)**

Connect all nodes in the proper flow pattern.

