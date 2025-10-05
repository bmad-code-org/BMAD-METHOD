# Backend/API Service Architecture Questions

## Service Type and Architecture

1. **Service architecture:**
   - Monolithic API (single service)
   - Microservices (multiple independent services)
   - Modular monolith (single deployment, modular code)
   - Serverless (AWS Lambda, Cloud Functions, etc.)
   - Hybrid

2. **API paradigm:**
   - REST
   - GraphQL
   - gRPC
   - WebSocket (real-time)
   - Server-Sent Events (SSE)
   - Message-based (event-driven)
   - Multiple paradigms

3. **Communication patterns:**
   - Synchronous (request-response)
   - Asynchronous (message queues)
   - Event-driven (pub/sub)
   - Webhooks
   - Multiple patterns

## Framework and Language

4. **Backend language/framework:**
   - Node.js (Express, Fastify, NestJS, Hono)
   - Python (FastAPI, Django, Flask)
   - Go (Gin, Echo, Chi, standard lib)
   - Java/Kotlin (Spring Boot, Micronaut, Quarkus)
   - C# (.NET Core, ASP.NET)
   - Ruby (Rails, Sinatra)
   - Rust (Axum, Actix, Rocket)
   - PHP (Laravel, Symfony)
   - Elixir (Phoenix)
   - Other: **\_\_\_**

5. **GraphQL implementation (if applicable):**
   - Apollo Server
   - GraphQL Yoga
   - Hasura (auto-generated)
   - Postgraphile
   - Custom
   - Not using GraphQL

6. **gRPC implementation (if applicable):**
   - Protocol Buffers
   - Language-specific gRPC libraries
   - Not using gRPC

## Database and Data Layer

7. **Primary database:**
   - PostgreSQL
   - MySQL/MariaDB
   - MongoDB
   - DynamoDB (AWS)
   - Firestore (Google)
   - CockroachDB
   - Cassandra
   - Redis (as primary)
   - Multiple databases (polyglot persistence)
   - Other: **\_\_\_**

8. **Database access pattern:**
   - ORM (Prisma, TypeORM, SQLAlchemy, Hibernate, etc.)
   - Query builder (Knex, Kysely, jOOQ)
   - Raw SQL
   - Database SDK (Supabase, Firebase)
   - Mix

9. **Caching layer:**
   - Redis
   - Memcached
   - In-memory (application cache)
   - CDN caching (for static responses)
   - Database query cache
   - None needed

10. **Read replicas:**
    - Yes (separate read/write databases)
    - No (single database)
    - Planned for future

11. **Database sharding:**
    - Yes (horizontal partitioning)
    - No (single database)
    - Planned for scale

## Authentication and Authorization

12. **Authentication method:**
    - JWT (stateless)
    - Session-based (stateful)
    - OAuth2 provider (Auth0, Okta, Keycloak)
    - API keys
    - Mutual TLS (mTLS)
    - Multiple methods

13. **Authorization pattern:**
    - Role-Based Access Control (RBAC)
    - Attribute-Based Access Control (ABAC)
    - Access Control Lists (ACL)
    - Custom logic
    - None (open API)

14. **Identity provider:**
    - Self-managed (own user database)
    - Auth0
    - AWS Cognito
    - Firebase Auth
    - Keycloak
    - Azure AD / Entra ID
    - Okta
    - Other: **\_\_\_**

## Message Queue and Event Streaming

15. **Message queue (if needed):**
    - RabbitMQ
    - Apache Kafka
    - AWS SQS
    - Google Pub/Sub
    - Redis (pub/sub)
    - NATS
    - None needed
    - Other: **\_\_\_**

16. **Event streaming (if needed):**
    - Apache Kafka
    - AWS Kinesis
    - Azure Event Hubs
    - Redis Streams
    - None needed

17. **Background jobs:**
    - Queue-based (Bull, Celery, Sidekiq)
    - Cron-based (node-cron, APScheduler)
    - Serverless functions (scheduled Lambda)
    - None needed

