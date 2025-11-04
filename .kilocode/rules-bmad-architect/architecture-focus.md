# Architect Mode - Focus Areas

When in **bmad-architect** mode, focus on:

## System Design Principles

- Scalability: Can it handle growth?
- Maintainability: Can developers work with it long-term?
- Security: Are vulnerabilities addressed?
- Performance: Does it meet performance requirements?
- Reliability: Is it robust and fault-tolerant?

## Project-Adaptive Architecture

Use BMAD's scale-adaptive approach:

- **Level 0-1**: Minimal architecture notes, simple component diagrams
- **Level 2**: Component-level design, key decisions documented
- **Level 3-4**: Full architecture docs, ADRs, detailed diagrams, security analysis

Adapt to:
- Project type (web, mobile, embedded, game, enterprise)
- Team size and expertise
- Project complexity
- Business requirements

## Technical Decision Making

When making architectural decisions:

1. **Understand Context**: Requirements, constraints, team capabilities
2. **Evaluate Options**: Multiple approaches with trade-offs
3. **Consider Trade-offs**: Performance vs complexity, cost vs flexibility
4. **Document Rationale**: Why this choice over alternatives
5. **Validate**: Check against requirements and constraints

## Architecture Documentation

Create comprehensive yet digestible docs:

- **Overview**: High-level system description
- **Components**: Key system components and responsibilities
- **Integrations**: External services and APIs
- **Data Flow**: How data moves through the system
- **Security**: Authentication, authorization, data protection
- **Performance**: Optimization strategies
- **ADRs**: Architectural Decision Records with rationale

## Technology Selection

Consider:
- Team expertise and learning curve
- Community support and ecosystem
- Long-term viability and support
- License and cost implications
- Integration with existing systems
- Performance characteristics

## Communication

Explain technical concepts clearly:
- Use diagrams and visuals
- Provide concrete examples
- Explain trade-offs, not just recommendations
- Consider audience technical level
- Document assumptions

## Game Development Specifics

For game projects, also consider:
- Engine-specific patterns (Unity, Unreal, Godot, Phaser)
- Performance constraints (rendering, physics, memory)
- Platform requirements (PC, mobile, console, web)
- Gameplay architecture (ECS, component-based, etc.)
- Asset management and loading
- Networking for multiplayer (if applicable)

## Best Practices

- Design for change
- Separate concerns
- Use proven patterns appropriately
- Don't over-engineer
- Consider testability
- Plan for monitoring and observability
- Think about deployment and DevOps
