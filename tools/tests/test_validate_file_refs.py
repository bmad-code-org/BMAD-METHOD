import contextlib
import importlib.util
import io
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


REPO_ROOT = Path(__file__).resolve().parents[2]
VALIDATOR = REPO_ROOT / "tools" / "validate_file_refs.py"


def load_validator():
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location("validate_file_refs", VALIDATOR)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


vfr = load_validator()


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


class ProjectCase(unittest.TestCase):
    """Base for tests that run the validator over a temp project tree."""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name)
        self.skills = self.root / "skills"
        self.skills.mkdir()
        self.skill = self.skills / "skillx"
        self.skill.mkdir()
        # CI env vars would change output and write annotation files
        patcher = mock.patch.dict(os.environ, clear=False)
        patcher.start()
        self.addCleanup(patcher.stop)
        os.environ.pop("GITHUB_ACTIONS", None)
        os.environ.pop("GITHUB_STEP_SUMMARY", None)

    def run_validator(self, strict=False, verbose=False):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            code = vfr.run(str(self.root), strict=strict, verbose=verbose)
        return code, out.getvalue()


class TestMarkdownExtraction(unittest.TestCase):
    def extract(self, content):
        return vfr.extract_markdown_refs("/x/file.md", content)

    def test_all_pattern_types(self):
        content = "\n".join(
            [
                "See {project-root}/_bmad/scripts/memlog.py for details.",
                "Load `references/help.md` and `steps/step-02.md` now.",
                "Also `data/things.toml` applies.",
            ]
        )
        refs = self.extract(content)
        by_type = {}
        for r in refs:
            by_type.setdefault(r.type, []).append(r.raw)
        self.assertEqual(by_type["project-root"], ["scripts/memlog.py"])
        self.assertEqual(
            by_type["skill-relative"],
            ["references/help.md", "steps/step-02.md", "data/things.toml"],
        )

    def test_backtick_prose_forms_skipped(self):
        content = "\n".join(
            [
                "Globs like `references/mode-*.md` are prose.",
                "Placeholders `stories/<id>-file.md` and `custom/{skill-name}.toml` too.",
                "Absolute `/etc/conf.md`, dotted `./x/y.md` and `../up/z.md`,",
                "install-side `_bmad/config.toml`, and at-form `@dir/AGENTS.md`.",
                "Bare filenames like `prd.md` have no slash and are ignored.",
            ]
        )
        self.assertEqual(self.extract(content), [])

    def test_line_numbers(self):
        content = "one\ntwo\n{project-root}/_bmad/bmm/x.md\nsee `references/y.md`\n"
        refs = self.extract(content)
        self.assertEqual([(r.raw, r.line) for r in refs], [("bmm/x.md", 3), ("references/y.md", 4)])

    def test_code_blocks_stripped(self):
        content = "```\n{project-root}/_bmad/bmm/fenced.md\n`references/fenced.md`\n```\n{project-root}/_bmad/bmm/live.md\n"
        refs = self.extract(content)
        self.assertEqual([r.raw for r in refs], ["bmm/live.md"])
        self.assertEqual(refs[0].line, 5)

    def test_json_example_blocks_stripped(self):
        content = '{\n  "file": "./fake.md"\n}\n'
        self.assertEqual(self.extract(content), [])

    def test_unresolvable_refs_skipped(self):
        content = "Mustache {project-root}/_bmad/bmm/{{name}}/file.md is skipped.\n"
        self.assertEqual(self.extract(content), [])


class TestYamlExtraction(unittest.TestCase):
    def test_refs_with_lines_and_keys(self):
        content = (
            "steps:\n"
            "  - file: '{project-root}/_bmad/bmm/workflows/w.md'\n"
        )
        refs = vfr.extract_yaml_refs("/x/file.yaml", content)
        self.assertEqual(len(refs), 1)
        self.assertEqual(refs[0].raw, "{project-root}/_bmad/bmm/workflows/w.md")
        self.assertEqual(refs[0].type, "project-root")
        self.assertEqual(refs[0].line, 2)
        self.assertEqual(refs[0].key, "steps[0].file")

    def test_unresolvable_skipped(self):
        content = "out: '{output_folder}/x.md'\n"
        self.assertEqual(vfr.extract_yaml_refs("/x/f.yaml", content), [])

    def test_multi_document_yaml_scans_all_documents(self):
        content = (
            "a: '{project-root}/_bmad/bmm/one.md'\n"
            "---\n"
            "b: '{project-root}/_bmad/bmm/two.md'\n"
        )
        refs = vfr.extract_yaml_refs("/x/f.yaml", content)
        self.assertEqual(
            [(r.raw, r.line) for r in refs],
            [("{project-root}/_bmad/bmm/one.md", 1), ("{project-root}/_bmad/bmm/two.md", 3)],
        )

    def test_invalid_yaml_returns_empty(self):
        self.assertEqual(vfr.extract_yaml_refs("/x/f.yaml", "key: [unclosed\n  bad: ::\n"), [])


class TestMapping(unittest.TestCase):
    def map(self, ref):
        return vfr.map_installed_to_source(ref, "/repo/skills")

    def test_mappings(self):
        self.assertEqual(self.map("{project-root}/_bmad/scripts/memlog.py"), "/repo/skills/bmad/scripts/memlog.py")
        self.assertEqual(self.map("{_bmad}/scripts/resolve_config.py"), "/repo/skills/bmad/scripts/resolve_config.py")
        self.assertEqual(self.map("_bmad/scripts/render_skill.py"), "/repo/skills/bmad/scripts/render_skill.py")
        self.assertEqual(self.map("other/file.md"), "/repo/skills/other/file.md")

    def test_install_only_paths_skipped(self):
        for ref in (
            "_config/settings.yaml",
            "custom/mine.md",
            "render/bmad-build/x.md",
            "render/bmad-build-auto/x.md",
        ):
            self.assertIsNone(self.map(ref), ref)

    def test_install_generated_files_skipped(self):
        self.assertIsNone(self.map("bmm/config.yaml"))
        self.assertIsNone(self.map("bmm/_cfg/config.user.yaml"))


