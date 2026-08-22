"""Snapshot renderer tests against the current install layout and shipped skills.

Host skills live outside `_bmad/`. `_bmad/` is the project runtime setup
materializes: shared scripts, team config, custom overlays, and published
snapshots. Call `render()` for the success path. Use the installed CLI for
the agent-facing dispatch/HALT contract and for anything that needs a
separate process.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import tomllib
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from types import SimpleNamespace


SCRIPTS_SRC = Path(__file__).resolve().parents[1]
REPO = SCRIPTS_SRC.parents[2]
SKILLS_SRC = REPO / "skills"
CONFIG_TEMPLATE = (SCRIPTS_SRC.parent / "assets" / "config.template.toml").read_text(
    encoding="utf-8"
)
SHARED_SCRIPTS = (
    "config_utils.py",
    "memlog.py",
    "render_skill.py",
    "resolve_config.py",
    "resolve_customization.py",
)
SHIPPED_SKILLS = ("bmad-build-auto", "bmad-build")
COMPILE_TOKEN = re.compile(r"\{\{(?:\.|config\.)|\{workflow\.|\[\[bmad-snapshot:")
DISPATCH_PREFIX = "read and follow "

sys.path.insert(0, str(SCRIPTS_SRC))
import render_skill as rs  # noqa: E402


def _team_config(project: Path) -> str:
    return CONFIG_TEMPLATE.replace("{directory_name}", project.name)


def _copy_skill(dest: Path, name: str) -> Path:
    shutil.copytree(
        SKILLS_SRC / name,
        dest,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc"),
    )
    return dest


def _files(directory: Path) -> dict[str, bytes]:
    files = {
        path.relative_to(directory).as_posix(): path.read_bytes()
        for path in directory.rglob("*")
        if path.is_file()
    }
    return dict(sorted(files.items()))


def _markdown(directory: Path) -> str:
    return "\n".join(
        content.decode("utf-8")
        for name, content in _files(directory).items()
        if name.endswith(".md")
    )


def _namespace_dir(project: Path, skill_name: str) -> Path:
    root = str(project.resolve())
    slug = re.sub(r"[^a-z0-9]+", "-", project.name.lower()).strip("-") or "project"
    slug = slug[:80].rstrip("-") or "project"
    root_hash = hashlib.sha256(root.encode("utf-8")).hexdigest()[:12]
    return project / "_bmad" / "render" / skill_name / f"{slug}-{root_hash}"


class PublishInternalsTests(unittest.TestCase):
    """Corruption and reuse branches of `_publish` without rendering a whole skill."""

    def test_identical_publish_reuses_and_rejects_each_corruption_mode(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            dest = Path(temp_dir) / "generation"
            outputs = {"workflow.md": b"hello\n"}
            manifest = {
                "schema_version": 1,
                "outputs": {"workflow.md": rs._hash_bytes(b"hello\n")},
            }
            rs._publish(dest, outputs, manifest)
            rs._publish(dest, outputs, manifest)
            self.assertEqual((dest / "workflow.md").read_bytes(), b"hello\n")

            with self.assertRaisesRegex(rs.RenderError, "collision or corruption"):
                rs._publish(dest, outputs, {**manifest, "extra": True})

            (dest / "extra.md").write_text("stray\n", encoding="utf-8")
            with self.assertRaisesRegex(rs.RenderError, "unexpected or missing"):
                rs._publish(dest, outputs, manifest)
            (dest / "extra.md").unlink()

            (dest / "workflow.md").write_bytes(b"hello\ncorrupt")
            with self.assertRaisesRegex(rs.RenderError, "hash mismatch"):
                rs._publish(dest, outputs, manifest)
            (dest / "workflow.md").write_bytes(b"hello\n")

            (dest / "manifest.json").write_text("{", encoding="utf-8")
            with self.assertRaisesRegex(rs.RenderError, "corrupt existing"):
                rs._publish(dest, outputs, manifest)


class RenderSkillTests(unittest.TestCase):
    def _workspace(
        self,
        *,
        name: str = "project",
        shared_bmad: Path | None = None,
        config: str | None = None,
    ) -> SimpleNamespace:
        outer = Path(tempfile.mkdtemp(prefix="bmad-render-"))
        self.addCleanup(shutil.rmtree, outer, True)
        project = outer / name
        project.mkdir(parents=True)
        (project / "nested" / "cwd").mkdir(parents=True)
        if shared_bmad is None:
            bmad = project / "_bmad"
            scripts = bmad / "scripts"
            scripts.mkdir(parents=True)
            for script in SHARED_SCRIPTS:
                shutil.copy2(SCRIPTS_SRC / script, scripts / script)
            (bmad / "custom").mkdir()
            (bmad / "config.toml").write_text(
                config if config is not None else _team_config(project),
                encoding="utf-8",
            )
        else:
            (project / "_bmad").symlink_to(shared_bmad)
            bmad = shared_bmad
        return SimpleNamespace(outer=outer, project=project, bmad=bmad)

    def _skill(self, ws: SimpleNamespace, name: str) -> Path:
        return _copy_skill(ws.outer / "skills" / name, name)

    def _cli(
        self, project: Path, skill: Path, *, cwd: Path | None = None
    ) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [
                sys.executable,
                str(project / "_bmad" / "scripts" / "render_skill.py"),
                "--project-root",
                str(project),
                "--skill",
                str(skill),
            ],
            cwd=cwd or project,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )

    def _entry(self, result: subprocess.CompletedProcess[str]) -> Path:
        self.assertEqual(result.returncode, 0, msg=result.stdout + result.stderr)
        lines = result.stdout.strip().split("\n")
        self.assertEqual(len(lines), 1, msg=result.stdout)
        self.assertTrue(lines[0].startswith(DISPATCH_PREFIX), msg=result.stdout)
        output = Path(lines[0][len(DISPATCH_PREFIX) :])
        self.assertTrue(output.is_absolute())
        return output

    def _assert_snapshot(self, workflow: Path, project: Path, skill_name: str) -> Path:
        snap = workflow.parent
        self.assertEqual(workflow.name, "workflow.md")
        self.assertIn(f"{os.sep}render{os.sep}{skill_name}{os.sep}", str(workflow))
        self.assertFalse((snap / "SKILL.md").exists())
        manifest = json.loads((snap / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["project_root"], str(project.resolve()))
        self.assertEqual(manifest["skill"], skill_name)
        actual = _files(snap)
        expected = [*manifest["outputs"], "manifest.json"]
        self.assertEqual(sorted(actual), sorted(expected))
        for name, digest in manifest["outputs"].items():
            self.assertEqual(rs._hash_bytes(actual[name]), digest, name)
        markdown = _markdown(snap)
        self.assertIsNone(COMPILE_TOKEN.search(markdown), markdown)
        self.assertNotIn("{skill-root}", markdown)
        artifacts = str(project.resolve() / "_bmad-output" / "implementation-artifacts")
        self.assertIn(artifacts, markdown)
        return snap

    def test_unsupported_customization_default_type_is_rejected(self):
        # No shipped skill uses a boolean customization default; arranging one
        # through customize.toml would only exist to reach this branch.
        with self.assertRaisesRegex(rs.RenderError, "unsupported default type"):
            rs._resolve_customization_value(
                True, True, "customization.workflow.flag"
            )

    def test_shipped_skills_publish_root_bound_snapshots(self):
        for name in SHIPPED_SKILLS:
            with self.subTest(name):
                ws = self._workspace()
                skill = self._skill(ws, name)
                workflow = rs.render(ws.project, skill)
                snap = self._assert_snapshot(workflow, ws.project, name)
                self.assertIn("{spec_file}", _markdown(snap))
                hunter = snap / "review-prompts" / "edge-case-hunter.md"
                self.assertTrue(hunter.is_file())
                self.assertIn(str(hunter), _markdown(snap))

    def test_cli_from_nested_cwd_dispatches_one_absolute_workflow(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        workflow = self._entry(
            self._cli(ws.project, skill, cwd=ws.project / "nested" / "cwd")
        )
        self._assert_snapshot(workflow, ws.project, "bmad-build")
        self.assertFalse((ws.bmad / "scripts" / "__pycache__").exists())
        self.assertFalse((skill / "__pycache__").exists())

    def test_identical_input_and_unreferenced_config_reuse_bytes(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        first = rs.render(ws.project, skill)
        first_files = _files(first.parent)
        self.assertEqual(rs.render(ws.project, skill), first)
        with (ws.bmad / "config.toml").open("a", encoding="utf-8") as handle:
            handle.write('\nunreferenced_value = "ignored"\n')
        self.assertEqual(rs.render(ws.project, skill), first)
        current = _files(first.parent)
        for name, content in first_files.items():
            self.assertEqual(current[name], content, name)

    def test_referenced_config_and_source_changes_publish_new_generations(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build-auto")
        before = rs.render(ws.project, skill)
        before_files = _files(before.parent)
        (ws.bmad / "custom" / "config.toml").write_text(
            '[modules.bmm]\nimplementation_artifacts = "{project-root}/impl-v2"\n',
            encoding="utf-8",
        )
        after_config = rs.render(ws.project, skill)
        self.assertNotEqual(after_config, before)
        self.assertIn("/impl-v2/", after_config.read_text(encoding="utf-8"))
        self.assertTrue(before.exists())

        (skill / "compile-epic-context.md").write_text(
            (skill / "compile-epic-context.md").read_text(encoding="utf-8")
            + "\n<!-- effective change -->\n",
            encoding="utf-8",
        )
        after_source = rs.render(ws.project, skill)
        self.assertNotEqual(after_source, after_config)
        current = _files(before.parent)
        for name, content in before_files.items():
            self.assertEqual(current[name], content, name)

    def test_shared_runtime_keeps_distinct_root_bound_snapshots(self):
        first = self._workspace()
        skill = self._skill(first, "bmad-build")
        second = self._workspace(name="other", shared_bmad=first.bmad)
        one = rs.render(first.project, skill)
        two = rs.render(second.project, skill)
        self.assertNotEqual(one, two)
        self.assertIn(str(first.project.resolve()), one.read_text(encoding="utf-8"))
        self.assertIn(str(second.project.resolve()), two.read_text(encoding="utf-8"))

    def test_concurrent_cli_renderers_reuse_one_complete_generation(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(
                pool.map(lambda _: self._cli(ws.project, skill), range(2))
            )
        entries = [self._entry(result) for result in results]
        self.assertEqual(entries[0], entries[1])
        self.assertTrue((entries[0].parent / "manifest.json").is_file())

    def test_malformed_config_and_customization_halt_without_traceback(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        (ws.bmad / "custom" / "config.toml").write_text("[core\nbad", encoding="utf-8")
        result = self._cli(ws.project, skill)
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue(result.stdout.startswith("HALT:"), result.stdout)
        self.assertNotIn(DISPATCH_PREFIX, result.stdout)
        self.assertNotIn("Traceback", result.stdout + result.stderr)

        (ws.bmad / "custom" / "config.toml").unlink()
        (ws.bmad / "custom" / f"{skill.name}.toml").write_text(
            "[workflow\nbad", encoding="utf-8"
        )
        result = self._cli(ws.project, skill)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("failed to parse", result.stdout)

    def test_missing_wrong_type_and_non_string_layer_id_halt(self):
        template = _team_config(Path("project"))
        missing = template.replace(
            'implementation_artifacts = "{project-root}/_bmad-output/implementation-artifacts"\n',
            "",
        )
        ws = self._workspace(config=missing)
        skill = self._skill(ws, "bmad-build")
        result = self._cli(ws.project, skill)
        self.assertIn("missing config value", result.stdout)

        wrong = template.replace(
            'implementation_artifacts = "{project-root}/_bmad-output/implementation-artifacts"',
            "implementation_artifacts = 42",
        )
        ws = self._workspace(config=wrong)
        skill = self._skill(ws, "bmad-build")
        result = self._cli(ws.project, skill)
        self.assertIn("must be a string", result.stdout)

        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        (ws.bmad / "custom" / f"{skill.name}.toml").write_text(
            '[[workflow.review_layers]]\nid = 42\nname = "bad"\ninstruction = "bad"\n',
            encoding="utf-8",
        )
        result = self._cli(ws.project, skill)
        self.assertIn("identifier `id` must be a string", result.stdout)

    def test_customization_prose_is_not_rescanned_as_source_tokens(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        literal = "[[bmad-snapshot:step-04-review.md]]"
        compile_literal = "{workflow.implementation_handoff}"
        (ws.bmad / "custom" / f"{skill.name}.user.toml").write_text(
            f'[workflow]\non_complete = "Preserve {literal} and {compile_literal} as prose"\n',
            encoding="utf-8",
        )
        markdown = _markdown(rs.render(ws.project, skill).parent)
        self.assertIn(literal, markdown)
        self.assertIn(compile_literal, markdown)

    def test_review_layer_override_guard_and_empty_layer_halt(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        (ws.bmad / "custom" / f"{skill.name}.toml").write_text(
            "\n".join(
                [
                    "[[workflow.review_layers]]",
                    'id = "blind-hunter"',
                    'name = "Replacement"',
                    'instruction = "Run replacement review."',
                    'when = "the replacement condition holds"',
                    "",
                ]
            ),
            encoding="utf-8",
        )
        review = (rs.render(ws.project, skill).parent / "step-04-review.md").read_text(
            encoding="utf-8"
        )
        self.assertIn("Replacement (`blind-hunter`)", review)
        self.assertIn("Run only when: the replacement condition holds", review)
        self.assertIn("Run replacement review.", review)

        defaults = tomllib.loads((skill / "customize.toml").read_text(encoding="utf-8"))
        disabled = "\n".join(
            '[[workflow.review_layers]]\n'
            f'id = "{layer["id"]}"\n'
            'name = "disabled"\n'
            'instruction = ""\n'
            for layer in defaults["workflow"]["review_layers"]
        )
        (ws.bmad / "custom" / f"{skill.name}.toml").write_text(
            disabled, encoding="utf-8"
        )
        review = (rs.render(ws.project, skill).parent / "step-04-review.md").read_text(
            encoding="utf-8"
        )
        self.assertIn("No active review layers. HALT", review)

    def test_empty_open_spec_override_clears_the_shipped_default(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        (ws.bmad / "custom" / f"{skill.name}.user.toml").write_text(
            '[workflow]\nopen_spec = ""\n', encoding="utf-8"
        )
        snap = rs.render(ws.project, skill).parent
        for name in ("step-05-present.md", "step-oneshot.md"):
            rendered = (snap / name).read_text(encoding="utf-8")
            self.assertNotIn("code -r", rendered)
            self.assertIn("Suggested Review Order", rendered)

    def test_installed_renderer_identity_change_publishes_a_new_generation(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        original = self._entry(self._cli(ws.project, skill))
        with (ws.bmad / "scripts" / "render_skill.py").open("a", encoding="utf-8") as handle:
            handle.write("\n# renderer identity change\n")
        changed = self._entry(self._cli(ws.project, skill))
        self.assertNotEqual(changed, original)
        self.assertTrue(original.exists())

    def test_convention_only_skill_renders_without_customization(self):
        ws = self._workspace()
        skill = ws.outer / "skills" / "plain-workflow"
        skill.mkdir(parents=True)
        (skill / "workflow.md").write_text(
            "Read `[[bmad-snapshot:step.md]]`.\n", encoding="utf-8"
        )
        (skill / "step.md").write_text("No rendered values required.\n", encoding="utf-8")
        workflow = rs.render(ws.project, skill)
        self.assertIn(f"{os.sep}render{os.sep}plain-workflow{os.sep}", str(workflow))
        self.assertTrue((workflow.parent / "step.md").is_file())
        self.assertIn(str(workflow.parent / "step.md"), workflow.read_text(encoding="utf-8"))

    def test_ambiguous_shorthand_and_source_symlink_escape_halt(self):
        config = _team_config(Path("project")).replace(
            "[core]\n",
            '[core]\nimplementation_artifacts = "{project-root}/dup"\n',
            1,
        )
        ws = self._workspace(config=config)
        skill = self._skill(ws, "bmad-build")
        result = self._cli(ws.project, skill)
        self.assertIn("ambiguous config value", result.stdout)

        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        outside = ws.outer / "outside.md"
        outside.write_text("outside\n", encoding="utf-8")
        (skill / "workflow.md").unlink()
        (skill / "workflow.md").symlink_to(outside)
        result = self._cli(ws.project, skill)
        self.assertIn("escapes skill directory", result.stdout)

    def test_long_project_basename_is_bounded_in_the_snapshot_namespace(self):
        ws = self._workspace(name="project-" + ("x" * 220))
        skill = self._skill(ws, "bmad-build")
        workflow = rs.render(ws.project, skill)
        self.assertLessEqual(len(workflow.parent.parent.name), 93)

    def test_snapshot_paths_stay_opaque_when_the_project_name_looks_like_tokens(self):
        ws = self._workspace(name="{workflow.on_complete}-{{.planning_artifacts}}")
        skill = self._skill(ws, "bmad-build")
        workflow = rs.render(ws.project, skill)
        text = workflow.read_text(encoding="utf-8")
        match = re.search(r"`([^`]*step-01-clarify-and-route\.md)`", text)
        self.assertIsNotNone(match, text)
        self.assertTrue(match.group(1).startswith(str(ws.project.resolve())))
        self.assertTrue(Path(match.group(1)).is_file())

    def test_publication_failure_does_not_dispatch_or_alter_another_root(self):
        stable = self._workspace()
        skill = self._skill(stable, "bmad-build")
        original = rs.render(stable.project, skill)
        original_files = _files(original.parent)
        broken = self._workspace(name="broken", shared_bmad=stable.bmad)
        namespace = _namespace_dir(broken.project, skill.name)
        namespace.parent.mkdir(parents=True, exist_ok=True)
        namespace.write_text("not a directory\n", encoding="utf-8")
        result = self._cli(broken.project, skill)
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue(result.stdout.startswith("HALT:"), result.stdout)
        self.assertNotIn(DISPATCH_PREFIX, result.stdout)
        current = _files(original.parent)
        for name, content in original_files.items():
            self.assertEqual(current[name], content, name)

    def test_corrupt_existing_destination_is_never_overwritten(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        workflow = rs.render(ws.project, skill)
        workflow.write_text(workflow.read_text(encoding="utf-8") + "corrupt", encoding="utf-8")
        result = self._cli(ws.project, skill)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("hash mismatch", result.stdout)
        self.assertTrue(workflow.read_text(encoding="utf-8").endswith("corrupt"))

    def test_shipped_skill_md_command_dispatches_for_both_skills(self):
        for name in SHIPPED_SKILLS:
            with self.subTest(name):
                ws = self._workspace()
                skill = self._skill(ws, name)
                text = (skill / "SKILL.md").read_text(encoding="utf-8")
                fenced = re.search(r"```bash\n(.*?)```", text, re.S)
                self.assertIsNotNone(fenced, f"{name}: SKILL.md ships no bash command")
                command = (
                    fenced.group(1)
                    .strip()
                    .replace("{project-root}", str(ws.project))
                    .replace("{skill-root}", str(skill))
                )
                self.assertNotIn("{", command)
                dispatched = self._entry(
                    subprocess.run(
                        command,
                        cwd=ws.project / "nested" / "cwd",
                        shell=True,
                        text=True,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        check=False,
                    )
                )
                self.assertEqual(dispatched.name, "workflow.md")
                self.assertTrue(dispatched.is_file())


if __name__ == "__main__":
    unittest.main()
