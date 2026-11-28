import sys
import unittest
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "skills/core-tools/bmad/scripts"))

import setup  # noqa: E402


def module(code: str, folder: str, skills: tuple[str, ...], removed: tuple[str, ...] = ()) -> setup.InstalledModule:
    return setup.InstalledModule(
        module=code,
        folder=folder,
        source=Path(f"/skills/{folder}"),
        file=Path(f"/skills/{folder}/bmod.toml"),
        parsed=SimpleNamespace(update_source="github:o/r/skills"),
        skills=skills,
        absent_skills=(),
        members=(),
        questions=(),
        retired=setup.ParsedRetired(removed=removed),
    )


class RetiredSkillsTests(unittest.TestCase):
    def test_a_module_whose_record_is_retired_is_offered_whole(self):
        old = module("old", "bmod-old", ("old-agent", "old-flow"))
        new = module("new", "new-agent", ("new-agent",), removed=("bmod-old", "old-agent", "old-flow"))

        names = [entry.name for entry in setup.retired_skills((new,), (old, new))]

        self.assertEqual(names, ["bmod-old", "old-agent", "old-flow"])

    def test_a_name_a_live_module_still_lists_is_not_retired(self):
        keeper = module("keeper", "bmod-keeper", ("shared-skill",))
        new = module("new", "new-agent", ("new-agent",), removed=("shared-skill",))

        self.assertEqual(setup.retired_skills((new,), (keeper, new)), ())


if __name__ == "__main__":
    unittest.main()
