{% raw %}# Review log: {{review_identifier}}

Target: {{target_reference}}

<!--
Append-only record of outcomes/decisions.
Main purpose: persisted context for resuming or analyzing
the review process. You're writing this log for consumption
by another LLM session.

Record decisions and their reasons, user constraints, unresolved
findings, and references needed to recover evidence. Link to large
results rather than copying them here.
This is NOT a transcript or internal deliberation.
The review narrative (the human-facing file) owns review blocks
and their statuses.

Log entry:
Use format below. Omit empty fields. In Result, give each finding's
disposition: fixed, accepted as-is, deferred, or open. When a
disposition changes, append a new entry; do not edit earlier ones.
Record the actual session ID supplied by the environment and an ISO
8601 timestamp with local timezone for each entry. If the session ID
is unavailable, write "unavailable" rather than inventing one.

Token budget: up to 150 tokens per entry.
The smaller the better, but do not sacrifice precision.
-->

## {{entry_number}} — {{block_or_area}} — {{activity}}

Session: {{session_id}} · Timestamp: {{timestamp}}

- Action: {{what_was_examined_changed_or_tested}}
- Result: {{findings_outcome_or_decision_and_reason}}
- Evidence: {{file_references_commands_or_result_links}}
- Open: {{unresolved_work_or_question}}
{% endraw %}
