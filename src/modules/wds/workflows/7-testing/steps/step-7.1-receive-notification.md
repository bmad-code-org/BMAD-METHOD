# Step 7.1: Receive Notification

## Your Task

BMad has notified you that a feature is complete and ready for designer validation.

---

## BMad Notification

**You receive:**

```
BMad Developer: "Feature complete: DD-XXX [Flow Name]

                 Implemented:
                 ✓ All [number] scenarios
                 ✓ All error states
                 ✓ All edge cases
                 ✓ Design system components

                 Build: v0.1.0-beta.1
                 Environment: Staging
                 Device: [Platform details]

                 Ready for designer validation.
                 Test scenario: test-scenarios/TS-XXX.yaml

                 Please validate and let me know if any issues."
```

---

## Acknowledge Receipt

**Respond promptly:**

```
WDS Designer: "Received! Starting validation testing for DD-XXX.

               I'll run through test scenario TS-XXX and report
               back within [timeframe].

               Thanks for the notification!"
```

**Set expectations:**

- Small flow: "Will complete testing today"
- Medium flow: "Will complete testing within 2 days"
- Large flow: "Will complete testing within 1 week"

---

## Verify Information

**Check that you have all the details:**

### Build Information

- [ ] Build version number (e.g., v0.1.0-beta.1)
- [ ] Environment (staging, test, etc.)
- [ ] Access credentials (if needed)
- [ ] Platform details (iOS, Android, web, etc.)

### Test Scenario

- [ ] Test scenario file exists: `test-scenarios/TS-XXX.yaml`
- [ ] Test scenario matches this delivery
- [ ] All test cases are defined

### Design Artifacts

- [ ] Design Delivery file: `deliveries/DD-XXX.yaml`
- [ ] Scenario specifications: `C-Scenarios/`
- [ ] Design system specs: `D-Design-System/`

---

## Missing Information?

**If anything is missing, ask immediately:**

```
WDS Designer: "Quick question before I start testing:

               - What's the staging URL?
               - Do I need login credentials?
               - Which device should I test on?

               Thanks!"
```

**Don't start testing until you have everything!**

---

## Schedule Testing

**Block time for testing:**

### Small Flow (1-2 scenarios)

- **Time needed:** 2-4 hours
- **Schedule:** Same day or next day

### Medium Flow (3-5 scenarios)

- **Time needed:** 1-2 days
- **Schedule:** Within 2 days

### Large Flow (6+ scenarios)

- **Time needed:** 3-5 days
- **Schedule:** Within 1 week

**Add buffer for:**

- Finding issues
- Creating issue tickets
- Writing test report

---

## Set Up Tracking

**Create testing session:**

```markdown
# Testing Session: DD-XXX

**Delivery:** DD-XXX [Flow Name]
**Build:** v0.1.0-beta.1
**Started:** 2024-12-09 14:00
**Tester:** [Your name]
**Environment:** Staging
**Device:** iPhone 14 Pro (iOS 17)

**Status:** In Progress

**Test Scenario:** test-scenarios/TS-XXX.yaml

**Progress:**

- [ ] Happy path tests
- [ ] Error state tests
- [ ] Edge case tests
- [ ] Design system validation
- [ ] Accessibility tests

**Issues Found:** 0
**Test Report:** test-reports/TR-XXX-2024-12-09.md
```

---

## Communication

**Keep BMad informed:**

```
WDS Designer: "Testing update for DD-XXX:

               Started: Today 2pm
               Progress: Running happy path tests
               Expected completion: Tomorrow 5pm

               Will notify you when complete!"
```

**If you find critical issues early:**

```
WDS Designer: "Quick heads up on DD-XXX:

               Found critical issue in first test:
               - Login button not working

               Continuing testing to find all issues,
               but wanted to give you early warning.

               Full report coming tomorrow."
```

---

## Next Step

After acknowledging receipt and scheduling:

```
[C] Continue to step-7.2-prepare-testing.md
```

---

## Success Metrics

✅ Notification received from BMad
✅ Receipt acknowledged promptly
✅ All build information verified
✅ Test scenario file confirmed
✅ Design artifacts available
✅ Testing time scheduled
✅ Tracking set up

---

## Failure Modes

❌ Not acknowledging notification
❌ Starting testing without all information
❌ Not scheduling dedicated testing time
❌ No tracking set up
❌ Not communicating timeline

---

## Tips

### DO ✅

**Respond quickly:**

- Acknowledge within 24 hours
- Set clear expectations
- Schedule testing time

**Verify everything:**

- Build details
- Access credentials
- Test scenarios
- Design artifacts

**Communicate proactively:**

- Keep BMad informed
- Report early if critical issues
- Set realistic timelines

### DON'T ❌

**Don't delay:**

- Respond within 24 hours
- Don't make BMad wait

**Don't start unprepared:**

- Verify you have everything
- Don't waste time searching for files

**Don't go silent:**

- Keep BMad updated
- Don't disappear during testing

---

**Remember:** BMad is waiting for your validation. Respond promptly and set clear expectations!
