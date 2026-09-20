import contextlib
import importlib.util
import io
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
VALIDATOR = REPO_ROOT / "tools" / "validate_manifests.py"

SOURCE = "github:bmad-code-org/BMAD-METHOD/skills"

METHOD_RECORD = (
    "[bmod]\n"
    'code = "method"\n'
    'version = "{version}"\n'
    f'update_source = "{SOURCE}"\n'
    'skills = ["bmad-build", "bmad-spec"]\n'
    'required_skills = ["bmad"]\n'
    "\n"
    "[[bmod.knowledge]]\n"
    'path = "delivery-help.md"\n'
    'skills = ["bmad-build"]\n'
)

CORE_TOOLS_RECORD = (
    "[bmod]\n"
    'code = "core-tools"\n'
    'version = "{version}"\n'
    f'update_source = "{SOURCE}"\n'
    'skills = ["bmad", "bmad-flow"]\n'
)

SKILL = f'[skill]\nbmod = "{{bmod}}"\nsource = "{SOURCE}"\n'

ROSTER = (
    "[[members]]\n"
    'code = "bmad-build"\n'
    'skill = "bmad-build"\n'
    'name = "Amelia"\n'
    "\n"
    "[[members]]\n"
    'code = "guest"\n'
    'name = "Guest"\n'
    "\n"
    "[[groups]]\n"
    'id = "team"\n'
    'members = ["bmad-build", "guest"]\n'
)

MEMBERS = {"bmod-method": ("bmad-build", "bmad-spec"), "bmod-core-tools": ("bmad", "bmad-flow")}


def load_module(name: str, path: Path):
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


vm = load_module("validate_manifests", VALIDATOR)


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def make_tree(root: Path, version: str = "6.11.0-next") -> None:
    skills = root / "skills"
    write(skills / "bmod-method" / "bmod.toml", METHOD_RECORD.format(version=version))
    write(skills / "bmod-method" / "help" / "help.md", "# help\n")
    write(skills / "bmod-method" / "delivery-help.md", "# delivery\n")
    write(skills / "bmod-method" / "roster.toml", ROSTER)
    write(skills / "bmod-core-tools" / "bmod.toml", CORE_TOOLS_RECORD.format(version=version))
    write(skills / "bmod-core-tools" / "help" / "help.md", "# help\n")
    for bmod, members in MEMBERS.items():
        write(skills / bmod / "SKILL.md", "# record\n")
        for skill in members:
            write(skills / skill / "bmod.toml", SKILL.format(bmod=bmod))
            write(skills / skill / "SKILL.md", "# skill\n")


class ValidatorCase(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name).resolve()
        self.skills = self.root / "skills"
        make_tree(self.root)

    def problems(self) -> str:
        return "\n".join(vm.check_repo(self.root).problems)

    def method_record(self, old: str, new: str) -> None:
        path = self.skills / "bmod-method" / "bmod.toml"
        text = path.read_text(encoding="utf-8")
        self.assertIn(old, text)
        write(path, text.replace(old, new))


