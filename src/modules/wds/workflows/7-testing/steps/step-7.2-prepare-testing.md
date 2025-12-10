# Step 7.2: Prepare for Testing

## Your Task

Gather all materials and set up your testing environment before starting validation.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 7.1 (notification received)
- ✅ Testing time scheduled
- ✅ Build information verified

---

## Gather Materials

### Test Scenario

**Load test scenario file:**

- File: `test-scenarios/TS-XXX.yaml`
- Review all test cases
- Understand success criteria
- Note any special setup needed

**Print or display:**

- Have test scenario visible while testing
- Check off tests as you complete them
- Take notes on deviations

---

### Design Delivery

**Load Design Delivery file:**

- File: `deliveries/DD-XXX.yaml`
- Review user value and success criteria
- Review acceptance criteria
- Understand what "done" looks like

---

### Scenario Specifications

**Load all scenario specs:**

- Directory: `C-Scenarios/`
- Review each scenario specification
- Note design details
- Understand expected behavior

**Example:**

```
C-Scenarios/
├── 01-welcome/Frontend/specifications.md
├── 02-login/Frontend/specifications.md
├── 03-signup/Frontend/specifications.md
└── 04-family-setup/Frontend/specifications.md
```

---

### Design System Specs

**Load design system specs:**

- Directory: `D-Design-System/`
- Review component specifications
- Review design tokens
- Note exact colors, sizes, spacing

**Example:**

```
D-Design-System/
├── 02-Foundation/
│   ├── Colors/tokens.json
│   ├── Typography/tokens.json
│   └── Spacing/tokens.json
└── 03-Atomic-Components/
    ├── Buttons/Button-Primary.md
    ├── Inputs/Input-Text.md
    └── Cards/Card-Default.md
```

---

## Set Up Environment

### Access the Build

**Staging environment:**

- URL: [Staging URL]
- Credentials: [Username/Password]
- Platform: [iOS/Android/Web]

**Install build (if needed):**

```bash
# iOS TestFlight
- Open TestFlight app
- Install build v0.1.0-beta.1

# Android
- Download APK from [URL]
- Install on device

# Web
- Navigate to [Staging URL]
- Clear cache first
```

---

### Prepare Test Devices

**Primary device:**

- [ ] Device charged (>80%)
- [ ] Connected to WiFi
- [ ] Screen recording enabled
- [ ] Screenshot tools ready

**Secondary device (if needed):**

- [ ] Different platform (iOS vs Android)
- [ ] Different screen size
- [ ] Different OS version

---

### Set Up Tools

**Screen recording:**

- [ ] QuickTime (Mac)
- [ ] Built-in screen recorder (iOS/Android)
- [ ] OBS Studio (Desktop)

**Screenshot tools:**

- [ ] Native screenshot (Command+Shift+4)
- [ ] Annotate screenshots (Preview, Skitch)

**Note-taking:**

- [ ] Markdown editor open
- [ ] Test tracking document ready
- [ ] Issue template ready

**Accessibility tools:**

- [ ] VoiceOver (iOS) or TalkBack (Android)
- [ ] Color contrast checker
- [ ] Zoom/magnification

---

## Prepare Test Data

**Create test accounts:**

```
Test User 1:
- Email: test1@example.com
- Password: TestPass123!
- Purpose: Happy path testing

Test User 2:
- Email: test2@example.com
- Password: TestPass123!
- Purpose: Error state testing

Test User 3:
- Email: existing@example.com
- Password: TestPass123!
- Purpose: "Email already exists" error
```

**Prepare test data:**

- [ ] Valid emails
- [ ] Invalid emails (for error testing)
- [ ] Strong passwords
- [ ] Weak passwords (for validation testing)
- [ ] Special characters
- [ ] Edge case data (very long names, etc.)

---

## Create Testing Workspace

**File structure:**

```
testing/DD-XXX/
├── screenshots/
│   ├── HP-001-step-1.png
│   ├── HP-001-step-2.png
│   └── ISS-001-button-color.png
├── screen-recordings/
│   ├── happy-path-full-flow.mov
│   └── error-state-email-exists.mov
├── notes.md
└── issues-found.md
```

**Create directories:**

```bash
mkdir -p testing/DD-XXX/screenshots
mkdir -p testing/DD-XXX/screen-recordings
touch testing/DD-XXX/notes.md
touch testing/DD-XXX/issues-found.md
```

---

## Review Test Plan

**Understand what you're testing:**

### Happy Path Tests

- [ ] [Number] tests defined
- [ ] Understand each test flow
- [ ] Know expected results

### Error State Tests

- [ ] [Number] tests defined
- [ ] Understand error scenarios
- [ ] Know expected error messages

### Edge Case Tests

- [ ] [Number] tests defined
- [ ] Understand unusual scenarios
- [ ] Know expected behavior

### Design System Validation

- [ ] [Number] components to check
- [ ] Know exact specifications
- [ ] Have design tokens ready

### Accessibility Tests

- [ ] Screen reader testing
- [ ] Color contrast checking
- [ ] Touch target verification

---

## Time Estimate

**Calculate testing time:**

```
Happy Path Tests: [number] tests × 5 min = [time]
Error State Tests: [number] tests × 3 min = [time]
Edge Case Tests: [number] tests × 5 min = [time]
Design System: [number] components × 10 min = [time]
Accessibility: 30 min
Documentation: 1 hour

Total: [time]
Buffer (20%): [time]

Estimated Total: [time]
```

---

## Final Checklist

**Before starting testing:**

- [ ] Test scenario loaded and reviewed
- [ ] Design Delivery loaded and reviewed
- [ ] All scenario specs loaded
- [ ] Design system specs loaded
- [ ] Build accessible and working
- [ ] Test devices ready
- [ ] Tools set up (recording, screenshots, notes)
- [ ] Test data prepared
- [ ] Workspace created
- [ ] Time blocked on calendar
- [ ] BMad notified you're starting

---

## Start Testing

**When ready:**

```
WDS Designer → BMad Developer

"Starting validation testing for DD-XXX now.

Environment: Staging
Device: iPhone 14 Pro (iOS 17)
Test Scenario: TS-XXX.yaml

Will report back with results by [date/time].

Thanks!"
```

---

## Next Step

After preparation is complete:

```
[C] Continue to step-7.3-run-tests.md
```

---

## Success Metrics

✅ All materials gathered
✅ Environment set up and accessible
✅ Test devices ready
✅ Tools configured
✅ Test data prepared
✅ Workspace created
✅ Test plan reviewed
✅ Time estimated
✅ BMad notified

---

## Failure Modes

❌ Starting testing without materials
❌ Can't access staging environment
❌ Test devices not ready
❌ No screen recording capability
❌ No test data prepared
❌ No time estimate
❌ Not notifying BMad

---

## Tips

### DO ✅

**Be thorough:**

- Gather everything before starting
- Don't interrupt testing to find files

**Be organized:**

- Create workspace structure
- Name files clearly
- Take notes as you go

**Be realistic:**

- Estimate time accurately
- Add buffer for issues
- Block calendar time

### DON'T ❌

**Don't rush:**

- Take time to prepare properly
- Don't skip setup steps

**Don't improvise:**

- Follow test scenario
- Use prepared test data
- Stick to the plan

**Don't forget tools:**

- Screen recording is critical
- Screenshots document issues
- Notes capture details

---

**Remember:** Good preparation = efficient testing. Take time to set up properly!
