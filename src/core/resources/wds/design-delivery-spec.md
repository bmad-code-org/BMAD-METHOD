# WDS Design Delivery Specification

**For BMad Agents: How to read and interpret WDS Design Deliveries**

---

## What is a Design Delivery?

A Design Delivery (DD) is a package created by WDS that contains:
- Complete user flow specifications
- Technical requirements
- Design system references
- Acceptance criteria
- Testing guidance

**Purpose:** Hand off design work to development in a structured, traceable format

**Location:** `deliveries/DD-XXX-name.yaml`

**Created by:** WDS UX Expert (Phase 4-6)
**Consumed by:** BMad Architect & Developer

---

## File Format

```yaml
delivery:
  id: "DD-001"                    # Unique identifier (DD-XXX)
  name: "Login & Onboarding"      # Human-readable name
  type: "user_flow"               # user_flow | feature | component
  status: "ready"                 # ready | in_progress | blocked
  priority: "high"                # high | medium | low
  created_by: "wds-ux-expert"     # Creator agent
  created_at: "2024-12-09T10:00:00Z"
  updated_at: "2024-12-09T10:00:00Z"
  version: "1.0"

description: |
  Complete user authentication and onboarding flow.
  User can create account, join family, and reach dashboard.
  Testable as standalone feature with real users.

user_value:
  problem: "Users need to access the app securely and set up their family"
  solution: "Streamlined onboarding with family setup"
  success_criteria:
    - "User completes signup in under 2 minutes"
    - "User successfully joins or creates family"
    - "User reaches functional dashboard"
    - "90% completion rate for onboarding flow"

design_artifacts:
  scenarios:
    - id: "01-welcome"
      path: "C-Scenarios/01-welcome-screen/"
      screens: ["welcome"]
      
    - id: "02-login"
      path: "C-Scenarios/02-login/"
      screens: ["login", "forgot-password"]
  
  user_flows:
    - name: "New User Onboarding"
      path: "C-Scenarios/flows/new-user-onboarding.excalidraw"
      entry: "welcome"
      exit: "dashboard"
      
  design_system:
    components:
      - "Button (Primary, Secondary)"
      - "Input Field (Email, Password)"
      - "Card (Welcome, Family)"
    path: "D-Design-System/"

technical_requirements:
  platform:
    frontend: "react_native"
    backend: "supabase"
    
  integrations:
    - name: "supabase_auth"
      purpose: "User authentication"
      required: true
      
    - name: "email_verification"
      purpose: "Verify user email"
      required: true
      
  data_models:
    - name: "User"
      fields: ["email", "name", "avatar"]
      
    - name: "Family"
      fields: ["name", "invite_code", "members"]

acceptance_criteria:
  functional:
    - "User can create account with email/password"
    - "User receives verification email"
    - "User can create new family or join existing"
    
  non_functional:
    - "Onboarding completes in < 2 minutes"
    - "Works offline (cached welcome screen)"
    - "Accessible (WCAG 2.1 AA)"
    
  edge_cases:
    - "Email already exists → Show login option"
    - "Invalid invite code → Show error, allow retry"
    - "Network error during signup → Save progress, retry"

testing_guidance:
  user_testing:
    - "Test with 5 families (different tech comfort levels)"
    - "Measure completion time and drop-off points"
    
  qa_testing:
    - "Test all error states"
    - "Test offline scenarios"
    - "Test accessibility with screen reader"

estimated_complexity:
  size: "medium"              # small | medium | large
  effort: "2-3 weeks"         # Time estimate
  risk: "low"                 # low | medium | high
  dependencies: []            # Other DD-XXX IDs needed first

notes: |
  This is the first user-facing feature and sets the tone
  for the entire app experience. Focus on simplicity and
  clarity. The family setup is unique to this app and needs
  extra attention in user testing.
```

---

## How to Read Design Deliveries

### Step 1: Detect Deliveries

```bash
# Check if deliveries directory exists
if [ -d "deliveries" ]; then
  echo "✓ WDS Design Deliveries found!"
  ls deliveries/DD-*.yaml
else
  echo "⚠ No Design Deliveries yet"
fi
```

### Step 2: Load Delivery

