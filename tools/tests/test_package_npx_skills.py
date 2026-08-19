import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import yaml


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import package_npx_skills  # noqa: E402


REPO_ROOT = Path(__file__).resolve().parents[2]
SHARED_SCRIPTS = package_npx_skills.SHARED_SCRIPTS
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


def write_skill(repo: Path, root_name: str, rel: str) -> Path:
    skill = repo / "src" / root_name / rel
    write(skill / "SKILL.md", f"---\nname: {skill.name}\n---\n# {skill.name}\n")
    return skill


def manifest_text(
    module: str,
    skill_ids: list[str],
    *,
    frontmatter: str | None = None,
    body: str | None = None,
) -> str:
    if frontmatter is None:
        frontmatter = (
            f"module: {module}\n"
            "update_source: github:example/repo/skills\n"
        )
    if body is None:
        body = f"# {module}\n\nThis module includes {' and '.join(f'`{item}`' for item in skill_ids)}.\n"
    return f"---\n{frontmatter}---\n\n{body}"


def build_repo(
    root: Path,
    *,
    core: tuple[str, ...] = ("bmad-review",),
    bmm: tuple[str, ...] = ("plan/bmad-prd",),
    version: str = "1.2.3",
) -> Path:
    repo = root / "repo"
    write(repo / "package.json", json.dumps({"version": version}) + "\n")
    core_ids = [write_skill(repo, "core-skills", rel).name for rel in core]
    bmm_ids = [write_skill(repo, "bmm-skills", rel).name for rel in bmm]
    write(
        repo / "src" / "core-skills" / "module-manifest.md",
        manifest_text("core", core_ids),
    )
    write(
        repo / "src" / "bmm-skills" / "module-manifest.md",
        manifest_text("bmm", bmm_ids),
    )
    return repo


def write_bmad_payload(repo: Path) -> None:
    for name in SHARED_SCRIPTS:
        write(repo / "src" / "scripts" / name, f"# {name}\n")
    write(repo / "src" / "scripts" / "tests" / "test_foo.py", "# test\n")
    write(repo / "src" / "core-skills" / "bmad" / "assets" / "keep.txt", "keep\n")
    write(
        repo / "src" / "core-skills" / "bmad" / "assets" / "bmad-help.csv",
        "legacy catalog\n",
    )


def run_packager(repo: Path, out: Path) -> None:
    package_npx_skills.main(["--repo-root", str(repo), "--out", str(out)])


