# Phase 3: PRD Platform (Technical Foundation)

**Agent:** Freya the PM  
**Output Folder:** `C-Requirements/` (or user's configured prefix)

---

## Overview

This phase establishes the technical foundation for the product—everything that can be validated and documented **before** the final UI is designed. The goal is to prove that innovative features are technically feasible, establish platform decisions, and set up experimental endpoints that enable parallel development work.

**Core Principle:** Prove our concept works technically — in parallel with design work.

---

## What You'll Create

By the end of this phase, the `C-Requirements/` folder will contain comprehensive technical specifications:

1. **00-Platform-Architecture.md** - Technology stack and infrastructure decisions
2. **01-Integration-Map.md** - External services and how they connect
3. **02-Technical-Proofs-Of-Concept.md** - Validation of risky features
4. **03-Security-Framework.md** - Authentication, authorization, compliance
5. **04-API-Specifications.md** - Service contracts and endpoint definitions (API-first)
6. **05-Data-Models.md** - Database schemas and entity relationships
7. **06-Performance-Requirements.md** - Scalability and benchmarks
8. **07-Technical-Constraints.md** - What UX design needs to know
9. **08-Acceptance-Criteria.md** - Testable success definitions
10. **09-Platform-Backlog-Recommendations.md** - Suggested epics/initiatives for BMM
11. **10-PRD.md** - Product Requirements Document (started here, grows in Phase 4)

**Note:** These are requirements documents. The actual backlog creation (epics, stories, E-Backlog/ structure) will be handled by BMM agents based on these recommendations.

---

## Prerequisites

Before starting, ensure you have:

- ✅ Product Brief (Phase 1) - Strategic context
- ✅ Trigger Map with Feature Impact Analysis (Phase 2) - Prioritized features
- ✅ Development team availability (for PoC work if needed)

---

## Workflow Steps

### Step 1: Welcome and Context Review

**Freya's Role:**

Greet the user and explain this phase:

- "We're establishing your technical foundation—proving that innovative features work before investing in design."
- "We'll make platform decisions, validate risky features with PoCs, and set up experimental endpoints."
- "This enables backend development to start in parallel with UX design."

Review available context:

- Read the Product Brief to understand project scope and constraints
- Read the Feature Impact Analysis to identify high-priority features
- Ask: "Do you already have any technical constraints or platform preferences?"

---

### Step 2: Platform Architecture Decisions

**Goal:** Define the technology stack and infrastructure through systematic discussion.

**Freya's Approach:**

"Let's establish your technical foundation. I'll walk through each major area, and we'll document your decisions, business rules, and constraints as we go."

**2A: Technology Stack**

Ask each question and document the answer:

1. **Backend:**
   - "What backend framework/language are you using?"
   - "Why this choice? Any specific requirements or constraints?"
   - **Business Rules to Capture:**
     - Language version requirements
     - Framework-specific patterns or conventions
     - Performance characteristics needed

2. **Frontend:**
   - "What frontend framework are you using?"
   - "Any UI library or component framework?"
   - "Why this choice?"
   - **Business Rules to Capture:**
     - Browser support requirements
     - Mobile responsiveness needs
     - Accessibility standards

3. **Database:**
   - "What database system(s) will you use?"
   - "What are your core data entities?" (Start listing them)
   - "How do they relate to each other?"
   - **Business Rules to Capture:**
     - Data retention policies
     - Backup/recovery requirements
     - Data consistency needs (ACID vs. eventual consistency)

**2B: Architecture Style**

Ask systematically:

1. "Are you building a monolith, microservices, or serverless architecture?"
2. Based on answer, dive deeper:
   - **If Monolith:** "How will you structure the codebase? Any module boundaries?"
   - **If Microservices:** "What are your service boundaries? How will they communicate?"
   - **If Serverless:** "What functions/lambdas? What triggers them?"
3. **Business Rules to Capture:**
   - Deployment patterns
   - Service boundaries and responsibilities
   - Communication protocols

**2C: Infrastructure & Hosting**

Ask systematically:

1. "What cloud provider or hosting platform?"
2. "Any specific infrastructure services needed?" (CDN, load balancers, etc.)
3. "What's your deployment approach?" (containers, VMs, serverless)
4. **Business Rules to Capture:**
   - Geographic regions/data residency
   - Disaster recovery requirements
   - Cost constraints

**2D: Platform Requirements & Standards**

Ask systematically about critical platform concerns:

1. **Accessibility:**
   - "What accessibility standards do you need to meet?" (WCAG 2.1 Level AA, etc.)
   - "Who are your accessibility-dependent users?" (screen reader users, keyboard-only, etc.)
   - **Business Rules to Capture:**
     - WCAG compliance level required
     - Keyboard navigation requirements
     - Screen reader compatibility
     - Color contrast standards
     - Alt text and ARIA label policies

2. **Internationalization & Localization:**
   - "What languages/regions do you need to support?"
   - "Are there currency, date, or number format requirements?"
   - **Business Rules to Capture:**
     - Supported languages and locales
     - RTL (right-to-left) language support
     - Translation management approach
     - Regional data formats

3. **Browser & Device Compatibility:**
   - "What browsers and versions must you support?"
   - "What devices?" (desktop, mobile, tablet)
   - "Any specific OS requirements?"
   - **Business Rules to Capture:**
     - Minimum browser versions
     - Mobile responsiveness requirements
     - Tablet-specific considerations
     - Progressive web app (PWA) capabilities

4. **Monitoring & Observability:**
   - "What monitoring and logging do you need?"
   - "Error tracking? Performance monitoring?"
   - **Business Rules to Capture:**
     - Logging level requirements
     - Error tracking service
     - Performance monitoring tools
     - Uptime monitoring
     - Alert thresholds

**2E: Performance & Scale**

Ask systematically:

1. "What are your performance requirements?"
   - Expected response times?
   - How many concurrent users?
   - Peak load expectations?
2. "What's your availability target?" (99%, 99.9%, 99.99%?)
3. "Any scalability concerns?"
4. **Business Rules to Capture:**
   - SLA requirements
   - Peak usage patterns
   - Growth projections

**After completing all sections:**

"Let me summarize what we've covered for platform architecture... [summarize key points]"

**Ask:** "Is there anything about the platform or infrastructure we should add? Any constraints or requirements we missed?"

**Output:** Create `00-Platform-Architecture.md` using the template, incorporating all documented answers.

---

### Step 3: Integration Mapping

**Goal:** Systematically identify all external dependencies through intelligent, context-aware discussion.

**Freya's Approach:**

"Let me review your Product Brief to understand which integrations you'll likely need, then we'll go through each relevant category systematically."

**First: Analyze Product Brief**

Read the Product Brief and identify relevant integration categories based on features mentioned:

- **Payment Processing:** Transactions, subscriptions, e-commerce, paid features, pricing
- **Communication:** User notifications, emails, SMS, alerts, reminders
- **Maps/Location:** Geographic features, addresses, directions, proximity, location-based services
- **Search:** Large content volumes, filtering, discovery features
- **Calendar/Scheduling:** Bookings, appointments, events, availability
- **Social Media:** Sharing, social login, content from social platforms
- **Analytics:** User tracking, behavior analysis, conversion tracking
- **Storage/Media:** File uploads, images, videos, documents
- **Customer Support:** Help features, ticketing, live chat
- **Authentication:** User accounts, SSO, enterprise login
- **Domain-Specific:** Industry-specific services mentioned

**Present Relevant Categories:**

"Based on your Product Brief, I've identified these integration categories that seem relevant:"

[List only applicable categories with reasons from brief]

"Let's go through each of these, then check if there are others you need."

---

**Go through each relevant category systematically:**

**3A: Authentication & Identity**

- "How will users authenticate?" (OAuth, email/password, SSO, passwordless)
- "Which providers?" (Google, Microsoft, Auth0, etc.)
- **Document for each:**
  - Service name & purpose
  - Business rules (token lifetime, MFA requirements)
  - Priority (must-have/nice-to-have)
  - Cost estimate
  - Technical risk (high/medium/low)

**3B: Payment Processing** (if applicable)

- "Do you need payment processing?"
- "Which payment providers?" (Stripe, PayPal, Klarna, Swish, regional systems)
- "What payment methods?" (credit cards, bank transfers, mobile payments, digital wallets)
- "What currencies do you need to support?"
- "Do you need subscription/recurring billing?"
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - Supported payment methods
    - Currency handling
    - Refund policies and workflows
    - Failed payment retry logic
    - Subscription management (if applicable)
    - Tax calculation and collection
    - Invoice generation requirements
    - Payment confirmation/receipt delivery
  - **Compliance needs:** PCI-DSS requirements
  - **Integration complexity:** Webhooks, payment status tracking
  - Priority & cost (transaction fees, monthly costs)
  - Technical risk level

**3C: Communication Services**

- "Do you need to send emails?" → Which service? (SendGrid, Mailgun, AWS SES, Postmark)
- "Do you need SMS?" → Which service? (Twilio, MessageBird, Vonage)
- "Push notifications?" → Which service? (Firebase Cloud Messaging, OneSignal, Pusher)
- "In-app messaging or chat?" → Which service? (Twilio, Stream, PubNub)
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - Message templates and customization
    - Delivery guarantees and retries
    - Opt-out/unsubscribe handling
    - Bounce and complaint management
    - Multi-language support
    - Transactional vs marketing messages
  - Volume estimates (messages per month)
  - Priority & cost

**3D: Search Services** (if applicable)

- "Do you need advanced search functionality?"
- "Which service?" (Algolia, Elasticsearch, Typesense, Meilisearch)
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - What needs to be searchable?
    - Faceted search requirements
    - Auto-complete/type-ahead needs
    - Search result ranking logic
    - Filter and sort options
    - Multi-language search
  - Index size estimates
  - Query volume expectations
  - Priority & cost

**3E: Maps & Location** (if applicable)

- "Do you need maps or geolocation?"
- "Which service?" (Google Maps, Mapbox, OpenStreetMap, Here)
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - Geocoding (address → coordinates)
    - Reverse geocoding (coordinates → address)
    - Route calculation
    - Distance/duration estimation
    - Map display and interaction
    - Geofencing requirements
    - API call limits and caching strategy
    - Accuracy requirements
  - Expected API call volume
  - Cost per API call
  - Priority & risk level

**3F: Data & Analytics**

- "What analytics do you need?" (Google Analytics, Mixpanel, Amplitude, custom)
- "Error tracking?" (Sentry, Rollbar, Bugsnag)
- "Application monitoring?" (New Relic, Datadog, AppDynamics)
- "User session recording?" (FullStory, Hotjar, LogRocket)
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - Events to track
    - User privacy considerations
    - Data retention policies
    - GDPR compliance for tracking
    - Custom dashboards/reports needed
  - Data volume estimates
  - Priority & cost

**3G: Storage & Media**

- "Do you need file/image storage?" (S3, Azure Blob, Google Cloud Storage, Cloudinary)
- "CDN for assets?" (CloudFlare, Fastly, AWS CloudFront)
- "Video hosting/streaming?" (Vimeo, YouTube, Mux, AWS Media Services)
- "Document processing?" (PDF generation, document conversion)
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - File size limits
    - Supported file types
    - Image/video processing (resizing, transcoding)
    - Retention policies and backup
    - Access control (public/private)
    - Virus scanning requirements
  - Volume estimates (storage, bandwidth)
  - Priority & cost

**3H: Calendar & Scheduling** (if applicable)

- "Do you need calendar integrations?"
- "Which services?" (Google Calendar, Outlook/Microsoft 365, iCal)
- "Scheduling/booking systems?" (Calendly-style booking)
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - Event creation and updates
    - Availability checking
    - Timezone handling
    - Recurring events
    - Reminders and notifications
  - Priority & cost

**3I: Social Media & Content** (if applicable)

- "Do you need social media integrations?"
- "Which platforms?" (Facebook, Twitter/X, LinkedIn, Instagram)
- "Social login?" (covered in 3A, but cross-reference)
- "Content sharing?" (Open Graph, Twitter Cards)
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - What data to fetch/post
    - Authentication flow
    - Rate limits
    - Content moderation needs
  - Priority & cost

**3J: Customer Support & Help** (if applicable)

- "Do you need customer support tools?"
- "Which services?" (Intercom, Zendesk, Helpscout, Crisp)
- "Live chat?" (service or custom)
- "Knowledge base/docs?" (service or custom)
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - User identification and context
    - Ticket creation workflow
    - SLA requirements
    - Multi-language support
  - Priority & cost

**3K: Marketing & Growth** (if applicable)

- "Do you need marketing automation?"
- "Which services?" (Mailchimp, HubSpot, ActiveCampaign)
- "A/B testing?" (Optimizely, VWO, custom)
- "Feature flags?" (LaunchDarkly, Flagsmith, custom)
- **Document for each:**
  - Service name & purpose
  - **Business rules:**
    - Audience segmentation
    - Campaign triggers
    - Testing methodology
    - Rollout strategies
  - Priority & cost

**3L: Domain-Specific APIs**

- "Any other APIs specific to your domain?" (industry-specific services)
- Examples: Weather APIs, financial data, shipping/logistics, government data, industry databases
- **Document for each:**
  - Service name & purpose
  - Business rules & constraints
  - Data format requirements
  - Priority & risk level

**After completing all categories:**

"Let me list all the external services we've identified... [summarize]"

**Ask:** "Are there any other external services, APIs, or integrations we should include? Anything we missed?"

**Output:** Create `01-Integration-Map.md` with all services categorized and documented.

---

### Step 4: Identify Features Needing Technical Validation

**Goal:** Determine which features need Proofs of Concept (PoCs).

Review the Feature Impact Analysis and ask:

- **Which features are innovative or unproven?**
- **Which features depend on external APIs that might have limitations?**
- **Which features have unknown performance characteristics?**
- **Which features might not be technically feasible?**

**Red Flags That Suggest PoC Needed:**

- "Can we actually get X data from Y service?"
- "Will this perform fast enough?"
- "Does this API return data in a usable format?"
- "Can we achieve real-time updates at scale?"

Create a list of features requiring validation, prioritized by:

1. **High Feature Impact Score** (from Phase 2) + **High Technical Risk**
2. **Medium Feature Impact** + **High Technical Risk**
3. **High Feature Impact** + **Medium Technical Risk**

---

### Step 5: Technical Proofs of Concept (PoCs)

**Goal:** Validate that risky features are technically feasible.

For each feature identified in Step 4:

1. **Define the Question:**
   - What exactly needs to be proven?
   - Example: "Can we get walking time between two coordinates from Google Maps API?"

2. **Create or Request PoC:**
   - If development team is available: Assign PoC task
   - If conducting PoC now: Guide user through quick validation
   - Document the approach taken

3. **Document Results:**
   - **Status:** ✅ Proven / ⚠️ Limited / ❌ Not Feasible
   - **Findings:** What worked, what didn't
   - **Limitations:** Edge cases, performance concerns, cost implications
   - **Recommendation:** Go / No-Go / Modify Feature

4. **Code Snippets:** Include working code examples when possible

**Output:** Create `02-Technical-Proofs-Of-Concept.md` documenting all PoC work.

**Positive Framing:**

- When features work: "Great! This proves [feature] is technically sound. Design can proceed with confidence."
- When features have limitations: "Valuable discovery! We found [limitation] early. This helps design account for it from the start."
- When features don't work: "Important learning! This saves weeks of design work on an infeasible feature. Let's explore alternatives."

---

### Step 6: Security & Compliance Framework

**Goal:** Systematically define security, authentication, and compliance through detailed discussion.

**Freya's Approach:**

"Security is critical. Let's go through each security area methodically and document all business rules and requirements."

**6A: Authentication**

Ask systematically:

1. "How will users authenticate?" (List options: email/password, OAuth, SSO, passwordless, biometric)
2. "Do you need multi-factor authentication?"
3. "What's your session management approach?"
   - Session lifetime?
   - Remember me functionality?
   - Concurrent session handling?
4. **Business Rules to Capture:**
   - Password requirements (length, complexity, expiration)
   - Account lockout policies
   - Password reset flow
   - Session timeout rules

**6B: Authorization**

Ask systematically:

1. "What user roles do you need?" (List them: admin, user, moderator, etc.)
2. "What can each role do?" (Go through each role)
3. "Do you need row-level security?" (Can users only see their own data?)
4. "How will API access be controlled?"
5. **Business Rules to Capture:**
   - Permission matrix (role × action)
   - Data visibility rules
   - API rate limiting per role
   - Admin capabilities and restrictions

**6C: Data Protection**

Ask systematically:

1. "What sensitive data needs encryption at rest?"
   - Passwords? (always yes)
   - Personal information?
   - Payment data?
   - Other sensitive fields?
2. "TLS/HTTPS for all traffic?" (should be yes)
3. "What's your backup strategy?"
   - Backup frequency?
   - Retention period?
   - Recovery time objective (RTO)?
   - Recovery point objective (RPO)?
4. **Business Rules to Capture:**
   - Encryption algorithms
   - Key management approach
   - Data deletion policies (right to be forgotten)
   - Backup and recovery procedures

**6D: Compliance & Regulations**

Ask systematically about all regulatory requirements:

1. **GDPR (EU General Data Protection Regulation):**
   - "Do you have EU users or process EU citizen data?"
   - If yes, document requirements:
     - **Consent Management:**
       - Cookie consent mechanism
       - Data processing consent
       - Consent withdrawal process
     - **User Rights:**
       - Right to access (data export)
       - Right to deletion (right to be forgotten)
       - Right to rectification (data correction)
       - Right to data portability
       - Right to object to processing
     - **Data Protection:**
       - Privacy policy requirements
       - Data processing agreements
       - Data breach notification procedures (72-hour rule)
       - Data Protection Impact Assessment (DPIA) needs
     - **Business Rules to Capture:**
       - Consent storage and tracking
       - Data retention periods
       - Data deletion workflows
       - User data export format
       - Third-party data processor agreements

2. **Other Privacy Regulations:**
   - "Are you subject to CCPA (California)?" → California Consumer Privacy Act requirements
   - "HIPAA (Healthcare)?" → Health data protection standards
   - "PCI-DSS (Payments)?" → Payment card data security
   - "COPPA (Children)?" → Children's online privacy protection
   - **Business Rules for each applicable regulation**

3. **Data Residency & Sovereignty:**
   - "Must data stay in specific geographic regions?"
   - "Any country-specific data laws?"
   - **Business Rules to Capture:**
     - Data storage location requirements
     - Cross-border data transfer restrictions
     - Regional compliance needs

4. **Industry-Specific Regulations:**
   - "Any industry-specific compliance?" (Financial, healthcare, education, etc.)
   - **Business Rules to Capture:**
     - Specific regulatory requirements
     - Compliance documentation needs
     - Regular audit requirements

5. **Audit Logging & Compliance Tracking:**
   - "Do you need audit trails for compliance?"
   - "What actions must be logged?"
   - **Business Rules to Capture:**
     - Events requiring audit logs (user actions, data access, changes)
     - Log retention period (often 7 years for compliance)
     - Who can access audit logs
     - Tamper-proof logging requirements
     - Regular compliance reporting needs

**After completing all security areas:**

"Let me summarize our security framework... [summarize key points]"

**Ask:** "Is there anything about security, privacy, or compliance we should add? Any requirements or constraints we missed?"

**Output:** Create `03-Security-Framework.md` with all security rules and requirements documented.

---

### Step 7: API Specifications (API-First Design)

**Goal:** Define comprehensive API contracts through systematic category-by-category discussion.

**Freya explains:**

"We're taking an API-first approach. By defining clear service contracts now, we enable backend development to proceed in parallel with UX design. These APIs will serve as the foundation for all future UI work."

**7A: Authentication APIs**

"Let's start with authentication. Based on our security framework, what auth endpoints do you need?"

For each endpoint:

- Method & Path (e.g., `POST /api/auth/login`)
- Purpose & business value
- Request/response format with detailed schemas
- **Business Rules:**
  - Token lifetime & refresh behavior
  - Error responses (invalid credentials, locked account, etc.)
  - Security requirements (HTTPS, rate limiting, etc.)
- Status (planned/in-progress/complete)

Common auth endpoints: login, logout, token refresh, password reset, email verification

**7B: Core Entity APIs (CRUD Operations)**

"Now let's define APIs for your main data entities."

Go through each entity from the data model systematically:

For each entity, define all CRUD operations:

- `GET /api/{entity}` - List with pagination
- `GET /api/{entity}/:id` - Get single item
- `POST /api/{entity}` - Create new
- `PUT /api/{entity}/:id` - Update existing
- `DELETE /api/{entity}/:id` - Delete item

**Business Rules for each:**

- Validation rules (required fields, formats, constraints)
- Authorization (who can perform this operation?)
- Pagination parameters (page size, sorting, filtering)
- Related data inclusion (nested objects, joins)
- Business logic constraints

**7C: External Integration APIs**

"Which external services need API endpoints? Let's create wrappers for each."

For each external service from Step 3:

- Method & Path
- Purpose ("Wraps Google Maps API to get walking time")
- Request/response format
- **Business Rules:**
  - Pre-call validation
  - Caching strategy
  - Fallback behavior on external failure
  - Rate limiting
  - Cost tracking per call
- External service dependencies

**7D: Business Logic APIs**

"What calculations or business operations need dedicated endpoints?"

Examples: availability checks, pricing, recommendations, aggregations

For each:

- Method & Path
- Purpose & business value
- Request/response format
- **Business Rules:**
  - Calculation logic
  - Data sources
  - Edge cases & error handling
  - Performance expectations
- Dependencies

**After defining all APIs:**

"Let me summarize the API surface... [list by category]"

**Ask:** "Are there any other API operations we should include? Any data needs we forgot?"

**Output:** Create `04-API-Specifications.md` with complete service contracts.

---

### Step 8: Data Models & Performance Requirements

**Goal:** Document database schemas and performance benchmarks.

**Freya's Approach:**

"Let's formalize the data model and set clear performance expectations."

**8A: Data Models**

"We identified your core entities earlier. Now let's document the complete data model."

For each entity:

- Entity name & purpose
- All fields with types, constraints, defaults
- Relationships to other entities (one-to-many, many-to-many)
- Indexes for performance
- **Business Rules:**
  - Data validation rules
  - Required vs. optional fields
  - Unique constraints
  - Cascade delete behavior
  - Audit trail needs

Create entity relationship diagram (ERD) showing all connections.

**8B: Performance Requirements**

"What are your performance and scalability expectations?"

Document systematically:

- **Response Times:** Expected latency for each API category
- **Throughput:** Concurrent users, requests per second
- **Data Volume:** Expected record counts, storage needs
- **Availability:** Uptime requirements (99%, 99.9%, 99.99%?)
- **Scalability:** Growth projections and scaling triggers

**Ask:** "Any other data modeling or performance considerations we should capture?"

**Outputs:**

- `05-Data-Models.md` - Complete schemas and ERD
- `06-Performance-Requirements.md` - Benchmarks and scalability specs

---

### Step 9: Technical Constraints & Acceptance Criteria

**Goal:** Create UX design handoff document and define success criteria.

**9A: Technical Constraints Document**

"This document tells the UX team what they need to know about technical possibilities and limitations."

**Include:**

- **What's Possible:** Validated features from PoCs, platform capabilities
- **What Has Limitations:** Technical constraints, API limits, performance characteristics
- **What Affects Design:** Loading states, offline behavior, real-time vs. polling
- **What's Expensive:** Cost-sensitive features requiring careful UX

**9B: Acceptance Criteria**

"How do we know when each platform component is 'done'?"

For each major platform area (auth, integrations, security, etc.):

- **Functional Criteria:** What must work?
- **Performance Criteria:** How fast/scalable must it be?
- **Security Criteria:** What security standards must be met?
- **Testing Criteria:** What tests must pass?

**Ask:** "Any other constraints or success criteria we should document?"

**Outputs:**

- `07-Technical-Constraints.md` - UX design handoff
- `08-Acceptance-Criteria.md` - Testable success definitions

---

### Step 10: Platform Backlog Recommendations

**Goal:** Recommend platform infrastructure work for BMM to organize into epics and stories, prioritized by Feature Impact Analysis.

**Freya explains:**

"Based on all the technical requirements we've documented AND the Feature Impact Analysis from Phase 2, let me suggest how this platform work could be organized for development. We'll prioritize platform work that enables your highest-impact features first."

**10A: Review Feature Impact Analysis**

"Let's look at your high-priority features from Phase 2..."

Read the Feature Impact Analysis (B-Trigger-Map/03-Feature-Impact-Analysis.md) and identify:

- **Must Have features** (high scores, high for primary persona)
- **Consider for MVP features** (balanced scores)
- **Platform dependencies** - What platform work is needed to enable each high-impact feature?

**10B: Identify Recommended Initiatives & Epics**

"Based on your Feature Impact Analysis and technical requirements, here are the major platform initiatives I recommend:"

For each recommended epic, note which high-priority features it enables:

**Initiative: Platform Foundation**

- **Epic: Trusted User Access** (Authentication & user management)
  - Suggested from: Security Framework, API Specifications (auth endpoints)
  - **Enables features:** [List high-impact features requiring authentication]
  - **Feature Impact scores:** [Reference specific features from Phase 2]
  - Business value: Enable secure user access and identity management
  - Key deliverables: Auth system, user management, session handling

- **Epic: [External Service] Integration** (One per major integration)
  - Suggested from: Integration Map, API Specifications (integration endpoints)
  - **Enables features:** [List high-impact features requiring this integration]
  - **Feature Impact scores:** [Reference specific features from Phase 2]
  - Business value: Connect to [service] to enable [specific high-priority features]
  - Key deliverables: Service integration, error handling, data sync

- **Epic: Data Platform Foundation** (Database, models, synchronization)
  - Suggested from: Data Models, Performance Requirements
  - **Enables features:** [List high-impact features requiring data storage]
  - **Feature Impact scores:** [Reference specific features from Phase 2]
  - Business value: Reliable data storage and access for all features
  - Key deliverables: Database setup, schema implementation, migrations

- **Epic: Enterprise Security & Compliance**
  - Suggested from: Security Framework, Acceptance Criteria
  - **Enables features:** [Security-dependent features]
  - Business value: Meet security and compliance requirements
  - Key deliverables: Encryption, audit logging, compliance controls

- **Epic: High-Performance Infrastructure**
  - Suggested from: Performance Requirements, Platform Architecture
  - **Enables features:** [Performance-sensitive features from Phase 2]
  - Business value: Scalable, responsive system that meets performance targets
  - Key deliverables: Caching, optimization, monitoring

**10C: Recommended Development Sequence (Priority-Driven)**

"Here's the order I'd recommend, based on Feature Impact Analysis:"

**Priority 1: Enable Must-Have Features**

1. **Foundation First:** Core infrastructure (hosting, database, basic security)
2. **High-Impact Dependencies:** Platform work needed for Must-Have features
   - [Epic] enables [Feature] (Score: X) for [Primary Persona]
   - [Epic] enables [Feature] (Score: Y) for [Primary Persona]

**Priority 2: Risk Mitigation** 3. **Complex Integrations:** External APIs that are risky or complex (fail fast)

- [Integration Epic] enables [Feature] (Score: X)

**Priority 3: Secondary Features** 4. **Remaining Integrations:** Other external services 5. **Advanced Features:** Performance optimization, advanced security

**Priority 4: Operations** 6. **Monitoring & Tools:** Logging, analytics, maintenance tools

**10D: Feature-to-Epic Mapping**

"Here's how each high-priority feature maps to platform work:"

Create a table:
| Feature (from Phase 2) | Score | Priority | Required Platform Epics | Notes |
|------------------------|-------|----------|-------------------------|-------|
| [Feature Name] | 7 | Must Have | Trusted User Access, Data Platform | Needs auth + storage |
| [Feature Name] | 7 | Must Have | [Integration] Epic, Data Platform | Critical integration |
| [Feature Name] | 5 | Must Have | Data Platform, High-Performance | Primary persona critical |

**10E: API Contracts for Future UI Development**

"These API specifications are ready for frontend development:"

- [List key API categories organized by priority features they enable]
- Backend can implement these in parallel with Phase 4 (UX Design)

**10F: Dependencies & Parallel Work**

"Key dependencies to consider:"

- What must be done before high-impact features can be built?
- What can be developed independently in parallel?
- What provides the most risk reduction AND feature enablement if done early?

**Ask:** "Does this platform work organization make sense based on your feature priorities? Any initiatives or priorities you'd adjust?"

**Output:** Create `09-Platform-Backlog-Recommendations.md` with:

- **Feature Impact Summary** - High-priority features from Phase 2
- **Feature-to-Epic Mapping** - Clear connections between features and platform work
- Recommended initiative structure
- Suggested epic breakdown with business value statements
- **Priority-driven development sequence** - Based on Feature Impact Analysis
- Dependencies and parallel work opportunities
- API contract readiness for future UI
- Notes for BMM agents on implementation approach

**Handoff to BMM:** "These recommendations, informed by your Feature Impact Analysis, will guide BMM agents when they create the actual E-Backlog/ structure with detailed epics and stories. They'll know exactly which platform work enables your highest-value features."

---

### Step 11: Finalize the PRD

**Goal:** Create the master PRD that references all Phase 3 work.

**Freya explains:**

"The PRD is your single source of truth. It starts here with technical foundation and will grow during Phase 4 as functional requirements are added from UX design."

**PRD Structure:**

```markdown
# Product Requirements Document: [Project Name]

_Phase 3 Complete: Technical Foundation Established_  
_Last Updated: [Date]_

---

## 1. Executive Summary

[Link to Product Brief from Phase 1]  
[Link to Trigger Map from Phase 2]

---

## 2. Technical Foundation (Phase 3)

### 2.1 Platform Architecture

[Link to C-Requirements/00-Platform-Architecture.md]

### 2.2 External Integrations

[Link to C-Requirements/01-Integration-Map.md]

### 2.3 Technical Validation

[Link to C-Requirements/02-Technical-Proofs-Of-Concept.md]

### 2.4 Security & Compliance

[Link to C-Requirements/03-Security-Framework.md]

### 2.5 API Specifications

[Link to C-Requirements/04-API-Specifications.md]

### 2.6 Data Models

[Link to C-Requirements/05-Data-Models.md]

### 2.7 Performance Requirements

[Link to C-Requirements/06-Performance-Requirements.md]

### 2.8 Technical Constraints

[Link to C-Requirements/07-Technical-Constraints.md]

### 2.9 Acceptance Criteria

[Link to C-Requirements/08-Acceptance-Criteria.md]

---

## 3. Platform Backlog Recommendations

[Link to C-Requirements/09-Platform-Backlog-Recommendations.md]

**Summary:**

- **Recommended Initiatives:** [List]
- **Suggested Epics:** [Count]
- **API Contracts Ready:** [Key APIs]
- **Ready for BMM:** Platform requirements complete for backlog creation

---

## 4. Functional Requirements (Phase 4)

_This section will be populated during Phase 4 (UX Design) as each page/scenario is completed._

### [Feature Area 1]

_Coming from Phase 4_

### [Feature Area 2]

_Coming from Phase 4_

---

## 5. Next Steps

**For BMM Agents:**

- Use platform backlog recommendations to create E-Backlog/ structure
- Create detailed epics and stories from requirements documents
- Establish implementation roadmap with dependencies

**For Phase 4 (UX Design):**

- Technical constraints document provides design boundaries
- API specifications define data available to UI
- Begin UX design with confidence in technical feasibility

---

## 6. Change Log

- [Date] - Phase 3 complete: Technical foundation established
- [Date] - Platform backlog recommendations provided for BMM
```

**Output:** Create `C-Requirements/10-PRD.md`

---

### Step 12: Summary and Completeness Check

**Freya congratulates the user:**

"Excellent work! We've systematically documented your technical foundation. Let me summarize what we've created:"

**Review each document:**

1. ✅ **Platform Architecture** - Technology stack, infrastructure, data model
2. ✅ **Integration Map** - All external services with business rules
3. ✅ **Technical Proofs of Concept** - Validated risky features
4. ✅ **Security Framework** - Authentication, authorization, compliance rules
5. ✅ **API Specifications** - Service contracts for all endpoints (API-first)
6. ✅ **Data Models** - Complete schemas and ERD
7. ✅ **Performance Requirements** - Scalability and benchmarks
8. ✅ **Technical Constraints** - What UX design needs to know
9. ✅ **Acceptance Criteria** - Success definitions
10. ✅ **Platform Backlog Recommendations** - Suggested work organization for BMM
11. ✅ **PRD Initialized** - Ready to grow in Phase 4

**Completeness Check:**

"Before we finish, let's make sure we haven't missed anything important:"

**Ask systematically:**

1. **"Looking at your platform architecture - is there any technology choice, constraint, or requirement we didn't discuss?"**

2. **"For integrations - are there any external services, APIs, or third-party tools we forgot to include?"**

3. **"Thinking about security - any authentication flows, data protection needs, or compliance requirements we should add?"**

4. **"For API specifications - any endpoints, data operations, or service contracts we missed?"**

5. **"Looking at the platform backlog recommendations - any initiatives, epics, or priorities we should adjust before handing off to BMM?"**

6. **"Are there any business rules, limitations, or requirements that came to mind as we went through this that we should document somewhere?"**

7. **"Anything about performance, scalability, or deployment we should capture?"**

**If user identifies gaps:**

- Document the additional items in the appropriate files
- "Great catch! Let me add that to [relevant document]..."
- After adding, return to completeness check

**When user confirms nothing missing:**

"Perfect! Your technical foundation is solid and complete."

**Parallel Workflows Enabled:**

"With Phase 3 complete, multiple work streams can now proceed:"

1. **BMM Backlog Creation:**
   - BMM agents use platform backlog recommendations
   - Create E-Backlog/ structure with detailed epics and stories
   - Establish implementation roadmap

2. **Backend/Platform Development:**
   - Infrastructure setup can begin
   - API endpoints can be implemented
   - Database schema can be created
   - External integrations can be configured

3. **Phase 4: UX Design:**
   - Design work proceeds with confidence about technical feasibility
   - Technical constraints inform design decisions
   - Each completed page will add functional requirements to the PRD

**What happens next:**

- Platform backlog recommendations guide BMM agents in creating E-Backlog/
- Development teams can begin platform work based on requirements
- Phase 4 (UX Design) can begin, informed by technical constraints

**Ask:** "Would you like to proceed to Phase 4 (UX Design) now, hand off to BMM for backlog creation, or need time for backend development planning?"

---

## Tips for Great Sessions

### For Freya the PM:

**Validate Early, Often:**

- Don't let risky features proceed without PoC validation
- "Let's prove this works before investing in design"

**Positive Language:**

- Frame discoveries as valuable, not failures
- "Great that we learned this now, not after design is complete"

**Stay Connected to Strategy:**

- Reference Feature Impact Analysis scores when prioritizing PoCs
- High-impact features deserve thorough validation

**Enable Parallel Work:**

- Think about what backend teams can start building immediately
- Experimental endpoints should focus on clear, achievable tasks

**Document for Design:**

- Technical Constraints doc is crucial for Phase 4 success
- Be specific about what design needs to accommodate

---

## Template Files

Use these templates to structure outputs:

- `templates/platform-architecture.template.md`
- `templates/technical-constraints.template.md`
- `templates/experimental-endpoints.template.md`

---

_Phase 3 workflow for Whiteport Design Studio (WDS) methodology_
