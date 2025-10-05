# Data/Analytics/ML Project Architecture Questions

## Project Type and Scope

1. **Primary project focus:**
   - ETL/Data Pipeline (move and transform data)
   - Data Analytics (BI, dashboards, reports)
   - Machine Learning Training (build models)
   - Machine Learning Inference (serve predictions)
   - Data Warehouse/Lake (centralized data storage)
   - Real-time Stream Processing
   - Data Science Research/Exploration
   - Multiple focuses

2. **Scale of data:**
   - Small (< 1GB, single machine)
   - Medium (1GB - 1TB, can fit in memory with careful handling)
   - Large (1TB - 100TB, distributed processing needed)
   - Very Large (> 100TB, big data infrastructure)

3. **Data velocity:**
   - Batch (hourly, daily, weekly)
   - Micro-batch (every few minutes)
   - Near real-time (seconds)
   - Real-time streaming (milliseconds)
   - Mix

## Programming Language and Environment

4. **Primary language:**
   - Python (pandas, numpy, sklearn, pytorch, tensorflow)
   - R (tidyverse, caret)
   - Scala (Spark)
   - SQL (analytics, transformations)
   - Java (enterprise data pipelines)
   - Julia
   - Multiple languages

5. **Development environment:**
   - Jupyter Notebooks (exploration)
   - Production code (scripts/applications)
   - Both (notebooks for exploration, code for production)
   - Cloud notebooks (SageMaker, Vertex AI, Databricks)

6. **Transition from notebooks to production:**
   - Convert notebooks to scripts
   - Use notebooks in production (Papermill, nbconvert)
   - Keep separate (research vs production)

## Data Sources

7. **Data source types:**
   - Relational databases (PostgreSQL, MySQL, SQL Server)
   - NoSQL databases (MongoDB, Cassandra)
   - Data warehouses (Snowflake, BigQuery, Redshift)
   - APIs (REST, GraphQL)
   - Files (CSV, JSON, Parquet, Avro)
   - Streaming sources (Kafka, Kinesis, Pub/Sub)
   - Cloud storage (S3, GCS, Azure Blob)
   - SaaS platforms (Salesforce, HubSpot, etc.)
   - Multiple sources

8. **Data ingestion frequency:**
   - One-time load
   - Scheduled batch (daily, hourly)
   - Real-time/streaming
   - On-demand
   - Mix

9. **Data ingestion tools:**
   - Custom scripts (Python, SQL)
   - Airbyte
   - Fivetran
   - Stitch
   - Apache NiFi
   - Kafka Connect
   - Cloud-native (AWS DMS, Google Datastream)
   - Multiple tools

## Data Storage

10. **Primary data storage:**
    - Data Warehouse (Snowflake, BigQuery, Redshift, Synapse)
    - Data Lake (S3, GCS, ADLS with Parquet/Avro)
    - Lakehouse (Databricks, Delta Lake, Iceberg, Hudi)
    - Relational database
    - NoSQL database
    - File system
    - Multiple storage layers

11. **Storage format (for files):**
    - Parquet (columnar, optimized)
    - Avro (row-based, schema evolution)
    - ORC (columnar, Hive)
    - CSV (simple, human-readable)
    - JSON/JSONL
    - Delta Lake format
    - Iceberg format

12. **Data partitioning strategy:**
    - By date (year/month/day)
    - By category/dimension
    - By hash
    - No partitioning (small data)

13. **Data retention policy:**
    - Keep all data forever
    - Archive old data (move to cold storage)
    - Delete after X months/years
    - Compliance-driven retention

## Data Processing and Transformation

14. **Data processing framework:**
    - pandas (single machine)
    - Dask (parallel pandas)
    - Apache Spark (distributed)
    - Polars (fast, modern dataframes)
    - SQL (warehouse-native)
    - Apache Flink (streaming)
    - dbt (SQL transformations)
    - Custom code
    - Multiple frameworks

15. **Compute platform:**
    - Local machine (development)
    - Cloud VMs (EC2, Compute Engine)
    - Serverless (AWS Lambda, Cloud Functions)
    - Managed Spark (EMR, Dataproc, Synapse)
    - Databricks
    - Snowflake (warehouse compute)
    - Kubernetes (custom containers)
    - Multiple platforms

