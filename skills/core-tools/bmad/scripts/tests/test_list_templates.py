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


def test_rubric_methods_and_guidance_resolve_beside_the_template(tmp_path):
    (tmp_path / "t.md").write_text(
        template("a", extra="rubric: rubric-a.md\nmethods: methods-a.csv\nguidance: guidance-a.md\n")
    )
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["rubric"] == str(tmp_path / "rubric-a.md")
    assert found["guidance"] == str(tmp_path / "guidance-a.md")
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
        {"id": "a", "file": str(shared / "t.md"), "source": str(shared), "kept": str(local / "t.md"), "agents": []}
    ]


def test_missing_folder_adds_nothing(tmp_path):
    result = list_templates.scan([str(tmp_path / "nothing-here")])
    assert result == {
        "templates": [],
        "shadowed": [],
        "orphaned": [],
        "unreachable": [],
        "missing": [str(tmp_path / "nothing-here")],
        "tool_sources": [],
    }


def test_a_missing_path_with_a_space_is_missing_not_a_sentence(tmp_path):
    path = str(tmp_path / "My Templates")
    result = list_templates.scan([path])
    assert result["missing"] == [path]
    assert result["tool_sources"] == []


def test_a_home_path_is_expanded(tmp_path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path))
    monkeypatch.setenv("USERPROFILE", str(tmp_path))
    library = tmp_path / ".bmad" / "ingest-templates"
    library.mkdir(parents=True)
    (library / "t.md").write_text(template("mine"))
    result = list_templates.scan(["~/.bmad/ingest-templates"])
    assert ids(result) == ["mine"]
    assert result["missing"] == []


def test_a_home_root_is_expanded(tmp_path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path))
    monkeypatch.setenv("USERPROFILE", str(tmp_path))
    module(tmp_path / "skills", "bmod-x", ("t.md", template("a")))
    assert len(list_templates.module_libraries(["~/skills"])) == 1


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


def test_github_path_with_an_encoded_space_is_encoded_once(monkeypatch):
    calls = []
    monkeypatch.setattr(list_templates, "run_gh", fake_gh(calls, ("t/a.md", template("a"))))
    list_templates.scan(["https://github.com/o/r/tree/v1/my%20templates"])
    assert calls[0] == ["repos/o/r/contents/my%20templates?ref=v1"]


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


def module(
    root: Path, name: str, *files: tuple[str, str], record: str = '[bmod]\ncode = "x"\n', folder: str = "doc-templates"
) -> Path:
    folder = root / name / folder
    folder.mkdir(parents=True)
    (root / name / "bmod.toml").write_text(record)
    for file, text in files:
        (folder / file).write_text(text)
    return folder


def test_module_templates_come_after_every_library(tmp_path, capsys):
    skills = tmp_path / "skills"
    module(skills, "bmod-core-tools", ("t.md", template("a", "Shipped.")), ("u.md", template("b")))
    custom = tmp_path / "custom"
    custom.mkdir()
    (custom / "t.md").write_text(template("a", "Ours."))
    assert list_templates.main([str(custom), "--root", str(skills)]) == 0
    result = json.loads(capsys.readouterr().out)
    assert [(t["id"], t["description"]) for t in result["templates"]] == [("a", "Ours."), ("b", "Use it.")]
    assert result["shadowed"][0]["id"] == "a"


def test_only_module_records_count(tmp_path):
    module(tmp_path, "bmod-x", ("t.md", template("a")))
    module(tmp_path, "bmad-skill", ("u.md", template("b")), record='[skill]\nbmod = "bmod-x"\n')
    module(tmp_path, "bmad-broken", ("v.md", template("c")), record="not toml [")
    assert list_templates.module_libraries([str(tmp_path)]) == [str(tmp_path / "bmod-x" / "doc-templates")]


def test_a_module_grouped_in_its_own_folder_is_found(tmp_path):
    module(tmp_path / "founder", "bmod-x", ("t.md", template("a")))
    assert list_templates.module_libraries([str(tmp_path)]) == [str(tmp_path / "founder" / "bmod-x" / "doc-templates")]


def test_a_module_in_two_linked_roots_is_read_once(tmp_path):
    real = tmp_path / "real"
    module(real, "bmod-x", ("t.md", template("a")))
    link = tmp_path / "link"
    link.symlink_to(real)
    assert len(list_templates.module_libraries([str(real), str(link)])) == 1


