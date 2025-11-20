# Create n8n Workflow - Validation Checklist

## Workflow Structure

- [ ] Workflow has a valid name
- [ ] Workflow contains at least one trigger node
- [ ] All nodes have unique IDs
- [ ] All nodes have unique names
- [ ] Workflow JSON is valid and parseable

## Node Configuration

- [ ] Trigger node is properly configured
- [ ] All action nodes have required parameters set
- [ ] Node types are valid n8n node types
- [ ] Node positions are set and don't overlap
- [ ] TypeVersion is set for all nodes (usually 1)

## Connections

- [ ] All nodes are connected (no orphaned nodes except trigger)
- [ ] All connections reference existing node names
- [ ] Connection types are set correctly (usually "main")
- [ ] Connection indices are correct (0 for default, 0/1 for IF nodes)
- [ ] No circular dependencies (unless intentional loops)

## Error Handling

- [ ] Error handling strategy matches requirements
- [ ] Critical nodes have retry logic if needed
- [ ] continueOnFail is set appropriately
- [ ] maxTries and waitBetweenTries are configured if retries enabled

## Data Flow

- [ ] Data transformations are properly configured
- [ ] Set nodes have correct value mappings
- [ ] Code nodes have valid JavaScript/Python code
- [ ] Expressions use correct n8n syntax (={{ }})

## Integrations

- [ ] All required integrations are included
- [ ] Credential placeholders are set for authenticated services
- [ ] API endpoints and methods are correct
- [ ] Request/response formats are properly configured

## Best Practices

- [ ] Workflow follows n8n naming conventions
- [ ] Nodes are logically organized and positioned
- [ ] Complex logic is broken into manageable steps
- [ ] Workflow is documented (node names are descriptive)

## Testing Readiness

- [ ] Workflow can be imported into n8n without errors
- [ ] All required credentials are identified
- [ ] Test data requirements are clear
- [ ] Expected outputs are defined

## File Output

- [ ] File is saved to correct location
- [ ] File has .json extension
- [ ] File is valid JSON (passes JSON.parse)
- [ ] File size is reasonable (not corrupted)

## Documentation

- [ ] User has been informed how to import workflow
- [ ] Credential requirements have been communicated
- [ ] Testing instructions have been provided
- [ ] Any special configuration notes have been shared
