# Step 1: Load Trigger Map

**Duration:** 1 minute

**Purpose:** Access existing Trigger Map and verify it's ready for VTC extraction

---

## What You'll Do

Load the Trigger Map document and confirm it contains necessary elements.

---

## Ask User

> "What's the path to your Trigger Map document?"

**Expected locations:**
- `docs/B-Trigger-Map/trigger-map.md`
- `docs/B-Trigger-Map/trigger-map.yaml`
- `docs/B-Trigger-Map/00-trigger-map.md`
- `docs/02-trigger-map/trigger-map.md`
- `docs/02-trigger-map/00-trigger-map.md`

---

## Load and Verify

**Check Trigger Map contains:**
- [ ] Business goals (with priorities if available)
- [ ] Target groups/users (with descriptions)
- [ ] Driving forces per user (positive and negative)
- [ ] Priorities/scores (optional but helpful)

**Confirm availability:**
```
Found Trigger Map with:
- [X] business goals
- [X] target groups/users
- [Y] total driving forces
- Priorities: [Yes/No]

Ready to extract VTC!
```

---

## If Trigger Map Incomplete

**Missing elements?**

**Option A** - Pause and complete map:
> "Your Trigger Map seems incomplete. Should we finish mapping first, or work with what we have?"

**Option B** - Switch to Creation Workshop:
> "Since the Trigger Map isn't complete, would you prefer to create a VTC from scratch instead?"

---

## Capture Map Reference

```yaml
metadata:
  source: "trigger_map"
  trigger_map_path: "[path to map file]"
  trigger_map_date: "[last modified date]"
```

---

## Next Step

Once Trigger Map is loaded and verified:

**→ Proceed to [Step 2: Select Business Goal](./step-02-select-business-goal.md)**

---

*Step 1 complete - Map loaded*

