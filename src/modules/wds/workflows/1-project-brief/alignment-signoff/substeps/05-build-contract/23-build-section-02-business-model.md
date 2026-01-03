# Substep 23: Build Section 2 - Business Model

**Purpose**: Build the Business Model section based on user's selection

---

## Instruction

**Section 2: Business Model**

**Background**: Defines how the service will be paid for - critical foundation for all payment terms

**What it does**: Explains the selected business model and its terms

**Purpose**: Sets clear expectations about payment structure, prevents misunderstandings

**Content**: Based on user's selection from micro-21

**For each business model, include**:

**If Fixed-Price Project**:
- Model name: "Fixed-Price Project"
- Description: "This contract uses a fixed-price model. The contractor commits to deliver the specified scope of work for the agreed price, regardless of actual time or costs incurred."
- Key terms:
  - Total project price: {{total_amount}}
  - Price includes: All work within the defined scope
  - Price does NOT include: Work outside the original scope (requires change order)
  - Payment structure: {{payment_structure}} (e.g., 50% upfront, 50% on completion)
  - Not-to-exceed: Applies (see Section 10)

**If Hourly/Time-Based**:
- Model name: "Hourly/Time-Based"
- Description: "This contract uses an hourly billing model. The client pays for actual time worked at the agreed hourly rate."
- Key terms:
  - Hourly rate: {{hourly_rate}}
  - Estimated hours: {{estimated_hours}} (if applicable)
  - Estimated total: {{estimated_total}} (hourly_rate × estimated_hours)
  - Time tracking: {{time_tracking_method}} (e.g., detailed timesheets, time tracking software)
  - Billing frequency: {{billing_frequency}} (e.g., weekly, bi-weekly, monthly)
  - Not-to-exceed: {{not_to_exceed_applies}} (optional cap - see Section 10 if applicable)

**If Retainer**:
- Model name: "Monthly Retainer"
- Description: "This contract uses a retainer model. The client pays a fixed monthly amount for a minimum number of hours, with additional hours billed at the overage rate."
- Key terms:
  - Monthly retainer amount: {{monthly_retainer_amount}}
  - Minimum hours per month: {{minimum_hours_per_month}}
  - Effective hourly rate: {{effective_hourly_rate}} (retainer ÷ minimum hours)
  - Overage hourly rate: {{overage_hourly_rate}} (for hours beyond minimum)
  - Availability: {{availability_expectations}} (e.g., "Available during business hours, 2-3 day response time")
  - Retainer period: {{retainer_period}} (e.g., "Monthly, renewable")
  - Hour rollover: {{hour_rollover_policy}} (e.g., "Unused hours expire at month end" or "Up to X hours can roll over")
  - Billing: Retainer due {{retainer_due_date}} (e.g., "on the 1st of each month")

**If Hybrid**:
- Model name: "Hybrid Model"
- Description: "This contract combines multiple payment structures."
- Key terms: Combine terms from each component

---

## Next Step

After building Business Model section:
→ `24-build-section-03-scope-of-work.md` (same folder)

