# Step 3.5: Generate Agreement Document (Optional)

## Purpose

Offer to create a formal agreement document based on the pitch - contract, signoff document, or service agreement depending on context.

---

## Instruction

**After the pitch is accepted by stakeholders**, offer to create a signoff document:

"Great! The pitch has been accepted and everyone is aligned on the idea, why, what, how, budget, and commitment. 

Now let's secure this commitment with a signoff document. This will formalize what everyone has agreed to and ensure everyone stays committed to making this project happen.

**What type of document do you need?**

1. **Project Contract** - If you're a consultant and the client has approved the pitch
2. **Service Agreement** - If you're a founder/owner and suppliers have approved the pitch
3. **Project Signoff Document** - If this is an internal company project and stakeholders have approved
   - *Note: If you have an existing company signoff document format, you can upload it and I'll adapt it to match your company's format*
4. **Skip** - If you don't need a formal document right now

Which applies to your situation?

**Remember**: WDS helps with alignment - the pitch got everyone on the same page, and this signoff document secures the commitment before we start building something that makes the world a better place!"

---

## Generate Document Based on User Choice

**If user chooses "Skip"**:
- Acknowledge: "No problem! The pitch document is ready to share. You can always generate an agreement document later if needed."
- Proceed directly to step-04-present-for-approval.md

**If user chooses document type**:

**Important**: First, determine the business model, then build the contract section by section based on that model.

**Core Principle**: The goal is always to make a **simple and fair contract** that gives both parties **reliable terms for a long-lasting work relationship**.

---

## Step 1: Determine Business Model

**Before building contract sections**, we need to determine how the service will be paid for. This determines which sections we include and how we configure them.

**Ask the user**:

"First, let's determine the business model - how will this service be paid for? This helps us structure the contract correctly.

**What business model fits this project?**

1. **Fixed-Price Project** - Set price for a defined scope of work
   - Best for: Projects with clear deliverables and scope
   - Includes: Not-to-exceed clause, upfront payment recommended
   - Example: "$50,000 for complete website redesign with 5 pages"

2. **Hourly/Time-Based** - Pay for actual time worked
   - Best for: Ongoing work, uncertain scope, flexible requirements
   - Includes: Hourly rate, time tracking, optional not-to-exceed cap
   - Example: "$150/hour, estimated 200 hours"

3. **Retainer** - Monthly commitment with minimum hours
   - Best for: Ongoing support, regular availability needed
   - Includes: Monthly retainer amount, minimum hours, availability expectations, hourly rate for overage
   - Example: "$5,000/month retainer for 20 hours minimum, $200/hour for additional hours"

4. **Hybrid** - Combination of models (e.g., retainer + project work)
   - Best for: Complex arrangements with multiple work types
   - Includes: Multiple payment structures combined

Which model fits your situation?"

**After user selects business model**:

- **Confirm understanding**: "So you've chosen [model]. This means [brief explanation of what this means for the contract]."
- **Note the selection**: This will determine which sections we include and how we configure payment terms, not-to-exceed, availability, etc.
- **Proceed to section building**: "Now let's build the contract sections. I'll tailor them based on your chosen business model."

---

## Step 2: Build Contract Sections

**Important**: Build the contract section by section, explaining each part. Sections will be tailored based on the selected business model.

**Important**: Support the user in asking for fair payment terms. For fixed-price contracts, upfront payment (50-100%) is fair because the supplier assumes all cost overrun risk. Help users understand this and advocate for fair payment structures that value their work.

"I'll help you build this contract section by section. Our goal is to create a simple and fair agreement that works for both parties and builds a lasting working relationship.

For each section, I'll explain:
- **Background** - Why this section matters
- **What it does** - What it covers
- **Purpose** - What it protects or clarifies

We'll focus on clarity, fairness, and mutual benefit. Let's go through it together so you understand each part and can customize it as needed."

### Option 1: Project Contract (Consultant → Client)

**Build section by section**:

**Section 1: Project Overview**
- **Background**: Establishes what the project is about
- **What it does**: Defines the realization and solution from the pitch
- **Purpose**: Sets clear expectations and context
- **Content**: Pull from pitch (realization, recommended_solution)

**Section 2: Business Model**
- **Background**: Defines how the service will be paid for - critical foundation for all payment terms
- **What it does**: Explains the selected business model and its terms
- **Purpose**: Sets clear expectations about payment structure, prevents misunderstandings
- **Content**: Based on user's selection from Step 1

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
- Key terms:
  - Component 1: {{component_1_description}} (e.g., "Monthly retainer for ongoing support")
  - Component 2: {{component_2_description}} (e.g., "Fixed-price for initial project work")
  - How they work together: {{hybrid_explanation}}

**Section 3: Scope of Work**
- **Background**: Defines exactly what will be delivered and what won't be
- **What it does**: Lists path forward, deliverables, explicit IN scope, and explicit OUT of scope
- **Purpose**: Prevents scope creep and sets clear boundaries - critical for avoiding disputes
- **Why this matters**:
  - Most contract disputes arise from unclear scope
  - Clear IN/OUT scope prevents misunderstandings
  - Protects both parties from scope creep
  - Sets expectations upfront

**Content to gather**:
1. **The Path Forward**: Pull from pitch (path_forward) - how the work will be done
2. **Deliverables**: Pull from pitch (deliverables_list) - what will be delivered
3. **IN Scope**: Ask user explicitly - "What work is explicitly included? Be specific about what's covered."
4. **OUT of Scope**: Ask user explicitly - "What work is explicitly NOT included? What would require a change order?"

**Important**: Based on business model, adapt scope section:
- **Fixed-Price**: Must have very clear IN scope and OUT of scope (critical for fixed-price - this protects both parties)
- **Hourly**: Can be more flexible, but still define boundaries to prevent misunderstandings
- **Retainer**: Define what types of work are included in retainer vs. project work (e.g., "Retainer includes: ongoing support, bug fixes, small updates. Retainer does NOT include: new features, major redesigns, new projects")
- **Hybrid**: Define scope for each component separately

**What to ask user**:
- "Let's be very clear about what's included and what's not. What work is explicitly IN scope for this contract?"
- "What work is explicitly OUT of scope? What would require a change order?"
- "Are there any assumptions about what's included that we should document?"

**Example IN Scope**:
- "Design and development of 5 web pages as specified"
- "Up to 2 rounds of revisions per page"
- "Responsive design for mobile and desktop"
- "Basic SEO optimization"

**Example OUT of Scope**:
- "Additional pages beyond the 5 specified"
- "Content creation or copywriting"
- "Third-party integrations not specified"
- "Ongoing maintenance after delivery"
- "Photography or video production"

**Section 4: Our Commitment & Payment Terms**

- **Background**: Financial commitment needed and payment structure - tailored to business model
- **What it does**: States costs, payment schedule, and payment terms based on selected business model
- **Purpose**: Clear financial expectations - transparency builds trust
- **Why this matters**: 
  - Protects supplier from non-payment risk
  - Ensures client commits financially to the project
  - Provides cash flow for supplier to deliver quality work
  - Prevents disputes about payment timing

**Adapt based on business model** (see detailed instructions above in Section 4)

- **Content**: Pull from pitch (our_commitment), add payment schedule and terms based on business model
- **Fairness note**: Tailor to business model - for fixed-price emphasize upfront payment fairness, for retainer emphasize commitment and availability

**Section 5: Timeline**
- **Background**: When work will happen
- **What it does**: Defines schedule and milestones
- **Purpose**: Sets expectations for delivery dates
- **Content**: Extract from Work Plan or Investment Required

**Section 6: Availability** (if Retainer model)
- **Background**: Defines when contractor is available for retainer work
- **What it does**: Sets expectations for response times, working hours, availability windows
- **Purpose**: Ensures client knows when they can expect work to be done
- **Why this matters**:
  - Retainer clients need to know when contractor is available
  - Sets realistic expectations for response times
  - Prevents misunderstandings about availability
- **What to include**:
  - **Business hours**: {{business_hours}} (e.g., "Monday-Friday, 9am-5pm EST")
  - **Response time**: {{response_time}} (e.g., "2-3 business days for non-urgent requests")
  - **Availability for meetings**: {{meeting_availability}} (e.g., "Available for scheduled calls during business hours")
  - **Urgent requests**: {{urgent_request_policy}} (e.g., "Urgent requests may incur additional fees")
