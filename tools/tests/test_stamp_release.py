import contextlib
import importlib.util
import io
import sys
import tempfile
import tomllib
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
STAMPER = REPO_ROOT / "tools" / "stamp_release.py"
SETUP_PY = REPO_ROOT / "skills" / "bmad" / "scripts" / "setup.py"

MANIFEST = (
    'module = "{module}"\n'
    'version = "{version}"\n'
    'update_source = "github:bmad-code-org/BMAD-METHOD/skills"\n'
    'knowledge = ["references/help.md"]\n'
)

METHOD_SKILLS = ("bmad", "bmad-build", "bmad-spec")
CORE_TOOLS_SKILLS = ("bmad-flow",)


def load_module(name: str, path: Path):
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


sr = load_module("stamp_release", STAMPER)
setup = load_module("bmad_setup_stamp_contract", SETUP_PY)


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def make_tree(root: Path, version: str = "6.11.0-next") -> None:
    for skill in METHOD_SKILLS:
        write(
            root / "skills" / skill / "module-manifest.toml",
            MANIFEST.format(module="method", version=version),
        )
    for skill in CORE_TOOLS_SKILLS:
        write(
            root / "skills" / skill / "module-manifest.toml",
            MANIFEST.format(module="core-tools", version=version),
        )
    for skill in (*METHOD_SKILLS, *CORE_TOOLS_SKILLS):
        write(root / "skills" / skill / "references" / "help.md", "# help\n")


def snapshot(root: Path) -> dict[str, bytes]:
    return {path.relative_to(root).as_posix(): path.read_bytes() for path in sorted(root.rglob("*")) if path.is_file()}


def run_stamper(root: Path, version: str) -> tuple[int, str, str]:
    out, err = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        code = sr.run(root, version)
    return code, out.getvalue(), err.getvalue()


class StampReleaseTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name)

    def test_happy_path_stamps_every_manifest(self):
        make_tree(self.root)
        code, out, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        method = {(self.root / "skills" / s / "module-manifest.toml").read_bytes() for s in METHOD_SKILLS}
        self.assertEqual(len(method), 1)  # byte-identical within the module
        self.assertIn(b'version = "1.2.0"\n', method.pop())
        core_tools = (self.root / "skills" / "bmad-flow" / "module-manifest.toml").read_text(encoding="utf-8")
        self.assertIn('module = "core-tools"', core_tools)
        self.assertIn('version = "1.2.0"', core_tools)
        self.assertIn("Stamped version 1.2.0 into 4 files", out)
        self.assertIn("skills/bmad/module-manifest.toml", out)
        self.assertIn("skills/bmad-flow/module-manifest.toml", out)

    def test_non_semver_version_touches_nothing(self):
        make_tree(self.root)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "banana")
        self.assertEqual(code, 1)
        self.assertIn("SemVer", err)
        self.assertEqual(snapshot(self.root), before)

    def test_dev_prerelease_rejected_with_explanation(self):
        make_tree(self.root)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0-dev")
        self.assertEqual(code, 1)
        self.assertIn("-dev", err)
        self.assertIn("current", err)
        self.assertEqual(snapshot(self.root), before)

    def test_build_metadata_rejected_with_explanation(self):
        make_tree(self.root)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0+hotfix")
        self.assertEqual(code, 1)
        self.assertIn("build metadata", err)
        self.assertIn("'1.2.0'", err)
        self.assertEqual(snapshot(self.root), before)

    def test_build_metadata_on_prerelease_rejected(self):
        make_tree(self.root)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0-rc.1+build.5")
        self.assertEqual(code, 1)
        self.assertIn("build metadata", err)
        self.assertEqual(snapshot(self.root), before)

    def test_manifest_missing_version_key_names_file_and_touches_nothing(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-build" / "module-manifest.toml"
        write(
            broken,
            'module = "method"\n'
            'update_source = "github:bmad-code-org/BMAD-METHOD/skills"\n'
            'knowledge = ["references/help.md"]\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("skills/bmad-build/module-manifest.toml", err)
        self.assertEqual(snapshot(self.root), before)

    def test_manifest_extra_key_rejected(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-build" / "module-manifest.toml"
        write(broken, MANIFEST.format(module="method", version="6.11.0-next") + 'extra = "no"\n')
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("manifest keys must be", err)
        self.assertIn("skills/bmad-build", err)
        self.assertEqual(snapshot(self.root), before)

    def test_requires_accepted_and_preserved(self):
        make_tree(self.root)
        for skill in METHOD_SKILLS:
            write(
                self.root / "skills" / skill / "module-manifest.toml",
                MANIFEST.format(module="method", version="6.11.0-next")
                + 'requires = { bmad = { version = "6.13.0" } }\n',
            )
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        stamped = (self.root / "skills" / "bmad-build" / "module-manifest.toml").read_text(encoding="utf-8")
        self.assertIn('requires = { bmad = { version = "6.13.0" } }', stamped)
        self.assertIn('version = "1.2.0"', stamped)

    def test_requires_is_per_skill_and_need_not_match_across_a_module(self):
        make_tree(self.root)
        write(
            self.root / "skills" / "bmad-build" / "module-manifest.toml",
            MANIFEST.format(module="method", version="6.11.0-next") + 'requires = { bmad = { version = "6.13.0" } }\n',
        )
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        build = (self.root / "skills" / "bmad-build" / "module-manifest.toml").read_text(encoding="utf-8")
        spec = (self.root / "skills" / "bmad-spec" / "module-manifest.toml").read_text(encoding="utf-8")
        self.assertIn('requires = { bmad = { version = "6.13.0" } }', build)
        self.assertNotIn("requires", spec)

    def test_requires_naming_an_unshipped_skill_without_a_source_is_rejected(self):
        make_tree(self.root)
        write(
            self.root / "skills" / "bmad-build" / "module-manifest.toml",
            MANIFEST.format(module="method", version="6.11.0-next")
            + 'requires = { bmad-typo = { version = "6.13.0" } }\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("names no skill in this repository", err)
        self.assertEqual(snapshot(self.root), before)

    def test_requires_naming_another_repository_with_a_source_is_accepted(self):
        make_tree(self.root)
        write(
            self.root / "skills" / "bmad-build" / "module-manifest.toml",
            MANIFEST.format(module="method", version="6.11.0-next")
            + 'requires = { elsewhere = { version = "1.0.0", source = "github:o/r/skills" } }\n',
        )
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)

    def test_requires_build_metadata_rejected(self):
        make_tree(self.root)
        write(
            self.root / "skills" / "bmad-build" / "module-manifest.toml",
            MANIFEST.format(module="method", version="6.11.0-next")
            + 'requires = { bmad = { version = "6.13.0+x" } }\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("build metadata", err)
        self.assertEqual(snapshot(self.root), before)

    def test_requires_unorderable_version_rejected(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-build" / "module-manifest.toml"
        write(
            broken,
            MANIFEST.format(module="method", version="6.11.0-next") + 'requires = { bmad = { version = "6.13" } }\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("requires.bmad.version", err)
        self.assertEqual(snapshot(self.root), before)

    def test_unknown_module_rejected(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-spec" / "module-manifest.toml"
        write(broken, MANIFEST.format(module="other", version="6.11.0-next"))
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("unknown module 'other'", err)
        self.assertEqual(snapshot(self.root), before)

    def test_wrong_update_source_rejected(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-spec" / "module-manifest.toml"
        write(
            broken,
            'module = "method"\n'
            'version = "6.11.0-next"\n'
            'update_source = "github:o/r/skills"\n'
            'knowledge = ["references/help.md"]\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("update_source must be exactly", err)
        self.assertEqual(snapshot(self.root), before)

    def test_knowledge_string_rejected(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-spec" / "module-manifest.toml"
        write(
            broken,
            'module = "method"\n'
            'version = "6.11.0-next"\n'
            'update_source = "github:bmad-code-org/BMAD-METHOD/skills"\n'
            'knowledge = "references/help.md"\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("knowledge must be a non-empty list", err)
        self.assertEqual(snapshot(self.root), before)

    def test_knowledge_url_rejected(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-spec" / "module-manifest.toml"
        write(
            broken,
            'module = "method"\n'
            'version = "6.11.0-next"\n'
            'update_source = "github:bmad-code-org/BMAD-METHOD/skills"\n'
            'knowledge = ["https://docs.example.com/help.md"]\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("unsafe value", err)
        self.assertEqual(snapshot(self.root), before)

    def test_knowledge_naming_an_unshipped_file_rejected(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-spec" / "module-manifest.toml"
        write(
            broken,
            'module = "method"\n'
            'version = "6.11.0-next"\n'
            'update_source = "github:bmad-code-org/BMAD-METHOD/skills"\n'
            'knowledge = ["references/absent.md"]\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("which the skill does not ship", err)
        self.assertEqual(snapshot(self.root), before)

    def test_knowledge_copies_must_be_identical(self):
        make_tree(self.root)
        write(self.root / "skills" / "bmad-spec" / "references" / "help.md", "# different\n")
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("every copy must be identical", err)
        self.assertEqual(snapshot(self.root), before)

    def test_skills_of_one_module_may_carry_different_knowledge(self):
        make_tree(self.root)
        write(self.root / "skills" / "bmad-spec" / "references" / "extra.md", "# extra\n")
        write(
            self.root / "skills" / "bmad-spec" / "module-manifest.toml",
            'module = "method"\n'
            'version = "6.11.0-next"\n'
            'update_source = "github:bmad-code-org/BMAD-METHOD/skills"\n'
            'knowledge = ["references/help.md", "references/extra.md"]\n',
        )
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        stamped = (self.root / "skills" / "bmad-spec" / "module-manifest.toml").read_text(encoding="utf-8")
        self.assertIn('knowledge = ["references/help.md", "references/extra.md"]', stamped)
        self.assertIn('version = "1.2.0"', stamped)

    def test_skill_directory_without_manifest_fails_and_touches_nothing(self):
        make_tree(self.root)
        write(self.root / "skills" / "bmad-orphan" / "SKILL.md", "# orphan\n")
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("skills/bmad-orphan", err)
        self.assertIn("module-manifest.toml", err)
        self.assertEqual(snapshot(self.root), before)

    def test_formatting_drift_within_module_is_tolerated(self):
        # Module copies are compared on parsed fields, not bytes, so that skills
        # of one module can carry different knowledge documents.
        make_tree(self.root)
        drifted = self.root / "skills" / "bmad-spec" / "module-manifest.toml"
        write(
            drifted,
            'module = "method"\n'
            'version = "6.11.0-next"\n'
            'update_source   =   "github:bmad-code-org/BMAD-METHOD/skills"\n'
            'knowledge = ["references/help.md"]\n',
        )
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        self.assertIn('version = "1.2.0"', drifted.read_text(encoding="utf-8"))

    def test_differing_module_field_within_module_is_rejected(self):
        # config_questions is module-level, so it must agree across the module.
        make_tree(self.root)
        write(
            self.root / "skills" / "bmad-spec" / "module-manifest.toml",
            MANIFEST.format(module="method", version="6.11.0-next")
            + '\n[[config_questions]]\nkey = "out"\nprompt = "Where?"\ndefault = "x"\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertEqual(snapshot(self.root), before)

    def test_empty_skills_tree_reports_error(self):
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("module-manifest.toml", err)

    def test_orderable_prerelease_is_accepted(self):
        make_tree(self.root)
        code, _, err = run_stamper(self.root, "6.12.0-next.1")
        self.assertEqual(code, 0, err)
        data = tomllib.loads((self.root / "skills" / "bmad" / "module-manifest.toml").read_text(encoding="utf-8"))
        self.assertEqual(data["version"], "6.12.0-next.1")


class InstallerContractTests(unittest.TestCase):
    """Pin the version rules duplicated from skills/bmad/scripts/setup.py.

    If setup.py's rules drift, these fail instead of shipping a release the
    installed copies cannot order.
    """

    def test_semver_regex_matches_setup(self):
        self.assertEqual(sr.SEMVER.pattern, setup.SEMVER.pattern)

    def test_validate_version_accepts_exactly_what_setup_can_distinguish(self):
        """Accept a version only if setup.py can both order it and tell it apart.

        Build metadata is orderable but not distinguishing: setup.py drops it,
        so `1.2.0+hotfix` compares equal to `1.2.0` and a release stamped that
        way is invisible to installed copies. The stamper is stricter than
        orderability by exactly that much.
        """
        candidates = (
            "1.2.0",
            "0.0.1",
            "6.12.0-next.1",
            "1.2.0-rc.1+build.5",
            "1.2.0+hotfix",
            "banana",
            "1.2",
            "01.2.0",
            "1.2.0-dev",
            "1.2.0-DEV",
            "1.2.0-dev.1",
            "",
        )
        for version in candidates:
            parsed = setup.parse_orderable_semver(version)
            distinguishable = parsed is not None and "+" not in version
            try:
                sr.validate_version(version)
                accepted = True
            except sr.StampError:
                accepted = False
            self.assertEqual(accepted, distinguishable, version)

    def test_setup_orders_build_metadata_as_equal(self):
        """The premise of the rejection above, pinned against setup.py itself."""
        self.assertEqual(
            setup.parse_orderable_semver("1.2.0+hotfix"),
            setup.parse_orderable_semver("1.2.0"),
        )


if __name__ == "__main__":
    unittest.main()