## Service Communication (Microservices)

18. **Service mesh (if microservices):**
    - Istio
    - Linkerd
    - Consul
    - None (direct communication)
    - Not applicable

19. **Service discovery:**
    - Kubernetes DNS
    - Consul
    - etcd
    - AWS Cloud Map
    - Hardcoded (for now)
    - Not applicable

20. **Inter-service communication:**
    - HTTP/REST
    - gRPC
    - Message queue
    - Event bus
    - Not applicable

## API Design and Documentation

21. **API versioning:**
    - URL versioning (/v1/, /v2/)
    - Header versioning (Accept-Version)
    - No versioning (single version)
    - Semantic versioning

22. **API documentation:**
    - OpenAPI/Swagger
    - GraphQL introspection/playground
    - Postman collections
    - Custom docs
    - README only

23. **API testing tools:**
    - Postman
    - Insomnia
    - REST Client (VS Code)
    - cURL examples
    - Multiple tools

## Rate Limiting and Throttling

24. **Rate limiting:**
    - Per-user/API key
    - Per-IP
    - Global rate limit
    - Tiered (different limits per plan)
    - None (internal API)

25. **Rate limit implementation:**
    - Application-level (middleware)
    - API Gateway
    - Redis-based
    - None

## Data Validation and Processing

26. **Request validation:**
    - Schema validation (Zod, Joi, Yup, Pydantic)
    - Manual validation
    - Framework built-in
    - None

27. **Data serialization:**
    - JSON
    - Protocol Buffers
    - MessagePack
    - XML
    - Multiple formats

28. **File uploads (if applicable):**
    - Direct to server (local storage)
    - S3/Cloud storage
    - Presigned URLs (client direct upload)
    - None needed

## Error Handling and Resilience

29. **Error handling strategy:**
    - Standard HTTP status codes
    - Custom error codes
    - RFC 7807 (Problem Details)
    - GraphQL errors
    - Mix

30. **Circuit breaker (for external services):**
    - Yes (Hystrix, Resilience4j, Polly)
    - No (direct calls)
    - Not needed

31. **Retry logic:**
    - Exponential backoff
    - Fixed retries
    - No retries
    - Library-based (axios-retry, etc.)

32. **Graceful shutdown:**
    - Yes (drain connections, finish requests)
    - No (immediate shutdown)

## Observability

33. **Logging:**
    - Structured logging (JSON)
    - Plain text logs
    - Library: (Winston, Pino, Logrus, Zap, etc.)

34. **Log aggregation:**
    - ELK Stack (Elasticsearch, Logstash, Kibana)
    - Datadog
    - Splunk
    - CloudWatch Logs
    - Loki + Grafana
    - None (local logs)

35. **Metrics and Monitoring:**
    - Prometheus
    - Datadog
    - New Relic
    - Application Insights
    - CloudWatch
    - Grafana
    - None

36. **Distributed tracing:**
    - OpenTelemetry
    - Jaeger
    - Zipkin
    - Datadog APM
    - AWS X-Ray
    - None

37. **Health checks:**
    - Liveness probe (is service up?)
    - Readiness probe (can accept traffic?)
    - Startup probe
    - Dependency checks (database, cache, etc.)
    - None

38. **Alerting:**
    - PagerDuty
    - Opsgenie
    - Slack/Discord webhooks
    - Email
    - Custom
    - None

## Security

39. **HTTPS/TLS:**
    - Required (HTTPS only)
    - Optional (support both)
    - Terminated at load balancer

40. **CORS configuration:**
    - Specific origins (whitelist)
    - All origins (open)
    - None needed (same-origin clients)

41. **Security headers:**
    - Helmet.js or equivalent
    - Custom headers
    - None (basic)

42. **Input sanitization:**
    - SQL injection prevention (parameterized queries)
    - XSS prevention
    - CSRF protection
    - All of the above