- **What to ask user**: "What availability expectations do you have? What response times work for you?"
- **Content**: Define availability expectations based on retainer agreement

**Section 7: Confidentiality Clause**

- **Background**: Protects sensitive information shared during the project
- **What it does**: Requires both parties to keep project information confidential
- **Purpose**: Protects proprietary information, business strategies, and trade secrets - mutual protection builds trust
- **Why this matters**: 
  - Without this clause, either party could share sensitive project details with competitors
  - Protects your business secrets, customer data, and strategic plans
  - Builds trust by showing mutual respect for confidentiality
  - Prevents legal disputes about information sharing
- **User options**:
  - **Standard confidentiality** (recommended): Both parties keep all project information confidential
  - **Limited confidentiality**: Only specific information types are confidential (e.g., financial data only)
  - **One-way confidentiality**: Only one party is bound (rare, usually for public projects)
  - **Duration**: How long confidentiality lasts (typically 2-5 years, or indefinitely for trade secrets)
  - **Exceptions**: What's NOT confidential (public info, independently developed, required by law)
- **What to ask user**: "Do you have sensitive information that needs protection? How long should confidentiality last? (Typically 2-5 years)"
- **Content**: Standard confidentiality language (see template), customized based on user choices
- **Fairness note**: "This protects both parties equally - your sensitive info stays private, and I'm protected too"

**Section 8: Not to Exceed Clause** (Conditional - applies to Fixed-Price and optionally Hourly)

- **Background**: Sets maximum budget cap - only applies to certain business models
- **What it does**: States that costs will not exceed a specified amount without approval
- **Purpose**: 
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

**Section 7: Work Initiation**

- **Background**: Specifies exactly when work can begin
- **What it does**: Defines start date or conditions before work begins
- **Purpose**: Prevents unauthorized work, establishes timeline, protects both parties
- **Why this matters**:
  - Without this clause, work might begin before contract is fully executed
  - Prevents disputes about when work actually started
  - Protects contractor from doing unpaid work
  - Protects client from unauthorized charges
  - Establishes clear timeline expectations
- **User options**:
  - **Upon contract signing**: Work begins immediately when both parties sign
  - **Specific date**: Work begins on a set calendar date
  - **After initial payment**: Work begins when first payment/deposit is received
  - **After written notice**: Work begins when client sends written authorization
  - **Conditional start**: Work begins after specific conditions are met (e.g., materials received, approvals obtained)
- **What to ask user**: "When should work begin? Options: immediately upon signing, a specific date, after initial payment, or when you give written notice?"
- **Content**: Ask user when work should begin, document the chosen option clearly

**Section 10: Terms and Conditions**
- **Background**: Legal framework for the agreement
- **What it does**: Covers changes, termination, IP ownership, dispute resolution, jurisdiction
- **Purpose**: Protects both parties legally
- **Content**: Standard terms including governing law and jurisdiction (see template)

**Section 11: Legal Framework**

- **Background**: Determines which laws apply and where legal proceedings take place
- **What it does**: Specifies governing law, jurisdiction, and contract language
- **Purpose**: Provides legal clarity and predictability
- **Why this matters**:
  - Without this clause, disputes could be heard in unexpected jurisdictions
  - Different jurisdictions have different laws that could affect the contract
  - Determines which court system handles disputes
  - Language choice ensures both parties understand the contract
  - Prevents costly legal battles over jurisdiction
- **User options**:
  - **Jurisdiction**: Where legal proceedings take place
    - Client's location (protects client)
    - Contractor's location (protects contractor)
    - Neutral location (fair for both)
    - Specific state/country (e.g., "State of California, USA")
  - **Governing law**: Which laws apply
    - Usually matches jurisdiction
    - Can specify specific legal framework
  - **Contract language**: Language of the contract
    - Primary language for both parties
    - Which version prevails if translated
- **What to ask user**: 
  - "Which jurisdiction's laws should govern this contract? (e.g., 'State of California, USA', 'England and Wales')"
  - "What language should this contract be in? (e.g., English, Spanish, French)"
  - "If the contract is translated, which version should be the official one?"
- **Content**: Ask user for jurisdiction, governing law, and contract language, document clearly

**Section 12: Approval**
- **Background**: Formal signoff
- **What it does**: Signature lines for both parties
- **Purpose**: Makes the contract legally binding
- **Content**: Client and contractor names

---

## Important Contract Sections to Discuss

**Core Principle**: Always aim for **simplicity and fairness** - contracts should protect both parties while building trust for long-term relationships.

**Reference sources**: Based on professional contract best practices from legal resources (AIA Contracts, Morgan McKinley, legal counsel guidelines, contract management experts, industry standards)

---

## Best Practices Guidance

### For Consultants/Service Providers

**Payment Terms Best Practices**:
- **Request upfront deposits**: 50% upfront is standard for fixed-price contracts, 100% upfront is fair since you assume all cost overrun risk
- **Milestone-based payments**: For larger projects, use 30% upfront, 40% at midway, 30% on completion
- **Explain the value**: Help clients understand that upfront payment ensures you can prioritize their project and deliver quality work
- **Include late payment penalties**: Protect yourself with interest charges or work suspension clauses
- **Document everything**: Issue detailed invoices that itemize work completed

**Scope Protection Best Practices**:
- **Define scope clearly**: Most disputes arise from unclear scope - be specific about what's included and excluded
- **Include change order process**: Require written change orders for any scope changes
- **Set not-to-exceed cap**: Protects both parties from cost overruns
- **Document assumptions**: List any assumptions that affect scope or pricing

**Risk Management Best Practices**:
- **Request upfront payment**: Shows client commitment and protects you from non-payment
- **Define work initiation**: Specify exactly when work begins to prevent unauthorized work
- **Include termination clause**: Fair exit strategy protects both parties
- **Specify IP ownership**: Clear ownership prevents future disputes

**Communication Best Practices**:
- **Be transparent**: Explain why each clause matters and how it protects both parties
- **Build trust**: Focus on fairness and long-term relationship, not just protection
- **Document changes**: All scope changes should be in writing and approved

---

### For Clients

**What to Look For**:

**Payment Terms**:
- **Fair payment structure**: For fixed-price contracts, 50% upfront is reasonable since consultant assumes risk
- **Clear payment schedule**: Know exactly when payments are due
- **Payment conditions**: Understand what triggers each payment
- **Late payment terms**: Know what happens if you pay late

**Scope Clarity**:
- **Detailed deliverables**: Know exactly what you're getting
- **Exclusions clearly stated**: Understand what's NOT included
- **Change order process**: Know how to request changes and what they cost
- **Not-to-exceed protection**: Budget cap protects you from overruns

**Protection Clauses**:
- **Confidentiality**: Your sensitive information is protected
- **IP ownership**: You own the deliverables (usually)
- **Termination rights**: You can exit if needed with fair notice
- **Dispute resolution**: Clear process for handling conflicts

**Red Flags to Watch For**:
- ❌ Vague or unclear scope definitions
- ❌ Payment terms that seem unfair (e.g., 100% on completion for fixed-price)
- ❌ No change order process
- ❌ Unclear IP ownership
- ❌ No termination clause
- ❌ Unreasonable confidentiality terms
- ❌ No dispute resolution process

**Best Practices**:
- **Review thoroughly**: Read every section and ask questions
- **Understand each clause**: Don't sign what you don't understand
- **Negotiate fairly**: Both parties should feel protected
- **Get legal review**: For large contracts or complex projects
- **Keep it simple**: Simple contracts are easier to understand and enforce

---

### Common Pitfalls to Avoid

**For Both Parties**:

