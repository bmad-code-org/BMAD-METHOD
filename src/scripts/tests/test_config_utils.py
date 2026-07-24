import sys
import tempfile
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from config_utils import (  # noqa: E402
    ConfigError,
    load_central_config,
    load_customization,
    load_toml,
    structural_merge,
)


class ConfigUtilsTests(unittest.TestCase):
    def test_structural_merge_recurses_appends_and_replaces_keyed_tables(self):
        base = {
            "nested": {"keep": True, "replace": "old"},
            "plain": ["base"],
            "items": [{"id": "one", "value": "old"}],
        }
        override = {
            "nested": {"replace": "new"},
            "plain": ["override"],
            "items": [
                {"id": "one", "value": "new"},
                {"id": "two", "value": "added"},
            ],
        }

        merged = structural_merge(base, override)

        self.assertEqual(merged["nested"], {"keep": True, "replace": "new"})
        self.assertEqual(merged["plain"], ["base", "override"])
        self.assertEqual(
            merged["items"],
            [
                {"id": "one", "value": "new"},
                {"id": "two", "value": "added"},
            ],
        )

    def test_non_string_keyed_identifier_is_rejected(self):
        with self.assertRaisesRegex(ConfigError, "identifier `id` must be a string"):
            structural_merge([{"id": "valid"}], [{"id": 42}])

    def test_present_malformed_optional_layer_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "optional.toml"
            path.write_text("[broken\n", encoding="utf-8")

            with self.assertRaisesRegex(ConfigError, "failed to parse"):
                load_toml(path)

    def test_filesystem_layer_precedence(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            bmad = root / "_bmad"
            custom = bmad / "custom"
            skill = bmad / "bmm" / "sample-skill"
            custom.mkdir(parents=True)
            skill.mkdir(parents=True)
            (bmad / "config.toml").write_text('[value]\norder = "base-team"\n', encoding="utf-8")
            (bmad / "config.user.toml").write_text('[value]\norder = "base-user"\n', encoding="utf-8")
            (custom / "config.toml").write_text('[value]\norder = "custom-team"\n', encoding="utf-8")
            (custom / "config.user.toml").write_text('[value]\norder = "custom-user"\n', encoding="utf-8")
            (skill / "customize.toml").write_text('[value]\norder = "default"\n', encoding="utf-8")
            (custom / "sample-skill.toml").write_text('[value]\norder = "team"\n', encoding="utf-8")
            (custom / "sample-skill.user.toml").write_text('[value]\norder = "user"\n', encoding="utf-8")

            self.assertEqual(load_central_config(root)["value"]["order"], "custom-user")
            self.assertEqual(load_customization(root, skill)["value"]["order"], "user")


if __name__ == "__main__":
    unittest.main()
