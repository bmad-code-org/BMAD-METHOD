# WDS Platform Requirements Specification

**For BMad Agents: How to read and interpret WDS Platform Requirements**

---

## What are Platform Requirements?

Platform Requirements define the technical foundation for the product:
- Tech stack choices (frontend, backend, database)
- Required integrations
- Infrastructure constraints
- Deployment strategy

**Purpose:** Provide technical foundation before detailed design begins

**Location:** `A-Project-Brief/platform-requirements.yaml`

**Created by:** WDS Analyst (Phase 3)
**Consumed by:** BMad Architect

---

## File Format

```yaml
# Platform Requirements
# Created by: WDS Phase 3
# Consumed by: BMad Architecture Phase

project:
  name: "Dog Week"
  type: "mobile_app"              # mobile_app | web_app | desktop_app | api
  wds_version: "6.0"
  created_at: "2024-12-09T10:00:00Z"

platform:
  frontend:
    framework: "react_native"
    version: "0.72"
    state_management: "zustand"
    navigation: "react_navigation"
    styling: "tailwind"
    ui_library: "shadcn"          # optional
  
  backend:
    framework: "supabase"
    version: "2.x"
    auth: "supabase_auth"
    database: "postgresql"
    storage: "supabase_storage"
    api: "rest"                   # rest | graphql | grpc
  
  database:
    type: "postgresql"
    version: "15"
    orm: "prisma"                 # optional
  
  deployment:
    frontend: "expo_eas"
    backend: "supabase_cloud"
    ci_cd: "github_actions"
    hosting: "vercel"             # if web app

integrations:
  - name: "push_notifications"
    provider: "expo"
    required: true
    purpose: "Task reminders and family updates"
    
  - name: "image_upload"
    provider: "cloudinary"
    required: false
    purpose: "Dog photos and user avatars"
    
  - name: "analytics"
    provider: "posthog"
    required: false
    purpose: "User behavior tracking"

constraints:
  - "Must work offline (core features)"
  - "Must support iOS 14+ and Android 10+"
  - "Must be accessible (WCAG 2.1 AA)"
  - "Must handle slow networks gracefully"
  - "Must support family sharing (multi-user)"
  - "Must sync in real-time across devices"

performance_requirements:
  - "App launch < 2 seconds"
  - "Screen transitions < 300ms"
  - "API response time < 500ms"
  - "Offline mode must work for 7 days"

security_requirements:
  - "End-to-end encryption for family data"
  - "Secure password storage (bcrypt)"
  - "OAuth 2.0 for third-party auth"
  - "GDPR compliant data handling"

wds_metadata:
  project_brief: "A-Project-Brief/project-brief.md"
  trigger_map: "B-Trigger-Map/trigger-map.md"
  scenarios: "C-Scenarios/"
  design_system: "D-Design-System/"
```

---

## How to Read Platform Requirements

### Step 1: Check if File Exists

```bash
if [ -f "A-Project-Brief/platform-requirements.yaml" ]; then
  echo "✓ WDS Platform Requirements found!"
else
  echo "⚠ No platform requirements - using traditional workflow"
fi
```

### Step 2: Load Requirements

```python
import yaml

with open('A-Project-Brief/platform-requirements.yaml') as f:
    reqs = yaml.safe_load(f)

project_name = reqs['project']['name']
project_type = reqs['project']['type']

print(f"Project: {project_name}")
print(f"Type: {project_type}")
```

### Step 3: Extract Tech Stack

```python
# Frontend
frontend = reqs['platform']['frontend']
print(f"Frontend Framework: {frontend['framework']} v{frontend['version']}")
print(f"State Management: {frontend['state_management']}")
print(f"Navigation: {frontend['navigation']}")
print(f"Styling: {frontend['styling']}")

# Backend
backend = reqs['platform']['backend']
print(f"Backend Framework: {backend['framework']} v{backend['version']}")
print(f"Auth: {backend['auth']}")
print(f"Database: {backend['database']}")
print(f"Storage: {backend['storage']}")
```

### Step 4: Extract Integrations