1. **Unclear Scope** - Most common cause of disputes
   - **Problem**: Vague descriptions like "design work" or "development services" lead to disagreements about what's included
   - **Solution**: Be extremely specific about deliverables, exclusions, and assumptions
   - **For Consultants**: List every deliverable explicitly. Include: "Deliverables include: [specific list]. Deliverables do NOT include: [specific exclusions]. This contract assumes: [assumptions]."
   - **For Clients**: Ask for detailed breakdown. Request: "Please list exactly what I'll receive. What's NOT included? What assumptions are you making?"

   **Example Wordings - Different Scenarios**:

   **Scenario A: Design Project (Detailed)**
   ```
   DELIVERABLES:
   The Contractor shall deliver the following:
   1. UX Design Specifications
      - User flow diagrams for 3 core scenarios (Login, Product Browse, Checkout)
      - Wireframes for 8 pages (Home, Product List, Product Detail, Cart, Checkout, Account, Login, Register)
      - Interaction specifications document (PDF, minimum 20 pages)
   
   2. Visual Design
      - High-fidelity mockups for all 8 pages in Figma
      - Design system documentation (colors, typography, components)
      - Responsive designs for mobile (375px), tablet (768px), and desktop (1440px)
   
   3. Prototype
      - Interactive Figma prototype with clickable links between all pages
      - Prototype includes all user flows specified in item 1
   
   4. Handoff Documentation
      - Design specifications document (PDF)
      - Asset export package (SVG, PNG formats)
      - Developer handoff notes with measurements and specifications

   EXCLUSIONS:
   This contract does NOT include:
   - Front-end development or coding
   - Backend API development
   - Content creation or copywriting
   - User research or usability testing
   - Ongoing maintenance or updates
   - Third-party integrations beyond design specifications

   ASSUMPTIONS:
   This contract assumes:
   - Client provides user research data and personas by [date]
   - Client provides brand guidelines and logo files by [date]
   - Client provides all content (text, images) by [date]
   - Client provides access to existing design system (if applicable) by [date]
   - Client provides feedback within 5 business days of each deliverable
   ```

   **Scenario B: Development Project (Detailed)**
   ```
   DELIVERABLES:
   The Contractor shall deliver:
   1. Front-end Application
      - React application built with Next.js framework
      - Responsive design matching provided designs
      - 8 pages as specified in design mockups
      - Integration with backend API endpoints (endpoints to be provided by Client)
   
   2. Code Deliverables
      - Source code repository (GitHub)
      - Documentation (README.md with setup instructions)
      - Code comments following industry standards
      - Environment configuration files (.env.example)
   
   3. Testing
      - Unit tests for critical functions (minimum 60% coverage)
      - Integration tests for main user flows
      - Browser testing (Chrome, Firefox, Safari, Edge - latest 2 versions)
   
   4. Deployment
      - Application deployed to staging environment
      - Production deployment guide document
      - One round of production deployment support (up to 4 hours)

   EXCLUSIONS:
   This contract does NOT include:
   - Backend API development (API endpoints provided by Client)
   - Database design or setup
   - Server infrastructure setup
   - Content management system integration
   - Third-party service integrations beyond those specified
   - Ongoing hosting or maintenance
   - Post-launch bug fixes (covered under separate warranty period)

   ASSUMPTIONS:
   This contract assumes:
   - Client provides complete design files (Figma) by [date]
   - Client provides working backend API with documentation by [date]
   - Client provides staging environment access by [date]
   - Client provides all required API keys and credentials by [date]
   - Client provides content (text, images) in required formats by [date]
   ```

   **Scenario C: Consulting Project (Detailed)**
   ```
   DELIVERABLES:
   The Consultant shall deliver:
   1. Strategic Analysis Report
      - Current state assessment (20-30 pages)
      - Competitive analysis (10-15 pages)
      - Gap analysis and recommendations (15-20 pages)
      - Executive summary (2-3 pages)
   
   2. Implementation Roadmap
      - Phased implementation plan with timelines
      - Resource requirements and cost estimates
      - Risk assessment and mitigation strategies
      - Success metrics and KPIs
   
   3. Presentation Materials
      - PowerPoint presentation (30-40 slides) for stakeholder presentation
      - One 2-hour presentation session to Client's leadership team
      - Q&A session following presentation

   EXCLUSIONS:
   This contract does NOT include:
   - Implementation of recommendations
   - Ongoing consulting beyond delivery of deliverables
   - Additional presentations beyond the one specified
   - Custom research beyond publicly available information
   - Legal or financial advice (Consultant is not licensed in these areas)

   ASSUMPTIONS:
   This contract assumes:
   - Client provides access to relevant data and documentation
   - Client provides 3 stakeholder interviews (1 hour each)
   - Client provides feedback on draft reports within 10 business days
   - Client provides decision-makers for final presentation
   ```

   **Comparison: Good vs. Bad Formulations**

   **BAD (Vague)**:
   ```
   "Design services for website"
   "Development work"
   "Consulting services"
   ```

   **GOOD (Specific)**:
   ```
   "UX design specifications for 3 user scenarios, including wireframes 
   for 8 pages and interactive prototype in Figma, plus design handoff 
   documentation. Excludes front-end development, backend API development, 
   and content creation."
   ```

2. **Vague Payment Terms** - Leads to payment disputes
   - **Problem**: Statements like "payment upon completion" or "payments as work progresses" create confusion
   - **Solution**: Specify exact amounts, dates, and conditions for each payment
   - **For Consultants**: Define trigger conditions clearly. State: "Payment 1 ($X) due upon contract signing. Payment 2 ($Y) due upon [specific milestone/deliverable]. Payment 3 ($Z) due upon final delivery and acceptance."
   - **For Clients**: Understand payment triggers. Ask: "What exactly triggers each payment? What does 'completion' mean? What if I need revisions?"

   **Example Wordings - Different Payment Structures**:

   **Scenario A: 50/50 Split (Simple Fixed-Price)**
   ```
   PAYMENT TERMS:
   Total Contract Amount: $10,000
   
   Payment Schedule:
   1. First Payment: $5,000 (50% of total)
      - Due: Within 5 business days of contract execution
      - Condition: Contract fully executed (signed by both parties)
      - Payment Method: Wire transfer or check
   
   2. Final Payment: $5,000 (50% of total)
      - Due: Within 5 business days of final deliverable acceptance
      - Condition: All deliverables completed and accepted by Client
      - Payment Method: Wire transfer or check
   
   DELIVERABLE ACCEPTANCE:
   Deliverables are considered accepted when:
   - Client provides written approval via email, OR
   - 10 business days pass after Contractor delivers final deliverables without written objections from Client
   
   REVISIONS:
   This contract includes up to 2 rounds of revisions per deliverable. 
   Additional revisions will be billed at $150/hour via Change Order.
   ```

   **Scenario B: Milestone-Based (3 Payments)**
   ```
   PAYMENT TERMS:
   Total Contract Amount: $15,000
   
   Payment Schedule:
   1. Initial Payment: $4,500 (30% of total)
      - Due: Within 5 business days of contract execution
      - Condition: Contract signed by both parties
      - Purpose: Secures project start and covers initial expenses
   
   2. Mid-Project Payment: $6,000 (40% of total)
      - Due: Within 5 business days of Milestone 2 completion
      - Condition: Milestone 2 deliverables accepted
      - Milestone 2 includes: [Specific deliverables, e.g., "Wireframes for all 8 pages approved"]
   
   3. Final Payment: $4,500 (30% of total)
      - Due: Within 5 business days of final deliverable acceptance
      - Condition: All deliverables completed, approved, and delivered
      - Includes: Final files, documentation, and project handoff
   
   MILESTONE DEFINITIONS:
   - Milestone 1: Project kickoff and discovery complete (triggers initial payment)
   - Milestone 2: Design phase complete - wireframes approved (triggers mid-project payment)
   - Milestone 3: Final deliverables complete - designs and prototype delivered (triggers final payment)
   ```

   **Scenario C: 100% Upfront (Full Commitment)**
   ```
   PAYMENT TERMS:
   Total Contract Amount: $8,000
   
   Payment Schedule:
   Single Payment: $8,000 (100% of total)
   - Due: Within 5 business days of contract execution
   - Condition: Contract fully executed (signed by both parties)
   - Payment Method: Wire transfer preferred, check accepted
   
   RATIONALE:
   This is a fixed-price contract where Contractor assumes all cost overrun risk. 
   Full upfront payment demonstrates Client commitment and enables Contractor to 
   prioritize this project and allocate resources accordingly.
   
   REFUND POLICY:
   If Contractor fails to deliver agreed deliverables, Client is entitled to:
   - Full refund if no work has been completed, OR
   - Proportional refund based on work completed if Contractor terminates without cause
   ```

   **Scenario D: Hourly/Time-Based (Different Structure)**
   ```
   PAYMENT TERMS:
   Hourly Rate: $150/hour
   Estimated Total: $12,000 (based on 80 hours estimated)
   
   Payment Schedule:
   1. Retainer: $3,000 (25% of estimated total)
      - Due: Within 5 business days of contract execution
      - Applied to: Final invoice
      - Non-refundable if Client terminates without cause
   
   2. Monthly Invoicing: 
      - Invoices submitted on last day of each month
      - Payment due: Within 15 days of invoice date
      - Includes: Detailed time log with descriptions of work performed
   
   3. Final Invoice:
      - Submitted upon project completion
      - Includes: All remaining hours, minus retainer already paid
      - Payment due: Within 15 days of invoice date
   
   NOT-TO-EXCEED:
   Total project costs will not exceed $15,000 (125% of estimate) without 
   prior written approval via Change Order.
   ```

   **Comparison: Good vs. Bad Formulations**

   **BAD (Vague)**:
   ```
   "Payment upon completion"
   "Payments as work progresses"
   "50% upfront, 50% on delivery"
   "Payment when project is done"
   ```

   **GOOD (Specific)**:
   ```
   "Payment 1: $5,000 (50% of $10,000 total) due within 5 business days 
   of contract execution. Payment 2: $5,000 (remaining 50%) due within 
   5 business days of final deliverable acceptance. Deliverable acceptance 
   means Client approves in writing OR 10 business days pass without 
   written objections."
   ```

   **Key Elements to Always Include**:
   - Exact dollar amounts (not percentages alone)
   - Specific due dates or timeframes
   - Clear trigger conditions
   - Payment method
   - What "acceptance" or "completion" means
   - Late payment consequences
   - Revision policy