16. **ETL tool (if applicable):**
    - dbt (SQL transformations)
    - Apache Airflow (orchestration + code)
    - Dagster (data orchestration)
    - Prefect (workflow orchestration)
    - AWS Glue
    - Azure Data Factory
    - Google Dataflow
    - Custom scripts
    - None needed

17. **Data quality checks:**
    - Great Expectations
    - dbt tests
    - Custom validation scripts
    - Soda
    - Monte Carlo
    - None (trust source data)

18. **Schema management:**
    - Schema registry (Confluent, AWS Glue)
    - Version-controlled schema files
    - Database schema versioning
    - Ad-hoc (no formal schema)

## Machine Learning (if applicable)

19. **ML framework:**
    - scikit-learn (classical ML)
    - PyTorch (deep learning)
    - TensorFlow/Keras (deep learning)
    - XGBoost/LightGBM/CatBoost (gradient boosting)
    - Hugging Face Transformers (NLP)
    - spaCy (NLP)
    - Other: **\_\_\_**
    - Not applicable

20. **ML use case:**
    - Classification
    - Regression
    - Clustering
    - Recommendation
    - NLP (text analysis, generation)
    - Computer Vision
    - Time Series Forecasting
    - Anomaly Detection
    - Other: **\_\_\_**

21. **Model training infrastructure:**
    - Local machine (GPU/CPU)
    - Cloud VMs with GPU (EC2 P/G instances, GCE A2)
    - SageMaker
    - Vertex AI
    - Azure ML
    - Databricks ML
    - Lambda Labs / Paperspace
    - On-premise cluster

22. **Experiment tracking:**
    - MLflow
    - Weights and Biases
    - Neptune.ai
    - Comet
    - TensorBoard
    - SageMaker Experiments
    - Custom logging
    - None

23. **Model registry:**
    - MLflow Model Registry
    - SageMaker Model Registry
    - Vertex AI Model Registry
    - Custom (S3/GCS with metadata)
    - None

24. **Feature store:**
    - Feast
    - Tecton
    - SageMaker Feature Store
    - Databricks Feature Store
    - Vertex AI Feature Store
    - Custom (database + cache)
    - Not needed

25. **Hyperparameter tuning:**
    - Manual tuning
    - Grid search
    - Random search
    - Optuna / Hyperopt (Bayesian optimization)
    - SageMaker/Vertex AI tuning jobs
    - Ray Tune
    - Not needed

26. **Model serving (inference):**
    - Batch inference (process large datasets)
    - Real-time API (REST/gRPC)
    - Streaming inference (Kafka, Kinesis)
    - Edge deployment (mobile, IoT)
    - Not applicable (training only)

27. **Model serving platform (if real-time):**
    - FastAPI + container (self-hosted)
    - SageMaker Endpoints
    - Vertex AI Predictions
    - Azure ML Endpoints
    - Seldon Core
    - KServe
    - TensorFlow Serving
    - TorchServe
    - BentoML
    - Other: **\_\_\_**

28. **Model monitoring (in production):**
    - Data drift detection
    - Model performance monitoring
    - Prediction logging
    - A/B testing infrastructure
    - None (not in production yet)

29. **AutoML tools:**
    - H2O AutoML
    - Auto-sklearn
    - TPOT
    - SageMaker Autopilot
    - Vertex AI AutoML
    - Azure AutoML
    - Not using AutoML

## Orchestration and Workflow

30. **Workflow orchestration:**
    - Apache Airflow
    - Prefect
    - Dagster
    - Argo Workflows
    - Kubeflow Pipelines
    - AWS Step Functions
    - Azure Data Factory
    - Google Cloud Composer
    - dbt Cloud
    - Cron jobs (simple)
    - None (manual runs)

31. **Orchestration platform:**
    - Self-hosted (VMs, K8s)
    - Managed service (MWAA, Cloud Composer, Prefect Cloud)
    - Serverless
    - Multiple platforms

32. **Job scheduling:**
    - Time-based (daily, hourly)
    - Event-driven (S3 upload, database change)
    - Manual trigger
    - Continuous (always running)

