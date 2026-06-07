#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""grade-spine — derive a validation grade deterministically from reviewer output.

The grade is a pure function of (per-dimension rubric verdicts, summed severity counts).
An LLM re-deriving that threshold ladder by hand every run can drift and miscount; a
script gives the same input the same grade every time. The synthesis prompt keeps the
judgment — the verdict paragraph — and hands the mechanical count-and-map here.

Input is JSON on stdin (or --input FILE):

  {
    "dimensions": {"consistency": "strong", "leanness": "thin", ...},
    "reviewers":  [{"slug": "rubric", "severity": {"critical": 0, "high": 1, "medium": 2, "low": 0}},
                   {"slug": "divergence-hunter", "severity": {"high": 1}}]
  }

reviewers[].severity counts are summed; a bare top-level "severity" dict is accepted as an
alternative to a single-reviewer list. Output is JSON on stdout:

  {"grade": "Fair", "severity_totals": {...}, "thin": 1, "broken": 0, "reason": "..."}

Grade ladder (most-severe wins):
  Poor       any broken dimension OR any critical finding
  Fair       any high finding OR two-plus thin dimensions
  Good       exactly one thin dimension, no high/critical
  Excellent  all dimensions strong/adequate, no high/critical
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

SEVERITIES = ("critical", "high", "medium", "low")


def sum_severity(payload: dict) -> dict:
    """Sum severity counts across reviewers[], or fall back to a bare top-level `severity`."""
    totals = {k: 0 for k in SEVERITIES}
    reviewers = payload.get("reviewers")
    sources = [r.get("severity") or {} for r in reviewers] if reviewers else [payload.get("severity") or {}]
    for src in sources:
        for k, v in src.items():
            if k in totals:
                totals[k] += int(v)
    return totals


def grade(dimensions: dict, severity: dict) -> dict:
    sev = {k: int(severity.get(k, 0)) for k in SEVERITIES}
    verdicts = [str(v).strip().lower() for v in (dimensions or {}).values()]
    broken = sum(1 for v in verdicts if v == "broken")
    thin = sum(1 for v in verdicts if v == "thin")
    if sev["critical"] > 0 or broken > 0:
        g, reason = "Poor", "any critical finding or broken dimension caps the grade at Poor"
    elif sev["high"] > 0 or thin >= 2:
        g, reason = "Fair", "a high finding or two-plus thin dimensions caps the grade at Fair"
    elif thin == 1:
        g, reason = "Good", "one thin dimension, no high/critical"
    else:
        g, reason = "Excellent", "all dimensions strong/adequate, no high/critical"
    return {"grade": g, "severity_totals": sev, "thin": thin, "broken": broken, "reason": reason}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Derive an architecture-spine validation grade from reviewer output.")
    ap.add_argument("-i", "--input", help="read the JSON payload from this file instead of stdin")
    ap.add_argument("-o", "--output", help="write JSON here instead of stdout")
    args = ap.parse_args(argv)

    raw = Path(args.input).read_text(encoding="utf-8") if args.input else sys.stdin.read()
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"invalid JSON input: {e}"}), file=sys.stderr)
        return 2

    result = grade(payload.get("dimensions", {}), sum_severity(payload))
    out = json.dumps(result, indent=2)
    if args.output:
        Path(args.output).write_text(out + "\n", encoding="utf-8")
    else:
        print(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
