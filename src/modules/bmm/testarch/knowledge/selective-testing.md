# Selective and Targeted Test Execution

- Use tags/grep (`--grep "@smoke"`, `--grep "@critical"`) to slice suites by risk, not directory.
- Filter by spec patterns (`--spec "**/*checkout*"`) or git diff (`npm run test:changed`) to focus on impacted areas.
- Combine priority metadata (P0–P3) with change detection to decide which levels to run pre-commit vs. in CI.
- Record burn-in history for newly added specs; promote to main suite only after consistent green runs.
- Document the selection strategy in README/CI so the team understands when full regression is mandatory.

_Source: 32+ selective testing strategies blog, Murat testing philosophy._
