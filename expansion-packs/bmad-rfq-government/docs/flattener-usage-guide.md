# RFQ Government Response Flattener Usage Guide

<!-- Powered by BMAD™ Core -->

## Overview

This guide provides instructions on how to use the flattener tools within the BMAD-RFQ-Government expansion pack. These tools extend BMAD Core's flattener architecture with RFQ-specific functionality to improve efficiency, consistency, and quality in government RFQ responses.

## Key Benefits

- **Efficiency**: Reduce RFQ response time by 30-50% through better information management
- **Quality**: Improve proposal compliance and consistency by ensuring complete requirements coverage
- **Competitiveness**: Enhance win probability through better theme integration across all proposal elements
- **Risk Reduction**: Identify compliance gaps earlier in the process
- **Scalability**: Support larger and more complex proposals through better organization and tracking

## Available Flatteners

### 1. RFQ Document Flattener

**Purpose**: Aggregate all RFQ documents into a single analyzable corpus

**When to Use**: After importing RFQ documents and before creating the compliance matrix

**Key Features**:

- Document structure recognition to identify sections (L, M, SOW, appendices)
- Automated extraction of requirements, evaluation criteria, and instructions
- RFQ content de-duplication and cross-referencing
- Unified search across all RFQ materials

**Usage**:

```
bmad-flatten -i ./rfq-documents/ -o ./unified-rfq.xml
```

**Output**: A structured XML file containing all RFQ content with identified sections, requirements, and evaluation criteria

### 2. Requirements Traceability Flattener

**Purpose**: Create comprehensive traceability between RFQ requirements and proposal elements

**When to Use**: After creating the compliance matrix and before starting proposal content development

**Key Features**:

- Automated requirement extraction and classification
- Unique identifier assignment to each requirement
- Traceability matrix generation
- Compliance verification across all proposal documents

**Usage**:

```
bmad-flatten -i ./proposal-drafts/ -o ./requirements-database.json --mode=requirements-traceability --rfq=./unified-rfq.xml
```

**Output**: A JSON database mapping requirements to proposal sections with coverage status

### 3. Win Theme Integration Flattener

**Purpose**: Ensure consistent application of win themes across all proposal sections

**When to Use**: After developing win themes and as proposal content is being developed

**Key Features**:

- Theme extraction and classification
- Theme coverage analysis across all proposal sections
- Heat map visualization showing theme implementation
- Automatic suggestions for improved theme integration

**Usage**:

```
bmad-flatten -i ./proposal-drafts/ -o ./theme-coverage-report.md --mode=theme-coverage --themes=./win-themes.md
```

**Output**: A report showing how well win themes are integrated across proposal sections

### 4. Evaluation Flattener

**Purpose**: Enable comprehensive cross-document evaluation

**When to Use**: During the proposal review phase after drafting all content

**Key Features**:

- Unified SWARD analysis across all proposal components
- Cross-document consistency verification
- Automated evaluation against RFQ criteria
- Issue prioritization and remediation recommendations

**Usage**:

```
bmad-flatten -i ./proposal-drafts/ -o ./evaluation-flattened.xml --mode=evaluation --rfq=./unified-rfq.xml
```

**Output**: Comprehensive evaluation report with identified strengths, weaknesses, and recommendations

### 5. Workflow Flattener

**Purpose**: Provide unified status tracking and dependency management

**When to Use**: Throughout the proposal development process to track progress and dependencies

**Key Features**:

- Real-time status dashboard for all proposal components
- Dependency tracking between sections
- Parallel workstream enablement
- Impact analysis for proposed changes

**Usage**:

```
bmad-flatten -i ./proposal-project/ -o ./workflow-status.json --mode=workflow-status
```

**Output**: Status dashboard and dependency graph for all proposal components

## Integration with Workflow

The RFQ Response workflow has been updated to incorporate flattener operations at key points:

1. **After RFQ document import**: The RFQ Flattener aggregates all documents into a unified format
2. **After compliance matrix creation**: The Requirements Traceability Flattener establishes links between requirements and proposal sections
3. **After win theme development**: The Win Theme Integration Flattener tracks theme usage across proposal sections
4. **During proposal review**: The Evaluation Flattener performs cross-document analysis
5. **Throughout the process**: The Workflow Flattener tracks dependencies and status

## Best Practices