class CleanTreeTests(ValidatorCase):
    def test_clean_tree_has_no_problems_and_reports_its_records(self):
        report = vm.check_repo(self.root)
        self.assertEqual(report.problems, ())
        self.assertEqual(
            [path.relative_to(self.root).as_posix() for path in report.records],
            ["skills/bmod-core-tools/bmod.toml", "skills/bmod-method/bmod.toml"],
        )
        self.assertEqual((report.skills, report.documents), (4, 3))

    def test_unknown_keys_and_tables_are_left_alone(self):
        self.method_record('code = "method"\n', 'code = "method"\nfuture_field = ["anything"]\n')
        path = self.skills / "bmod-method" / "bmod.toml"
        write(path, path.read_text(encoding="utf-8") + '\n[builder]\nversion = "9.9.9"\n')
        write(
            self.skills / "bmad-spec" / "bmod.toml",
            SKILL.format(bmod="bmod-method") + "later = true\n\n[extra]\nx = 1\n",
        )
        self.assertEqual(self.problems(), "")

    def test_single_skill_module_is_valid_under_any_folder_name(self):
        write(
            self.skills / "release-notes" / "bmod.toml",
            '[bmod]\ncode = "notes"\nversion = "6.11.0-next"\nupdate_source = "github:acme/notes"\n\n[skill]\n',
        )
        write(self.skills / "release-notes" / "help" / "help.md", "# help\n")
        self.assertEqual(self.problems(), "")

    def test_module_with_no_skills_is_valid(self):
        write(
            self.skills / "bmod-rooms" / "bmod.toml",
            f'[bmod]\ncode = "rooms"\nversion = "6.11.0-next"\nupdate_source = "{SOURCE}"\n',
        )
        write(self.skills / "bmod-rooms" / "help" / "help.md", "# help\n")
        self.assertEqual(self.problems(), "")

    def test_empty_skills_tree_is_a_problem(self):
        empty = self.root / "empty"
        empty.mkdir()
        self.assertIn("no skills/*/bmod.toml found", "\n".join(vm.check_repo(empty).problems))

    def test_main_exit_codes(self):
        out, err = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            code = vm.main(["--project-root", str(self.root)])
        self.assertEqual(code, 0, err.getvalue())
        self.assertIn("4 skills, 2 module records, 3 knowledge documents", out.getvalue())
        (self.skills / "bmad-flow" / "bmod.toml").unlink()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            code = vm.main(["--project-root", str(self.root)])
        self.assertEqual(code, 1)
        self.assertIn("skills/bmad-flow: missing bmod.toml", err.getvalue())


class FileRuleTests(ValidatorCase):
    def test_skill_folder_without_a_bmod_file(self):
        write(self.skills / "bmad-orphan" / "SKILL.md", "# orphan\n")
        self.assertIn("skills/bmad-orphan: missing bmod.toml", self.problems())

    def test_file_the_runtime_parser_rejects(self):
        write(self.skills / "bmad-spec" / "bmod.toml", 'note = "neither table"\n')
        problems = self.problems()
        self.assertIn("skills/bmad-spec/bmod.toml: the runtime parser rejects this file", problems)
        self.assertIn("[bmod] table, a [skill] table, or both", problems)

    def test_record_missing_a_required_key(self):
        self.method_record('version = "6.11.0-next"\n', "")
        problems = self.problems()
        self.assertIn("skills/bmod-method/bmod.toml", problems)
        self.assertIn("'bmod.version'", problems)

    def test_skill_missing_a_required_key(self):
        write(self.skills / "bmad-spec" / "bmod.toml", '[skill]\nbmod = "bmod-method"\n')
        problems = self.problems()
        self.assertIn("skills/bmad-spec/bmod.toml", problems)
        self.assertIn("'skill.source'", problems)

    def test_github_source_with_two_parts_is_accepted(self):
        write(self.skills / "bmad-spec" / "bmod.toml", '[skill]\nbmod = "bmod-method"\nsource = "github:o/r"\n')
        self.assertEqual(self.problems(), "")

    def test_github_source_with_one_part_is_rejected(self):
        write(self.skills / "bmad-spec" / "bmod.toml", '[skill]\nbmod = "bmod-method"\nsource = "github:o"\n')
        self.assertIn("github source must name owner/repo", self.problems())


class RecordRuleTests(ValidatorCase):
    def test_record_folder_not_named_after_its_code(self):
        (self.skills / "bmod-method").rename(self.skills / "bmod-bmad-method")
        for skill in MEMBERS["bmod-method"]:
            write(self.skills / skill / "bmod.toml", SKILL.format(bmod="bmod-bmad-method"))
        self.assertIn(
            "skills/bmod-bmad-method/bmod.toml: a module record folder is named 'bmod-method'", self.problems()
        )

    def test_second_record_for_one_code(self):
        write(
            self.skills / "bmod-zeta" / "bmod.toml",
            f'[bmod]\ncode = "method"\nversion = "6.11.0-next"\nupdate_source = "{SOURCE}"\n\n[skill]\n',
        )
        self.assertIn(
            "skills/bmod-zeta/bmod.toml: module code 'method' is already declared by skills/bmod-method/bmod.toml",
            self.problems(),
        )

    def test_codes_differing_only_by_case(self):
        write(
            self.skills / "upper" / "bmod.toml",
            f'[bmod]\ncode = "Method"\nversion = "6.11.0-next"\nupdate_source = "{SOURCE}"\n\n[skill]\n',
        )
        self.assertIn("module code 'Method' is already declared by", self.problems())

    def test_records_with_different_versions(self):
        self.method_record('version = "6.11.0-next"', 'version = "6.12.0"')
        problems = self.problems()
        self.assertIn("every module record carries one version", problems)
        self.assertIn("bmod-method has '6.12.0'", problems)


