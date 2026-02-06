# Step 3: Integration Mapping

## Purpose

Systematically identify all external dependencies through context-aware discussion.

## Context for Agent

Review the Product Brief first to identify which integration categories are relevant, then only discuss applicable ones. For each integration, document: service name, purpose, business rules, priority, cost estimate, and technical risk.

## Instructions

### Analyze Product Brief First

Read the Product Brief and identify relevant categories based on features mentioned. Present only applicable categories with reasons.

### Go Through Each Relevant Category

**3A: Authentication & Identity**
- Authentication methods (OAuth, email/password, SSO, passwordless)
- Providers, token lifetime, MFA requirements

**3B: Payment Processing** (if applicable)
- Providers (Stripe, PayPal, Klarna, regional systems)
- Payment methods, currencies, subscriptions
- Business rules: refund policies, retry logic, tax calculation, invoicing
- Compliance: PCI-DSS requirements

**3C: Communication Services**
- Email (SendGrid, Mailgun), SMS (Twilio), push notifications, in-app chat
- Business rules: templates, delivery guarantees, opt-out handling, multi-language

**3D: Search Services** (if applicable)
- Provider (Algolia, Elasticsearch, Typesense)
- Business rules: searchable content, facets, auto-complete, ranking logic

**3E: Maps & Location** (if applicable)
- Provider (Google Maps, Mapbox, OpenStreetMap)
- Business rules: geocoding, routing, geofencing, caching strategy

**3F: Data & Analytics**
- Analytics (GA, Mixpanel), error tracking (Sentry), monitoring (Datadog)
- Business rules: events to track, privacy, GDPR compliance, retention

**3G: Storage & Media**
- File storage (S3, Cloudinary), CDN, video hosting, document processing
- Business rules: size limits, file types, processing, access control, virus scanning

**3H: Calendar & Scheduling** (if applicable)
- Integrations (Google Calendar, Outlook), booking systems
- Business rules: availability, timezones, recurring events, reminders

**3I: Social Media & Content** (if applicable)
- Platforms, social login, content sharing (Open Graph, Twitter Cards)

**3J: Customer Support** (if applicable)
- Tools (Intercom, Zendesk), live chat, knowledge base
- Business rules: user context, SLA, multi-language

**3K: Marketing & Growth** (if applicable)
- Automation (Mailchimp, HubSpot), A/B testing, feature flags
- Business rules: segmentation, triggers, rollout strategies

**3L: Domain-Specific APIs**
- Industry-specific services (weather, financial, shipping, government)

## After All Categories

Summarize all identified services and ask: "Any other services, APIs, or integrations we should include?"

**Output:** Create `01-Integration-Map.md` with all services categorized and documented.

## Next Step

Proceed to step-04-technical-validation.md

## State Update

```yaml
stepsCompleted: ['step-01-welcome.md', 'step-02-platform-architecture.md', 'step-03-integration-mapping.md']
```
