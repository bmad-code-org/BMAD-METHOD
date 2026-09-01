import contextlib
import importlib.util
import io
import json
import os
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


REPO_ROOT = Path(__file__).resolve().parents[2]
VALIDATOR = REPO_ROOT / "tools" / "validate_skills.py"
FIXTURES = REPO_ROOT / "tools" / "tests" / "fixtures" / "validate-skills"

JS_JSON_MISSING_TRIGGER = [
    {
        "skill": "tools/tests/fixtures/validate-skills/missing-trigger",
        "rule": "SKILL-04",
        "title": "name Format",
        "severity": "HIGH",
        "file": "SKILL.md",
        "line": None,
        "detail": 'name "missing-trigger" does not match pattern: /^(?:bmad|bmad-[a-z0-9]+(?:-[a-z0-9]+)*)$/',
        "fix": "Rename to comply with lowercase letters, numbers, and hyphens only (max 64 chars).",
    },
    {
        "skill": "tools/tests/fixtures/validate-skills/missing-trigger",
        "rule": "SKILL-06",
        "title": "description Quality",
        "severity": "MEDIUM",
        "file": "SKILL.md",
        "line": None,
        "detail": 'description does not contain "Use when" or "Use if" trigger phrase.',
        "fix": 'Append a "Use when..." clause to explain when to invoke this skill.',
    },
]


def load_validator():
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location("validate_skills", VALIDATOR)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


vs = load_validator()


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def skill_md(name: str, description: str, body: str = "# Body\n\nDo the thing.\n", extra_fm: str = "") -> str:
    return f"---\nname: {name}\ndescription: '{description}'\n{extra_fm}---\n\n{body}"


def findings_by_rule(findings: list[dict], rule: str) -> list[dict]:
    return [f for f in findings if f["rule"] == rule]


class FixtureCase(unittest.TestCase):
    def findings(self, name: str) -> list[dict]:
        return vs.validate_skill(str(FIXTURES / name))

    def has_trigger_finding(self, name: str) -> bool:
        return any(
            f["rule"] == "SKILL-06" and re.search(r"trigger phrase", f["detail"], re.I)
            for f in self.findings(name)
        )

    def test_deprecated_skill_is_exempt_from_trigger_phrase(self):
        self.assertFalse(self.has_trigger_finding("deprecated-shim"))

    def test_active_skill_missing_trigger_phrase_is_flagged(self):
        self.assertTrue(self.has_trigger_finding("missing-trigger"))

    def test_active_skill_with_use_when_is_not_flagged(self):
        self.assertFalse(self.has_trigger_finding("with-trigger"))

    def test_canonical_bmad_root_skill_satisfies_name_format(self):
        self.assertFalse(any(f["rule"] == "SKILL-04" for f in self.findings("bmad")))

    def _json_for(self, name: str) -> list[dict]:
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            code = vs.main(["--json", str(FIXTURES / name)])
        self.assertEqual(code, 0)
        return json.loads(out.getvalue())

    def test_json_matches_js_for_missing_trigger(self):
        self.assertEqual(self._json_for("missing-trigger"), JS_JSON_MISSING_TRIGGER)

    def test_json_matches_js_for_other_fixtures(self):
        deprecated = self._json_for("deprecated-shim")
        self.assertEqual(len(deprecated), 1)
        self.assertEqual(deprecated[0]["rule"], "SKILL-04")
        self.assertEqual(deprecated[0]["skill"], "tools/tests/fixtures/validate-skills/deprecated-shim")

        with_trigger = self._json_for("with-trigger")
        self.assertEqual(len(with_trigger), 1)
        self.assertEqual(with_trigger[0]["rule"], "SKILL-04")
        self.assertFalse(
            any(f["rule"] == "SKILL-06" and re.search(r"trigger phrase", f["detail"], re.I) for f in with_trigger)
        )

        self.assertEqual(self._json_for("bmad"), [])


