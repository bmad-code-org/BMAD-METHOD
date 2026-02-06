# Step 2: Platform Architecture Decisions

## Purpose

Define the technology stack and infrastructure through systematic discussion.

## Context for Agent

Walk through each major technical area, document decisions, business rules, and constraints as you go.

## Instructions

"Let's establish your technical foundation. I'll walk through each major area."

### 2A: Technology Stack

Ask each question and document the answer:

1. **Backend:**
   - "What backend framework/language are you using? Why?"
   - Capture: Language version, framework patterns, performance needs

2. **Frontend:**
   - "What frontend framework? Any UI library?"
   - Capture: Browser support, mobile responsiveness, accessibility standards

3. **Database:**
   - "What database system(s)? What are your core data entities?"
   - Capture: Data retention, backup/recovery, consistency needs

### 2B: Architecture Style

1. "Monolith, microservices, or serverless?"
2. Dive deeper based on answer (module boundaries, service boundaries, or function triggers)
3. Capture: Deployment patterns, service responsibilities, communication protocols

### 2C: Infrastructure & Hosting

1. "What cloud provider or hosting platform?"
2. "Specific infrastructure services needed?" (CDN, load balancers, etc.)
3. "Deployment approach?" (containers, VMs, serverless)
4. Capture: Geographic regions, disaster recovery, cost constraints

### 2D: Platform Requirements & Standards

1. **Accessibility:** WCAG level, keyboard nav, screen readers, ARIA policies
2. **Internationalization:** Languages, RTL support, regional formats
3. **Browser/Device Compatibility:** Minimum versions, mobile, tablet, PWA
4. **Monitoring:** Logging, error tracking, performance monitoring, alert thresholds

### 2E: Performance & Scale

1. "Performance requirements?" (response times, concurrent users, peak load)
2. "Availability target?" (99%, 99.9%, 99.99%?)
3. "Scalability concerns?"
4. Capture: SLA requirements, peak patterns, growth projections

## After All Sections

Summarize key points and ask: "Anything about platform or infrastructure we should add?"

**Output:** Create `00-Platform-Architecture.md` using the template.

## Next Step

Proceed to step-03-integration-mapping.md

## State Update

```yaml
stepsCompleted: ['step-01-welcome.md', 'step-02-platform-architecture.md']
```