33. **Dependency management:**
    - DAG-based (upstream/downstream tasks)
    - Data-driven (task runs when data available)
    - Simple sequential
    - None (independent tasks)

## Data Analytics and Visualization

34. **BI/Visualization tool:**
    - Tableau
    - Power BI
    - Looker / Looker Studio
    - Metabase
    - Superset
    - Redash
    - Grafana
    - Custom dashboards (Plotly Dash, Streamlit)
    - Jupyter notebooks
    - None needed

35. **Reporting frequency:**
    - Real-time dashboards
    - Daily reports
    - Weekly/Monthly reports
    - Ad-hoc queries
    - Multiple frequencies

36. **Query interface:**
    - SQL (direct database queries)
    - BI tool interface
    - API (programmatic access)
    - Notebooks
    - Multiple interfaces

## Data Governance and Security

37. **Data catalog:**
    - Amundsen
    - DataHub
    - AWS Glue Data Catalog
    - Azure Purview
    - Alation
    - Collibra
    - None (small team)

38. **Data lineage tracking:**
    - Automated (DataHub, Amundsen)
    - Manual documentation
    - Not tracked

39. **Access control:**
    - Row-level security (RLS)
    - Column-level security
    - Database/warehouse roles
    - IAM policies (cloud)
    - None (internal team only)

40. **PII/Sensitive data handling:**
    - Encryption at rest
    - Encryption in transit
    - Data masking
    - Tokenization
    - Compliance requirements (GDPR, HIPAA)
    - None (no sensitive data)

41. **Data versioning:**
    - DVC (Data Version Control)
    - LakeFS
    - Delta Lake time travel
    - Git LFS (for small data)
    - Manual snapshots
    - None

## Testing and Validation

42. **Data testing:**
    - Unit tests (transformation logic)
    - Integration tests (end-to-end pipeline)
    - Data quality tests
    - Schema validation
    - Manual validation
    - None

43. **ML model testing (if applicable):**
    - Unit tests (code)
    - Model validation (held-out test set)
    - Performance benchmarks
    - Fairness/bias testing
    - A/B testing in production
    - None

## Deployment and CI/CD

44. **Deployment strategy:**
    - GitOps (version-controlled config)
    - Manual deployment
    - CI/CD pipeline (GitHub Actions, GitLab CI)
    - Platform-specific (SageMaker, Vertex AI)
    - Terraform/IaC

45. **Environment separation:**
    - Dev / Staging / Production
    - Dev / Production only
    - Single environment

46. **Containerization:**
    - Docker
    - Not containerized (native environments)

## Monitoring and Observability

47. **Pipeline monitoring:**
    - Orchestrator built-in (Airflow UI, Prefect)
    - Custom dashboards
    - Alerts on failures
    - Data quality monitoring
    - None

48. **Performance monitoring:**
    - Query performance (slow queries)
    - Job duration tracking
    - Cost monitoring (cloud spend)
    - Resource utilization
    - None

49. **Alerting:**
    - Email
    - Slack/Discord
    - PagerDuty
    - Built-in orchestrator alerts
    - None

## Cost Optimization

50. **Cost considerations:**
    - Optimize warehouse queries
    - Auto-scaling clusters
    - Spot/preemptible instances
    - Storage tiering (hot/cold)
    - Cost monitoring dashboards
    - Not a priority

## Collaboration and Documentation

51. **Team collaboration:**
    - Git for code
    - Shared notebooks (JupyterHub, Databricks)
    - Documentation wiki
    - Slack/communication tools
    - Pair programming

52. **Documentation approach:**
    - README files
    - Docstrings in code
    - Notebooks with markdown
    - Confluence/Notion
    - Data catalog (self-documenting)
    - Minimal

53. **Code review process:**
    - Pull requests (required)
    - Peer review (optional)
    - No formal review

## Performance and Scale

54. **Performance requirements:**
    - Near real-time (< 1 minute latency)
    - Batch (hours acceptable)
    - Interactive queries (< 10 seconds)
    - No specific requirements

55. **Scalability needs:**
    - Must scale to 10x data volume
    - Current scale sufficient
    - Unknown (future growth)

56. **Query optimization:**
    - Indexing
    - Partitioning
    - Materialized views
    - Query caching
    - Not needed (fast enough)