```python
import yaml

# Load delivery file
with open('deliveries/DD-001-login-onboarding.yaml') as f:
    delivery = yaml.safe_load(f)

# Extract key information
name = delivery['delivery']['name']
priority = delivery['delivery']['priority']
status = delivery['delivery']['status']

print(f"Delivery: {name}")
print(f"Priority: {priority}")
print(f"Status: {status}")
```

### Step 3: Extract Scenarios

```python
# Get all scenarios
scenarios = delivery['design_artifacts']['scenarios']

for scenario in scenarios:
    scenario_id = scenario['id']
    scenario_path = scenario['path']
    screens = scenario['screens']
    
    print(f"Scenario: {scenario_id}")
    print(f"Path: {scenario_path}")
    print(f"Screens: {', '.join(screens)}")
    
    # Read scenario specifications
    spec_path = f"{scenario_path}/Frontend/specifications.md"
    # Read and parse specifications...
```

### Step 4: Extract Technical Requirements

```python
# Get tech stack
platform = delivery['technical_requirements']['platform']
frontend = platform['frontend']
backend = platform['backend']

print(f"Frontend: {frontend}")
print(f"Backend: {backend}")

# Get integrations
integrations = delivery['technical_requirements']['integrations']
for integration in integrations:
    name = integration['name']
    required = integration['required']
    purpose = integration['purpose']
    
    print(f"Integration: {name} ({'required' if required else 'optional'})")
    print(f"Purpose: {purpose}")
```

### Step 5: Extract Design System Components

```python
# Get components used
components = delivery['design_artifacts']['design_system']['components']
ds_path = delivery['design_artifacts']['design_system']['path']

for component in components:
    print(f"Component: {component}")
    # Read component specification from design system
    # component_spec = read_file(f"{ds_path}/03-Atomic-Components/{component}/")
```

### Step 6: Extract Acceptance Criteria

```python
# Get acceptance criteria
criteria = delivery['acceptance_criteria']

functional = criteria['functional']
non_functional = criteria['non_functional']
edge_cases = criteria['edge_cases']

print("Functional Requirements:")
for req in functional:
    print(f"  - {req}")

print("\nNon-Functional Requirements:")
for req in non_functional:
    print(f"  - {req}")

print("\nEdge Cases:")
for case in edge_cases:
    print(f"  - {case}")
```

---

## Breaking Down into Development Epics

### Epic Structure

```markdown
# Epic X.X: [Name]

**Source:** DD-XXX ([Delivery Name])
**Priority:** [high|medium|low]
**Effort:** [X days/weeks]
**Risk:** [low|medium|high]
**Dependencies:** [Other epics]

## Scope

[What this epic covers from the delivery]

## Design References

- **Delivery:** deliveries/DD-XXX.yaml
- **Scenarios:** [List of scenario paths]
- **Design System:** [List of components]
- **Specifications:** [Links to detailed specs]

## Technical Requirements

[From delivery.technical_requirements]

## Acceptance Criteria

[From delivery.acceptance_criteria]

## Implementation Tasks

1. [Task 1]
2. [Task 2]
3. [Task 3]

## Testing

[From delivery.testing_guidance]
```

### Example Breakdown

**From DD-001 (Login & Onboarding):**

```
Epic 1.1: Authentication Infrastructure
- Set up Supabase auth
- Configure email verification
- Create User and Family data models
Effort: 3 days
Source: DD-001 technical_requirements

Epic 1.2: Welcome & Login Screens
- Implement Welcome screen (Scenario 01)
- Implement Login screen (Scenario 02)
- Use design system: Button (Primary), Input (Email, Password)
Effort: 4 days
Source: DD-001 scenarios 01-02

Epic 1.3: Signup Flow
- Implement Signup screen (Scenario 03)
- Implement email verification flow
- Handle error states
Effort: 5 days
Source: DD-001 scenario 03

Epic 1.4: Family Setup
- Implement create/join family (Scenario 04)
- Implement add dogs flow
- Complete onboarding
Effort: 5 days
Source: DD-001 scenario 04
```

---

## Important Principles

### 1. Respect Designer Decisions

**The designer has already made these choices:**
- Tech stack (platform.frontend, platform.backend)
- Integrations (technical_requirements.integrations)
- Component usage (design_system.components)

**Your job:** Implement these choices faithfully

**Exception:** If you see a technical problem, flag it:
```
"⚠️ Technical Concern: DD-001 specifies Supabase Auth,
but project already uses Firebase. Recommend discussing
with designer before proceeding."
```