class ProjectCase(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name)
        self.skills = self.root / "src"
        self.skills.mkdir()
        patcher = mock.patch.dict(os.environ, clear=False)
        patcher.start()
        self.addCleanup(patcher.stop)
        os.environ.pop("GITHUB_ACTIONS", None)
        os.environ.pop("GITHUB_STEP_SUMMARY", None)

    def add_skill(self, dirname: str, content: str, files: dict[str, str] | None = None) -> Path:
        skill = self.skills / dirname
        write(skill / "SKILL.md", content)
        if files:
            for rel, text in files.items():
                write(skill / rel, text)
        return skill

    def valid(self, dirname: str, files: dict[str, str] | None = None) -> Path:
        return self.add_skill(
            dirname,
            skill_md(dirname, f"Helps with {dirname}. Use when the user needs {dirname}."),
            files,
        )

    def run_validator(self, skill_dir=None, strict=False, json_output=False):
        out = io.StringIO()
        err = io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            code = vs.run(
                str(self.root),
                skill_dir=None if skill_dir is None else str(skill_dir),
                strict=strict,
                json_output=json_output,
            )
        return code, out.getvalue(), err.getvalue()

    def findings_for(self, skill: Path) -> list[dict]:
        return vs.validate_skill(str(skill))


class TestRules(ProjectCase):
    def test_skill_01_missing_skill_md(self):
        skill = self.skills / "bmad-empty"
        skill.mkdir()
        findings = self.findings_for(skill)
        self.assertEqual([f["rule"] for f in findings], ["SKILL-01"])
        self.assertEqual(findings[0]["severity"], "CRITICAL")
        self.assertEqual(findings[0]["detail"], "SKILL.md not found in skill directory.")

    def test_skill_02_name_absent_vs_empty(self):
        absent = self.add_skill(
            "bmad-no-name",
            "---\ndescription: 'Does a thing. Use when testing.'\n---\n\n# Body\n",
        )
        empty = self.add_skill(
            "bmad-empty-name",
            "---\nname: ''\ndescription: 'Does a thing. Use when testing.'\n---\n\n# Body\n",
        )
        absent_f = findings_by_rule(self.findings_for(absent), "SKILL-02")
        empty_f = findings_by_rule(self.findings_for(empty), "SKILL-02")
        self.assertEqual(len(absent_f), 1)
        self.assertEqual(absent_f[0]["detail"], "Frontmatter is missing the `name` field.")
        self.assertEqual(absent_f[0]["fix"], "Add `name: <skill-name>` to the frontmatter.")
        self.assertEqual(len(empty_f), 1)
        self.assertEqual(empty_f[0]["detail"], "Frontmatter `name` field is empty.")
        self.assertEqual(empty_f[0]["fix"], "Set `name` to the skill directory name (kebab-case).")

    def test_skill_03_description_absent_vs_empty(self):
        absent = self.add_skill("bmad-no-desc", "---\nname: bmad-no-desc\n---\n\n# Body\n")
        empty = self.add_skill("bmad-empty-desc", "---\nname: bmad-empty-desc\ndescription: ''\n---\n\n# Body\n")
        absent_f = findings_by_rule(self.findings_for(absent), "SKILL-03")
        empty_f = findings_by_rule(self.findings_for(empty), "SKILL-03")
        self.assertEqual(len(absent_f), 1)
        self.assertEqual(absent_f[0]["detail"], "Frontmatter is missing the `description` field.")
        self.assertEqual(absent_f[0]["severity"], "CRITICAL")
        self.assertEqual(len(empty_f), 1)
        self.assertEqual(empty_f[0]["detail"], "Frontmatter `description` field is empty.")

    def test_skill_03_removed_description_strict_exits_1(self):
        skill = self.add_skill("bmad-canary", "---\nname: bmad-canary\n---\n\n# Body\n")
        code, out, _ = self.run_validator(skill_dir=skill, strict=True)
        self.assertEqual(code, 1)
        self.assertIn("[CRITICAL] SKILL-03", out)

    def test_skill_04_invalid_name_uses_js_regex_literal(self):
        skill = self.add_skill(
            "bmad-bad",
            skill_md("NotValid", "Does a thing. Use when testing name format."),
        )
        findings = findings_by_rule(self.findings_for(skill), "SKILL-04")
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["severity"], "HIGH")
        self.assertEqual(
            findings[0]["detail"],
            'name "NotValid" does not match pattern: /^(?:bmad|bmad-[a-z0-9]+(?:-[a-z0-9]+)*)$/',
        )

    def test_skill_05_name_must_match_directory(self):
        skill = self.add_skill(
            "bmad-dir",
            skill_md("bmad-other", "Does a thing. Use when testing directory match."),
        )
        findings = findings_by_rule(self.findings_for(skill), "SKILL-05")
        self.assertEqual(len(findings), 1)
        self.assertEqual(
            findings[0]["detail"],
            'name "bmad-other" does not match directory name "bmad-dir".',
        )

    def test_skill_06_length_and_trigger_subchecks(self):
        long_desc = "Use when testing. " + ("x" * 1024)
        long_skill = self.add_skill("bmad-long", skill_md("bmad-long", long_desc))
        length = findings_by_rule(self.findings_for(long_skill), "SKILL-06")
        self.assertEqual(len(length), 1)
        self.assertIn("characters (max 1024)", length[0]["detail"])
        self.assertNotRegex(length[0]["detail"], re.compile("trigger phrase", re.I))

        missing = self.add_skill(
            "bmad-no-trigger",
            skill_md("bmad-no-trigger", "Generates a thing and writes it to disk."),
        )
        trigger = findings_by_rule(self.findings_for(missing), "SKILL-06")
        self.assertEqual(len(trigger), 1)
        self.assertIn("trigger phrase", trigger[0]["detail"])

        exact = self.add_skill(
            "bmad-exact",
            skill_md("bmad-exact", ("Use when x. " + ("y" * (1024 - len("Use when x. "))))),
        )
        self.assertEqual(findings_by_rule(self.findings_for(exact), "SKILL-06"), [])

    def test_skill_06_deprecated_and_use_if_exempt(self):
        deprecated = self.add_skill(
            "bmad-old",
            skill_md("bmad-old", "DEPRECATED — use bmad-new instead."),
        )
        self.assertEqual(findings_by_rule(self.findings_for(deprecated), "SKILL-06"), [])

        use_if = self.add_skill(
            "bmad-if",
            skill_md("bmad-if", "Does a thing. Use if the user already has a file."),
        )
        self.assertEqual(findings_by_rule(self.findings_for(use_if), "SKILL-06"), [])

    def test_skill_07_empty_body_and_unclosed_frontmatter(self):
        empty = self.add_skill(
            "bmad-nobody",
            "---\nname: bmad-nobody\ndescription: 'Does a thing. Use when testing.'\n---\n",
        )
        unclosed = self.add_skill(
            "bmad-unclosed",
            "---\nname: bmad-unclosed\ndescription: 'Does a thing. Use when testing.'\n",
        )
        empty_f = findings_by_rule(self.findings_for(empty), "SKILL-07")
        unclosed_f = findings_by_rule(self.findings_for(unclosed), "SKILL-07")
        self.assertEqual(len(empty_f), 1)
        self.assertEqual(empty_f[0]["severity"], "HIGH")
        self.assertEqual(len(unclosed_f), 1)

    def test_path_02_frontmatter_key_and_content_line(self):
        skill = self.valid(
            "bmad-path",
            {
                "notes.md": "---\ninstalled_path: .\n---\n\nSee {installed_path}/foo.md\n",
            },
        )
        findings = findings_by_rule(self.findings_for(skill), "PATH-02")
        self.assertGreaterEqual(len(findings), 2)
        self.assertTrue(any("Frontmatter contains `installed_path:` key." == f["detail"] for f in findings))
        self.assertTrue(any(f.get("line") and "reference found in content" in f["detail"] for f in findings))

    def test_path_02_ignores_code_blocks(self):
        skill = self.valid(
            "bmad-path-code",
            {"notes.md": "```\ninstalled_path\n```\n"},
        )
        self.assertEqual(findings_by_rule(self.findings_for(skill), "PATH-02"), [])

    def test_seq_02_patterns_one_per_line_and_eta_case(self):
        skill = self.valid(
            "bmad-seq",
            {
                "workflow.md": "\n".join(
                    [
                        "This takes 5 min to run",
                        "~ 10 min leftover",
                        "See estimated time below",
                        "Ship ETA tomorrow",
                        "lowercase eta is fine",
                        "takes 3 min and estimated time on one line",
                    ]
                )
                + "\n",
            },
        )
        findings = findings_by_rule(self.findings_for(skill), "SEQ-02")
        lines = sorted(f["line"] for f in findings)
        self.assertEqual(lines, [1, 2, 3, 4, 6])
        self.assertFalse(any(f["line"] == 5 for f in findings))
        self.assertEqual(sum(1 for f in findings if f["line"] == 6), 1)

    def test_tpl_01_does_not_strip_code_blocks(self):
        skill = self.valid(
            "bmad-tpl",
            {
                "template.md": "plain {{.name}}\n```\nfenced {{.other}}\n```\n",
                "notes.md": "{{.ignored}}\n",
            },
        )
        findings = findings_by_rule(self.findings_for(skill), "TPL-01")
        self.assertEqual(len(findings), 2)
        self.assertEqual({f["line"] for f in findings}, {1, 3})
        self.assertTrue(any("{{.name}}" in f["detail"] for f in findings))
        self.assertTrue(any("{{.other}}" in f["detail"] for f in findings))

    def test_read_err_on_unreadable_file_continues(self):
        skill = self.valid("bmad-perm", {"secret.md": "ok\n"})
        target = skill / "secret.md"
        os.chmod(target, 0)
        self.addCleanup(os.chmod, target, 0o644)
        findings = findings_by_rule(self.findings_for(skill), "READ-ERR")
        self.assertGreaterEqual(len(findings), 1)
        self.assertEqual(findings[0]["severity"], "MEDIUM")
        self.assertTrue(findings[0]["detail"].startswith("Cannot read file:"))


