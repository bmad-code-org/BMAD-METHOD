# Step 04: Format Target Group Nodes

**Goal:** Create persona nodes with emojis, priority levels, and key profile traits

---

## Node Structure Template

```
TGX["<br/>EMOJI PERSONA NAME<br/>PRIORITY LEVEL<br/><br/>Profile trait 1<br/>Profile trait 2<br/>Profile trait 3<br/><br/>"]
```

---

## Instructions

### 1. For Each Persona/Target Group

**Required elements:**
1. Start with `<br/>` (top padding)
2. Emoji + Persona name in ALL CAPS
3. Priority level (PRIMARY TARGET, SECONDARY TARGET, etc.)
4. Blank line (`<br/><br/>`)
5. 3-4 key profile traits (concise, one line each with `<br/>`)
6. End with `<br/><br/>` (bottom padding)

---

### 2. Choose Persona Emoji

**Common persona emojis:**
- 🎯 Strategic/Primary personas
- 💼 Business/Leadership personas
- 💻 Technical/Developer personas
- 👥 Team/Group personas
- 🎨 Creative/Designer personas
- 📱 User/Customer personas

**Important:** Use same emoji for both TG node and corresponding DF node

---

### 3. Priority Levels

**Use consistent format:**
- PRIMARY TARGET
- SECONDARY TARGET  
- TERTIARY TARGET
- FOURTH TARGET
- FIFTH TARGET

**Always in ALL CAPS**

---

### 4. Profile Traits

**Keep traits:**
- Concise (one line each)
- Descriptive but brief
- Connected with dashes for readability
- 3-4 traits per persona

**Examples:**
- `Designer - Psychology background`
- `Job hunting - Overwhelmed`
- `AI curious but lacks confidence`

---

### 5. Example Implementation

```mermaid
TG0["<br/>🎓 SARAH THE STUDENT<br/>PRIMARY TARGET<br/><br/>University student - Limited budget<br/>Wants to learn guitar<br/>Has painting skills to trade<br/><br/>"]

TG1["<br/>💼 MARCUS THE MENTOR<br/>SECONDARY TARGET<br/><br/>Professional - Career changer<br/>Expert in coding<br/>Wants to learn business skills<br/><br/>"]

TG2["<br/>🏠 EMMA THE ENTHUSIAST<br/>TERTIARY TARGET<br/><br/>Hobbyist - Retired teacher<br/>Wants to share life experience<br/>Eager to learn new things<br/><br/>"]
```

---

## Rules Checklist

- [ ] Node ID follows pattern `TG0`, `TG1`, `TG2`
- [ ] Starts with `<br/>`
- [ ] Emoji matches persona type
- [ ] Persona name in ALL CAPS
- [ ] Priority level in ALL CAPS
- [ ] Blank line after priority (`<br/><br/>`)
- [ ] 3-4 profile traits
- [ ] Each trait ends with `<br/>`
- [ ] Ends with `<br/><br/>`
- [ ] No HTML tags
- [ ] Proper quote and bracket closure `"]`

---

## Output

Store:
- `target_group_nodes`: Array of formatted TG nodes
- `persona_emojis`: Map of persona ID to emoji (for DF nodes)
- `persona_count`: Number of personas

---

## Next Step

→ **[Step 05: Format Driving Forces](step-05-format-driving-forces.md)**

Create driving forces nodes with ✅ wants and ❌ fears.