3. **No Change Order Process** - Scope creep becomes a problem
   - **Problem**: Requests for "small additions" accumulate into significant extra work without compensation
   - **Solution**: Require written change orders with approval before work begins
   - **For Consultants**: Protect yourself with: "Any work outside the original scope requires a written Change Order signed by both parties. Change Orders must specify: (1) additional work description, (2) additional cost, (3) impact on timeline, (4) approval signatures. Work will not begin on changes until Change Order is signed."
   - **For Clients**: Understand the process. Request: "How do I request changes? How are additional costs calculated? Can I see the Change Order before approving?"

   **Example Wordings - Different Change Order Structures**:

   **Scenario A: Fixed-Price Project (Hourly Rate for Changes)**
   ```
   CHANGE ORDER PROCESS:
   
   Any work outside the scope defined in Section 2 requires a written Change Order 
   signed by both parties before work begins.
   
   Change Order Requirements:
   Each Change Order must include:
   1. Description of additional work requested
   2. Reason for change (if applicable)
   3. Additional cost:
      - Hourly rate: $150/hour
      - Estimated hours: [number]
      - Total additional cost: $[amount]
   4. Impact on timeline:
      - Original completion date: [date]
      - Revised completion date: [date]
      - Additional days: [number]
   5. Approval signatures from both parties
   
   Process:
   1. Client requests change in writing (email acceptable)
   2. Contractor provides Change Order within 3 business days
   3. Client reviews and approves or rejects within 5 business days
   4. If approved, both parties sign Change Order
   5. Contractor begins additional work only after signed Change Order received
   
   No Work Without Approval:
   Contractor will NOT begin any additional work until Change Order is fully 
   executed (signed by both parties). Any work done without approved Change 
   Order is at Contractor's own risk and expense.
   ```

   **Scenario B: Fixed-Price Project (Fixed Price for Changes)**
   ```
   CHANGE ORDER PROCESS:
   
   Any modifications to the scope defined in Section 2 require a written Change 
   Order executed by both parties.
   
   Change Order Contents:
   Each Change Order must specify:
   1. Detailed description of the change
   2. Fixed price for the additional work: $[amount]
   3. Revised project timeline:
      - Original delivery date: [date]
      - New delivery date: [date]
   4. Impact on other deliverables (if any)
   5. Signatures from Client and Contractor
   
   Pricing for Changes:
   Changes will be priced based on:
   - Complexity of additional work
   - Time required to complete
   - Impact on existing deliverables
   - Market rates for similar work
   
   Client will receive cost estimate before approval. If Client does not approve 
   the Change Order, original scope and timeline remain unchanged.
   
   Emergency Changes:
   For urgent changes that cannot wait for Change Order process, Contractor may 
   proceed with Client's verbal approval, but Change Order must be executed 
   within 2 business days or work will stop.
   ```

   **Scenario C: Hourly Project (Time Tracking for Changes)**
   ```
   CHANGE ORDER PROCESS:
   
   Changes to scope are handled through Change Orders that adjust the Not-to-Exceed 
   amount and timeline.
   
   Change Order Structure:
   1. Description of change
   2. Estimated additional hours: [number] hours
   3. Hourly rate: $[amount]/hour
   4. Estimated additional cost: $[amount]
   5. Revised Not-to-Exceed amount: $[original] + $[additional] = $[new total]
   6. Revised completion date: [date]
   7. Approval signatures
   
   Approval Required:
   Changes that would increase total project cost by more than 10% require 
   written approval via Change Order before work begins.
   
   Minor Changes:
   Changes under 10% of original estimate may be approved via email, but 
   Change Order must be executed within 5 business days.
   ```

   **Comparison: Good vs. Bad Formulations**

   **BAD (No Process)**:
   ```
   "Additional work will be billed separately"
   "Changes may incur additional costs"
   "Scope changes require approval"
   ```

   **GOOD (Detailed Process)**:
   ```
   "Any work outside Section 2 scope requires a written Change Order signed 
   by both parties. Change Orders must include: (1) description of additional 
   work, (2) additional cost ($150/hour or fixed price), (3) revised timeline, 
   (4) signatures. Contractor will not begin additional work until Change Order 
   is executed."
   ```

4. **Missing Termination Clause** - No exit strategy
   - **Problem**: If relationship sours, neither party knows how to exit fairly
   - **Solution**: Include fair termination terms with notice periods
   - **For Consultants**: Protect payment for work done. Include: "Either party may terminate with [X] days written notice. Upon termination: (1) Client pays for all work completed to date, (2) Contractor delivers work-in-progress, (3) Confidentiality obligations continue."
   - **For Clients**: Ensure fair exit. Request: "What notice do I need to give? What happens to work already done? Do I still own what's been delivered?"

   **Example Wordings - Different Termination Scenarios**:

   **Scenario A: Standard Termination (30-Day Notice)**
   ```
   TERMINATION:
   
   Either party may terminate this agreement at any time with 30 days written notice 
   to the other party. Notice must be delivered via email or certified mail.
   
   Upon Termination:
   1. Payment for Work Completed:
      - Client shall pay Contractor for all work completed and approved up to 
        the termination date
      - Payment due within 15 days of termination notice
      - Contractor will provide itemized invoice of completed work
   
   2. Delivery of Work-in-Progress:
      - Contractor shall deliver all work-in-progress within 10 business days 
        of termination
      - Client owns all deliverables completed and paid for
      - Contractor retains rights to work not yet paid for
   
   3. Ongoing Obligations:
      - All confidentiality obligations remain in effect
      - Contractor may not use Client's confidential information
      - Client may not use Contractor's proprietary methods without permission
   
   4. No Further Work:
      - Contractor will not begin new work after termination notice
      - Contractor will complete only work already in progress (if agreed)
   ```

   **Scenario B: Termination for Cause (Immediate)**
   ```
   TERMINATION:
   
   Standard Termination:
   Either party may terminate with 30 days written notice for any reason.
   
   Termination for Cause (Immediate):
   Either party may terminate immediately without notice if the other party:
   - Materially breaches this agreement and fails to cure within 10 days of notice
   - Becomes insolvent or files for bankruptcy
   - Engages in illegal activity related to the project
   - Fails to make payment when due (for Client)
   - Fails to deliver work as specified (for Contractor)
   
   Upon Termination for Cause:
   - Terminating party owes no further obligations
   - Breaching party pays all costs and damages
   - Work-in-progress delivered only if paid for
   - Confidentiality obligations continue
   
   Upon Standard Termination:
   - Client pays for all work completed to date
   - Contractor delivers work-in-progress within 10 business days
   - Confidentiality obligations continue
   ```

   **Scenario C: Termination with Refund Policy**
   ```
   TERMINATION:
   
   Client Termination Rights:
   Client may terminate this agreement:
   - With 30 days notice: Standard termination
   - Immediately: If Contractor materially breaches
   - With full refund: If no work has been completed and Contractor is at fault
   
   Contractor Termination Rights:
   Contractor may terminate this agreement:
   - With 30 days notice: Standard termination
   - Immediately: If Client fails to pay or materially breaches
   
   Refund Policy:
   - If Client terminates before work begins: Full refund of upfront payment
   - If Client terminates after work begins: No refund, payment for work done
   - If Contractor terminates without cause: Refund proportional to work not completed
   - If Contractor terminates for cause (non-payment): No refund, full payment due
   
   Work Ownership Upon Termination:
   - Client owns all deliverables completed and paid for
   - Contractor retains rights to work not yet paid for
   - Work-in-progress delivered only if paid for or agreed upon
   ```

   **Comparison: Good vs. Bad Formulations**

   **BAD (Vague)**:
   ```
   "Either party may terminate this agreement"
   "Termination requires notice"
   "Work will be delivered upon termination"
   ```

   **GOOD (Specific)**:
   ```
   "Either party may terminate with 30 days written notice. Upon termination: 
   (1) Client pays Contractor for all work completed and approved up to termination 
   date, (2) Contractor delivers work-in-progress within 10 business days, 
   (3) Confidentiality obligations remain in effect, (4) Client owns deliverables 
   completed and paid for."
   ```

