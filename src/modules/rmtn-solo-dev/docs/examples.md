# Examples & Use Cases

This section provides practical examples for using RMTN Developer Suite.

---

## Example Workflows

### Scenario 1: The New Feature (The Quest)

1.  **User:** "Thor, I need to add user authentication."
2.  **Thor (New Quest):** Reads Saga. Proposes 3 approaches:
    *   A: Simple Email/Pass (Low Risk, Med Impact)
    *   B: OAuth via Provider (Med Risk, High Impact)
    *   C: Complex RBAC (High Risk, High Impact)
3.  **User:** Selects B.
4.  **Thor:** Drafts `quests/quest-001-auth.md` with detailed steps.
5.  **User:** "Looks good."
6.  **Thor (Execute Quest):** Implements Step 1 (Install SDK), Step 2 (Config), etc., validating each step.
7.  **User:** "Done."
8.  **Mimir (Update Saga):** Updates `context.md` to reflect new Auth system.

### Scenario 2: The Quick Fix

1.  **User:** "Thor, there's a typo in the login button label."
2.  **Thor (Quick Fix):** "On it. Identifying file..." finds `Login.tsx`.
3.  **Thor:** Fixes typo. "Fixed. Verify?"
4.  **User:** "Good."

---

## Common Scenarios

- **Genesis:** Use Mimir to "boot up" the project context so you don't have to explain the stack repeatedly.
- **The Weekend Project:** Use Thor to quickly spec out and build a prototype without getting bogged down in docs, but keeping enough structure to pick it up next weekend.

---

## Tips & Tricks

- **Trust the Saga:** Let Mimir handle the memory. If Mimir knows it, Thor knows it.
- **Score Your Approaches:** Thor's scoring system is great for making you think about *Risk* vs *Reward* before coding.
- **Commit Often:** Execute Quest works best when you commit after each step.

---

## Troubleshooting

### Common Issues

- **Saga out of date:** Run `[US] Update Saga` manually if you feel the context is drifting.
- **Quest stuck:** If execution fails, you can manually edit the Quest markdown file to adjust the plan.

---

## Getting More Help

- Review the main BMAD documentation
- Check module configuration in module.yaml
- Verify all agents and workflows are properly installed
