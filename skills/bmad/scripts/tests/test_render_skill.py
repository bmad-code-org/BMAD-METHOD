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
from unittest import mock

SCRIPTS_SRC = Path(__file__).resolve().parents[1]
REPO = SCRIPTS_SRC.parents[2]
SKILLS_SRC = REPO / "skills"
CONFIG_TEMPLATE = (SCRIPTS_SRC.parent / "assets" / "config.template.toml").read_text(encoding="utf-8")
SHARED_SCRIPTS = (
    "config_utils.py",
    "memlog.py",
    "render_skill.py",
    "resolve_config.py",
    "resolve_customization.py",
)
SHIPPED_SKILLS = ("bmad-build-auto", "bmad-build", "bmad-code-review")
RENDERED_SKILLS = (*SHIPPED_SKILLS, "bmad-walkthrough", "bmad-retrospective")
COMPILE_TOKEN = re.compile(r"\{\{\s*(?:config|workflow)\.|\{\{\s*rendered\(|\{%")
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
        path.relative_to(directory).as_posix(): path.read_bytes() for path in directory.rglob("*") if path.is_file()
    }
    return dict(sorted(files.items()))


def _markdown(directory: Path) -> str:
    return "\n".join(content.decode("utf-8") for name, content in _files(directory).items() if name.endswith(".md"))


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
        self, project: Path, skill: Path, *, cwd: Path | None = None, args: tuple[str, ...] = ()
    ) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [
                sys.executable,
                str(project / "_bmad" / "scripts" / "render_skill.py"),
                "--project-root",
                str(project),
                "--skill",
                str(skill),
                *args,
            ],
            cwd=cwd or project,
            text=True,
            capture_output=True,
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

    def _assert_rendered(self, workflow: Path, project: Path, skill_name: str) -> Path:
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

    def _fixture_skill(self, ws: SimpleNamespace, defaults: str, workflow: str, **sources: str) -> Path:
        skill = ws.outer / "skills" / "fixture"
        skill.mkdir(parents=True)
        (skill / "customize.toml").write_text(defaults, encoding="utf-8")
        for name, content in {"workflow.md": workflow, **sources}.items():
            (skill / name).write_text(content, encoding="utf-8")
        return skill

    def _assert_halt(self, result: subprocess.CompletedProcess[str], ws: SimpleNamespace) -> None:
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertTrue(result.stdout.startswith("HALT:"), result.stdout)
        self.assertEqual(len(result.stdout.splitlines()), 1, result.stdout)
        self.assertNotIn("Traceback", result.stdout + result.stderr)
        self.assertFalse((ws.bmad / "render").exists())

    def test_invocation_precedence_flag_order_and_persistent_isolation(self):
        ws = self._workspace()
        skill = self._fixture_skill(ws, '[workflow]\nmessage = "shipped"\n', "{{ workflow.message }}\n")
        project_file = ws.bmad / "custom" / "fixture.toml"
        user_file = ws.bmad / "custom" / "fixture.user.toml"
        override_file = ws.project / "nested" / "cwd" / "invocation.toml"
        project_file.write_text('[workflow]\nmessage = "project"\n', encoding="utf-8")
        user_file.write_text('[workflow]\nmessage = "user"\n', encoding="utf-8")
        override_file.write_text('[workflow]\nmessage = "file"\n', encoding="utf-8")
        original = {
            path: path.read_bytes() for path in (project_file, user_file, override_file, skill / "customize.toml")
        }
        baseline = rs.render(ws.project, skill)
        self.assertEqual(baseline.read_text(), "user\n")
        from_file = rs.render(ws.project, skill, overrides=override_file)
        self.assertEqual(from_file.read_text(), "file\n")
        expected = None
        for args in (
            (
                "--set",
                "workflow.message=command = wins",
                "--overrides",
                "invocation.toml",
            ),
            (
                "--overrides",
                "invocation.toml",
                "--set",
                "workflow.message=command = wins",
            ),
        ):
            entry = self._entry(self._cli(ws.project, skill, cwd=override_file.parent, args=args))
            self.assertEqual(entry.read_text(), "command = wins\n")
            if expected is not None:
                self.assertEqual(entry, expected)
            expected = entry
        self.assertEqual(rs.render(ws.project, skill), baseline)
        for path, content in original.items():
            self.assertEqual(path.read_bytes(), content)
        user_file.unlink()
        self.assertEqual(rs.render(ws.project, skill).read_text(), "project\n")
        project_file.unlink()
        self.assertEqual(rs.render(ws.project, skill).read_text(), "shipped\n")

    def test_equivalent_invocation_forms_merge_structures_and_reuse_rendered(self):
        ws = self._workspace()
        skill = self._fixture_skill(
            ws,
            '[workflow]\nfacts = ["base"]\n[workflow.details]\nlabel = "base"\nkept = "kept"\n'
            '[[workflow.layers]]\nid = "a"\nname = "A"\ninstruction = "original"\n',
            "{{ workflow.facts }}\n{{ workflow.details.label }} {{ workflow.details.kept }}\n{{ workflow.layers }}\n",
        )
        override = ws.project / "overrides.toml"
        override.write_text(
            '[workflow]\nfacts = ["added"]\ndetails = { label = "changed" }\n'
            'layers = [{ id = "a", name = "Replaced", instruction = "replacement" }, '
            '{ id = "b", instruction = "new" }]\n',
            encoding="utf-8",
        )
        file_entry = rs.render(ws.project, skill, overrides=override)
        command_entry = rs.render(
            ws.project,
            skill,
            assignments=[
                'workflow.facts=["added"]',
                'workflow.details={ label = "changed" }',
                'workflow.layers=[{ id = "a", name = "Replaced", instruction = "replacement" }, '
                '{ id = "b", instruction = "new" }]',
            ],
        )
        self.assertEqual(file_entry, command_entry)
        self.assertEqual(_files(file_entry.parent), _files(command_entry.parent))
        content = command_entry.read_text()
        self.assertIn("- base\n- added", content)
        self.assertIn("changed kept", content)
        self.assertIn("Replaced (`a`)", content)
        self.assertIn("b (`b`)", content)
        self.assertNotIn("original", content)
        combined = rs.render(ws.project, skill, overrides=override, assignments=['workflow.facts=["command"]'])
        self.assertIn("- base\n- added\n- command", combined.read_text())

    def test_string_assignment_syntax_and_conflicting_paths_halt(self):
        ws = self._workspace()
        skill = self._fixture_skill(ws, '[workflow]\nmessage = "base"\n', "{{ workflow.message }}")
        for assignment, expected in (
            ("workflow.message=words = more words", "words = more words"),
            ('workflow.message="line\\nnext"', "line\nnext"),
            ("workflow.message='literal = text'", "literal = text"),
            ("workflow.message=", ""),
        ):
            with self.subTest(assignment=assignment):
                # The nonempty shipped default deliberately rejects empty prose.
                if not expected:
                    with self.assertRaisesRegex(rs.RenderError, "must not be empty"):
                        rs.render(ws.project, skill, assignments=[assignment])
                else:
                    self.assertEqual(rs.render(ws.project, skill, assignments=[assignment]).read_text(), expected)
        for assignments in (
            ["workflow.message=first", "workflow.message=second"],
            ['workflow={ message = "table" }', "workflow.message=child"],
            ["workflow.message=child", 'workflow={ message = "table" }'],
        ):
            with self.subTest(assignments=assignments):
                with self.assertRaisesRegex(rs.RenderError, "conflicts with earlier --set"):
                    rs.render(ws.project, skill, assignments=assignments)

    def test_invalid_invocation_halts_before_publication(self):
        invalid = (
            ("--set", "workflow.message"),
            ("--set", ".workflow.message=x"),
            ("--set", "workflow.unknown=x"),
            ("--set", 'workflow.message="unterminated'),
            ("--set", "workflow.count=words"),
            # Declared but never reaches a token or condition in this render.
            ("--set", "workflow.count=7"),
            # Consumed, so the consumer rejects the type.
            ("--set", "workflow.items=7"),
            ("--set", "workflow.items=[true]"),
            ("--set", "workflow.count=2\nextra=3"),
            ("--overrides", "missing.toml"),
            ("--overrides",),
            ("--set",),
        )
        for args in invalid:
            with self.subTest(args=args):
                ws = self._workspace()
                skill = self._fixture_skill(
                    ws,
                    '[workflow]\nmessage = "base"\ncount = 1\nitems = ["base"]\n',
                    "{{ workflow.message }} {{ workflow.items }}\n",
                )
                self._assert_halt(self._cli(ws.project, skill, args=args), ws)
        for content in ("[workflow", '[workflow]\nunknown="x"', "[workflow]\ncount=7", "[workflow]\nitems=7"):
            with self.subTest(content=content):
                ws = self._workspace()
                skill = self._fixture_skill(ws, '[workflow]\ncount = 1\nitems = ["base"]\n', "{{ workflow.items }}\n")
                override = ws.project / "bad.toml"
                override.write_text(content, encoding="utf-8")
                self._assert_halt(self._cli(ws.project, skill, args=("--overrides", str(override))), ws)

    def test_nested_conditions_omit_files_and_do_not_resolve_excluded_expressions(self):
        ws = self._workspace()
        skill = self._fixture_skill(
            ws,
            '[workflow]\nchoice = "left"\nenabled = true\n',
            '{% if workflow.choice == "left" %}\nLeft {{ rendered("left.md") }}\n'
            "{% if workflow.enabled %}\nEnabled\n{% else %}\n"
            '{{ config.missing }} {{ workflow.missing }} {{ rendered("missing.md") }}\n{% endif %}\n'
            '{% else %}\nRight {{ rendered("right.md") }}\n{% endif %}\n',
            **{
                "left.md": '{% if workflow.choice == "left" %}\nLeft detail\n{% endif %}\n',
                "right.md": '\n{% if workflow.choice != "left" %}\nRight detail\n{% endif %}\n',
            },
        )
        left = rs.render(ws.project, skill)
        before = _files(left.parent)
        # Standalone tag lines leave no blank lines behind.
        self.assertEqual(left.read_text(), f"Left {left.parent / 'left.md'}\nEnabled\n")
        self.assertEqual((left.parent / "left.md").read_text(), "Left detail\n")
        self.assertFalse((left.parent / "right.md").exists())
        right = rs.render(ws.project, skill, assignments=["workflow.choice=right"])
        self.assertNotEqual(left, right)
        self.assertEqual(right.read_text(), f"Right {right.parent / 'right.md'}\n")
        self.assertFalse((right.parent / "left.md").exists())
        self.assertTrue((right.parent / "right.md").exists())
        self.assertEqual(before, _files(left.parent))
        self.assertEqual(left, rs.render(ws.project, skill))
        manifest = json.loads((left.parent / "manifest.json").read_text())
        self.assertEqual(
            manifest["inputs"]["resolved_values"],
            {
                "customization.workflow.choice": "left",
                "customization.workflow.enabled": True,
            },
        )
        self.assertIn("right.md", manifest["inputs"]["source_sha256"])
        self.assertNotIn("right.md", manifest["outputs"])
        (skill / "right.md").write_text((skill / "right.md").read_text().replace("Right detail", "Changed detail"))
        self.assertNotEqual(left, rs.render(ws.project, skill))

    def test_typed_scalar_condition_inputs_identify_generations_even_for_identical_output(self):
        for default, condition, override in (
            ("true", "workflow.value == true", "false"),
            ("1", "workflow.value == 1", "2"),
            ("1.5", "workflow.value == 1.5", "2.5"),
            ('"one"', 'workflow.value == "one"', '"two"'),
            ("2026-09-07", 'workflow.value|string == "2026-09-07"', "2026-09-08"),
        ):
            with self.subTest(default=default):
                ws = self._workspace()
                skill = self._fixture_skill(
                    ws,
                    f"[workflow]\nvalue = {default}\n",
                    f"{{% if {condition} %}}\nSame\n{{% else %}}\nSame\n{{% endif %}}\n",
                )
                before = rs.render(ws.project, skill)
                after = rs.render(ws.project, skill, assignments=[f"workflow.value={override}"])
                self.assertEqual(before.read_bytes(), after.read_bytes())
                self.assertNotEqual(before, after)
                self.assertEqual(after, rs.render(ws.project, skill, assignments=[f"workflow.value={override}"]))

    def test_loops_iterate_list_values_and_direct_insertion_keeps_markdown_forms(self):
        ws = self._workspace()
        skill = self._fixture_skill(
            ws,
            '[workflow]\nfacts = ["one", "two"]\n[[workflow.layers]]\nid = "a"\nname = "A"\n'
            'instruction = "Read {skill-root}/a.md"\n[[workflow.layers]]\nid = "b"\ninstruction = ""\n',
            "{% for fact in workflow.facts %}\n* {{ fact }}\n{% endfor %}\n{{ workflow.facts }}\n"
            "{% for layer in workflow.layers if layer.instruction %}\n{{ layer.id }}: {{ layer.instruction }}\n"
            "{% endfor %}\n{{ workflow.layers }}\n",
        )
        entry = rs.render(ws.project, skill)
        snap = entry.parent
        self.assertEqual(
            entry.read_text(),
            f"* one\n* two\n- one\n- two\na: Read {snap}/a.md\n#### A (`a`)\n\nRead {snap}/a.md\n",
        )
        manifest = json.loads((snap / "manifest.json").read_text())
        self.assertEqual(
            manifest["inputs"]["resolved_values"],
            {
                "customization.workflow.facts": ["one", "two"],
                "customization.workflow.layers": [
                    {"id": "a", "name": "A", "instruction": "Read {skill-root}/a.md"},
                    {"id": "b", "name": "b", "instruction": ""},
                ],
            },
        )

    def test_template_errors_report_source_location_and_halt(self):
        templates = (
            '{% if workflow.value == "one" %}\ntext\n',
            "{% else %}\n",
            "{% endif %}\n",
            "{% if %}\n{% endif %}\n",
            "{{ workflow.value\n",
            "{{ workflow.unknown }}\n",
            "{{ nothing }}\n",
            "{{ workflow }}\n",
            "{{ config }}\n",
            "{{ config.nothing }}\n",
            "{{ config.core.nothing }}\n",
            "{{ workflow.items.missing }}\n",
            "{% for item in workflow.value %}{{ item }}{% endfor %}\n",
            "{% for item in workflow.count %}{{ item }}{% endfor %}\n",
            '{{ rendered("missing.md") }}\n',
            "{{ rendered(workflow.items) }}\n",
        )
        for template in templates:
            with self.subTest(template=template):
                ws = self._workspace()
                skill = self._fixture_skill(ws, '[workflow]\nvalue = "one"\ncount = 1\nitems = []\n', f"ok\n{template}")
                result = self._cli(ws.project, skill)
                self._assert_halt(result, ws)
                self.assertRegex(result.stdout, r"^HALT: workflow\.md:\d+: ")
        ws = self._workspace()
        skill = self._fixture_skill(
            ws, '[workflow]\nvalue = "one"\n', "entry\n", **{"detail.md": "\n\n{{ nothing }}\n"}
        )
        with self.assertRaisesRegex(rs.RenderError, r"^detail\.md:3: 'nothing' is undefined$"):
            rs.render(ws.project, skill)
        (skill / "detail.md").write_text("{{ workflow.missing }}\n", encoding="utf-8")
        with self.assertRaisesRegex(
            rs.RenderError, r"^detail\.md:1: missing customization parameter `workflow\.missing`$"
        ):
            rs.render(ws.project, skill)

    def test_excluded_entry_and_surviving_reference_to_excluded_file_halt(self):
        for workflow in (
            "{% if workflow.enabled == false %}\nExcluded\n{% endif %}\n",
            'Read {{ rendered("detail.md") }}\n',
        ):
            with self.subTest(workflow=workflow):
                ws = self._workspace()
                skill = self._fixture_skill(
                    ws,
                    "[workflow]\nenabled = true\n",
                    workflow,
                    **{"detail.md": "{% if workflow.enabled == false %}\nExcluded\n{% endif %}\n"},
                )
                self._assert_halt(self._cli(ws.project, skill), ws)

    def test_raw_blocks_keep_agent_placeholders_verbatim(self):
        ws = self._workspace()
        skill = self._fixture_skill(
            ws,
            "[workflow]\n",
            "epic: {% raw %}{{epic_number}}{% endraw +%}\nnext {% raw %}{{prev}}{% endraw %} {{ '{%' }} done\n",
        )
        self.assertEqual(rs.render(ws.project, skill).read_text(), "epic: {{epic_number}}\nnext {{prev}} {% done\n")

    def test_invocation_prose_keeps_template_syntax_opaque(self):
        ws = self._workspace()
        skill = self._fixture_skill(ws, '[workflow]\nmessage = ""\n', "{{ workflow.message }}\n")
        literal = "{% if workflow.missing %}\n{{ workflow.missing }} {{ config.missing }} {# note #}\n{% endif %}"
        literal += '\n{{ rendered("missing.md") }} {skill-root}/detail.md'
        entry = rs.render(ws.project, skill, assignments=[f"workflow.message={literal}"])
        self.assertEqual(entry.read_text(), literal.replace("{skill-root}", str(entry.parent)) + "\n")

    def test_jinja2_version_is_part_of_the_generation_identity(self):
        ws = self._workspace()
        skill = self._fixture_skill(ws, "[workflow]\n", "stable\n")
        original = rs.render(ws.project, skill)
        manifest = json.loads((original.parent / "manifest.json").read_text())
        self.assertEqual(manifest["inputs"]["jinja2_version"], rs.jinja2.__version__)
        with mock.patch.object(rs.jinja2, "__version__", "0.0.0"):
            changed = rs.render(ws.project, skill)
        self.assertNotEqual(changed, original)
        self.assertEqual(changed.read_bytes(), original.read_bytes())
        self.assertTrue(original.exists())

    def test_shipped_skills_publish_root_bound_snapshots(self):
        for name in SHIPPED_SKILLS:
            with self.subTest(name):
                ws = self._workspace()
                skill = self._skill(ws, name)
                workflow = rs.render(ws.project, skill)
                snap = self._assert_rendered(workflow, ws.project, name)
                self.assertIn("{spec_file}", _markdown(snap))
                hunter = snap / "review-prompts" / "edge-case-hunter.md"
                self.assertTrue(hunter.is_file())
                self.assertIn(str(hunter), _markdown(snap))

    def test_rendered_skills_publish_snapshots_without_skill_root(self):
        for name in RENDERED_SKILLS:
            with self.subTest(name):
                ws = self._workspace()
                skill = self._skill(ws, name)
                workflow = rs.render(ws.project, skill)
                self._assert_rendered(workflow, ws.project, name)

    def test_skill_root_binds_bundled_scripts_to_the_installed_skill(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-retrospective")
        snap = self._assert_rendered(rs.render(ws.project, skill), ws.project, "bmad-retrospective")
        markdown = _markdown(snap)
        self.assertIn(str(skill / "scripts" / "sprint_status.py"), markdown)
        self.assertIn("epic: {{epic_number}}\n", markdown)
        self.assertIn("epic-{{prev}}-retro-*.md", markdown)
        self.assertIn(str(skill / "scripts" / "git_evidence.py"), markdown)
        manifest = json.loads((snap / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["inputs"]["skill_root"], str(skill.resolve()))
        elsewhere = _copy_skill(ws.outer / "elsewhere" / "bmad-retrospective", "bmad-retrospective")
        other = rs.render(ws.project, elsewhere)
        self.assertNotEqual(other.parent, snap)
        self.assertIn(str(elsewhere / "scripts" / "sprint_status.py"), _markdown(other.parent))

    def test_cli_from_nested_cwd_dispatches_one_absolute_workflow(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        workflow = self._entry(self._cli(ws.project, skill, cwd=ws.project / "nested" / "cwd"))
        self._assert_rendered(workflow, ws.project, "bmad-build")
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
            (skill / "compile-epic-context.md").read_text(encoding="utf-8") + "\n<!-- effective change -->\n",
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
            results = list(pool.map(lambda _: self._cli(ws.project, skill), range(2)))
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
        (ws.bmad / "custom" / f"{skill.name}.toml").write_text("[workflow\nbad", encoding="utf-8")
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
        literal = '{{ rendered("step-04-review.md") }}'
        compile_literal = "{{ workflow.implementation_handoff }}"
        (ws.bmad / "custom" / f"{skill.name}.user.toml").write_text(
            f"[workflow]\non_complete = 'Preserve {literal} and {compile_literal} as prose'\n",
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
        review = (rs.render(ws.project, skill).parent / "step-04-review.md").read_text(encoding="utf-8")
        self.assertIn("Replacement (`blind-hunter`)", review)
        self.assertIn("Run only when: the replacement condition holds", review)
        self.assertIn("Run replacement review.", review)

        defaults = tomllib.loads((skill / "customize.toml").read_text(encoding="utf-8"))
        disabled = "\n".join(
            f'[[workflow.review_layers]]\nid = "{layer["id"]}"\nname = "disabled"\ninstruction = ""\n'
            for layer in defaults["workflow"]["review_layers"]
        )
        (ws.bmad / "custom" / f"{skill.name}.toml").write_text(disabled, encoding="utf-8")
        review = (rs.render(ws.project, skill).parent / "step-04-review.md").read_text(encoding="utf-8")
        self.assertIn("No active review layers. HALT", review)

    def test_non_empty_open_spec_override_reaches_both_terminal_routes(self):
        ws = self._workspace()
        skill = self._skill(ws, "bmad-build")
        (ws.bmad / "custom" / f"{skill.name}.user.toml").write_text(
            '[workflow]\nopen_spec = "OPEN-SPEC-SENTINEL {project-root} {spec_file}"\n',
            encoding="utf-8",
        )
        snap = rs.render(ws.project, skill).parent
        for name in ("step-05-present.md", "step-oneshot.md"):
            rendered = (snap / name).read_text(encoding="utf-8")
            self.assertIn("OPEN-SPEC-SENTINEL {project-root} {spec_file}", rendered)

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
        (skill / "workflow.md").write_text('Read `{{ rendered("step.md") }}`.\n', encoding="utf-8")
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
        ws = self._workspace(name="{{ workflow.on_complete }}-{{ config.planning_artifacts }}")
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

    def test_skill_md_command_dispatches_for_every_rendered_skill(self):
        for name in RENDERED_SKILLS:
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
                        capture_output=True,
                        check=False,
                    )
                )
                self.assertEqual(dispatched.name, "workflow.md")
                self.assertTrue(dispatched.is_file())


if __name__ == "__main__":
    unittest.main()
