<!-- Powered by BMAD™ Core -->

# Compliance Requirement Sharding Task

## Purpose

- Enable efficient handling of large volumes of compliance requirements through sharding
- Group related requirements into logical shards for improved processing
- Implement cross-shard requirement traceability for comprehensive compliance tracking
- Reduce token limitations when processing extensive government RFQs
- Improve team collaboration through parallel processing of requirement shards

## Usage Scenarios

### Scenario 1: Large RFQ with Hundreds of Requirements

1. **Requirement Volume Assessment**: Determine if sharding is necessary based on requirement count
2. **Strategic Grouping**: Organize requirements into logical shards by category or section
3. **Shard Creation**: Generate requirement shards with appropriate metadata and context
4. **Traceability Setup**: Establish cross-references between related requirements across shards
5. **Visualization Generation**: Create dashboards showing requirement coverage across shards

### Scenario 2: Complex Multi-Volume RFQ Response

1. **Volume-Based Sharding**: Organize requirements by proposal volume and section
2. **Team Assignment**: Distribute sharded requirements to appropriate subject matter experts
3. **Dependency Mapping**: Identify and document cross-shard dependencies
4. **Coverage Tracking**: Monitor requirement implementation across distributed teams
5. **Shard Integration**: Reassemble requirement coverage for final compliance verification

## Task Instructions

### 1. Requirement Sharding Strategy Development

**Strategy Components**:

1. **Sharding Assessment**:
   - Calculate total requirement count from compliance matrix
   - Evaluate complexity and relationship density between requirements
   - Determine optimal shard size (50-100 requirements recommended per shard)
   - Identify whether semantic or structural sharding is most appropriate

2. **Grouping Approach Selection**:
   - **Section-Based**: Group by RFQ section (L.1, L.2, M.1, etc.)
   - **Category-Based**: Group by type (technical, management, past performance)
   - **Topic-Based**: Group by subject matter (security, architecture, staffing)
   - **Organizational-Based**: Group by responding organization component
   - **Hybrid Approach**: Combine strategies based on RFQ characteristics

3. **Shard Planning**:
   - Define clear boundaries between requirement shards
   - Plan for overlapping requirements that span multiple categories
   - Establish naming conventions for requirement shards
   - Create shard ownership and responsibility matrix

### 2. Requirement Shard Generation

**Sharding Process**:

1. **Requirement Preparation**:
   - Review requirements from compliance matrix
   - Standardize requirement format for consistent processing
   - Identify critical attributes for cross-shard reference
   - Establish unique identifiers for each requirement

2. **Shard Boundary Definition**:
   - Identify natural clustering points among requirements
   - Set logical break points between requirement groups
   - Ensure related requirements remain together when possible
   - Plan for cross-references where requirements must be split

3. **Shard Creation**:
   - Create individual requirement shard files or database entries
   - Maintain all metadata from original requirements
   - Add shard-specific identifiers and metadata
   - Apply consistent naming and structural conventions
   - Set appropriate shard size (50-100 requirements recommended)

### 3. Cross-Shard Traceability Implementation

**Traceability Components**:

1. **Reference System Design**:
   - Create unique global IDs that persist across shards
   - Implement reference pointers between related requirements
   - Develop bidirectional linking mechanism
   - Preserve hierarchical relationships between requirements

2. **Dependency Tracking**:
   - Identify requirements that depend on others across shards
   - Document parent-child relationships between requirements
   - Track implementation dependencies for proper sequencing
   - Flag requirements that cannot be addressed in isolation

3. **Relationship Metadata**:
   - Add relationship type classifiers (depends-on, related-to, implements)
   - Include strength indicators for relationship importance
   - Document contextual information for relationships
   - Create navigation aids between related requirements

### 4. Visualization and Management Tools

**Visualization Components**:

1. **Coverage Dashboard**:
   - Shard-aware heat map showing requirement implementation status
   - Cross-shard dependency visualization
   - Completion percentage by shard and across shards
   - Critical path identification for dependent requirements

2. **Navigation Systems**:
   - Interactive shard explorer with filtering capabilities
   - Cross-reference navigator showing related requirements
   - Search functionality across all requirement shards
   - Context-aware requirement browser

3. **Status Reporting**:
   - Aggregated compliance status across all shards
   - Bottleneck identification in requirement implementation
   - Progress tracking by team, section, and category
   - Risk assessment for cross-shard dependencies

### 5. Workflow Integration

**Integration Components**:

1. **Team Coordination**:
   - Shard assignment to appropriate team members
   - Notification system for cross-shard dependencies
   - Handoff procedures between teams working on related shards
   - Synchronization points for shard integration

2. **Parallel Processing Support**:
   - Workflow design for concurrent shard processing
   - Conflict detection for simultaneous requirement updates
   - Merge procedures for overlapping work
   - Validation gates for ensuring consistency across shards

3. **Reassembly Process**:
   - Procedures for integrating completed requirement shards
   - Quality control checking across shard boundaries
   - Consolidated compliance validation
   - Final traceability verification across all shards

## Best Practices

- **Logical Grouping**: Create requirement shards based on logical relationships rather than arbitrary divisions
- **Complete Context**: Include sufficient context in each shard for standalone understanding
- **Uniform Metadata**: Maintain consistent metadata structure across all requirement shards
- **Clear Ownership**: Assign specific owners to each shard with clear responsibilities
- **Dependency Documentation**: Thoroughly document cross-shard dependencies and relationships
- **Regular Synchronization**: Schedule frequent integration points between teams working on related shards
- **Comprehensive Traceability**: Ensure every requirement maintains traceability regardless of shard boundaries
- **Visual Management**: Use visualization tools to maintain awareness of overall compliance status
- **Incremental Verification**: Validate cross-shard compliance incrementally rather than only at final integration

## Integration Points

- **RFQ Document Sharding**: Consumes sharded RFQ documents as input
- **Compliance Matrix Generation**: Extends existing compliance tracking with sharding capabilities
- **Proposal Content Development**: Provides targeted requirement shards to content developers
- **Evaluation Simulation**: Supports comprehensive compliance verification across shards
- **Smart Shard Reassembly**: Feeds into reassembly process for final submission

## Related Agents

- **Compliance Matrix Builder**: Primary agent for requirement management
- **Technical Narrative Drafter**: Consumer of technical requirement shards
- **Management Narrative Drafter**: Consumer of management requirement shards

## Technical Implementation Notes

- Extends the existing Requirements Traceability Flattener with sharding capabilities
- Implements cross-shard reference resolution for comprehensive requirement tracking
- Compatible with existing compliance matrix tools and workflows
- Enables efficient parallel processing of requirements by distributed teams
