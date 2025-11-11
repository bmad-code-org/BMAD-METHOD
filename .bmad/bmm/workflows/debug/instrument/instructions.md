# instrumentation-analysis

Design strategic logging and monitoring points for production debugging.

## Context

This task analyzes code to identify optimal locations for instrumentation (logging, metrics, tracing) that will aid in debugging production issues without impacting performance. It creates a comprehensive observability strategy.

## Task Execution

### Phase 1: Critical Path Analysis

#### Identify Key Flows

1. **User-Facing Paths**: Request → Response chains
2. **Business-Critical Paths**: Payment, authentication, data processing
3. **Performance-Sensitive Paths**: High-frequency operations
4. **Error-Prone Paths**: Historical problem areas
5. **Integration Points**: External service calls

#### Map Decision Points

- Conditional branches with business logic
- State transitions
- Error handling blocks
- Retry mechanisms
- Circuit breakers
- Cache hits/misses

### Phase 2: Instrumentation Strategy

#### Level 1: Essential Instrumentation

**Entry/Exit Points:**

```
- Service boundaries (API endpoints)
- Function entry/exit for critical operations
- Database transaction boundaries
- External service calls
- Message queue operations
```

**Error Conditions:**

```
- Exception catches
- Validation failures
- Timeout occurrences
- Retry attempts
- Fallback activations
```

**Performance Markers:**

```
- Operation start/end times
- Queue depths
- Resource utilization
- Batch sizes
- Cache effectiveness
```

#### Level 2: Diagnostic Instrumentation

**State Changes:**

```
- User state transitions
- Order/payment status changes
- Configuration updates
- Feature flag toggles
- Circuit breaker state changes
```

**Business Events:**

```
- User actions (login, purchase, etc.)
- System events (startup, shutdown)
- Scheduled job execution
- Data pipeline stages
- Workflow transitions
```

#### Level 3: Deep Debugging

**Detailed Tracing:**

```
- Parameter values for complex functions
- Intermediate calculation results
- Loop iteration counts
- Branch decisions
- SQL query parameters
```

### Phase 3: Implementation Patterns

#### Structured Logging Format

**Standard Fields:**

```json
{
  "timestamp": "ISO-8601",
  "level": "INFO|WARN|ERROR",
  "service": "service-name",
  "trace_id": "correlation-id",
  "span_id": "operation-id",
  "user_id": "if-applicable",
  "operation": "what-is-happening",
  "duration_ms": "for-completed-ops",
  "status": "success|failure",
  "error": "error-details-if-any",
  "metadata": {
    "custom": "fields"
  }
}
```

#### Performance-Conscious Patterns

**Sampling Strategy:**

```
- 100% for errors
- 10% for normal operations
- 1% for high-frequency paths
- Dynamic adjustment based on load
```

**Async Logging:**

```
- Buffer non-critical logs
- Batch write to reduce I/O
- Use separate thread/process
- Implement backpressure handling
```

**Conditional Logging:**

```
- Debug level only in development
- Info level in staging
- Warn/Error in production
- Dynamic level adjustment via config
```

### Phase 4: Metrics Design

#### Key Metrics to Track

**RED Metrics:**

- **Rate**: Requests per second
- **Errors**: Error rate/count
- **Duration**: Response time distribution

**USE Metrics:**

- **Utilization**: Resource usage percentage
- **Saturation**: Queue depth, wait time
- **Errors**: Resource allocation failures

**Business Metrics:**

- Transaction success rate
- Feature usage
- User journey completion
- Revenue impact

#### Metric Implementation

**Counter Examples:**

```
requests_total{method="GET", endpoint="/api/users", status="200"}
errors_total{type="database", operation="insert"}
```

**Histogram Examples:**

```
request_duration_seconds{method="GET", endpoint="/api/users"}
database_query_duration_ms{query_type="select", table="users"}
```

**Gauge Examples:**

```
active_connections{service="database"}
queue_depth{queue="email"}
```

### Phase 5: Tracing Strategy

#### Distributed Tracing Points

**Span Creation:**

```
- HTTP request handling
- Database operations
- Cache operations
- External API calls
- Message publishing/consuming
- Background job execution
```

**Context Propagation:**

```
- HTTP headers (X-Trace-Id)
- Message metadata
- Database comments
- Log correlation
```

## Output Format

````markdown
# Instrumentation Analysis Report

## Executive Summary

**Components Analyzed:** [count]
**Current Coverage:** [percentage]
**Recommended Additions:** [count]
**Performance Impact:** [minimal/low/moderate]
**Implementation Effort:** [hours/days]

## Critical Instrumentation Points

### Priority 1: Immediate Implementation

#### Service: [ServiceName]

**Entry Points:**

```[language]
// Location: [file:line]
// Current: No logging
// Recommended:
logger.info("Request received", {
  method: req.method,
  path: req.path,
  user_id: req.user?.id,
  trace_id: req.traceId
});
```
````

**Error Handling:**

