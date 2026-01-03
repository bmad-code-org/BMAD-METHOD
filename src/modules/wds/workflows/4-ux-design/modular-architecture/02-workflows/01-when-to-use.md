# When to Use Storyboards

**Complexity indicators that require visual documentation**

---

## Create Storyboards For:

✅ **Components with 3+ states**

- Example (TaskFlow): Task status (TODO, IN_PROGRESS, BLOCKED, DONE, ARCHIVED)

✅ **Time-based transitions**

- Example (TaskFlow): Deadline reminders, auto-status updates

✅ **Multi-step user flows**

- Example (TaskFlow): Creating → Assigning → Completing a task

✅ **Complex interactions between components**

- Example (TaskFlow): Task completion updates dashboard and team notifications

✅ **State machines with branching paths**

- Example (TaskFlow): Happy path vs validation error vs timeout

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

- **TaskFlow:** Task status board (5 states, time-based reminders)
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
