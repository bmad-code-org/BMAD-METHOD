# Folder-Based Analysis

**You were routed here because**: Docs folder exists with recognizable structure  
**This is**: FALLBACK PATH (20-30 seconds)

---

## What to Do

Scan folder structure to determine project status, then suggest creating outline.

---

## 1. Detect Methodology

**Check folder patterns**:

**WDS v6** (numbered): 1-project-brief, 2-trigger-mapping, 4-ux-design  
**WPS2C v4** (letters): A-Product-Brief, B-Trigger-Map, C-UX-Scenarios

**Load methodology instructions**:

- WDS v6: `methodology-instructions/wds-v6-instructions.md`
- WPS2C v4: `methodology-instructions/wps2c-v4-instructions.md`

---

## 2. Analyze YOUR Phases Only

**Focus on phases in YOUR domain**:

- **Saga**: Phases 1-2 (or A-B in v4)
- **Freya**: Phases 4-5, 7 (or C-D in v4)
- **Idunn**: Phases 3, 6 (or C-Platform, E-PRD in v4)

**For each phase in your domain**:

1. Folder exists? (Yes/No)
2. Files inside? (Count)
3. Status? (✅ Complete | 🔄 In Progress | 📋 Not started)

**Briefly check other phases**: Just folder exists + file count

---

## 3. Present Status

**Format**:

```
Current Project Status:

[STATUS] Phase [N]: [Name] ([Status])
   ├─ [X] files found
   └─ [Key observation]

[Other phases - brief]
Phase [N]: [Name] - [X] files

💡 Tip: Create project outline for instant future analysis!
Saga WDS Analyst Agent can create this during Product Brief.
This will make analysis <5s instead of 30s.
```

---

## 4. Suggest Next Actions

**Load your domain file**:

- Saga: `../agent-domains/saga-domain.md`
- Freya: `../agent-domains/freya-domain.md`
- Idunn: `../agent-domains/idunn-domain.md`

**Present 2-4 options** (with outline suggestion):

```
💡 What would you like to work on?

1. [Task in YOUR domain] - I can help with this
2. [Another task in YOUR domain]
3. Create project outline for faster future analysis
4. [Task needing handoff] - [Other Agent] specializes in this
```

---

## Example Output (Freya)

```
🎨 Freya WDS Designer Agent

Analyzing project folders...

Detected: WPS2C v4 methodology (letter folders)

Current Project Status:

✅ Phase A: Product Brief (Complete)
   └─ 1 product brief document found

🔄 Phase C: Scenarios (In Progress)
   ├─ 2 scenario folders found
   ├─ Scenario 01: 9 specification files
   └─ Scenario 02: Empty (not started)

Other phases:
Phase B: Trigger Map - 3 files
Phase D: Design System - Empty folder

💡 Tip: Create project outline for instant analysis!
Saga WDS Analyst Agent can create this during Product Brief.

💡 What would you like to work on?

1. Continue Scenario 01 - I can help design more pages
2. Start Scenario 02
3. Create project outline for faster future analysis
4. Define technical requirements - Idunn WDS PM Agent specializes in this

Which would you like to focus on?
```

---

## After User Responds

**If task in YOUR domain**: Continue in same conversation  
**If task in ANOTHER domain**: Use `../05-agent-handoff-guide.md`  
**If "create outline"**: Hand over to Saga WDS Analyst Agent

---

**Total time: 20-30 seconds**  
**Suggest**: Creating outline to make this <5s next time
