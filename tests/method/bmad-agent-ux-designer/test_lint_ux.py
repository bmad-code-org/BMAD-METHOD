# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for lint_ux.py. Run: uv run --with pytest pytest tests/method/bmad-agent-ux-designer/test_lint_ux.py"""

import importlib.util
import json
import sys
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[3]
SCRIPT = REPO / "skills/method/bmad-agent-ux-designer/scripts/lint_ux.py"
ASSETS = REPO / "skills/method/bmad-agent-ux-designer/assets"
FRONTMATTER = REPO / "skills/core-tools/bmad/scripts/frontmatter.py"
sys.path.insert(0, str(FRONTMATTER.parent))
import frontmatter  # noqa: E402

_SPEC = importlib.util.spec_from_file_location("lint_ux", SCRIPT)
lint_ux = importlib.util.module_from_spec(_SPEC)
sys.modules["lint_ux"] = lint_ux
_SPEC.loader.exec_module(lint_ux)
lint_ux.frontmatter = frontmatter


def test_shipped_design_and_experience_examples_pass_with_zero_findings():
    mobile_design = ASSETS / "design-example-mobile.md"
    mobile_exp = ASSETS / "experience-example-mobile.md"
    res_mobile = lint_ux.scan([("DESIGN.md", mobile_design.read_text()), ("EXPERIENCE.md", mobile_exp.read_text())])
    for key in ("invalid_hex", "design_section_order", "low_contrast", "unresolved_token"):
        assert res_mobile[key] == []

    shadcn_design = ASSETS / "design-example-shadcn.md"
    shadcn_exp = ASSETS / "experience-example-shadcn.md"
    res_shadcn = lint_ux.scan([("DESIGN.md", shadcn_design.read_text()), ("EXPERIENCE.md", shadcn_exp.read_text())])
    for key in ("invalid_hex", "design_section_order", "low_contrast", "unresolved_token"):
        assert res_shadcn[key] == []

    editorial = ASSETS / "design-example-editorial.md"
    res_ed = lint_ux.scan([("DESIGN.md", editorial.read_text())])
    for key in ("invalid_hex", "design_section_order", "unresolved_token"):
        assert res_ed[key] == []


def test_invalid_hex_and_section_order_detected_outside_fences():
    design = (
        "---\n"
        "name: Bad\n"
        "colors:\n"
        "  primary: '#GGGGGG'\n"
        "  ok: '#0F4C81'\n"
        "  short-ok: '#FFF'\n"
        "components:\n"
        "  btn:\n"
        "    bg: '#12345'\n"
        "---\n\n"
        "## Typography\n\n"
        "```\n## Brand & Style\n```\n\n"
        "## Colors\n"
    )
    res = lint_ux.scan([("DESIGN.md", design)])
    assert res["invalid_hex"] == [
        {"key": "colors.primary", "value": "#GGGGGG", "location": "DESIGN.md"},
        {"key": "components.btn.bg", "value": "#12345", "location": "DESIGN.md"},
    ]
    assert len(res["design_section_order"]) == 1
    assert res["design_section_order"][0]["heading"] == "Colors"
    assert res["design_section_order"][0]["after"] == "Typography"


def test_wcag_contrast_math_flags_error_and_warning_pairs():
    assert lint_ux.contrast_ratio("#FFFFFF", "#000000") == pytest.approx(21.0, abs=0.01)
    assert lint_ux.contrast_ratio("#0F4C81", "#FFFFFF") > 8.0

    design = (
        "---\n"
        "name: Contrast\n"
        "colors:\n"
        "  primary: '#0F4C81'\n"
        "  primary-foreground: '#FFFFFF'\n"
        "  muted: '#FFFFFF'\n"
        "  muted-foreground: '#AAAAAA'\n"
        "  surface: '#FFFFFF'\n"
        "  on-surface: '#777777'\n"
        "  surface-base: '#FFFFFF'\n"
        "  ink-secondary: '#9E9E9E'\n"
        "  surface-base-dark: '#141413'\n"
        "  ink-primary-dark: '#222222'\n"
        "  ink-muted-dark: '#333333'\n"
        "---\n"
    )
    res = lint_ux.scan([("DESIGN.md", design)])
    by_pair = {item["pair"]: item for item in res["low_contrast"]}
    assert "primary-foreground / primary" not in by_pair
    assert by_pair["muted-foreground / muted"]["severity"] == "error"
    assert by_pair["muted-foreground / muted"]["ratio"] < 3.0
    assert by_pair["on-surface / surface"]["severity"] == "warning"
    assert 3.0 <= by_pair["on-surface / surface"]["ratio"] < 4.5
    assert by_pair["ink-secondary / surface-base"]["severity"] == "error"
    assert by_pair["ink-primary-dark / surface-base-dark"]["severity"] == "error"
    assert by_pair["ink-muted-dark / surface-base-dark"]["severity"] == "error"