class StampRuleTests(ValidatorCase):
    def test_record_the_stamper_cannot_stamp(self):
        self.method_record('version = "6.11.0-next"', "version = '6.11.0-next'")
        self.assertIn(
            "skills/bmod-method/bmod.toml: tools/stamp_release.py cannot stamp this file: expected exactly one "
            "'version = \"...\"' line inside [bmod], found 0",
            self.problems(),
        )

    def test_version_lookalike_inside_a_multi_line_string(self):
        self.method_record('code = "method"\n', 'code = "method"\nnote = """\nversion = "x"\n"""\n')
        self.assertIn("cannot stamp this file", self.problems())

    def test_the_check_writes_nothing(self):
        path = self.skills / "bmod-method" / "bmod.toml"
        before = path.read_bytes()
        self.assertEqual(self.problems(), "")
        self.assertEqual(path.read_bytes(), before)


class MembershipRuleTests(ValidatorCase):
    def test_skill_naming_a_record_the_repo_lacks(self):
        write(self.skills / "bmad-spec" / "bmod.toml", SKILL.format(bmod="bmod-absent"))
        self.assertIn(
            "skills/bmad-spec/bmod.toml: [skill] bmod names 'bmod-absent', which is not a module record",
            self.problems(),
        )

    def test_skill_naming_a_folder_that_is_not_a_record(self):
        write(self.skills / "bmad-spec" / "bmod.toml", SKILL.format(bmod="bmad-build"))
        self.assertIn("[skill] bmod names 'bmad-build', which is not a module record", self.problems())

    def test_skill_its_record_does_not_list(self):
        write(self.skills / "bmad-extra" / "bmod.toml", SKILL.format(bmod="bmod-method"))
        self.assertIn(
            "skills/bmad-extra/bmod.toml: [skill] bmod names 'bmod-method', but skills/bmod-method/bmod.toml "
            "does not list 'bmad-extra'",
            self.problems(),
        )

    def test_listed_skill_the_repo_does_not_ship(self):
        self.method_record('["bmad-build", "bmad-spec"]', '["bmad-build", "bmad-spec", "bmad-typo"]')
        self.assertIn(
            "skills/bmod-method/bmod.toml: lists the skill 'bmad-typo', which this repository does not ship",
            self.problems(),
        )

    def test_listed_skill_that_names_another_record(self):
        write(self.skills / "bmad-spec" / "bmod.toml", SKILL.format(bmod="bmod-core-tools"))
        self.assertIn(
            "skills/bmod-method/bmod.toml: lists the skill 'bmad-spec', but skills/bmad-spec/bmod.toml names "
            "'bmod-core-tools' as its bmod",
            self.problems(),
        )

    def test_listed_folder_that_is_a_record(self):
        self.method_record('["bmad-build", "bmad-spec"]', '["bmad-build", "bmad-spec", "bmod-core-tools"]')
        self.assertIn("lists 'bmod-core-tools', which is a module record", self.problems())

    def test_record_with_skill_table_left_out_of_its_own_list(self):
        write(
            self.skills / "notes" / "bmod.toml",
            f'[bmod]\ncode = "notes"\nversion = "6.11.0-next"\nupdate_source = "{SOURCE}"\nskills = []\n\n[skill]\n',
        )
        self.assertIn("skills/notes/bmod.toml: holds [skill], but its own [bmod] skills list leaves", self.problems())


