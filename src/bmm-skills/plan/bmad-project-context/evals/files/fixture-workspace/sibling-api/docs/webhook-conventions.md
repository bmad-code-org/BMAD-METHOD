---
type: convention
title: webhook-conventions
description: HMAC signing rules for inbound webhooks
verified: 2026-07-01
sources: []
---
All inbound webhooks carry an X-Sig HMAC-SHA256 header over the raw body. Unsigned
or mis-signed calls are dropped silently (no 4xx) to starve probe traffic.
