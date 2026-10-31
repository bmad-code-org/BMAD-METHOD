# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for list_templates.py. Run: uv run --with pytest pytest scripts/tests/test_list_templates.py

What counts as a template, search order across libraries, what each kind of source yields, and
how an unreadable source is reported.
"""

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

_SPEC = importlib.util.spec_from_file_location(
    "list_templates", Path(__file__).resolve().parent.parent / "list_templates.py"
)
list_templates = importlib.util.module_from_spec(_SPEC)
sys.modules["list_templates"] = list_templates
_SPEC.loader.exec_module(list_templates)


def template(template_id: str, description: str = "Use it.", extra: str = "") -> str:
    return f'---\ntitle: ""\ntemplate: {template_id}\ndescription: "{description}"\n{extra}---\n\n# {{title}}\n'


def ids(result: dict) -> list[str]:
    return [t["id"] for t in result["templates"]]


def test_only_files_with_a_template_key_are_templates(tmp_path):
    (tmp_path / "template-a.md").write_text(template("a"))
    (tmp_path / "rubric-a.md").write_text("Rate each strong or thin.\n")
    (tmp_path / "notes.md").write_text('---\ntitle: "Notes"\n---\n')
    (tmp_path / "methods.csv").write_text("---\ntemplate: nope\n---\n")
    assert ids(list_templates.scan([str(tmp_path)])) == ["a"]


def test_description_keeps_its_colon(tmp_path):
    (tmp_path / "t.md").write_text(template("a", "Asking for money: a grant or a bid."))
    assert list_templates.scan([str(tmp_path)])["templates"][0]["description"] == "Asking for money: a grant or a bid."


def test_rubric_and_methods_resolve_beside_the_template(tmp_path):
    (tmp_path / "t.md").write_text(template("a", extra="rubric: rubric-a.md\nmethods: methods-a.csv\n"))
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["rubric"] == str(tmp_path / "rubric-a.md")
    assert found["methods"] == str(tmp_path / "methods-a.csv")


def test_first_library_wins_and_the_other_is_reported(tmp_path):
    local, shared = tmp_path / "local", tmp_path / "shared"
    local.mkdir()
    shared.mkdir()
    (local / "t.md").write_text(template("a", "Ours."))
    (shared / "t.md").write_text(template("a", "Theirs."))
    (shared / "u.md").write_text(template("b"))
    result = list_templates.scan([str(local), str(shared)])
    assert ids(result) == ["a", "b"]
    assert result["templates"][0]["description"] == "Ours."
    assert result["shadowed"] == [
        {"id": "a", "file": str(shared / "t.md"), "source": str(shared), "kept": str(local / "t.md")}
    ]


def test_missing_folder_adds_nothing(tmp_path):
    result = list_templates.scan([str(tmp_path / "nothing-here")])
    assert result == {"templates": [], "shadowed": [], "unreachable": [], "tool_sources": []}


def test_a_source_can_be_one_file(tmp_path):
    (tmp_path / "t.md").write_text(template("a"))
    (tmp_path / "u.md").write_text(template("b"))
    assert ids(list_templates.scan([str(tmp_path / "t.md")])) == ["a"]


def test_a_sentence_is_left_for_the_agent():
    sentence = "Search corp:confluence_search in the DOCS space for templates"
    assert list_templates.scan([sentence])["tool_sources"] == [sentence]


def fake_gh(calls: list, *files: tuple[str, str]):
    """gh stand-in serving a folder listing, then each file's raw text."""

    def run(args: list[str]) -> str:
        calls.append(args)
        if args[0] == "-H":
            return dict(files)[args[-1].split("/contents/")[1].split("?")[0]]
        listing = [
            {"type": "file", "name": p.rsplit("/", 1)[-1], "path": p, "html_url": f"https://github.com/o/r/blob/v1/{p}"}
            for p, _ in files
        ]
        listing.append({"type": "dir", "name": "old.md", "path": "t/old.md", "html_url": ""})
        return json.dumps(listing)

    return run


def test_github_folder_at_a_ref(monkeypatch):
    calls = []
    files = (
        ("t/a.md", template("a", extra="rubric: rubric-a.md\n")),
        ("t/rubric-a.md", "Rate it.\n"),
        ("t/photo.png", "not read"),
    )
    monkeypatch.setattr(list_templates, "run_gh", fake_gh(calls, *files))
    source = "https://github.com/o/r/tree/v1/t"
    found = list_templates.scan([source])["templates"]
    assert [t["id"] for t in found] == ["a"]
    assert found[0]["file"] == "https://github.com/o/r/blob/v1/t/a.md"
    assert found[0]["rubric"] == "https://github.com/o/r/blob/v1/t/rubric-a.md"
    assert calls[0] == ["repos/o/r/contents/t?ref=v1"]
    assert len(calls) == 3


def test_github_repo_with_at_ref(monkeypatch):
    calls = []
    monkeypatch.setattr(list_templates, "run_gh", fake_gh(calls, ("a.md", template("a"))))
    assert ids(list_templates.scan(["https://github.com/acme/secret-templates@v1.2.0"])) == ["a"]
    assert calls[0] == ["repos/acme/secret-templates/contents/?ref=v1.2.0"]


def test_github_repo_with_no_ref_uses_its_default_branch(monkeypatch):
    calls = []
    monkeypatch.setattr(list_templates, "run_gh", fake_gh(calls, ("a.md", template("a"))))
    list_templates.scan(["https://github.com/o/r/"])
    assert calls[0] == ["repos/o/r/contents/"]


def test_github_failure_is_reported_and_the_rest_still_load(monkeypatch, tmp_path):
    def refuse(args):
        raise subprocess.CalledProcessError(1, "gh", stderr="HTTP 404: Not Found\n")

    monkeypatch.setattr(list_templates, "run_gh", refuse)
    (tmp_path / "t.md").write_text(template("a"))
    source = "https://github.com/o/secret"
    result = list_templates.scan([source, str(tmp_path)])
    assert result["unreachable"] == [{"source": source, "reason": "HTTP 404: Not Found"}]
    assert ids(result) == ["a"]


def test_gh_not_installed_is_reported(monkeypatch):
    def missing(args):
        raise FileNotFoundError("gh")

    monkeypatch.setattr(list_templates, "run_gh", missing)
    assert list_templates.scan(["https://github.com/o/r"])["unreachable"][0]["reason"] == "gh"


def test_url_to_one_file(monkeypatch):
    monkeypatch.setattr(list_templates, "fetch_url", lambda url: template("a", extra="rubric: r.md\n"))
    found = list_templates.scan(["https://example.com/t/a.md"])["templates"][0]
    assert found["id"] == "a"
    assert found["rubric"] == "https://example.com/t/r.md"


def test_plain_url_to_a_folder_cannot_be_listed():
    result = list_templates.scan(["https://example.com/templates/"])
    assert "cannot be listed" in result["unreachable"][0]["reason"]


def test_main_prints_json(tmp_path, capsys):
    (tmp_path / "t.md").write_text(template("a"))
    assert list_templates.main([str(tmp_path)]) == 0
    assert json.loads(capsys.readouterr().out)["templates"][0]["id"] == "a"


def test_no_sources_exits_2(capsys):
    assert list_templates.main([]) == 2
    assert "usage" in capsys.readouterr().err
