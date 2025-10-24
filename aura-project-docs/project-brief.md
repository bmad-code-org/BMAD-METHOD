# Investment Product Engine - Project Brief

## Project Overview

**Product Name:** Investment Product Engine
**Product Owner:** Aura Platform (Private Wealth Crypto Platform)
**Target Users:** Internal - Supports Aura's Earn Products for HNWI/Family Offices
**Document Version:** 1.0
**Date:** October 23, 2025

## Executive Summary

The Investment Product Engine is a critical backend infrastructure component that will power Aura's suite of Investment/Earn products. Aura is a private wealth crypto platform designed for High-Net-Worth Individuals (HNWI) and Family Offices, offering curated, high-quality investment products with institutional-grade security.

The Investment Product Engine needs to support multiple investment products including:
- Simple Earn Products (BTC, ETH, USDT)
- Staking Products (SOL)
- Own Funds Products (CeFi Yield, DeFi Yield on stablecoins)

All products share common characteristics:
- **Fixed Terms:** 3, 6, 9, or 12 months
- **Fixed Yield:** APY fixed at subscription time
- **Early Exit Penalties:** Clients can exit early with penalties deducted from principal
- **End-of-Term Payout:** All accrued yield paid at term conclusion

## Problem Statement

Currently, the Investment Product Engine exists only as a draft specification. To launch Aura's Earn products, we need a **fully detailed, production-ready product requirements document** that defines:

1. **Complete functional requirements** for managing investment product lifecycle
2. **Risk unit management** (segregated accounting per product)
3. **NAV calculation** (Net Asset Value computed daily at cutoff time)
4. **Shareholding calculations** (client ownership percentages)
5. **Deposit/subscription flows** with staging and investment vaults
6. **Redemption flows** with proper approval and settlement processes
7. **Integration requirements** with:
   - Hex Safe custody platform (wallet infrastructure)
   - HollaEx (trading platform)
   - Exchanges (dedicated sub-accounts per product)
   - CRM systems (HubSpot for RM interactions)

## Target Users

### Primary Users (Internal)
1. **Traders/Portfolio Managers:** Manage investment positions, move funds between exchanges
2. **Relationship Managers:** Approve redemptions, communicate with clients
3. **Operations Team:** Monitor NAV, shareholdings, reconciliation
4. **Compliance Team:** Audit trail, regulatory reporting

### Secondary Users (External - via Aura App)
1. **HNWI Clients:** Subscribe/redeem via Aura mobile app
2. **Family Office Managers:** Manage investment allocations

## Key Business Requirements

### Core Functionality
1. **Multi-Product Support:** Single engine supporting multiple investment products simultaneously
2. **Risk Segregation:** Each product = dedicated risk unit with isolated accounting
3. **Daily NAV Calculation:** Automated NAV computation at daily cutoff (e.g., 16:00 HKT)
4. **Real-time Shareholding:** Dynamic ownership percentage calculations
5. **Automated Fund Sweeping:** Periodic transfer from staging vaults to investment vaults
6. **Flexible Redemption:** Support for instant redemption requests with trader approval
7. **Multi-venue Support:** Connect to multiple exchanges with dedicated sub-accounts

### Integration Requirements
1. **Hex Safe Integration:** Wallet creation, balance monitoring, transaction execution
2. **Exchange Integration:** Sub-account management, balance queries, trade execution
3. **Aura App Integration:** Client-facing subscription/redemption UI
4. **CRM Integration:** RM notification and approval workflows
5. **Accounting Systems:** NAV export, shareholding reports

### Operational Requirements
1. **Cutoff Time Flexibility:** Configurable daily cutoff time per product
2. **Multi-Currency Support:** Handle various crypto assets (BTC, ETH, USDT, USDC, SOL, etc.)
3. **Audit Trail:** Complete transaction history and state changes
4. **Reconciliation:** Daily reconciliation of balances across all venues
5. **Performance Tracking:** P&L, yield accrual, fee calculations

## Technical Context

### Existing Infrastructure
- **Platform:** HollaEx (white-label crypto trading platform)
- **Custody:** Hex Safe (institutional-grade wallet infrastructure)
- **Frontend:** Mobile app (iOS/Android) built on HollaEx
- **Backend:** Node.js based (HollaEx stack)

### Key Technical Constraints
1. Must integrate with Hex Safe API for wallet operations
2. Must support multiple exchange APIs (Binance, OKX, etc.)
3. Must handle blockchain transaction finality and confirmations
4. Must support atomic operations for critical state changes
5. Need real-time balance aggregation across multiple venues

### Draft Architecture (from existing spec)
- **Staging Vaults:** Blockchain addresses where clients deposit (not part of NAV)
- **Investment Vaults:** Blockchain addresses holding product assets (part of NAV)
- **Exchange Sub-accounts:** Dedicated accounts per product on each exchange
- **Risk Unit:** Logical grouping of all accounts/vaults belonging to one product

## Success Metrics

### Launch Criteria
1. Support for minimum 6 investment products (BTC, ETH, USDT, SOL, CeFi Yield, DeFi Yield)
2. Handle 650 clients across 5 account tiers
3. Process deposits within 1 hour of blockchain confirmation
4. Calculate NAV within 30 minutes of daily cutoff
5. Process redemptions within 36 hours of approval

### Performance Targets
- NAV calculation: < 5 minutes for products with < 1000 clients
- Deposit processing: < 1 hour from blockchain confirmation
- Redemption processing: < 36 hours from approval
- System uptime: 99.9%
- Zero fund loss due to calculation errors

## Out of Scope (for MVP)

1. **Discretionary Management:** Engine supports non-discretionary products only
2. **Automated Trading:** Traders execute trades manually; no algorithmic trading
3. **Complex Derivatives:** No options, futures, or exotic derivatives
4. **Multi-Asset Products:** Each product = single asset type only (v1)
5. **Auto-rebalancing:** No automated portfolio rebalancing
6. **DeFi Direct Integration:** Traders move funds to DeFi; engine doesn't interact directly with smart contracts

## Key Stakeholders

- **Product Manager:** Responsible for Aura Earn products roadmap
- **Head of Trading:** Manages investment strategies and execution
- **CTO:** Oversees technical architecture and integrations
- **Head of Compliance:** Ensures regulatory requirements are met
- **Head of Operations:** Manages daily operations and reconciliation

## Existing Documentation Reference

1. **Aura Platform PRD:** Complete platform specification (provided)
2. **Earn Product Specification:** Product features and user flows (provided)
3. **Investment Product Engine Draft:** Initial technical specification (provided)

## Key Questions to Address in PRD

1. How to handle failed transactions during fund sweeping?
2. How to handle NAV calculation failures or data unavailability?
3. What happens if redemption asset is not available (requires conversion)?
4. How to handle blockchain network congestion affecting deposit timing?
5. How to manage timezone issues across global exchanges?
6. How to handle partial redemptions vs. full redemptions?
7. What reporting is needed for RM dashboard?
8. How to handle emergency product suspension or liquidation?
9. What are the disaster recovery requirements?
10. How to handle product migrations or upgrades?

## Next Steps

1. ✅ Create this Project Brief
2. ⏳ Create detailed PRD using BMAD PM agent
3. ⏳ Create technical architecture using BMAD Architect agent
4. ⏳ Break down into Epics and User Stories
5. ⏳ Begin development sprint planning