### 2. Maintain Traceability

**Always link back to source:**
```markdown
Epic 1.2: Login Screen
**Source:** DD-001 (Login & Onboarding)
**Scenario:** C-Scenarios/02-login/
**Design System:** D-Design-System/03-Atomic-Components/Buttons/
**Acceptance Criteria:** DD-001 acceptance_criteria.functional
```

### 3. Use Acceptance Criteria

**Designer provided acceptance criteria - these are your requirements:**
```yaml
acceptance_criteria:
  functional:
    - "User can create account with email/password"
    - "User receives verification email"
```

**Your epics must cover ALL acceptance criteria**

### 4. Follow Testing Guidance

**Designer provided testing guidance:**
```yaml
testing_guidance:
  user_testing:
    - "Test with 5 families (different tech comfort levels)"
  qa_testing:
    - "Test all error states"
    - "Test offline scenarios"
```

**Your test plans should follow this guidance**

---

## Delivery Status

### Status Values

**ready:** Complete and ready for development
**in_progress:** Designer still working on scenarios
**blocked:** Waiting for something (dependencies, decisions)

### Checking Status

```python
status = delivery['delivery']['status']

if status == 'ready':
    print("✓ Delivery is ready for development!")
elif status == 'in_progress':
    print("⏳ Delivery is still being designed")
    print("   Wait for designer to mark as ready")
elif status == 'blocked':
    print("🚫 Delivery is blocked")
    print(f"   Reason: {delivery.get('notes', 'See designer')}")
```

---

## Delivery Dependencies

### Understanding Dependencies

```yaml
estimated_complexity:
  dependencies: ["DD-002", "DD-005"]
```

**This means:** DD-001 requires DD-002 and DD-005 to be implemented first

### Checking Dependencies

```python
dependencies = delivery['estimated_complexity']['dependencies']

if dependencies:
    print(f"⚠ This delivery depends on: {', '.join(dependencies)}")
    print("  Implement dependencies first")
else:
    print("✓ No dependencies - can start immediately")
```

---

## Delivery Updates

### Version History

```yaml
delivery:
  version: "1.1"
  updated_at: "2024-12-15T14:00:00Z"
  
notes: |
  Version 1.1 changes:
  - Added offline support requirement
  - Updated family setup flow based on user testing
  - Added new edge case: slow network handling
```

**Always check version and updated_at to see if delivery has changed**

---

## Fallback: No Deliveries

If `deliveries/` directory doesn't exist:

### Option 1: Check for Platform Requirements

```bash
if [ -f "A-Project-Brief/platform-requirements.yaml" ]; then
  echo "✓ WDS Platform Requirements found"
  echo "  WDS is being used, but no deliveries yet"
  echo "  Wait for designer to complete Phase 4"
fi
```

### Option 2: Traditional BMad Workflow

```bash
if [ -f "requirements.md" ]; then
  echo "✓ Traditional requirements found"
  echo "  Proceed with standard BMad workflow"
fi
```

### Option 3: Start from Scratch

```bash
echo "⚠ No requirements found"
echo "  Start requirements gathering"
```

---

## Quick Reference

### File Locations

```
deliveries/
├── DD-001-login-onboarding.yaml
├── DD-002-morning-dog-care.yaml
└── DD-003-task-assignment.yaml

C-Scenarios/
├── 01-welcome-screen/
│   └── Frontend/
│       └── specifications.md
└── 02-login/
    └── Frontend/
        └── specifications.md

D-Design-System/
├── 02-Foundation/
│   ├── Colors/tokens.json
│   └── Typography/tokens.json
└── 03-Atomic-Components/
    ├── Buttons/Button-Primary.md
    └── Inputs/Input-Text.md
```

### Key Fields

```yaml
delivery.id                              # Unique ID
delivery.status                          # ready | in_progress | blocked
delivery.priority                        # high | medium | low
design_artifacts.scenarios               # List of scenarios
design_artifacts.design_system.components # Components used
technical_requirements.platform          # Tech stack
technical_requirements.integrations      # Required integrations
acceptance_criteria.functional           # What must work
estimated_complexity.effort              # Time estimate
estimated_complexity.dependencies        # Other DDs needed first
```

---

**This specification enables BMad agents to seamlessly consume WDS design work!** 📦✨