1. **Start early**: Use the RFQ Flattener as soon as RFQ documents are available
2. **Update regularly**: Re-run flatteners as content changes to maintain traceability
3. **Use IDs consistently**: Reference requirement IDs from the RFQ Flattener in proposal text
4. **Review coverage reports**: Regularly check the Requirements Traceability and Win Theme Integration reports
5. **Track dependencies**: Use the Workflow Flattener to identify and manage section dependencies

## Troubleshooting

### Common Issues

**Issue**: RFQ Flattener not recognizing sections correctly
**Solution**: Manually identify section boundaries in the unified-rfq.xml file

**Issue**: Requirements Traceability showing missing coverage
**Solution**: Update proposal content to address requirements gaps or explicitly mark as not applicable

**Issue**: Win Theme Integration showing low coverage
**Solution**: Revise sections with low theme presence to incorporate win themes more effectively

**Issue**: Large files causing performance issues
**Solution**: Use sharding capabilities to break large documents into manageable chunks

## Sharding Capabilities

### Overview

Sharding extends the flattener architecture with the ability to break down large documents into smaller, more manageable pieces (shards) while preserving context and relationships. This enables processing of extensive RFQs and proposal content that would otherwise exceed token limits or create performance issues.

### Available Sharding Tools

#### 1. RFQ Sharding Flattener

**Purpose**: Process and shard large RFQ documents into manageable, context-preserving chunks

**When to Use**: After importing RFQ documents and before creating the compliance matrix, especially for large RFQs (>100 pages)

**Key Features**:

- RFQ document structure recognition for optimal break points
- Semantic sharding based on requirement boundaries
- Metadata preservation across shards
- Shard manifest generation for tracking relationships
- Cross-shard reference tracking

**Usage**:

```
bmad-flatten -i ./rfq-documents/ -o ./rfq-shards-manifest.json --mode=rfq-sharding
```

**Output**: A manifest file containing metadata about all shards and their relationships, plus individual shard files

#### 2. Proposal Content Sharding

**Purpose**: Enable efficient development of lengthy technical and management narratives through sharding

**When to Use**: When developing large proposal volumes or complex technical/management narratives

**Key Features**:

- Logical content segmentation based on natural break points
- Context preservation between shards with appropriate overlaps
- Win theme and requirement tracking metadata across shards
- Parallel development workflow support
- Content reassembly management

**Usage**:

```
bmad-flatten -i ./proposal-drafts/ -o ./proposal-shards-manifest.json --mode=content-sharding --themes=./win-themes.md
```

**Output**: A manifest file containing metadata about content shards and their relationships, plus individual content shard files

### Sharding Strategies

1. **Structural Sharding**: Breaks content at natural section/subsection boundaries
   - Best for: Well-structured documents with clear hierarchical organization
   - Example: Breaking an RFQ at major section boundaries (L.1, L.2, etc.)

2. **Semantic Sharding**: Breaks content based on meaning and topic cohesion
   - Best for: Narrative content where structure doesn't align with natural topic boundaries
   - Example: Breaking a technical approach into logical capability descriptions

3. **Requirement-Based Sharding**: Breaks content based on requirement groupings
   - Best for: Compliance-focused content where requirements drive structure
   - Example: Grouping related SOW requirements into discrete shards

4. **Size-Based Sharding**: Breaks content to maintain consistent shard sizes
   - Best for: Very large documents where token limits are the primary concern
   - Example: Breaking lengthy appendices into equally-sized chunks

### Best Practices for Sharding

1. **Optimal Shard Size**: Target 3,000-5,000 tokens per shard for most effective processing
2. **Context Preservation**: Include 100-200 tokens of overlap at shard boundaries
3. **Metadata Enrichment**: Add consistent metadata to all shards for tracking and reassembly
4. **Logical Boundaries**: Break at natural concept or section boundaries whenever possible
5. **Relationship Documentation**: Clearly document relationships between shards in manifest
6. **Version Control**: Implement strict versioning for shards to prevent inconsistencies
7. **Regular Validation**: Periodically reassemble and validate to ensure content integrity
8. **Parallel Coordination**: When using parallel processing, establish clear synchronization points

### Working with Sharded Content

#### Navigation Between Shards

The shard manifest provides relationship information necessary to navigate between related shards. Use the visualization tools to explore shard relationships:

```
bmad-flatten -i ./rfq-shards-manifest.json -o ./shard-visualization.html --mode=shard-visualization
```

#### Parallel Development

Sharded content enables parallel development by multiple team members. Use the workflow tools to coordinate:

```
bmad-flatten -i ./proposal-shards-manifest.json -o ./workflow-status.json --mode=parallel-workflow-status
```

#### Content Reassembly

When content development is complete, use the smart reassembly tools:

```
bmad-flatten -i ./proposal-shards-manifest.json -o ./reassembled-proposal.docx --mode=shard-reassembly
```

## Example: Department of Energy IT Services RFQ

### Day 1: Initial RFQ Analysis

1. Import RFQ documents
2. Run RFQ Flattener:
   ```
   bmad-flatten -i ./doe-rfq-docs/ -o ./doe-unified-rfq.xml
   ```
3. Review extracted requirements and structure in the unified XML

### Day 3: Requirements Mapping

1. Generate compliance matrix from unified RFQ
2. Run Requirements Traceability:
   ```
   bmad-flatten -i ./draft-sections/ -o ./doe-requirements.json --mode=requirements-traceability --rfq=./doe-unified-rfq.xml
   ```
3. Review requirements database and address coverage gaps

### Day 5: Win Theme Application

1. Develop win themes
2. Run Win Theme Integration against draft content:
   ```
   bmad-flatten -i ./draft-sections/ -o ./theme-coverage.md --mode=theme-coverage --themes=./win-themes.md
   ```
3. Update sections with low theme presence

### Day 8: Proposal Review

1. Complete draft proposal
2. Run Evaluation Flattener:
   ```
   bmad-flatten -i ./draft-sections/ -o ./evaluation-report.xml --mode=evaluation --rfq=./doe-unified-rfq.xml
   ```
3. Address identified issues in the proposal

### Throughout: Workflow Tracking

1. Run Workflow Flattener daily:
   ```
   bmad-flatten -i ./doe-proposal/ -o ./workflow-status.json --mode=workflow-status
   ```
2. Review dependencies and adjust work assignments as needed

---

_Document Version: 1.0.0_  
_Created: August 25, 2025_
_Updated: August 25, 2025_
_Author: BMAD Method Team_

## Appendix A: Shard Usage Example - Large Technical RFQ

### Day 1: Initial RFQ Processing with Sharding

1. Import large technical RFQ documents
2. Run RFQ Sharding Flattener:
   ```
   bmad-flatten -i ./technical-rfq-docs/ -o ./rfq-shards-manifest.json --mode=rfq-sharding
   ```
3. Review shard manifest and explore shard structure:
   ```
   bmad-flatten -i ./rfq-shards-manifest.json -o ./shard-visualization.html --mode=shard-visualization
   ```

### Day 3: Requirements Processing with Sharding

1. Generate compliance matrix from sharded RFQ:
   ```
   bmad-flatten -i ./rfq-shards-manifest.json -o ./compliance-requirements.json --mode=sharded-requirements-extraction
   ```
2. Shard the compliance requirements for parallel processing:
   ```
   bmad-flatten -i ./compliance-requirements.json -o ./requirement-shards-manifest.json --mode=requirement-sharding
   ```
3. Distribute requirement shards to subject matter experts for analysis

### Day 5: Content Development with Sharding

1. Create proposal content shards based on outline:
   ```
   bmad-flatten -i ./proposal-outline.md -o ./content-shards-manifest.json --mode=content-shard-creation
   ```
2. Assign shards to content developers for parallel development
3. Track progress across shards:
   ```
   bmad-flatten -i ./content-shards-manifest.json -o ./development-status.html --mode=parallel-workflow-status
   ```

### Day 8: Review and Evaluation with Sharded Content

1. Reassemble draft content for comprehensive review:
   ```
   bmad-flatten -i ./content-shards-manifest.json -o ./draft-proposal-full.docx --mode=shard-reassembly
   ```
2. Conduct shard-aware evaluation:
   ```
   bmad-flatten -i ./content-shards-manifest.json -o ./evaluation-results.json --mode=shard-aware-evaluation
   ```
3. Visualize evaluation results across shards:
   ```
   bmad-flatten -i ./evaluation-results.json -o ./evaluation-heatmap.html --mode=shard-evaluation-visualization
   ```

### Day 10: Final Integration and Submission Preparation

1. Implement final revisions in relevant shards
2. Execute final reassembly with cross-reference resolution:
   ```
   bmad-flatten -i ./content-shards-manifest.json -o ./final-proposal.docx --mode=shard-reassembly --resolve-references=true
   ```
3. Conduct final quality check across reassembled content