5. **Unclear IP Ownership** - Future disputes about who owns what
   - **Problem**: Ambiguity about who owns deliverables, source files, and work products
   - **Solution**: Explicitly state who owns deliverables and when ownership transfers
   - **For Consultants**: Clarify what you're transferring. State: "Upon full payment, Client owns: [specific deliverables]. Contractor retains: [rights to methods, tools, templates]. Client receives: [final files]. Contractor retains: [source files, unless specified otherwise]."
   - **For Clients**: Understand what you're buying. Ask: "Do I own the final designs? Do I get source files? Can the consultant reuse this work for other clients?"

   **Example Wordings - Different IP Ownership Models**:

   **Scenario A: Full Transfer to Client (Standard)**
   ```
   INTELLECTUAL PROPERTY OWNERSHIP:
   
   Upon full payment of all amounts due under this agreement, Client owns all 
   rights, title, and interest in the final deliverables specified in Section 2, 
   including but not limited to:
   - All design files (Figma, Sketch, Adobe XD files)
   - All code and source files
   - All documentation and specifications
   - All creative works and content created specifically for Client
   
   Client Receives:
   - Final design files in editable formats (Figma, source code)
   - All assets and resources created for the project
   - Full rights to use, modify, and distribute deliverables
   - Rights to register copyrights or trademarks in Client's name
   
   Contractor Retains:
   - Rights to methodologies, processes, and tools used
   - Rights to pre-existing work, templates, and frameworks
   - Rights to general knowledge and skills gained
   - Portfolio rights (may show work in portfolio with Client permission)
   
   Contractor May NOT:
   - Reuse specific deliverables created for Client for other clients
   - Claim ownership of deliverables after payment
   - Use Client's brand or proprietary elements without permission
   ```

   **Scenario B: Shared Ownership (Rare)**
   ```
   INTELLECTUAL PROPERTY OWNERSHIP:
   
   Shared Ownership Model:
   Both parties own the deliverables jointly, with specific rights allocated.
   
   Client Owns:
   - Exclusive rights to use deliverables for Client's business purposes
   - Rights to modify deliverables for Client's use
   - Rights to register trademarks/copyrights in Client's name
   - Rights to prevent Contractor from using deliverables for competing clients
   
   Contractor Owns:
   - Rights to use deliverables in portfolio and marketing materials
   - Rights to use methodologies and processes for other clients
   - Rights to create derivative works for Contractor's business (non-competing)
   - Rights to use general design patterns and approaches
   
   Restrictions:
   - Contractor may not use deliverables for direct competitors
   - Client may not resell deliverables as a product
   - Both parties must credit the other when using deliverables publicly
   ```

   **Scenario C: Client Owns Final, Contractor Owns Source (Design Projects)**
   ```
   INTELLECTUAL PROPERTY OWNERSHIP:
   
   Final Deliverables:
   Client owns all rights to final deliverables upon full payment:
   - Final design files (exported formats: PNG, PDF, SVG)
   - Final specifications and documentation
   - Rights to use, modify, and distribute final deliverables
   
   Source Files:
   Contractor retains ownership of source files:
   - Original design files (Figma, Sketch source files)
   - Working files and iterations
   - Design system source files
   
   Source File Access:
   Client may request source files for an additional fee:
   - Design source files: $500 one-time fee
   - Includes: All working files, components, and design system
   - Transfer occurs after additional payment
   
   Portfolio Rights:
   Contractor retains rights to:
   - Display work in portfolio and case studies
   - Use work in marketing materials (with Client credit)
   - Discuss work in interviews and presentations
   
   Contractor May NOT:
   - Reuse specific designs for other clients
   - Resell deliverables as templates
   - Use Client's brand elements without permission
   ```

   **Scenario D: Work-for-Hire (Full Client Ownership)**
   ```
   INTELLECTUAL PROPERTY OWNERSHIP:
   
   Work-for-Hire:
   All work performed under this agreement is considered "work made for hire" 
   under copyright law. Client owns all rights from the moment of creation.
   
   Full Ownership Transfer:
   Client owns:
   - All deliverables, including source files
   - All work-in-progress and iterations
   - All concepts, ideas, and creative works
   - All code, designs, documentation, and materials
   - Rights to register copyrights in Client's name
   - Exclusive rights to use, modify, distribute, and commercialize
   
   Contractor Retains:
   - Only general knowledge and skills gained
   - Portfolio rights (with Client's written permission)
   
   Portfolio Use:
   Contractor may use work in portfolio only with Client's written permission, 
   which Client may grant or deny at their discretion.
   
   No Reuse Rights:
   Contractor may not reuse any deliverables, concepts, or work products for 
   any other purpose or client.
   ```

   **Comparison: Good vs. Bad Formulations**

   **BAD (Vague)**:
   ```
   "Client owns the work"
   "Deliverables belong to Client"
   "Work is Client's property"
   ```

   **GOOD (Specific)**:
   ```
   "Upon full payment, Client owns all rights, title, and interest in final 
   deliverables specified in Section 2. Client receives: final design files, 
   specifications, and documentation. Contractor retains: methodologies, tools, 
   templates, and pre-existing work. Contractor may not reuse specific deliverables 
   created for Client."
   ```

