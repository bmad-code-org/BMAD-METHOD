"""Tests for scan_legacy_module.py on fixtures shaped like the old multi-skill and single-skill modules."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scan_legacy_module.py"

MODULE_YAML = """code: sam
name: "BMad Samples"
description: "Demo module"
module_version: 1.2.0
default_selected: false
module_greeting: >
  The BMad Samples module is ready!
  Enjoy.

agents:
  - code: dw-agent
    name: Oneira
    title: Dream Guide

sample_output_folder:
  prompt: "Where should sample output be saved?"
  default: "{project-root}/_bmad-output"
  result: "{project-root}/{value}"

tone:
  prompt: "Which tone?"
  default: warm
  user_setting: true
  single-select:
    - value: warm
      label: Warm
    - value: dry
      label: Dry

verbose:
  prompt: "Verbose output?"
  default: false
"""

HELP_CSV = (
    "module,skill,display-name,menu-code,description,action,args,phase,preceded-by,followed-by,required,output-location,outputs\n"
    'BMad Samples,sample-module-setup,Setup Samples Module,SS,"Install or update config.",configure,"{-H: headless}",anytime,,,false,{project-root}/_bmad,config.yaml\n'
    'BMad Samples,bmad-agent-dream-weaver,Dream Capture,DL,"Capture a dream.",dream-log,,anytime,,,false,,journal entry\n'
    'BMad Samples,bmad-excalidraw,Create Diagram,XD,"Create diagrams.",diagram-generation,,anytime,,,false,sample_output_folder,excalidraw file\n'
)

SETUP_SKILL_MD = "---\nname: sample-module-setup\ndescription: 'Setup. Use when installing.'\n---\n\nRead `./assets/module.yaml`; write `{project-root}/_bmad/config.yaml`.\n"
DREAM_SKILL_MD = (
    "---\nname: bmad-agent-dream-weaver\ndescription: 'Dreams. Use when dreaming.'\n---\n\n"
    "If `{project-root}/_bmad/config.yaml` has no `sam` section, run the `sample-module-setup` skill.\n"
    "Personal settings live in `config.user.yaml`.\n"
)
EXCALIDRAW_SKILL_MD = "---\nname: bmad-excalidraw\ndescription: 'Diagrams. Use when drawing.'\n---\n\nRead `{project-root}/_bmad/config.toml`.\n"


def write(root: Path, files: dict[str, str]) -> None:
    for relative, text in files.items():
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")


def run(folder: Path):
    res = subprocess.run([sys.executable, str(SCRIPT), str(folder)], capture_output=True, text=True)
    return res.returncode, json.loads(res.stdout) if res.stdout.strip() else None, res.stderr


class ScanLegacyModuleTest(unittest.TestCase):
    def test_multi_skill_module_with_setup_skill(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "samples"
            write(
                root,
                {
                    "sample-module-setup/SKILL.md": SETUP_SKILL_MD,
                    "sample-module-setup/assets/module.yaml": MODULE_YAML,
                    "sample-module-setup/assets/module-help.csv": HELP_CSV,
                    "sample-module-setup/scripts/merge-config.py": "print(1)\n",
                    "sample-module-setup/scripts/merge-help-csv.py": "print(1)\n",
                    "sample-module-setup/scripts/cleanup-legacy.py": "print(1)\n",
                    "bmad-agent-dream-weaver/SKILL.md": DREAM_SKILL_MD,
                    "bmad-agent-dream-weaver/references/memory.md": "Nothing legacy here.\n",
                    "bmad-excalidraw/SKILL.md": EXCALIDRAW_SKILL_MD,
                    "node_modules/x/module.yaml": "code: ignored\n",
                },
            )
            code, data, err = run(root)
            self.assertEqual(code, 0, err)
            self.assertEqual(
                set(data),
                {
                    "module",
                    "config_keys",
                    "help_rows",
                    "skills",
                    "legacy_reads",
                    "legacy_placeholders",
                    "setup_skill",
                    "files_to_delete",
                },
            )
            self.assertEqual(
                data["module"],
                {
                    "code": "sam",
                    "name": "BMad Samples",
                    "version": "1.2.0",
                    "greeting": "The BMad Samples module is ready! Enjoy.",
                    "agents": [{"code": "dw-agent", "name": "Oneira", "title": "Dream Guide"}],
                },
            )
            keys = {k["key"]: k for k in data["config_keys"]}
            self.assertEqual(list(keys), ["sample_output_folder", "tone", "verbose"])
            self.assertEqual(keys["sample_output_folder"]["kind"], "text")
            self.assertEqual(keys["sample_output_folder"]["default"], "{project-root}/_bmad-output")
            self.assertFalse(keys["sample_output_folder"]["user_setting"])
            self.assertEqual(len(keys["sample_output_folder"]["unconvertible"]), 1)
            self.assertIn("result template", keys["sample_output_folder"]["unconvertible"][0])
            self.assertEqual(keys["tone"]["kind"], "single-select")
            self.assertTrue(keys["tone"]["user_setting"])
            self.assertEqual(keys["tone"]["prompt"], "Which tone?")
            self.assertEqual(keys["verbose"]["kind"], "confirm")
            self.assertEqual(keys["verbose"]["default"], False)
            self.assertEqual(len(data["help_rows"]), 3)
            self.assertEqual(data["help_rows"][1]["skill"], "bmad-agent-dream-weaver")
            self.assertEqual(data["help_rows"][1]["menu-code"], "DL")
            self.assertEqual(data["help_rows"][2]["output-location"], "sample_output_folder")
            self.assertEqual(data["skills"], ["bmad-agent-dream-weaver", "bmad-excalidraw"])
            self.assertEqual(data["setup_skill"], "sample-module-setup")
            self.assertEqual(data["files_to_delete"], ["sample-module-setup/"])
            self.assertEqual(
                [(r["skill"], r["path"], r["line"]) for r in data["legacy_reads"]],
                [
                    ("bmad-agent-dream-weaver", "bmad-agent-dream-weaver/SKILL.md", 6),
                    ("bmad-agent-dream-weaver", "bmad-agent-dream-weaver/SKILL.md", 7),
                ],
            )
            self.assertIn("sample-module-setup", data["legacy_reads"][0]["text"])

    def test_single_skill_module_with_module_setup(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "bmad-agent-dream-weaver"
            write(
                root,
                {
                    "SKILL.md": DREAM_SKILL_MD.replace(
                        "run the `sample-module-setup` skill", "load `assets/module-setup.md`"
                    ),
                    "assets/module.yaml": "code: dw\nname: Dream Weaver\nmodule_version: 1.0.0\nmodule_greeting: Hi.\n",
                    "assets/module-help.csv": HELP_CSV.splitlines()[0] + "\n" + HELP_CSV.splitlines()[2] + "\n",
                    "assets/module-setup.md": "Writes `{project-root}/_bmad/config.yaml`.\n",
                    "scripts/merge-config.py": "print(1)\n",
                    "scripts/merge-help-csv.py": "print(1)\n",
                    "scripts/seed_tracker.py": "print(1)\n",
                },
            )
            code, data, err = run(root)
            self.assertEqual(code, 0, err)
            self.assertEqual(data["module"]["code"], "dw")
            self.assertEqual(data["module"]["agents"], [])
            self.assertEqual(data["config_keys"], [])
            self.assertIsNone(data["setup_skill"])
            self.assertEqual(data["skills"], ["bmad-agent-dream-weaver"])
            self.assertEqual(
                data["files_to_delete"],
                [
                    "assets/module-help.csv",
                    "assets/module-setup.md",
                    "assets/module.yaml",
                    "scripts/merge-config.py",
                    "scripts/merge-help-csv.py",
                ],
            )
            self.assertEqual([r["line"] for r in data["legacy_reads"]], [6, 7])
            self.assertEqual(data["legacy_reads"][0]["skill"], "bmad-agent-dream-weaver")

    def test_non_bmad_module_reads_in_every_file_kind(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "acme"
            write(
                root,
                {
                    "acme-setup/SKILL.md": "---\nname: acme-setup\ndescription: x\n---\n",
                    "acme-setup/assets/module.yaml": "code: acme\nname: Acme\nmodule_version: 1.0.0\n",
                    "acme-notes/SKILL.md": (
                        "---\nname: acme-notes\ndescription: x\n---\n\n"
                        "Load `{project-root}/_bmad/acme/config.yaml`.\n"
                        "When it is missing, run acme-setup first.\n"
                        "Read `{project-root}/_bmad/config.toml`.\n"
                    ),
                    "acme-notes/customize.toml": 'persistent_facts = ["file:{project-root}/_bmad/acme/config.yaml"]\n',
                    "acme-notes/scripts/load.py": 'CONFIG = "_bmad/config.yaml"\n',
                    "acme-notes/references/data.yaml": "source: module-help.csv\n",
                    "acme-notes/references/data.json": '{"x": "_bmad/config.yaml"}\n',
                    "acme-notes/references/data.csv": "_bmad/config.yaml\n",
                    "acme-notes/bmad-manifest.json": '{"output-location": "_bmad/config.yaml"}\n',
                },
            )
            code, data, err = run(root)
            self.assertEqual(code, 0, err)
            self.assertEqual(data["setup_skill"], "acme-setup")
            self.assertEqual(
                [(r["path"], r["line"]) for r in data["legacy_reads"]],
                [
                    ("acme-notes/SKILL.md", 6),
                    ("acme-notes/SKILL.md", 7),
                    ("acme-notes/customize.toml", 1),
                    ("acme-notes/references/data.json", 1),
                    ("acme-notes/references/data.yaml", 1),
                    ("acme-notes/scripts/load.py", 1),
                ],
            )
            self.assertEqual({r["skill"] for r in data["legacy_reads"]}, {"acme-notes"})
            self.assertEqual(data["files_to_delete"], ["acme-notes/bmad-manifest.json", "acme-setup/"])

    def test_legacy_placeholders(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "acme"
            module_yaml = (
                "code: acme\nname: Acme\nmodule_version: 1.0.0\n"
                'planning_artifacts:\n  prompt: "Where?"\n  default: "{output_folder}/plans"\n'
            )
            write(
                root,
                {
                    "module.yaml": module_yaml,
                    "acme-notes/SKILL.md": (
                        "---\nname: acme-notes\ndescription: x\n---\n\n"
                        "Greet {user_name} in {communication_language}; write in {document_output_language}.\n"
                        "Save to {planning_artifacts} under {output_folder} for {project_name} on {date}.\n"
                    ),
                    "acme-notes/customize.toml": 'note = "{implementation_artifacts}/x"\n',
                },
            )
            code, data, err = run(root)
            self.assertEqual(code, 0, err)
            self.assertEqual(
                [(p["skill"], p["file"], p["line"], p["placeholder"]) for p in data["legacy_placeholders"]],
                [
                    ("acme-notes", "acme-notes/SKILL.md", 6, "{user_name}"),
                    ("acme-notes", "acme-notes/SKILL.md", 6, "{communication_language}"),
                    ("acme-notes", "acme-notes/SKILL.md", 6, "{document_output_language}"),
                    ("acme-notes", "acme-notes/customize.toml", 1, "{implementation_artifacts}"),
                ],
            )
            # the v6 module that owned planning_artifacts loses it in v7
            (root / "module.yaml").write_text(module_yaml.replace("code: acme", "code: bmm"), encoding="utf-8")
            code, data, err = run(root)
            self.assertEqual(code, 0, err)
            self.assertIn("{planning_artifacts}", [p["placeholder"] for p in data["legacy_placeholders"]])
            # and it is no longer a question to keep
            self.assertNotIn("planning_artifacts", [k["key"] for k in data["config_keys"]])

    def test_no_module_yaml_and_bad_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, data, err = run(Path(tmp))
            self.assertEqual(code, 1)
            self.assertIn("no module.yaml", err)
        res = subprocess.run([sys.executable, str(SCRIPT), "/nonexistent"], capture_output=True, text=True)
        self.assertEqual(res.returncode, 2)


if __name__ == "__main__":
    unittest.main()
