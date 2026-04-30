#!/usr/bin/env python3
"""Tests for scripts/parse_v6_epics.py — canonical v6, sharded detection."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
PARSE = SCRIPTS / "parse_v6_epics.py"


def _run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(PARSE), *args], capture_output=True, text=True, check=False)


CANONICAL_V6 = """\
---
title: Billing Stripe v2
---

# Billing Stripe v2

## Requirements Inventory

- FR1: Users can subscribe to a plan
- FR2: Users can cancel a subscription
- NFR1: Checkout completes within 5 seconds
- UX-DR1: Use the StatusMessage component for confirmation

## Epic List

1. Subscription management
2. Checkout

## Epic 1: Subscription management

The user can manage their subscription.

### Story 1.1: Subscribe to a plan

As a user
I want to subscribe to a plan
So that I unlock paid features

**Acceptance Criteria:**
- Given I am logged in
- When I select a plan and submit
- Then I am subscribed and see FR1 confirmation

### Story 1.2: Cancel a subscription

As a user
I want to cancel my subscription
So that I can stop being billed

**Acceptance Criteria:**
- Given I am subscribed
- When I cancel
- Then my subscription ends at period close (FR2)

## Epic 2: Checkout

The checkout flow.

### Story 2.1: Investigate Stripe webhook ordering

**Acceptance Criteria:**
- Given Stripe webhooks
- When events arrive out of order
- Then we still reconcile correctly (NFR1)
"""


class TestParseV6(unittest.TestCase):
    def test_parses_canonical_v6(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            f = Path(tmp) / "epics.md"
            f.write_text(CANONICAL_V6, encoding="utf-8")
            r = _run("--input", str(f))
            self.assertEqual(r.returncode, 0, r.stderr)
            data = json.loads(r.stdout)
            self.assertEqual(data["title"], "Billing Stripe v2")
            self.assertFalse(data["is_sharded"])
            self.assertEqual(len(data["epics"]), 2)
            self.assertEqual(len(data["epics"][0]["stories"]), 2)
            self.assertEqual(data["epics"][0]["stories"][0]["type"], "feature")
            self.assertIn("FR1", data["epics"][0]["stories"][0]["coverage_codes"])
            self.assertEqual(data["epics"][1]["stories"][0]["type"], "spike")
            codes = {r["code"] for r in data["requirements"]["functional"]}
            self.assertSetEqual(codes, {"FR1", "FR2"})
            ux_codes = {r["code"] for r in data["requirements"]["ux_design"]}
            self.assertEqual(ux_codes, {"UX-DR1"})

    def test_classifies_bug_titles(self) -> None:
        body = """\
## Epic 1: Hotfixes

### Story 1.1: Fix duplicate-charge bug

**Acceptance Criteria:**
- Given a duplicate charge
- When detected
- Then refund automatically
"""
        with tempfile.TemporaryDirectory() as tmp:
            f = Path(tmp) / "epics.md"
            f.write_text(body, encoding="utf-8")
            r = _run("--input", str(f))
            data = json.loads(r.stdout)
            self.assertEqual(data["epics"][0]["stories"][0]["type"], "bug")

    def test_directory_input_reports_sharded(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp) / "shards"
            d.mkdir()
            (d / "index.md").write_text("# index", encoding="utf-8")
            r = _run("--input", str(d))
            self.assertEqual(r.returncode, 0, r.stderr)
            data = json.loads(r.stdout)
            self.assertTrue(data["is_sharded"])
            self.assertTrue(any("sharded" in w for w in data["warnings"]))


if __name__ == "__main__":
    unittest.main()