def test_unresolved_tokens_and_parent_design_inheritance(tmp_path):
    parent_dir = tmp_path / "ux-system-app"
    parent_dir.mkdir()
    parent_design = parent_dir / "DESIGN.md"
    parent_design.write_text(
        "---\nname: Parent\ncolors:\n  primary: '#112233'\nrounded:\n  md: '8px'\n---\n",
        encoding="utf-8",
    )
    epic_dir = tmp_path / "tickets" / "epic-one" / "ux-epic-one"
    epic_dir.mkdir(parents=True)
    epic_exp = epic_dir / "EXPERIENCE.md"
    epic_exp.write_text(
        "---\n"
        "name: Epic One\n"
        "sources:\n"
        "  - ../../../ux-system-app/DESIGN.md\n"
        "---\n\n"
        "Use `{colors.primary}` and `{rounded.md}`, never `{colors.missing}` or `{rounded.xl}`.\n"
        "```\n{colors.fenced}\n```\n",
        encoding="utf-8",
    )
    res = lint_ux.scan([(str(epic_exp), epic_exp.read_text())], run_dir=epic_dir)
    assert res["unresolved_token"] == [
        {"token": "{colors.missing}", "location": f"{epic_exp}:7"},
        {"token": "{rounded.xl}", "location": f"{epic_exp}:7"},
    ]


def test_visual_links_detects_broken_and_orphaned_and_cli_auto_siblings(tmp_path, capsys):
    run = tmp_path / "ux-system-demo"
    (run / "mockups").mkdir(parents=True)
    (run / "logos").mkdir()
    (run / "mockups" / "home.html").write_text("<html></html>", encoding="utf-8")
    (run / "mockups" / "orphan.html").write_text("<html></html>", encoding="utf-8")
    (run / "logos" / "mark.svg").write_text("<svg></svg>", encoding="utf-8")

    router = run / "ux-system-demo.md"
    router.write_text("---\ntitle: Demo\n---\n\n# Demo\n", encoding="utf-8")
    (run / "DESIGN.md").write_text(
        "---\nname: Demo\ncolors:\n  primary: '#0F4C81'\n  primary-foreground: '#FFFFFF'\n---\n\nLogo: `logos/mark.svg`\n",
        encoding="utf-8",
    )
    (run / "EXPERIENCE.md").write_text(
        "---\nname: Demo\n---\n\nMock: `mockups/home.html`, missing `mockups/gone.html`, token `{colors.nope}`.\n",
        encoding="utf-8",
    )

    rc = lint_ux.main(["--project-root", str(REPO), str(router)])
    assert rc == 0
    out = json.loads(capsys.readouterr().out)
    assert [b["path"] for b in out["broken_visual_links"]] == ["mockups/gone.html"]
    assert out["orphaned_artifacts"] == ["mockups/orphan.html"]
    assert [u["token"] for u in out["unresolved_token"]] == ["{colors.nope}"]


def test_cli_exit_codes(tmp_path, capsys):
    assert lint_ux.main([str(tmp_path / "missing.md")]) == 2
    assert "not found" in capsys.readouterr().err

    with pytest.raises(SystemExit) as help_exc:
        lint_ux.main(["--help"])
    assert help_exc.value.code == 0