class RequirementRuleTests(ValidatorCase):
    def add(self, folder: str, line: str) -> None:
        path = self.skills / folder / "bmod.toml"
        write(path, path.read_text(encoding="utf-8") + line)

    def test_plain_names_in_this_repo_are_accepted_in_both_tables(self):
        self.add("bmad-build", 'required_skills = ["bmad"]\nrecommended_skills = ["bmad-spec"]\n')
        self.assertEqual(self.problems(), "")

    def test_required_plain_name_the_repo_lacks(self):
        self.add("bmad-build", 'required_skills = ["bmad-typo"]\n')
        self.assertIn(
            "skills/bmad-build/bmod.toml: skill.required_skills entry 'bmad-typo' names no skill in this repository",
            self.problems(),
        )

    def test_recommended_plain_name_the_repo_lacks(self):
        self.add("bmad-build", 'recommended_skills = ["bmad-typo"]\n')
        self.assertIn("skill.recommended_skills entry 'bmad-typo' names no skill", self.problems())

    def test_record_plain_name_the_repo_lacks(self):
        self.method_record('required_skills = ["bmad"]', 'required_skills = ["bmad-typo"]')
        self.assertIn(
            "skills/bmod-method/bmod.toml: bmod.required_skills entry 'bmad-typo' names no skill", self.problems()
        )

    def test_table_entry_from_another_repo_is_accepted(self):
        self.add(
            "bmad-build", 'required_skills = [{ skill = "elsewhere", version = "1.0.0", source = "github:o/r" }]\n'
        )
        self.assertEqual(self.problems(), "")

    def test_table_entry_without_a_source(self):
        self.add("bmad-build", 'required_skills = [{ skill = "bmad", version = "6.13.0" }]\n')
        self.assertIn("'skill.required_skills[0].source' must be a string", self.problems())

    def test_version_with_build_metadata(self):
        self.add("bmad-build", f'required_skills = [{{ skill = "bmad", version = "6.13.0+x", source = "{SOURCE}" }}]\n')
        problems = self.problems()
        self.assertIn("entry 'bmad' version '6.13.0+x' carries build metadata", problems)
        self.assertIn("'6.13.0'", problems)

    def test_unorderable_version(self):
        self.add("bmad-build", f'required_skills = [{{ skill = "bmad", version = "6.13", source = "{SOURCE}" }}]\n')
        self.assertIn("'skill.required_skills[0].version' must be an orderable version", self.problems())