class TestCliAndOutput(ProjectCase):
    def test_clean_tree_strict_exits_zero(self):
        self.valid("bmad-clean")
        code, out, err = self.run_validator(strict=True)
        self.assertEqual(code, 0)
        self.assertEqual(err, "")
        self.assertIn("Skills scanned: 1", out)
        self.assertIn("Total findings: 0", out)
        self.assertIn("All skills passed validation!", out)

    def test_strict_high_plus_exits_one(self):
        self.add_skill("bmad-high", skill_md("Nope", "Does a thing. Use when testing."))
        code, out, _ = self.run_validator(strict=True)
        self.assertEqual(code, 1)
        self.assertIn("[STRICT MODE] HIGH+ findings found — exiting with failure.", out)

    def test_strict_medium_only_exits_zero(self):
        self.add_skill("bmad-med", skill_md("bmad-med", "Generates a thing with no trigger."))
        code, out, _ = self.run_validator(strict=True)
        self.assertEqual(code, 0)
        self.assertIn("[STRICT MODE] Only MEDIUM/LOW findings — pass.", out)

    def test_warning_mode_high_still_exits_zero(self):
        self.add_skill("bmad-warn", skill_md("Nope", "Does a thing. Use when testing."))
        code, out, _ = self.run_validator(strict=False)
        self.assertEqual(code, 0)
        self.assertIn("Run with --strict to treat HIGH+ findings as errors.", out)

    def test_no_skills_found_exits_two(self):
        code, _, err = self.run_validator(strict=True)
        self.assertEqual(code, 2)
        self.assertEqual(err, "No skill directories found.\n")

    def test_nonexistent_and_nondir_exits_two(self):
        missing = str(self.root / "nope")
        code, _, err = self.run_validator(skill_dir=missing)
        self.assertEqual(code, 2)
        self.assertEqual(err, f'Error: "{missing}" is not a valid directory.\n')

        file_path = self.root / "file.txt"
        file_path.write_text("x\n", encoding="utf-8")
        code, _, err = self.run_validator(skill_dir=file_path)
        self.assertEqual(code, 2)
        self.assertEqual(err, f'Error: "{file_path}" is not a valid directory.\n')

    def test_json_shape_and_severity_sort(self):
        self.add_skill("bmad-json", skill_md("bmad-json", "Generates a thing with no trigger."))
        self.valid("bmad-seq", {"notes.md": "ETA on this line\n"})
        code, out, _ = self.run_validator(json_output=True, strict=True)
        self.assertEqual(code, 0)
        payload = json.loads(out)
        self.assertIsInstance(payload, list)
        self.assertGreaterEqual(len(payload), 2)
        order = [vs.SEVERITY_ORDER[item["severity"]] for item in payload]
        self.assertEqual(order, sorted(order))
        required = {"skill", "rule", "title", "severity", "file", "line", "detail", "fix"}
        for item in payload:
            self.assertEqual(set(item), required)

    def test_json_mode_skips_gha_and_step_summary(self):
        skill = self.add_skill("bmad-json-gha", skill_md("Nope", "Does a thing. Use when testing."))
        summary = self.root / "summary.md"
        os.environ["GITHUB_ACTIONS"] = "1"
        os.environ["GITHUB_STEP_SUMMARY"] = str(summary)
        code, out, _ = self.run_validator(skill_dir=skill, json_output=True, strict=True)
        self.assertEqual(code, 1)
        self.assertNotIn("::warning", out)
        self.assertFalse(summary.exists())

    def test_github_actions_annotation_and_step_summary(self):
        skill = self.add_skill(
            "bmad-gha",
            skill_md("bmad-gha", "Does a thing. Use when testing GHA."),
            {"notes.md": "Ship 100% with ETA\n"},
        )
        summary = self.root / "summary.md"
        os.environ["GITHUB_ACTIONS"] = "1"
        os.environ["GITHUB_STEP_SUMMARY"] = str(summary)
        code, out, _ = self.run_validator(skill_dir=skill, strict=True)
        self.assertEqual(code, 0)
        self.assertIn(
            "::notice file=src/bmad-gha/notes.md,line=1::SEQ-02: Time estimate pattern found: \"Ship 100%25 with ETA\"",
            out,
        )
        text = summary.read_text(encoding="utf-8")
        self.assertTrue(text.startswith("## Skill Validation\n"))
        self.assertIn("| Skill | Rule | Severity | File | Detail |", text)
        self.assertIn("| src/bmad-gha | SEQ-02 | LOW | notes.md |", text)
        self.assertIn("**1 skills scanned, 1 findings**", text)

    def test_nested_skills_discovered_and_sorted(self):
        self.valid("bmad-z")
        nested = self.skills / "group" / "bmad-a"
        write(
            nested / "SKILL.md",
            skill_md("bmad-a", "Nested skill. Use when testing discovery."),
        )
        skipped = self.skills / "node_modules" / "bmad-skip"
        write(
            skipped / "SKILL.md",
            skill_md("bmad-skip", "Should be skipped. Use when never."),
        )
        code, out, _ = self.run_validator(strict=True)
        self.assertEqual(code, 0)
        self.assertIn("Skills scanned: 2", out)

    def test_single_skill_outside_repo(self):
        outside = Path(self._tmp.name) / "outside" / "bmad-out"
        write(
            outside / "SKILL.md",
            skill_md("bmad-out", "Outside skill. Use when testing absolute paths."),
        )
        code, out, _ = self.run_validator(skill_dir=outside, strict=True)
        self.assertEqual(code, 0)
        self.assertIn("Skills scanned: 1", out)


class TestParsers(unittest.TestCase):
    def test_parse_frontmatter_null_and_empty(self):
        self.assertIsNone(vs.parse_frontmatter("no fence\n"))
        self.assertEqual(vs.parse_frontmatter("---\n---\nbody\n"), {})
        self.assertEqual(vs.parse_frontmatter("---\nname: 'quoted'\n---\n"), {"name": "quoted"})

    def test_parse_frontmatter_multiline_continuation_and_comments(self):
        content = "---\nname: bmad-x\ndescription: line1\n  line2\n# ignored\n  line3\n---\n\nBody\n"
        fm = vs.parse_frontmatter_multiline(content)
        self.assertEqual(fm["name"], "bmad-x")
        self.assertEqual(fm["description"], "line1\n  line2\n  line3")


if __name__ == "__main__":
    unittest.main()
