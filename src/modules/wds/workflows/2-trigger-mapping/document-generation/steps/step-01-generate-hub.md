# Step 01: Generate 00-trigger-map.md (Hub & Navigation)

**Goal:** Create the main entry point with Mermaid diagram and on-page summaries

---

## Purpose

The hub document serves as:
1. **Visual entry** - Mermaid diagram at top
2. **Quick reference** - On-page summaries for all sections
3. **Navigation menu** - Links to detailed documents
4. **Strategic overview** - Key transformation and flywheel

---

## Document Structure

### 1. Header Section

```markdown
# Trigger Map: [Project Name]

> Visual overview connecting business goals to user psychology

**Created:** [Date]  
**Author:** [Name] with Saga the Analyst  
**Methodology:** Based on Effect Mapping (Balic & Domingues), adapted for WDS framework
```

---

### 2. Mermaid Diagram

<action>Load mermaid-diagram/instructions.md to generate the diagram</action>

**Requirements:**
- Gold highlighting for PRIMARY GOAL (BG0)
- Light gray professional styling
- All nodes have proper padding (`<br/>`)
- Emojis: ✅ for wants, ❌ for fears
- Exactly 3 drivers per persona
- Proper connections: BG→PLATFORM→TG→DF

---

### 3. Summary Section

**Include:**

```markdown
## Summary

**Primary Target:** [Primary Persona Name] - [one-line transformation]

**The Flywheel:**
1. ⭐ **[Primary Goal Title]** (THE ENGINE - [X] months)
2. 🚀 **[Secondary Goals Summary]** ([Target numbers] - [X] months)
3. 🌟 **[Tertiary Goals Summary]** ([Benefits for community] - [X] months)

**Key Transformation:** Transform [persona] from [current state] to [desired state] by [addressing core needs].
```

---

### 4. Detailed Documentation (Menu Section)

**For each section, provide:**
- Link to document
- Brief description (1 line)
- Key bullet points visible on page (3-5 points)

**Structure:**

```markdown
## Detailed Documentation

### Business Strategy

**[01-Business-Goals.md](01-Business-Goals.md)** - Vision, objectives, and success metrics

[Include on-page summary with:]
- Vision statement (1 sentence)
- Priority Tiers (3 tiers with key numbers)

---

### Target Users

**[02-[Name]-the-[Role].md](02-[Name]-the-[Role].md)** - Primary target persona

[Include on-page summary with:]
- Profile (1-2 sentences)
- Positive Drivers (3 bullets)
- Negative Drivers (3 bullets)
- Transformation (1 line)

---

[Repeat for secondary and tertiary personas]

---

### Strategic Implications

**[05-Key-Insights.md](05-Key-Insights.md)** - Design and development priorities

[Include on-page summary with:]
- Primary Development Focus (5 key areas)
- Critical Success Factors (3-5 bullets)
- Emotional Transformation Goals (3-5 bullets)
```

---

### 5. How to Read the Diagram

```markdown
## How to Read the Diagram

The trigger map connects business goals (left) through the platform (center) to target user groups (right) and their driving forces (far right).

**Priority:**
- ⭐ **Gold box** = PRIMARY GOAL ([Goal name] - THE ENGINE)
- 🚀 **Gray boxes** = Supporting goals driven by [primary goal]
- 🌟 **Gray boxes** = Opportunities created for community members

**Driving Forces:**
- ✅ **Green checkmarks** = Positive goals (what users want)
- ❌ **Red X marks** = Negative goals (what users fear/avoid)
```

---

### 6. Footer

```markdown
---

_Generated with Whiteport Design Studio framework_  
_Trigger Mapping methodology credits: Effect Mapping by Mijo Balic & Ingrid Domingues (inUse), adapted with negative driving forces_
```

---

## On-Page Summary Guidelines

**Each menu item MUST include:**
1. **Link with description** - What the document contains
2. **On-page content** - Key information visible without clicking
3. **Proper formatting** - Use bold, bullets, clear structure

**Why on-page summaries?**
- Users can scan the whole trigger map without clicking
- Quick reference for key information
- Navigation menu + content in one place

---

## Example Implementation

See example in: `examples/` folder

**Key features:**
- ~220-250 lines total
- Mermaid diagram at top
- Summary with transformation focus
- Each persona gets on-page bullets
- Clean navigation flow

---

## Output

<output>✅ Hub document created with diagram and navigation!</output>

Store as: `00-trigger-map.md` in trigger map folder

---

## Next Step

<output>Ready for Step 2: Generate Business Goals Document</output>

<action>Load and execute: step-02-generate-business-goals.md</action>

Do NOT skip ahead.