```python
integrations = reqs['integrations']

required_integrations = [i for i in integrations if i['required']]
optional_integrations = [i for i in integrations if not i['required']]

print("Required Integrations:")
for integration in required_integrations:
    print(f"  - {integration['name']} ({integration['provider']})")
    print(f"    Purpose: {integration['purpose']}")

print("\nOptional Integrations:")
for integration in optional_integrations:
    print(f"  - {integration['name']} ({integration['provider']})")
    print(f"    Purpose: {integration['purpose']}")
```

### Step 5: Extract Constraints

```python
constraints = reqs['constraints']

print("Constraints:")
for constraint in constraints:
    print(f"  - {constraint}")
```

---

## Using Platform Requirements in Architecture

### Respect Designer Decisions

**The designer (with stakeholders) has already decided:**
- ✅ Tech stack
- ✅ Integrations
- ✅ Constraints
- ✅ Performance targets
- ✅ Security requirements

**Your job:** Design architecture that fits these choices

**NOT your job:** Second-guess or change these decisions

### Exception: Technical Concerns

If you see a problem, flag it clearly:

```
⚠️ TECHNICAL CONCERN

Platform Requirements specify:
- Frontend: React Native
- Backend: Supabase
- Integration: Firebase Cloud Messaging (FCM)

ISSUE: Supabase has built-in push notifications via Supabase Realtime.
Using FCM adds unnecessary complexity.

RECOMMENDATION: Discuss with designer whether to:
1. Use Supabase Realtime instead of FCM
2. Keep FCM if there's a specific reason

Do NOT proceed until resolved.
```

### Architecture Design

```markdown
# Architecture Design: Dog Week

## Tech Stack (from Platform Requirements)

### Frontend
- Framework: React Native 0.72
- State: Zustand
- Navigation: React Navigation
- Styling: Tailwind CSS

### Backend
- Framework: Supabase 2.x
- Auth: Supabase Auth
- Database: PostgreSQL 15
- Storage: Supabase Storage

### Deployment
- Frontend: Expo EAS
- Backend: Supabase Cloud
- CI/CD: GitHub Actions

## Architecture Decisions

Based on platform requirements, I will:

1. **Use Supabase as BaaS**
   - Handles auth, database, storage, real-time
   - Reduces backend complexity
   - Matches designer's choice

2. **Implement Offline-First Architecture**
   - Constraint: "Must work offline (core features)"
   - Use React Native AsyncStorage for local cache
   - Sync with Supabase when online

3. **Real-Time Sync**
   - Constraint: "Must sync in real-time across devices"
   - Use Supabase Realtime subscriptions
   - Conflict resolution: last-write-wins

4. **Performance Optimization**
   - Requirement: "App launch < 2 seconds"
   - Lazy load screens
   - Cache critical data locally
   - Optimize bundle size

[Continue with detailed architecture...]
```

---

## Integration with Design Deliveries

### Platform Requirements Come First

```
Phase 3: Platform Requirements defined
  ↓
Phase 4: Design Deliveries created
  ↓
Design Deliveries reference Platform Requirements
```

### Example

**Platform Requirements:**
```yaml
platform:
  frontend:
    framework: "react_native"
  backend:
    framework: "supabase"
```

**Design Delivery DD-001:**
```yaml
technical_requirements:
  platform:
    frontend: "react_native"    # Matches platform requirements
    backend: "supabase"          # Matches platform requirements
```

**Your job:** Ensure consistency between platform requirements and design deliveries

---

## Constraints and Requirements

### Types of Constraints

**Technical Constraints:**
```yaml
constraints:
  - "Must work offline (core features)"
  - "Must support iOS 14+ and Android 10+"
```

**Business Constraints:**
```yaml
constraints:
  - "Must launch in 3 months"
  - "Must support 10,000 concurrent users"
```

**Regulatory Constraints:**
```yaml
constraints:
  - "Must be GDPR compliant"
  - "Must be WCAG 2.1 AA accessible"
```

### Handling Constraints

**Each constraint affects architecture:**

```markdown
Constraint: "Must work offline (core features)"

Architecture Impact:
- Implement local data cache
- Sync strategy when online
- Conflict resolution
- Offline UI indicators

Implementation:
- Use AsyncStorage for local cache
- Supabase Realtime for sync
- Optimistic UI updates
```

---

## Performance Requirements

### Understanding Performance Targets

