# Result Schema

Write `result.json` as valid JSON with this shape:

```json
{
  "schema": "bmad.dev-auto.result.v1",
  "task_id": "<task_id>",
  "run_id": "<run_id>",
  "status": "completed|blocked|failed",
  "summary": "<one sentence>",
  "artifacts": {
    "run_dir": "<path>",
    "spec": "<path>",
    "review": "<path>",
    "deferred_work": "<path or empty>"
  },
  "changes": {
    "baseline_commit": "<sha|NO_VCS>",
    "head_commit": "<sha|NO_VCS>",
    "files_changed": []
  },
  "verification": [
    {
      "command": "<command>",
      "status": "passed|failed|not_run",
      "details": "<short details>"
    }
  ],
  "review": {
    "iterations": 0,
    "open_findings": [],
    "deferred_findings": []
  },
  "orchestrator_action": "commit|retry|manual_review|none",
  "blocked_reason": "",
  "notes": []
}
```

Use `orchestrator_action` as follows:

- `commit` when the run completed and the orchestrator can proceed to commit or PR handling.
- `retry` when the run was blocked by environmental or transient conditions.
- `manual_review` when the orchestrator must supply missing intent or resolve conflicting requirements.
- `none` when no follow-up action is appropriate.