class TestLeakDetection(unittest.TestCase):
    def test_leaks_found_with_line_numbers(self):
        content = "clean\n/Users/alice/secret.md\nC:\\\\Temp\\\\x\nalso /home/bob/y\n"
        leaks = vfr.check_absolute_path_leaks("/x/f.md", content)
        self.assertEqual([(leak.line, leak.content) for leak in leaks], [
            (2, "/Users/alice/secret.md"),
            (3, "C:\\\\Temp\\\\x"),
            (4, "also /home/bob/y"),
        ])

    def test_code_blocks_ignored(self):
        content = "```\n/Users/fenced/path\n```\n"
        self.assertEqual(vfr.check_absolute_path_leaks("/x/f.md", content), [])


class TestRunClassification(ProjectCase):
    def test_clean_tree_exits_zero(self):
        write(self.skill / "references" / "real.md", "target\n")
        write(self.skill / "doc.md", "See `references/real.md` now.\n")
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 0)
        self.assertIn("References checked: 1", out)
        self.assertIn("All file references valid!", out)

    def test_broken_vs_unresolved(self):
        (self.skill / "references").mkdir()
        write(
            self.skill / "doc.md",
            "Read `references/gone.md` now.\nAlso {project-root}/_bmad/core/no-such-dir here.\n",
        )
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 1)
        self.assertIn("[BROKEN] references/gone.md (line 1)", out)
        self.assertIn("[UNRESOLVED] core/no-such-dir (line 2)", out)
        self.assertIn("Broken references: 2", out)

    def test_skill_root_resolution(self):
        write(self.skill / "references" / "help.md", "target\n")
        write(self.skill / "deep" / "doc.md", "Load `references/help.md` now.\n")
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 0)
        self.assertIn("References checked: 1", out)
        self.assertIn("Broken references: 0", out)

    def test_prose_path_not_flagged(self):
        write(self.skill / "doc.md", "Outputs land in `no-such-dir/thing.md` later.\n")
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 0)
        # extracted (counted) but its first directory exists nowhere, so it is prose
        self.assertIn("References checked: 1", out)
        self.assertIn("Broken references: 0", out)

    def test_stray_file_in_skills_root(self):
        write(self.skills / "loose.md", "content\n")
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 1)
        self.assertIn("[STRAY] loose.md: files may not sit directly under skills/", out)
        self.assertIn("Stray files under skills/: 1", out)

    def test_leak_reported_in_run(self):
        write(self.skill / "doc.md", "path is /Users/leaky/file\n")
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 1)
        self.assertIn("[ABS-PATH] Line 1: path is /Users/leaky/file", out)
        self.assertIn("Absolute path leaks: 1", out)

    def test_default_mode_warns_but_exits_zero(self):
        (self.skill / "references").mkdir()
        write(self.skill / "doc.md", "Read `references/gone.md` now.\n")
        code, out = self.run_validator(strict=False)
        self.assertEqual(code, 0)
        self.assertIn("[BROKEN]", out)
        self.assertIn("Run with --strict to treat warnings as errors.", out)

    def test_install_only_ref_not_counted_as_broken(self):
        write(self.skill / "doc.md", "Uses {project-root}/_bmad/_config/settings.yaml here.\n")
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 0)
        # extracted (counted) but skipped by the install-only list, so not broken
        self.assertIn("References checked: 1", out)
        self.assertIn("Broken references: 0", out)

    def test_yaml_file_scanned(self):
        write(self.skill / "wf.yaml", "step: '{project-root}/_bmad/bmm/missing.md'\n")
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 1)
        self.assertIn("[BROKEN] {project-root}/_bmad/bmm/missing.md (line 1)", out)

    def test_invalid_utf8_does_not_crash(self):
        (self.skill / "references").mkdir()
        path = self.skill / "bad.md"
        path.write_bytes(b"Read `references/gone.md` now.\n\xff\xfe binary junk\n")
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 1)
        self.assertIn("[BROKEN] references/gone.md (line 1)", out)

    def test_github_actions_annotations_and_step_summary(self):
        (self.skill / "references").mkdir()
        write(self.skill / "doc.md", "Read `references/gone.md` now.\n")
        summary_path = self.root / "step-summary.md"
        os.environ["GITHUB_ACTIONS"] = "1"
        os.environ["GITHUB_STEP_SUMMARY"] = str(summary_path)
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 1)
        self.assertIn("::warning file=skills/skillx/doc.md,line=1::Broken reference: references/gone.md", out)
        summary = summary_path.read_text(encoding="utf-8")
        self.assertIn("| File | Line | Reference | Issue |", summary)
        self.assertIn("| skills/skillx/doc.md | 1 | references/gone.md | broken ref |", summary)
        self.assertIn("1 issues found", summary)

    def test_csv_files_not_scanned(self):
        write(self.skill / "data.csv", "workflow-file\n{project-root}/_bmad/bmm/missing.md\n")
        code, out = self.run_validator(strict=True)
        self.assertEqual(code, 0)
        self.assertIn("Files scanned: 0", out)


if __name__ == "__main__":
    unittest.main()