def frontmatter(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    return yaml.safe_load(text.split("---", 2)[1])


def method_skills_by_module(repo: Path) -> dict[str, set[str]]:
    modules: dict[str, set[str]] = {"core": set(), "bmm": set()}
    for root_name, module in (("core-skills", "core"), ("bmm-skills", "bmm")):
        for skill_md in (repo / "src" / root_name).rglob("SKILL.md"):
            if "v6-shims" in skill_md.parts or skill_md.parent.name == "bmad-help":
                continue
            modules[module].add(skill_md.parent.name)
    return modules


class PackageNpxSkillsTests(unittest.TestCase):
    def test_flattens_skills_and_skips_shims_junk_and_bmad_help(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            repo = build_repo(
                root,
                core=("bmad-review", "v6-shims/bmad-old", "bmad-help"),
                bmm=("plan/bmad-prd",),
            )
            write(
                repo / "src" / "core-skills" / "module-manifest.md",
                manifest_text("core", ["bmad-review"]),
            )
            skill = repo / "src" / "core-skills" / "bmad-review"
            write(skill / ".DS_Store", "junk")
            write(skill / "__pycache__" / "mod.pyc", "cache")
            write(skill / "keep.txt", "keep")
            out = root / "out"

            run_packager(repo, out)

            dest = out / "skills"
            self.assertEqual(
                sorted(path.name for path in dest.iterdir()),
                ["bmad-prd", "bmad-review"],
            )
            self.assertTrue((dest / "bmad-review" / "keep.txt").is_file())
            self.assertFalse((dest / "bmad-review" / ".DS_Store").exists())
            self.assertFalse((dest / "bmad-review" / "__pycache__").exists())

    def test_bmad_gets_only_shared_runtime_enrichment(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            repo = build_repo(root, core=("bmad",), bmm=("plan/bmad-prd",))
            write_bmad_payload(repo)
            out = root / "out"

            run_packager(repo, out)

            bmad = out / "skills" / "bmad"
            for name in SHARED_SCRIPTS:
                self.assertEqual(
                    (bmad / "scripts" / name).read_bytes(),
                    (repo / "src" / "scripts" / name).read_bytes(),
                )
            self.assertFalse((bmad / "scripts" / "tests").exists())
            self.assertEqual((bmad / "assets" / "keep.txt").read_text(), "keep\n")
            self.assertFalse((bmad / "assets" / "bmad-help.csv").exists())

    def test_fans_identical_manifest_bytes_to_each_owning_skill(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            repo = build_repo(
                root,
                core=("bmad-review", "bmad-customize"),
                bmm=("plan/bmad-prd", "ship/bmad-build"),
                version="2.4.6",
            )
            out = root / "out"
            authored_core = (
                repo / "src" / "core-skills" / "module-manifest.md"
            ).read_bytes()

            responses = {
                ("rev-parse", "--short", "HEAD"): "abc1234",
                ("status", "--porcelain"): "",
                ("tag", "--points-at", "HEAD"): "v2.4.6",
            }

            def fake_git(_repo: Path, *args: str) -> str | None:
                return responses[args]

            with mock.patch.object(
                package_npx_skills, "git_output", side_effect=fake_git
            ):
                run_packager(repo, out)

            dest = out / "skills"
            core_copies = [
                (dest / skill / "module-manifest.md").read_bytes()
                for skill in ("bmad-review", "bmad-customize")
            ]
            bmm_copies = [
                (dest / skill / "module-manifest.md").read_bytes()
                for skill in ("bmad-prd", "bmad-build")
            ]
            self.assertEqual(core_copies[0], core_copies[1])
            self.assertEqual(bmm_copies[0], bmm_copies[1])
            self.assertNotEqual(core_copies[0], bmm_copies[0])
            self.assertEqual(
                core_copies[0],
                authored_core.replace(b"---\n", b"---\nversion: 2.4.6\n", 1),
            )
            self.assertEqual(frontmatter(dest / "bmad-review" / "module-manifest.md")["module"], "core")
            self.assertEqual(frontmatter(dest / "bmad-prd" / "module-manifest.md")["module"], "bmm")
            for skill in ("bmad-review", "bmad-customize", "bmad-prd", "bmad-build"):
                self.assertEqual(
                    frontmatter(dest / skill / "module-manifest.md")["version"],
                    "2.4.6",
                )

    def test_declared_scripts_fan_out_with_source_identical_bytes(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            repo = build_repo(
                root,
                core=("bmad-review", "bmad-customize"),
                bmm=("plan/bmad-prd", "ship/bmad-build"),
            )
            core_script = repo / "src" / "core-skills" / "scripts" / "nested" / "tool.py"
            bmm_script = repo / "src" / "bmm-skills" / "scripts" / "check.py"
            write(core_script, "core bytes\n")
            write(bmm_script, "bmm bytes\n")
            original_core_bytes = core_script.read_bytes()
            write(
                repo / "src" / "core-skills" / "module-manifest.md",
                manifest_text(
                    "core",
                    ["bmad-review", "bmad-customize"],
                    frontmatter=(
                        "module: core\n"
                        "update_source: file:skills\n"
                        "scripts:\n  - scripts/nested/tool.py\n"
                    ),
                ),
            )
            write(
                repo / "src" / "bmm-skills" / "module-manifest.md",
                manifest_text(
                    "bmm",
                    ["bmad-prd", "bmad-build"],
                    frontmatter=(
                        "module: bmm\n"
                        "update_source: https://example.test/skills\n"
                        "scripts:\n  - scripts/check.py\n"
                    ),
                ),
            )
            out = root / "out"

            original_write_bytes = Path.write_bytes
            changed = False

            def mutate_source_after_first_copy(path: Path, data: bytes) -> int:
                nonlocal changed
                result = original_write_bytes(path, data)
                if path.name == "tool.py" and path != core_script and not changed:
                    original_write_bytes(core_script, b"changed during packaging\n")
                    changed = True
                return result

            with mock.patch.object(
                Path, "write_bytes", autospec=True, side_effect=mutate_source_after_first_copy
            ):
                run_packager(repo, out)

            for skill in ("bmad-review", "bmad-customize"):
                self.assertEqual(
                    (out / "skills" / skill / "scripts" / "nested" / "tool.py").read_bytes(),
                    original_core_bytes,
                )
            for skill in ("bmad-prd", "bmad-build"):
                self.assertEqual(
                    (out / "skills" / skill / "scripts" / "check.py").read_bytes(),
                    bmm_script.read_bytes(),
                )

    def test_release_and_development_version_selection(self):
        repo = Path("/repo")
        cases = (
            ("release", "abc1234", "", "v1.2.3", "1.2.3"),
            ("dirty", "abc1234", " M file", "v1.2.3", "1.2.3-dev.gabc1234"),
            ("untagged", "abc1234", "", "", "1.2.3-dev.gabc1234"),
            ("wrong-tag", "abc1234", "", "v9.9.9", "1.2.3-dev.gabc1234"),
            ("numeric-hash", "0123456", "", "", "1.2.3-dev.g0123456"),
            ("several-tags", "abc1234", "", "other\nv1.2.3", "1.2.3"),
            ("no-hash", None, None, None, "1.2.3-dev"),
        )
        for name, commit, status, tags, expected in cases:
            responses = {
                ("rev-parse", "--short", "HEAD"): commit,
                ("status", "--porcelain"): status,
                ("tag", "--points-at", "HEAD"): tags,
            }

            def fake_git(_repo: Path, *args: str) -> str | None:
                return responses[args]

            with self.subTest(name=name), mock.patch.object(
                package_npx_skills, "git_output", side_effect=fake_git
            ):
                self.assertEqual(
                    package_npx_skills.stamped_version(repo, "1.2.3"), expected
                )

    def test_tag_away_from_head_does_not_make_release(self):
        responses = {
            ("rev-parse", "--short", "HEAD"): "abc1234",
            ("status", "--porcelain"): "",
            ("tag", "--points-at", "HEAD"): "other",
        }

        def fake_git(_repo: Path, *args: str) -> str | None:
            return responses[args]

        with mock.patch.object(package_npx_skills, "git_output", side_effect=fake_git):
            self.assertEqual(
                package_npx_skills.stamped_version(Path("/repo"), "1.2.3"),
                "1.2.3-dev.gabc1234",
            )

    def test_invalid_manifest_shapes_name_field_and_leave_dest_untouched(self):
        cases = (
            ("bad-yaml", "---\nmodule: [\n---\n", "yaml"),
            (
                "duplicate-key",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nmodule: other\nupdate_source: file:skills\n"
                    ),
                ),
                "duplicate",
            ),
            (
                "unknown-key",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nupdate_source: file:skills\nphase: plan\n"
                    ),
                ),
                "phase",
            ),
            (
                "authored-version",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nversion: 1.0.0\nupdate_source: file:skills\n"
                    ),
                ),
                "version",
            ),
            (
                "missing-module",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter="update_source: file:skills\n",
                ),
                "module",
            ),
            (
                "wrong-module",
                manifest_text(
                    "bmm",
                    ["bmad-review"],
                    frontmatter="module: bmm\nupdate_source: file:skills\n",
                ),
                "module",
            ),
            (
                "bad-update-source",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter="module: core\nupdate_source: example/repo\n",
                ),
                "update_source",
            ),
            (
                "bad-github-source",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nupdate_source: github:owner//skills\n"
                    ),
                ),
                "update_source",
            ),
            (
                "bad-https-source",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter="module: core\nupdate_source: 'https:// '\n",
                ),
                "update_source",
            ),
            (
                "question-not-list",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nupdate_source: file:skills\nconfig_questions: bad\n"
                    ),
                ),
                "config_questions",
            ),
            (
                "question-missing-key",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nupdate_source: file:skills\nconfig_questions:\n"
                        "  - key: output\n    prompt: Where?\n"
                    ),
                ),
                "default",
            ),
            (
                "question-non-string",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nupdate_source: file:skills\nconfig_questions:\n"
                        "  - key: output\n    prompt: Where?\n    default: 3\n"
                    ),
                ),
                "default",
            ),
            (
                "question-empty-prompt",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nupdate_source: file:skills\nconfig_questions:\n"
                        "  - key: output\n    prompt: '  '\n    default: out\n"
                    ),
                ),
                "prompt",
            ),
            (
                "question-module-prefix",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nupdate_source: file:skills\nconfig_questions:\n"
                        "  - key: core.output\n    prompt: Where?\n    default: out\n"
                    ),
                ),
                "core.output",
            ),
            (
                "question-duplicate-key",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nupdate_source: file:skills\n"
                        "config_questions:\n"
                        "  - key: output\n    prompt: First?\n    default: one\n"
                        "  - key: output\n    prompt: Second?\n    default: two\n"
                    ),
                ),
                "conflicts",
            ),
            (
                "question-prefix-collision",
                manifest_text(
                    "core",
                    ["bmad-review"],
                    frontmatter=(
                        "module: core\nupdate_source: file:skills\n"
                        "config_questions:\n"
                        "  - key: output\n    prompt: First?\n    default: one\n"
                        "  - key: output.directory\n"
                        "    prompt: Second?\n    default: two\n"
                    ),
                ),
                "conflicts",
            ),
        )
        for name, authored, diagnostic in cases:
            with self.subTest(name=name), tempfile.TemporaryDirectory() as temp_dir:
                root = Path(temp_dir)
                repo = build_repo(root)
                manifest = repo / "src" / "core-skills" / "module-manifest.md"
                write(manifest, authored)
                out = root / "out"
                stale = out / "skills" / "stale-id" / "keep.txt"
                write(stale, "keep\n")

                with self.assertRaises(ValueError) as caught:
                    run_packager(repo, out)

                message = str(caught.exception)
                self.assertIn(str(manifest), message)
                self.assertIn(diagnostic.lower(), message.lower())
                self.assertEqual(stale.read_text(), "keep\n")
                self.assertEqual(
                    sorted(path.name for path in (out / "skills").iterdir()),
                    ["stale-id"],
                )

    def test_invalid_package_version_leaves_destination_untouched(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            repo = build_repo(root, version="1.2.3+local")
            out = root / "out"
            stale = out / "skills" / "stale-id" / "keep.txt"
            write(stale, "keep\n")

            with self.assertRaisesRegex(ValueError, "package version"):
                run_packager(repo, out)

            self.assertTrue(stale.is_file())

    def test_unsafe_missing_and_non_file_scripts_leave_dest_untouched(self):
        cases = (
            "scripts",
            "scripts/",
            "/tmp/tool.py",
            "../tool.py",
            "other/tool.py",
            "scripts/missing.py",
            "scripts/folder",
            "scripts\\tool.py",
        )
        for entry in cases:
            with self.subTest(entry=entry), tempfile.TemporaryDirectory() as temp_dir:
                root = Path(temp_dir)
                repo = build_repo(root)
                (repo / "src" / "core-skills" / "scripts" / "folder").mkdir(
                    parents=True
                )
                manifest = repo / "src" / "core-skills" / "module-manifest.md"
                write(
                    manifest,
                    manifest_text(
                        "core",
                        ["bmad-review"],
                        frontmatter=(
                            "module: core\nupdate_source: file:skills\nscripts:\n"
                            f"  - {json.dumps(entry)}\n"
                        ),
                    ),
                )
                out = root / "out"
                stale = out / "skills" / "stale-id" / "keep.txt"
                write(stale, "keep\n")

                with self.assertRaises(ValueError) as caught:
                    run_packager(repo, out)

                message = str(caught.exception)
                self.assertIn("scripts", message)
                self.assertIn(repr(entry), message)
                self.assertTrue(stale.is_file())

    def test_missing_source_root_leaves_destination_untouched(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            repo = root / "repo"
            write(repo / "package.json", '{"version":"1.0.0"}\n')
            write_skill(repo, "bmm-skills", "plan/bmad-prd")
            out = root / "out"
            stale = out / "skills" / "stale-id" / "keep.txt"
            write(stale, "keep\n")

            with self.assertRaisesRegex(FileNotFoundError, "core-skills"):
                run_packager(repo, out)

            self.assertTrue(stale.is_file())

    def test_replaces_existing_destination_after_success(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            repo = build_repo(root)
            out = root / "out"
            write(out / "skills" / "stale-id" / "keep.txt", "keep\n")

            run_packager(repo, out)

            self.assertFalse((out / "skills" / "stale-id").exists())
            self.assertTrue((out / "skills" / "bmad-review" / "SKILL.md").is_file())
            self.assertTrue((out / "skills" / "bmad-prd" / "SKILL.md").is_file())

    def test_failed_destination_replace_restores_existing_destination(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            staging = root / "staging"
            out = root / "out"
            write(staging / "new-id" / "SKILL.md", "new\n")
            stale = out / "skills" / "stale-id" / "keep.txt"
            write(stale, "keep\n")
            original_replace = Path.replace

            def fail_incoming_replace(path: Path, target: Path) -> Path:
                if path.name == "skills" and path.parent != out:
                    raise OSError("simulated destination failure")
                return original_replace(path, target)

            with mock.patch.object(
                Path, "replace", autospec=True, side_effect=fail_incoming_replace
            ), self.assertRaisesRegex(OSError, "simulated destination failure"):
                package_npx_skills.replace_dest_skills(staging, out)

            self.assertEqual(stale.read_text(), "keep\n")
            self.assertFalse((out / "skills" / "new-id").exists())

    def test_real_repo_emits_owned_stamped_manifests_without_help_csv(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            out = Path(temp_dir)
            run_packager(REPO_ROOT, out)

            dest = out / "skills"
            modules = method_skills_by_module(REPO_ROOT)
            names = {path.name for path in dest.iterdir() if path.is_dir()}
            self.assertEqual(names, modules["core"] | modules["bmm"])
            self.assertIn("bmad-generate-project-context", names)
            self.assertTrue(SHIM_ONLY_IDS.isdisjoint(names))
            self.assertNotIn("bmad-help", names)

            expected_version = package_npx_skills.stamped_version(
                REPO_ROOT, package_npx_skills.package_version(REPO_ROOT)
            )
            for module, skill_ids in modules.items():
                copies = []
                for skill_id in skill_ids:
                    packaged = dest / skill_id
                    self.assertTrue((packaged / "SKILL.md").is_file())
                    manifest = packaged / "module-manifest.md"
                    copies.append(manifest.read_bytes())
                    data = frontmatter(manifest)
                    self.assertEqual(data["module"], module, skill_id)
                    self.assertEqual(data["version"], expected_version, skill_id)
                    self.assertFalse(
                        (packaged / "assets" / "bmad-help.csv").exists(), skill_id
                    )
                self.assertEqual(len(set(copies)), 1, module)

            for root_name in ("core-skills", "bmm-skills"):
                source_root = REPO_ROOT / "src" / root_name
                self.assertNotIn(
                    "version", frontmatter(source_root / "module-manifest.md")
                )
                self.assertFalse(
                    any(
                        path.parent != source_root
                        for path in source_root.rglob("module-manifest.md")
                    )
                )

            bmad = dest / "bmad"
            for name in SHARED_SCRIPTS:
                self.assertEqual(
                    (bmad / "scripts" / name).read_bytes(),
                    (REPO_ROOT / "src" / "scripts" / name).read_bytes(),
                    name,
                )
            self.assertFalse((bmad / "scripts" / "tests").exists())
            self.assertFalse((bmad / "assets" / "bmad-help.csv").exists())


if __name__ == "__main__":
    unittest.main()