6. **No Dispute Resolution** - Conflicts escalate unnecessarily
   - **Problem**: Disagreements lead directly to expensive litigation
   - **Solution**: Include mediation/arbitration before litigation
   - **For Consultants**: Avoid costly court battles. Include: "Disputes shall first be resolved through good faith negotiation. If unsuccessful, parties agree to [mediation/arbitration] before pursuing litigation."
   - **For Clients**: Protect yourself from legal costs. Request: "How will we resolve disagreements? Can we use mediation first? What's the process?"

   **Example Wordings - Different Dispute Resolution Approaches**:

   **Scenario A: Mediation Then Arbitration (Recommended)**
   ```
   DISPUTE RESOLUTION:
   
   Step 1: Good Faith Negotiation
   Any disputes arising from this agreement shall first be addressed through 
   good faith negotiation between the parties for 30 days from the date dispute 
   is raised in writing.
   
   Step 2: Mediation
   If negotiation is unsuccessful, parties agree to submit the dispute to 
   mediation under the rules of [Mediation Organization, e.g., "American 
   Arbitration Association"] before pursuing other remedies.
   - Mediation must be completed within 60 days
   - Mediator selected by mutual agreement or appointed by mediation organization
   - Each party bears their own mediation costs
   - Mediation is non-binding (either party may reject settlement)
   
   Step 3: Binding Arbitration
   If mediation fails, disputes shall be resolved through binding arbitration 
   under the rules of [Arbitration Organization, e.g., "American Arbitration 
   Association"].
   - Arbitration location: [City, State/Country]
   - Arbitrator: Single arbitrator selected by mutual agreement
   - Arbitration decision is final and binding
   - Each party bears their own attorney fees
   - Arbitration costs split equally
   
   Step 4: Court Enforcement
   Judgment on arbitration award may be entered in any court of competent 
   jurisdiction in [Location].
   
   No Litigation Without Mediation/Arbitration:
   Parties agree not to pursue litigation until mediation and arbitration 
   processes are completed.
   ```

   **Scenario B: Mediation Only (Non-Binding)**
   ```
   DISPUTE RESOLUTION:
   
   Mediation Process:
   Any disputes shall be resolved through mediation before pursuing litigation.
   
   Process:
   1. Written notice of dispute to other party
   2. 30 days of good faith negotiation
   3. If unresolved, mediation within 60 days
   4. Mediator selected by mutual agreement
   5. Mediation session(s) as needed
   6. If mediation succeeds: Settlement agreement signed
   7. If mediation fails: Parties may pursue litigation
   
   Mediation Details:
   - Location: [City, State/Country]
   - Mediator: Neutral third party agreed upon by both parties
   - Costs: Split equally between parties
   - Duration: Up to 2 full-day sessions
   - Outcome: Non-binding (parties may accept or reject settlement)
   
   After Mediation:
   If mediation does not resolve the dispute, either party may pursue 
   litigation in courts of [Jurisdiction].
   ```

   **Scenario C: Arbitration Only (Binding)**
   ```
   DISPUTE RESOLUTION:
   
   Binding Arbitration:
   All disputes arising from this agreement shall be resolved through binding 
   arbitration, which is the exclusive remedy.
   
   Arbitration Process:
   1. Written notice of dispute
   2. 30 days good faith negotiation
   3. If unresolved, binding arbitration under [Arbitration Rules]
   
   Arbitration Details:
   - Organization: [e.g., "JAMS" or "American Arbitration Association"]
   - Location: [City, State/Country]
   - Rules: [Specific arbitration rules, e.g., "AAA Commercial Arbitration Rules"]
   - Arbitrator: Single arbitrator with expertise in [field, e.g., "software development"]
   - Timeline: Arbitration hearing within 90 days of filing
   - Decision: Final and binding, no appeal except for fraud or misconduct
   
   Costs:
   - Each party bears their own attorney fees
   - Arbitration fees split equally
   - Each party responsible for their own costs (witnesses, experts, etc.)
   
   Enforcement:
   Judgment on arbitration award may be entered in any court of competent 
   jurisdiction. Parties waive right to jury trial.
   
   No Litigation:
   Parties agree that arbitration is the exclusive remedy and waive right to 
   pursue disputes in court except to enforce arbitration award.
   ```

   **Scenario D: Escalation Ladder (Negotiation → Mediation → Litigation)**
   ```
   DISPUTE RESOLUTION:
   
   Escalation Process:
   Disputes shall be resolved through the following escalation process:
   
   Level 1: Direct Negotiation (Required)
   - Parties must attempt good faith negotiation for 30 days
   - Designated representatives from each party meet to resolve issue
   - Written summary of discussions maintained
   
   Level 2: Executive Mediation (Optional)
   - If negotiation fails, parties may (but are not required to) attempt 
     executive-level mediation
   - Senior executives from each party meet with neutral mediator
   - Mediation session(s) within 45 days
   - Non-binding, either party may reject settlement
   
   Level 3: Litigation
   - If dispute remains unresolved, parties may pursue litigation
   - Jurisdiction: Courts of [Location]
   - Governing law: [Jurisdiction's] laws
   - Each party bears their own costs
   
   Good Faith Requirement:
   Parties agree to participate in good faith in each level before escalating 
   to the next level.
   ```

   **Comparison: Good vs. Bad Formulations**

   **BAD (Vague)**:
   ```
   "Disputes will be resolved through negotiation"
   "Parties agree to resolve disputes amicably"
   "Any disputes will be handled fairly"
   ```

   **GOOD (Specific)**:
   ```
   "Disputes shall first be addressed through good faith negotiation for 30 days. 
   If unresolved, parties agree to mediation under [Organization] rules. If 
   mediation fails, disputes shall be resolved through binding arbitration under 
   [Rules] in [Location]. Each party bears their own costs. Judgment on 
   arbitration award may be entered in any court of competent jurisdiction."
   ```

7. **Missing Confidentiality** - Sensitive information at risk
   - **Problem**: No protection for proprietary information, business strategies, or trade secrets shared during the project
   - **Solution**: Include confidentiality clause with clear duration and exceptions
   - **For Consultants**: Protect client information. Include: "Both parties agree to keep confidential: [types of information]. Confidentiality lasts: [duration]. Exceptions: [public information, independently developed, required by law]."
   - **For Clients**: Protect your secrets. Request: "What information is protected? How long does confidentiality last? What are the exceptions?"

   **Example Wordings - Different Confidentiality Scenarios**:

   **Scenario A: Standard Mutual Confidentiality (3 Years)**
   ```
   CONFIDENTIALITY:
   
   Definition of Confidential Information:
   Both parties agree to keep confidential all non-public information shared 
   during this project, including but not limited to:
   - Business strategies, plans, and forecasts
   - Financial data, budgets, and pricing information
   - Customer lists, contact information, and customer data
   - Proprietary methods, processes, and know-how
   - Technical specifications and designs
   - Marketing plans and competitive intelligence
   - Project details, timelines, and internal communications
   - Any information marked "Confidential" or "Proprietary"
   
   Obligations:
   Each party agrees to:
   - Use confidential information solely for project purposes
   - Not disclose confidential information to third parties without written consent
   - Take reasonable measures to protect confidential information
   - Return or destroy confidential materials upon project completion
   - Maintain confidentiality even after project completion
   
   Duration:
   Confidentiality obligations last for 3 years after project completion 
   or termination of this agreement, whichever is later.
   
   Exceptions:
   Confidentiality obligations do not apply to information that:
   1. Was already publicly known before disclosure
   2. Becomes publicly known through no breach of this agreement
   3. Was independently developed without use of confidential information
   4. Was rightfully received from a third party without confidentiality obligations
   5. Is required to be disclosed by law, court order, or government regulation
     (party must notify other party before disclosure if legally permitted)
   ```

   **Scenario B: One-Way Confidentiality (Client Information Only)**
   ```
   CONFIDENTIALITY:
   
   Scope:
   This confidentiality clause protects only Client's confidential information. 
   Contractor agrees to maintain confidentiality of Client's information.
   
   Client's Confidential Information Includes:
   - Business strategies and competitive plans
   - Financial data and budgets
   - Customer information and databases
   - Proprietary processes and methods
   - Technical specifications and requirements
   - Marketing plans and strategies
   - Any information Client designates as confidential
   
   Contractor's Obligations:
   Contractor agrees to:
   - Keep Client's confidential information strictly confidential
   - Use confidential information only for project purposes
   - Not disclose to any third party without Client's written consent
   - Not use confidential information for Contractor's own benefit
   - Return or destroy all confidential materials upon project completion
   - Maintain confidentiality for 5 years after project completion
   
   Contractor's Information:
   This clause does not restrict Contractor's use of Contractor's own 
   information, methodologies, or general knowledge gained.
   
   Exceptions:
   Confidentiality does not apply to information that:
   - Was publicly known before disclosure
   - Becomes publicly known through no breach by Contractor
   - Was independently developed by Contractor
   - Is required to be disclosed by law (with notice to Client if permitted)
   ```

   **Scenario C: Strict Confidentiality (5 Years, No Exceptions for Trade Secrets)**
   ```
   CONFIDENTIALITY:
   
   Mutual Confidentiality:
   Both parties agree to maintain strict confidentiality of all information 
   shared during this project.
   
   Confidential Information Includes:
   - All business, financial, and technical information
   - Customer data and contact information
   - Proprietary methods and processes
   - Project plans, timelines, and details
   - Any information not publicly available
   
   Strict Obligations:
   Each party agrees to:
   - Not disclose confidential information to anyone without written consent
   - Use information solely for project purposes
   - Implement security measures to protect information
   - Not reverse engineer or attempt to derive confidential methods
   - Return or destroy all confidential materials upon request
   - Ensure employees/contractors also maintain confidentiality
   
   Duration:
   - Standard information: 5 years after project completion
   - Trade secrets: Indefinitely (until information becomes publicly known)
   
   Trade Secrets:
   Information identified as "Trade Secret" shall remain confidential 
   indefinitely, regardless of whether it becomes publicly known through 
   other means.
   
   Limited Exceptions:
   Confidentiality obligations continue even if information:
   - Becomes publicly known (if originally marked as Trade Secret)
   - Is independently developed (if based on confidential information)
   
   Legal Disclosure:
   If required by law to disclose, party must:
   - Notify other party immediately (if legally permitted)
   - Disclose only the minimum required
   - Request confidential treatment from court/authority
   ```

   **Scenario D: Limited Confidentiality (Specific Information Types)**
   ```
   CONFIDENTIALITY:
   
   Scope:
   Only the following specific types of information are considered confidential:
   1. Financial data: Budgets, pricing, revenue information
   2. Customer data: Customer lists, contact information, purchase history
   3. Technical specifications: Proprietary technical requirements
   
   Information NOT Confidential:
   The following information is NOT confidential:
   - General business information publicly available
   - Information already known to Contractor
   - Project deliverables (unless specifically marked confidential)
   - General methodologies and processes
   
   Obligations:
   Each party agrees to keep the specified confidential information private 
   and not disclose to third parties without consent.
   
   Duration:
   Confidentiality obligations last for 2 years after project completion.
   
   Use Restrictions:
   Confidential information may be used only for:
   - Completing the project work
   - Complying with legal obligations
   - With written consent from the other party
   
   Exceptions:
   Standard exceptions apply: publicly known, independently developed, 
   required by law (with notice).
   ```

   **Comparison: Good vs. Bad Formulations**

   **BAD (Vague)**:
   ```
   "Information will be kept confidential"
   "Parties agree to maintain confidentiality"
   "Confidential information is protected"
   ```

   **GOOD (Specific)**:
   ```
   "Both parties agree to keep confidential all non-public information shared 
   during this project, including: business strategies, financial data, customer 
   lists, proprietary methods, and project details. Confidentiality obligations 
   last for 3 years after project completion. Exceptions: (1) information already 
   publicly known, (2) information independently developed without use of 
   confidential information, (3) information required to be disclosed by law."
   ```