43. **Secrets management:**
    - Environment variables
    - AWS Secrets Manager
    - HashiCorp Vault
    - Azure Key Vault
    - Kubernetes Secrets
    - Doppler
    - Other: **\_\_\_**

44. **Compliance requirements:**
    - GDPR
    - HIPAA
    - SOC 2
    - PCI DSS
    - None

## Deployment and Infrastructure

45. **Deployment platform:**
    - AWS (ECS, EKS, Lambda, Elastic Beanstalk)
    - Google Cloud (GKE, Cloud Run, App Engine)
    - Azure (AKS, App Service, Container Instances)
    - Kubernetes (self-hosted)
    - Docker Swarm
    - Heroku
    - Railway
    - Fly.io
    - Vercel/Netlify (serverless)
    - VPS (DigitalOcean, Linode)
    - On-premise
    - Other: **\_\_\_**

46. **Containerization:**
    - Docker
    - Podman
    - Not containerized (direct deployment)

47. **Orchestration:**
    - Kubernetes
    - Docker Compose (dev/small scale)
    - AWS ECS
    - Nomad
    - None (single server)

48. **Infrastructure as Code:**
    - Terraform
    - CloudFormation
    - Pulumi
    - Bicep (Azure)
    - CDK (AWS)
    - Ansible
    - Manual setup

49. **Load balancing:**
    - Application Load Balancer (AWS ALB, Azure App Gateway)
    - Nginx
    - HAProxy
    - Kubernetes Ingress
    - Traefik
    - Platform-managed
    - None (single instance)

50. **Auto-scaling:**
    - Horizontal (add more instances)
    - Vertical (increase instance size)
    - Serverless (automatic)
    - None (fixed capacity)

## CI/CD

51. **CI/CD platform:**
    - GitHub Actions
    - GitLab CI
    - CircleCI
    - Jenkins
    - AWS CodePipeline
    - Azure DevOps
    - Google Cloud Build
    - Other: **\_\_\_**

52. **Deployment strategy:**
    - Rolling deployment
    - Blue-green deployment
    - Canary deployment
    - Recreate (downtime)
    - Serverless (automatic)

53. **Testing in CI/CD:**
    - Unit tests
    - Integration tests
    - E2E tests
    - Load tests
    - Security scans
    - All of the above

## Performance

54. **Performance requirements:**
    - High throughput (1000+ req/s)
    - Moderate (100-1000 req/s)
    - Low (< 100 req/s)

55. **Latency requirements:**
    - Ultra-low (< 10ms)
    - Low (< 100ms)
    - Moderate (< 500ms)
    - No specific requirement

56. **Connection pooling:**
    - Database connection pool
    - HTTP connection pool (for external APIs)
    - None needed

57. **CDN (for static assets):**
    - CloudFront
    - Cloudflare
    - Fastly
    - None (dynamic only)

## Data and Storage

58. **File storage (if needed):**
    - AWS S3
    - Google Cloud Storage
    - Azure Blob Storage
    - MinIO (self-hosted)
    - Local filesystem
    - None needed

59. **Search functionality:**
    - Elasticsearch
    - Algolia
    - Meilisearch
    - Typesense
    - Database full-text search
    - None needed

60. **Data backup:**
    - Automated database backups
    - Point-in-time recovery
    - Manual backups
    - Cloud-provider managed
    - None (dev/test only)

## Additional Features

61. **Webhooks (outgoing):**
    - Yes (notify external systems)
    - No

62. **Scheduled tasks/Cron jobs:**
    - Yes (cleanup, reports, etc.)
    - No

63. **Multi-tenancy:**
    - Single tenant
    - Multi-tenant (shared database)
    - Multi-tenant (separate databases)
    - Not applicable

64. **Internationalization (i18n):**
    - Multiple languages/locales
    - English only
    - Not applicable

65. **Audit logging:**
    - Track all changes (who, what, when)
    - Critical operations only
    - None
