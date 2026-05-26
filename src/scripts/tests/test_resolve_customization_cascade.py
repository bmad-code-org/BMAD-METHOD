import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "resolve_customization.py"


def make_skill(parent: Path, name: str, defaults_toml: str, module: str | None = None) -> Path:
    """Create a fake skill dir, optionally under a `{module}-skills/` ancestor."""
    if module:
        base = parent / f"{module}-skills"
        base.mkdir(parents=True, exist_ok=True)
    else:
        base = parent
    skill_dir = base / name
    skill_dir.mkdir()
    (skill_dir / "customize.toml").write_text(defaults_toml, encoding="utf-8")
    return skill_dir


def run(skill_dir: Path, key=None, env_overrides=None):
    env = os.environ.copy()
    # Force BMAD_HOME to a guaranteed-missing path so the developer's real
    # ~/.bmad never leaks into a test expecting an empty global. Tests that
    # need a populated global override via env_overrides below.
    env["BMAD_HOME"] = "/nonexistent-bmad-home-default"
    if env_overrides:
        env.update(env_overrides)
    args = [sys.executable, str(SCRIPT), "--skill", str(skill_dir)]
    if key:
        args.extend(["--key", key])
    result = subprocess.run(
        args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env, check=False
    )
    stderr = result.stderr.decode("utf-8", errors="replace")
    if result.returncode != 0:
        raise AssertionError(f"resolve_customization failed ({result.returncode}): {stderr}")
    return json.loads(result.stdout.decode("utf-8"))


class ResolveCustomizationCascadeTests(unittest.TestCase):
    def test_defaults_pass_through_when_no_overrides(self):
        with tempfile.TemporaryDirectory() as t:
            skill = make_skill(Path(t), "bmad-prd", '[knobs]\ndepth = "low"\n')
            data = run(skill)
        self.assertEqual(data["knobs"]["depth"], "low")

    def test_skills_section_in_global_customize_overrides_default(self):
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as global_dir:
            skill = make_skill(Path(t), "bmad-prd", '[knobs]\ndepth = "low"\n')
            (Path(global_dir) / "customize.toml").write_text(
                '[skills.bmad-prd.knobs]\ndepth = "high"\n',
                encoding="utf-8",
            )
            data = run(skill, env_overrides={"BMAD_HOME": global_dir})
        self.assertEqual(data["knobs"]["depth"], "high")

    def test_config_toml_is_not_consulted_for_skills_section(self):
        # [skills.X] in config.toml must NOT be honored — only customize.toml is.
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as g:
            skill = make_skill(Path(t), "bmad-prd", '[knobs]\ndepth = "low"\n')
            (Path(g) / "config.toml").write_text(
                '[skills.bmad-prd.knobs]\ndepth = "should-be-ignored"\n',
                encoding="utf-8",
            )
            data = run(skill, env_overrides={"BMAD_HOME": g})
        self.assertEqual(data["knobs"]["depth"], "low")

    def test_specificity_within_layer(self):
        # Within ONE customize layer: exact skill name beats wildcard.
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as g:
            skill = make_skill(Path(t), "bmad-prd", '[knobs]\ndepth = "low"\n')
            (Path(g) / "customize.toml").write_text(
                "[skills.\"*\".knobs]\ndepth = \"catchall\"\n"
                "[skills.bmad-prd.knobs]\ndepth = \"exact\"\n",
                encoding="utf-8",
            )
            data = run(skill, env_overrides={"BMAD_HOME": g})
        self.assertEqual(data["knobs"]["depth"], "exact")

    def test_layer_precedence_overrides_specificity(self):
        # Across layers: higher layer wins even with less-specific pattern.
        # Project custom user (highest customize layer) uses '*';
        # global (lowest) uses exact — project custom should still win.
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as g:
            project = Path(t) / "project"
            bmad = project / "_bmad"
            (bmad / "custom").mkdir(parents=True)
            skill = make_skill(project, "bmad-prd", '[knobs]\ndepth = "low"\n')

            (Path(g) / "customize.toml").write_text(
                "[skills.bmad-prd.knobs]\ndepth = \"global-exact\"\n",
                encoding="utf-8",
            )
            (bmad / "custom" / "customize.user.toml").write_text(
                "[skills.\"*\".knobs]\ndepth = \"custom-wildcard\"\n",
                encoding="utf-8",
            )
            data = run(skill, env_overrides={"BMAD_HOME": g})
        self.assertEqual(data["knobs"]["depth"], "custom-wildcard")

    def test_per_skill_custom_file_beats_customize_section(self):
        # Per-skill _bmad/custom/{skill}.user.toml is still the highest tier.
        with tempfile.TemporaryDirectory() as t:
            project = Path(t) / "project"
            bmad = project / "_bmad"
            (bmad / "custom").mkdir(parents=True)
            skill = make_skill(project, "bmad-prd", '[knobs]\ndepth = "low"\n')

            (bmad / "custom" / "customize.user.toml").write_text(
                "[skills.bmad-prd.knobs]\ndepth = \"via-section\"\n",
                encoding="utf-8",
            )
            (bmad / "custom" / "bmad-prd.user.toml").write_text(
                "[knobs]\ndepth = \"via-per-skill-file\"\n",
                encoding="utf-8",
            )
            data = run(skill)
        self.assertEqual(data["knobs"]["depth"], "via-per-skill-file")

    def test_qualified_module_pattern_matches(self):
        # Skill under bmm-skills/ → qualified name 'bmm/bmad-prd'.
        # Pattern '[skills."bmm/*"]' should match.
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as g:
            skill = make_skill(
                Path(t), "bmad-prd", '[knobs]\ndepth = "low"\n', module="bmm"
            )
            (Path(g) / "customize.toml").write_text(
                "[skills.\"bmm/*\".knobs]\ndepth = \"all-bmm\"\n",
                encoding="utf-8",
            )
            data = run(skill, env_overrides={"BMAD_HOME": g})
        self.assertEqual(data["knobs"]["depth"], "all-bmm")

    def test_qualified_exact_beats_module_wildcard(self):
        # Within one layer: 'bmm/bmad-prd' (exact) beats 'bmm/*' (wildcard).
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as g:
            skill = make_skill(
                Path(t), "bmad-prd", '[knobs]\ndepth = "low"\n', module="bmm"
            )
            (Path(g) / "customize.toml").write_text(
                "[skills.\"bmm/*\".knobs]\ndepth = \"module-wide\"\n"
                "[skills.\"bmm/bmad-prd\".knobs]\ndepth = \"pinned\"\n",
                encoding="utf-8",
            )
            data = run(skill, env_overrides={"BMAD_HOME": g})
        self.assertEqual(data["knobs"]["depth"], "pinned")


if __name__ == "__main__":
    unittest.main()
