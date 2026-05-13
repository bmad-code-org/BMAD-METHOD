#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Render a PRD validation findings JSON into HTML + markdown reports.

Reads structured findings produced by the validator subagent, groups them by
category (explicit `category` field, else derived from ID prefix), computes a
pass/warn/fail summary and grade, substitutes into the configured HTML
template, writes a markdown companion at the same path with `.md` extension,
and optionally opens the HTML in the default browser.
"""

import argparse
import html
import json
import string
import sys
import webbrowser
from datetime import datetime
from pathlib import Path

CATEGORY_FROM_PREFIX = {
    "Q": "Quality",
    "D": "Discipline",
    "S": "Structural integrity",
    "STK": "Stakes-gated",
    "M": "Mechanical",
}

CATEGORY_ORDER = ["Quality", "Discipline", "Structural integrity", "Stakes-gated", "Mechanical"]


def category_for(finding: dict) -> str:
    explicit = finding.get("category")
    if explicit:
        return explicit
    fid = finding.get("id", "")
    prefix = fid.split("-", 1)[0] if "-" in fid else fid
    return CATEGORY_FROM_PREFIX.get(prefix, prefix or "Other")


def compute_stats(findings: list[dict]) -> dict:
    total = len(findings)
    by_status = {"pass": 0, "warn": 0, "fail": 0, "n/a": 0}
    failed_critical = 0
    failed_high = 0
    for f in findings:
        status = (f.get("status") or "n/a").lower()
        if status in by_status:
            by_status[status] += 1
        if status == "fail":
            sev = (f.get("severity") or "low").lower()
            if sev == "critical":
                failed_critical += 1
            elif sev == "high":
                failed_high += 1
    return {
        "total": total,
        "passed": by_status["pass"],
        "warned": by_status["warn"],
        "failed": by_status["fail"],
        "na": by_status["n/a"],
        "failed_critical": failed_critical,
        "failed_high": failed_high,
    }


def grade_from(stats: dict) -> tuple[str, str]:
    if stats["failed_critical"] > 0:
        return "Poor", "grade-poor"
    if stats["failed_high"] >= 1 or stats["failed"] >= 4:
        return "Fair", "grade-fair"
    if stats["failed"] > 0 or stats["warned"] > 2:
        return "Good", "grade-good"
    return "Excellent", "grade-excellent"


def render_score_bar(stats: dict, width: int = 480, height: int = 22) -> str:
    total = max(stats["total"], 1)
    p = stats["passed"] / total * width
    w = stats["warned"] / total * width
    f = stats["failed"] / total * width
    n = stats["na"] / total * width
    return (
        f'<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" '
        f'aria-label="Pass / warn / fail / n-a breakdown">'
        f'<rect x="0" y="0" width="{p:.1f}" height="{height}" fill="#22c55e"/>'
        f'<rect x="{p:.1f}" y="0" width="{w:.1f}" height="{height}" fill="#eab308"/>'
        f'<rect x="{p + w:.1f}" y="0" width="{f:.1f}" height="{height}" fill="#ef4444"/>'
        f'<rect x="{p + w + f:.1f}" y="0" width="{n:.1f}" height="{height}" fill="#94a3b8"/>'
        f"</svg>"
    )


def render_finding(f: dict) -> str:
    status = (f.get("status") or "n/a").lower()
    severity = (f.get("severity") or "low").lower()
    fid = html.escape(f.get("id") or "")
    title = html.escape(f.get("title") or fid)
    location = html.escape(f.get("location") or "")
    note = html.escape(f.get("note") or "")
    fix = html.escape(f.get("suggested_fix") or "")

    status_class = "na" if status == "n/a" else status
    parts = [
        f'<article class="finding finding-{status_class}">',
        '<header>',
        f'<span class="badge badge-status badge-{status_class}">{status.upper()}</span>',
        f'<span class="badge badge-severity badge-sev-{severity}">{severity}</span>',
        f'<span class="finding-id">{fid}</span>',
        f'<h3 class="finding-title">{title}</h3>',
        '</header>',
    ]
    if location:
        parts.append(f'<div class="finding-location"><strong>Location:</strong> {location}</div>')
    if note:
        parts.append(f'<div class="finding-note">{note}</div>')
    if fix:
        parts.append(f'<div class="finding-fix"><strong>Suggested fix:</strong> {fix}</div>')
    parts.append("</article>")
    return "\n".join(parts)


def render_category(name: str, findings: list[dict]) -> str:
    items = "\n".join(render_finding(f) for f in findings)
    name_e = html.escape(name)
    return (
        f'<section class="category">'
        f"<details open>"
        f'<summary><h2>{name_e} <span class="count">({len(findings)})</span></h2></summary>'
        f"{items}"
        f"</details>"
        f"</section>"
    )


SEVERITY_ORDER = ["critical", "high", "medium", "low"]


def render_finding_md(f: dict) -> str:
    status = (f.get("status") or "n/a").upper()
    severity = (f.get("severity") or "low").lower()
    fid = f.get("id") or ""
    title = f.get("title") or fid
    location = f.get("location") or ""
    note = f.get("note") or ""
    fix = f.get("suggested_fix") or ""

    lines = [f"### [{status}] {fid} — {title} _(severity: {severity})_"]
    if location:
        lines.append(f"- **Location:** {location}")
    if note:
        lines.append(f"- **Finding:** {note}")
    if fix:
        lines.append(f"- **Suggested fix:** {fix}")
    return "\n".join(lines)


def render_markdown_report(data: dict, findings: list[dict], stats: dict, grade: str) -> str:
    prd_name = data.get("prd_name") or "PRD"
    prd_path = data.get("prd_path") or ""
    checklist_path = data.get("checklist_path") or ""
    timestamp = data.get("timestamp") or datetime.now().isoformat(timespec="seconds")
    synthesis = data.get("overall_synthesis") or ""

    out = [
        f"# Validation Report — {prd_name}",
        "",
        f"- **PRD:** `{prd_path}`",
        f"- **Checklist:** `{checklist_path}`",
        f"- **Run at:** {timestamp}",
        f"- **Grade:** {grade}",
        "",
        f"**Summary:** {stats['passed']} pass · {stats['warned']} warn · {stats['failed']} fail · {stats['na']} n/a "
        f"(total {stats['total']}; critical fails: {stats['failed_critical']}, high fails: {stats['failed_high']})",
    ]
    if synthesis:
        out += ["", "## Overall synthesis", "", synthesis]

    # Group by severity then status: failed criticals first, then highs, etc.
    by_sev: dict[str, list[dict]] = {s: [] for s in SEVERITY_ORDER}
    other: list[dict] = []
    for f in findings:
        sev = (f.get("severity") or "low").lower()
        if sev in by_sev:
            by_sev[sev].append(f)
        else:
            other.append(f)

    out += ["", "## Findings by severity"]
    any_findings = False
    for sev in SEVERITY_ORDER:
        items = by_sev[sev]
        if not items:
            continue
        any_findings = True
        out += ["", f"### {sev.capitalize()} ({len(items)})", ""]
        out += [render_finding_md(f) for f in items]
    if other:
        any_findings = True
        out += ["", f"### Other ({len(other)})", ""]
        out += [render_finding_md(f) for f in other]
    if not any_findings:
        out += ["", "_No findings._"]

    return "\n".join(out) + "\n"


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Render PRD validation findings to HTML.")
    parser.add_argument("--findings", required=True, help="Path to validation-findings.json")
    parser.add_argument("--template", required=True, help="Path to HTML template")
    parser.add_argument("--output", required=True, help="Path to write the rendered HTML")
    parser.add_argument("--open", action="store_true", help="Open the rendered HTML in the default browser")
    args = parser.parse_args(argv)

    findings_path = Path(args.findings)
    template_path = Path(args.template)
    output_path = Path(args.output)

    try:
        data = json.loads(findings_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"error: findings file not found: {findings_path}", file=sys.stderr)
        return 1
    except json.JSONDecodeError as e:
        print(f"error: findings file is not valid JSON ({findings_path}): {e}", file=sys.stderr)
        return 1
    try:
        template = template_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        print(f"error: template file not found: {template_path}", file=sys.stderr)
        return 1

    findings = data.get("findings", []) or []

    by_cat: dict[str, list[dict]] = {}
    for f in findings:
        by_cat.setdefault(category_for(f), []).append(f)

    sorted_cats = sorted(
        by_cat.keys(),
        key=lambda c: (CATEGORY_ORDER.index(c) if c in CATEGORY_ORDER else 99, c),
    )
    categories_html = "\n".join(render_category(c, by_cat[c]) for c in sorted_cats)

    stats = compute_stats(findings)
    grade, grade_class = grade_from(stats)
    score_svg = render_score_bar(stats)

    timestamp = data.get("timestamp") or datetime.now().isoformat(timespec="seconds")
    substitutions = {
        "prd_name": html.escape(str(data.get("prd_name") or "PRD")),
        "prd_path": html.escape(str(data.get("prd_path") or "")),
        "checklist_path": html.escape(str(data.get("checklist_path") or "")),
        "timestamp": html.escape(timestamp),
        "overall_synthesis": html.escape(str(data.get("overall_synthesis") or "")),
        "grade": grade,
        "grade_class": grade_class,
        "total": str(stats["total"]),
        "passed": str(stats["passed"]),
        "failed": str(stats["failed"]),
        "warned": str(stats["warned"]),
        "na": str(stats["na"]),
        "score_svg": score_svg,
        "categories_html": categories_html,
    }

    rendered = string.Template(template).safe_substitute(substitutions)
    output_path.write_text(rendered, encoding="utf-8")

    md_path = output_path.with_suffix(".md")
    md_path.write_text(render_markdown_report(data, findings, stats, grade), encoding="utf-8")

    print(json.dumps({
        "output": str(output_path),
        "markdown": str(md_path),
        "grade": grade,
        "stats": stats,
    }))

    if args.open:
        webbrowser.open(output_path.resolve().as_uri())

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
