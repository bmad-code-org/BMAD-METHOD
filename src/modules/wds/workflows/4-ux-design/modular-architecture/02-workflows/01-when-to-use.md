# When to Use Storyboards

**Complexity indicators that require visual documentation**

---

## Create Storyboards For:

✅ **Components with 3+ states**
- Example (Dog Week): Walk slots (WHITE, GRAY, ORANGE, BLUE, GREEN, RED)

✅ **Time-based transitions**
- Example (Dog Week): Countdown timers, auto-state changes

✅ **Multi-step user flows**
- Example (Dog Week): Booking → Starting → Completing a walk

✅ **Complex interactions between components**
- Example (Dog Week): Calendar updates leaderboard and week view

✅ **State machines with branching paths**
- Example (Dog Week): Success path vs error path vs timeout path

---

## Don't Need Storyboards For:

❌ **Simple buttons**
- Hover and active states are obvious

❌ **Static content sections**
- No state changes to document

❌ **Single-state components**
- Nothing to show in sequence

---

## Examples

### Need Storyboard:
- **Dog Week:** Calendar booking (6 states, time-based)
- **Future Project:** Search with autocomplete (5 states, real-time)
- **Future Project:** Multi-step form (progress tracking)
- **Future Project:** Payment flow (multiple steps, error handling)

### Don't Need Storyboard:
- Submit button (2-3 states)
- Hero image (static)
- Text paragraph (no states)
- Logo (no interaction)

---

## Next Steps

- [Storyboard Types](01-storyboard-types.md)
- [Creation Guide](creation-guide.md)
