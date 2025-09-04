<!-- Powered by BMAD™ Core -->

# Shard-Aware Visualization Tools Task

## Purpose

- Provide visualization tools specifically designed for working with sharded content
- Create heat maps showing win theme coverage and compliance across shards
- Develop navigation tools to move efficiently between related shards
- Visualize shard dependencies and relationships for better content management
- Improve team coordination and content quality through visual analysis

## Usage Scenarios

### Scenario 1: Win Theme Coverage Visualization

1. **Theme Extraction**: Identify win themes across all proposal shards
2. **Coverage Analysis**: Analyze theme implementation across shards
3. **Heat Map Generation**: Create visual representation of theme strength
4. **Gap Identification**: Highlight areas needing improved theme integration
5. **Balance Assessment**: Ensure appropriate theme emphasis across proposal

### Scenario 2: Sharded Compliance Matrix Navigation

1. **Requirement Tracking**: Map requirements to sharded content
2. **Coverage Visualization**: Show requirement implementation status
3. **Cross-Shard Navigation**: Move between related compliance elements
4. **Gap Analysis**: Identify compliance holes across sharded content
5. **Impact Assessment**: Visualize effect of requirement changes across shards

## Task Instructions

### 1. Heat Map Visualization Development

**Heat Map Creation Process**:

1. **Data Collection and Preparation**:
   - Extract win theme and key message occurrences from all shards
   - Track theme emphasis and integration quality
   - Collect requirement coverage data across shards
   - Aggregate evaluation findings with shard references

2. **Heat Map Design**:
   - Create matrix layout with shards on one axis, themes/requirements on another
   - Develop color intensity scale for coverage strength
   - Implement filtering capabilities by theme/requirement type
   - Design interactive elements for drill-down analysis

3. **Implementation Techniques**:
   - Generate color-coded visualization showing theme density
   - Include numerical metrics for precise measurement
   - Provide comparison views between different themes
   - Enable toggle between absolute and relative measurement scales

4. **Gap Analysis Features**:
   - Automatically highlight areas with insufficient theme coverage
   - Calculate theme balance metrics across proposal
   - Compare theme coverage to evaluation criteria importance
   - Recommend specific areas for theme enhancement

### 2. Sharded Compliance Matrix Development

**Matrix Creation Process**:

1. **Compliance Data Integration**:
   - Map requirements from compliance matrix to content shards
   - Track requirement implementation status across shards
   - Monitor cross-references between related requirements
   - Link evaluation findings to specific requirements

2. **Matrix Design**:
   - Create hierarchical compliance view showing requirement structure
   - Develop shard-aware filtering and navigation controls
   - Implement status indicators for each requirement
   - Design cross-reference visualization components

3. **Implementation Features**:
   - Generate interactive compliance matrix spanning all shards
   - Include status tracking (complete, partial, missing)
   - Provide direct links to relevant content shards
   - Enable filtering by status, section, or criticality

4. **Impact Analysis Tools**:
   - Visualize how requirement changes affect multiple shards
   - Show dependencies between requirements across shards
   - Calculate compliance completion percentages
   - Predict effort required for compliance gaps

### 3. Shard Navigation Tools Development

**Navigation Tool Creation**:

1. **Shard Relationship Mapping**:
   - Document content relationships between shards
   - Identify natural navigation pathways
   - Map section and subsection connections
   - Track cross-references and dependencies

2. **Navigation Interface Design**:
   - Create interactive shard map with relationship indicators
   - Develop context-aware navigation controls
   - Design breadcrumb navigation showing shard hierarchy
   - Implement search and jump-to functionality

3. **Implementation Features**:
   - Generate navigable shard explorer interface
   - Include previews of connected content
   - Provide direct links between related shards
   - Support both hierarchical and cross-reference navigation

4. **Context Preservation**:
   - Maintain awareness of location within overall document
   - Show surrounding content context when navigating
   - Preserve scroll position and viewing history
   - Provide "return to" functionality for exploration

### 4. Shard Dependency Visualization

**Dependency Visualization Process**:

1. **Dependency Analysis**:
   - Identify content dependencies between shards
   - Map logical and reference relationships
   - Document workflow and development dependencies
   - Track requirement relationships across shards

2. **Visualization Design**:
   - Create network graph showing shard relationships
   - Develop directional indicators for dependency flow
   - Design interactive elements for relationship exploration
   - Implement filtering by dependency type and strength

3. **Implementation Features**:
   - Generate interactive dependency map across all shards
   - Include relationship type classification
   - Provide dependency strength indicators
   - Enable path tracing through multiple dependencies

4. **Critical Path Analysis**:
   - Highlight critical dependencies affecting multiple shards
   - Identify bottlenecks in content development
   - Calculate impact scores for key shards
   - Recommend workflow optimization based on dependencies

### 5. Integration with Workflow Tools

**Integration Process**:

1. **Workflow Tool Linking**:
   - Connect visualization tools to development workflow
   - Integrate with shard assignment and tracking systems
   - Link to evaluation and review processes
   - Connect with document assembly tools

2. **Real-Time Updates**:
   - Implement automatic refresh of visualizations as content changes
   - Provide notification of significant coverage or relationship changes
   - Enable comparison between versions or iterations
   - Support concurrent viewing by multiple team members

3. **Collaborative Features**:
   - Add commenting and annotation capabilities
   - Implement shared viewing sessions
   - Enable team-based filtering and customization
   - Support export and sharing of visualization snapshots

4. **Decision Support Integration**:
   - Connect visualization insights to decision points
   - Provide recommendation engine based on visual analysis
   - Generate status reports from visualization data
   - Support executive review with summary visualizations

## Best Practices

- **Visual Clarity**: Design visualizations that communicate clearly without overwhelming detail
- **Interactive Depth**: Provide simple high-level views with ability to drill down for details
- **Consistent Color Coding**: Use uniform color schemes across all visualization tools
- **Performance Optimization**: Ensure visualizations remain responsive even with large shard counts
- **Customizable Views**: Enable personalization of visualizations based on user role and needs
- **Actionable Insights**: Design visualizations to highlight areas needing attention
- **Context Preservation**: Always maintain awareness of location within overall document structure
- **Accessibility**: Ensure visualizations have alternative representations for accessibility

## Integration Points

- **RFQ Document Sharding**: Visualizes relationships between RFQ document shards
- **Compliance Requirement Sharding**: Provides visual navigation for compliance requirements
- **Proposal Content Sharding**: Offers visualization of content relationships and dependencies
- **Shard-Aware Evaluation**: Displays evaluation results across sharded content
- **Smart Shard Reassembly**: Supports visualization of reassembly planning and execution

## Related Agents

- **Compliance Matrix Builder**: Provider of requirement data for visualization
- **Technical Narrative Drafter**: Consumer of theme coverage visualizations
- **Evaluator Simulator**: User of cross-shard visualization for evaluation
- **Executive Summary Generator**: Consumer of high-level visualization summaries

## Technical Implementation Notes

- Implements modern visualization libraries for interactive graphics
- Supports both web-based and exportable visualization formats
- Designed for responsiveness across different screen sizes
- Optimized for performance with large numbers of shards
- Compatible with existing workflow and document management tools
