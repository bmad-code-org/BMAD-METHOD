import csv
import sys
import tempfile
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import package_npx_skills  # noqa: E402


REPO_ROOT = Path(__file__).resolve().parents[2]
SHARED_SCRIPTS = package_npx_skills.SHARED_SCRIPTS
HELP_CSV_HEADER = package_npx_skills.HELP_CSV_HEADER
SHIM_ONLY_IDS = frozenset(
    {
        "bmad-editorial-review-prose",
        "bmad-editorial-review-structure",
        "bmad-editorial-review",
        "bmad-review-adversarial-general",
        "bmad-review-edge-case-hunter",
        "bmad-review-verification-gap",
        "bmad-create-architecture",
        "bmad-create-prd",
        "bmad-create-story",
        "bmad-dev-auto",
        "bmad-dev-story",
        "bmad-document-project",
        "bmad-domain-research",
        "bmad-edit-prd",
        "bmad-market-research",
        "bmad-quick-dev",
        "bmad-sprint-status",
        "bmad-technical-research",
        "bmad-validate-prd",
    }
)


def write(path: Path, content: str = "x\n") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def write_skill(root: Path, rel: str) -> Path:
    skill = root / rel
    write(skill / "SKILL.md", "---\nname: test\n---\n")
    return skill


def csv_records(path: Path) -> list[tuple[str, ...]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.reader(handle)
        next(reader, None)
        return [tuple(row) for row in reader if any(cell.strip() for cell in row)]


def method_skill_ids(repo: Path) -> set[str]:
    ids: set[str] = set()
    for root_name in ("core-skills", "bmm-skills"):
        root = repo / "src" / root_name
        for skill_md in root.rglob("SKILL.md"):
            if "v6-shims" in skill_md.parts or skill_md.parent.name == "bmad-help":
                continue
            ids.add(skill_md.parent.name)
    return ids


def run_packager(repo: Path, out: Path) -> None:
    package_npx_skills.main(["--repo-root", str(repo), "--out", str(out)])


class PackageNpxSkillsTests(unittest.TestCase):
    def test_flatten_method_skills_drops_nesting_and_v6_shims(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir) / "repo"
            out = Path(temp_dir) / "out"
            write_skill(repo, "src/core-skills/bmad-review")
            write_skill(repo, "src/bmm-skills/plan/bmad-prd")
            write_skill(repo, "src/core-skills/v6-shims/bmad-old")

            run_packager(repo, out)

            dest = out / "skills"
            self.assertTrue((dest / "bmad-review" / "SKILL.md").is_file())
            self.assertTrue((dest / "bmad-prd" / "SKILL.md").is_file())
            self.assertFalse((dest / "plan").exists())
            self.assertFalse((dest / "v6-shims").exists())
            self.assertFalse((dest / "bmad-old").exists())
            self.assertEqual(
                sorted(p.name for p in dest.iterdir()),
                ["bmad-prd", "bmad-review"],
            )

    def test_skip_junk(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir) / "repo"
            out = Path(temp_dir) / "out"
            skill = write_skill(repo, "src/core-skills/bmad-review")
            write(skill / ".DS_Store", "junk")
            write(skill / "__pycache__" / "mod.cpython-311.pyc", "cache")
            write(skill / "foo.pyc", "bytecode")
            write(skill / "keep.txt", "keep")
            write_skill(repo, "src/bmm-skills/plan/bmad-prd")

            run_packager(repo, out)

            dest_skill = out / "skills" / "bmad-review"
            self.assertTrue((dest_skill / "SKILL.md").is_file())
            self.assertTrue((dest_skill / "keep.txt").is_file())
            self.assertFalse((dest_skill / ".DS_Store").exists())
            self.assertFalse((dest_skill / "__pycache__").exists())
            self.assertFalse((dest_skill / "foo.pyc").exists())

    def test_dest_bmad_gets_scripts_and_assets_and_excludes_bmad_help(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir) / "repo"
            out = Path(temp_dir) / "out"
            self._write_bmad_payload(repo)
            write_skill(repo, "src/core-skills/bmad")
            write_skill(repo, "src/core-skills/bmad-help")
            write_skill(repo, "src/bmm-skills/plan/bmad-prd")

            run_packager(repo, out)

            dest_bmad = out / "skills" / "bmad"
            dest_scripts = dest_bmad / "scripts"
            self.assertEqual(
                sorted(p.name for p in dest_scripts.iterdir()),
                [
                    "config_utils.py",
                    "memlog.py",
                    "render_skill.py",
                    "resolve_config.py",
                    "resolve_customization.py",
                ],
            )
            for name in SHARED_SCRIPTS:
                self.assertEqual(
                    (dest_scripts / name).read_text(encoding="utf-8"),
                    f"# {name}\n",
                )
            self.assertFalse((dest_scripts / "tests").exists())
            source_assets = repo / "src" / "core-skills" / "bmad" / "assets"
            for path in source_assets.iterdir():
                self.assertEqual(
                    (dest_bmad / "assets" / path.name).read_bytes(),
                    path.read_bytes(),
                    path.name,
                )
            dest_csv = dest_bmad / "assets" / "bmad-help.csv"
            self.assertEqual(dest_csv.read_text(encoding="utf-8").splitlines()[0], HELP_CSV_HEADER)
            self.assertEqual(
                set(csv_records(dest_csv)),
                {
                    (
                        "Core",
                        "bmad-help",
                        "BMad Help",
                        "BH",
                        "",
                        "",
                        "",
                        "anytime",
                        "",
                        "",
                        "false",
                        "",
                        "",
                    ),
                    (
                        "BMad Method",
                        "bmad-prd",
                        "Create PRD",
                        "PRD",
                        "",
                        "",
                        "",
                        "plan",
                        "",
                        "",
                        "true",
                        "planning_artifacts",
                        "prd",
                    ),
                },
            )
            self.assertFalse((out / "skills" / "bmad-help").exists())
            source_bmad = repo / "src" / "core-skills" / "bmad"
            self.assertEqual(
                {p.name for p in source_bmad.iterdir() if p.name != "__pycache__"}
                - {"assets"},
                {"SKILL.md"},
            )

    def test_other_skill_stays_lean(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir) / "repo"
            out = Path(temp_dir) / "out"
            self._write_bmad_payload(repo)
            write_skill(repo, "src/core-skills/bmad")
            write_skill(repo, "src/core-skills/bmad-help")
            write_skill(repo, "src/bmm-skills/plan/bmad-prd")

            run_packager(repo, out)

            dest_prd = out / "skills" / "bmad-prd"
            for name in SHARED_SCRIPTS:
                self.assertEqual(list(dest_prd.rglob(name)), [])
            self.assertFalse((dest_prd / "assets" / "bmad-help.csv").exists())

    def test_replace_dest_skills(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir) / "repo"
            out = Path(temp_dir) / "out"
            write_skill(repo, "src/core-skills/bmad-review")
            write_skill(repo, "src/bmm-skills/plan/bmad-prd")
            write(out / "skills" / "stale-id" / "SKILL.md", "stale\n")

            run_packager(repo, out)

            self.assertFalse((out / "skills" / "stale-id").exists())
            self.assertTrue((out / "skills" / "bmad-prd" / "SKILL.md").is_file())
            self.assertTrue((out / "skills" / "bmad-review" / "SKILL.md").is_file())

    def test_missing_core_skills_leaves_dest_untouched(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir) / "repo"
            out = Path(temp_dir) / "out"
            write_skill(repo, "src/bmm-skills/plan/bmad-prd")
            write(out / "skills" / "stale-id" / "keep.txt", "keep\n")

            with self.assertRaises(FileNotFoundError) as ctx:
                run_packager(repo, out)

            self.assertIn("core-skills", str(ctx.exception))
            self.assertIn("missing", str(ctx.exception).lower())
            self.assertTrue((out / "skills" / "stale-id" / "keep.txt").is_file())
            self.assertFalse((out / "skills" / "bmad-prd").exists())

    def test_missing_bmm_skills_does_not_create_dest_skills(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir) / "repo"
            out = Path(temp_dir) / "out"
            write_skill(repo, "src/core-skills/bmad-review")

            with self.assertRaises(FileNotFoundError) as ctx:
                run_packager(repo, out)

            self.assertIn("bmm-skills", str(ctx.exception))
            self.assertIn("missing", str(ctx.exception).lower())
            self.assertFalse((out / "skills").exists())

    def test_bad_help_csv_header_leaves_dest_untouched(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo, out = self._bmad_repo_with_stale_dest(temp_dir)
            write(
                repo / "src" / "core-skills" / "module-help.csv",
                "not,the,header\nCore,bmad-help,BMad Help,BH,,,,anytime,,,false,,\n",
            )

            with self.assertRaises(ValueError) as ctx:
                run_packager(repo, out)

            self.assertIn("header", str(ctx.exception).lower())
            self.assertTrue((out / "skills" / "stale-id" / "keep.txt").is_file())
            self.assertFalse((out / "skills" / "bmad").exists())

    def test_empty_help_csv_leaves_dest_untouched(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo, out = self._bmad_repo_with_stale_dest(temp_dir)
            write(repo / "src" / "core-skills" / "module-help.csv", HELP_CSV_HEADER + "\n")

            with self.assertRaises(ValueError) as ctx:
                run_packager(repo, out)

            self.assertIn("empty", str(ctx.exception).lower())
            self.assertTrue((out / "skills" / "stale-id" / "keep.txt").is_file())
            self.assertFalse((out / "skills" / "bmad").exists())

    def test_short_help_csv_row_leaves_dest_untouched(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo, out = self._bmad_repo_with_stale_dest(temp_dir)
            write(
                repo / "src" / "core-skills" / "module-help.csv",
                HELP_CSV_HEADER + "\nCore,bmad-help\n",
            )

            with self.assertRaises(ValueError) as ctx:
                run_packager(repo, out)

            self.assertIn("malformed", str(ctx.exception).lower())
            self.assertTrue((out / "skills" / "stale-id" / "keep.txt").is_file())
            self.assertFalse((out / "skills" / "bmad").exists())

    def test_real_repo_emits_method_set_and_help_assets(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out = Path(temp_dir)
            run_packager(REPO_ROOT, out)

            dest = out / "skills"
            names = sorted(p.name for p in dest.iterdir() if p.is_dir())
            expected = method_skill_ids(REPO_ROOT)

            self.assertEqual(names, sorted(expected))
            self.assertIn("bmad-generate-project-context", names)
            self.assertTrue(SHIM_ONLY_IDS.isdisjoint(names))
            self.assertTrue({"v6-shims", "web-bundles", "test", "docs"}.isdisjoint(names))
            for name in names:
                self.assertTrue((dest / name / "SKILL.md").is_file())

            for dest_rel, source in (
                (
                    "bmad-review/references/lens-adversarial.md",
                    REPO_ROOT / "src" / "core-skills" / "bmad-review" / "references" / "lens-adversarial.md",
                ),
                (
                    "bmad-review/scripts/word_metrics.py",
                    REPO_ROOT / "src" / "core-skills" / "bmad-review" / "scripts" / "word_metrics.py",
                ),
                (
                    "bmad-prd/assets/prd-template.md",
                    REPO_ROOT / "src" / "bmm-skills" / "plan" / "bmad-prd" / "assets" / "prd-template.md",
                ),
            ):
                dest_file = dest / dest_rel
                self.assertTrue(dest_file.is_file(), dest_rel)
                self.assertEqual(dest_file.read_bytes(), source.read_bytes(), dest_rel)

            self.assertIn("bmad", names)
            self.assertNotIn("bmad-help", names)
            dest_bmad = dest / "bmad"
            dest_scripts = dest_bmad / "scripts"
            expected_scripts = [
                "config_utils.py",
                "memlog.py",
                "render_skill.py",
                "resolve_config.py",
                "resolve_customization.py",
            ]
            for name in expected_scripts:
                self.assertEqual(
                    (dest_scripts / name).read_bytes(),
                    (REPO_ROOT / "src" / "scripts" / name).read_bytes(),
                    name,
                )
            source_bmad = REPO_ROOT / "src" / "core-skills" / "bmad"
            self.assertEqual(
                (dest_scripts / "setup.py").read_bytes(),
                (source_bmad / "scripts" / "setup.py").read_bytes(),
            )
            self.assertFalse((dest_bmad / "setup.py").exists())
            self.assertFalse((dest_scripts / "tests").exists())
            bmad_assets = REPO_ROOT / "src" / "core-skills" / "bmad" / "assets"
            for path in bmad_assets.iterdir():
                self.assertEqual(
                    (dest_bmad / "assets" / path.name).read_bytes(),
                    path.read_bytes(),
                    path.name,
                )
            self.assertFalse((bmad_assets / "bmad-help.csv").exists())
            dest_csv = dest_bmad / "assets" / "bmad-help.csv"
            self.assertEqual(dest_csv.read_text(encoding="utf-8").splitlines()[0], HELP_CSV_HEADER)
            self.assertEqual(
                set(csv_records(dest_csv)),
                set(csv_records(REPO_ROOT / "src" / "core-skills" / "module-help.csv"))
                | set(csv_records(REPO_ROOT / "src" / "bmm-skills" / "module-help.csv")),
            )

            for name in names:
                if name == "bmad":
                    continue
                skill = dest / name
                for script in SHARED_SCRIPTS:
                    self.assertEqual(list(skill.rglob(script)), [])
                self.assertFalse((skill / "assets" / "bmad-help.csv").exists())

            source_help = REPO_ROOT / "src" / "core-skills" / "bmad-help"
            self.assertEqual(
                {p.name for p in source_help.iterdir() if p.name != "__pycache__"},
                {"SKILL.md"},
            )
            self.assertEqual(
                (dest_bmad / "references" / "setup.md").read_bytes(),
                (source_bmad / "references" / "setup.md").read_bytes(),
            )
            self.assertTrue((source_bmad / "scripts" / "setup.py").is_file())
            self.assertFalse((source_bmad / "setup.py").exists())
            self.assertFalse((dest_bmad / "setup.py").exists())

    def _bmad_repo_with_stale_dest(self, temp_dir: str) -> tuple[Path, Path]:
        repo = Path(temp_dir) / "repo"
        out = Path(temp_dir) / "out"
        self._write_bmad_payload(repo)
        write_skill(repo, "src/core-skills/bmad")
        write_skill(repo, "src/core-skills/bmad-help")
        write_skill(repo, "src/bmm-skills/plan/bmad-prd")
        write(out / "skills" / "stale-id" / "keep.txt", "keep\n")
        return repo, out

    def _write_bmad_payload(self, repo: Path) -> None:
        for name in SHARED_SCRIPTS:
            write(repo / "src" / "scripts" / name, f"# {name}\n")
        write(repo / "src" / "scripts" / "tests" / "test_foo.py", "# test\n")
        write(
            repo / "src" / "core-skills" / "bmad" / "assets" / "keep.txt",
            "keep\n",
        )
        write(
            repo / "src" / "core-skills" / "module-help.csv",
            HELP_CSV_HEADER
            + "\nCore,bmad-help,BMad Help,BH,,,,anytime,,,false,,\n",
        )
        write(
            repo / "src" / "bmm-skills" / "module-help.csv",
            HELP_CSV_HEADER
            + "\nBMad Method,bmad-prd,Create PRD,PRD,,,,plan,,,true,planning_artifacts,prd\n",
        )


if __name__ == "__main__":
    unittest.main()
