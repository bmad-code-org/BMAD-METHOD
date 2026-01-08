# Step 08: Quality Check

**Goal:** Verify diagram meets all quality standards before finalization

---

## Quality Checklist

Run through this comprehensive checklist to ensure diagram quality:

---

### Configuration & Structure

- [ ] **Mermaid config** includes custom font (`Inter, system-ui, sans-serif`)
- [ ] **fontSize** set to `14px`
- [ ] **Flowchart direction** is `LR` (left-to-right)
- [ ] **Section comments** present (`%% Business Goals`, etc.)

---

### Node Formatting

- [ ] **All nodes** start with `<br/>` (top padding)
- [ ] **All nodes** end with `<br/><br/>` (bottom padding)
- [ ] **All titles** are in ALL CAPS
- [ ] **All line breaks** use `<br/>` (not spaces or other methods)
- [ ] **No HTML tags** (bold, italic, etc.) in any node
- [ ] **All nodes** properly closed with `"]`

---

### Emoji Usage

- [ ] **Each persona** has matching emoji in both TG and DF nodes
- [ ] **Business goals** have appropriate emojis (🌟, 📊, 🚀)
- [ ] **Platform** has appropriate emoji (🎨, 💻, etc.)
- [ ] **Persona emojis** match persona type (🎯, 💼, 💻, etc.)
- [ ] **"WANTS" and "FEARS"** headers have NO emojis
- [ ] **Positive drivers** all have ✅ emoji
- [ ] **Negative drivers** all have ❌ emoji

---

### Driving Forces Nodes

- [ ] **Exactly 3 positive drivers** per persona (with ✅)
- [ ] **Exactly 3 negative drivers** per persona (with ❌)
- [ ] **Section headers** are "WANTS" and "FEARS" (no emojis, ALL CAPS)
- [ ] **Blank line** between WANTS and FEARS sections (`<br/><br/>`)
- [ ] **DF emoji** matches corresponding TG emoji

---

### Connections

- [ ] **All BG nodes** connect to PLATFORM
- [ ] **PLATFORM** connects to all TG nodes
- [ ] **Each TG** connects to matching DF (TG0→DF0, etc.)
- [ ] **Simple arrows** used (`-->`) - no fancy styling
- [ ] **Connection comments** present
- [ ] **No broken connections** or syntax errors

---

### Styling

- [ ] **Light gray styling** with dark text applied
- [ ] **All four classDef** statements present
- [ ] **Colors EXACTLY match** specification:
  - businessGoal: `fill:#f3f4f6,color:#1f2937,stroke:#d1d5db,stroke-width:2px`
  - platform: `fill:#e5e7eb,color:#111827,stroke:#9ca3af,stroke-width:3px`
  - targetGroup: `fill:#f9fafb,color:#1f2937,stroke:#d1d5db,stroke-width:2px`
  - drivingForces: `fill:#f3f4f6,color:#1f2937,stroke:#d1d5db,stroke-width:2px`
- [ ] **Platform** has thicker border (3px vs 2px)
- [ ] **All BG nodes** assigned to businessGoal class
- [ ] **PLATFORM** assigned to platform class
- [ ] **All TG nodes** assigned to targetGroup class
- [ ] **All DF nodes** assigned to drivingForces class
- [ ] **Node counts** in class assignments match actual diagram

---

### Content Quality

- [ ] **Business goals** have 3-5 key points each
- [ ] **Platform** includes transformation statement
- [ ] **Target groups** have 3-4 profile traits each
- [ ] **Drivers** are concise (under 40 characters)
- [ ] **All text** is clear and readable
- [ ] **Priority levels** properly indicated (PRIMARY, SECONDARY, etc.)

---

### Syntax

- [ ] **No syntax errors** in Mermaid code
- [ ] **All brackets** properly closed
- [ ] **All quotes** properly closed
- [ ] **Node IDs** follow pattern (BG0, TG0, DF0, etc.)
- [ ] **Diagram renders** without errors

---

## Common Issues & Fixes

### Issue: Diagram doesn't render
**Check:**
- Missing closing bracket `]` or quote `"`
- HTML tags in content (remove them)
- Incorrect Mermaid syntax

### Issue: Emoji doesn't match
**Fix:**
- Find TG node emoji
- Copy exact emoji to corresponding DF node

### Issue: Wrong colors
**Fix:**
- Use EXACT color codes from specification
- Don't create custom colors

### Issue: Missing padding
**Fix:**
- Add `<br/>` at start of every node
- Add `<br/><br/>` at end of every node

---

## Visual Inspection

**The diagram should look:**
- ✅ Clean and professional
- ✅ Easy to scan left-to-right
- ✅ Consistent spacing and alignment
- ✅ Subtle colors (not garish)
- ✅ Dark text readable on light backgrounds
- ✅ Platform visually emphasized

**The diagram should NOT:**
- ❌ Have harsh colors or gradients
- ❌ Be hard to read
- ❌ Have misaligned elements
- ❌ Have inconsistent formatting
- ❌ Have syntax errors

---

## Final Verification

**Test the diagram:**
1. Copy complete code
2. Paste into Mermaid live editor (<https://mermaid.live>)
3. Verify it renders correctly
4. Check all elements are visible
5. Confirm styling appears as intended

---

## Output

If all checks pass:
- ✅ **Quality verified**
- ✅ **Diagram ready for publication**
- Return `complete_diagram`

If issues found:
- 🔧 **Fix identified issues**
- Re-run quality check
- Repeat until all checks pass

---

## Next Step

→ **Complete!** Diagram is ready to include in trigger map poster.

The professional Mermaid diagram can now be inserted into:
- `00-Trigger-Map-Poster.md`
- Presentations
- Documentation
- Reports

