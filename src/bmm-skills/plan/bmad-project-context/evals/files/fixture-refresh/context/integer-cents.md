---
type: decision
title: Integer-cents money handling
description: Why all money is integer cents and what it replaced
tags: [money, correctness]
verified: 2026-06-01
sources: [src/lib/money.ts]
---
Floating-point rounding produced $0.01 invoice mismatches (incident 2025-11).
Amounts are integer cents end-to-end; display conversion only in src/lib/money.ts
formatters. Rejected: decimal.js (bundle size), storing dollars (migration risk).
