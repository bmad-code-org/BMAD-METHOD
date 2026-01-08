# Step 9: Capture Constraints and Context

## Purpose

Help user identify constraints that should shape design decisions.

## Context for Agent

You are grounding the vision in reality by identifying limitations and context.

## Key Elements

This step identifies real-world limitations and additional context.

## Instructions

Guide user to identify constraints including timeline, budget, technical requirements, brand guidelines, regulatory needs, and integration requirements. Also ask for additional context like company stage, team capabilities, market conditions, or past attempts.

## Next Step

After capturing constraints, proceed to step-11-tone-of-voice.md

## State Update

Update frontmatter of output file:

```yaml
stepsCompleted:
  [
    'step-01-init.md',
    'step-02-vision.md',
    'step-03-positioning.md',
    'step-04-business-model.md',
    'step-05-business-customers.md',
    'step-06-target-users.md',
    'step-07-success-criteria.md',
    'step-08-success-criteria.md',
    'step-09-competitive-landscape.md',
    'step-10-constraints.md',
  ]
constraints: '[captured constraints]'
additional_context: '[captured additional context]'
```
