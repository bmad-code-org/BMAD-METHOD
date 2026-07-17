# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Pytest port of the retired test/test-quick-dev-renderer.js smoke test for
bmad-quick-dev's render.py template renderer.

render.py is already Python, so unlike the js_bridge-based ports in Stories
2/3/5, this test needs no bridge at all: it subprocess.run()s render.py
directly, mirroring the JS test's own
spawnSync('python3', [render_py_path], {cwd, encoding: 'utf-8'}) call.

Ports every assertion from the JS runner:
  - the base render + override-wins checks
  - [workflow] customization inlining (prepend/append/_None./on_complete)
  - review-layer materialization (default rendering, id-keyed replace,
    empty-instruction drop, `when` guard, {diff_output} survival)
  - the all-layers-disabled HALT check (second render into the same project)
  - the leak checks ({workflow.*}, resolve_customization.py, main_config)
  - the four isolated-temp-project bad-config HALT-cleanly checks, including
    the JS test's makeProject(configText) helper
"""

import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
SKILL_SRC = REPO_ROOT / "src" / "bmm-skills" / "4-implementation" / "bmad-quick-dev"


def run_render(skill_dir: Path) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["python3", str(skill_dir / "render.py")],
        cwd=skill_dir,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )


def read_rendered(render_dir: Path, name: str) -> str:
    return (render_dir / name).read_text(encoding="utf-8")


def rendered_md_files(render_dir: Path) -> list[str]:
    return sorted(p.name for p in render_dir.iterdir() if p.name.endswith(".md"))


def make_project(base_dir: Path, config_text: str) -> Path:
    """Isolated temp project: _bmad/config.toml + a copy of the skill dir, so
    a single bad-config scenario can be rendered in isolation. Ports the JS
    test's makeProject(configText) helper, with a caller/callee inversion: the
    JS version creates its own temp dir internally (fs.mkdtempSync) and
    returns it, while this version takes an already-created base_dir (the
    caller passes pytest's per-test tmp_path fixture) and returns only the
    copied skill dir the caller runs render.py against."""
    bmad_dir = base_dir / "_bmad"
    bmad_dir.mkdir(parents=True, exist_ok=True)
    (bmad_dir / "config.toml").write_text(config_text, encoding="utf-8")
    skill_dst = base_dir / "bmad-quick-dev"
    shutil.copytree(SKILL_SRC, skill_dst)
    return skill_dst


@dataclass
class RenderedProject:
    tmp_dir: Path
    skill_dst: Path
    render_dir: Path
    result: subprocess.CompletedProcess


# ─── Base render + override-wins fixture ────────────────────────────────────


@pytest.fixture(scope="module")
def rendered(tmp_path_factory) -> RenderedProject:
    """Temp project with base + override config layers and a
    _bmad/custom/bmad-quick-dev.user.toml [workflow] override, rendered once
    via render.py — mirrors the JS test's top-level fixture setup."""
    tmp_dir = tmp_path_factory.mktemp("bmad-renderer-test-")

    bmad_dir = tmp_dir / "_bmad"
    bmad_dir.mkdir(parents=True, exist_ok=True)
    (bmad_dir / "config.toml").write_text(
        "\n".join(
            [
                "[core]",
                'communication_language = "French"',
                'document_output_language = "Klingon"',
                "",
                "[modules.bmm]",
                'planning_artifacts = "{project-root}/plan"',
                'implementation_artifacts = "{project-root}/impl"',
            ]
        ),
        encoding="utf-8",
    )

    custom_dir = bmad_dir / "custom"
    custom_dir.mkdir(parents=True, exist_ok=True)
    (custom_dir / "config.user.toml").write_text(
        "\n".join(["[core]", 'communication_language = "Japanese"']),
        encoding="utf-8",
    )

    # Exercises render.py's self-resolution: array append (persistent_facts),
    # list inlining (activation_steps_prepend), and scalar override
    # (on_complete), all baked into the rendered output with no runtime
    # resolve_customization.py.
    (custom_dir / "bmad-quick-dev.user.toml").write_text(
        "\n".join(
            [
                "[workflow]",
                'activation_steps_prepend = ["TEST_PREPEND_STEP"]',
                'persistent_facts = ["TEST_EXTRA_FACT"]',
                'on_complete = "TEST_ON_COMPLETE_INSTRUCTION"',
                "",
                "[[workflow.review_layers]]",
                'id = "edge-case-hunter"',
                'name = "Replaced Layer"',
                'when = "TEST_WHEN_CONDITION"',
                'instruction = "TEST_REPLACED_LAYER_INSTRUCTION"',
                "",
                "[[workflow.review_layers]]",
                'id = "verification-gap"',
                'instruction = ""',
            ]
        ),
        encoding="utf-8",
    )

    # Copy skill dir into <tmp_dir>/bmad-quick-dev/ so find_project_root()
    # walks up and finds <tmp_dir>/_bmad/, and os.path.basename(script_dir)
    # resolves to the real skill name so the render output lands at
    # _bmad/render/bmad-quick-dev/workflow.md.
    skill_dst = tmp_dir / "bmad-quick-dev"
    shutil.copytree(SKILL_SRC, skill_dst)

    result = run_render(skill_dst)

    render_dir = tmp_dir / "_bmad" / "render" / "bmad-quick-dev"
    return RenderedProject(tmp_dir=tmp_dir, skill_dst=skill_dst, render_dir=render_dir, result=result)


# ─── Base render checks ──────────────────────────────────────────────────────


def test_render_exits_zero(rendered):
    assert rendered.result.returncode == 0, (
        f"exit code {rendered.result.returncode}\n"
        f"stdout: {rendered.result.stdout}\nstderr: {rendered.result.stderr}"
    )


def test_workflow_md_exists_in_render_output(rendered):
    assert (rendered.render_dir / "workflow.md").exists()


# ─── Override / customization / review-layer content checks ────────────────


def test_custom_override_wins_communication_language(rendered):
    content = read_rendered(rendered.render_dir, "step-01-clarify-and-route.md")
    assert "Japanese" in content, (
        "communication_language override (Japanese) did not win in the step-01 language line"
    )


def test_document_output_language_bakes_into_language_line(rendered):
    content = read_rendered(rendered.render_dir, "step-01-clarify-and-route.md")
    assert "Klingon" in content, "document_output_language not baked into the step-01 language line"


def test_sprint_status_is_absolute_path_rooted_at_temp_project_dir(rendered):
    content = read_rendered(rendered.render_dir, "sync-sprint-status.md")
    # Normalize to forward slashes for cross-platform matching.
    normalized_tmp = str(rendered.tmp_dir).replace("\\", "/")
    expected = f"{normalized_tmp}/impl/sprint-status.yaml"
    assert expected in content, (
        f"sprint_status path not found.\nExpected substring: {expected}\n"
        f"sync-sprint-status.md excerpt (first 2000 chars):\n{content[:2000]}"
    )


def test_workflow_override_prepend_step_inlined_as_bullet(rendered):
    content = read_rendered(rendered.render_dir, "workflow.md")
    assert "- TEST_PREPEND_STEP" in content, "activation_steps_prepend not inlined as a bullet"


def test_workflow_override_persistent_facts_append(rendered):
    content = read_rendered(rendered.render_dir, "workflow.md")
    assert "- TEST_EXTRA_FACT" in content, "override persistent_fact not inlined"
    assert "project-context.md" in content, "base persistent_fact dropped — append semantics broken"


def test_empty_activation_steps_append_renders_none_sentinel(rendered):
    content = read_rendered(rendered.render_dir, "workflow.md")
    assert "_None._" in content, "_None._ sentinel missing for empty list"


def test_on_complete_scalar_inlined_into_step_05_and_step_oneshot(rendered):
    for fname in ("step-05-present.md", "step-oneshot.md"):
        assert "TEST_ON_COMPLETE_INSTRUCTION" in read_rendered(rendered.render_dir, fname), (
            f"on_complete not inlined into {fname}"
        )


def test_review_layers_materialize_as_invocation_blocks_in_step_04(rendered):
    content = read_rendered(rendered.render_dir, "step-04-review.md")
    assert "#### Blind Hunter" in content, "default review layer not rendered as a #### invocation block"
    assert "- id:" not in content, "layer table data leaked into the rendered output"
    assert "{diff_output}" in content, "runtime {diff_output} placeholder did not survive rendering"


def test_review_layer_override_replaces_matching_default_by_id(rendered):
    content = read_rendered(rendered.render_dir, "step-04-review.md")
    assert "#### Replaced Layer" in content, "override layer name not used as block title"
    assert "TEST_REPLACED_LAYER_INSTRUCTION" in content, "override layer instruction not inlined"
    assert "bmad-review-edge-case-hunter" not in content, "replaced default layer instruction still present"
    assert "bmad-review-adversarial-general" in content, "untouched default layer dropped by keyed merge"


def test_empty_instruction_override_drops_layer_entirely(rendered):
    content = read_rendered(rendered.render_dir, "step-04-review.md")
    assert "verification-gap" not in content, "disabled layer id still present in rendered output"
    assert "Verification Gap Reviewer" not in content, "disabled layer name still present in rendered output"


def test_when_condition_renders_as_run_time_guard_line(rendered):
    content = read_rendered(rendered.render_dir, "step-04-review.md")
    assert (
        "Run this layer only if the following holds in the current context: `TEST_WHEN_CONDITION`" in content
    ), "when condition not rendered as a guard line"


# ─── All-layers-disabled HALT + leak checks ─────────────────────────────────
#
# Second render pass into the *same* project: replace the override file so
# every default layer (and the oneshot route's only layer) is disabled, then
# re-render. Mirrors the JS test's in-place second spawnSync call — the leak
# checks below run against this second render's output, exactly as they do
# in the JS runner (its leak checks execute after the disable-all test, and
# re-read the render dir fresh each time).
#
# ORDERING CONSTRAINT: rendered_disabled mutates rendered.render_dir in place
# (it overwrites the on-disk .md files that the "rendered"-only tests above
# read from). Both fixtures are module-scoped, so this is safe only because
# pytest executes tests in file-declaration order by default and nothing in
# this suite reorders them. Any new test that must read rendered's original,
# pre-disable output has to be declared ABOVE this point in the file — a test
# added below that depends only on the `rendered` fixture would silently read
# the post-disable (corrupted-for-that-purpose) content instead.


@pytest.fixture(scope="module")
def rendered_disabled(rendered: RenderedProject) -> subprocess.CompletedProcess:
    override_path = rendered.tmp_dir / "_bmad" / "custom" / "bmad-quick-dev.user.toml"
    override_path.write_text(
        "\n".join(
            [
                "[workflow]",
                "",
                "[[workflow.review_layers]]",
                'id = "blind-hunter"',
                'instruction = ""',
                "",
                "[[workflow.review_layers]]",
                'id = "edge-case-hunter"',
                'instruction = ""',
                "",
                "[[workflow.review_layers]]",
                'id = "verification-gap"',
                'instruction = ""',
                "",
                "[[workflow.oneshot_review_layers]]",
                'id = "blind-hunter"',
                'instruction = ""',
            ]
        ),
        encoding="utf-8",
    )
    return run_render(rendered.skill_dst)


def test_disabling_every_layer_renders_halt_instruction(rendered: RenderedProject, rendered_disabled):
    assert rendered_disabled.returncode == 0, (
        f"re-render exit code {rendered_disabled.returncode}\nstderr: {rendered_disabled.stderr}"
    )
    halt = "No review layers are active. HALT with status `blocked` and blocking condition `no active review layers`."
    for fname in ("step-04-review.md", "step-oneshot.md"):
        assert halt in read_rendered(rendered.render_dir, fname), f"HALT instruction missing from {fname}"


def test_no_workflow_placeholder_survives_in_any_rendered_file(rendered: RenderedProject, rendered_disabled):
    leaks = [
        fname
        for fname in rendered_md_files(rendered.render_dir)
        if "{workflow." in read_rendered(rendered.render_dir, fname)
    ]
    assert leaks == [], f"{{workflow.*}} leaked in: {', '.join(leaks)}"


def test_no_resolve_customization_reference_survives_in_any_rendered_file(
    rendered: RenderedProject, rendered_disabled
):
    leaks = [
        fname
        for fname in rendered_md_files(rendered.render_dir)
        if "resolve_customization.py" in read_rendered(rendered.render_dir, fname)
    ]
    assert leaks == [], f"resolve_customization.py still referenced in: {', '.join(leaks)}"


def test_no_main_config_reference_survives_in_any_rendered_file(rendered: RenderedProject, rendered_disabled):
    leaks = [
        fname
        for fname in rendered_md_files(rendered.render_dir)
        if "main_config" in read_rendered(rendered.render_dir, fname)
    ]
    assert leaks == [], (
        f"main_config still referenced in: {', '.join(leaks)} (the runtime config re-read was removed)"
    )


# ─── Bad-config HALTs cleanly (never a raw Python traceback) ───────────────


def test_missing_implementation_artifacts_halts_cleanly(tmp_path):
    skill_dst = make_project(tmp_path, "\n".join(["[core]", 'communication_language = "French"']))
    result = run_render(skill_dst)
    assert result.returncode == 1, (
        f"expected exit 1, got {result.returncode}\nstdout: {result.stdout}\nstderr: {result.stderr}"
    )
    assert "HALT and report to the user: config is missing `implementation_artifacts`" in result.stdout, (
        f"stdout missing the implementation_artifacts HALT directive.\nstdout: {result.stdout}"
    )
    assert "Traceback" not in result.stderr, (
        f"renderer crashed with a traceback instead of HALTing:\n{result.stderr}"
    )


def test_missing_planning_artifacts_halts_cleanly(tmp_path):
    # implementation_artifacts is present, so this exercises the general
    # missing-vars scan rather than the dedicated guard.
    config_text = "\n".join(
        [
            "[core]",
            'communication_language = "French"',
            'document_output_language = "Klingon"',
            'implementation_artifacts = "{project-root}/impl"',
        ]
    )
    skill_dst = make_project(tmp_path, config_text)
    result = run_render(skill_dst)
    assert result.returncode == 1, (
        f"expected exit 1, got {result.returncode}\nstdout: {result.stdout}\nstderr: {result.stderr}"
    )
    assert "HALT and report to the user: config is missing" in result.stdout and "`planning_artifacts`" in result.stdout, (
        f"stdout missing the planning_artifacts HALT directive.\nstdout: {result.stdout}"
    )
    assert "step-01-clarify-and-route.md" in result.stdout, (
        f"HALT directive does not name the referencing file.\nstdout: {result.stdout}"
    )
    assert "Traceback" not in result.stderr, (
        f"renderer crashed with a traceback instead of HALTing:\n{result.stderr}"
    )


def test_unparseable_customization_override_halts_cleanly(tmp_path):
    config_text = "\n".join(
        [
            "[core]",
            'communication_language = "French"',
            'document_output_language = "Klingon"',
            'planning_artifacts = "{project-root}/plan"',
            'implementation_artifacts = "{project-root}/impl"',
        ]
    )
    skill_dst = make_project(tmp_path, config_text)
    custom_dir = tmp_path / "_bmad" / "custom"
    custom_dir.mkdir(parents=True, exist_ok=True)
    (custom_dir / "bmad-quick-dev.user.toml").write_text("[workflow\non_complete = broken", encoding="utf-8")
    result = run_render(skill_dst)
    assert result.returncode == 1, (
        f"expected exit 1, got {result.returncode}\nstdout: {result.stdout}\nstderr: {result.stderr}"
    )
    assert (
        "HALT and report to the user: failed to parse" in result.stdout
        and "bmad-quick-dev.user.toml" in result.stdout
    ), f"stdout missing the failed-to-parse HALT directive naming the override file.\nstdout: {result.stdout}"
    assert "Traceback" not in result.stderr, (
        f"renderer crashed with a traceback instead of HALTing:\n{result.stderr}"
    )


def test_non_table_modules_does_not_crash_renderer(tmp_path):
    config_text = "\n".join(
        [
            'modules = "oops-not-a-table"',
            "",
            "[core]",
            'communication_language = "French"',
            'document_output_language = "Klingon"',
            'planning_artifacts = "{project-root}/plan"',
            'implementation_artifacts = "{project-root}/impl"',
        ]
    )
    skill_dst = make_project(tmp_path, config_text)
    result = run_render(skill_dst)
    assert result.returncode == 0, (
        f"expected exit 0, got {result.returncode}\nstdout: {result.stdout}\nstderr: {result.stderr}"
    )
    assert "Traceback" not in result.stderr, f"renderer crashed on non-table modules:\n{result.stderr}"
    assert (tmp_path / "_bmad" / "render" / "bmad-quick-dev" / "workflow.md").exists(), (
        "workflow.md not rendered when [modules] was a non-table scalar"
    )
