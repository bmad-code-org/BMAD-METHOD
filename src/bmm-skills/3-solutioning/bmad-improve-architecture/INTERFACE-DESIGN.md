# Interface Design

When a candidate has been chosen, produce multiple Interface options before recommending one.

## Required options

Create at least three alternatives:

1. Minimal Interface
2. Flexible Interface
3. Caller-optimized Interface

Create a fourth Ports-and-Adapters option only when the dependency shape justifies a real Seam.

## For each option include

- Interface shape
- Example caller usage
- What the Implementation hides
- Dependency and Adapter strategy
- Trade-offs in Depth, Leverage, and Locality

## Comparison criteria

Compare options by:

- Depth
- Locality
- Seam placement
- Adapter strategy
- Test surface
- Migration cost
- Compatibility with ADRs
- Ease of story slicing

## Recommendation rule

Pick one option or a clear hybrid. Do not leave the user with an unranked menu.
