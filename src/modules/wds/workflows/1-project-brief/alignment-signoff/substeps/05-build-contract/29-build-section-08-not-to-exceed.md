# Substep 29: Build Section 8 - Not to Exceed Clause (Conditional)

**Purpose**: Build Not-to-Exceed clause based on business model

---

## Instruction

**Section 8: Not to Exceed Clause** (Conditional - applies to Fixed-Price and optionally Hourly)

**Background**: Sets maximum budget cap - only applies to certain business models

**What it does**: States that costs will not exceed a specified amount without approval

**Purpose**: 
- Protects both parties from unexpected cost overruns
- **Prevents scope creep** - Any work beyond original scope requires approval
- Fair budget protection for everyone

**When this section applies**:
- **Fixed-Price Project**: ✅ REQUIRED - This is the project price cap
- **Hourly/Time-Based**: ⚠️ OPTIONAL - Can include optional not-to-exceed cap if desired
- **Retainer**: ❌ NOT APPLICABLE - Retainer already has monthly cap
- **Hybrid**: ⚠️ CONDITIONAL - May apply to fixed-price components

**If applicable, include**:
- **Why this matters**:
  - Without this clause, costs could spiral out of control (fixed-price)
  - Protects your budget from unexpected expenses
  - Prevents scope creep by requiring approval for additional work
  - Ensures contractor gets paid fairly for extra work through change orders
  - Creates clear boundaries that prevent misunderstandings
- **User options**:
  - **Fixed budget cap**: Hard limit that cannot be exceeded without new agreement
  - **Soft cap with buffer**: Cap with small percentage buffer (e.g., 10%) for minor overruns
  - **Cap with change order process**: Cap exists, but change orders can adjust it with approval
- **What to ask user**: 
  - **For Fixed-Price**: "The not-to-exceed amount is [total_amount]. This protects both parties from cost overruns. Any work beyond the original scope requires a change order."
  - **For Hourly**: "Would you like to set an optional not-to-exceed cap? This protects your budget while still allowing flexibility."
- **Content**: 
  - **Fixed-Price**: Not-to-exceed = total project price
  - **Hourly**: Optional cap amount if user wants one
- **Fairness note**: "This protects your budget while ensuring I get paid fairly for additional work if needed through the change order process"

---

## Decision Point

**If section applies**:
→ `30-build-section-09-work-initiation.md` (same folder)

**If section doesn't apply** (Retainer):
→ `30-build-section-09-work-initiation.md` (same folder - skip this section)

