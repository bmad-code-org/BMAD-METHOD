# Modify n8n Workflow - Validation Checklist

## Pre-Modification

- [ ] Original workflow file was successfully loaded
- [ ] Workflow JSON was valid before modifications
- [ ] Backup was created before making changes
- [ ] User requirements were clearly understood

## Workflow Structure

- [ ] Workflow maintains valid JSON structure
- [ ] Workflow name is preserved (unless intentionally changed)
- [ ] All nodes still have unique IDs
- [ ] All nodes still have unique names
- [ ] Workflow settings are preserved

## Node Modifications

- [ ] Added nodes have unique IDs
- [ ] Added nodes have unique names
- [ ] Added nodes have valid node types
- [ ] Added nodes have required parameters set
- [ ] Modified nodes preserve their IDs
- [ ] Modified nodes have valid parameter values
- [ ] Removed nodes are completely removed from nodes array

## Connections

- [ ] All connections reference existing nodes
- [ ] Connections to/from added nodes are properly configured
- [ ] Connections affected by removed nodes are updated
- [ ] No orphaned connections remain
- [ ] Connection indices are correct (0 for default, 0/1 for IF nodes)
- [ ] No circular dependencies (unless intentional)

## Node Positioning

- [ ] New nodes have valid positions
- [ ] New nodes don't overlap with existing nodes
- [ ] Node positions follow spacing guidelines (220px horizontal)
- [ ] Branch nodes have appropriate vertical spacing (±100px)

## Error Handling

- [ ] Error handling modifications are applied correctly
- [ ] Retry logic is properly configured if added
- [ ] continueOnFail settings are appropriate
- [ ] maxTries and waitBetweenTries are set if retries enabled

## Data Flow

- [ ] Data flow is maintained after modifications
- [ ] New transformations are properly configured
- [ ] Expressions use correct n8n syntax (={{ }})
- [ ] No data flow breaks introduced

## Integration Changes

- [ ] New integrations are properly configured
- [ ] Credential requirements are identified
- [ ] API configurations are correct
- [ ] Existing integrations still work

## Validation

- [ ] Modified workflow passes JSON validation
- [ ] All modifications match user requirements
- [ ] No unintended changes were made
- [ ] Workflow structure is still logical

## Backup & Recovery

- [ ] Backup file was created successfully
- [ ] Backup location was communicated to user
- [ ] Original workflow can be restored if needed

## Testing Readiness

- [ ] Modified workflow can be imported into n8n
- [ ] Changes are testable
- [ ] Expected behavior is clear
- [ ] Any new credentials needed are identified

## Documentation

- [ ] Changes made are summarized for user
- [ ] User understands what was modified
- [ ] Testing recommendations provided if needed
- [ ] Backup location shared with user
