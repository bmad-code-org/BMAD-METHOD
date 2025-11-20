# n8n Workflow Helpers

## Node Creation Guidelines

### Basic Node Structure

```json
{
  "id": "unique-node-id",
  "name": "Node Name",
  "type": "n8n-nodes-base.nodeName",
  "typeVersion": 1,
  "position": [x, y],
  "parameters": {},
  "credentials": {}
}
```

### Node Positioning

- Start node: [250, 300]
- Horizontal spacing: 220px between nodes
- Vertical spacing: 100px for parallel branches
- Grid alignment: Snap to 20px grid for clean layout

### Common Node Types

**Trigger Nodes:**

- `n8n-nodes-base.webhook` - HTTP webhook trigger
- `n8n-nodes-base.scheduleTrigger` - Cron/interval trigger
- `n8n-nodes-base.manualTrigger` - Manual execution trigger
- `n8n-nodes-base.emailTrigger` - Email trigger

**Action Nodes:**

- `n8n-nodes-base.httpRequest` - HTTP API calls
- `n8n-nodes-base.set` - Data transformation
- `n8n-nodes-base.code` - Custom JavaScript/Python code
- `n8n-nodes-base.if` - Conditional branching
- `n8n-nodes-base.merge` - Merge data from multiple branches
- `n8n-nodes-base.splitInBatches` - Process data in batches

**Integration Nodes:**

- `n8n-nodes-base.googleSheets` - Google Sheets
- `n8n-nodes-base.slack` - Slack
- `n8n-nodes-base.notion` - Notion
- `n8n-nodes-base.airtable` - Airtable
- `n8n-nodes-base.postgres` - PostgreSQL
- `n8n-nodes-base.mysql` - MySQL

## Connection Guidelines

### Connection Structure

```json
{
  "node": "Source Node Name",
  "type": "main",
  "index": 0
}
```

### Connection Rules

1. Each connection has a source node and target node
2. Main connections use type: "main"
3. Index 0 is default output, index 1+ for conditional branches
4. IF nodes have index 0 (true) and index 1 (false)
5. Always validate that referenced node names exist

### Connection Patterns

**Linear Flow:**

```
Trigger → Action1 → Action2 → End
```

**Conditional Branch:**

```
Trigger → IF Node → [true: Action1, false: Action2] → Merge
```

**Parallel Processing:**

```
Trigger → Split → [Branch1, Branch2, Branch3] → Merge
```

## Error Handling Best Practices

### Error Workflow Pattern

```json
{
  "name": "Error Handler",
  "type": "n8n-nodes-base.errorTrigger",
  "parameters": {
    "errorWorkflows": ["workflow-id"]
  }
}
```

### Retry Configuration

```json
{
  "retryOnFail": true,
  "maxTries": 3,
  "waitBetweenTries": 1000
}
```

## Data Transformation Patterns

### Using Set Node

```json
{
  "name": "Transform Data",
  "type": "n8n-nodes-base.set",
  "parameters": {
    "mode": "manual",
    "values": {
      "string": [
        {
          "name": "outputField",
          "value": "={{ $json.inputField }}"
        }
      ]
    }
  }
}
```

### Using Code Node

```json
{
  "name": "Custom Logic",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "language": "javaScript",
    "jsCode": "return items.map(item => ({ json: { ...item.json, processed: true } }));"
  }
}
```

## Credentials Management

### Credential Reference

```json
{
  "credentials": {
    "httpBasicAuth": {
      "id": "credential-id",
      "name": "My API Credentials"
    }
  }
}
```

### Common Credential Types

- `httpBasicAuth` - Basic authentication
- `oAuth2Api` - OAuth2
- `httpHeaderAuth` - Header-based auth
- `httpQueryAuth` - Query parameter auth

## Workflow Metadata

### Required Fields

```json
{
  "name": "Workflow Name",
  "nodes": [],
  "connections": {},
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "tags": []
}
```

## Validation Checklist

- [ ] All node IDs are unique
- [ ] All node names are unique
- [ ] All connections reference existing nodes
- [ ] Trigger node exists and is properly configured
- [ ] Node positions don't overlap
- [ ] Required parameters are set for each node
- [ ] Credentials are properly referenced
- [ ] Error handling is configured where needed
- [ ] JSON syntax is valid
