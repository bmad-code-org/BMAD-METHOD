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

SOURCE = "github:bmad-code-org/BMAD-METHOD/skills"

RECORD = (
    "[bmod]\n"
    'code = "{code}"\n'
    'version = "{version}"\n'
    f'update_source = "{SOURCE}"\n'
    "skills = [{skills}]\n"
    "\n"
    "[[bmod.knowledge]]\n"
    'path = "extra.md"\n'
)

SKILL = f'[skill]\nbmod = "{{bmod}}"\nsource = "{SOURCE}"\n'

MEMBERS = {"method": ("bmad-build", "bmad-spec"), "core-tools": ("bmad", "bmad-flow")}


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


def record_text(code: str, version: str) -> str:
    skills = ", ".join(f'"{skill}"' for skill in MEMBERS[code])
    return RECORD.format(code=code, version=version, skills=skills)


def make_tree(root: Path, version: str = "6.11.0-next") -> None:
    for code, members in MEMBERS.items():
        folder = root / "skills" / f"bmod-{code}"
        write(folder / "bmod.toml", record_text(code, version))
        write(folder / "help" / "help.md", "# help\n")
        write(folder / "extra.md", "# extra\n")
        for skill in members:
            write(root / "skills" / skill / "bmod.toml", SKILL.format(bmod=f"bmod-{code}"))


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
        self.root = Path(self._tmp.name).resolve()
        self.method = self.root / "skills" / "bmod-method" / "bmod.toml"

    def assert_refused(self, version: str, *expected: str) -> None:
        before = snapshot(self.root)
        code, _, err = run_stamper(self.root, version)
        self.assertEqual(code, 1)
        for text in expected:
            self.assertIn(text, err)
        self.assertEqual(snapshot(self.root), before)

    def test_happy_path_stamps_every_record_and_no_member_skill(self):
        make_tree(self.root)
        before = snapshot(self.root)
        code, out, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        after = snapshot(self.root)
        changed = sorted(name for name in after if after[name] != before[name])
        self.assertEqual(changed, ["skills/bmod-core-tools/bmod.toml", "skills/bmod-method/bmod.toml"])
        self.assertEqual(self.method.read_text(encoding="utf-8"), record_text("method", "1.2.0"))
        self.assertIn("Stamped version 1.2.0 into 2 files", out)
        self.assertIn("skills/bmod-method/bmod.toml", out)
        self.assertIn("skills/bmod-core-tools/bmod.toml", out)
        self.assertNotIn("skills/bmad-build/bmod.toml", out)

    def test_single_skill_module_is_stamped(self):
        make_tree(self.root)
        notes = self.root / "skills" / "release-notes" / "bmod.toml"
        write(
            notes,
            f'[bmod]\ncode = "notes"\nversion = "6.11.0-next"\nupdate_source = "{SOURCE}"\n\n'
            f'[skill]\nrequired_skills = [{{ skill = "x", version = "1.0.0", source = "{SOURCE}" }}]\n',
        )
        code, out, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        data = tomllib.loads(notes.read_text(encoding="utf-8"))
        self.assertEqual(data["bmod"]["version"], "1.2.0")
        self.assertEqual(data["skill"]["required_skills"][0]["version"], "1.0.0")
        self.assertIn("into 3 files", out)

    def test_non_semver_version_touches_nothing(self):
        make_tree(self.root)
        self.assert_refused("banana", "SemVer")

    def test_dev_prerelease_rejected_with_explanation(self):
        make_tree(self.root)
        self.assert_refused("1.2.0-dev", "-dev", "current")

    def test_build_metadata_rejected_with_explanation(self):
        make_tree(self.root)
        self.assert_refused("1.2.0+hotfix", "build metadata", "'1.2.0'")

    def test_build_metadata_on_prerelease_rejected(self):
        make_tree(self.root)
        self.assert_refused("1.2.0-rc.1+build.5", "build metadata")

    def test_orderable_prerelease_is_accepted(self):
        make_tree(self.root)
        code, _, err = run_stamper(self.root, "6.12.0-next.1")
        self.assertEqual(code, 0, err)
        self.assertEqual(tomllib.loads(self.method.read_text(encoding="utf-8"))["bmod"]["version"], "6.12.0-next.1")

    def test_repository_check_failure_names_the_file_and_touches_nothing(self):
        make_tree(self.root)
        write(self.root / "skills" / "bmad-orphan" / "SKILL.md", "# orphan\n")
        self.assert_refused("1.2.0", "skills/bmad-orphan: missing bmod.toml")

    def test_record_missing_version_key_names_file_and_touches_nothing(self):
        make_tree(self.root)
        write(self.method, record_text("method", "x").replace('version = "x"\n', ""))
        self.assert_refused("1.2.0", "skills/bmod-method/bmod.toml", "'bmod.version'")

    def test_every_problem_is_reported_in_one_run(self):
        make_tree(self.root)
        write(self.root / "skills" / "bmad-orphan" / "SKILL.md", "# orphan\n")
        (self.root / "skills" / "bmod-method" / "help" / "help.md").unlink()
        self.assert_refused("1.2.0", "skills/bmad-orphan", "skills/bmod-method/help/help.md")

    def test_empty_skills_tree_reports_error(self):
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 1)
        self.assertIn("bmod.toml", err)

    def test_tree_with_no_module_record_reports_error(self):
        write(self.root / "skills" / "plain" / "bmod.toml", '[skill]\nbmod = "bmod-x"\nsource = "github:o/r"\n')
        self.assert_refused("1.2.0", "[skill] bmod names 'bmod-x', which is not a module record")

    def test_keys_and_tables_the_stamper_does_not_know_are_left_alone(self):
        make_tree(self.root)
        text = record_text("method", "6.11.0-next").replace(
            'code = "method"\n', 'code = "method"\nfuture_field = ["anything"]\n'
        )
        extra = '\n[bmod.builder]\nversion = "9.9.9"\n\n[other]\nversion = "8.8.8"\nnote = "anything"\n'
        write(self.method, text + extra)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        self.assertEqual(
            self.method.read_text(encoding="utf-8"),
            text.replace('version = "6.11.0-next"', 'version = "1.2.0"') + extra,
        )

    def test_version_in_a_table_before_bmod_is_left_alone(self):
        make_tree(self.root)
        text = '[other]\nversion = "8.8.8"\n\n' + record_text("method", "6.11.0-next")
        write(self.method, text)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        data = tomllib.loads(self.method.read_text(encoding="utf-8"))
        self.assertEqual((data["other"]["version"], data["bmod"]["version"]), ("8.8.8", "1.2.0"))

    def test_requirement_versions_are_left_alone(self):
        make_tree(self.root)
        line = f'required_skills = [{{ skill = "bmad", version = "6.13.0", source = "{SOURCE}" }}]\n'
        text = record_text("method", "6.11.0-next").replace("\n[[bmod.knowledge]]", line + "\n[[bmod.knowledge]]")
        write(self.method, text)
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        stamped = self.method.read_text(encoding="utf-8")
        self.assertIn(line, stamped)
        self.assertIn('version = "1.2.0"\n', stamped)

    def test_indentation_comment_and_line_endings_are_preserved(self):
        make_tree(self.root)
        text = record_text("method", "6.11.0-next").replace(
            'version = "6.11.0-next"\n', '  version   =   "6.11.0-next"  # stamped\n'
        )
        self.method.write_bytes(text.replace("\n", "\r\n").encode("utf-8"))
        code, _, err = run_stamper(self.root, "1.2.0")
        self.assertEqual(code, 0, err)
        expected = text.replace('"6.11.0-next"', '"1.2.0"').replace("\n", "\r\n")
        self.assertEqual(self.method.read_bytes(), expected.encode("utf-8"))

    def test_version_the_stamper_cannot_find_as_a_line_touches_nothing(self):
        make_tree(self.root)
        write(self.method, record_text("method", "x").replace('version = "x"', "version = '6.11.0-next'"))
        self.assert_refused("1.2.0", "skills/bmod-method/bmod.toml", "expected exactly one 'version = \"...\"' line")

    def test_version_lookalike_inside_a_multi_line_string_touches_nothing(self):
        make_tree(self.root)
        note = 'note = """\nversion = "x"\n"""\n'
        text = record_text("method", "6.11.0-next").replace('code = "method"\n', 'code = "method"\n' + note)
        write(self.method, text)
        self.assert_refused("1.2.0", "skills/bmod-method/bmod.toml", "line inside [bmod], found 2")

    def test_only_version_line_being_inside_a_string_touches_nothing(self):
        make_tree(self.root)
        note = 'note = """\nversion = "x"\n"""\n'
        text = record_text("method", "x").replace('version = "x"\n', "version = '6.11.0-next'\n" + note)
        write(self.method, text)
        self.assert_refused("1.2.0", "skills/bmod-method/bmod.toml", "would change something other than")

    def test_bmod_written_without_a_table_header_touches_nothing(self):
        make_tree(self.root)
        write(
            self.method,
            f'bmod = {{ code = "method", version = "6.11.0-next", update_source = "{SOURCE}" }}\n',
        )
        for skill in MEMBERS["method"]:
            (self.root / "skills" / skill / "bmod.toml").unlink()
            (self.root / "skills" / skill).rmdir()
        self.assert_refused("1.2.0", "skills/bmod-method/bmod.toml", "expected exactly one '[bmod]' table header")


