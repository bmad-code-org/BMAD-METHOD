# Migrate Workflow to n8n - Validation Checklist

## Source Analysis

- [ ] Source platform was identified
- [ ] Source workflow details were gathered
- [ ] Trigger type was identified
- [ ] All integrations were identified
- [ ] Workflow complexity was assessed

## Platform Mapping

- [ ] Platform mappings were loaded
- [ ] Source trigger was mapped to n8n trigger
- [ ] All source actions were mapped to n8n nodes
- [ ] Conditional logic was mapped correctly
- [ ] Loops/iterations were mapped correctly
- [ ] Data transformations were identified

## Workflow Structure

- [ ] n8n workflow has valid JSON structure
- [ ] Workflow name is set
- [ ] Migration tag is added (migrated-from-[platform])
- [ ] All nodes have unique IDs
- [ ] All nodes have unique names
- [ ] Trigger node is properly configured

## Node Configuration

- [ ] All mapped nodes are created
- [ ] Node types are valid n8n types
- [ ] Node parameters are configured
- [ ] Credentials placeholders are set
- [ ] Node positions are calculated correctly
- [ ] No overlapping nodes

## Data Mappings

- [ ] Field mappings from source to n8n are correct
- [ ] Data type conversions are handled
- [ ] Date/time format differences are addressed
- [ ] Expressions use correct n8n syntax (={{ }})
- [ ] Set nodes are used for simple transformations
- [ ] Code nodes are used for complex transformations

## Conditional Logic

- [ ] IF nodes are created for conditional branches
- [ ] Switch nodes are created for multiple conditions
- [ ] Conditions are properly configured
- [ ] True/false branches are correct (index 0/1)
- [ ] All branches are connected

## Connections

- [ ] All nodes are connected properly
- [ ] Trigger connects to first action
- [ ] Actions are connected in sequence
- [ ] Conditional branches are connected
- [ ] Merge points are connected
- [ ] All connections reference existing nodes
- [ ] No orphaned nodes (except trigger)

## Error Handling

- [ ] Error handling strategy is defined
- [ ] Critical nodes have retry logic if needed
- [ ] continueOnFail is set appropriately
- [ ] Error handling matches or improves on source

## Migration Notes

- [ ] Source platform is documented
- [ ] Migration date is recorded
- [ ] Credentials needed are listed
- [ ] Platform-specific differences are noted
- [ ] Testing considerations are documented

## Validation

- [ ] Workflow passes JSON validation
- [ ] All required parameters are set
- [ ] Workflow structure is logical
- [ ] Migration matches source workflow functionality

## Credentials & Authentication

- [ ] All services requiring credentials are identified
- [ ] Credential types are correct for n8n
- [ ] OAuth requirements are noted
- [ ] API key requirements are noted
- [ ] Authentication differences from source are documented

## Testing Readiness

- [ ] Workflow can be imported into n8n
- [ ] Test data requirements are clear
- [ ] Expected outputs are defined
- [ ] Comparison approach with source is defined
- [ ] Initial monitoring plan is suggested

## Documentation

- [ ] User has import instructions
- [ ] Credential setup guidance provided
- [ ] Data mapping explanations provided
- [ ] Testing approach explained
- [ ] Platform differences highlighted
- [ ] Post-migration checklist provided
