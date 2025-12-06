# n8n Workflow Helpers

## UUID Generation

n8n uses UUIDs for node IDs, workflow IDs, and webhook IDs. Generate UUIDs in this format:

**Full UUID (36 characters):** `f8b7ff4f-6375-4c79-9b2c-9814bfdd0c92`

- Used for: node `id`, `webhookId`, `versionId`
- Format: 8-4-4-4-12 hexadecimal characters with hyphens

**Short ID (16 characters):** `Wvmqb0POKmqwCoKy`

- Used for: workflow `id`, tag `id`
- Format: alphanumeric (a-z, A-Z, 0-9)

**Assignment ID:** `id-1`, `id-2`, `id-3`

- Used for: Set node assignments, IF node conditions
- Format: "id-" + sequential number

## Node Creation Guidelines

### Basic Node Structure (Modern n8n Format)

```json
{
  "parameters": {},
  "id": "f8b7ff4f-6375-4c79-9b2c-9814bfdd0c92",
  "name": "Node Name",
  "type": "n8n-nodes-base.nodeName",
  "typeVersion": 2,
  "position": [1424, 496],
  "webhookId": "b5f0b784-2440-4371-bcf1-b59dd2b29e68",
  "credentials": {}
}
```

**Critical Rules:**

- `parameters` comes FIRST
- `id` must be UUID format (e.g., "f8b7ff4f-6375-4c79-9b2c-9814bfdd0c92")
- `type` must be `n8n-nodes-base.nodeName` format (NOT @n8n/n8n-nodes-\*)
- `typeVersion` must be INTEGER (e.g., 2, 3, 4) NOT float (2.1, 3.4)
- `position` must be array of integers: [x, y]
- `webhookId` required for webhook nodes (UUID format)
- Field order matters for n8n compatibility

### Node Positioning

- Start node: [250, 300]
- Horizontal spacing: 220px between nodes
- Vertical spacing: 100px for parallel branches
- Grid alignment: Snap to 20px grid for clean layout

### Common Node Types

### ⚠️ CRITICAL: Node Type Format Rules

**ALWAYS use format:** `n8n-nodes-base.nodeName`

**NEVER use these formats:**

- ❌ `@n8n/n8n-nodes-slack.slackTrigger` (wrong package format)
- ❌ `n8n-nodes-slack.slackTrigger` (missing base)
- ❌ `slackTrigger` (missing prefix)

**Correct Examples:**

- ✅ `n8n-nodes-base.webhook`
- ✅ `n8n-nodes-base.slackTrigger`
- ✅ `n8n-nodes-base.gmail`
- ✅ `n8n-nodes-base.if`

**Trigger Nodes:**

- `n8n-nodes-base.webhook` - HTTP webhook trigger
- `n8n-nodes-base.scheduleTrigger` - Cron/interval trigger
- `n8n-nodes-base.manualTrigger` - Manual execution trigger
- `n8n-nodes-base.emailTrigger` - Email trigger
- `n8n-nodes-base.slackTrigger` - Slack event trigger

**Action Nodes:**

- `n8n-nodes-base.httpRequest` - HTTP API calls
- `n8n-nodes-base.set` - Data transformation
- `n8n-nodes-base.code` - Custom JavaScript/Python code
- `n8n-nodes-base.if` - Conditional branching
- `n8n-nodes-base.merge` - Merge data from multiple branches
- `n8n-nodes-base.splitInBatches` - Process data in batches

**Integration Nodes:**

- `n8n-nodes-base.googleSheets` - Google Sheets
- `n8n-nodes-base.slack` - Slack actions
- `n8n-nodes-base.gmail` - Gmail
- `n8n-nodes-base.notion` - Notion
- `n8n-nodes-base.airtable` - Airtable
- `n8n-nodes-base.postgres` - PostgreSQL
- `n8n-nodes-base.mysql` - MySQL

## Connection Guidelines

### Connection Structure

### ⚠️ CRITICAL: Connection Format Rules

**CORRECT Format:**

