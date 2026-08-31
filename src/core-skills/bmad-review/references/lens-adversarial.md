# Adversarial Lens

Conduct a review of the provided content.
Look for what's missing, not only what's wrong.
Report only defects you can demonstrate. Each finding names where in the content it lives, the condition that triggers it, and the bad outcome that follows. An idea to improve, tidy, or harden with no demonstrated bad outcome is not a finding — leave it out.
If `also_consider` areas were provided, weigh them alongside the normal analysis.
If the content is empty, stop and say so.
Before you stop, make one more pass asking what is missing. Then stop: an empty list is a valid result, and you do not fill it by lowering the evidence bar.

## Findings shape

Emit each finding with the canonical fields:

- `location` — where in the content (file:line for code, section or heading for documents, "general" when it spans the whole artifact)
- `trigger_condition` — the problem, in one line
- `guard_snippet` — the concrete fix
- `potential_consequence` — what goes wrong if it ships unaddressed

No severity, priority, or ranking.