class PathRuleTests(ValidatorCase):
    def test_help_file_a_bmod_folder_does_not_ship(self):
        (self.skills / "bmod-method" / "help" / "help.md").unlink()
        self.assertIn(
            "skills/bmod-method/help/help.md, which every bmod-* folder holds, the module record does not ship",
            self.problems(),
        )

    def test_help_file_is_optional_outside_a_bmod_folder(self):
        write(
            self.skills / "solo" / "bmod.toml",
            f'[bmod]\ncode = "solo"\nversion = "6.11.0-next"\nupdate_source = "{SOURCE}"\n\n[skill]\n',
        )
        write(self.skills / "solo" / "SKILL.md", "# skill\n")
        self.assertEqual(self.problems(), "")

    def test_help_symlink(self):
        target = self.skills / "bmod-method" / "help" / "help.md"
        target.unlink()
        target.symlink_to(self.skills / "bmod-method" / "delivery-help.md")
        self.assertIn("skills/bmod-method/help/help.md, which every bmod-* folder holds, is a symlink", self.problems())

    def test_topic_file_named_in_help_is_valid(self):
        write(self.skills / "bmod-method" / "help" / "help.md", "# help\n\nSee `help/deep-dive.md`.\n")
        write(self.skills / "bmod-method" / "help" / "deep-dive.md", "# deep dive\n")
        self.assertEqual(self.problems(), "")

    def test_topic_file_help_never_names(self):
        write(self.skills / "bmod-method" / "help" / "orphan.md", "# orphan\n")
        self.assertIn("skills/bmod-method/help/orphan.md is never named in help/help.md", self.problems())

    def test_help_naming_a_topic_file_that_does_not_exist(self):
        write(self.skills / "bmod-method" / "help" / "help.md", "# help\n\nSee `help/gone.md`.\n")
        self.assertIn(
            "skills/bmod-method/help/help.md names skills/bmod-method/help/gone.md, which does not exist",
            self.problems(),
        )

    def test_topic_file_naming_a_topic_that_does_not_exist(self):
        write(self.skills / "bmod-method" / "help" / "help.md", "# help\n\nSee `help/deep-dive.md`.\n")
        write(self.skills / "bmod-method" / "help" / "deep-dive.md", "See `help/gone.md`.\n")
        self.assertIn(
            "skills/bmod-method/help/deep-dive.md names skills/bmod-method/help/gone.md, which does not exist",
            self.problems(),
        )

    def test_knowledge_naming_the_help_file(self):
        self.method_record('path = "delivery-help.md"', 'path = "help/help.md"')
        self.assertIn("knowledge names 'help/help.md', which is always read", self.problems())

    def test_knowledge_file_the_record_does_not_ship(self):
        (self.skills / "bmod-method" / "delivery-help.md").unlink()
        self.assertIn(
            "skills/bmod-method/bmod.toml: knowledge names 'delivery-help.md', which the module record does not ship",
            self.problems(),
        )

    def test_knowledge_url(self):
        self.method_record('path = "delivery-help.md"', 'path = "https://docs.example.com/help.md"')
        self.assertIn("unsafe value", self.problems())

    def test_knowledge_path_leaving_the_folder(self):
        self.method_record('path = "delivery-help.md"', 'path = "../bmad-build/SKILL.md"')
        self.assertIn("unsafe value", self.problems())

    def test_knowledge_directory(self):
        (self.skills / "bmod-method" / "delivery-help.md").unlink()
        (self.skills / "bmod-method" / "delivery-help.md").mkdir()
        self.assertIn("knowledge names 'delivery-help.md', which is not a regular file", self.problems())

    def test_knowledge_symlink(self):
        target = self.skills / "bmod-method" / "delivery-help.md"
        target.unlink()
        target.symlink_to(self.skills / "bmod-method" / "help" / "help.md")
        self.assertIn("knowledge names 'delivery-help.md', which is a symlink", self.problems())

    def test_knowledge_naming_a_skill_outside_the_module(self):
        self.method_record('skills = ["bmad-build"]\n', 'skills = ["bmad-build", "bmad-flow"]\n')
        self.assertIn(
            "knowledge 'delivery-help.md' names 'bmad-flow', which is not a skill of module 'method'",
            self.problems(),
        )

    def test_a_module_without_a_roster_file_is_valid(self):
        (self.skills / "bmod-method" / "roster.toml").unlink()
        self.assertEqual(self.problems(), "")

    def test_roster_symlink(self):
        target = self.skills / "bmod-method" / "roster.toml"
        target.unlink()
        target.symlink_to(self.skills / "bmod-method" / "help" / "help.md")
        self.assertIn("skills/bmod-method/roster.toml is a symlink", self.problems())

    def test_roster_that_is_not_toml(self):
        write(self.skills / "bmod-method" / "roster.toml", "[[members\n")
        self.assertIn("skills/bmod-method/roster.toml: cannot read roster", self.problems())


class RosterContentTests(ValidatorCase):
    def roster(self, old: str, new: str) -> None:
        self.assertIn(old, ROSTER)
        write(self.skills / "bmod-method" / "roster.toml", ROSTER.replace(old, new))

    def test_member_code_defined_twice(self):
        self.roster('code = "guest"', 'code = "bmad-build"')
        self.assertIn("skills/bmod-method/roster.toml: member code 'bmad-build' is defined twice", self.problems())

    def test_group_naming_an_undefined_member(self):
        self.roster('members = ["bmad-build", "guest"]', 'members = ["bmad-build", "nobody"]')
        self.assertIn("group 'team' lists 'nobody', which no member defines", self.problems())

    def test_member_skill_the_repo_does_not_ship(self):
        self.roster('skill = "bmad-build"', 'skill = "bmad-typo"')
        self.assertIn(
            "member 'bmad-build' names skill 'bmad-typo', which this repository does not ship", self.problems()
        )


if __name__ == "__main__":
    unittest.main()