```[language]
// Location: [file:line]
// Current: Silent failure
// Recommended:
logger.error("Database operation failed", {
  operation: "user_update",
  user_id: userId,
  error: err.message,
  stack: err.stack,
  retry_count: retries
});
```

**Performance Tracking:**

```[language]
// Location: [file:line]
// Recommended:
const startTime = Date.now();
try {
  const result = await expensiveOperation();
  metrics.histogram('operation_duration_ms', Date.now() - startTime, {
    operation: 'expensive_operation',
    status: 'success'
  });
  return result;
} catch (error) {
  metrics.histogram('operation_duration_ms', Date.now() - startTime, {
    operation: 'expensive_operation',
    status: 'failure'
  });
  throw error;
}
```

### Priority 2: Enhanced Observability

[Similar format for medium priority points]

### Priority 3: Deep Debugging

[Similar format for low priority points]

## Logging Strategy

### Log Levels by Environment

| Level | Development | Staging | Production |
| ----- | ----------- | ------- | ---------- |
| DEBUG | ✓           | ✓       | ✗          |
| INFO  | ✓           | ✓       | Sampled    |
| WARN  | ✓           | ✓       | ✓          |
| ERROR | ✓           | ✓       | ✓          |

### Sampling Configuration

```yaml
sampling:
  default: 0.01 # 1% sampling
  rules:
    - path: '/health'
      sample_rate: 0.001 # 0.1% for health checks
    - path: '/api/critical/*'
      sample_rate: 0.1 # 10% for critical APIs
    - level: 'ERROR'
      sample_rate: 1.0 # 100% for errors
```

## Metrics Implementation

### Application Metrics

```[language]
// Metric definitions
const metrics = {
  // Counters
  requests: new Counter('http_requests_total', ['method', 'path', 'status']),
  errors: new Counter('errors_total', ['type', 'operation']),

  // Histograms
  duration: new Histogram('request_duration_ms', ['method', 'path']),
  dbDuration: new Histogram('db_query_duration_ms', ['operation', 'table']),

  // Gauges
  connections: new Gauge('active_connections', ['type']),
  queueSize: new Gauge('queue_size', ['queue_name'])
};
```

### Dashboard Queries

```sql
-- Error rate by endpoint
SELECT
  endpoint,
  sum(errors) / sum(requests) as error_rate
FROM metrics
WHERE time > now() - 1h
GROUP BY endpoint

-- P95 latency
SELECT
  endpoint,
  percentile(duration, 0.95) as p95_latency
FROM metrics
WHERE time > now() - 1h
GROUP BY endpoint
```

## Tracing Implementation

### Trace Context

```[language]
// Trace context propagation
class TraceContext {
  constructor(traceId, spanId, parentSpanId) {
    this.traceId = traceId || generateId();
    this.spanId = spanId || generateId();
    this.parentSpanId = parentSpanId;
  }

  createChild() {
    return new TraceContext(this.traceId, generateId(), this.spanId);
  }
}

// Usage
middleware.use((req, res, next) => {
  req.trace = new TraceContext(
    req.headers['x-trace-id'],
    req.headers['x-span-id'],
    req.headers['x-parent-span-id']
  );
  next();
});
```

## Performance Considerations

### Impact Analysis

| Instrumentation Type | CPU Impact | Memory Impact | I/O Impact     |
| -------------------- | ---------- | ------------- | -------------- |
| Structured Logging   | < 1%       | < 10MB        | Async buffered |
| Metrics Collection   | < 0.5%     | < 5MB         | Batched        |
| Distributed Tracing  | < 2%       | < 20MB        | Sampled        |

### Optimization Techniques

1. Use async logging with buffers
2. Implement sampling for high-frequency paths
3. Batch metric submissions
4. Use conditional compilation for debug logs
5. Implement circuit breakers for logging systems

## Implementation Plan

### Phase 1: Week 1

- [ ] Implement critical error logging
- [ ] Add service boundary instrumentation
- [ ] Set up basic metrics

### Phase 2: Week 2

- [ ] Add performance tracking
- [ ] Implement distributed tracing
- [ ] Create initial dashboards

### Phase 3: Week 3

- [ ] Add business event tracking
- [ ] Implement sampling strategies
- [ ] Performance optimization

## Monitoring & Alerts

### Critical Alerts

```yaml
- name: high_error_rate
  condition: error_rate > 0.01
  severity: critical

- name: high_latency
  condition: p95_latency > 1000ms
  severity: warning

- name: service_down
  condition: health_check_failures > 3
  severity: critical
```

## Validation Checklist

- [ ] No sensitive data in logs
- [ ] Trace IDs properly propagated
- [ ] Sampling rates appropriate
- [ ] Performance impact acceptable
- [ ] Dashboards created
- [ ] Alerts configured
- [ ] Documentation updated

```

## Completion Criteria
- [ ] Critical paths identified
- [ ] Instrumentation points mapped
- [ ] Logging strategy defined
- [ ] Metrics designed
- [ ] Tracing plan created
- [ ] Performance impact assessed
- [ ] Implementation plan created
- [ ] Monitoring strategy defined
```