def test_roots_alone_are_enough(tmp_path, capsys):
    module(tmp_path, "bmod-x", ("t.md", template("a")))
    assert list_templates.main(["--root", str(tmp_path)]) == 0
    assert json.loads(capsys.readouterr().out)["templates"][0]["id"] == "a"


def test_folder_picks_which_module_templates_are_searched(tmp_path, capsys):
    module(tmp_path, "bmod-x", ("t.md", template("doc")))
    module(tmp_path, "bmod-y", ("t.md", template("note")), folder="ingest-templates")
    assert list_templates.main(["--root", str(tmp_path), "--folder", "ingest-templates"]) == 0
    assert ids(json.loads(capsys.readouterr().out)) == ["note"]


def extension(base: str, extra: str = "") -> str:
    return f"---\nextends: {base}\n{extra}---\n\n## Review Comments\n"


def test_an_extension_adds_to_its_template_and_is_not_offered(tmp_path):
    (tmp_path / "t.md").write_text(template("a"))
    (tmp_path / "x.md").write_text(extension("a"))
    result = list_templates.scan([str(tmp_path)])
    assert ids(result) == ["a"]
    assert result["templates"][0]["file"] == str(tmp_path / "t.md")
    assert result["templates"][0]["extensions"] == [str(tmp_path / "x.md")]


def test_a_module_extension_applies_to_a_template_found_earlier(tmp_path):
    agent, skills = tmp_path / "agent", tmp_path / "skills"
    agent.mkdir()
    (agent / "prd.md").write_text(template("prd"))
    folder = module(skills, "bmod-fernhollow-cards", ("track.md", extension("prd")))
    result = list_templates.scan([str(agent), *list_templates.module_libraries([str(skills)])])
    assert result["templates"][0]["extensions"] == [str(folder / "track.md")]


def test_extensions_stay_in_search_order_and_the_first_value_wins(tmp_path):
    local, shared = tmp_path / "local", tmp_path / "shared"
    local.mkdir()
    shared.mkdir()
    (local / "x.md").write_text(extension("a", "output: docs/ours/{slug}\n"))
    (shared / "x.md").write_text(extension("a", "output: docs/theirs/{slug}\nrubric: r.md\n"))
    (shared / "t.md").write_text(template("a", extra="rubric: base.md\n"))
    found = list_templates.scan([str(local), str(shared)])["templates"][0]
    assert found["extensions"] == [str(local / "x.md"), str(shared / "x.md")]
    assert found["output"] == "docs/ours/{slug}"
    assert found["rubric"] == str(shared / "r.md")


def test_values_a_template_sets_come_through(tmp_path):
    extra = "output: docs/a/{slug}\nstyle: a.css\ncategory: general\n"
    (tmp_path / "t.md").write_text(template("a", extra=extra))
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["output"] == "docs/a/{slug}"
    assert found["category"] == "general"
    assert found["style"] == str(tmp_path / "a.css")


def test_a_placeholder_path_is_left_for_the_agent(tmp_path):
    (tmp_path / "t.md").write_text(template("a", extra="style: {project-root}/brand.css\n"))
    assert list_templates.scan([str(tmp_path)])["templates"][0]["style"] == "{project-root}/brand.css"


def test_an_extension_with_no_template_is_reported(tmp_path):
    (tmp_path / "x.md").write_text(extension("gone"))
    result = list_templates.scan([str(tmp_path)])
    assert result["templates"] == []
    assert result["orphaned"] == [{"extends": "gone", "file": str(tmp_path / "x.md"), "source": str(tmp_path)}]


def test_no_sources_exits_2(capsys):
    assert list_templates.main([]) == 2
    assert "usage" in capsys.readouterr().err


def test_rubric_path_resolves_and_a_bare_name_stays_a_name(tmp_path):
    (tmp_path / "template-a.md").write_text(template("a", extra="rubric: rubric-a.md\n"))
    (tmp_path / "template-b.md").write_text(template("b", extra="rubric: rubric-planning\n"))
    found = {t["id"]: t["rubric"] for t in list_templates.scan([str(tmp_path)])["templates"]}
    assert found == {"a": str(tmp_path / "rubric-a.md"), "b": "rubric-planning"}