8. **No Not-to-Exceed Cap** - Budget can spiral out of control
   - **Problem**: Costs can exceed budget without clear limits or approval process
   - **Solution**: Set maximum budget with change order process for adjustments
   - **For Consultants**: Set clear boundaries. State: "Total project costs shall not exceed $X without prior written approval. Any work that would exceed this amount requires a Change Order signed before proceeding."
   - **For Clients**: Protect your budget. Request: "What's the maximum I'll pay? How do we handle costs that exceed the cap? What's the approval process?"

   **Example Wordings - Different Not-to-Exceed Structures**:

   **Scenario A: Hard Cap (Fixed-Price Project)**
   ```
   NOT-TO-EXCEED CLAUSE:
   
   Maximum Project Cost:
   Total project costs shall not exceed $10,000 under any circumstances 
   without prior written approval from Client via Change Order.
   
   What's Included:
   This cap includes:
   - All Contractor fees and charges
   - All project-related expenses
   - All costs for work within the scope defined in Section 2
   
   What's NOT Included:
   This cap does NOT include:
   - Work outside original scope (requires Change Order)
   - Additional revisions beyond those specified
   - Rush fees or expedited delivery
   - Third-party costs (unless specified in scope)
   
   Exceeding the Cap:
   If Contractor anticipates costs will exceed $10,000:
   1. Contractor must notify Client in writing immediately
   2. Contractor must stop work that would exceed the cap
   3. Contractor must obtain signed Change Order before proceeding
   4. Change Order must specify new maximum amount
   
   No Work Without Approval:
   Contractor will not perform any work that would cause total costs to exceed 
   $10,000 without Client's written approval via Change Order.
   
   Client Protection:
   Client is not obligated to pay any amount exceeding $10,000 unless Change 
   Order is executed.
   ```

   **Scenario B: Soft Cap with Buffer (10% Buffer)**
   ```
   NOT-TO-EXCEED CLAUSE:
   
   Base Maximum: $10,000
   Buffer: 10% ($1,000)
   Total Maximum: $11,000
   
   Cost Structure:
   - Base project cost: Up to $10,000 (no approval needed)
   - Buffer for minor overruns: Up to $1,000 (no approval needed)
   - Total maximum without approval: $11,000
   - Any amount over $11,000: Requires Change Order approval
   
   When Buffer Applies:
   The 10% buffer may be used for:
   - Minor scope clarifications (not new features)
   - Unforeseen technical challenges within original scope
   - Small adjustments needed to complete deliverables
   
   When Buffer Does NOT Apply:
   Buffer cannot be used for:
   - New features or functionality
   - Significant scope changes
   - Additional deliverables
   - These require Change Order regardless of amount
   
   Notification Requirements:
   - If costs approach $10,000: Contractor must notify Client
   - If costs will exceed $11,000: Contractor must stop and get Change Order
   - Client approval required before exceeding $11,000
   ```

   **Scenario C: Cap with Change Order Adjustment**
   ```
   NOT-TO-EXCEED CLAUSE:
   
   Initial Maximum: $10,000
   
   This amount represents the maximum cost for work within the original scope 
   defined in Section 2.
   
   Adjusting the Cap:
   The maximum amount may be adjusted through Change Orders:
   - Each Change Order may increase the maximum
   - New maximum = Previous maximum + Change Order amount
   - Example: $10,000 base + $2,000 change = $12,000 new maximum
   
   Process:
   1. Client requests work outside original scope
   2. Contractor provides Change Order with additional cost
   3. If approved, Change Order increases the maximum
   4. New maximum applies going forward
   
   Tracking:
   Contractor will provide monthly cost reports showing:
   - Costs incurred to date
   - Remaining budget under current maximum
   - Any anticipated overruns
   
   Protection:
   Client is not obligated to pay more than the current maximum (base + 
   approved Change Orders) without additional Change Order approval.
   ```

   **Scenario D: Hourly Project with Not-to-Exceed**
   ```
   NOT-TO-EXCEED CLAUSE:
   
   Estimated Cost: $12,000 (based on 80 hours at $150/hour)
   Maximum Cost: $15,000 (125% of estimate)
   
   Cost Structure:
   - Contractor bills at $150/hour for actual time worked
   - Total costs will not exceed $15,000 without approval
   - If costs approach $15,000, Contractor must notify Client
   
   Approval Thresholds:
   - Up to $12,000: No approval needed (within estimate)
   - $12,000 - $15,000: Contractor must notify Client, but may continue
   - Over $15,000: Requires Change Order approval before additional work
   
   Monthly Reporting:
   Contractor will provide monthly invoices showing:
   - Hours worked and rate
   - Total costs to date
   - Remaining budget under $15,000 cap
   - Forecast of final costs
   
   Exceeding the Cap:
   If Contractor anticipates costs will exceed $15,000:
   1. Contractor must notify Client in writing
   2. Contractor must explain why costs exceed estimate
   3. Contractor must obtain Change Order approval
   4. Change Order increases the maximum amount
   
   Client Rights:
   Client may:
   - Request detailed time logs
   - Question charges that seem excessive
   - Approve or reject work that would exceed cap
   - Terminate if costs become unreasonable
   ```

   **Comparison: Good vs. Bad Formulations**

   **BAD (Vague)**:
   ```
   "Costs will not exceed the budget"
   "Project will stay within agreed amount"
   "Additional costs require approval"
   ```

   **GOOD (Specific)**:
   ```
   "Total project costs shall not exceed $10,000 without prior written approval 
   from Client. If Contractor anticipates costs will exceed this amount, 
   Contractor must notify Client in writing and obtain a signed Change Order 
   before proceeding. This cap includes all fees, expenses, and costs related 
   to the project scope defined in Section 2. Changes to scope may adjust this 
   cap through the Change Order process."
   ```

---

### Guidance During Contract Building

**When helping the user build the contract**:

1. **Reference best practices**: "Based on industry best practices, [recommendation]..."
2. **Explain the why**: Always explain why each clause matters
3. **Present options**: Give multiple options when appropriate
4. **Recommend fair terms**: Suggest the most common/fair approach
5. **Protect both parties**: Ensure the contract protects everyone
6. **Build relationship**: Focus on long-term partnership, not just legal protection
7. **Keep it simple**: Avoid overly complex language
8. **Encourage questions**: "Does this make sense? Any questions?"

**Key phrases to use**:
- "This is standard practice because..."
- "This protects both parties by..."
- "Most contracts include this because..."
- "This helps prevent [common problem]..."
- "The fair approach is usually..."

**Key sections that need discussion**:

