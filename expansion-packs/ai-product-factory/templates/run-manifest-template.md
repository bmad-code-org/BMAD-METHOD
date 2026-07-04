# Run Manifest Template

Copy to `{apf_artifacts}/runs/{date}-{slug}/run-manifest.yaml` at workflow start.

```yaml
---
product_name: ""
slug: ""
created: "{date}"
status: in-progress  # in-progress | launched | paused | abandoned

idea:
  summary: ""
  product_type: ""  # mobile-app | saas | landing | telegram-bot | ai-agent
  target_platform: ""  # web | flutter | react-native | swiftui

launch_kit: ""  # auto | mobile-app | landing | saas | telegram | ai-agent

phases:
  founder:
    status: pending  # pending | in-progress | complete | skipped
    artifacts: []
  product:
    status: pending
    artifacts: []
  ux:
    status: pending
    artifacts: []
  design:
    status: pending
    artifacts: []
  engineering:
    status: pending
    artifacts: []
  deployment:
    status: pending
    artifacts: []
  marketing:
    status: pending
    artifacts: []
  growth:
    status: pending
    artifacts: []

deployed_urls:
  app: ""
  landing: ""
  app_store: ""
  play_store: ""

decisions: []
open_items: []
```