def test_agents_come_back_as_a_list(tmp_path):
    (tmp_path / "t.md").write_text(template("a", extra="agents: [bmad-agent-pm, 'bmad-agent-analyst']\n"))
    assert list_templates.scan([str(tmp_path)])["templates"][0]["agents"] == ["bmad-agent-pm", "bmad-agent-analyst"]


def test_agent_keeps_templates_naming_it_and_its_own_unnamed_ones(tmp_path, capsys):
    own, shared = tmp_path / "bmad-agent-analyst" / "assets", tmp_path / "shared"
    own.mkdir(parents=True)
    shared.mkdir()
    (own / "a.md").write_text(template("mine"))
    (shared / "b.md").write_text(template("named", extra="agents: [bmad-agent-analyst]\n"))
    (shared / "c.md").write_text(template("anyone"))
    (shared / "d.md").write_text(template("other", extra="agents: [bmad-agent-pm]\n"))
    assert list_templates.main([str(own), str(shared), "--agent", "bmad-agent-analyst"]) == 0
    assert [t["id"] for t in json.loads(capsys.readouterr().out)["templates"]] == ["mine", "named"]


def test_a_replacement_keeps_the_agent_of_the_template_it_hides(tmp_path, capsys):
    custom, own = tmp_path / "custom", tmp_path / "bmad-agent-analyst" / "assets"
    custom.mkdir()
    own.mkdir(parents=True)
    (custom / "brief.md").write_text(template("brief", "Ours."))
    (own / "template-brief.md").write_text(template("brief", "Shipped."))
    (own / "template-prfaq.md").write_text(template("prfaq"))
    assert list_templates.main([str(custom), str(own), "--agent", "bmad-agent-analyst"]) == 0
    found = json.loads(capsys.readouterr().out)["templates"]
    assert [(t["id"], t["description"]) for t in found] == [("brief", "Ours."), ("prfaq", "Use it.")]


def test_a_replacement_naming_other_agents_is_not_kept(tmp_path, capsys):
    custom, own = tmp_path / "custom", tmp_path / "bmad-agent-analyst" / "assets"
    custom.mkdir()
    own.mkdir(parents=True)
    (custom / "brief.md").write_text(template("brief", extra="agents: [bmad-agent-pm]\n"))
    (own / "template-brief.md").write_text(template("brief"))
    assert list_templates.main([str(custom), str(own), "--agent", "bmad-agent-analyst"]) == 0
    assert json.loads(capsys.readouterr().out)["templates"] == []


ORDERED = """---
template: t
description: "Use it."
facilitation_order: [problem, what-makes-it-different, vision?, summary]
---

# {title}

## Table of Contents

## Summary
<!-- The whole thing. -->

## Problem

## What makes it different?

## Vision
<!-- optional. Where it goes. -->
"""


def test_facilitation_order_comes_back_as_a_list_with_no_problems(tmp_path):
    (tmp_path / "t.md").write_text(ORDERED)
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["facilitation_order"] == ["problem", "what-makes-it-different", "vision?", "summary"]
    assert found["order_problems"] == []


def test_order_problems_name_unknown_repeated_and_unlisted_sections(tmp_path):
    broken = ORDERED.replace(
        "[problem, what-makes-it-different, vision?, summary]", "[problem, problem, scope, vision?]"
    )
    (tmp_path / "t.md").write_text(broken)
    problems = list_templates.scan([str(tmp_path)])["templates"][0]["order_problems"]
    assert problems == [
        "`problem` is listed twice",
        "`scope` names no heading",
        "heading `summary` is not listed",
        "heading `what-makes-it-different` is not listed",
    ]


def test_a_section_an_extension_adds_joins_the_order_as_required(tmp_path):
    (tmp_path / "t.md").write_text(ORDERED)
    (tmp_path / "e.md").write_text("---\nextends: t\n---\n\n## Security sign-off\n<!-- After Problem. -->\n")
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["facilitation_order"] == [
        "problem",
        "what-makes-it-different",
        "vision?",
        "summary",
        "security-sign-off",
    ]
    assert found["order_problems"] == []


def test_an_added_section_its_comment_makes_optional_is_not_required(tmp_path):
    (tmp_path / "t.md").write_text(ORDERED)
    (tmp_path / "e.md").write_text(
        "---\nextends: t\n---\n\n## Quote\n<!-- optional. First. -->\n\n## Risks\n<!-- include when: a launch. -->\n"
    )
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["facilitation_order"][-2:] == ["quote?", "risks?"]


