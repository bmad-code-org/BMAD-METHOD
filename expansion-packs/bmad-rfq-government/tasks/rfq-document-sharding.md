<!-- Powered by BMAD™ Core -->

# RFQ Document Sharding Task

## Purpose

- Break down large RFQ documents into smaller, more manageable pieces (shards) for effective LLM processing
- Preserve context and meaning while working within token limitations
- Enable parallel processing of different RFQ sections
- Improve efficiency in analyzing extensive government RFQ documents
- Maintain traceability between sharded components

## Usage Scenarios

### Scenario 1: Initial RFQ Processing

1. **Document Assessment**: Evaluate RFQ document size and complexity
2. **Sharding Strategy Selection**: Choose appropriate sharding approach based on document structure
3. **Shard Creation**: Break document into logical, context-preserving shards
4. **Metadata Enrichment**: Add RFQ-specific metadata to each shard
5. **Manifest Generation**: Create a shard manifest for navigation and relationship tracking

### Scenario 2: Processing Large Section L/M Documents

1. **Section Identification**: Locate Section L (instructions) and Section M (evaluation criteria)
2. **Requirement-Based Sharding**: Break sections into requirement-specific shards
3. **Cross-Reference Preservation**: Maintain links between related requirements
4. **Compliance Mapping**: Tag shards with compliance identifiers
5. **Content Distribution**: Distribute shards to appropriate subject matter experts

## Task Instructions

### 1. Document Analysis and Strategy Selection

**Analysis Process**:

1. **Size Assessment**:
   - Calculate total token count of RFQ documents
   - Identify sections exceeding token limits
   - Determine optimal shard size based on document complexity

2. **Structure Analysis**:
   - Identify natural document break points (sections, subsections)
   - Map hierarchical relationships between document components
   - Analyze section dependencies and references

3. **Sharding Strategy Selection**:
   - **Structural Sharding**: Break at section/subsection boundaries
   - **Semantic Sharding**: Break based on content meaning/topic
   - **Requirement-Based Sharding**: Break at individual requirement boundaries
   - **Hybrid Approach**: Combine strategies based on document characteristics

### 2. Shard Creation and Processing

**Sharding Process**:

1. **Document Preparation**:
   - Normalize formatting for consistent processing
   - Extract section headings and numbering
   - Identify and preserve formatting structures

2. **Boundary Identification**:
   - Locate optimal break points based on selected strategy
   - Ensure each shard has sufficient context
   - Preserve paragraph integrity where possible
   - Respect logical content boundaries

3. **Shard Generation**:
   - Create individual shard files with unique identifiers
   - Include contextual information from surrounding content
   - Apply consistent naming convention
   - Set appropriate shard size (3000-5000 tokens recommended)

### 3. Metadata and Context Preservation

**Metadata Components**:

1. **RFQ-Specific Metadata**:
   - RFQ number and section information
   - Requirement IDs contained within shard
   - Section numbers and hierarchical location
   - Original page numbers from source document

2. **Context Preservation**:
   - Include abbreviated section headings for context
   - Add parent section information
   - Preserve numbered lists and hierarchies
   - Maintain table structures and formatting

3. **Cross-Reference Management**:
   - Track references to other sections/attachments
   - Note dependencies on other shards
   - Preserve links to definitions or glossary terms
   - Maintain requirement traceability

### 4. Shard Manifest Generation

**Manifest Elements**:

1. **Shard Catalog**:
   - Comprehensive listing of all generated shards
   - Hierarchical organization reflecting document structure
   - Unique identifiers and file locations
   - Contained requirement IDs

2. **Relationship Mapping**:
   - Parent-child relationships between shards
   - Cross-references between related shards
   - Dependency tracking for proper sequencing
   - Content overlap indicators

3. **Navigation Support**:
   - Table of contents for all shards
   - Quick reference for locating specific content
   - Search optimized metadata
   - Visualization of shard relationships

### 5. Integration with Workflow

**Workflow Integration**:

1. **Shard Distribution**:
   - Assign shards to appropriate team members
   - Track shard ownership and responsibility
   - Enable parallel processing of different shards
   - Coordinate work across related shards

2. **Shard Status Tracking**:
   - Monitor processing status of each shard
   - Track completion percentage
   - Identify bottlenecks or dependencies
   - Prioritize critical path shards

3. **Reassembly Planning**:
   - Define shard recombination process
   - Establish quality checks for reassembled content
   - Create Integration tests for shard boundaries
   - Document reassembly sequence

## Best Practices

- **Appropriate Shard Size**: Target 3000-5000 tokens per shard for optimal processing
- **Context Preservation**: Include sufficient context at shard boundaries (overlap of 100-200 tokens recommended)
- **Consistent Metadata**: Apply uniform metadata structure across all shards
- **Natural Boundaries**: Break at natural section boundaries whenever possible
- **Requirement Integrity**: Avoid splitting individual requirements across shards
- **Relationship Tracking**: Maintain clear linkages between related shards
- **Version Control**: Implement versioning for shards to track changes
- **Complete Coverage**: Ensure no content is lost during sharding process
- **Parallel Processing**: Design shards to enable efficient parallel processing

## Integration Points

- **RFQ Document Import**: Receives imported RFQ documents as input
- **Compliance Matrix Generation**: Feeds sharded documents to compliance tracking
- **Requirements Traceability**: Provides metadata for requirement tracking
- **Proposal Content Development**: Supplies relevant RFQ sections to content creators
- **Evaluation Simulation**: Enables comprehensive review across sharded content

## Related Agents

- **RFQ Opportunity Summarizer**: Primary agent for RFQ document processing
- **Compliance Matrix Builder**: Consumers of sharded RFQ documents

## Technical Implementation Notes

- Implements core capabilities from BMAD Core's `shard-doc.md` task
- Extended with government RFQ-specific functionality
- Compatible with existing flattener architecture
- Enables 30-50% improvement in processing efficiency for large RFQs
