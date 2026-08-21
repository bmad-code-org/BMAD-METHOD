import contextlib
import importlib.util
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
STAMPER = REPO_ROOT / "tools" / "stamp_release.py"
SETUP_PY = REPO_ROOT / "skills" / "bmad" / "scripts" / "setup.py"

MANIFEST = (
    'module = "bmm"\n'
    'version = "{version}"\n'
    'update_source = "github:bmad-code-org/bmad-skills/skills"\n'
)

MARKETPLACE = {
    "name": "bmad-method",
    "keywords": ["bmad", "agile"],
    "plugins": [
        {
            "name": "bmad-bmm",
            "version": "6.11.0-next",
        },
        {
            "name": "bmad-tools",
            "version": "6.11.0-next",
        },
    ],
}

PLUGIN = {
    "name": "bmad-method",
    "version": "6.11.0-next",
    "description": "Full-lifecycle AI development framework — em dash stays literal",
}

JSON_PATHS = (
    ".claude-plugin/marketplace.json",
    "plugins/bmad-bmm/.claude-plugin/plugin.json",
    "plugins/bmad-tools/.claude-plugin/plugin.json",
    ".codex-plugin/plugin.json",
)


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


def write_json(path: Path, data: dict) -> None:
    write(path, json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def make_tree(root: Path, version: str = "6.11.0-next") -> None:
    for skill in ("bmad", "bmad-build", "bmad-spec"):
        write(root / "skills" / skill / "module-manifest.toml", MANIFEST.format(version=version))
    write_json(root / ".claude-plugin" / "marketplace.json", MARKETPLACE)
    write_json(root / "plugins" / "bmad-bmm" / ".claude-plugin" / "plugin.json", PLUGIN)
    write_json(root / "plugins" / "bmad-tools" / ".claude-plugin" / "plugin.json", PLUGIN)
    write_json(root / ".codex-plugin" / "plugin.json", PLUGIN)


def snapshot(root: Path) -> dict[str, bytes]:
    return {
        path.relative_to(root).as_posix(): path.read_bytes()
        for path in sorted(root.rglob("*"))
        if path.is_file()
    }


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

    def test_happy_path_stamps_manifests_and_plugin_jsons(self):
        make_tree(self.root)
        code, out, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        manifests = sorted(self.root.glob("skills/*/module-manifest.toml"))
        self.assertEqual(len(manifests), 3)
        contents = {path.read_bytes() for path in manifests}
        self.assertEqual(len(contents), 1)
        self.assertIn(b'version = "1.2.0"\n', contents.pop())
        for rel in JSON_PATHS:
            data = json.loads((self.root / rel).read_text(encoding="utf-8"))
            if "marketplace" in rel:
                for index, entry in enumerate(data["plugins"]):
                    self.assertEqual(entry["version"], "1.2.0", f"{rel} plugins[{index}]")
            else:
                self.assertEqual(data["version"], "1.2.0", rel)
        self.assertIn("Stamped version 1.2.0 into 7 files", out)
        for rel in ("skills/bmad/module-manifest.toml", *JSON_PATHS):
            self.assertIn(rel, out)

    def test_json_output_keeps_two_space_indent_trailing_newline_and_unicode(self):
        make_tree(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        text = (self.root / ".codex-plugin" / "plugin.json").read_text(encoding="utf-8")
        self.assertTrue(text.endswith("}\n"))
        self.assertIn('\n  "version": "1.2.0",\n', text)
        self.assertIn("—", text)
        self.assertNotIn("\\u2014", text)

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

    def test_manifest_missing_version_line_names_file_and_touches_nothing(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-build" / "module-manifest.toml"
        write(broken, 'module = "bmm"\nupdate_source = "github:o/r/skills"\n')
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("skills/bmad-build/module-manifest.toml", err)
        self.assertEqual(snapshot(self.root), before)

    def test_divergent_manifests_trip_uniformity_assert_after_stamp(self):
        make_tree(self.root)
        divergent = self.root / "skills" / "bmad-spec" / "module-manifest.toml"
        write(
            divergent,
            'module = "other"\nversion = "6.11.0-next"\nupdate_source = "github:o/r/skills"\n',
        )
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("byte-identical", err)
        self.assertIn("module-manifest.toml", err)
        # The stamp itself was applied before the uniformity assert tripped.
        self.assertIn('version = "1.2.0"', divergent.read_text(encoding="utf-8"))

    def test_marketplace_missing_version_key_names_file_and_key(self):
        make_tree(self.root)
        broken = dict(MARKETPLACE, plugins=[{"name": "bmad-method-analyze-plan-build"}])
        write_json(self.root / ".claude-plugin" / "marketplace.json", broken)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn(".claude-plugin/marketplace.json", err)
        self.assertIn("plugins[0].version", err)
        self.assertEqual(snapshot(self.root), before)

    def test_second_marketplace_entry_missing_version_names_its_index(self):
        make_tree(self.root)
        broken = dict(MARKETPLACE, plugins=[MARKETPLACE["plugins"][0], {"name": "bmad-tools"}])
        write_json(self.root / ".claude-plugin" / "marketplace.json", broken)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("plugins[1].version", err)
        self.assertEqual(snapshot(self.root), before)

    def test_marketplace_entry_count_must_match_plugin_manifests(self):
        make_tree(self.root)
        broken = dict(MARKETPLACE, plugins=[MARKETPLACE["plugins"][0]])
        write_json(self.root / ".claude-plugin" / "marketplace.json", broken)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("lists 1 plugins but found 2", err)
        self.assertEqual(snapshot(self.root), before)

    def test_version_key_outside_the_target_node_is_not_stamped(self):
        make_tree(self.root)
        decoy = dict(PLUGIN, metadata={"version": "9.9.9"})
        write_json(self.root / ".codex-plugin" / "plugin.json", decoy)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn(".codex-plugin/plugin.json", err)
        self.assertIn("expected exactly 1", err)
        self.assertEqual(snapshot(self.root), before)

    def test_plugin_json_missing_version_key_names_file_and_key(self):
        make_tree(self.root)
        write_json(self.root / ".codex-plugin" / "plugin.json", {"name": "bmad-method"})
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn(".codex-plugin/plugin.json", err)
        self.assertIn("version", err)
        self.assertEqual(snapshot(self.root), before)

    def test_same_version_is_idempotent(self):
        make_tree(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        after_first = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        self.assertEqual(snapshot(self.root), after_first)

    def test_empty_skills_tree_reports_error(self):
        write_json(self.root / ".codex-plugin" / "plugin.json", PLUGIN)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("module-manifest.toml", err)

    def test_orderable_prerelease_is_accepted(self):
        make_tree(self.root)
        code, _, err = run_stamper(self.root, "6.12.0-next.1")
        self.assertEqual(code, 0, err)
        data = tomllib_version(self.root / "skills" / "bmad" / "module-manifest.toml")
        self.assertEqual(data, "6.12.0-next.1")


class InstallerContractTests(unittest.TestCase):
    """Pin the version rules duplicated from skills/bmad/scripts/setup.py.

    If setup.py's rules drift, these fail instead of shipping a release the
    installed copies cannot order.
    """

    def test_semver_regex_matches_setup(self):
        self.assertEqual(sr.SEMVER.pattern, setup.SEMVER.pattern)

    def test_validate_version_accepts_exactly_what_setup_can_order(self):
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
            orderable = setup.parse_orderable_semver(version) is not None
            try:
                sr.validate_version(version)
                accepted = True
            except sr.StampError:
                accepted = False
            self.assertEqual(accepted, orderable, version)


def tomllib_version(path: Path) -> str:
    import tomllib

    return tomllib.loads(path.read_text(encoding="utf-8"))["version"]


if __name__ == "__main__":
    unittest.main()