def test_an_extension_heading_the_template_has_is_not_added_twice(tmp_path):
    (tmp_path / "t.md").write_text(ORDERED)
    (tmp_path / "e.md").write_text("---\nextends: t\n---\n\n## Problem\n<!-- Cite the incident log. -->\n")
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["facilitation_order"] == ["problem", "what-makes-it-different", "vision?", "summary"]


def test_sections_of_a_later_extension_join_an_earlier_extensions_order(tmp_path):
    local, shared = tmp_path / "local", tmp_path / "shared"
    local.mkdir()
    shared.mkdir()
    (shared / "t.md").write_text(ORDERED)
    (local / "a.md").write_text(
        "---\nextends: t\nfacilitation_order: [summary, problem, what-makes-it-different, vision?, sign-off]\n---\n\n## Sign-off\n"
    )
    (shared / "b.md").write_text("---\nextends: t\n---\n\n## Budget owner\n")
    found = list_templates.scan([str(local), str(shared)])["templates"][0]
    assert found["facilitation_order"][-2:] == ["sign-off", "budget-owner"]
    assert found["order_problems"] == []


def test_an_extension_sets_the_view_and_whether_it_renders(tmp_path):
    (tmp_path / "t.md").write_text(template("t", extra="view: slides\n"))
    (tmp_path / "e.md").write_text(extension("t", "view: page.html\nhtml_view: always\n"))
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["view"] == str(tmp_path / "page.html")
    assert found["html_view"] == "always"


def test_a_bare_view_name_stays_a_name(tmp_path):
    (tmp_path / "t.md").write_text(template("t", extra="view: slides\n"))
    assert list_templates.scan([str(tmp_path)])["templates"][0]["view"] == "slides"


def test_a_template_section_an_extension_order_leaves_out_is_removed(tmp_path):
    (tmp_path / "t.md").write_text(ORDERED)
    (tmp_path / "e.md").write_text(
        "---\nextends: t\nfacilitation_order: [problem, security-sign-off, summary]\n---\n\n## Security sign-off\n"
    )
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["facilitation_order"] == ["problem", "security-sign-off", "summary"]
    assert found["removed"] == ["what-makes-it-different", "vision"]
    assert found["order_problems"] == []


def test_an_extension_order_must_list_the_extensions_own_sections(tmp_path):
    (tmp_path / "t.md").write_text(ORDERED)
    (tmp_path / "e.md").write_text(
        "---\nextends: t\nfacilitation_order: [problem, what-makes-it-different, vision?, summary]\n---\n\n## Security sign-off\n"
    )
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["order_problems"] == ["heading `security-sign-off` is not listed"]
    assert found["removed"] == []


def test_brief_keeps_only_what_choosing_needs(tmp_path, capsys):
    (tmp_path / "t.md").write_text(template("a", extra="rubric: r.md\nfacilitation_order: [x]\n"))
    list_templates.main([str(tmp_path), "--brief"])
    found = json.loads(capsys.readouterr().out)["templates"]
    assert found == [{"id": "a", "description": "Use it.", "not_for": "", "category": "", "output": ""}]


def test_template_keeps_one_and_an_unknown_id_exits_1(tmp_path, capsys):
    (tmp_path / "a.md").write_text(template("a"))
    (tmp_path / "b.md").write_text(template("b"))
    assert list_templates.main([str(tmp_path), "--template", "b"]) == 0
    assert ids(json.loads(capsys.readouterr().out)) == ["b"]
    assert list_templates.main([str(tmp_path), "--template", "c"]) == 1
    assert "no template" in json.loads(capsys.readouterr().out)["error"]


def test_merge_writes_one_file_with_the_customizations_first(tmp_path, capsys):
    lib, custom, run = tmp_path / "lib", tmp_path / "custom", tmp_path / "run"
    lib.mkdir()
    custom.mkdir()
    (lib / "t.md").write_text(ORDERED.replace("description:", "rubric: r.md\ndescription:"))
    (custom / "e.md").write_text(
        "---\nextends: t\nhtml_view: always\nfacilitation_order: [codename, problem, summary]\n---\n\n"
        "<!-- inputs: Ask for a codename first. -->\n\n## Codename\n<!-- First. -->\n"
    )
    list_templates.main([str(custom), str(lib), "--template", "t", "--merge", str(run / ".template.md")])
    result = json.loads(capsys.readouterr().out)
    text = (run / ".template.md").read_text()
    assert result["merged"] == str(run / ".template.md")
    assert "_text" not in result["templates"][0]
    front = text.split("---")[1]
    assert 'html_view: "always"' in front
    assert "facilitation_order: [codename, problem, summary]" in front
    assert f'rubric: "{(lib / "r.md").resolve().as_posix()}"' in front
    assert "extends" not in front
    assert (
        text.index("Ask for a codename first.")
        < text.index(f"The template, from {lib / 't.md'}")
        < text.index("## Problem")
    )
    assert "## Vision" not in text and "## What makes it different?" not in text
    assert "## Summary" in text