1. **Scope of Work** - Most disputes arise from unclear scope. Discuss thoroughly.
2. **Payment Terms** - When, how much, payment schedule. Critical for cash flow.
3. **Not to Exceed** - Budget protection. Discuss what happens if exceeded.
4. **Confidentiality** - Duration and exceptions. Important for sensitive projects.
5. **Work Initiation** - When work can legally begin. Prevents unauthorized work.
6. **Intellectual Property** - Who owns what. Critical for creative/technical work.
7. **Termination** - How to exit the contract. Protects both parties.
8. **Dispute Resolution** - How conflicts are handled. Saves time and money.
9. **Jurisdiction** - Which laws apply. Important for cross-border contracts.
10. **Change Orders** - How scope changes are handled. Prevents scope creep.

**For each important section**:
- **Explain why it matters first**: What problems it prevents, what it protects, what happens without it
- **Present options**: Show different ways to structure the clause
- **Explain implications**: What each option means for both parties
- **Ask for user's choice**: Which option they prefer and why
- Show the proposed language based on their choice
- Ask if user understands and agrees
- Customize based on their needs
- **Emphasize fairness**: "This protects both parties equally" or "This ensures clarity for everyone"
- **Focus on relationship**: "This helps prevent misunderstandings that could damage the working relationship"
- **Help them choose**: If user is unsure, recommend the most common/fair option and explain why
- Note: "This is based on standard contract practices designed to be fair to both parties. You may want legal review for complex projects, but the goal is always simplicity and mutual benefit."

**For each section**:
1. Explain the background, what it does, and purpose
2. **For important sections**: Explain why it matters, present options, explain implications
3. Show the content pulled from pitch (if applicable)
4. **For important sections**: Ask for user's choice among options
5. Ask: "Does this work for you, or would you like to adjust anything?"
6. Customize based on user feedback
7. Move to next section

**Output file**: `docs/1-project-brief/contract.md`

---

### Option 2: Service Agreement (Owner → Supplier)

**Load template**: `src/modules/wds/workflows/1-project-brief/pitch/service-agreement.template.md`

**Populate from pitch**:
- Same fields as contract, plus:
- `client_name` - Owner/company name
- `service_provider_name` - Ask user (designer/developer/agency name)
- `payment_terms` - Ask user or extract from Investment Required

**Output file**: `docs/1-project-brief/service-agreement.md`

---

### Option 3: Project Signoff Document (Internal)

**Ask user if they have an existing company signoff document format**:

"Do you have an existing company signoff document or template that you use for internal project approvals? 

If you do, you can upload it and I'll adapt it to match your company's format while incorporating the pitch information. This ensures the signoff document follows your internal processes and requirements.

If you don't have one, I'll use a standard signoff document template that you can customize."

**If user has existing signoff document**:
- Ask user to upload or paste the document: "Please upload or paste your company's signoff document template. I'll analyze it and adapt it to incorporate the pitch information while preserving your company's format and requirements."
- **Analyze the document structure**:
  - Read through the entire document carefully
  - Identify all section headings and their order
  - Note the document format and layout
  - Identify required fields and placeholders
- **Extract key elements**:
  - **Required sections**: List all sections (e.g., "Executive Summary", "Budget Approval", "Risk Assessment", "Resource Allocation", "Compliance Check")
  - **Signoff fields**: Identify who needs to sign (e.g., "Project Sponsor", "Budget Approver", "Department Head", "IT Director", "Legal Review")
  - **Approval workflow**: Understand the process (e.g., "Sequential signoffs", "Parallel approvals", "Approval levels")
  - **Company-specific language**: Note terminology, phrases, and style (e.g., "Capital Expenditure" vs "Budget", "Stakeholder" vs "Approver")
  - **Required disclaimers**: Identify any legal language, compliance statements, or company policies that must be included
  - **Formatting**: Note any specific formatting requirements (headers, footers, page breaks, signature blocks)
- **Map pitch content to company format**:
  - Match pitch sections to company's document structure
  - Adapt pitch language to match company terminology
  - Preserve company's section order and structure
  - Include company-specific sections even if not in pitch (e.g., "Risk Assessment", "Compliance Review")
- **Create adapted document**:
  - Use company's document structure as the foundation
  - Populate with pitch information where appropriate
  - Preserve company-specific sections and language
  - Maintain company's signoff fields and approval workflow
  - Keep company's formatting and layout style
- **Confirm with user**: 
  - "I've analyzed your company's signoff document. I see it includes [list sections]. I've adapted it to include the pitch information while preserving your format. Should I include all sections, or are there any you'd like me to modify or remove?"
  - "I've preserved your signoff fields: [list signoff roles]. Are these correct for this project?"
  - "I've maintained your company's terminology and language. Does this look right?"

**If user doesn't have existing signoff document**:
- Use standard template: `src/modules/wds/workflows/1-project-brief/pitch/signoff.template.md`
- Ask about company-specific requirements:
  - "Who needs to sign off? (Project Sponsor, Budget Approver, Department Head, etc.)"
  - "Are there specific sections your company requires?"
  - "Do you have any company-specific language or disclaimers that should be included?"

**Populate from pitch**:
- Same fields as contract, plus:
- `department_name` - Ask user
- `project_owner` - Ask user or from config
- Company-specific signoff fields (if provided)
- Company-specific sections (if provided)

**Output file**: `docs/1-project-brief/signoff.md`

---

## Common Steps for All Document Types

**Extract deliverables from Work Plan**:
- Review the Work Plan section
- Identify which WDS phases are included
- List expected deliverables (e.g., "UX Design specifications for 3 scenarios", "Technical architecture documentation", "Design handoff package")
- Format as a clear list

**Extract timeline**:
- If mentioned in Investment Required or Work Plan, use that
- Otherwise, provide a general timeline based on phases
- Be realistic about scope

**Ask for missing information**:
- **For Signoff Document**: 
  - "Do you have an existing company signoff document format? If so, please upload it or paste it here and I'll adapt it to match your company's format while incorporating the pitch information."
  - If provided: Analyze structure, extract required sections, signoff fields, company language, and adapt pitch content to match
  - If not provided: "Who needs to sign off? (Project Sponsor, Budget Approver, Department Head, etc.)" and "Are there specific sections your company requires?"
- Client/service provider names
- **Not to exceed amount** (for contract/service agreement) - "What's the maximum budget you want to set? This protects both parties from cost overruns."
- **Confidentiality duration** (for contract/service agreement) - "How long should confidentiality last? (Typically 2-5 years)"
- **Work initiation** - "When should work begin? Options: upon contract signing, specific date, after initial payment, or other condition?"
- **Legal jurisdiction** - "Which jurisdiction's laws should govern this contract? (e.g., 'State of California, USA', 'England and Wales', 'Ontario, Canada')"
- **Contract language** - "What language should this contract be in? (e.g., English, Spanish, French)"
- **Dispute resolution method** - "How should disputes be resolved? (mediation, arbitration, or litigation)"
- Department (for signoff)
- Payment terms (for service agreement)
- Any other context-specific details

**Important**: Discuss each critical section with the user. Reference that contract language is based on professional best practices, but recommend legal review for complex projects or large investments.

---

## Output

**Present to user**:

**If signoff document was adapted from company format**:

"I've created your signoff document at `docs/1-project-brief/signoff.md`.

I've adapted it to match your company's signoff document format while incorporating all the pitch information. The document follows your internal structure and includes:
- Your company's required sections and signoff fields
- Project scope and work plan from the pitch
- Investment and timeline
- Expected deliverables
- Your company's approval workflow and terminology

I've preserved your company-specific language and format. Please review it to ensure it matches your internal requirements, and let me know if any adjustments are needed."

**If standard document was created**:

"I've created your [contract/service agreement/signoff document] at `docs/1-project-brief/[filename].md`.

This document is based on your pitch and designed to be **simple, fair, and clear** - providing reliable terms that support a long-lasting working relationship.

It includes:
- Project scope and work plan
- Investment and timeline
- Expected deliverables
- Terms and conditions/approval section
- Fair protections for both parties

The goal is always clarity and mutual benefit. You can review it and make any adjustments needed before presenting it to stakeholders for approval/signature."

---

## Next Step

After generating the agreement document (or if user skipped), project initiation is complete.

**Next**: Proceed to full Project Brief workflow:
→ `src/modules/wds/workflows/1-project-brief/project-brief/complete/workflow.md`

**Note**: The pitch made the case and got everyone aligned. The agreement document formalizes that alignment. Now you're ready to start the detailed project work.

