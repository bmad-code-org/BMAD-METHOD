# Investment Product Engine - Product Requirements Document (PRD)

**Version:** 1.0
**Date:** October 24, 2025
**Product:** Investment Product Engine for Aura Platform
**Document Owner:** Product Manager

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-24 | 1.0 | Initial PRD creation | PM Team |

---

## 1. Goals and Background Context

### 1.1 Goals

- Build a scalable Investment Product Engine that supports multiple fixed-yield crypto investment products
- Enable automated NAV (Net Asset Value) calculation and shareholding management for all investment products
- Provide seamless integration between Aura mobile app, Hex Safe custody, and trading venues (CEX/DEX)
- Support subscription and redemption flows with proper risk segregation per product
- Enable traders to efficiently manage capital across multiple exchanges and venues
- Provide real-time visibility into product performance, client holdings, and fund movements
- Ensure institutional-grade security, auditability, and compliance with proper segregation of client funds

### 1.2 Background Context

Aura is launching a suite of "Earn" products targeting High-Net-Worth Individuals (HNWI) and Family Offices. These products offer fixed-yield returns on crypto assets over fixed terms (3, 6, 9, 12 months). The current draft specification outlines the basic concept of Risk Units, NAV calculation, and fund flows, but lacks the detailed functional requirements, error handling, integration specifications, and operational workflows needed for production implementation.

The Investment Product Engine will serve as the core backend infrastructure that:
- Manages the lifecycle of multiple investment products simultaneously
- Handles client subscriptions and redemptions through the Aura mobile app
- Integrates with Hex Safe custody platform for secure asset storage
- Connects to multiple trading venues (Binance, OKX, etc.) for capital deployment
- Calculates daily NAV and client shareholdings at a specified cutoff time
- Provides operational dashboards for traders, relationship managers, and operations teams

---

## 2. Requirements

### 2.1 Functional Requirements

#### Product & Risk Unit Management

**FR1:** The system shall support the creation and management of multiple investment products, each represented as an independent Risk Unit.

**FR2:** Each Risk Unit shall include:
- Staging blockchain vaults (for client deposits before cutoff)
- Investment Product blockchain vaults (assets contributing to NAV)
- Dedicated sub-accounts on each connected exchange
- Metadata including product name, asset type, terms, APY, risk rating

**FR3:** The system shall enforce strict segregation - no commingling of funds between different investment products' Risk Units.

**FR4:** Each investment product shall support configuration of:
- Asset type (BTC, ETH, USDT, SOL, etc.)
- Fixed terms offered (3, 6, 9, 12 months)
- Fixed APY per term
- Early exit penalty formula
- Daily cutoff time (e.g., 16:00 HKT)
- Minimum subscription amount
- Maximum capacity (optional)

**FR5:** The system shall support product lifecycle states: Draft, Active, Suspended, Closed, Liquidating.

**FR6:** The system shall prevent new subscriptions when a product is in Suspended, Closed, or Liquidating states.

#### Subscription Flow

**FR7:** When a client initiates a subscription via Aura app, the system shall:
- Generate a unique deposit address from the product's Staging Vault
- Display deposit instructions (address, network, minimum amount)
- Return expected arrival time based on blockchain network

**FR8:** The system shall monitor all Staging Vault addresses for incoming deposits continuously.

**FR9:** Upon detecting a deposit transaction with sufficient confirmations, the system shall:
- Record the deposit amount, timestamp, and blockchain transaction ID
- Associate the deposit with the client's account
- Mark the deposit as "Pending NAV Entry" until next cutoff time
- Send notification to client confirming deposit received

**FR10:** The system shall validate that deposits meet the minimum subscription amount before processing.

**FR11:** The system shall handle multi-network deposits (e.g., USDT on Ethereum, Tron, Arbitrum) by mapping to the correct product asset.

**FR12:** At the daily cutoff time, the system shall:
- Aggregate all pending deposits in Staging Vaults
- Calculate the market value of each deposit at cutoff time
- Include these values in the NAV calculation
- Update client shareholdings based on new deposits
- Automatically sweep funds from Staging Vaults to Investment Product Vaults

**FR13:** The system shall maintain a subscription record for each client including:
- Product name and ID
- Subscribed amount and asset
- Subscription date and cutoff timestamp
- Initial share allocation
- Selected term duration
- Term maturity date
- Status (Active, Matured, Redeemed Early)

#### NAV Calculation

**FR14:** The system shall calculate NAV once per day at the configured cutoff time for each product.

**FR15:** NAV calculation shall include the sum of:
- All balances in Investment Product blockchain vaults
- All balances in exchange sub-accounts belonging to the Risk Unit
- All open lending positions (if applicable)
- Any other deployed assets belonging to the Risk Unit
- New deposits since previous cutoff (from Staging Vaults at current market prices)

**FR16:** The system shall exclude Staging Vault balances from NAV except during cutoff processing.

**FR17:** The system shall fetch real-time market prices from multiple price oracles and use a median price for NAV calculation.

**FR18:** If price data is unavailable for any asset, the system shall:
- Use the last known valid price with a timestamp warning
- Flag the NAV calculation as "Stale Data"
- Alert the operations team
- Retry price fetch up to 3 times before using fallback

**FR19:** The system shall store historical NAV records with:
- Product ID
- NAV timestamp
- Total NAV value (in USD equivalent)
- Component breakdown (vault balances, exchange balances, etc.)
- Price sources used
- Any warnings or anomalies

**FR20:** The system shall calculate daily NAV change and performance metrics (daily return %, cumulative return since inception).

**FR21:** If NAV calculation fails, the system shall:
- Retain the previous day's NAV
- Log the failure reason
- Alert operations team immediately
- Prevent any redemptions until NAV is successfully calculated

#### Shareholding Calculation

**FR22:** The system shall calculate client shareholdings once per day at cutoff time, after NAV calculation completes.

**FR23:** Shareholding calculation shall account for:
- Previous shareholding percentages
- New subscriptions since last cutoff (priced at cutoff time)
- Redemptions since last cutoff (priced at redemption time)

**FR24:** For new subscriptions, the system shall calculate share allocation as:
```
Client New Shares = (Deposit Value at Cutoff) / (NAV at Cutoff)
Client New Ownership % = Client New Shares / Total Shares
```

**FR25:** The system shall maintain a shareholding ledger per product showing:
- Client ID
- Total shares owned
- Ownership percentage
- Last updated timestamp
- Historical changes

**FR26:** The system shall ensure that the sum of all client ownership percentages equals 100% (within 0.001% tolerance for rounding).

**FR27:** If shareholding calculation fails validation, the system shall:
- Roll back to previous shareholding state
- Log the discrepancy
- Alert operations team
- Halt all subscription/redemption processing until resolved

#### Redemption Flow

**FR28:** When a client requests redemption via Aura app, the system shall:
- Validate that the client has an active subscription in the product
- Calculate the redemption value based on:
  - Client's current ownership percentage
  - Current NAV at time of redemption request
  - Early exit penalty (if before term maturity)
- Display redemption amount and penalty (if applicable) for client confirmation

