# Infrastructure/DevOps Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for infrastructure and DevOps architecture decisions.
The LLM should:
- Understand scale, reliability, and compliance requirements
- Guide cloud vs. on-premise vs. hybrid decisions
- Focus on automation and infrastructure as code
- Consider team size and DevOps maturity
- Balance complexity with operational overhead
</critical>

## Cloud Strategy

**Platform Selection**
Based on requirements and constraints:

- **Public Cloud**: AWS, GCP, Azure for scalability
- **Private Cloud**: OpenStack, VMware for control
- **Hybrid**: Mix of public and on-premise
- **Multi-cloud**: Avoid vendor lock-in
- **On-premise**: Regulatory or latency requirements

Consider existing contracts, team expertise, and geographic needs.

## Infrastructure as Code

**IaC Approach**
Based on team and complexity:

- **Terraform**: Cloud-agnostic, declarative
- **CloudFormation/ARM/GCP Deployment Manager**: Cloud-native
- **Pulumi/CDK**: Programmatic infrastructure
- **Ansible/Chef/Puppet**: Configuration management
- **GitOps**: Flux, ArgoCD for Kubernetes

Start with declarative approaches unless programmatic benefits are clear.

## Container Strategy

**Containerization Approach**

- **Docker**: Standard for containerization
- **Kubernetes**: For complex orchestration needs
- **ECS/Cloud Run**: Managed container services
- **Docker Compose/Swarm**: Simple orchestration
- **Serverless**: Skip containers entirely

Don't use Kubernetes for simple applications - complexity has a cost.

## CI/CD Architecture

**Pipeline Design**

- Source control strategy (GitFlow, GitHub Flow, trunk-based)
- Build automation and artifact management
- Testing stages (unit, integration, e2e)
- Deployment strategies (blue-green, canary, rolling)
- Environment promotion process

Match complexity to release frequency and risk tolerance.

## Monitoring and Observability

**Observability Stack**
Based on scale and requirements:

- **Metrics**: Prometheus, CloudWatch, Datadog
- **Logging**: ELK, Loki, CloudWatch Logs
- **Tracing**: Jaeger, X-Ray, Datadog APM
- **Synthetic Monitoring**: Pingdom, New Relic
- **Incident Management**: PagerDuty, Opsgenie

Build observability appropriate to SLA requirements.

## Security Architecture

**Security Layers**

- Network security (VPC, security groups, NACLs)
- Identity and access management
- Secrets management (Vault, AWS Secrets Manager)
- Vulnerability scanning
- Compliance automation

Security must be automated and auditable.

## Backup and Disaster Recovery

**Resilience Strategy**

- Backup frequency and retention
- RTO/RPO requirements
- Multi-region/multi-AZ design
- Disaster recovery testing
- Data replication strategy

Design for your actual recovery requirements, not theoretical disasters.

## Network Architecture

**Network Design**

- VPC/network topology
- Load balancing strategy
- CDN implementation
- Service mesh (if microservices)
- Zero trust networking

Keep networking as simple as possible while meeting requirements.

## Cost Optimization

**Cost Management**

- Resource right-sizing
- Reserved instances/savings plans
- Spot instances for appropriate workloads
- Auto-scaling policies
- Cost monitoring and alerts

Build cost awareness into the architecture.

## Database Operations

**Data Layer Management**

- Managed vs. self-hosted databases
- Backup and restore procedures
- Read replica configuration
- Connection pooling
- Performance monitoring

## Service Mesh and API Gateway

**API Management** (if applicable)

- API Gateway for external APIs
- Service mesh for internal communication
- Rate limiting and throttling
- Authentication and authorization
- API versioning strategy

## Development Environments

**Environment Strategy**

- Local development setup
- Development/staging/production parity
- Environment provisioning automation
- Data anonymization for non-production

## Compliance and Governance

**Regulatory Requirements**

- Compliance frameworks (SOC 2, HIPAA, PCI DSS)
- Audit logging and retention
- Change management process
- Access control and segregation of duties

Build compliance in, don't bolt it on.

## Adaptive Guidance Examples

**For a Startup MVP:**
Focus on managed services, simple CI/CD, and basic monitoring.

**For Enterprise Migration:**
Emphasize hybrid cloud, phased migration, and compliance requirements.

**For High-Traffic Service:**
Focus on auto-scaling, CDN, caching layers, and performance monitoring.

**For Regulated Industry:**
Emphasize compliance automation, audit trails, and data residency.

## Key Principles

1. **Automate everything** - Manual processes don't scale
2. **Design for failure** - Everything fails eventually
3. **Secure by default** - Security is not optional
4. **Monitor proactively** - Don't wait for users to report issues
5. **Document as code** - Infrastructure documentation gets stale

## Output Format

Document as:

- **Platform**: [Cloud/on-premise choice]
- **IaC Tool**: [Primary infrastructure tool]
- **Container/Orchestration**: [If applicable]
- **CI/CD**: [Pipeline tools and strategy]
- **Monitoring**: [Observability stack]

Focus on automation and operational excellence.
