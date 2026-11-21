"""Tests for scan_paths.py: each rule fires on its case and stays quiet on the conventions it enforces."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / "skills/toolsmith/bmad-toolsmith/scripts/scan_paths.py"


def make_skill(root: Path, files: dict[str, str]) -> Path:
    skill = root / "bmad-demo"
    for rel, text in files.items():
        path = skill / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    return skill


def scan(skill: Path):
    res = subprocess.run([sys.executable, str(SCRIPT), str(skill)], capture_output=True, text=True)
    return res.returncode, json.loads(res.stdout)


def rules(data):
    return sorted((f["path"], f["rule"]) for f in data["findings"])


class ScanPathsTest(unittest.TestCase):
    def test_link_to_a_section_of_an_existing_file_resolves(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\n"
                    "See [usage]({skill-root}/references/guide.md#usage).\n",
                    "references/guide.md": "# Guide\n\n## Usage\n",
                },
            )
            _, data = scan(skill)
            self.assertEqual(rules(data), [])

    def test_old_format_context_covers_only_its_own_clause(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\n"
                    "Never write module.yaml; read module-help.csv first.\n"
                    "Never write module.yaml or module-help.csv.\n",
                },
            )
            _, data = scan(skill)
            found = [(f["line"], f["detail"] if "detail" in f else f.get("match")) for f in data["findings"]]
            self.assertEqual([f["rule"] for f in data["findings"]], ["old-module-format"], found)
            self.assertEqual(data["findings"][0]["line"], 6)

    def test_retired_skill_names_from_installed_records(self):
        with tempfile.TemporaryDirectory() as tmp:
            record = Path(tmp) / "bmod-acme"
            record.mkdir()
            (record / "retired.toml").write_text(
                'renamed = [{ from = "acme-helper", to = "acme" }]\nremoved = ["acme-old-review"]\n', encoding="utf-8"
            )
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\n"
                    "Then invoke the `acme-helper` skill.\n"
                    "Run acme-old-review on the result.\n"
                    "acme-old-review was removed; use the review skill.\n"
                    "The acme-helpers folder is not a skill.\n",
                },
            )
            _, data = scan(skill)
            found = [(f["line"], f["text"], f["fix"]) for f in data["findings"] if f["rule"] == "retired-skill"]
            self.assertEqual(
                found,
                [
                    (6, "acme-helper", "renamed: use `acme`"),
                    (7, "acme-old-review", "retired with no successor: remove the reference"),
                ],
            )

    def test_a_module_never_flags_a_skill_it_still_ships(self):
        with tempfile.TemporaryDirectory() as tmp:
            newer = Path(tmp) / "bmod-newer"
            newer.mkdir()
            (newer / "retired.toml").write_text('removed = ["acme-notes"]\n', encoding="utf-8")
            record = Path(tmp) / "bmod-acme"
            record.mkdir()
            (record / "bmod.toml").write_text(
                '[bmod]\ncode = "acme"\nskills = ["bmad-demo", "acme-notes"]\n', encoding="utf-8"
            )
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\nThen run acme-notes.\n",
                    "bmod.toml": '[skill]\nbmod = "bmod-acme"\n',
                },
            )
            _, data = scan(skill)
            self.assertEqual([f for f in data["findings"] if f["rule"] == "retired-skill"], [])

    def test_absolute_fixture_path_in_eval_cases_fires(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\nBody.\n",
                    "evals/cases.json": json.dumps(
                        {
                            "cases": [
                                {
                                    "files": [
                                        "/tmp/a.md",
                                        "~/.bmad/d.md",
                                        "fixtures/b.md",
                                        "https://github.com/o/r/blob/abc/c.md",
                                    ]
                                }
                            ]
                        }
                    ),
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 1)
            self.assertEqual(rules(data), [("evals/cases.json", "absolute-path")] * 2)

    def test_absolute_fixture_path_in_root_eval_cases_fires(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / ".git").mkdir()
            skill = make_skill(
                root, {"SKILL.md": "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\nBody.\n"}
            )
            cases = root / "evals" / "bmad-demo" / "cases.json"
            cases.parent.mkdir(parents=True)
            cases.write_text(json.dumps([{"files": ["/tmp/a.md", "files/b.md"]}]), encoding="utf-8")
            code, data = scan(skill)
            self.assertEqual(code, 1)
            self.assertEqual(rules(data), [("evals/bmad-demo/cases.json", "absolute-path")])

    def test_root_eval_cases_mirror_the_skill_path_below_skills(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / ".git").mkdir()
            skill = make_skill(
                root / "skills" / "core-tools",
                {"SKILL.md": "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\nBody.\n"},
            )
            for folder in ("evals/core-tools/bmad-demo", "evals/bmad-demo"):
                (root / folder).mkdir(parents=True)
                (root / folder / "cases.json").write_text(json.dumps([{"files": ["/tmp/a.md"]}]), encoding="utf-8")
            code, data = scan(skill)
            self.assertEqual(rules(data), [("evals/core-tools/bmad-demo/cases.json", "absolute-path")])

    def test_python_call_fires_and_uv_run_does_not(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": (
                        "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\n"
                        "Run `python3 scripts/go.py` then `python -m json.tool out.json`.\n"
                        "```\npip install rich\n```\n"
                        'Written in Python with argparse. Fine: `uv run "{skill-root}/scripts/go.py"`.\n'
                    ),
                    "scripts/go.py": "print(1)\n",
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 1)
            hits = [f for f in data["findings"] if f["rule"] == "python-call"]
            self.assertEqual([f["text"] for f in hits], ["python3 scripts/go.py", "python -m json.tool", "pip install"])
            self.assertEqual(len(data["findings"]), 3, data["findings"])

    def test_clean_skill_has_no_findings(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": (
                        "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\n"
                        'Run `uv run "{skill-root}/scripts/go.py"` then read `references/notes.md`.\n'
                        'Runtime: `uv run "{project-root}/_bmad/scripts/resolve_config.py"`.\n'
                        "Invoke the `bmad-eval` skill. Output goes to `{output_folder}/report.md`.\n"
                    ),
                    "references/notes.md": "Back to `../SKILL.md` and `scripts/go.py`.\n",
                    "scripts/go.py": "print(1)\n",
                    "assets/SKILL-template.md": "Emits `references/made-up.md`.\n",
                    "sample-output.md": "Shows `references/other-made-up.md`.\n",
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 0, data)
            self.assertEqual(data["findings"], [])
            self.assertEqual(data["skill"], "bmad-demo")
            self.assertEqual(data["files_scanned"], 4)

    def test_each_rule_fires(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": (
                        "---\nname: bmad-demo\n---\n\n"
                        "Run `uv run scripts/go.py`.\n"
                        "Also `uv run --no-cache ./scripts/go.py`.\n"
                        "Old: {installed_path}/x.md\n"
                        "Mine: /Users/someone/skills/x.md and ~/.claude/skills/y.md\n"
                        "Read `references/missing.md`.\n"
                        "Borrow `skills/bmad-other/references/canon.md`.\n"
                        "Also `{project-root}/_bmad/bmad-other/SKILL.md` but not `{project-root}/_bmad/scripts/resolve_config.py`.\n"
                        "Describe it in module.yaml and module-help.csv.\n"
                        "```\nuv run scripts/in-fence.py\n```\n"
                    ),
                    "references/a.md": "Sibling `../../bmad-other/SKILL.md`. Fine: `../SKILL.md`.\n",
                    "scripts/go.py": "print(1)\n",
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 1)
            found = rules(data)
            self.assertEqual(found.count(("SKILL.md", "bare-script-call")), 3)
            self.assertIn(("SKILL.md", "installed-path"), found)
            self.assertEqual(found.count(("SKILL.md", "absolute-path")), 1)
            self.assertEqual(found.count(("SKILL.md", "missing-file")), 1)
            self.assertEqual(found.count(("SKILL.md", "cross-skill-ref")), 2)
            self.assertEqual(found.count(("SKILL.md", "old-module-format")), 2)
            self.assertEqual(found.count(("references/a.md", "cross-skill-ref")), 1)
            for f in data["findings"]:
                self.assertEqual(set(f), {"path", "line", "rule", "text", "fix"})
                self.assertGreater(f["line"], 0)

    def test_allow_suppresses_a_rule(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp), {"SKILL.md": "Write module.yaml and module-help.csv.\nRun `uv run scripts/x.py`.\n"}
            )
            code, data = scan(skill)
            self.assertEqual(
                sorted(f["rule"] for f in data["findings"]),
                ["bare-script-call", "old-module-format", "old-module-format"],
            )
            res = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    str(skill),
                    "--allow",
                    "old-module-format",
                    "--allow",
                    "bare-script-call",
                ],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0)
            self.assertEqual(json.loads(res.stdout)["findings"], [])
            res = subprocess.run(
                [sys.executable, str(SCRIPT), str(skill), "--allow", "nope"], capture_output=True, text=True
            )
            self.assertEqual(res.returncode, 2)

    def test_skill_root_paths_resolve_in_prose_commands_fences_and_customize(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": (
                        "Read `{skill-root}/modes/nope.md` and `{skill-root}/modes/here.md`.\n"
                        'Run `uv run "{skill-root}/scripts/gone.py" --flag x` then `uv run "{skill-root}/scripts/go.py"`.\n'
                        '```bash\nuv run "{skill-root}/scripts/fenced-gone.py"\n```\n'
                        "Templates: `{skill-root}/references/<name>.md`, `{skill-root}/*.md`, {skill-root}/scripts/.\n"
                        "Escape: `{skill-root}/../bmad-other/SKILL.md`.\n"
                    ),
                    "modes/here.md": "Here.\n",
                    "scripts/go.py": "print(1)\n",
                    "assets/template.md": "Emits `{skill-root}/references/made-up.md`.\n",
                    "customize.toml": (
                        "# `{skill-root}/commented-out.md` is a comment\n"
                        '[[agent.menu]]\ncode = "A"\nprompt = "Read `{skill-root}/modes/missing-menu.md` fully."\n'
                        '[[agent.menu]]\ncode = "B"\nprompt = "Read `{skill-root}/modes/here.md` fully."\n'
                    ),
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 1)
            got = sorted((f["path"], f["line"], f["rule"], f["text"]) for f in data["findings"])
            self.assertEqual(
                got,
                [
                    ("SKILL.md", 1, "missing-file", "{skill-root}/modes/nope.md"),
                    ("SKILL.md", 2, "missing-file", "{skill-root}/scripts/gone.py"),
                    ("SKILL.md", 4, "missing-file", "{skill-root}/scripts/fenced-gone.py"),
                    ("SKILL.md", 7, "cross-skill-ref", "{skill-root}/../bmad-other/SKILL.md"),
                    ("customize.toml", 4, "missing-file", "{skill-root}/modes/missing-menu.md"),
                ],
            )

    def test_unquoted_root_path_in_uv_run(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": (
                        "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\n"
                        "Run `uv run {skill-root}/scripts/go.py --project-root {project-root}`.\n"
                        "Single quotes: `uv run '{skill-root}/scripts/go.py'`.\n"
                        'Partial: `uv run "{skill-root}"/scripts/go.py`.\n'
                        'Fine: `uv run "{skill-root}/scripts/go.py" --project-root "{project-root}"`.\n'
                        "Prose via `uv run`: `{skill-root}/scripts/go.py`.\n"
                        "```bash\n"
                        'uv run "{project-root}/_bmad/scripts/resolve_config.py" \\\n'
                        "  --project-root {project-root}\n"
                        "```\n"
                    ),
                    "scripts/go.py": "print(1)\n",
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 1)
            hits = [(f["line"], f["rule"], f["text"]) for f in data["findings"]]
            self.assertEqual(
                hits,
                [
                    (6, "unquoted-root-path", "{skill-root}/scripts/go.py"),
                    (6, "unquoted-root-path", "{project-root}"),
                    (7, "unquoted-root-path", "'{skill-root}/scripts/go.py'"),
                    (8, "unquoted-root-path", '"{skill-root}"/scripts/go.py'),
                    (13, "unquoted-root-path", "{project-root}"),
                ],
            )

    def test_bare_path_resolving_only_from_the_file_folder_is_reported_with_its_root_form(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": "Read `shapes/a/shape.md`.\n",
                    "shapes/a/shape.md": "Copy `assets/t.md`, then `shapes/a/assets/t.md`, back to `../../SKILL.md`.\n",
                    "shapes/a/assets/t.md": "Template.\n",
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 1)
            self.assertEqual(
                [(f["path"], f["rule"], f["text"]) for f in data["findings"]],
                [("shapes/a/shape.md", "missing-file", "assets/t.md")],
            )
            self.assertIn("`shapes/a/assets/t.md`", data["findings"][0]["fix"])

    def test_bare_path_through_a_symlink_leaving_the_skill_does_not_crash(self):
        with tempfile.TemporaryDirectory() as tmp:
            shared = Path(tmp) / "shared" / "guides"
            shared.mkdir(parents=True)
            (shared / "g.md").write_text("G\n", encoding="utf-8")
            skill = make_skill(
                Path(tmp), {"SKILL.md": "See `shapes/a/shape.md`.\n", "shapes/a/shape.md": "Read `guides/g.md`.\n"}
            )
            (skill / "shapes" / "a" / "guides").symlink_to(shared, target_is_directory=True)
            code, data = scan(skill)
            self.assertEqual(code, 1)
            self.assertEqual(
                [(f["path"], f["rule"], f["text"]) for f in data["findings"]],
                [("shapes/a/shape.md", "missing-file", "guides/g.md")],
            )
            self.assertIn("`shapes/a/guides/g.md`", data["findings"][0]["fix"])

    def test_old_format_named_as_old_and_home_paths_are_not_flagged(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": (
                        "Never write `module.yaml` or `module-help.csv`.\n"
                        "A legacy module.yaml converts in place.\n"
                        "Convert an old-format module (module.yaml, a setup skill).\n"
                        "Drop `module-help.csv` (the v6 format).\n"
                        "Install it in `~/.claude/skills/<name>` or `~/.agents/skills/<name>`.\n"
                        "Then write module.yaml.\n"
                        "Migrate `module-help.csv` into help files.\n"
                        "Legacy config values beat `./assets/module.yaml` defaults.\n"
                        "Never skip a step: read `./assets/module.yaml` first.\n"
                    )
                },
            )
            code, data = scan(skill)
            self.assertEqual(
                [(f["line"], f["rule"]) for f in data["findings"]],
                [
                    (6, "old-module-format"),
                    (7, "old-module-format"),
                    (8, "old-module-format"),
                    (9, "old-module-format"),
                ],
            )

    def test_prose_path_without_existing_folder_is_not_flagged(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), {"SKILL.md": "Writes `docs/plan.md` for the user.\n"})
            code, data = scan(skill)
            self.assertEqual(code, 0, data)

    def test_not_a_directory(self):
        res = subprocess.run([sys.executable, str(SCRIPT), "/nonexistent"], capture_output=True, text=True)
        self.assertEqual(res.returncode, 2)


if __name__ == "__main__":
    unittest.main()