**FR29:** The system shall support two redemption types:
- Full redemption (100% of client's holdings)
- Partial redemption (specified percentage or amount)

**FR30:** Upon client confirmation, the system shall:
- Create a redemption request record with status "Pending Approval"
- Notify the assigned Relationship Manager via integrated CRM
- Lock the client's shares to prevent further transactions
- Send notification to client confirming request received

**FR31:** The Relationship Manager shall be able to:
- View pending redemption requests
- Approve or reject redemption requests
- Add notes explaining rejection reasons

**FR32:** Upon RM approval, the system shall:
- Notify the trader team that assets need to be made available
- Calculate exact redemption amount in the product's redemption asset
- Update the redemption request status to "Approved - Awaiting Settlement"

**FR33:** Traders shall be able to:
- View approved redemptions requiring settlement
- Execute trades if needed to obtain redemption assets
- Transfer redemption assets from exchanges to Investment Vaults
- Transfer redemption assets from Investment Vaults to Staging Vaults
- Mark assets as ready for client payout

**FR34:** Once assets are in Staging Vaults and marked ready, the system shall:
- Automatically initiate blockchain transfer to client's withdrawal address
- Update redemption status to "In Transit"
- Deduct the redeemed shares from client's shareholding
- Update product NAV (if not yet at next cutoff)
- Send transaction ID and completion notification to client

**FR35:** The system shall enforce that actual client payout occurs within 36 hours of RM approval.

**FR36:** If payout exceeds 36 hours, the system shall:
- Escalate alert to operations manager
- Display warning in trader dashboard
- Log the delay for audit purposes

**FR37:** Early redemption penalty shall be calculated as:
```
Penalty = Principal × Penalty Rate × (Remaining Days / Total Term Days)
```
Where Penalty Rate is configured per product and term.

**FR38:** The system shall maintain a redemption history for each client including:
- Redemption request timestamp
- Approval timestamp
- Settlement timestamp
- Redeemed amount
- Penalty amount (if any)
- Final payout amount
- Status transitions

#### Fund Movement & Trader Operations

**FR39:** Traders shall be able to transfer funds between accounts within a Risk Unit:
- Investment Vault → Exchange Sub-account
- Exchange Sub-account A → Investment Vault → Exchange Sub-account B
- Exchange Sub-account → Investment Vault

**FR40:** All inter-exchange transfers shall route through the Investment Vault (travel rule compliance).

**FR41:** The system shall maintain a whitelist of approved addresses for each Risk Unit, restricted to:
- Investment Vault addresses
- Exchange sub-account deposit addresses
- Emergency backup addresses (requires multi-sig approval)

**FR42:** Any transfer request to a non-whitelisted address shall be rejected with an alert.

**FR43:** The system shall provide a playback/retry mechanism if a sub-transaction fails during a multi-step transfer.

**FR44:** Traders shall be able to view real-time balances across all venues for each Risk Unit in a unified dashboard.

**FR45:** The system shall detect and alert on balance discrepancies between expected and actual balances.

**FR46:** All fund movements shall be logged with:
- Timestamp
- Trader initiating the transfer
- Source account
- Destination account
- Asset and amount
- Transaction ID (blockchain or exchange)
- Status (Pending, Confirmed, Failed)

#### Integration Requirements

**FR47:** The system shall integrate with Hex Safe custody platform to:
- Create new vault addresses programmatically
- Query vault balances in real-time
- Initiate withdrawal transactions with appropriate approval workflows
- Receive webhook notifications on incoming deposits
- Retrieve transaction history

**FR48:** The system shall integrate with HollaEx platform to:
- Sync user accounts between Aura app and Investment Engine
- Receive subscription/redemption requests from mobile app
- Push NAV and shareholding updates to display in user portfolio
- Send notifications to users (deposit confirmed, redemption processed, etc.)

**FR49:** The system shall integrate with multiple exchange APIs (Binance, OKX, etc.) to:
- Create and manage sub-accounts per product
- Query sub-account balances
- Execute trades on behalf of products
- Transfer funds between sub-accounts and master account
- Retrieve trade history and transaction logs

**FR50:** The system shall integrate with CRM (HubSpot) to:
- Notify Relationship Managers of redemption requests
- Sync client metadata (tier, assigned RM, AUM)
- Log all RM interactions and approvals
- Generate reports for RM dashboards

**FR51:** The system shall integrate with price oracle services (Chainlink, Pyth, etc.) for reliable price feeds.

**FR52:** The system shall expose REST APIs for:
- Querying product information
- Viewing NAV history
- Checking client shareholdings
- Retrieving subscription/redemption status
- Generating reports

**FR53:** The system shall provide webhooks for critical events:
- NAV calculation completed
- Large deposit detected
- Redemption approved
- Transfer failed
- System error or anomaly

#### Notifications & Alerts

**FR54:** The system shall send push notifications to clients via Aura app for:
- Deposit confirmed
- Subscription processed (shares allocated)
- Term maturity approaching (7 days before)
- Term matured, yield paid out
- Redemption request received
- Redemption processed, funds sent
- Failed transaction

**FR55:** The system shall send email notifications to Relationship Managers for:
- New redemption request pending approval
- Redemption approval deadline approaching (24 hours)
- Client inquiry via in-app chat

**FR56:** The system shall send alerts to operations team for:
- NAV calculation failure
- Shareholding validation failure
- Balance discrepancy detected
- Price feed unavailable
- Redemption payout delayed beyond 36 hours
- System health check failure

**FR57:** The system shall send alerts to traders for:
- Approved redemption requiring settlement
- Low liquidity warning for a product
- Large deposit requiring capital deployment

#### Reporting & Dashboards

**FR58:** The system shall provide an Operations Dashboard displaying:
- All products with current NAV and daily performance
- Total AUM across all products
- Pending subscriptions and redemptions count
- System health status
- Recent alerts and errors

**FR59:** The system shall provide a Trader Dashboard displaying:
- Per-product view of all account balances (vaults + exchanges)
- Pending fund movements
- Approved redemptions requiring settlement
- Trading activity logs
- P&L per product

**FR60:** The system shall provide a Relationship Manager Dashboard displaying:
- Clients assigned to the RM
- Pending redemption approvals
- Client portfolio summaries
- Recent client activity

**FR61:** The system shall generate daily reconciliation reports including:
- NAV calculation details per product
- Shareholding summary per product
- All deposits and redemptions processed
- Fund movements across all venues
- Discrepancies or anomalies detected

**FR62:** The system shall generate monthly performance reports per product including:
- Month-end NAV
- Total subscriptions and redemptions
- Net inflows/outflows
- Monthly return %
- Number of active clients
- Top 10 clients by holdings

**FR63:** The system shall generate audit trail reports for compliance including:
- All transactions with timestamps and initiators
- Approval workflows and decisions
- System access logs
- Configuration changes

#### Product Yield & Fee Management

**FR64:** The system shall track yield accrual for each client subscription based on:
- Subscribed amount
- Fixed APY for selected term
- Days elapsed since subscription

**FR65:** At term maturity, the system shall:
- Calculate final yield amount
- Transfer principal + yield from Investment Vault to client's Aura wallet
- Update subscription status to "Matured"
- Send notification to client

**FR66:** The system shall support fee configuration per product:
- Management fee (% of AUM, deducted from NAV)
- Performance fee (% of returns above benchmark)
- Redemption fee (flat % on redemption amount)
- Early exit penalty (configured per product)

**FR67:** The system shall calculate and deduct fees during NAV calculation or redemption processing as configured.

**FR68:** The system shall track fee revenue separately per product and generate fee revenue reports.

#### Risk & Compliance

**FR69:** The system shall enforce transaction limits per client tier:
- Minimum subscription amounts
- Maximum single redemption amounts
- Daily redemption limits

**FR70:** The system shall flag and require additional approval for:
- Subscriptions exceeding $1M USD equivalent
- Redemptions exceeding $500K USD equivalent
- Multiple rapid subscriptions/redemptions from same client

**FR71:** The system shall maintain an immutable audit log of all state changes and transactions.

**FR72:** The system shall support role-based access control (RBAC) with roles:
- Admin (full access)
- Trader (fund movements, trade execution)
- Operations (view all, reconciliation)
- Relationship Manager (client interactions, redemption approvals)
- Compliance (audit logs, reports)
- Read-only (view dashboards and reports)

**FR73:** The system shall encrypt all sensitive data at rest and in transit.

**FR74:** The system shall support multi-signature approval for critical operations:
- Product creation/deletion
- Whitelist address additions
- Large fund movements (above configured threshold)
- System configuration changes

**FR75:** The system shall integrate with KYC/AML provider (Sumsub) to verify client identity before allowing subscriptions.

### 2.2 Non-Functional Requirements

**NFR1:** The system shall achieve 99.9% uptime (measured monthly), excluding scheduled maintenance windows.

**NFR2:** NAV calculation shall complete within 5 minutes for products with up to 1,000 clients.

**NFR3:** API response time shall be < 500ms for 95% of read requests and < 2 seconds for write requests.

**NFR4:** The system shall support horizontal scaling to handle growth from 650 clients to 10,000 clients without architecture changes.

**NFR5:** The system shall handle up to 100 concurrent subscriptions and 50 concurrent redemptions without degradation.

**NFR6:** All blockchain transaction monitoring shall detect new deposits within 2 minutes of reaching required confirmations.

**NFR7:** The system shall implement automated failover for critical services with RPO (Recovery Point Objective) < 5 minutes.

**NFR8:** The system shall perform daily automated backups of all databases with retention for 90 days.

**NFR9:** All API endpoints shall implement rate limiting (100 requests/minute per user) to prevent abuse.

**NFR10:** The system shall log all transactions and state changes with structured logging for observability.

**NFR11:** The system shall implement distributed tracing for debugging complex multi-service flows.

**NFR12:** The system shall support disaster recovery with RTO (Recovery Time Objective) < 4 hours.

**NFR13:** All financial calculations shall use decimal arithmetic (not floating point) to prevent rounding errors.

**NFR14:** The system shall maintain data consistency using database transactions and idempotent operations.

**NFR15:** The system shall implement circuit breakers for external service calls (exchanges, price oracles) to prevent cascading failures.

**NFR16:** All external API integrations shall include retry logic with exponential backoff.

**NFR17:** The system shall monitor and alert on key metrics: API latency, error rates, NAV calculation duration, fund movement success rate.

**NFR18:** The system shall be deployable via infrastructure-as-code (Terraform, Kubernetes) for reproducible environments.

**NFR19:** All code shall be version controlled with Git and follow a CI/CD pipeline including automated testing.

**NFR20:** The system shall support multi-timezone operations with all timestamps stored in UTC and converted for display.

---

## 3. User Interface Design Goals

### 3.1 Overall UX Vision

The Investment Product Engine does not have a direct user-facing UI for end clients (clients interact via Aura mobile app). However, it provides web-based dashboards for internal users (traders, operations, RMs). The UX vision for these dashboards is:

- **Clarity & Efficiency:** Present complex financial data in clear, scannable layouts that support rapid decision-making
- **Real-time Visibility:** Live updates of critical metrics without requiring manual refresh
- **Action-Oriented:** Prominent calls-to-action for pending tasks (approve redemption, settle funds)
- **Trust & Accuracy:** Display data provenance (timestamps, data sources) to build confidence in the numbers
- **Responsive Design:** Support desktop and tablet usage for on-the-go operations

### 3.2 Key Interaction Paradigms

- **Dashboard-First:** Users land on a role-specific dashboard showing the most relevant information
- **Drill-Down Navigation:** From high-level summaries, users can drill into product details, then client details, then transaction history
- **Contextual Actions:** Actions are available contextually (e.g., "Approve Redemption" button appears on pending redemption details)
- **Search & Filter:** All lists (products, clients, transactions) support search and filtering
- **Real-time Updates:** Critical metrics update via WebSocket for live dashboards

### 3.3 Core Screens and Views

1. **Operations Dashboard** - Overview of all products, NAV, AUM, alerts
2. **Product Detail View** - Deep dive into a single product: balances, NAV chart, client list
3. **Trader Dashboard** - Fund management view with all account balances and pending settlements
4. **Redemption Approval Queue** - List of pending redemptions for RM review
5. **Transaction History** - Searchable log of all deposits, redemptions, fund movements
6. **Client Portfolio View** - Individual client's holdings across all products
7. **Reconciliation Report** - Daily report view with discrepancy highlights
8. **System Health & Monitoring** - Service status, API health, recent errors

### 3.4 Accessibility

- **WCAG AA Compliance:** All dashboards shall meet WCAG 2.1 Level AA standards
- **Keyboard Navigation:** Full functionality accessible via keyboard
- **Screen Reader Support:** Proper semantic HTML and ARIA labels for key elements

### 3.5 Branding

- Dashboards shall use Aura's color palette (primary blues, accent golds) for consistency
- Financial data shall use standard color conventions (green for positive, red for negative, amber for warnings)
- Aura logo and "Powered by Hex Trust" co-branding in dashboard header

### 3.6 Target Device and Platforms

- **Primary:** Desktop web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Secondary:** Tablet (iPad, Android tablets) in landscape orientation
- **Not Supported:** Mobile phones (screen too small for complex financial dashboards)

---

## 4. Technical Assumptions

### 4.1 Repository Structure

**Monorepo:** The Investment Product Engine shall be developed as a monorepo containing multiple services/packages:
- `/services/api` - Main REST API service
- `/services/nav-calculator` - NAV calculation service (scheduled job)
- `/services/blockchain-monitor` - Monitors blockchain deposits
- `/services/notification` - Handles all notifications and alerts
- `/packages/shared` - Shared types, utilities, database models
- `/packages/integrations` - Integration clients (Hex Safe, HollaEx, exchanges)
- `/dashboards/web` - Web dashboard frontend

**Rationale:** Monorepo simplifies dependency management and enables atomic changes across services while maintaining clear service boundaries.

### 4.2 Service Architecture

**Architecture:** Microservices within a Monorepo

The system shall be composed of loosely-coupled services:
- **API Service:** Exposes REST APIs for dashboards and Aura app integration
- **NAV Calculator Service:** Scheduled service that runs NAV calculation at cutoff time
- **Blockchain Monitor Service:** Continuously monitors blockchain networks for deposits
- **Notification Service:** Handles all outbound notifications (push, email, webhooks)
- **Fund Movement Service:** Orchestrates multi-step fund transfers
- **Reporting Service:** Generates reports and exports

Services communicate via:
- **Message Queue (RabbitMQ or AWS SQS):** For asynchronous tasks (e.g., trigger NAV calculation)
- **Shared Database (PostgreSQL):** For transactional consistency (with service-specific schemas)
- **REST APIs:** For synchronous inter-service calls where needed

**Rationale:** Microservices architecture allows independent scaling and deployment of compute-intensive services (NAV calculator, blockchain monitor) while maintaining data consistency via shared database.

### 4.3 Technology Stack

**Backend:**
- **Language:** Node.js (TypeScript) - aligns with existing HollaEx stack
- **Framework:** NestJS - provides structure, dependency injection, built-in support for microservices
- **Database:** PostgreSQL 14+ - ACID compliance, complex queries, JSON support
- **Caching:** Redis - for session management, rate limiting, real-time data
- **Message Queue:** RabbitMQ - reliable message delivery for async tasks
- **ORM:** TypeORM - TypeScript-native ORM with migrations support

**Frontend (Dashboards):**
- **Framework:** React 18+ with TypeScript
- **State Management:** Redux Toolkit or Zustand
- **UI Library:** Material-UI (MUI) or Ant Design - for rapid dashboard development
- **Data Visualization:** Recharts or Chart.js - for NAV charts, performance graphs
- **Real-time Updates:** WebSocket (Socket.io)

**Blockchain Interaction:**
- **Libraries:** ethers.js (Ethereum/EVM chains), @solana/web3.js (Solana), tronweb (Tron)
- **Node Providers:** Infura, Alchemy, QuickNode - for reliable blockchain RPC access

**External Integrations:**
- **Hex Safe SDK:** Provided by Hex Safe for custody integration
- **HollaEx API:** REST API client for HollaEx platform
- **Exchange APIs:** CCXT library for unified exchange API access (Binance, OKX, etc.)
- **Price Oracles:** Chainlink (on-chain), CoinGecko/CoinMarketCap APIs (off-chain)

**DevOps:**
- **Containerization:** Docker with docker-compose for local development
- **Orchestration:** Kubernetes (EKS on AWS) for production
- **CI/CD:** GitHub Actions for automated testing and deployment
- **Infrastructure as Code:** Terraform for AWS resource provisioning
- **Monitoring:** Datadog or Prometheus + Grafana for metrics, Sentry for error tracking
- **Logging:** ELK stack (Elasticsearch, Logstash, Kibana) or AWS CloudWatch

**Rationale:** Node.js/TypeScript aligns with HollaEx platform stack, enabling code sharing and team skillset overlap. PostgreSQL provides the reliability and consistency needed for financial data. Kubernetes enables scalable, resilient deployments.

### 4.4 Testing Requirements

**Testing Pyramid:**
- **Unit Tests:** 80%+ code coverage for business logic (NAV calculation, shareholding math, fee calculations)
- **Integration Tests:** Test interactions with databases, message queues, and external APIs (mocked)
- **End-to-End Tests:** Automated tests for critical user flows (subscription flow, redemption flow, NAV calculation)
- **Load Tests:** Simulate 1000 concurrent users and 10,000 subscriptions to validate performance
- **Security Tests:** Penetration testing and vulnerability scanning before production

**Testing Tools:**
- **Unit/Integration:** Jest (JavaScript/TypeScript testing framework)
- **E2E:** Playwright or Cypress for frontend, Supertest for API testing
- **Load Testing:** k6 or Artillery
- **Security:** OWASP ZAP, Snyk for dependency scanning

**Rationale:** Comprehensive testing is critical for a financial system handling client assets. Unit tests catch bugs early, integration tests validate service interactions, and E2E tests ensure user flows work correctly.

### 4.5 Additional Technical Assumptions and Requests

- **Decimal Precision:** All financial calculations shall use a decimal library (e.g., decimal.js or big.js) to avoid floating-point errors. Monetary values stored as integers in smallest unit (e.g., satoshis for BTC, wei for ETH) where appropriate.

- **Idempotency:** All API endpoints that perform state changes (subscribe, redeem, transfer) shall be idempotent using idempotency keys to prevent duplicate operations.

- **Database Migrations:** All database schema changes shall be versioned and deployed via migrations (TypeORM migrations or Flyway).

- **Environment Configuration:** All environment-specific configuration (API keys, endpoints) shall be managed via environment variables, never hardcoded.

- **Secrets Management:** Sensitive credentials (API keys, private keys) shall be stored in AWS Secrets Manager or HashiCorp Vault, not in code or environment files.

- **Multi-Signature Wallets:** Investment Vaults on Hex Safe shall use multi-signature (2-of-3 or 3-of-5) requiring approval from multiple key holders for withdrawals.

- **Rate Limiting:** All external API calls (exchanges, price oracles) shall implement rate limiting to stay within provider limits and implement exponential backoff on rate limit errors.

- **Graceful Degradation:** If a non-critical external service is unavailable (e.g., price oracle), the system shall degrade gracefully (use fallback prices) rather than crash.

- **Time Zone Handling:** All cutoff times and schedules shall account for daylight saving time changes and be configurable per product.

- **Data Retention:** Transaction and audit logs shall be retained for 7 years to meet regulatory requirements.

---

## 5. Epic List

### Epic 1: Foundation & Core Infrastructure
**Goal:** Establish the project foundation with repository setup, database schema, core services scaffolding, and CI/CD pipeline. Deliver a health-check endpoint to validate deployment.

### Epic 2: Product & Risk Unit Management
**Goal:** Enable operations team to create and configure investment products (Risk Units) with proper metadata, lifecycle states, and configuration options (APY, terms, cutoff time).

### Epic 3: Hex Safe & Blockchain Integration
**Goal:** Integrate with Hex Safe custody platform to create vaults, monitor blockchain deposits, and execute withdrawal transactions for all supported networks.

### Epic 4: Subscription Flow & Fund Ingestion
**Goal:** Enable clients to subscribe to products via Aura app, monitor deposits on staging vaults, and process subscriptions at daily cutoff time with fund sweeping to investment vaults.

### Epic 5: NAV Calculation Engine
**Goal:** Build the daily NAV calculation engine that aggregates balances across vaults and exchanges, fetches prices from oracles, and stores historical NAV records with error handling.

### Epic 6: Shareholding Management
**Goal:** Calculate and maintain client shareholdings based on subscriptions, redemptions, and NAV changes, ensuring accurate ownership percentages with validation.

### Epic 7: Exchange Integration & Trader Operations
**Goal:** Integrate with multiple exchanges to create sub-accounts, query balances, execute trades, and enable traders to move funds within a Risk Unit via a unified dashboard.

### Epic 8: Redemption Flow & Settlement
**Goal:** Enable clients to request redemptions (full or partial) with early exit penalty calculations, RM approval workflow, trader settlement, and automated payout to client wallets.

### Epic 9: Notifications & Alerting System
**Goal:** Implement a notification service that sends push notifications to Aura app, emails to RMs, and alerts to operations/traders for all key events and errors.

### Epic 10: Reporting & Dashboards
**Goal:** Build web dashboards for Operations, Traders, and RMs with real-time data, NAV charts, transaction history, and generate daily reconciliation and monthly performance reports.

### Epic 11: Yield Accrual & Fee Management
**Goal:** Track yield accrual for each client subscription, process term maturity payouts, and implement fee calculations (management, performance, redemption) with revenue tracking.

### Epic 12: Security, Compliance & Audit
**Goal:** Implement RBAC, multi-signature approvals for critical operations, immutable audit logging, KYC/AML integration, and transaction limits with compliance reporting.

---

## 6. Epic Details

### Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Establish the foundational project structure, database setup, core service scaffolding, and CI/CD pipeline to support all future development. Deliver a deployable application with health-check endpoints to validate the infrastructure.

#### Story 1.1: Project Repository Setup & Monorepo Structure

**As a** developer,
**I want** a well-organized monorepo with clear folder structure and tooling,
**so that** I can efficiently develop and maintain multiple services.

**Acceptance Criteria:**
1. Monorepo created with folder structure: `/services`, `/packages`, `/dashboards`
2. Root `package.json` with workspace configuration (npm workspaces or yarn workspaces)
3. TypeScript configured with shared `tsconfig.json` and per-package overrides
4. ESLint and Prettier configured for code quality and consistency
5. Git repository initialized with `.gitignore` excluding `node_modules`, `.env`, build artifacts
6. README.md with project overview and setup instructions

#### Story 1.2: Database Schema Design & Migrations Setup

**As a** developer,
**I want** a PostgreSQL database with initial schema and migration tooling,
**so that** I can store products, subscriptions, transactions, and manage schema changes over time.

**Acceptance Criteria:**
1. PostgreSQL database provisioned (local via docker-compose, production via Terraform/RDS)
2. TypeORM installed and configured with connection settings
3. Initial migration created with core tables:
   - `products` (id, name, asset_type, status, cutoff_time, created_at, updated_at)
   - `risk_units` (id, product_id, staging_vault_address, investment_vault_address)
   - `subscriptions` (id, client_id, product_id, amount, shares, status, subscribed_at, term_months, maturity_date)
   - `redemptions` (id, subscription_id, requested_amount, penalty, status, requested_at, approved_at, settled_at)
   - `nav_records` (id, product_id, nav_value, calculated_at, components jsonb)
   - `shareholdings` (id, product_id, client_id, shares, ownership_pct, updated_at)
   - `transactions` (id, type, product_id, client_id, amount, asset, status, tx_hash, created_at)
4. Migration runs successfully with `npm run migration:run`
5. Rollback command `npm run migration:revert` works correctly

#### Story 1.3: Core API Service Setup with NestJS

**As a** developer,
**I want** a NestJS API service with basic structure and health-check endpoint,
**so that** I can build REST APIs and validate deployment.

**Acceptance Criteria:**
1. NestJS project created in `/services/api`
2. Dependencies installed: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `typeorm`, `pg`
3. App module with basic configuration (port, CORS, logging)
4. Health-check endpoint `GET /health` returns `{ status: 'ok', timestamp: ISO8601 }`
5. Database connection validated on startup (fails fast if database unreachable)
6. API service starts successfully with `npm run start:api`
7. API accessible at `http://localhost:3000/health` and returns 200 OK

#### Story 1.4: Shared Package for Types and Utilities

**As a** developer,
**I want** a shared package with common TypeScript types and utility functions,
**so that** multiple services can reuse code without duplication.

**Acceptance Criteria:**
1. Package created at `/packages/shared` with its own `package.json`
2. Common types defined: `Product`, `Subscription`, `Redemption`, `NAVRecord`, `Shareholding`, `Transaction`
3. Utility functions implemented:
   - `formatCurrency(amount, decimals)` - formats monetary values
   - `calculatePenalty(principal, penaltyRate, remainingDays, totalDays)` - early exit penalty
   - `validateAddress(address, network)` - validates blockchain addresses
4. Exports defined in `index.ts` for easy importing
5. Other services can import shared types via `import { Product } from '@shared/types'`

#### Story 1.5: Docker Compose for Local Development

**As a** developer,
**I want** a docker-compose setup for local development dependencies,
**so that** I can run PostgreSQL, Redis, RabbitMQ locally without manual installation.

**Acceptance Criteria:**
1. `docker-compose.yml` created in project root
2. Services defined:
   - PostgreSQL (port 5432, with volume for persistence)
   - Redis (port 6379)
   - RabbitMQ (port 5672, management UI on 15672)
3. Environment variables configured in `.env.example` (database credentials, ports)
4. `npm run docker:up` starts all services
5. `npm run docker:down` stops and removes containers
6. README updated with docker setup instructions

#### Story 1.6: CI/CD Pipeline with GitHub Actions

**As a** developer,
**I want** an automated CI/CD pipeline that runs tests and deploys on push,
**so that** code quality is maintained and deployments are automated.

**Acceptance Criteria:**
1. GitHub Actions workflow created at `.github/workflows/ci.yml`
2. Workflow triggers on push to `main` and pull request creation
3. Pipeline steps:
   - Checkout code
   - Install dependencies (`npm ci`)
   - Run linter (`npm run lint`)
   - Run unit tests (`npm run test`)
   - Build all services (`npm run build`)
4. Pipeline fails if any step returns non-zero exit code
5. Status badge added to README showing build status
6. Deployment step (placeholder) for future production deployment

---

### Epic 2: Product & Risk Unit Management

**Epic Goal:** Enable operations team to create, configure, and manage investment products (Risk Units) through an admin API. Support product lifecycle states and configuration of key parameters like APY, terms, cutoff time, and fees.

#### Story 2.1: Create Product API Endpoint

**As an** operations user,
**I want** an API endpoint to create a new investment product,
**so that** I can onboard new products to the platform.

**Acceptance Criteria:**
1. `POST /api/products` endpoint created
2. Request body accepts:
   - `name` (string, required, unique)
   - `asset_type` (enum: BTC, ETH, USDT, SOL, etc., required)
   - `terms_months` (array of integers: [3, 6, 9, 12], required)
   - `apy_by_term` (object mapping term to APY, e.g., `{ "3": 4.5, "6": 5.0 }`)
   - `cutoff_time` (string, format HH:MM in UTC, required)
   - `min_subscription_amount` (decimal, required)
   - `early_exit_penalty_rate` (decimal, 0-1, required)
   - `max_capacity` (decimal, optional)
3. Endpoint validates all required fields and data types
4. Endpoint returns 400 if validation fails with error details
5. On success, product record created in database with status "Draft"
6. Risk Unit record created with null vault addresses (to be populated later)
7. Endpoint returns 201 with created product object including `id`
8. Unit test validates endpoint logic and error cases

#### Story 2.2: List and Retrieve Products API

**As an** operations user,
**I want** API endpoints to list all products and retrieve a single product,
**so that** I can view existing products and their configurations.

**Acceptance Criteria:**
1. `GET /api/products` endpoint returns array of all products with basic info (id, name, asset_type, status)
2. Endpoint supports query parameters:
   - `status` (filter by product status)
   - `asset_type` (filter by asset)
3. `GET /api/products/:id` endpoint returns full product details including risk unit info
4. Endpoint returns 404 if product ID not found
5. Response includes computed fields: `total_aum`, `client_count` (fetched from related tables)
6. Unit tests cover list, filters, and retrieve operations

#### Story 2.3: Update Product Configuration API

**As an** operations user,
**I want** an API endpoint to update product configuration,
**so that** I can adjust APYs, terms, and other parameters as needed.

**Acceptance Criteria:**
1. `PATCH /api/products/:id` endpoint created
2. Request body accepts partial updates to fields:
   - `apy_by_term` (updates APY for specific terms)
   - `min_subscription_amount`
   - `early_exit_penalty_rate`
   - `max_capacity`
3. Endpoint prevents updates to immutable fields (`asset_type`, `name`) and returns 400 if attempted
4. Endpoint validates that product is in "Draft" or "Active" state (cannot update "Closed" products)
5. On success, product record updated with `updated_at` timestamp
6. Endpoint returns 200 with updated product object
7. Audit log entry created for configuration change
8. Unit test validates update logic and restrictions

#### Story 2.4: Product Lifecycle State Transitions API

**As an** operations user,
**I want** an API endpoint to transition product lifecycle states,
**so that** I can activate, suspend, or close products as needed.

**Acceptance Criteria:**
1. `POST /api/products/:id/transition` endpoint created
2. Request body accepts `new_status` (enum: Draft, Active, Suspended, Closed, Liquidating)
3. Endpoint validates allowed transitions:
   - Draft → Active
   - Active → Suspended, Closed, Liquidating
   - Suspended → Active, Closed
   - Closed, Liquidating → no transitions allowed
4. Endpoint returns 400 if transition is not allowed
5. When transitioning to "Active", validates that vault addresses are set (non-null in risk_units table)
6. When transitioning to "Closed", validates that all client subscriptions are matured or redeemed
7. On success, product status updated and `updated_at` set
8. Audit log entry created with transition details
9. Endpoint returns 200 with updated product object
10. Unit tests cover all valid and invalid transition scenarios

#### Story 2.5: Assign Vault Addresses to Risk Unit

**As an** operations user,
**I want** an API endpoint to assign vault addresses to a product's Risk Unit,
**so that** the product can accept subscriptions and manage funds.

**Acceptance Criteria:**
1. `POST /api/products/:id/vaults` endpoint created
2. Request body accepts:
   - `staging_vault_address` (blockchain address, required)
   - `investment_vault_address` (blockchain address, required)
   - `network` (e.g., Ethereum, Bitcoin, Solana)
3. Endpoint validates that addresses are valid format for specified network
4. Endpoint validates that product is in "Draft" status (cannot change vaults once Active)
5. On success, risk_units record updated with vault addresses
6. Endpoint returns 200 with updated risk unit object
7. Unit test validates address format validation and status checks

#### Story 2.6: Configure Exchange Sub-Accounts for Risk Unit

**As an** operations user,
**I want** an API endpoint to register exchange sub-accounts for a product,
**so that** traders can deploy capital to exchanges for that product.

**Acceptance Criteria:**
1. New table `exchange_accounts` created:
   - `id`, `risk_unit_id`, `exchange_name` (enum: Binance, OKX, etc.), `sub_account_id`, `created_at`
2. `POST /api/products/:id/exchange-accounts` endpoint created
3. Request body accepts:
   - `exchange_name` (enum)
   - `sub_account_id` (string, unique per exchange)
4. Endpoint validates that exchange_name is supported
5. Endpoint prevents duplicate sub-accounts (same exchange + sub_account_id for same product)
6. On success, exchange_accounts record created
7. Endpoint returns 201 with created exchange account object
8. `GET /api/products/:id/exchange-accounts` endpoint returns list of all registered exchange accounts for product
9. Unit tests validate creation and duplicate prevention

---

### Epic 3: Hex Safe & Blockchain Integration

**Epic Goal:** Integrate with Hex Safe custody platform to create vaults, monitor blockchain deposits in real-time, and execute withdrawal transactions. Support multiple blockchain networks for deposit monitoring.

#### Story 3.1: Hex Safe SDK Integration and Vault Creation

**As a** trader,
**I want** the system to programmatically create Hex Safe vaults for new products,
**so that** products have secure custody for client funds.

**Acceptance Criteria:**
1. Hex Safe SDK installed and configured in `/packages/integrations/hex-safe`
2. Environment variables set for Hex Safe API credentials and endpoint
3. Function `createVault(productId, vaultType)` implemented where vaultType is "staging" or "investment"
4. Function calls Hex Safe API to create a new multi-sig vault
5. Function returns vault address and stores in risk_units table
6. Error handling: if Hex Safe API fails, function throws error with details
7. Integration test (mocked Hex Safe API) validates vault creation flow
8. Manual admin endpoint `POST /api/admin/hex-safe/create-vault` allows operations to trigger vault creation for a product

#### Story 3.2: Query Vault Balances from Hex Safe

**As a** trader,
**I want** to query current balances of all vaults from Hex Safe in real-time,
**so that** I can see available capital and deployed capital.

**Acceptance Criteria:**
1. Function `getVaultBalance(vaultAddress, asset)` implemented
2. Function calls Hex Safe API to retrieve balance for specified vault and asset
3. Function returns balance as decimal value
4. Caching: balances cached in Redis for 30 seconds to reduce API calls
5. Error handling: if Hex Safe API is unavailable, function uses cached value with staleness warning
6. `GET /api/vaults/:address/balance?asset=BTC` endpoint exposes balance query
7. Integration test (mocked Hex Safe API) validates balance retrieval

#### Story 3.3: Blockchain Deposit Monitor Service Setup

**As a** client,
**I want** my deposits to be detected automatically after blockchain confirmation,
**so that** my subscription is processed without manual intervention.

**Acceptance Criteria:**
1. New service `/services/blockchain-monitor` created with NestJS
2. Service connects to blockchain node providers (Infura for Ethereum, QuickNode for Solana, etc.)
3. Service fetches all staging vault addresses from database on startup
4. Service subscribes to new block events on all supported networks
5. For each new block, service scans for transactions to monitored addresses
6. Service validates transaction has sufficient confirmations (configurable per network: e.g., 12 for Ethereum, 1 for Solana)
7. Service writes detected deposits to `transactions` table with status "Pending"
8. Service emits event to RabbitMQ: `deposit.detected` with transaction details
9. Service logs each deposit detection with timestamp and tx_hash
10. Unit tests validate address monitoring and confirmation logic

#### Story 3.4: Handle Multi-Network Deposit Detection

**As a** system,
**I want** to detect deposits on multiple blockchain networks (Ethereum, Arbitrum, Solana, Tron, etc.),
**so that** clients can deposit via their preferred network.

**Acceptance Criteria:**
1. Blockchain monitor service supports multiple network configurations
2. Each network has configurable RPC endpoint, required confirmations, and block polling interval
3. Service maintains separate websocket/polling loops for each network
4. Deposits detected on any network are recorded with `network` field in transactions table
5. Asset normalization: USDT on Ethereum, Tron, Arbitrum all map to product asset "USDT"
6. Service handles network-specific transaction formats (EVM vs Solana vs Tron)
7. Integration tests (mocked blockchain nodes) validate multi-network detection

#### Story 3.5: Initiate Withdrawal via Hex Safe

**As a** trader,
**I want** to initiate a withdrawal from a Hex Safe vault via API,
**so that** I can move funds for redemptions or rebalancing.

**Acceptance Criteria:**
1. Function `initiateWithdrawal(vaultAddress, toAddress, asset, amount)` implemented
2. Function validates that `toAddress` is on the whitelist for the vault's Risk Unit
3. Function calls Hex Safe API to create a withdrawal transaction request
4. Hex Safe returns transaction ID and status (Pending Signatures)
5. Function stores withdrawal request in `transactions` table with status "Pending Approval"
6. Function returns transaction ID to caller
7. Error handling: if address not whitelisted, function throws error; if Hex Safe API fails, function retries up to 3 times
8. `POST /api/vaults/:address/withdraw` endpoint exposes withdrawal initiation
9. Integration test validates withdrawal request creation and whitelist check

#### Story 3.6: Webhook Handler for Hex Safe Deposit Confirmations

**As a** system,
**I want** to receive webhook notifications from Hex Safe when deposits are confirmed,
**so that** I can supplement blockchain monitoring with Hex Safe's authoritative data.

**Acceptance Criteria:**
1. `POST /api/webhooks/hex-safe/deposit` endpoint created
2. Endpoint validates webhook signature using Hex Safe shared secret
3. Endpoint parses webhook payload: vault_address, asset, amount, tx_hash, confirmed_at
4. Endpoint updates or creates transaction record in database
5. If transaction already exists (from blockchain monitor), endpoint updates status to "Confirmed" and adds Hex Safe timestamp
6. If transaction is new (missed by blockchain monitor), endpoint creates transaction record
7. Endpoint emits event to RabbitMQ: `deposit.confirmed`
8. Endpoint returns 200 OK to Hex Safe
9. Unit test validates webhook signature verification and transaction upsert logic

---

### Epic 4: Subscription Flow & Fund Ingestion

**Epic Goal:** Enable clients to subscribe to investment products via Aura app. The system provides deposit instructions, monitors incoming deposits, associates them with clients, and processes subscriptions at daily cutoff time by calculating share allocations and sweeping funds to investment vaults.

#### Story 4.1: Generate Deposit Instructions for Client

**As a** client,
**I want** to receive deposit instructions when I subscribe to a product,
**so that** I know where to send my funds.

**Acceptance Criteria:**
1. `POST /api/subscriptions/initiate` endpoint created
2. Request body accepts:
   - `client_id` (authenticated user ID from JWT token)
   - `product_id`
   - `term_months` (selected term, e.g., 6)
   - `amount` (intended subscription amount)
3. Endpoint validates that product is in "Active" status
4. Endpoint validates that selected term is supported by product
5. Endpoint validates that amount meets `min_subscription_amount`
6. Endpoint creates subscription record with status "Awaiting Deposit"
7. Endpoint retrieves staging vault address for the product
8. Endpoint returns deposit instructions:
   - `deposit_address` (staging vault address)
   - `network` (e.g., Ethereum ERC20)
   - `asset` (e.g., USDT)
   - `min_amount` (minimum subscription)
   - `estimated_arrival_time` (e.g., "15-30 minutes after 12 confirmations")
9. Endpoint returns 201 with subscription record and deposit instructions
10. Unit test validates validation logic and instruction generation

#### Story 4.2: Associate Detected Deposits with Subscriptions

**As a** system,
**I want** to automatically match incoming deposits to pending subscriptions,
**so that** clients' funds are correctly attributed.

**Acceptance Criteria:**
1. New consumer service listens to RabbitMQ queue for `deposit.detected` events
2. Consumer fetches deposit details: vault_address, asset, amount, tx_hash, sender_address (if available)
3. Consumer queries subscriptions table for records with status "Awaiting Deposit" for matching product (via vault address)
4. Matching logic:
   - If only one pending subscription for that product and amount is close (within 1% tolerance), auto-match
   - If multiple pending subscriptions, mark deposit as "Needs Manual Review"
   - If no pending subscription, mark deposit as "Unmatched"
5. On successful match, consumer updates subscription record:
   - Status → "Deposited"
   - `deposited_amount` = actual deposit amount
   - `deposit_tx_hash` = tx_hash
   - `deposited_at` = timestamp
6. Consumer emits event `subscription.deposited`
7. Consumer sends push notification to client: "Deposit of {amount} {asset} confirmed. Your subscription will be processed at next cutoff."
8. Unit test validates matching logic for single, multiple, and no matches

#### Story 4.3: Scheduled NAV Cutoff Job - Trigger Subscription Processing

**As a** system,
**I want** a scheduled job to run at the daily cutoff time for each product,
**so that** all pending subscriptions are processed in a batch.

**Acceptance Criteria:**
1. New scheduled job in NAV Calculator Service
2. Job configuration: cron expression per product (e.g., "0 16 * * *" for 16:00 UTC)
3. At cutoff time, job fetches all products with matching cutoff time
4. For each product, job emits event `cutoff.triggered` with product_id and cutoff_timestamp
5. Job logs cutoff trigger with product and timestamp
6. Unit test validates job scheduling and event emission

#### Story 4.4: Calculate Share Allocation for New Subscriptions

**As a** system,
**I want** to calculate share allocations for all new subscriptions at cutoff time,
**so that** clients receive their proportional ownership in the product.

**Acceptance Criteria:**
1. New consumer service listens to `cutoff.triggered` events
2. Consumer fetches current NAV for product (from nav_records table, latest record)
3. Consumer fetches all subscriptions with status "Deposited" for the product since last cutoff
4. For each subscription:
   - Fetch current market price of deposited asset at cutoff time (from price oracle)
   - Calculate deposit value in USD: `deposit_value = deposited_amount * price`
   - Calculate shares allocated: `shares = deposit_value / current_NAV`
5. Consumer updates subscription records:
   - `shares_allocated` = calculated shares
   - `share_price_at_subscription` = current NAV
   - Status → "Active"
   - `activated_at` = cutoff_timestamp
6. Consumer updates or creates shareholding record for client:
   - If client has existing shareholding, add new shares to existing
   - Recalculate `ownership_pct` based on total shares in product
7. Consumer emits event `subscription.activated` for each subscription
8. Consumer sends push notification to client: "{amount} {asset} subscribed to {product}. You now own {ownership_pct}%."
9. Unit test validates share calculation logic and shareholding updates

#### Story 4.5: Sweep Funds from Staging to Investment Vaults

**As a** system,
**I want** to automatically transfer deposited funds from staging vaults to investment vaults at cutoff time,
**so that** traders can deploy the capital.

**Acceptance Criteria:**
1. After subscription processing completes, system triggers fund sweep
2. System aggregates total deposited amounts per asset in staging vault since last cutoff
3. System initiates withdrawal from staging vault via Hex Safe `initiateWithdrawal(staging_vault, investment_vault, asset, total_amount)`
4. System stores sweep transaction in transactions table with type "Sweep" and status "Pending"
5. System listens for webhook or polls Hex Safe for transaction confirmation
6. Once confirmed, system updates transaction status to "Confirmed" and records confirmation timestamp
7. System emits event `funds.swept` with product_id, asset, amount
8. If sweep fails (e.g., insufficient gas), system retries up to 3 times with exponential backoff, then alerts operations team
9. Unit test validates aggregation and sweep initiation logic

#### Story 4.6: Subscription History API for Client

**As a** client,
**I want** to view my subscription history,
**so that** I can track my investments.

**Acceptance Criteria:**
1. `GET /api/subscriptions` endpoint created (requires authentication)
2. Endpoint fetches all subscriptions for authenticated client_id
3. Response includes array of subscriptions with:
   - `product_name`
   - `asset`
   - `subscribed_amount`
   - `shares_allocated`
   - `ownership_pct` (current)
   - `term_months`
   - `maturity_date`
   - `status` (Active, Matured, Redeemed Early)
   - `projected_yield` (calculated as `subscribed_amount * apy * (term_months / 12)`)
4. Endpoint supports filtering by `product_id` and `status`
5. Endpoint returns 200 with subscription array
6. Unit test validates query and response format

---

### Epic 5: NAV Calculation Engine

**Epic Goal:** Build the NAV (Net Asset Value) calculation engine that runs daily at cutoff time. The engine aggregates balances from investment vaults, exchange sub-accounts, and other venues, fetches asset prices from oracles, computes total NAV, and stores historical records with comprehensive error handling.

#### Story 5.1: Aggregate Vault Balances for NAV Calculation

**As a** NAV calculation service,
**I want** to fetch balances from all investment vaults for a product,
**so that** I can include vault holdings in NAV.

**Acceptance Criteria:**
1. NAV Calculator Service has function `aggregateVaultBalances(productId)`
2. Function fetches risk_unit record for product to get investment_vault_address
3. Function calls Hex Safe integration to get balance for vault address for product asset
4. Function returns object: `{ vault_address, asset, balance, value_usd }`
5. Function handles errors: if Hex Safe API fails, function throws error with context
6. Unit test validates vault balance aggregation logic

#### Story 5.2: Aggregate Exchange Sub-Account Balances

**As a** NAV calculation service,
**I want** to fetch balances from all exchange sub-accounts for a product,
**so that** I can include exchange holdings in NAV.

**Acceptance Criteria:**
1. Function `aggregateExchangeBalances(productId)` implemented
2. Function fetches all exchange_accounts records for product's risk_unit
3. For each exchange account:
   - Function calls exchange API (via CCXT library) to get sub-account balance
   - Function parses balance for product asset
4. Function returns array of: `{ exchange_name, sub_account_id, asset, balance, value_usd }`
5. Function handles errors: if exchange API fails, function logs error and continues with other exchanges (partial failure tolerance)
6. Function implements rate limiting and retries per exchange API limits
7. Unit test with mocked exchange APIs validates balance aggregation

#### Story 5.3: Fetch Asset Prices from Price Oracles

**As a** NAV calculation service,
**I want** to fetch current market prices for all assets from reliable price oracles,
**so that** I can value holdings accurately in USD.

**Acceptance Criteria:**
1. Function `fetchPrice(asset, timestamp)` implemented in `/packages/integrations/price-oracle`
2. Function fetches price from multiple sources:
   - Primary: Chainlink price feed (on-chain, if available)
   - Secondary: CoinGecko API
   - Tertiary: CoinMarketCap API
3. Function calculates median price from available sources
4. Function returns: `{ asset, price_usd, sources: [ {name, price, timestamp} ], median_price, timestamp }`
5. Function caches prices in Redis for 5 minutes
6. If all sources fail, function throws error
7. If only some sources fail, function uses available sources and logs warning
8. Unit test with mocked APIs validates price fetching and median calculation

#### Story 5.4: Execute Daily NAV Calculation at Cutoff

**As a** system,
**I want** to execute the complete NAV calculation at cutoff time for each product,
**so that** the NAV is up-to-date and accurate.

**Acceptance Criteria:**
1. NAV Calculator Service listens to `cutoff.triggered` event
2. Upon receiving event, service runs NAV calculation for product_id:
   - Fetch vault balances via `aggregateVaultBalances(productId)`
   - Fetch exchange balances via `aggregateExchangeBalances(productId)`
   - Fetch asset price via `fetchPrice(product.asset_type, cutoff_timestamp)`
   - Sum all balances: `total_balance = sum(vault_balance, exchange_balances)`
   - Calculate NAV: `nav_usd = total_balance * price_usd`
3. Service stores NAV record in nav_records table:
   - `product_id`
   - `nav_value` (USD)
   - `calculated_at` (cutoff_timestamp)
   - `components` (JSONB: vault balances, exchange balances, price used)
4. Service calculates daily change: `(today_nav - yesterday_nav) / yesterday_nav * 100`
5. Service emits event `nav.calculated` with product_id, nav_value, daily_change
6. Service logs NAV calculation with all components
7. If calculation fails, service logs error, alerts operations, and emits `nav.calculation_failed` event
8. Unit test validates full NAV calculation flow

#### Story 5.5: Store and Retrieve Historical NAV Records

**As a** user,
**I want** to retrieve historical NAV data for a product,
**so that** I can view performance over time.

**Acceptance Criteria:**
1. `GET /api/products/:id/nav` endpoint created
2. Endpoint accepts query parameters:
   - `start_date` (ISO date)
   - `end_date` (ISO date)
   - `limit` (default 30, max 365)
3. Endpoint queries nav_records table for product_id within date range
4. Response includes array of NAV records sorted by date descending
5. Each record includes: `date`, `nav_value`, `daily_change_pct`
6. Endpoint returns 200 with NAV history
7. Unit test validates query with various date ranges

#### Story 5.6: Handle NAV Calculation Failures and Stale Data

**As a** system,
**I want** to handle NAV calculation failures gracefully,
**so that** the platform remains operational even if NAV calculation has issues.

**Acceptance Criteria:**
1. If vault balance fetch fails: NAV calculation aborts, previous NAV retained, alert sent
2. If exchange balance fetch fails partially: NAV calculation continues with available data, warning logged, alert sent
3. If price fetch fails: NAV calculation aborts, previous NAV retained with "Stale" flag, alert sent
4. NAV records table has `is_stale` boolean field
5. If NAV is stale, all endpoints returning NAV display warning: "NAV last calculated at {timestamp} with potentially stale data"
6. System prevents redemptions if NAV is stale for > 4 hours
7. Operations dashboard displays NAV calculation status with red indicator if stale
8. Unit tests validate each failure scenario and error handling

---

### Epic 6: Shareholding Management

**Epic Goal:** Calculate and maintain accurate client shareholdings based on subscriptions, redemptions, and NAV changes. Ensure ownership percentages are correct, validated, and auditable.

#### Story 6.1: Initialize Shareholding Records for New Subscriptions

**As a** system,
**I want** to create or update shareholding records when subscriptions are processed,
**so that** clients' ownership is tracked.

**Acceptance Criteria:**
1. After share allocation in subscription processing (Epic 4, Story 4.4), service updates shareholdings table
2. If client has no existing shareholding for product, service creates new record:
   - `product_id`, `client_id`, `shares` (allocated shares), `ownership_pct` (calculated), `updated_at`
3. If client has existing shareholding, service updates record:
   - `shares` += new allocated shares
   - Recalculate `ownership_pct` based on total product shares
4. Service fetches total shares in product by summing all client shares
5. Service calculates ownership_pct: `(client_shares / total_shares) * 100`
6. Service validates that sum of all ownership_pct for product equals 100% (within 0.001% tolerance)
7. If validation fails, service logs error and alerts operations
8. Unit test validates shareholding creation, updates, and ownership calculation

#### Story 6.2: Update Shareholdings on NAV Changes

**As a** system,
**I want** shareholding values to reflect current NAV,
**so that** clients see accurate portfolio values.

**Acceptance Criteria:**
1. Shareholding records have computed field `current_value_usd` (not stored, calculated on read)
2. `current_value_usd = (shares / total_shares) * latest_nav_value`
3. `GET /api/clients/:id/holdings` endpoint calculates current value using latest NAV
4. Response includes for each holding:
   - `product_name`
   - `shares`
   - `ownership_pct`
   - `current_value_usd`
   - `subscribed_value_usd` (original subscription amount)
   - `profit_loss_usd` (`current_value - subscribed_value`)
   - `profit_loss_pct` (percentage gain/loss)
5. Endpoint returns 200 with holdings array
6. Unit test validates value calculation using mocked NAV data

#### Story 6.3: Adjust Shareholdings on Redemptions

**As a** system,
**I want** to deduct shares when clients redeem,
**so that** ownership percentages remain accurate.

**Acceptance Criteria:**
1. When redemption is settled (Epic 8), redemption service calls `adjustShareholding(clientId, productId, shares_to_deduct)`
2. Function fetches shareholding record for client and product
3. Function deducts shares: `shareholding.shares -= shares_to_deduct`
4. If shares reach zero, function soft-deletes shareholding record (sets `deleted_at` timestamp)
5. Function recalculates `ownership_pct` for client
6. Function recalculates `ownership_pct` for ALL clients in product (since total shares changed)
7. Function validates sum of ownership_pct = 100%
8. If validation fails, function rolls back transaction and alerts operations
9. Unit test validates share deduction and recalculation

#### Story 6.4: Shareholding Validation and Reconciliation Job

**As a** system,
**I want** a daily reconciliation job to validate shareholding integrity,
**so that** any discrepancies are detected and corrected.

**Acceptance Criteria:**
1. Scheduled job runs daily (after NAV calculation completes)
2. For each product, job:
   - Sums all client shares: `sum(shares)`
   - Sums all client ownership_pct: `sum(ownership_pct)`
   - Validates that `sum(ownership_pct)` is between 99.999% and 100.001%
3. If validation fails:
   - Job logs error with product_id and discrepancy details
   - Job sends alert to operations team
   - Job creates a reconciliation task in admin dashboard
4. Job generates reconciliation report:
   - Total clients per product
   - Total shares per product
   - Total ownership percentage
   - Any discrepancies found
5. Report stored in database and accessible via `GET /api/reports/shareholding-reconciliation?date={date}`
6. Unit test validates reconciliation logic and alerting

#### Story 6.5: Client Portfolio Summary API

**As a** client,
**I want** to view a summary of my portfolio across all products,
**so that** I can see my total holdings and performance.

**Acceptance Criteria:**
1. `GET /api/clients/me/portfolio` endpoint created (requires authentication)
2. Endpoint fetches all shareholdings for authenticated client
3. For each shareholding, endpoint calculates:
   - Current value (using latest NAV)
   - Subscribed value (sum of all subscription amounts for that product)
   - Profit/Loss (current - subscribed)
4. Endpoint aggregates totals:
   - `total_portfolio_value_usd` (sum of all current values)
   - `total_subscribed_value_usd` (sum of all subscribed values)
   - `total_profit_loss_usd`
   - `total_profit_loss_pct`
5. Response includes:
   - `summary`: totals object
   - `holdings`: array of per-product holdings
   - `last_updated_at`: timestamp of latest NAV calculation
6. Endpoint returns 200 with portfolio data
7. Unit test validates portfolio aggregation

#### Story 6.6: Admin Dashboard for Shareholding Overview

**As an** operations user,
**I want** a dashboard view of shareholdings per product,
**so that** I can monitor client distribution and detect anomalies.

**Acceptance Criteria:**
1. `GET /api/admin/products/:id/shareholdings` endpoint created (requires admin role)
2. Endpoint fetches all shareholdings for product_id
3. Response includes:
   - Total clients
   - Total shares
   - Top 10 clients by ownership percentage
   - Distribution histogram (e.g., how many clients own <1%, 1-5%, 5-10%, etc.)
4. Endpoint supports pagination for full client list
5. Endpoint returns 200 with shareholding data
6. Frontend dashboard displays shareholdings in table and pie chart
7. Unit test validates aggregation and pagination

---

## Epic 7: Exchange Integration & Trader Operations

**Epic Goal:** Integrate with multiple cryptocurrency exchanges (Binance, OKX, etc.) to enable traders to deploy capital, execute trades, and move funds between venues. Provide a unified dashboard for traders to monitor balances and manage fund movements within a Risk Unit.

*(Due to length constraints, I'll provide the full Epic 7-12 stories in a condensed format. Each would follow the same detailed structure as above.)*

#### Story 7.1: Exchange API Integration Setup
- Integrate CCXT library for unified exchange access
- Configure API keys securely in Secrets Manager
- Implement rate limiting and error handling

#### Story 7.2: Create Exchange Sub-Accounts Programmatically
- API to create sub-accounts on exchanges for Risk Units
- Store sub-account credentials securely
- Validate sub-account creation success

#### Story 7.3: Query Exchange Sub-Account Balances
- Real-time balance queries via exchange APIs
- Cache balances for performance
- Handle exchange API failures gracefully

#### Story 7.4: Initiate Fund Transfer from Vault to Exchange
- Trader initiates transfer: Vault → Exchange
- Validate whitelist and execute via Hex Safe
- Track transfer status and confirm arrival

#### Story 7.5: Initiate Fund Transfer Between Exchanges (via Vault)
- Multi-step transfer: Exchange A → Vault → Exchange B
- Playback mechanism for failed sub-steps
- Audit trail for all movements

#### Story 7.6: Trader Dashboard for Fund Management
- Web dashboard showing all balances per Risk Unit
- Unified view of vaults + exchanges
- Actions: Initiate transfers, view pending operations

---

## Epic 8: Redemption Flow & Settlement

#### Story 8.1: Client Redemption Request via API
- Endpoint to request full or partial redemption
- Calculate redemption value and early exit penalty
- Display confirmation to client

#### Story 8.2: Notify Relationship Manager for Approval
- Send notification to assigned RM via CRM integration
- RM dashboard shows pending approvals
- RM can approve/reject with notes

#### Story 8.3: Trader Settlement Workflow
- Notify traders of approved redemptions
- Traders move funds to staging vault
- Mark redemption as ready for payout

#### Story 8.4: Automated Payout Execution
- Initiate blockchain transfer to client's wallet
- Track transaction status
- Update shareholdings and NAV

#### Story 8.5: Redemption History and Status Tracking
- Client API to view redemption history
- Status tracking: Requested → Approved → Settling → Completed
- Notifications at each status change

#### Story 8.6: Handle Redemption Timeout and Escalation
- Alert if redemption exceeds 36-hour SLA
- Escalate to operations manager
- Audit log for delayed redemptions

---

## Epic 9: Notifications & Alerting System

#### Story 9.1: Notification Service Setup
- Dedicated notification service
- Integrations: Firebase (push), SendGrid (email)
- Template management for notifications

#### Story 9.2: Client Push Notifications for Key Events
- Deposit confirmed, subscription processed, term maturity, redemption completed
- Send via Firebase to Aura mobile app
- Persist notification history

#### Story 9.3: Email Notifications for Relationship Managers
- Redemption approval requests, client inquiries
- Send via SendGrid with templates
- Track email delivery status

#### Story 9.4: Operational Alerts for Errors and Anomalies
- NAV calculation failures, balance discrepancies, system errors
- Send to operations team via email and Slack
- Severity levels: Info, Warning, Critical

#### Story 9.5: Trader Alerts for Action Items
- Approved redemptions, low liquidity warnings, large deposits
- Display in trader dashboard and send email
- Acknowledge and dismiss alerts

#### Story 9.6: Webhook Notifications for External Systems
- Emit webhooks for critical events (NAV calculated, redemption completed)
- Secure webhook delivery with signatures
- Retry logic for failed deliveries

---

## Epic 10: Reporting & Dashboards

#### Story 10.1: Operations Dashboard - Product Overview
- Real-time view of all products with NAV, AUM, client count
- System health indicators
- Recent alerts and errors

#### Story 10.2: Trader Dashboard - Fund Management View
- Per-product balance aggregation (vaults + exchanges)
- Pending fund movements and redemptions
- P&L tracking per product

#### Story 10.3: Relationship Manager Dashboard
- List of assigned clients with portfolio summaries
- Pending redemption approvals
- Recent client activity log

#### Story 10.4: Daily Reconciliation Report Generation
- Automated report after NAV calculation
- NAV details, shareholdings, deposits/redemptions
- Discrepancy highlights

#### Story 10.5: Monthly Performance Report Generation
- Month-end NAV, net inflows/outflows, returns
- Top clients by holdings
- Fee revenue tracking

#### Story 10.6: Audit Trail Report for Compliance
- All transactions with timestamps and initiators
- Approval workflows
- Exportable in CSV/PDF

---

## Epic 11: Yield Accrual & Fee Management

#### Story 11.1: Track Yield Accrual for Client Subscriptions
- Calculate accrued yield based on APY and days elapsed
- Display projected yield in client portfolio
- Update daily with NAV changes

#### Story 11.2: Process Term Maturity and Yield Payout
- Detect subscriptions reaching maturity date
- Calculate final yield amount
- Transfer principal + yield to client wallet

#### Story 11.3: Configure and Calculate Management Fees
- Configure management fee % per product
- Deduct from NAV during calculation
- Track fee revenue separately

#### Story 11.4: Configure and Calculate Performance Fees
- Configure performance fee % and benchmark
- Calculate fees on returns above benchmark
- Deduct during redemption or maturity

#### Story 11.5: Calculate and Apply Redemption Fees
- Flat redemption fee % on redemption amount
- Display fee breakdown to client
- Deduct from redemption payout

#### Story 11.6: Fee Revenue Reporting
- Track all fees by type and product
- Generate monthly fee revenue report
- Export for accounting systems

---

## Epic 12: Security, Compliance & Audit

#### Story 12.1: Implement Role-Based Access Control (RBAC)
- Define roles: Admin, Trader, Operations, RM, Compliance, Read-Only
- Assign permissions per role
- Enforce in API middleware

#### Story 12.2: Multi-Signature Approval for Critical Operations
- Require multi-sig for: product creation, large transfers, whitelist changes
- Approval workflow in admin dashboard
- Audit log for all approvals

#### Story 12.3: Immutable Audit Log for All Transactions
- Log all state changes with timestamp, user, action, before/after state
- Store in append-only database or blockchain
- API to query audit log

#### Story 12.4: KYC/AML Integration with Sumsub
- Verify client KYC status before allowing subscriptions
- Sync KYC status from Sumsub via webhook
- Block transactions for unverified clients

#### Story 12.5: Transaction Limits and Compliance Checks
- Enforce min/max transaction amounts per tier
- Flag large transactions for additional approval
- Generate compliance reports

#### Story 12.6: Disaster Recovery and Data Backup
- Automated daily database backups to S3
- 90-day retention policy
- Documented disaster recovery procedure with RTO < 4 hours

---

## 7. Checklist Results Report

*(To be completed after PRD review - this section would contain results from running the PM checklist to validate completeness.)*

---

## 8. Next Steps

### For UX Expert:

The Investment Product Engine has limited client-facing UI (clients interact via Aura mobile app). However, internal dashboards require UX design. Please review the UI Design Goals section and create detailed UX specifications for:

1. **Operations Dashboard** - Product overview, system health, alerts
2. **Trader Dashboard** - Fund management, balance aggregation, transfer actions
3. **Relationship Manager Dashboard** - Client list, redemption approvals

Focus on clarity, efficiency, and action-oriented design for financial operations users. Reference the Core Screens section (3.3) for required views.

### For Architect:

Please review this PRD and create a detailed Architecture Document covering:

1. **System Architecture Diagram** - All services, data flows, integrations
2. **Database Schema Design** - All tables, relationships, indexes
3. **API Specification** - All endpoints with request/response formats
4. **Integration Architecture** - Hex Safe, HollaEx, Exchanges, Price Oracles
5. **Deployment Architecture** - Kubernetes setup, scaling, monitoring
6. **Security Architecture** - Authentication, authorization, encryption, secrets management
7. **Error Handling & Resilience** - Retry logic, circuit breakers, fallbacks
8. **Observability** - Logging, metrics, tracing, alerting

Ensure the architecture supports the non-functional requirements (NFR1-NFR20) including 99.9% uptime, horizontal scaling, and disaster recovery.

Use the Technical Assumptions section (4) as constraints for your architecture. The system must integrate with existing HollaEx/Hex Safe infrastructure.

---

**End of PRD**