def test_merge_keeps_a_heading_inside_a_fence_and_the_title(tmp_path):
    text = "# {title}\n\n## Keep\n\n```\n## Drop\n```\n\n## Drop\nGone.\n\n## After\n"
    assert list_templates.drop_sections(text, ["drop"]) == "# {title}\n\n## Keep\n\n```\n## Drop\n```\n\n## After\n"


def test_a_heading_inside_a_code_fence_is_not_a_section():
    text = "```\n## Not a section\n```\n\n## Problem\n"
    assert list_templates.section_ids(text) == ["problem"]


def test_a_shorter_fence_inside_a_longer_one_does_not_close_it():
    text = "````\n```\n## Inside\n```\n## Still inside\n````\n## Problem\n"
    assert list_templates.section_ids(text) == ["problem"]


def test_an_order_that_is_not_a_one_line_list_is_reported(tmp_path):
    (tmp_path / "t.md").write_text(
        "---\ntemplate: t\ndescription: x\nfacilitation_order:\n  - problem\n---\n\n## Problem\n"
    )
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["facilitation_order"] == []
    assert found["order_problems"] == ["`facilitation_order` must be a one-line list, such as `[problem, scope?]`"]


def test_project_root_fills_the_placeholder_in_each_source(tmp_path, capsys):
    folder = tmp_path / "_bmad" / "custom" / "facilitate-templates"
    folder.mkdir(parents=True)
    (folder / "t.md").write_text(template("mine"))
    list_templates.main(["{project-root}/_bmad/custom/facilitate-templates", "--project-root", str(tmp_path)])
    result = json.loads(capsys.readouterr().out)
    assert ids(result) == ["mine"]
    assert result["missing"] == []


def test_merge_works_for_a_template_with_no_extensions(tmp_path, capsys):
    (tmp_path / "t.md").write_text(ORDERED)
    assert (
        list_templates.main([str(tmp_path), "--template", "t", "--merge", str(tmp_path / "run" / ".template.md")]) == 0
    )
    text = (tmp_path / "run" / ".template.md").read_text()
    assert "Customization from" not in text and "## Problem" in text


def test_libraries_of_reads_a_skills_template_libraries_and_its_overrides(tmp_path, capsys):
    skill = tmp_path / "skills" / "bmad-facilitate"
    skill.mkdir(parents=True)
    (skill / "customize.toml").write_text(
        '[workflow]\ntemplate_libraries = ["{project-root}/_bmad/custom/facilitate-templates", "{skill-root}/assets"]\n'
    )
    (skill / "assets").mkdir()
    (skill / "assets" / "t.md").write_text(template("shipped"))
    custom = tmp_path / "_bmad" / "custom" / "facilitate-templates"
    custom.mkdir(parents=True)
    (custom / "e.md").write_text(extension("shipped"))
    list_templates.main(["--libraries-of", str(skill), "--project-root", str(tmp_path)])
    found = json.loads(capsys.readouterr().out)["templates"]
    assert ids({"templates": found}) == ["shipped"]
    assert found[0]["extensions"] == [str(custom / "e.md")]


def test_an_extension_order_that_is_not_a_one_line_list_is_reported_beside_a_good_one(tmp_path):
    (tmp_path / "t.md").write_text(ORDERED)
    (tmp_path / "e.md").write_text("---\nextends: t\nfacilitation_order:\n  - problem\n---\n\n## Extra\n")
    found = list_templates.scan([str(tmp_path)])["templates"][0]
    assert found["facilitation_order"][:4] == ["problem", "what-makes-it-different", "vision?", "summary"]
    assert found["order_problems"] == [
        f"`facilitation_order` in {tmp_path / 'e.md'} is ignored: it must be a one-line list, such as `[problem, scope?]`"
    ]
