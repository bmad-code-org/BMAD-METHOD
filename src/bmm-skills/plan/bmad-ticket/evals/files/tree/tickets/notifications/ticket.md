---
schema: 1
id: NOTI-2
type: epic
title: "Notification service"
description: "Real-time alerts users configure themselves"
status: ready
depends_on: []
covers: [FR-3, FR-4, FR-5]
risk: 3
created: 2026-07-28
---

# NOTI-2 — Notification service

## Context

Users miss critical account events; this epic delivers configurable real-time alerts end to end. One dev drives this to completion — sized accordingly.

## Goals

- A subscribed event reaches the user through their chosen channel within a minute.
- Users can quiet and review their alerts without losing configuration.

## Sequencing Notes

Delivery path first (it proves the pipeline), then snooze, then history — history reads what delivery writes.
