# Data Pipeline/Analytics Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for data pipeline and analytics architecture decisions.
The LLM should:
- Understand data volume, velocity, and variety from requirements
- Guide tool selection based on scale and latency needs
- Consider data governance and quality requirements
- Balance batch vs. stream processing needs
- Focus on maintainability and observability
</critical>

## Processing Architecture

**Batch vs. Stream vs. Hybrid**
Based on requirements:

- **Batch**: For periodic processing, large volumes, complex transformations
- **Stream**: For real-time requirements, event-driven, continuous processing
- **Lambda Architecture**: Both batch and stream for different use cases
- **Kappa Architecture**: Stream-only with replay capability

Don't use streaming for daily reports, or batch for real-time alerts.

## Technology Stack

**Choose Based on Scale and Complexity**

- **Small Scale**: Python scripts, Pandas, PostgreSQL
- **Medium Scale**: Airflow, Spark, Redshift/BigQuery
- **Large Scale**: Databricks, Snowflake, custom Kubernetes
- **Real-time**: Kafka, Flink, ClickHouse, Druid

Start simple and evolve - don't build for imaginary scale.

## Orchestration Platform

**Workflow Management**
Based on complexity:

- **Simple**: Cron jobs, Python scripts
- **Medium**: Apache Airflow, Prefect, Dagster
- **Complex**: Kubernetes Jobs, Argo Workflows
- **Managed**: Cloud Composer, AWS Step Functions

Consider team expertise and operational overhead.

## Data Storage Architecture

**Storage Layer Design**

- **Data Lake**: Raw data in object storage (S3, GCS)
- **Data Warehouse**: Structured, optimized for analytics
- **Data Lakehouse**: Hybrid approach (Delta Lake, Iceberg)
- **Operational Store**: For serving layer

**File Formats**

- Parquet for columnar analytics
- Avro for row-based streaming
- JSON for flexibility
- CSV for simplicity

## ETL/ELT Strategy

**Transformation Approach**

- **ETL**: Transform before loading (traditional)
- **ELT**: Transform in warehouse (modern, scalable)
- **Streaming ETL**: Continuous transformation

Consider compute costs and transformation complexity.

## Data Quality Framework

**Quality Assurance**

- Schema validation
- Data profiling and anomaly detection
- Completeness and freshness checks
- Lineage tracking
- Quality metrics and monitoring

Build quality checks appropriate to data criticality.

## Schema Management

**Schema Evolution**

- Schema registry for streaming
- Version control for schemas
- Backward compatibility strategy
- Schema inference vs. strict schemas

## Processing Frameworks

**Computation Engines**

- **Spark**: General-purpose, batch and stream
- **Flink**: Low-latency streaming
- **Beam**: Portable, multi-runtime
- **Pandas/Polars**: Small-scale, in-memory
- **DuckDB**: Local analytical processing

Match framework to processing patterns.

## Data Modeling

**Analytical Modeling**

- Star schema for BI tools
- Data vault for flexibility
- Wide tables for performance
- Time-series modeling for metrics

Consider query patterns and tool requirements.

## Monitoring and Observability

**Pipeline Monitoring**

- Job success/failure tracking
- Data quality metrics
- Processing time and throughput
- Cost monitoring
- Alerting strategy

## Security and Governance

**Data Governance**

- Access control and permissions
- Data encryption at rest and transit
- PII handling and masking
- Audit logging
- Compliance requirements (GDPR, HIPAA)

Scale governance to regulatory requirements.

## Development Practices

**DataOps Approach**

- Version control for code and configs
- Testing strategy (unit, integration, data)
- CI/CD for pipelines
- Environment management
- Documentation standards

## Serving Layer

**Data Consumption**

- BI tool integration
- API for programmatic access
- Export capabilities
- Caching strategy
- Query optimization

## Adaptive Guidance Examples

**For Real-time Analytics:**
Focus on streaming infrastructure, low-latency storage, and real-time dashboards.

**For ML Feature Store:**
Emphasize feature computation, versioning, serving latency, and training/serving skew.

**For Business Intelligence:**
Focus on dimensional modeling, semantic layer, and self-service analytics.

**For Log Analytics:**
Emphasize ingestion scale, retention policies, and search capabilities.

## Key Principles

1. **Start with the end in mind** - Know how data will be consumed
2. **Design for failure** - Pipelines will break, plan recovery
3. **Monitor everything** - You can't fix what you can't see
4. **Version and test** - Data pipelines are code
5. **Keep it simple** - Complexity kills maintainability

## Output Format

Document as:

- **Processing**: [Batch/Stream/Hybrid approach]
- **Stack**: [Core technologies with versions]
- **Storage**: [Lake/Warehouse strategy]
- **Orchestration**: [Workflow platform]

Focus on data flow and transformation logic.
