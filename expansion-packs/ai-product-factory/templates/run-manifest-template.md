# Lifecycle Run Manifest Template

Save to `{apf_artifacts}/runs/{date}-{slug}/run-manifest.yaml`.

```yaml
schema_version: 1
run_id: ""
status: in-progress # in-progress | blocked | completed | abandoned
track: experiment # experiment | prototype | mvp | production | brownfield
created_at: "{date}"
updated_at: "{date}"
source_artifacts: []
dag:
  - skill: bmad-apf-validate-opportunity
    status: pending # pending | running | passed | failed | waived | skipped
    requires: []
    gate: null
decisions: []
open_questions: []
waivers: []
```

The manifest records only selected nodes. It must not imply that every lifecycle phase is required.
