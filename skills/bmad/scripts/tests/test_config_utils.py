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
    undeclared_keys,
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

    def test_missing_optional_layer_is_empty(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "optional.toml"

            self.assertEqual(load_toml(path), {})

    def test_filesystem_layer_precedence(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            bmad = root / "_bmad"
            custom = bmad / "custom"
            skill = bmad / "bmm" / "sample-skill"
            custom.mkdir(parents=True)
            skill.mkdir(parents=True)
            (bmad / "config.toml").write_text('[value]\norder = "base-team"\n', encoding="utf-8")
            (bmad / "config.user.toml").write_text(
                '[value]\norder = "base-user"\nstray = "ignored"\n', encoding="utf-8"
            )
            (custom / "config.toml").write_text('[value]\norder = "custom-team"\n', encoding="utf-8")
            (custom / "config.user.toml").write_text('[value]\norder = "custom-user"\n', encoding="utf-8")
            (skill / "customize.toml").write_text('[value]\norder = "default"\n', encoding="utf-8")
            (custom / "sample-skill.toml").write_text('[value]\norder = "team"\n', encoding="utf-8")
            (custom / "sample-skill.user.toml").write_text('[value]\norder = "user"\n', encoding="utf-8")

            merged = load_central_config(root)
            self.assertEqual(merged["value"]["order"], "custom-user")
            # _bmad/config.user.toml is old-installer debris (setup.py's
            # LEGACY_LEFTOVERS), not a layer. Nothing writes it; nothing reads it.
            self.assertNotIn("stray", merged["value"])
            self.assertEqual(load_customization(root, skill)["value"]["order"], "user")


class UndeclaredKeysTests(unittest.TestCase):
    DEFAULTS = {"workflow": {"message": "shipped", "persistent_facts": ["shipped"], "sizes": {"s": 1}}}

    def test_names_keys_the_defaults_do_not_declare_sorted(self):
        layer = {"workflow": {"mesage": "typo", "message": "ok"}, "agent": {"name": "stray"}}

        self.assertEqual(undeclared_keys(self.DEFAULTS, layer), ["agent.name", "workflow.mesage"])

    def test_an_array_is_one_leaf(self):
        layer = {"workflow": {"persistent_facts": ["added", {"id": "x"}]}}

        self.assertEqual(undeclared_keys(self.DEFAULTS, layer), [])

    def test_a_key_under_a_declared_scalar_is_undeclared(self):
        self.assertEqual(
            undeclared_keys(self.DEFAULTS, {"workflow": {"message": {"nested": "deep"}}}),
            ["workflow.message.nested"],
        )

    def test_an_entry_added_to_a_declared_map_is_undeclared(self):
        self.assertEqual(undeclared_keys(self.DEFAULTS, {"workflow": {"sizes": {"xl": 8}}}), ["workflow.sizes.xl"])


if __name__ == "__main__":
    unittest.main()
