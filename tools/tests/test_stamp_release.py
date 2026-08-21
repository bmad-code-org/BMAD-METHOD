import contextlib
import importlib.util
import io
import json
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
    'update_source = "github:bmad-code-org/bmad-skills/skills"\n'
)

BMM_SKILLS = ("bmad", "bmad-build", "bmad-spec")
TOOLS_SKILLS = ("bmad-flow",)

MARKETPLACE = {
    "name": "bmad-method",
    "keywords": ["bmad", "agile"],
    "plugins": [
        {
            "name": "bmad-bmm",
            "source": "./",
            "strict": False,
            "version": "6.11.0-next",
            "skills": [f"./skills/{skill}" for skill in BMM_SKILLS],
        },
        {
            "name": "bmad-tools",
            "source": "./",
            "strict": False,
            "version": "6.11.0-next",
            "skills": [f"./skills/{skill}" for skill in TOOLS_SKILLS],
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
    for skill in BMM_SKILLS:
        write(
            root / "skills" / skill / "module-manifest.toml",
            MANIFEST.format(module="bmm", version=version),
        )
    for skill in TOOLS_SKILLS:
        write(
            root / "skills" / skill / "module-manifest.toml",
            MANIFEST.format(module="tools", version=version),
        )
    write_json(root / ".claude-plugin" / "marketplace.json", MARKETPLACE)
    write_json(root / ".codex-plugin" / "plugin.json", PLUGIN)


def marketplace_with(plugins: list[dict]) -> dict:
    return dict(MARKETPLACE, plugins=plugins)


def entry(name: str, skills: list[str], **overrides) -> dict:
    base = {
        "name": name,
        "source": "./",
        "strict": False,
        "version": "6.11.0-next",
        "skills": skills,
    }
    base.update(overrides)
    return base


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

    def test_happy_path_stamps_manifests_and_plugin_metadata(self):
        make_tree(self.root)
        code, out, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        bmm = {(self.root / "skills" / s / "module-manifest.toml").read_bytes() for s in BMM_SKILLS}
        self.assertEqual(len(bmm), 1)  # byte-identical within the module
        self.assertIn(b'version = "1.2.0"\n', bmm.pop())
        tools = (self.root / "skills" / "bmad-flow" / "module-manifest.toml").read_text(
            encoding="utf-8"
        )
        self.assertIn('module = "tools"', tools)
        self.assertIn('version = "1.2.0"', tools)
        marketplace = json.loads(
            (self.root / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8")
        )
        for index, plugin in enumerate(marketplace["plugins"]):
            self.assertEqual(plugin["version"], "1.2.0", f"plugins[{index}]")
        codex = json.loads(
            (self.root / ".codex-plugin" / "plugin.json").read_text(encoding="utf-8")
        )
        self.assertEqual(codex["version"], "1.2.0")
        self.assertIn("Stamped version 1.2.0 into 6 files", out)
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

    def test_manifest_missing_version_key_names_file_and_touches_nothing(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-build" / "module-manifest.toml"
        write(broken, 'module = "bmm"\nupdate_source = "github:bmad-code-org/bmad-skills/skills"\n')
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("skills/bmad-build/module-manifest.toml", err)
        self.assertEqual(snapshot(self.root), before)

    def test_manifest_extra_key_rejected(self):
        make_tree(self.root)
        broken = self.root / "skills" / "bmad-build" / "module-manifest.toml"
        write(broken, MANIFEST.format(module="bmm", version="6.11.0-next") + 'extra = "no"\n')
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("keys must be exactly", err)
        self.assertIn("skills/bmad-build", err)
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
            'module = "bmm"\nversion = "6.11.0-next"\nupdate_source = "github:o/r/skills"\n',
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("update_source must be exactly", err)
        self.assertEqual(snapshot(self.root), before)

    def test_skill_directory_without_manifest_fails_and_touches_nothing(self):
        make_tree(self.root)
        write(self.root / "skills" / "bmad-orphan" / "SKILL.md", "# orphan\n")
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("skills/bmad-orphan", err)
        self.assertIn("module-manifest.toml", err)
        self.assertEqual(snapshot(self.root), before)

    def test_skill_not_listed_in_its_plugin_fails(self):
        make_tree(self.root)
        write(
            self.root / "skills" / "bmad-orphan" / "module-manifest.toml",
            MANIFEST.format(module="bmm", version="6.11.0-next"),
        )
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("bmad-bmm must list ./skills/bmad-orphan", err)
        self.assertEqual(snapshot(self.root), before)

    def test_listed_skill_missing_on_disk_fails(self):
        make_tree(self.root)
        broken = marketplace_with(
            [
                entry("bmad-bmm", [f"./skills/{s}" for s in BMM_SKILLS] + ["./skills/bmad-ghost"]),
                MARKETPLACE["plugins"][1],
            ]
        )
        write_json(self.root / ".claude-plugin" / "marketplace.json", broken)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("./skills/bmad-ghost, which does not exist", err)
        self.assertEqual(snapshot(self.root), before)

    def test_skill_listed_under_wrong_plugin_fails(self):
        make_tree(self.root)
        broken = marketplace_with(
            [
                MARKETPLACE["plugins"][0],
                entry("bmad-tools", ["./skills/bmad-flow", "./skills/bmad"]),
            ]
        )
        write_json(self.root / ".claude-plugin" / "marketplace.json", broken)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn('bmad-tools lists ./skills/bmad, whose manifest says module "bmm"', err)
        self.assertEqual(snapshot(self.root), before)

    def test_skill_listed_twice_in_one_plugin_fails(self):
        make_tree(self.root)
        broken = marketplace_with(
            [
                entry("bmad-bmm", [f"./skills/{s}" for s in BMM_SKILLS] + ["./skills/bmad"]),
                MARKETPLACE["plugins"][1],
            ]
        )
        write_json(self.root / ".claude-plugin" / "marketplace.json", broken)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("lists './skills/bmad' twice", err)
        self.assertEqual(snapshot(self.root), before)

    def test_empty_plugin_with_marketplace_root_source_fails(self):
        root = self.root
        for skill in BMM_SKILLS:
            write(
                root / "skills" / skill / "module-manifest.toml",
                MANIFEST.format(module="bmm", version="6.11.0-next"),
            )
        write_json(
            root / ".claude-plugin" / "marketplace.json",
            marketplace_with(
                [
                    entry("bmad-bmm", [f"./skills/{s}" for s in BMM_SKILLS]),
                    entry("bmad-tools", []),
                ]
            ),
        )
        write_json(root / ".codex-plugin" / "plugin.json", PLUGIN)
        before = snapshot(root)
        code, _, err = run_stamper(root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("bmad-tools has no skills but source \"./\"", err)
        self.assertEqual(snapshot(root), before)

    def test_empty_plugin_with_dedicated_source_is_accepted(self):
        root = self.root
        for skill in BMM_SKILLS:
            write(
                root / "skills" / skill / "module-manifest.toml",
                MANIFEST.format(module="bmm", version="6.11.0-next"),
            )
        write_json(
            root / ".claude-plugin" / "marketplace.json",
            marketplace_with(
                [
                    entry("bmad-bmm", [f"./skills/{s}" for s in BMM_SKILLS]),
                    entry("bmad-tools", [], source="./plugins/tools"),
                ]
            ),
        )
        write_json(root / ".codex-plugin" / "plugin.json", PLUGIN)
        code, _, err = run_stamper(root, "1.2.0")
        self.assertEqual(code, 0, err)

    def test_wrong_marketplace_entry_set_fails(self):
        make_tree(self.root)
        broken = marketplace_with([MARKETPLACE["plugins"][0]])
        write_json(self.root / ".claude-plugin" / "marketplace.json", broken)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("plugin entries must be exactly bmad-bmm, bmad-tools", err)
        self.assertEqual(snapshot(self.root), before)

    def test_marketplace_entry_missing_version_names_its_index(self):
        make_tree(self.root)
        second = dict(MARKETPLACE["plugins"][1])
        del second["version"]
        broken = marketplace_with([MARKETPLACE["plugins"][0], second])
        write_json(self.root / ".claude-plugin" / "marketplace.json", broken)
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("plugins[1].version", err)
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

    def test_formatting_drift_within_module_trips_byte_identity_after_stamp(self):
        make_tree(self.root)
        drifted = self.root / "skills" / "bmad-spec" / "module-manifest.toml"
        write(
            drifted,
            'module = "bmm"\n'
            'version = "6.11.0-next"\n'
            'update_source   =   "github:bmad-code-org/bmad-skills/skills"\n',
        )
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("byte-identical", err)
        self.assertIn("module-manifest.toml", err)
        # The stamp itself was applied before the byte-identity assert tripped.
        self.assertIn('version = "1.2.0"', drifted.read_text(encoding="utf-8"))

    def test_empty_skills_tree_reports_error(self):
        write_json(self.root / ".codex-plugin" / "plugin.json", PLUGIN)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("module-manifest.toml", err)

    def test_orderable_prerelease_is_accepted(self):
        make_tree(self.root)
        code, _, err = run_stamper(self.root, "6.12.0-next.1")
        self.assertEqual(code, 0, err)
        data = tomllib.loads(
            (self.root / "skills" / "bmad" / "module-manifest.toml").read_text(encoding="utf-8")
        )
        self.assertEqual(data["version"], "6.12.0-next.1")


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


if __name__ == "__main__":
    unittest.main()