```yaml
performance_requirements:
  - "App launch < 2 seconds"
  - "Screen transitions < 300ms"
  - "API response time < 500ms"
```

### Architecture Decisions

```markdown
Performance Requirement: "App launch < 2 seconds"

Architecture Decisions:
1. Lazy load non-critical screens
2. Cache authentication state
3. Preload critical data
4. Optimize bundle size
5. Use code splitting

Measurement:
- Add performance monitoring
- Track launch time in analytics
- Set up alerts if > 2 seconds
```

---

## Security Requirements

### Understanding Security Needs

```yaml
security_requirements:
  - "End-to-end encryption for family data"
  - "Secure password storage (bcrypt)"
  - "OAuth 2.0 for third-party auth"
```

### Architecture Decisions

```markdown
Security Requirement: "End-to-end encryption for family data"

Architecture Decisions:
1. Generate encryption keys per family
2. Store keys securely (device keychain)
3. Encrypt data before sending to server
4. Decrypt data on device only

Implementation:
- Use expo-crypto for encryption
- Use expo-secure-store for key storage
- Implement key rotation strategy
```

---

## Deployment Strategy

### Understanding Deployment

```yaml
deployment:
  frontend: "expo_eas"
  backend: "supabase_cloud"
  ci_cd: "github_actions"
```

### Architecture Decisions

```markdown
Deployment: Expo EAS + Supabase Cloud + GitHub Actions

CI/CD Pipeline:
1. Push to GitHub
2. GitHub Actions runs tests
3. Build app with Expo EAS
4. Deploy backend to Supabase
5. Submit to App Store / Play Store

Environments:
- Development: dev.supabase.co
- Staging: staging.supabase.co
- Production: prod.supabase.co
```

---

## WDS Metadata

### Understanding Metadata

```yaml
wds_metadata:
  project_brief: "A-Project-Brief/project-brief.md"
  trigger_map: "B-Trigger-Map/trigger-map.md"
  scenarios: "C-Scenarios/"
  design_system: "D-Design-System/"
```

**This tells you where to find additional context:**

```python
# Read project brief for business context
with open('A-Project-Brief/project-brief.md') as f:
    brief = f.read()
    # Understand project vision, goals, stakeholders

# Read trigger map for user needs
with open('B-Trigger-Map/trigger-map.md') as f:
    triggers = f.read()
    # Understand user trigger moments and needs

# Check scenarios directory
scenarios = os.listdir('C-Scenarios/')
print(f"Found {len(scenarios)} scenarios")

# Check design system
ds_exists = os.path.exists('D-Design-System/')
print(f"Design system: {'✓ Available' if ds_exists else '⏳ Not yet'}")
```

---

## Fallback: No Platform Requirements

If platform requirements don't exist:

### Option 1: Traditional BMad Workflow

```bash
if [ ! -f "A-Project-Brief/platform-requirements.yaml" ]; then
  echo "⚠ No WDS Platform Requirements"
  echo "  Using traditional BMad workflow"
  echo "  Gather requirements and make tech stack decisions"
fi
```

### Option 2: Wait for WDS

```bash
if [ -f "A-Project-Brief/project-brief.md" ]; then
  echo "✓ WDS Project Brief found"
  echo "  WDS is being used, but Phase 3 not complete yet"
  echo "  Wait for platform requirements to be defined"
fi
```

---

## Quick Reference

### File Location

```
A-Project-Brief/
├── project-brief.md
└── platform-requirements.yaml  ← This file
```

### Key Fields

```yaml
project.name                    # Project name
project.type                    # mobile_app | web_app | desktop_app
platform.frontend.framework     # Frontend framework
platform.backend.framework      # Backend framework
integrations                    # Required/optional integrations
constraints                     # Technical/business/regulatory
performance_requirements        # Performance targets
security_requirements           # Security needs
deployment                      # Deployment strategy
wds_metadata                    # Links to other WDS artifacts
```

### Reading Order

1. **Project info** → Understand what you're building
2. **Tech stack** → Understand technology choices
3. **Integrations** → Understand external dependencies
4. **Constraints** → Understand limitations
5. **Performance** → Understand targets
6. **Security** → Understand security needs
7. **Deployment** → Understand deployment strategy

---

**This specification enables BMad to respect and build upon WDS platform decisions!** ⚙️✨
