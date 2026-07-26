# APF v2 Product Lifecycle

APF selects an execution track rather than running a fixed product pipeline.

| Track | Goal | Default route |
| --- | --- | --- |
| Experiment | Validate demand or a key assumption | validate opportunity → design experiment |
| Prototype | Validate UX or technical feasibility | design experiment → execute |
| MVP | Deliver one complete value loop | plan product → plan delivery → build vertical slice |
| Production | Add operational readiness | plan delivery → build vertical slice → release product |
| Brownfield | Safely extend an existing product | project contract → execute or plan delivery |

`bmad-apf-launch-product` creates a gated DAG from these routes. It does not require database, authentication, backend, analytics, payments, deployment, or launch marketing unless the selected track and requirements need them.

## BMAD core ownership

APF prepares founder context, evidence, gates, and routing. BMAD core owns canonical PRD, UX, architecture, epics/stories, implementation, and review artifacts.
