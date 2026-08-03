---
type: convention
title: Repository pattern for DB access
description: All database access goes through src/repos classes
tags: [data-access]
verified: 2026-06-01
sources: [src/repos/orders.ts]
---
All database access goes through classes in src/repos/. Route handlers never touch
the pg client directly, so the soft-delete filter is applied in exactly one layer.