```json
{
  "Source Node Name": {
    "main": [
      [
        {
          "node": "Target Node Name",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

**WRONG Formats:**

```json
// ❌ WRONG - Missing "main" wrapper
{
  "Source Node Name": [
    [
      {
        "node": "Target Node Name",
        "type": "main",
        "index": 0
      }
    ]
  ]
}

// ❌ WRONG - Direct array
{
  "Source Node Name": [[{...}]]
}
```

### Connection Rules

1. Each connection has a source node and target node
2. Connections object structure: `{"Source": {"main": [[{...}]]}}`
3. The "main" key is REQUIRED (wraps the connection array)
4. Index 0 is default output, index 1+ for conditional branches
5. IF nodes have index 0 (true) and index 1 (false)
6. Always validate that referenced node names exist

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

### Using Set Node (Modern Format - typeVersion 3+)

```json
{
  "name": "Transform Data",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3,
  "parameters": {
    "assignments": {
      "assignments": [
        {
          "id": "id-1",
          "name": "outputField",
          "value": "={{ $json.inputField }}",
          "type": "string"
        }
      ]
    },
    "includeOtherFields": true,
    "options": {}
  }
}
```

**Critical Rules for Set Node:**

- Use `assignments.assignments` structure (not `values`)
- Each assignment needs `id` field (e.g., "id-1", "id-2")
- Each assignment needs `type` field ("string", "number", "boolean")
- Include `includeOtherFields: true` to pass through other data
- Include `options: {}` for compatibility

### Using Gmail Node (typeVersion 2+)

```json
{
  "name": "Send Email",
  "type": "n8n-nodes-base.gmail",
  "typeVersion": 2,
  "parameters": {
    "sendTo": "user@example.com",
    "subject": "Email Subject",
    "message": "Email body content",
    "options": {}
  }
}
```

**Critical Rules for Gmail Node:**

- Use `message` parameter (NOT `text`)
- Use `sendTo` (NOT `to`)
- Include `options: {}` for compatibility

### Using Slack Node with Channel Selection

```json
{
  "name": "Slack Action",
  "type": "n8n-nodes-base.slack",
  "typeVersion": 2,
  "parameters": {
    "channel": {
      "__rl": true,
      "value": "general",
      "mode": "list",
      "cachedResultName": "#general"
    }
  }
}
```

**Critical Rules for Slack Channel:**

- Use `__rl: true` flag for resource locator
- Include `mode: "list"` for channel selection
- Include `cachedResultName` with # prefix

### Using IF Node (typeVersion 2+)

```json
{
  "name": "Check Condition",
  "type": "n8n-nodes-base.if",
  "typeVersion": 2,
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": false,
        "leftValue": "",
        "typeValidation": "loose"
      },
      "conditions": [
        {
          "id": "id-1",
          "leftValue": "={{ $json.field }}",
          "rightValue": "value",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    },
    "options": {}
  }
}
```

**Critical Rules for IF Node:**

- Use `conditions.conditions` structure
- Each condition needs `id` field
- Do NOT include `name` field in conditions
- Use `operator` object with `type` and `operation`
- Include `options` at root level

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

## Workflow Metadata (Modern n8n Format)

### Required Fields

```json
{
  "name": "Workflow Name",
  "nodes": [],
  "pinData": {},
  "connections": {},
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "7d745171-e378-411c-bd0a-25a8368a1cb6",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "2229c21690ffe7e7b16788a579be3103980c4445acb933f7ced2a6a17f0bd18b"
  },
  "id": "Wvmqb0POKmqwCoKy",
  "tags": [
    {
      "name": "Automation",
      "id": "7FHIZPUaIaChwuiS",
      "updatedAt": "2025-11-21T19:39:46.484Z",
      "createdAt": "2025-11-21T19:39:46.484Z"
    }
  ]
}
```

**Critical Rules:**

- `pinData` must be empty object `{}`
- `versionId` must be UUID
- `meta` object with `templateCredsSetupCompleted` and `instanceId`
- `id` must be short alphanumeric (e.g., "Wvmqb0POKmqwCoKy")
- `tags` must be array of objects (not strings) with id, name, createdAt, updatedAt

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
