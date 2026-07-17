# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Pytest parity for validateSkill() from tools/validate-skills.js.

Ports every assertion from the retired test/test-validate-skills.js runner,
focused on SKILL-06 (description quality) and its deprecated-skill exemption.
Calls the real JS export through js_bridge rather than reimplementing
validation logic in Python. Uses the existing fixtures under
test/fixtures/validate-skills/** in place.
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "support"))
import js_bridge  # noqa: E402

VALIDATE_SKILLS = "tools/validate-skills.js"
FIXTURES = Path(__file__).resolve().parents[1] / "fixtures" / "validate-skills"


def has_trigger_finding(skill_name: str) -> bool:
    """Whether validateSkill emitted the SKILL-06 "Use when/Use if" trigger
    finding for the given fixture skill directory."""
    findings = js_bridge.call(VALIDATE_SKILLS, "validateSkill", str(FIXTURES / skill_name))
    return any(
        f["rule"] == "SKILL-06" and re.search("trigger phrase", f["detail"], re.IGNORECASE)
        for f in findings
    )


def test_deprecated_skill_is_exempt_from_trigger_phrase_requirement():
    assert has_trigger_finding("deprecated-shim") is False


def test_active_skill_missing_trigger_phrase_is_still_flagged():
    assert has_trigger_finding("missing-trigger") is True


def test_active_skill_with_use_when_trigger_is_not_flagged():
    assert has_trigger_finding("with-trigger") is False
