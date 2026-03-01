# Module 05: Platform Requirements

## Lesson 2: Defining Platform Requirements

**How to document the boundaries that shape your design**

---

## The Five Sections

Every platform requirements document covers five areas:

1. **Platforms** — Where the product lives
2. **Integrations** — What systems connect
3. **Constraints** — What's impossible or expensive
4. **Complexity & Challenges** — Where difficulty exists
5. **Knowledge Gaps** — What we don't know yet

Let's walk through each one.

---

## Section 1: Platforms

**The fundamental question: Where will this product exist?**

### What to capture:

- **Web** — Desktop browsers, mobile browsers, or both?
- **Mobile Native** — iOS, Android, or both?
- **Desktop Applications** — Windows, macOS, Linux?
- **Other** — Smart TV, kiosk, wearable, embedded?

### Why it matters for design:

| Platform | Design Implications |
|----------|-------------------|
| Web only | No native gestures, browser limitations |
| Mobile native | Touch-first, offline expectations |
| Desktop app | Keyboard shortcuts, multi-window |
| Cross-platform | Responsive design, consistent experience |

### Example (Dog Week):

```
Platforms:
- Primary: Progressive Web App (PWA)
- Mobile: iOS and Android via PWA
- Desktop: Web browser (Chrome, Safari, Firefox, Edge)
- Offline: Core features must work offline (PWA service worker)
```

### Questions to ask:

- "What devices will users primarily use?"
- "Do we need to work offline?"
- "Are there browser or OS version requirements?"
- "Is a native mobile app required, or will web work?"

---

## Section 2: Integrations

**What systems must connect to your product?**

### Categories:

**Authentication:**
- OAuth providers (Google, Apple, Microsoft)
- Enterprise SSO (SAML, LDAP)
- Existing user databases
- Social login

**Payments:**
- Payment processors (Stripe, PayPal, Klarna)
- Subscription management
- Invoice systems
- Currency handling

**Third-Party APIs:**
- Maps and location
- Email and SMS
- Analytics
- Cloud storage

**Internal Systems:**
- Legacy databases
- Existing applications
- Corporate tools
- Data warehouses

### Example (Dog Week):

```
Integrations:

Authentication:
- Supabase Auth (primary)
- Google OAuth (optional social login)
- Email/password fallback

Data:
- Supabase PostgreSQL database
- Supabase Storage for images

Future Considerations:
- Calendar sync (Google Calendar, Apple Calendar)
- Veterinarian appointment APIs (Phase 2)
```

### Why it matters for design:

Each integration shapes what's possible:

- **OAuth available?** Design smooth single-click login
- **Calendar sync?** Design around existing schedule patterns
- **Legacy system?** Work within its data model constraints

### Questions to ask:

- "What does the user already use that we should connect to?"
- "Are there existing systems this must integrate with?"
- "What authentication does the organization already use?"
- "What third-party services are already in place?"

---

## Section 3: Constraints

**What's technically impossible, too expensive, or simply not available?**

### Categories:

**Technical Constraints:**
- Hosting limitations (shared hosting, limited resources)
- No real-time capability (polling only)
- Limited API rate limits
- Legacy system restrictions

**Budget Constraints:**
- No budget for native apps
- Can't afford enterprise APIs
- Limited cloud resources
- No dedicated infrastructure

**Team Expertise:**
- No mobile development experience
- No security expertise
- Limited API experience
- No DevOps capability

**Timeline Constraints:**
- Must launch in 3 months
- Phased rollout required
- Seasonal deadline (holiday launch)

**Regulatory Constraints:**
- GDPR compliance
- HIPAA requirements
- Financial regulations
- Accessibility laws

### Example (Dog Week):

```
Constraints:

Technical:
- PWA approach (no native iOS/Android budget)
- Supabase free tier initially (limited concurrent connections)

Budget:
- Bootstrap phase (minimal external spending)
- No paid third-party APIs initially

Team:
- Solo developer initially
- No dedicated mobile expertise

Regulatory:
- GDPR compliance required (Swedish users)
- Child data considerations (family members might include minors)

Timeline:
- MVP in 8 weeks
- Full launch in 16 weeks
```

### Why it matters for design:

Constraints directly shape solutions:

| Constraint | Design Adaptation |
|------------|------------------|
| No real-time | Design with polling, show "last updated" |
| Limited budget | Simpler interactions, fewer features |
| No mobile dev | PWA instead of native app |
| GDPR required | Clear consent flows, data controls |

### Questions to ask:

- "What's technically not possible right now?"
- "What would be too expensive to build?"
- "What skills does the team lack?"
- "What regulatory requirements apply?"
- "What's the timeline we're working with?"

---

## Section 4: Complexity & Challenges

**Where will implementation be difficult?**

This section surfaces risks before they become blockers.

### What to document:

**High Complexity Integrations:**
- Legacy systems with poor documentation
- APIs with rate limits or unreliable uptime
- Systems requiring custom middleware

