# Agents Reference

rmtn-solo-dev includes 2 specialized agents:

---

## Mimir (The Sage)

**ID:** `_bmad/rmtn-solo-dev/agents/mimir.md`
**Icon:** 📜

**Role:**
Context Keeper, Analyst. Scans codebase, maintains "Saga" (PRD/Arch), ensures consistency. Wise, observant.

**When to Use:**
- When you need to generate initial project documentation.
- When you need to update the Saga after completing features.
- When you need "wisdom" or high-level context analysis.

**Key Capabilities:**
- Codebase scanning
- Documentation generation (PRD, Architecture)
- Context maintenance

**Menu Trigger(s):**
- `[SC]` Scan Project
- `[US]` Update Saga

---

## Thor (The Builder)

**ID:** `_bmad/rmtn-solo-dev/agents/thor.md`
**Icon:** 🔨

**Role:**
Implementation, Execution. Plans Quests, scores approaches, writes Tech Specs, writes code. Direct, powerful.

**When to Use:**
- When you want to build a new feature (Quest).
- When you need to execute a plan.
- When you need a quick bug fix.

**Key Capabilities:**
- Feature planning (Approach scoring)
- Technical Specification writing
- Code implementation
- Validation

**Menu Trigger(s):**
- `[NQ]` New Quest
- `[EX]` Execute Quest
- `[QF]` Quick Fix

---