class StampedContentTests(unittest.TestCase):
    def test_only_the_bmod_table_version_changes(self):
        original = '[a]\nversion = "1"\n[bmod]\ncode = "x"\nversion = "2"\n[[bmod.knowledge]]\nversion = "3"\n'
        stamped = sr.validator.stamp_text(original, "9.9.9")
        self.assertEqual(stamped, original.replace('version = "2"', 'version = "9.9.9"'))

    def test_two_version_lines_inside_bmod_are_refused(self):
        with self.assertRaises(ValueError):
            sr.validator.stamp_text('[bmod]\nversion = "1"\nversion = "2"\n', "9.9.9")


class InstallerContractTests(unittest.TestCase):
    """Pin the version rules the stamper adds on top of skills/bmad/scripts/setup.py.

    If setup.py's rules drift, these fail instead of shipping a release an
    installed module cannot order.
    """

    def test_stamper_uses_the_runtime_semver(self):
        self.assertEqual(sr.setup.SEMVER.pattern, setup.SEMVER.pattern)

    def test_validate_version_accepts_exactly_what_setup_can_distinguish(self):
        """Accept a version only if setup.py can both order it and tell it apart.

        Build metadata is orderable but not distinguishing: setup.py drops it,
        so `1.2.0+hotfix` compares equal to `1.2.0` and a release stamped that
        way is invisible to an installed module. The stamper is stricter than
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
