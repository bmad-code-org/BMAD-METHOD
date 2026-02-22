# Quick-Flow Redesign — Implementation Roadmap

## Strategy: Skeleton-First with Real Plumbing

Build the full BMM sharded workflow infrastructure with minimal step prompts. Run it. See where training falls short. Tighten only where it demonstrably fails.

## Phase 1: Working Skeleton (Current)

Full BMM plumbing, thin prompts.

### Create
```
src/bmm/workflows/bmad-quick-flow/
  workflow.md                     # Real entry point — config loading, path resolution, step-file architecture rules
  tech-spec-template.md           # Real template — frozen sections, change log, golden examples
  steps/
    step-01-clarify-and-route.md  # Slightly more flesh (routing criteria matter)
    step-02-plan.md               # Thin prompt, real plumbing
    step-03-implement.md          # Thin prompt, real plumbing (task sharding structure)
    step-04-review.md             # Thin prompt, real plumbing
    step-05-present.md            # Thin prompt, real plumbing
```

### Modify
- `src/bmm/agents/quick-flow-solo-dev.agent.yaml` — single QF trigger
- `src/bmm/module-help.csv` — replace QS/QD with QF

### Delete
- `src/bmm/workflows/bmad-quick-flow/quick-spec/` (entire directory)
- `src/bmm/workflows/bmad-quick-flow/quick-dev/` (entire directory)

### Test
Run the skeleton on a real task. Observe where it works, where it breaks.

## Phase 2+: Iterative Tightening

Add specificity to step prompts only where Phase 1 testing reveals gaps. The detailed plan (`quick-flow-redesign-plan.md`) is the reference spec — pull from it as needed, don't front-load it all.

Candidates for tightening (in likely priority order based on complexity):
- Step 1 routing criteria (one-shot vs plan-code-review vs full-BMM)
- Step 4 review layers and classification cascade
- Step 3 crash recovery and resume logic
- Step 4 spec loop oscillation mitigations (frozen sections, guardrails ratchet, positive preservation)
- Step 5 findings presentation and PR creation