**Unproven Technology:**
- New frameworks the team hasn't used
- Cutting-edge features with limited support
- Platform features in beta

**Challenging Requirements:**
- Real-time sync across devices
- Offline-first with conflict resolution
- Complex data migrations

### Example (Dog Week):

```
Complexity & Challenges:

Medium Complexity:
- Push notifications across platforms (PWA limitations on iOS)
- Offline sync with conflict resolution for schedules

Lower Complexity:
- User authentication (Supabase handles this well)
- Basic CRUD operations for tasks and events

Challenges:
- iOS PWA push notifications are limited
- Calendar sync requires OAuth complexity
- Image optimization for slow connections
```

### Rating scale:

- **Low** — Well-understood, team has experience
- **Medium** — Achievable but requires research
- **High** — Significant unknowns, may need spikes
- **Unknown** — Needs investigation before commitment

### Questions to ask:

- "How complex is this integration really?"
- "Has the team done this before?"
- "What's the challenge level?"
- "Are there unknowns that need research?"

---

## Section 5: Knowledge Gaps

**What don't we know yet?**

This is the most important section. It surfaces what needs investigation.

### What to document:

**Technical Unknowns:**
- "Can the legacy API handle our expected load?"
- "Does the payment processor support our currency?"
- "Will the OAuth provider work with our platform?"

**Performance Unknowns:**
- "How will the app perform on slow networks?"
- "What happens with 10,000 concurrent users?"
- "Can images load fast enough on mobile?"

**Integration Unknowns:**
- "Does the third-party API have the endpoints we need?"
- "What's the data format of the legacy system?"
- "Is real-time sync technically feasible?"

### Example (Dog Week):

```
Knowledge Gaps:

Needs Research:
- PWA push notification behavior on iOS 17+
- Supabase performance with complex RLS policies
- Image CDN options within budget

Needs Spike:
- Offline sync conflict resolution patterns
- Calendar integration OAuth flows

Needs Team Decision:
- React Native vs PWA long-term strategy
- Self-hosted vs Supabase managed
```

### Why this matters:

**Knowledge gaps become development tasks.**

While you focus on design, the development agent can:
- Research the unknowns
- Spike the complex integrations
- Test the assumptions
- Report back with findings

This is parallel work. Design doesn't stop while technical investigation happens.

### Questions to ask:

- "What do we not know yet?"
- "What assumptions haven't been validated?"
- "What needs a proof-of-concept?"
- "What might surprise us later?"

---

## The Complete Document

Here's what a finished platform-requirements.md looks like:

```markdown
# Platform Requirements

## Platforms
- Primary: Progressive Web App (PWA)
- Mobile: iOS and Android via PWA
- Desktop: Web browser (Chrome, Safari, Firefox, Edge)
- Offline: Core features must work offline

## Integrations
- Authentication: Supabase Auth, Google OAuth optional
- Database: Supabase PostgreSQL
- Storage: Supabase Storage
- Future: Calendar sync, veterinarian APIs

## Constraints
- Technical: PWA approach, Supabase free tier initially
- Budget: Bootstrap phase, no paid APIs
- Team: Solo developer, no dedicated mobile expertise
- Regulatory: GDPR compliance, child data considerations
- Timeline: MVP in 8 weeks

## Complexity & Challenges
- Medium: Push notifications, offline sync
- Low: Authentication, basic CRUD
- Challenges: iOS PWA limitations, OAuth complexity

## Knowledge Gaps
- Research: iOS 17+ PWA behavior, Supabase RLS performance
- Spike: Offline sync patterns, calendar OAuth
- Decision: React Native vs PWA long-term
```

---

## Where It Lives

`A-Product-Brief/platform-requirements.md`

**Why with the Product Brief?**

Because platform requirements are strategic context. They're not technical specifications — they're the boundaries that shape all design decisions.

Just like the Product Brief, this document gets referenced throughout the project. When you're designing, you check it. When developers have questions, they check it. When scope discussions happen, everyone checks it.

---

## The Handoff

Once this document exists:

1. **Hand off to development** — Technical investigation begins
2. **Reference in design** — Every decision respects these boundaries
3. **Update as you learn** — New discoveries get documented

**This is a living document.** As knowledge gaps get investigated, the document gets updated. As the project evolves, constraints may change. Keep it current.

---

## What You've Learned

- The five sections of platform requirements
- How to document each section effectively
- Why constraints inform rather than limit design
- How knowledge gaps become parallel development work
- Where the document lives and how it's used

---

## What's Next

In the tutorial, you'll create your own platform-requirements.md. Saga will guide you through each section, asking the right questions to surface your project's specific boundaries.

---

**[Continue to Tutorial: Create Platform Requirements →](tutorial-05.md)**

---

[← Back to Lesson 1](lesson-01-why-boundaries-matter.md) | [Back to Module Overview](module-05-platform-requirements-overview.md)

*Part of Module 05: Platform Requirements*
